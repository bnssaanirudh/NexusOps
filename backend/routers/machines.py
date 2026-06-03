from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import Machine, HealthRecord
from schemas import MachineCreate, MachineUpdate, MachineResponse, KPISummary
from services.digital_twin import digital_twin_store
from schemas import DigitalTwinState
from datetime import datetime

router = APIRouter(prefix="/machines", tags=["machines"])


@router.get("", response_model=list[MachineResponse])
async def list_machines(
    db: AsyncSession = Depends(get_db),
    status: Optional[str] = Query(None, description="Filter by status: Healthy|Warning|Risk|Critical"),
    search: Optional[str] = Query(None, description="Search by name or machine_id"),
    active_only: bool = Query(True),
):
    """List all machines with optional filtering."""
    stmt = select(Machine)
    if active_only:
        stmt = stmt.where(Machine.is_active == True)
    if search:
        stmt = stmt.where(
            (Machine.name.ilike(f"%{search}%")) | (Machine.machine_id.ilike(f"%{search}%"))
        )
    result = await db.execute(stmt.order_by(Machine.machine_id))
    machines = result.scalars().all()

    # Filter by health status if requested
    if status:
        filtered = []
        for m in machines:
            twin = digital_twin_store.get(m.machine_id)
            if twin and twin.status == status:
                filtered.append(m)
        return filtered

    return machines


@router.get("/kpi", response_model=KPISummary)
async def get_kpi_summary(db: AsyncSession = Depends(get_db)):
    """Get KPI counts across all machines."""
    stmt = select(Machine).where(Machine.is_active == True)
    result = await db.execute(stmt)
    machines = result.scalars().all()

    counts = {"total": len(machines), "healthy": 0, "warning": 0, "risk": 0, "critical": 0, "offline": 0}
    for m in machines:
        twin = digital_twin_store.get(m.machine_id)
        if twin:
            status = twin.status.lower()
            if status == "healthy":
                counts["healthy"] += 1
            elif status == "warning":
                counts["warning"] += 1
            elif status == "risk":
                counts["risk"] += 1
            elif status == "critical":
                counts["critical"] += 1
        else:
            counts["offline"] += 1
    return counts


@router.get("/twins", response_model=list[DigitalTwinState])
async def get_all_twins():
    """Get all Digital Twin states."""
    return digital_twin_store.get_all()


@router.get("/{machine_id}", response_model=MachineResponse)
async def get_machine(machine_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine).where(Machine.machine_id == machine_id))
    machine = result.scalar_one_or_none()
    if not machine:
        raise HTTPException(status_code=404, detail=f"Machine {machine_id} not found")
    return machine


@router.get("/{machine_id}/twin", response_model=DigitalTwinState)
async def get_machine_twin(machine_id: str):
    """Get the Digital Twin state for a specific machine."""
    twin = digital_twin_store.get(machine_id)
    if not twin:
        raise HTTPException(status_code=404, detail=f"No twin data for machine {machine_id}")
    return twin


@router.post("", response_model=MachineResponse, status_code=201)
async def create_machine(payload: MachineCreate, db: AsyncSession = Depends(get_db)):
    # Check duplicate
    existing = await db.execute(select(Machine).where(Machine.machine_id == payload.machine_id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail=f"Machine {payload.machine_id} already exists")

    machine = Machine(**payload.model_dump())
    db.add(machine)
    await db.commit()
    await db.refresh(machine)

    # Bootstrap Digital Twin
    digital_twin_store.initialize_from_machine(
        machine.machine_id, machine.name, machine.machine_type, machine.location
    )
    return machine


@router.put("/{machine_id}", response_model=MachineResponse)
async def update_machine(machine_id: str, payload: MachineUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine).where(Machine.machine_id == machine_id))
    machine = result.scalar_one_or_none()
    if not machine:
        raise HTTPException(status_code=404, detail=f"Machine {machine_id} not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(machine, field, value)

    await db.commit()
    await db.refresh(machine)
    return machine


@router.delete("/{machine_id}", status_code=204)
async def delete_machine(machine_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine).where(Machine.machine_id == machine_id))
    machine = result.scalar_one_or_none()
    if not machine:
        raise HTTPException(status_code=404, detail=f"Machine {machine_id} not found")

    # Soft delete
    machine.is_active = False
    await db.commit()
    digital_twin_store.remove(machine_id)
