"""Digital Twin Service — maintains in-memory latest state for each machine."""
from datetime import datetime
from typing import Optional
from schemas import DigitalTwinState


class DigitalTwinStore:
    """Thread-safe (asyncio-safe) in-memory store of the latest machine state."""

    def __init__(self):
        self._twins: dict[str, DigitalTwinState] = {}

    def update(self, state: DigitalTwinState) -> None:
        self._twins[state.machine_id] = state

    def get(self, machine_id: str) -> Optional[DigitalTwinState]:
        return self._twins.get(machine_id)

    def get_all(self) -> list[DigitalTwinState]:
        return list(self._twins.values())

    def remove(self, machine_id: str) -> None:
        self._twins.pop(machine_id, None)

    def initialize_from_machine(
        self,
        machine_id: str,
        machine_name: str,
        machine_type: str,
        location: Optional[str],
    ) -> DigitalTwinState:
        """Bootstrap a twin with default sensor values if not yet seen."""
        if machine_id not in self._twins:
            state = DigitalTwinState(
                machine_id=machine_id,
                machine_name=machine_name,
                machine_type=machine_type,
                location=location,
                health_score=100.0,
                status="Healthy",
                temperature=25.0,
                vibration=0.0,
                pressure=0.0,
                humidity=50.0,
                voltage=220.0,
                current=0.0,
                rpm=0.0,
                last_updated=datetime.utcnow(),
                is_active=True,
            )
            self._twins[machine_id] = state
        return self._twins[machine_id]

    @property
    def count(self) -> int:
        return len(self._twins)


# Singleton instance shared across the app
digital_twin_store = DigitalTwinStore()
