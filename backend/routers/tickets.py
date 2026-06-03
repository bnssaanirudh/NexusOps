from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List

from database import get_db
import models
import schemas
from services.agent_workflow import AgentWorkflow

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.get("", response_model=List[schemas.MaintenanceTicketResponse])
async def list_tickets(status: str = None, limit: int = 100, db: AsyncSession = Depends(get_db)):
    query = select(models.MaintenanceTicket).order_by(desc(models.MaintenanceTicket.created_at)).limit(limit)
    if status:
        query = query.where(models.MaintenanceTicket.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/{ticket_id}/approve", response_model=schemas.MaintenanceTicketResponse)
async def approve_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    workflow = AgentWorkflow(db)
    ticket = await workflow.approve_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.post("/{ticket_id}/reject", response_model=schemas.MaintenanceTicketResponse)
async def reject_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.MaintenanceTicket).where(models.MaintenanceTicket.id == ticket_id))
    ticket = res.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = "Closed"
    
    # Save reasoning
    reasoning = models.AgentReasoning(
        machine_id=ticket.machine_id,
        agent_name="Approval Agent",
        evidence=f"Human rejected maintenance for ticket {ticket_id}.",
        conclusion="Maintenance cancelled. Ticket closed.",
        confidence=1.0
    )
    db.add(reasoning)
    await db.commit()
    
    return ticket
