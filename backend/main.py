"""
Industrial IoT Monitoring Platform — Phase 1
FastAPI Backend with WebSocket real-time streaming
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text

from config import settings
from database import AsyncSessionLocal, init_db
from models import Machine
from routers import machines, sensors, health, events, predictive, agents, tickets, copilot, simulator, reports
from services.digital_twin import digital_twin_store
from websocket.manager import ws_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB and seed Digital Twins on startup."""
    logger.info("🚀 Starting Industrial IoT Platform...")

    # Ensure tables exist
    await init_db()

    # Bootstrap Digital Twins for all existing machines
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Machine).where(Machine.is_active == True))
        machines_list = result.scalars().all()
        for machine in machines_list:
            digital_twin_store.initialize_from_machine(
                machine.machine_id, machine.name, machine.machine_type, machine.location
            )
        logger.info(f"✅ Bootstrapped {len(machines_list)} Digital Twins")

    yield

    logger.info("🛑 Shutting down...")


app = FastAPI(
    title="SentinelAI — Autonomous Industrial Intelligence Platform",
    description="Phase 4 — Hackathon-Ready Autonomous Industrial Reliability Platform",
    version="4.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(machines.router)
app.include_router(sensors.router)
app.include_router(health.router)
app.include_router(events.router)
app.include_router(predictive.router)
app.include_router(agents.router)
app.include_router(tickets.router)
app.include_router(copilot.router)
app.include_router(simulator.router)
app.include_router(reports.router)


# ── WebSocket Endpoint ────────────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_global(websocket: WebSocket):
    """Global WebSocket — receives all machine updates."""
    await ws_manager.connect(websocket)
    try:
        # Send current Digital Twin state immediately on connect
        twins = digital_twin_store.get_all()
        if twins:
            import json
            await websocket.send_text(json.dumps({
                "type": "initial_state",
                "payload": [t.model_dump() for t in twins],
            }, default=str))
        while True:
            # Keep connection alive — listen for ping/pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@app.websocket("/ws/machine/{machine_id}")
async def websocket_machine(websocket: WebSocket, machine_id: str):
    """Per-machine WebSocket — receives updates only for a specific machine."""
    await ws_manager.connect(websocket, machine_id=machine_id)
    try:
        # Send current state immediately
        twin = digital_twin_store.get(machine_id)
        if twin:
            import json
            await websocket.send_text(json.dumps({
                "type": "initial_state",
                "payload": twin.model_dump(),
            }, default=str))
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, machine_id=machine_id)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["system"])
async def root():
    return {
        "service": "Industrial IoT Monitoring Platform",
        "phase": 1,
        "status": "operational",
        "websocket": "ws://localhost:8000/ws",
        "docs": "/docs",
    }


@app.get("/health-check", tags=["system"])
async def health_check():
    return {
        "status": "healthy",
        "twins_loaded": digital_twin_store.count,
        "ws_connections": ws_manager.connection_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
