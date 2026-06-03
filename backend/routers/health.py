from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from models import Machine, HealthRecord
from schemas import HealthRecordResponse, HealthSummary
from services.digital_twin import digital_twin_store

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=list[HealthSummary])
async def get_all_health_scores(db: AsyncSession = Depends(get_db)):
    """Get the latest health score for every active machine."""
    result = await db.execute(select(Machine).where(Machine.is_active == True))
    machines = result.scalars().all()

    summaries = []
    for machine in machines:
        twin = digital_twin_store.get(machine.machine_id)
        if twin:
            summaries.append(HealthSummary(
                machine_id=machine.machine_id,
                machine_name=machine.name,
                health_score=twin.health_score,
                status=twin.status,
                timestamp=twin.last_updated,
            ))
    return summaries


@router.get("/machine/{machine_id}", response_model=list[HealthRecordResponse])
async def get_machine_health_history(
    machine_id: str,
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, le=500),
):
    """Get health score history for a specific machine."""
    stmt = (
        select(HealthRecord)
        .where(HealthRecord.machine_id == machine_id)
        .order_by(desc(HealthRecord.timestamp))
        .limit(limit)
    )
    result = await db.execute(stmt)
    records = result.scalars().all()
    return list(reversed(records))  # Chronological order


@router.get("/machine/{machine_id}/latest", response_model=HealthRecordResponse)
async def get_machine_latest_health(machine_id: str, db: AsyncSession = Depends(get_db)):
    """Get the most recent health record for a machine."""
    stmt = (
        select(HealthRecord)
        .where(HealthRecord.machine_id == machine_id)
        .order_by(desc(HealthRecord.timestamp))
        .limit(1)
    )
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No health records found")
    return record
