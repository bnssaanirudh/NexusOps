import type {
  Machine,
  MachineCreate,
  MachineUpdate,
  SensorReading,
  HealthRecord,
  HealthSummary,
  EventLog,
  DigitalTwinState,
  KPISummary,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Machine APIs ──────────────────────────────────────────────────────────────

export const machineApi = {
  list: (params?: { status?: string; search?: string; active_only?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    if (params?.active_only !== undefined) qs.set("active_only", String(params.active_only));
    return apiFetch<Machine[]>(`/machines?${qs}`);
  },

  get: (id: string) => apiFetch<Machine>(`/machines/${id}`),

  create: (data: MachineCreate) =>
    apiFetch<Machine>("/machines", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: MachineUpdate) =>
    apiFetch<Machine>(`/machines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetch(`${API_BASE}/machines/${id}`, { method: "DELETE" }),

  kpi: () => apiFetch<KPISummary>("/machines/kpi"),

  twins: () => apiFetch<DigitalTwinState[]>("/machines/twins"),

  twin: (id: string) => apiFetch<DigitalTwinState>(`/machines/${id}/twin`),
};

// ── Sensor APIs ───────────────────────────────────────────────────────────────

export const sensorApi = {
  list: (params?: { machine_id?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.machine_id) qs.set("machine_id", params.machine_id);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.offset) qs.set("offset", String(params.offset));
    return apiFetch<SensorReading[]>(`/sensors?${qs}`);
  },

  byMachine: (id: string, limit = 50) =>
    apiFetch<SensorReading[]>(`/sensors/machine/${id}?limit=${limit}`),
};

// ── Health APIs ───────────────────────────────────────────────────────────────

export const healthApi = {
  all: () => apiFetch<HealthSummary[]>("/health"),

  byMachine: (id: string, limit = 50) =>
    apiFetch<HealthRecord[]>(`/health/machine/${id}?limit=${limit}`),

  latest: (id: string) =>
    apiFetch<HealthRecord>(`/health/machine/${id}/latest`),
};

// ── Event APIs ────────────────────────────────────────────────────────────────

export const eventApi = {
  list: (params?: { machine_id?: string; severity?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.machine_id) qs.set("machine_id", params.machine_id);
    if (params?.severity) qs.set("severity", params.severity);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<EventLog[]>(`/events?${qs}`);
  },

  byMachine: (id: string, limit = 30) =>
    apiFetch<EventLog[]>(`/events/machine/${id}?limit=${limit}`),
};

// --- Phase 2: Predictive APIs ---
export const predictiveApi = {
  predictionsByMachine: async (id: string, limit = 10) => {
    const res = await fetch(`${API_BASE}/predictive/predictions/machine/${id}?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch predictions");
    return res.json();
  },
  riskByMachine: async (id: string, limit = 10) => {
    const res = await fetch(`${API_BASE}/predictive/risk/machine/${id}?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch risk assessments");
    return res.json();
  },
  alerts: async (status?: string, limit = 50) => {
    const url = new URL(`${API_BASE}/predictive/alerts`);
    if (status) url.searchParams.append("status", status);
    url.searchParams.append("limit", limit.toString());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
  },
  resolveAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/predictive/alerts/${alertId}/resolve`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to resolve alert");
    return res.json();
  }
};

// --- Phase 3: Agentic Operations APIs ---
export const agentApi = {
  reasoning: async (machineId?: string, limit = 100) => {
    const url = machineId 
      ? `${API_BASE}/agents/reasoning/machine/${machineId}?limit=${limit}`
      : `${API_BASE}/agents/reasoning?limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch agent reasoning");
    return res.json();
  }
};

export const ticketApi = {
  list: async (status?: string, limit = 100) => {
    const url = new URL(`${API_BASE}/tickets`);
    if (status) url.searchParams.append("status", status);
    url.searchParams.append("limit", limit.toString());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  },
  approve: async (ticketId: string) => {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/approve`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to approve ticket");
    return res.json();
  },
  reject: async (ticketId: string) => {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/reject`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to reject ticket");
    return res.json();
  }
};

// --- Phase 4: Copilot, Simulator, Reports ---
export const copilotApi = {
  chat: async (message: string, machineId?: string) => {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, machine_id: machineId }),
    });
    if (!res.ok) throw new Error("Copilot chat failed");
    return res.json();
  },
};

export const simulatorApi = {
  scenarios: async () => {
    const res = await fetch(`${API_BASE}/simulator/scenarios`);
    if (!res.ok) throw new Error("Failed to fetch scenarios");
    return res.json();
  },
  inject: async (machineId: string, scenario: string, customOverrides?: Record<string, number>) => {
    const res = await fetch(`${API_BASE}/simulator/inject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_id: machineId, scenario, custom_overrides: customOverrides }),
    });
    if (!res.ok) throw new Error("Fault injection failed");
    return res.json();
  },
  reset: async (machineId: string) => {
    const res = await fetch(`${API_BASE}/simulator/reset/${machineId}`, { method: "POST" });
    if (!res.ok) throw new Error("Reset failed");
    return res.json();
  },
  whatIf: async (machineId: string, modifications: Record<string, number>) => {
    const res = await fetch(`${API_BASE}/simulator/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_id: machineId, modifications }),
    });
    if (!res.ok) throw new Error("What-if simulation failed");
    return res.json();
  },
  forecast: async (machineId: string) => {
    const res = await fetch(`${API_BASE}/simulator/forecast/${machineId}`);
    if (!res.ok) throw new Error("Forecast failed");
    return res.json();
  },
};

export const reportsApi = {
  daily: async () => {
    const res = await fetch(`${API_BASE}/reports/daily`);
    if (!res.ok) throw new Error("Failed to fetch daily report");
    return res.json();
  },
  weekly: async () => {
    const res = await fetch(`${API_BASE}/reports/weekly`);
    if (!res.ok) throw new Error("Failed to fetch weekly report");
    return res.json();
  },
  exportCsvUrl: (days = 7) => `${API_BASE}/reports/export/csv?days=${days}`,
};

