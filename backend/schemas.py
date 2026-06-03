import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


# ─── Machine Schemas ──────────────────────────────────────────────────────────

class MachineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    machine_type: str = Field(..., min_length=1, max_length=50)
    location: Optional[str] = None
    installation_date: date
    nominal_temperature: float = 65.0
    nominal_pressure: float = 45.0
    nominal_vibration: float = 0.10
    nominal_voltage: float = 220.0
    nominal_rpm: float = 1500.0


class MachineCreate(MachineBase):
    machine_id: str = Field(..., min_length=1, max_length=20, pattern=r"^M\d{3,}$")


class MachineUpdate(BaseModel):
    name: Optional[str] = None
    machine_type: Optional[str] = None
    location: Optional[str] = None
    installation_date: Optional[date] = None
    nominal_temperature: Optional[float] = None
    nominal_pressure: Optional[float] = None
    nominal_vibration: Optional[float] = None
    nominal_voltage: Optional[float] = None
    nominal_rpm: Optional[float] = None
    is_active: Optional[bool] = None


class MachineResponse(MachineBase):
    id: uuid.UUID
    machine_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Sensor Schemas ───────────────────────────────────────────────────────────

class SensorReadingBase(BaseModel):
    machine_id: str
    temperature: float
    vibration: float
    pressure: float
    humidity: float
    voltage: float
    current: float
    rpm: float


class SensorReadingCreate(SensorReadingBase):
    timestamp: Optional[datetime] = None


class SensorReadingResponse(SensorReadingBase):
    id: uuid.UUID
    timestamp: datetime

    model_config = {"from_attributes": True}


# ─── Health Schemas ───────────────────────────────────────────────────────────

class HealthRecordResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    timestamp: datetime
    health_score: float
    status: str
    vibration_penalty: float
    temperature_penalty: float
    pressure_penalty: float
    voltage_penalty: float
    rpm_penalty: float

    model_config = {"from_attributes": True}


class HealthSummary(BaseModel):
    machine_id: str
    machine_name: str
    health_score: float
    status: str
    timestamp: datetime


# ─── Event Log Schemas ────────────────────────────────────────────────────────

class EventLogResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    timestamp: datetime
    event_type: str
    severity: str
    description: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    metric: Optional[str] = None

    model_config = {"from_attributes": True}


# ─── Digital Twin Schema ──────────────────────────────────────────────────────

class DigitalTwinState(BaseModel):
    machine_id: str
    machine_name: str
    machine_type: str
    location: Optional[str] = None
    health_score: float
    status: str
    temperature: float
    vibration: float
    pressure: float
    humidity: float
    voltage: float
    current: float
    rpm: float
    last_updated: datetime
    is_active: bool


# ─── WebSocket Message Schemas ────────────────────────────────────────────────

class WSMessage(BaseModel):
    type: str  # "sensor_update" | "health_update" | "event" | "twin_update"
    machine_id: str
    payload: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ─── KPI Summary ─────────────────────────────────────────────────────────────

class KPISummary(BaseModel):
    total: int
    healthy: int
    warning: int
    risk: int
    critical: int
    offline: int

# --- Phase 2: Predictive AI Operations ---

class PredictionResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    timestamp: datetime
    anomaly_score: float
    is_anomaly: bool
    failure_prob_24h: float
    failure_prob_48h: float
    failure_prob_72h: float
    rul_days: float
    shap_values: Optional[dict] = None
    model_config = {"from_attributes": True}

class RiskAssessmentResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    timestamp: datetime
    risk_score: float
    risk_level: str
    model_config = {"from_attributes": True}

class AlertResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    timestamp: datetime
    severity: str
    message: str
    recommendation: Optional[str] = None
    status: str
    model_config = {"from_attributes": True}

class WSPayload(BaseModel):
    machine_id: str
    timestamp: str
    sensor: SensorReadingResponse
    health: HealthRecordResponse
    twin: DigitalTwinState
    events: list[EventLogResponse]
    prediction: Optional[PredictionResponse] = None
    risk: Optional[RiskAssessmentResponse] = None
    alerts: Optional[list[AlertResponse]] = None

# --- Phase 3: Agentic AI Operations ---

class MaintenanceTicketBase(BaseModel):
    machine_id: str
    issue_summary: str
    root_cause: Optional[str] = None
    recommended_action: Optional[str] = None
    priority: str
    assigned_to: Optional[str] = None
    repair_cost_est: Optional[float] = None
    downtime_cost_est: Optional[float] = None

class MaintenanceTicketCreate(MaintenanceTicketBase):
    pass

class MaintenanceTicketResponse(MaintenanceTicketBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class AgentReasoningBase(BaseModel):
    machine_id: str
    agent_name: str
    evidence: str
    conclusion: str
    confidence: Optional[float] = None

class AgentReasoningResponse(AgentReasoningBase):
    id: uuid.UUID
    timestamp: datetime
    model_config = {"from_attributes": True}

class MaintenanceScheduleResponse(BaseModel):
    id: uuid.UUID
    machine_id: str
    ticket_id: Optional[str] = None
    scheduled_time: datetime
    status: str
    created_at: datetime
    model_config = {"from_attributes": True}
