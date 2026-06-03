from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import uuid
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/predictive", tags=["predictive"])

@router.get("/predictions/machine/{machine_id}", response_model=List[schemas.PredictionResponse])
async def get_machine_predictions(machine_id: str, limit: int = Query(10, le=100), db: AsyncSession = Depends(get_db)):
    """Get recent predictions for a machine"""
    result = await db.execute(
        select(models.Prediction)
        .where(models.Prediction.machine_id == machine_id)
        .order_by(desc(models.Prediction.timestamp))
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/risk/machine/{machine_id}", response_model=List[schemas.RiskAssessmentResponse])
async def get_machine_risk(machine_id: str, limit: int = Query(10, le=100), db: AsyncSession = Depends(get_db)):
    """Get recent risk assessments for a machine"""
    result = await db.execute(
        select(models.RiskAssessment)
        .where(models.RiskAssessment.machine_id == machine_id)
        .order_by(desc(models.RiskAssessment.timestamp))
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/alerts", response_model=List[schemas.AlertResponse])
async def get_all_alerts(status: str | None = None, limit: int = Query(50, le=200), db: AsyncSession = Depends(get_db)):
    """Get all alerts, optionally filtered by status"""
    query = select(models.Alert).order_by(desc(models.Alert.timestamp)).limit(limit)
    if status:
        query = query.where(models.Alert.status == status)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/alerts/machine/{machine_id}", response_model=List[schemas.AlertResponse])
async def get_machine_alerts(machine_id: str, status: str | None = None, limit: int = Query(20, le=100), db: AsyncSession = Depends(get_db)):
    """Get alerts for a specific machine"""
    query = select(models.Alert).where(models.Alert.machine_id == machine_id).order_by(desc(models.Alert.timestamp)).limit(limit)
    if status:
        query = query.where(models.Alert.status == status)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/alerts/{alert_id}/resolve", response_model=schemas.AlertResponse)
async def resolve_alert(alert_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Mark an alert as resolved"""
    from datetime import datetime
    
    result = await db.execute(select(models.Alert).where(models.Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if alert.status == "Resolved":
        return alert
        
    alert.status = "Resolved"
    alert.resolved_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(alert)
    
    return alert
