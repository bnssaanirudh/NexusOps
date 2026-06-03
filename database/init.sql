-- Industrial IoT Monitoring Platform
-- Phase 1 Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- MACHINES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    installation_date DATE NOT NULL,
    nominal_temperature FLOAT DEFAULT 65.0,
    nominal_pressure FLOAT DEFAULT 45.0,
    nominal_vibration FLOAT DEFAULT 0.10,
    nominal_voltage FLOAT DEFAULT 220.0,
    nominal_rpm FLOAT DEFAULT 1500.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SENSOR READINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    temperature FLOAT NOT NULL,
    vibration FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    voltage FLOAT NOT NULL,
    current FLOAT NOT NULL,
    rpm FLOAT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_machine_id ON sensor_readings(machine_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_machine_timestamp ON sensor_readings(machine_id, timestamp DESC);

-- ============================================================
-- HEALTH RECORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    health_score FLOAT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Healthy', 'Warning', 'Risk', 'Critical')),
    vibration_penalty FLOAT DEFAULT 0,
    temperature_penalty FLOAT DEFAULT 0,
    pressure_penalty FLOAT DEFAULT 0,
    voltage_penalty FLOAT DEFAULT 0,
    rpm_penalty FLOAT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_health_records_machine_id ON health_records(machine_id);
CREATE INDEX IF NOT EXISTS idx_health_records_timestamp ON health_records(timestamp DESC);

-- ============================================================
-- EVENT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
    description TEXT NOT NULL,
    old_value VARCHAR(100),
    new_value VARCHAR(100),
    metric VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_event_logs_machine_id ON event_logs(machine_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_timestamp ON event_logs(timestamp DESC);

-- ============================================================
-- PREDICTIONS TABLE (Phase 2 ML)
-- ============================================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    anomaly_score FLOAT NOT NULL,
    is_anomaly BOOLEAN NOT NULL,
    failure_prob_24h FLOAT NOT NULL,
    failure_prob_48h FLOAT NOT NULL,
    failure_prob_72h FLOAT NOT NULL,
    rul_days FLOAT NOT NULL,
    shap_values JSONB
);

CREATE INDEX IF NOT EXISTS idx_predictions_machine_timestamp ON predictions(machine_id, timestamp DESC);

-- ============================================================
-- RISK ASSESSMENTS TABLE (Phase 2 ML)
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    risk_score FLOAT NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'))
);

CREATE INDEX IF NOT EXISTS idx_risk_machine_timestamp ON risk_assessments(machine_id, timestamp DESC);

-- ============================================================
-- ALERTS TABLE (Phase 2 ML)
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Info', 'Warning', 'High Risk', 'Critical')),
    message TEXT NOT NULL,
    recommendation TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Resolved')),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_alerts_machine_status ON alerts(machine_id, status);

-- Phase 3: Agentic AI Operations Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id VARCHAR(20) PRIMARY KEY,
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    issue_summary TEXT NOT NULL,
    root_cause TEXT,
    recommended_action TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) DEFAULT 'Pending Approval' CHECK (status IN ('Open', 'Pending Approval', 'Approved', 'Scheduled', 'In Progress', 'Completed', 'Closed')),
    assigned_to VARCHAR(50),
    repair_cost_est DECIMAL(10,2),
    downtime_cost_est DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_reasoning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    agent_name VARCHAR(50) NOT NULL,
    evidence TEXT NOT NULL,
    conclusion TEXT NOT NULL,
    confidence FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id VARCHAR(20) NOT NULL REFERENCES machines(machine_id) ON DELETE CASCADE,
    ticket_id VARCHAR(20) REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_machine_status ON maintenance_tickets(machine_id, status);
CREATE INDEX IF NOT EXISTS idx_reasoning_machine_agent ON agent_reasoning(machine_id, agent_name);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);

-- ============================================================
-- SEED DATA — 5 Virtual Machines
INSERT INTO machines (machine_id, name, machine_type, location, installation_date, nominal_temperature, nominal_pressure, nominal_vibration, nominal_voltage, nominal_rpm)
VALUES
    ('M001', 'Compressor Alpha', 'Air Compressor',    'Plant A - Bay 1', '2022-03-15', 65.0, 45.0, 0.10, 220.0, 1500.0),
    ('M002', 'Pump Station Beta',  'Hydraulic Pump',   'Plant A - Bay 2', '2021-07-20', 55.0, 60.0, 0.08, 220.0, 1200.0),
    ('M003', 'Motor Gamma',        'Electric Motor',   'Plant B - Bay 1', '2023-01-10', 70.0, 35.0, 0.12, 380.0, 3000.0),
    ('M004', 'Turbine Delta',      'Steam Turbine',    'Plant B - Bay 3', '2020-11-05', 85.0, 80.0, 0.15, 440.0, 3600.0),
    ('M005', 'Conveyor Epsilon',   'Belt Conveyor',    'Plant C - Bay 1', '2023-06-01', 45.0, 25.0, 0.06, 220.0,  900.0)
ON CONFLICT (machine_id) DO NOTHING;

-- Seed initial event log
INSERT INTO event_logs (machine_id, event_type, severity, description)
VALUES
    ('M001', 'system_start', 'info', 'Machine monitoring initialized'),
    ('M002', 'system_start', 'info', 'Machine monitoring initialized'),
    ('M003', 'system_start', 'info', 'Machine monitoring initialized'),
    ('M004', 'system_start', 'info', 'Machine monitoring initialized'),
    ('M005', 'system_start', 'info', 'Machine monitoring initialized');
