from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database import get_db
import models
import schemas

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("/reasoning", response_model=list[schemas.AgentReasoningResponse])
async def list_agent_reasoning(limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.AgentReasoning).order_by(desc(models.AgentReasoning.timestamp)).limit(limit))
    return result.scalars().all()

@router.get("/reasoning/machine/{machine_id}", response_model=list[schemas.AgentReasoningResponse])
async def machine_reasoning(machine_id: str, limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.AgentReasoning)
        .where(models.AgentReasoning.machine_id == machine_id)
        .order_by(desc(models.AgentReasoning.timestamp))
        .limit(limit)
    )
    return result.scalars().all()
