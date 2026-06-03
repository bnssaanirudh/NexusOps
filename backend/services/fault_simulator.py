"""
Phase 4 — What-If Scenario Simulator & Fault Injection Store
Allows engineers to simulate modified parameters before applying them,
and stores active fault overrides that the sensor loop uses.
"""
import threading
from typing import Dict, Any, Optional
from services.ml_engine import ml_engine
from services.health_engine import calculate_health_score
import pandas as pd

# ─── In-memory Fault Override Store ─────────────────────────────────────────
# machine_id -> dict of overridden sensor values
_fault_store: Dict[str, Dict[str, Any]] = {}
_store_lock = threading.Lock()

FAULT_SCENARIOS = {
    "bearing_wear": {
        "name": "Bearing Wear",
        "description": "Simulates progressive bearing degradation",
        "icon": "⚙️",
        "color": "#f97316",
        "overrides": {
            "vibration": 2.8,
            "temperature": 82.0,
            "rpm": 1380.0,
        }
    },
    "motor_overheating": {
        "name": "Motor Overheating",
        "description": "Simulates thermal runaway in the motor stator",
        "icon": "🌡️",
        "color": "#ef4444",
        "overrides": {
            "temperature": 105.0,
            "current": 18.5,
            "vibration": 0.95,
        }
    },
    "pressure_leak": {
        "name": "Pressure Leakage",
        "description": "Simulates a seal failure causing pressure drop",
        "icon": "💧",
        "color": "#3b82f6",
        "overrides": {
            "pressure": 22.0,
            "vibration": 0.65,
            "current": 14.0,
        }
    },
    "voltage_instability": {
        "name": "Voltage Instability",
        "description": "Simulates power supply fluctuations",
        "icon": "⚡",
        "color": "#eab308",
        "overrides": {
            "voltage": 185.0,
            "current": 16.0,
            "temperature": 79.0,
        }
    },
    "sensor_failure": {
        "name": "Sensor Failure",
        "description": "Simulates corrupted sensor readings",
        "icon": "📡",
        "color": "#8b5cf6",
        "overrides": {
            "vibration": 9.9,
            "pressure": 0.1,
            "temperature": 999.0,
        }
    },
}


def inject_fault(machine_id: str, scenario_key: str, custom_overrides: dict = None) -> Dict[str, Any]:
    """Inject a fault scenario into a machine's sensor stream."""
    with _store_lock:
        if custom_overrides:
            overrides = custom_overrides
            scenario_name = "Custom Scenario"
        elif scenario_key in FAULT_SCENARIOS:
            overrides = FAULT_SCENARIOS[scenario_key]["overrides"].copy()
            scenario_name = FAULT_SCENARIOS[scenario_key]["name"]
        else:
            return {"error": f"Unknown scenario: {scenario_key}"}

        _fault_store[machine_id] = {
            "scenario": scenario_key,
            "scenario_name": scenario_name,
            "overrides": overrides,
        }
        return {"machine_id": machine_id, "scenario": scenario_name, "active": True, "overrides": overrides}


def reset_fault(machine_id: str) -> Dict[str, Any]:
    """Remove fault overrides for a machine, returning it to normal operation."""
    with _store_lock:
        removed = _fault_store.pop(machine_id, None)
        return {"machine_id": machine_id, "reset": removed is not None}


def get_active_fault(machine_id: str) -> Optional[Dict[str, Any]]:
    """Return active fault info for a machine, or None."""
    return _fault_store.get(machine_id)


def get_all_active_faults() -> Dict[str, Any]:
    """Return all currently active faults."""
    return dict(_fault_store)


def apply_fault_overrides(machine_id: str, reading: Dict[str, float]) -> Dict[str, float]:
    """Apply active fault overrides on top of a sensor reading."""
    fault = _fault_store.get(machine_id)
    if not fault:
        return reading
    modified = reading.copy()
    modified.update(fault["overrides"])
    return modified


# ─── What-If Simulation Engine ────────────────────────────────────────────────

BASELINE_SENSOR = {
    "temperature": 65.0, "vibration": 0.10, "pressure": 45.0,
    "humidity": 50.0, "voltage": 220.0, "current": 10.0, "rpm": 1500.0,
}

def simulate_what_if(
    machine_id: str,
    current_reading: Dict[str, float],
    modifications: Dict[str, float],
) -> Dict[str, Any]:
    """
    Run the ML engine on a modified sensor set without writing to the DB.
    Returns before/after comparison.
    """
    # Current state
    current_features = ml_engine.engineer_features(current_reading, [])
    current_health_result = calculate_health_score(
        temperature=current_reading.get("temperature", 65.0),
        vibration=current_reading.get("vibration", 0.10),
        pressure=current_reading.get("pressure", 45.0),
        voltage=current_reading.get("voltage", 220.0),
        rpm=current_reading.get("rpm", 1500.0),
    )
    current_health = current_health_result.health_score
    current_pred = ml_engine.predict(current_features, current_health)

    # Simulated state (apply % or absolute modifications)
    simulated_reading = current_reading.copy()
    for key, delta in modifications.items():
        if key in simulated_reading:
            simulated_reading[key] = simulated_reading[key] + delta

    sim_features = ml_engine.engineer_features(simulated_reading, [current_reading])
    sim_health_result = calculate_health_score(
        temperature=simulated_reading.get("temperature", 65.0),
        vibration=simulated_reading.get("vibration", 0.10),
        pressure=simulated_reading.get("pressure", 45.0),
        voltage=simulated_reading.get("voltage", 220.0),
        rpm=simulated_reading.get("rpm", 1500.0),
    )
    sim_health = sim_health_result.health_score
    sim_pred = ml_engine.predict(sim_features, sim_health)

    # Life extension/reduction in days
    rul_delta = round(sim_pred["rul_days"] - current_pred["rul_days"], 1)

    return {
        "machine_id": machine_id,
        "current": {
            "health_score": round(current_health, 1),
            "failure_prob_24h": round(current_pred["failure_prob_24h"] * 100, 1),
            "rul_days": round(current_pred["rul_days"], 1),
            "status": current_health_result.status,
            "sensor_values": current_reading,
        },
        "simulated": {
            "health_score": round(sim_health, 1),
            "failure_prob_24h": round(sim_pred["failure_prob_24h"] * 100, 1),
            "rul_days": round(sim_pred["rul_days"], 1),
            "status": sim_health_result.status,
            "sensor_values": simulated_reading,
        },
        "delta": {
            "health_score": round(sim_health - current_health, 1),
            "failure_prob_24h": round((sim_pred["failure_prob_24h"] - current_pred["failure_prob_24h"]) * 100, 1),
            "rul_days": rul_delta,
        },
        "modifications": modifications,
    }
