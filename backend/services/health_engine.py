from dataclasses import dataclass
from datetime import datetime


@dataclass
class HealthResult:
    health_score: float
    status: str
    vibration_penalty: float
    temperature_penalty: float
    pressure_penalty: float
    voltage_penalty: float
    rpm_penalty: float


def calculate_health_score(
    temperature: float,
    vibration: float,
    pressure: float,
    voltage: float,
    rpm: float,
    nominal_temperature: float = 65.0,
    nominal_pressure: float = 45.0,
    nominal_vibration: float = 0.10,
    nominal_voltage: float = 220.0,
    nominal_rpm: float = 1500.0,
) -> HealthResult:
    """
    Health Score Engine — calculates a 0–100 score based on sensor deviations.

    Penalty breakdown (max 100 points):
      Vibration   : 0–30 pts  (most critical — bearing/structural)
      Temperature : 0–25 pts  (thermal stress)
      Pressure    : 0–20 pts  (process deviation)
      Voltage     : 0–15 pts  (electrical health)
      RPM         : 0–10 pts  (speed deviation)
    """

    # ── Vibration Penalty (0–30) ─────────────────────────────────────────────
    # Scale: nominal = 0 pts, 3× nominal = 30 pts (linear)
    vib_ratio = vibration / max(nominal_vibration, 0.001)
    vib_penalty = min(30.0, max(0.0, (vib_ratio - 1.0) * 15.0))

    # ── Temperature Penalty (0–25) ───────────────────────────────────────────
    # Below nominal: no penalty. Above: linear up to +30°C = 25 pts
    temp_excess = max(0.0, temperature - nominal_temperature)
    temp_penalty = min(25.0, temp_excess * (25.0 / 30.0))

    # ── Pressure Penalty (0–20) ──────────────────────────────────────────────
    # Deviation from nominal (both directions), ±40% = 20 pts
    press_deviation = abs(pressure - nominal_pressure) / max(nominal_pressure, 0.001)
    press_penalty = min(20.0, press_deviation * 50.0)

    # ── Voltage Penalty (0–15) ───────────────────────────────────────────────
    # Deviation from nominal, ±15% = 15 pts
    volt_deviation = abs(voltage - nominal_voltage) / max(nominal_voltage, 0.001)
    volt_penalty = min(15.0, volt_deviation * 100.0)

    # ── RPM Penalty (0–10) ───────────────────────────────────────────────────
    # Deviation from nominal, ±25% = 10 pts
    rpm_deviation = abs(rpm - nominal_rpm) / max(nominal_rpm, 0.001)
    rpm_penalty = min(10.0, rpm_deviation * 40.0)

    # ── Final Score ──────────────────────────────────────────────────────────
    raw_score = 100.0 - vib_penalty - temp_penalty - press_penalty - volt_penalty - rpm_penalty
    health_score = round(max(0.0, min(100.0, raw_score)), 2)

    # ── Status Classification ─────────────────────────────────────────────────
    if health_score >= 90:
        status = "Healthy"
    elif health_score >= 70:
        status = "Warning"
    elif health_score >= 40:
        status = "Risk"
    else:
        status = "Critical"

    return HealthResult(
        health_score=health_score,
        status=status,
        vibration_penalty=round(vib_penalty, 2),
        temperature_penalty=round(temp_penalty, 2),
        pressure_penalty=round(press_penalty, 2),
        voltage_penalty=round(volt_penalty, 2),
        rpm_penalty=round(rpm_penalty, 2),
    )


def classify_status(health_score: float) -> str:
    if health_score >= 90:
        return "Healthy"
    elif health_score >= 70:
        return "Warning"
    elif health_score >= 40:
        return "Risk"
    return "Critical"
