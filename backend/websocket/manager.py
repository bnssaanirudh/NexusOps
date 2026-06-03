"""WebSocket Connection Manager — handles all real-time client connections."""
import json
import logging
from datetime import datetime
from typing import Optional
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        # All active connections
        self.active_connections: list[WebSocket] = []
        # Per-machine subscriptions
        self.machine_subscriptions: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, machine_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if machine_id:
            if machine_id not in self.machine_subscriptions:
                self.machine_subscriptions[machine_id] = []
            self.machine_subscriptions[machine_id].append(websocket)
        logger.info(f"WS connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket, machine_id: Optional[str] = None):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if machine_id and machine_id in self.machine_subscriptions:
            if websocket in self.machine_subscriptions[machine_id]:
                self.machine_subscriptions[machine_id].remove(websocket)
        logger.info(f"WS disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Broadcast to ALL connected clients."""
        data = json.dumps(message, default=str)
        dead = []
        for ws in self.active_connections:
            try:
                await ws.send_text(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    async def broadcast_to_machine(self, machine_id: str, message: dict):
        """Broadcast to clients subscribed to a specific machine."""
        data = json.dumps(message, default=str)
        subs = self.machine_subscriptions.get(machine_id, [])
        dead = []
        for ws in subs:
            try:
                await ws.send_text(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, machine_id)

    @property
    def connection_count(self) -> int:
        return len(self.active_connections)


# Singleton
ws_manager = ConnectionManager()
