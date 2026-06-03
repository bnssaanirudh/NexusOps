import uuid
from datetime import date, datetime
from sqlalchemy import String, Float, Boolean, Date, DateTime, Text, CheckConstraint, Index, ForeignKey, Column
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    machine_type: Mapped[str] = mapped_column(String(50), nullable=False)
    location: Mapped[str | None] = mapped_column(String(100))
    installation_date: Mapped[date] = mapped_column(Date, nullable=False)
    nominal_temperature: Mapped[float] = mapped_column(Float, default=65.0)
    nominal_pressure: Mapped[float] = mapped_column(Float, default=45.0)
    nominal_vibration: Mapped[float] = mapped_column(Float, default=0.10)
    nominal_voltage: Mapped[float] = mapped_column(Float, default=220.0)
    nominal_rpm: Mapped[float] = mapped_column(Float, default=1500.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    sensor_readings: Mapped[list["SensorReading"]] = relationship("SensorReading", back_populates="machine", cascade="all, delete-orphan")
    health_records: Mapped[list["HealthRecord"]] = relationship("HealthRecord", back_populates="machine", cascade="all, delete-orphan")
    event_logs: Mapped[list["EventLog"]] = relationship("EventLog", back_populates="machine", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    vibration: Mapped[float] = mapped_column(Float, nullable=False)
    pressure: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    voltage: Mapped[float] = mapped_column(Float, nullable=False)
    current: Mapped[float] = mapped_column(Float, nullable=False)
    rpm: Mapped[float] = mapped_column(Float, nullable=False)

    machine: Mapped["Machine"] = relationship("Machine", back_populates="sensor_readings")

    __table_args__ = (
        Index("idx_sensor_machine_timestamp", "machine_id", "timestamp"),
    )


class HealthRecord(Base):
    __tablename__ = "health_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    health_score: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    vibration_penalty: Mapped[float] = mapped_column(Float, default=0.0)
    temperature_penalty: Mapped[float] = mapped_column(Float, default=0.0)
    pressure_penalty: Mapped[float] = mapped_column(Float, default=0.0)
    voltage_penalty: Mapped[float] = mapped_column(Float, default=0.0)
    rpm_penalty: Mapped[float] = mapped_column(Float, default=0.0)

    machine: Mapped["Machine"] = relationship("Machine", back_populates="health_records")

    __table_args__ = (
        CheckConstraint("status IN ('Healthy', 'Warning', 'Risk', 'Critical')", name="chk_health_status"),
        Index("idx_health_machine_timestamp", "machine_id", "timestamp"),
    )


class EventLog(Base):
    __tablename__ = "event_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="info")
    description: Mapped[str] = mapped_column(Text, nullable=False)
    old_value: Mapped[str | None] = mapped_column(String(100))
    new_value: Mapped[str | None] = mapped_column(String(100))
    metric: Mapped[str | None] = mapped_column(String(50))

    machine: Mapped["Machine"] = relationship("Machine", back_populates="event_logs")

    __table_args__ = (
        CheckConstraint("severity IN ('info', 'warning', 'danger', 'critical')", name="chk_event_severity"),
        Index("idx_event_machine_timestamp", "machine_id", "timestamp"),
    )


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    anomaly_score: Mapped[float] = mapped_column(Float, nullable=False)
    is_anomaly: Mapped[bool] = mapped_column(Boolean, nullable=False)
    failure_prob_24h: Mapped[float] = mapped_column(Float, nullable=False)
    failure_prob_48h: Mapped[float] = mapped_column(Float, nullable=False)
    failure_prob_72h: Mapped[float] = mapped_column(Float, nullable=False)
    rul_days: Mapped[float] = mapped_column(Float, nullable=False)
    
    from sqlalchemy.dialects.postgresql import JSONB
    shap_values: Mapped[dict | None] = mapped_column(JSONB)

    __table_args__ = (
        Index("idx_predictions_machine_timestamp", "machine_id", "timestamp"),
    )


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)

    __table_args__ = (
        CheckConstraint("risk_level IN ('Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk')", name="chk_risk_level"),
        Index("idx_risk_machine_timestamp", "machine_id", "timestamp"),
    )


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id: Mapped[str] = mapped_column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    recommendation = Column(String, nullable=True)
    status = Column(String, default="Active")
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("severity IN ('Info', 'Warning', 'High Risk', 'Critical')", name="chk_alert_severity"),
        CheckConstraint("status IN ('Active', 'Resolved')", name="chk_alert_status"),
        Index("idx_alerts_machine_status", "machine_id", "status"),
        Index("idx_alerts_timestamp", "timestamp"),
    )

# --- Phase 3: Agentic AI Operations ---

class MaintenanceTicket(Base):
    __tablename__ = "maintenance_tickets"
    id = Column(String(20), primary_key=True)
    machine_id = Column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    issue_summary = Column(String, nullable=False)
    root_cause = Column(String, nullable=True)
    recommended_action = Column(String, nullable=True)
    priority = Column(String(20), nullable=False)
    status = Column(String(20), default="Pending Approval")
    assigned_to = Column(String(50), nullable=True)
    repair_cost_est = Column(Float, nullable=True)
    downtime_cost_est = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AgentReasoning(Base):
    __tablename__ = "agent_reasoning"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    machine_id = Column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String(50), nullable=False)
    evidence = Column(String, nullable=False)
    conclusion = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    machine_id = Column(String(20), ForeignKey("machines.machine_id", ondelete="CASCADE"), nullable=False)
    ticket_id = Column(String(20), ForeignKey("maintenance_tickets.id", ondelete="CASCADE"), nullable=True)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="Scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
