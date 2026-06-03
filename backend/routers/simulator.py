from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict

from database import get_db
from services.fault_simulator import (
    inject_fault, reset_fault, get_all_active_faults,
    simulate_what_if, FAULT_SCENARIOS
)
from services.digital_twin import digital_twin_store

router = APIRouter(prefix="/simulator", tags=["simulator"])


class FaultInjectRequest(BaseModel):
    machine_id: str
    scenario: str  # e.g. "bearing_wear", "motor_overheating"
    custom_overrides: Optional[Dict[str, float]] = None


class WhatIfRequest(BaseModel):
    machine_id: str
    modifications: Dict[str, float]  # e.g. {"vibration": +0.5, "temperature": +15}


@router.get("/scenarios")
async def list_scenarios():
    """List all available fault injection scenarios."""
    return {
        "scenarios": [
            {"key": k, "name": v["name"], "description": v["description"],
             "icon": v["icon"], "color": v["color"]}
            for k, v in FAULT_SCENARIOS.items()
        ]
    }


@router.get("/active-faults")
async def active_faults():
    """Return all currently injected faults."""
    return get_all_active_faults()


@router.post("/inject")
async def inject(req: FaultInjectRequest):
    """Inject a fault scenario into a machine's sensor stream."""
    result = inject_fault(req.machine_id, req.scenario, req.custom_overrides)
    return result


@router.post("/reset/{machine_id}")
async def reset(machine_id: str):
    """Remove fault overrides for a machine."""
    return reset_fault(machine_id)


@router.post("/what-if")
async def what_if_simulation(req: WhatIfRequest, db: AsyncSession = Depends(get_db)):
    """Run a what-if scenario simulation without modifying live data."""
    # Get current sensor values from the digital twin
    twin = digital_twin_store.get(req.machine_id)
    if twin:
        current_reading = {
            "temperature": twin.temperature,
            "vibration": twin.vibration,
            "pressure": twin.pressure,
            "humidity": twin.humidity,
            "voltage": twin.voltage,
            "current": twin.current,
            "rpm": twin.rpm,
        }
    else:
        # Default baseline if twin not found
        current_reading = {
            "temperature": 65.0, "vibration": 0.10, "pressure": 45.0,
            "humidity": 50.0, "voltage": 220.0, "current": 10.0, "rpm": 1500.0,
        }

    result = simulate_what_if(req.machine_id, current_reading, req.modifications)
    return result


@router.get("/forecast/{machine_id}")
async def failure_timeline_forecast(machine_id: str):
    """
    Generate a day-by-day health degradation forecast for a machine.
    Uses current health score and simulates degradation based on active faults.
    """
    twin = digital_twin_store.get(machine_id)
    if not twin:
        return {"error": "Machine twin not found"}

    current_health = twin.health_score
    # Determine degradation rate based on status
    daily_decay = {
        "Healthy": 0.5,
        "Warning": 1.8,
        "Risk": 4.5,
        "Critical": 9.0,
    }.get(twin.status, 1.0)

    timeline = []
    health = current_health
    for day in range(14):
        if day == 0:
            label = "Today"
        elif day == 1:
            label = "Tomorrow"
        else:
            label = f"Day {day}"

        # Determine status thresholds
        if health >= 80:
            status = "Healthy"
            color = "#10b981"
        elif health >= 60:
            status = "Warning"
            color = "#f59e0b"
        elif health >= 40:
            status = "Risk"
            color = "#f97316"
        else:
            status = "Critical"
            color = "#ef4444"

        timeline.append({
            "day": day,
            "label": label,
            "health_score": round(health, 1),
            "status": status,
            "color": color,
        })

        # Apply decay
        health = max(0.0, health - daily_decay)
        # Acceleration as degradation progresses
        daily_decay *= 1.05

    return {
        "machine_id": machine_id,
        "machine_name": twin.machine_name,
        "current_health": round(twin.health_score, 1),
        "current_status": twin.status,
        "timeline": timeline,
    }
