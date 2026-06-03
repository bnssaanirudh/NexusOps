"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Machine, MachineCreate, MachineUpdate, MachineStatus, DigitalTwinState } from "@/lib/types";
import { machineApi } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { SearchFilter } from "@/components/SearchFilter";

// ── Add/Edit Machine Modal ────────────────────────────────────────────────────
interface MachineModalProps {
  machine?: Machine;
  onClose: () => void;
  onSave: () => void;
}

function MachineModal({ machine, onClose, onSave }: MachineModalProps) {
  const isEdit = !!machine;
  const [form, setForm] = useState({
    machine_id: machine?.machine_id || "",
    name: machine?.name || "",
    machine_type: machine?.machine_type || "",
    location: machine?.location || "",
    installation_date: machine?.installation_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    nominal_temperature: String(machine?.nominal_temperature ?? 65),
    nominal_pressure: String(machine?.nominal_pressure ?? 45),
    nominal_vibration: String(machine?.nominal_vibration ?? 0.1),
    nominal_voltage: String(machine?.nominal_voltage ?? 220),
    nominal_rpm: String(machine?.nominal_rpm ?? 1500),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const update: MachineUpdate = {
          name: form.name,
          machine_type: form.machine_type,
          location: form.location,
          installation_date: form.installation_date,
          nominal_temperature: parseFloat(form.nominal_temperature),
          nominal_pressure: parseFloat(form.nominal_pressure),
          nominal_vibration: parseFloat(form.nominal_vibration),
          nominal_voltage: parseFloat(form.nominal_voltage),
          nominal_rpm: parseFloat(form.nominal_rpm),
        };
        await machineApi.update(machine!.machine_id, update);
      } else {
        const create: MachineCreate = {
          machine_id: form.machine_id,
          name: form.name,
          machine_type: form.machine_type,
          location: form.location,
          installation_date: form.installation_date,
          nominal_temperature: parseFloat(form.nominal_temperature),
          nominal_pressure: parseFloat(form.nominal_pressure),
          nominal_vibration: parseFloat(form.nominal_vibration),
          nominal_voltage: parseFloat(form.nominal_voltage),
          nominal_rpm: parseFloat(form.nominal_rpm),
        };
        await machineApi.create(create);
      }
      onSave();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        disabled={isEdit && key === "machine_id"}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-base font-bold text-slate-100">{isEdit ? "Edit Machine" : "Add New Machine"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {field("Machine ID", "machine_id", "text", "M006")}
            {field("Name", "name", "text", "Pump Station Alpha")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("Type", "machine_type", "text", "Hydraulic Pump")}
            {field("Location", "location", "text", "Plant A - Bay 3")}
          </div>
          {field("Installation Date", "installation_date", "date")}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Nominal Operating Values</p>
          <div className="grid grid-cols-3 gap-3">
            {field("Temperature (°C)", "nominal_temperature", "number")}
            {field("Pressure (psi)", "nominal_pressure", "number")}
            {field("Vibration (g)", "nominal_vibration", "number")}
            {field("Voltage (V)", "nominal_voltage", "number")}
            {field("RPM", "nominal_rpm", "number")}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [twins, setTwins] = useState<Map<string, DigitalTwinState>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MachineStatus | "all">("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [ms, ts] = await Promise.all([machineApi.list(), machineApi.twins()]);
      setMachines(ms);
      const tMap = new Map<string, DigitalTwinState>();
      ts.forEach((t) => tMap.set(t.machine_id, t));
      setTwins(tMap);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (machineId: string) => {
    await machineApi.delete(machineId);
    setDeleteConfirm(null);
    load();
  };

  const filtered = machines.filter((m) => {
    const twin = twins.get(m.machine_id);
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.machine_id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || twin?.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Machine Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">{machines.length} active machines</p>
          </div>
          <button
            id="add-machine-btn"
            onClick={() => { setSelectedMachine(undefined); setModal("add"); }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Machine
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        <SearchFilter onSearch={setSearch} onFilter={setFilter} activeFilter={filter} resultCount={filtered.length} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/60">
                  {["Machine", "Type", "Location", "Installed", "Health", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map((machine) => {
                  const twin = twins.get(machine.machine_id);
                  return (
                    <tr key={machine.machine_id} className="group hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-slate-100">{machine.name}</p>
                          <p className="text-xs font-mono text-slate-500">{machine.machine_id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{machine.machine_type}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{machine.location || "—"}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{machine.installation_date?.slice(0, 10)}</td>
                      <td className="px-5 py-4">
                        {twin ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-700">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${twin.health_score}%`,
                                  background: twin.health_score >= 90 ? "#34d399" : twin.health_score >= 70 ? "#fbbf24" : twin.health_score >= 40 ? "#fb923c" : "#f87171",
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-300 tabular-nums">
                              {twin.health_score.toFixed(0)}%
                            </span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        {twin ? <StatusBadge status={twin.status} size="sm" /> : <span className="text-slate-500 text-xs">Offline</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/machines/${machine.machine_id}`}
                            className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-600 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => { setSelectedMachine(machine); setModal("edit"); }}
                            className="rounded-lg bg-blue-500/20 px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/30 transition-colors border border-blue-500/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(machine.machine_id)}
                            className="rounded-lg bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div className="py-16 text-center text-slate-500">
                <p className="text-sm">No machines found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <MachineModal
          machine={modal === "edit" ? selectedMachine : undefined}
          onClose={() => setModal(null)}
          onSave={load}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-100">Delete Machine</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete <span className="font-mono font-bold text-red-400">{deleteConfirm}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
