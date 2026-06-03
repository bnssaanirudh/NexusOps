from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from models import EventLog
from schemas import EventLogResponse

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventLogResponse])
async def get_events(
    db: AsyncSession = Depends(get_db),
    machine_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
):
    """Get recent events across all machines or for a specific one."""
    stmt = select(EventLog).order_by(desc(EventLog.timestamp)).limit(limit)
    if machine_id:
        stmt = stmt.where(EventLog.machine_id == machine_id)
    if severity:
        stmt = stmt.where(EventLog.severity == severity)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/machine/{machine_id}", response_model=list[EventLogResponse])
async def get_machine_events(
    machine_id: str,
    db: AsyncSession = Depends(get_db),
    limit: int = Query(30, le=100),
):
    """Get event log for a specific machine."""
    stmt = (
        select(EventLog)
        .where(EventLog.machine_id == machine_id)
        .order_by(desc(EventLog.timestamp))
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()
