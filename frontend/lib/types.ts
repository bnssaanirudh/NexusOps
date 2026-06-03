// Shared TypeScript types for the Industrial IoT Dashboard

export type MachineStatus = "Healthy" | "Warning" | "Risk" | "Critical";

export interface Machine {
  id: string;
  machine_id: string;
  name: string;
  machine_type: string;
  location: string | null;
  installation_date: string;
  nominal_temperature: number;
  nominal_pressure: number;
  nominal_vibration: number;
  nominal_voltage: number;
  nominal_rpm: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  machine_id: string;
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
  humidity: number;
  voltage: number;
  current: number;
  rpm: number;
}

export interface HealthRecord {
  id: string;
  machine_id: string;
  timestamp: string;
  health_score: number;
  status: MachineStatus;
  vibration_penalty: number;
  temperature_penalty: number;
  pressure_penalty: number;
  voltage_penalty: number;
  rpm_penalty: number;
}

// --- Phase 2: Predictive & ML Types ---

export interface PredictionState {
  id: string;
  machine_id: string;
  timestamp: string;
  anomaly_score: number;
  is_anomaly: boolean;
  failure_prob_24h: number;
  failure_prob_48h: number;
  failure_prob_72h: number;
  rul_days: number;
  shap_values: Record<string, number> | null;
}

export interface RiskAssessment {
  id: string;
  machine_id: string;
  timestamp: string;
  risk_score: number;
  risk_level: "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";
}

export interface Alert {
  id: string;
  machine_id: string;
  timestamp: string;
  severity: "Info" | "Warning" | "High Risk" | "Critical";
  message: string;
  recommendation: string | null;
  status: "Active" | "Resolved";
  resolved_at: string | null;
}

export interface HealthSummary {
  machine_id: string;
  machine_name: string;
  health_score: number;
  status: MachineStatus;
  timestamp: string;
}

export interface EventLog {
  id: string;
  machine_id: string;
  timestamp: string;
  event_type: string;
  severity: "info" | "warning" | "danger" | "critical";
  description: string;
  old_value: string | null;
  new_value: string | null;
  metric: string | null;
}

export interface DigitalTwinState {
  machine_id: string;
  machine_name: string;
  machine_type: string;
  location: string | null;
  health_score: number;
  status: MachineStatus;
  temperature: number;
  vibration: number;
  pressure: number;
  humidity: number;
  voltage: number;
  current: number;
  rpm: number;
  last_updated: string;
  is_active: boolean;
}

export interface KPISummary {
  total: number;
  healthy: number;
  warning: number;
  risk: number;
  critical: number;
  offline: number;
}

export interface MachineCreate {
  machine_id: string;
  name: string;
  machine_type: string;
  location?: string;
  installation_date: string;
  nominal_temperature?: number;
  nominal_pressure?: number;
  nominal_vibration?: number;
  nominal_voltage?: number;
  nominal_rpm?: number;
}

export interface MachineUpdate {
  name?: string;
  machine_type?: string;
  location?: string;
  installation_date?: string;
  nominal_temperature?: number;
  nominal_pressure?: number;
  nominal_vibration?: number;
  nominal_voltage?: number;
  nominal_rpm?: number;
  is_active?: boolean;
}

// WebSocket message types
export interface WSMessage {
  type: "sensor_update" | "initial_state" | "event";
  machine_id?: string;
  payload: WSPayload | DigitalTwinState[] | DigitalTwinState;
  timestamp?: string;
}

export interface WSPayload {
  sensor: Omit<SensorReading, "id" | "machine_id" | "timestamp">;
  health: {
    score: number;
    status: MachineStatus;
    penalties: {
      vibration: number;
      temperature: number;
      pressure: number;
      voltage: number;
      rpm: number;
    };
  };
  twin: DigitalTwinState;
  events: Array<{
    event_type: string;
    severity: string;
    description: string;
    metric: string | null;
  }>;
  prediction?: PredictionState;
  risk?: RiskAssessment;
  alerts?: Alert[];
}

// --- Phase 3: Agentic AI Types ---

export interface AgentReasoning {
  id: string;
  machine_id: string;
  agent_name: string;
  evidence: string;
  conclusion: string;
  confidence: number | null;
  timestamp: string;
}

export interface MaintenanceTicket {
  id: string;
  machine_id: string;
  issue_summary: string;
  root_cause: string | null;
  recommended_action: string | null;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Pending Approval" | "Approved" | "Scheduled" | "In Progress" | "Completed" | "Closed";
  assigned_to: string | null;
  repair_cost_est: number | null;
  downtime_cost_est: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  machine_id: string;
  ticket_id: string | null;
  scheduled_time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  created_at: string;
}

// Chart data point
export interface ChartPoint {
  time: string;
  value: number;
}

export interface MultiChartPoint {
  time: string;
  temperature: number;
  vibration: number;
  pressure: number;
  health: number;
  humidity: number;
  voltage: number;
  rpm: number;
}
