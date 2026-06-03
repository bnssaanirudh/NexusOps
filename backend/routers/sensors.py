from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime

from database import get_db
import models
import schemas
from services.health_engine import calculate_health_score
from services.digital_twin import digital_twin_store
from services.ml_engine import ml_engine
from services.alert_engine import alert_engine
from services.fault_simulator import apply_fault_overrides
from websocket.manager import ws_manager

router = APIRouter(prefix="/sensors", tags=["sensors"])

@router.post("/ingest")
async def ingest_sensor_data(data: schemas.SensorReadingCreate, db: AsyncSession = Depends(get_db)):
    """
    Ingest a new sensor reading. This is the main pipeline:
    1. Apply fault overrides (Phase 4 Fault Injection)
    2. Save reading
    3. Calculate health & events
    4. Run ML Pipeline (Predictions, Risk, SHAP)
    5. Generate Alerts
    6. Trigger Agent Workflow
    7. Update Digital Twin
    8. Broadcast via WebSockets
    """
    # Phase 4: Apply fault overrides from the simulator
    raw_data = data.model_dump()
    modified_data = apply_fault_overrides(data.machine_id, raw_data)
    
    # Reconstruct data with overrides applied
    for key in ["temperature", "vibration", "pressure", "humidity", "voltage", "current", "rpm"]:
        if key in modified_data:
            setattr(data, key, modified_data[key])

    # 1. Save reading
    ts = data.timestamp or datetime.utcnow()
    new_reading = models.SensorReading(
        machine_id=data.machine_id,
        timestamp=ts,
        temperature=data.temperature,
        vibration=data.vibration,
        pressure=data.pressure,
        humidity=data.humidity,
        voltage=data.voltage,
        current=data.current,
        rpm=data.rpm
    )
    db.add(new_reading)
    
    # 2. Fetch nominals & Calculate Health
    machine_res = await db.execute(select(models.Machine).where(models.Machine.machine_id == data.machine_id))
    machine = machine_res.scalar_one_or_none()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
        
    nominals = {
        "nominal_temperature": machine.nominal_temperature,
        "nominal_pressure": machine.nominal_pressure,
        "nominal_vibration": machine.nominal_vibration,
        "nominal_voltage": machine.nominal_voltage,
        "nominal_rpm": machine.nominal_rpm
    }
    
    health_result = calculate_health_score(
        temperature=data.temperature,
        vibration=data.vibration,
        pressure=data.pressure,
        voltage=data.voltage,
        rpm=data.rpm,
        **nominals
    )
    health_score = health_result.health_score
    
    # Save Health
    new_health = models.HealthRecord(
        machine_id=data.machine_id,
        timestamp=ts,
        health_score=health_result.health_score,
        status=health_result.status,
        vibration_penalty=health_result.vibration_penalty,
        temperature_penalty=health_result.temperature_penalty,
        pressure_penalty=health_result.pressure_penalty,
        voltage_penalty=health_result.voltage_penalty,
        rpm_penalty=health_result.rpm_penalty
    )
    db.add(new_health)
    
    db_events = []
    
    await db.flush() # flush to get IDs for events but don't commit yet

    # 3. ML Pipeline
    # Get last 10 readings for rolling features
    history_res = await db.execute(
        select(models.SensorReading)
        .where(models.SensorReading.machine_id == data.machine_id)
        .order_by(desc(models.SensorReading.timestamp))
        .limit(10)
    )
    history_recs = history_res.scalars().all()
    # Reverse to chronological
    history = []
    for r in reversed(history_recs):
        history.append({
            "temperature": r.temperature,
            "vibration": r.vibration,
            "pressure": r.pressure,
            "humidity": r.humidity,
            "voltage": r.voltage,
            "current": r.current,
            "rpm": r.rpm
        })
    
    # Run Inference
    features_df = ml_engine.engineer_features(data.model_dump(), history)
    pred_res = ml_engine.predict(features_df, health_score)
    
    # Save Prediction
    new_pred = models.Prediction(
        machine_id=data.machine_id,
        timestamp=ts,
        anomaly_score=pred_res["anomaly_score"],
        is_anomaly=pred_res["is_anomaly"],
        failure_prob_24h=pred_res["failure_prob_24h"],
        failure_prob_48h=pred_res["failure_prob_48h"],
        failure_prob_72h=pred_res["failure_prob_72h"],
        rul_days=pred_res["rul_days"],
        shap_values=pred_res["shap_values"]
    )
    db.add(new_pred)

    # 4. Risk & Alerts
    risk_score, risk_level = alert_engine.calculate_risk(
        pred_res["failure_prob_24h"], 
        pred_res["anomaly_score"], 
        health_score
    )
    
    new_risk = models.RiskAssessment(
        machine_id=data.machine_id,
        timestamp=ts,
        risk_score=risk_score,
        risk_level=risk_level
    )
    db.add(new_risk)
    
    # Generate Alerts
    alert_dicts = alert_engine.generate_alerts(
        data.machine_id, 
        risk_level, 
        pred_res["shap_values"], 
        pred_res["failure_prob_24h"]
    )
    
    db_alerts = []
    for ad in alert_dicts:
        # Check if an active alert with same severity exists to avoid spam
        existing = await db.execute(
            select(models.Alert).where(
                models.Alert.machine_id == data.machine_id,
                models.Alert.status == 'Active',
                models.Alert.severity == ad['severity']
            )
        )
        if not existing.first():
            db_alert = models.Alert(machine_id=data.machine_id, timestamp=ts, **ad)
            db.add(db_alert)
            db_alerts.append(db_alert)
            
    # Phase 3: Trigger Agentic Workflow if High Risk
    from services.agent_workflow import AgentWorkflow
    agent_runner = AgentWorkflow(db)
    
    # Check if a pending ticket already exists to avoid spamming the workflow
    existing_ticket = await db.execute(
        select(models.MaintenanceTicket).where(
            models.MaintenanceTicket.machine_id == data.machine_id,
            models.MaintenanceTicket.status.in_(["Open", "Pending Approval"])
        )
    )
    if not existing_ticket.first():
        await agent_runner.run_workflow(
            machine_id=data.machine_id,
            sensor_data=data.model_dump(),
            shap_values=pred_res["shap_values"],
            failure_prob=pred_res["failure_prob_24h"]
        )

    await db.commit()
    
    # 5. Update Digital Twin
    status = "Normal"
    if health_score < 40 or pred_res["is_anomaly"]:
        status = "Critical"
    elif health_score < 70 or risk_level in ["Medium Risk", "High Risk"]:
        status = "Warning"
        
    twin_state = schemas.DigitalTwinState(
        machine_id=machine.machine_id,
        machine_name=machine.name,
        machine_type=machine.machine_type,
        location=machine.location,
        temperature=data.temperature,
        pressure=data.pressure,
        vibration=data.vibration,
        voltage=data.voltage,
        current=data.current,
        rpm=data.rpm,
        humidity=data.humidity,
        health_score=health_score,
        status=status,
        is_active=machine.is_active,
        last_updated=str(ts)
    )
    digital_twin_store.update(twin_state)
    
    # 6. WebSocket Broadcast
    sensor_dict = data.model_dump(exclude={"timestamp"})
    sensor_res = schemas.SensorReadingResponse(id=new_reading.id, timestamp=ts, **sensor_dict)
    health_res = schemas.HealthRecordResponse(
        id=new_health.id, 
        machine_id=data.machine_id, 
        timestamp=ts, 
        health_score=health_result.health_score,
        status=health_result.status,
        vibration_penalty=health_result.vibration_penalty,
        temperature_penalty=health_result.temperature_penalty,
        pressure_penalty=health_result.pressure_penalty,
        voltage_penalty=health_result.voltage_penalty,
        rpm_penalty=health_result.rpm_penalty
    )
    events_res = [schemas.EventLogResponse(id=e.id, machine_id=e.machine_id, timestamp=e.timestamp, event_type=e.event_type, severity=e.severity, description=e.description, metric=e.metric, old_value=e.old_value, new_value=e.new_value) for e in db_events]
    pred_res_ws = schemas.PredictionResponse(id=new_pred.id, machine_id=data.machine_id, timestamp=ts, **pred_res)
    risk_res_ws = schemas.RiskAssessmentResponse(id=new_risk.id, machine_id=data.machine_id, timestamp=ts, risk_score=risk_score, risk_level=risk_level)
    alerts_res_ws = [schemas.AlertResponse(id=a.id, machine_id=a.machine_id, timestamp=a.timestamp, severity=a.severity, message=a.message, recommendation=a.recommendation, status=a.status) for a in db_alerts]
    
    payload = schemas.WSPayload(
        machine_id=data.machine_id,
        timestamp=str(ts),
        sensor=sensor_res,
        health=health_res,
        twin=twin_state,
        events=events_res,
        prediction=pred_res_ws,
        risk=risk_res_ws,
        alerts=alerts_res_ws
    )
    
    await ws_manager.broadcast_to_machine(data.machine_id, payload)
    
    return {"status": "ok", "health_score": health_score, "is_anomaly": pred_res["is_anomaly"], "alerts_generated": len(db_alerts)}

@router.get("", response_model=list[schemas.SensorReadingResponse])
async def list_sensors(limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.SensorReading).order_by(desc(models.SensorReading.timestamp)).limit(limit))
    return result.scalars().all()

@router.get("/machine/{machine_id}", response_model=list[schemas.SensorReadingResponse])
async def list_machine_sensors(machine_id: str, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.SensorReading).where(models.SensorReading.machine_id == machine_id).order_by(desc(models.SensorReading.timestamp)).limit(limit)
    )
    return result.scalars().all()
