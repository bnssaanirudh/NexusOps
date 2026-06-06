"use client";

import { useState, useEffect } from "react";
import { ticketApi } from "@/lib/api";
import { Wrench, Check, X, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const T = {
  cream: '#F2EEE8', creamDark: '#E8E2D9', creamMid: '#DDD5C8',
  ink: '#1C1A18', inkMid: '#3D3830', inkSoft: '#6B6158', inkGhost: '#9A9089',
  amber: '#C07C2A', amberLight: '#F5D6A8',
  rust: '#B84432', rustLight: '#F0C4BC',
  sage: '#3A6B4A', sageLight: '#C0D9C8',
  steel: '#3A5070', steelLight: '#D0DFF0',
  warning: '#917320', warningLight: '#F0DCA0',
  FONT: "'Space Grotesk', sans-serif",
  MONO: "'Space Mono', monospace",
};

const getStatusMeta = (status: string) => {
  if (status === "Approved" || status === "Completed") return { color: T.sage, bg: T.sageLight };
  if (status === "Pending" || status === "Pending Approval") return { color: T.warning, bg: T.warningLight };
  if (status === "Rejected") return { color: T.rust, bg: T.rustLight };
  return { color: T.steel, bg: T.steelLight };
};

export default function MaintenanceHub() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { const data = await ticketApi.list(); setTickets(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await ticketApi.approve(id);
      setTickets(tickets.map(t => t.id === id ? { ...t, status: "Approved" } : t));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id: string) => {
    try {
      await ticketApi.reject(id);
      setTickets(tickets.map(t => t.id === id ? { ...t, status: "Rejected" } : t));
    } catch (err) { console.error(err); }
  };

  const pendingCount  = tickets.filter(t => t.status === "Pending" || t.status === "Pending Approval").length;
  const approvedCount = tickets.filter(t => t.status === "Approved").length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.35rem' }}>
            — Autonomous Maintenance
          </div>
          <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: T.ink }}>
            Maintenance Hub
          </h1>
          <p style={{ fontFamily: T.FONT, fontSize: '0.875rem', color: T.inkSoft, marginTop: '0.25rem' }}>
            Review and approve autonomous maintenance actions.
          </p>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', backgroundColor: T.warningLight,
            border: `1px solid ${T.warning}25`, borderRadius: '0.5rem',
          }}>
            <Clock style={{ width: '13px', height: '13px', color: T.warning }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.65rem', color: T.warning, letterSpacing: '0.08em', fontWeight: 700 }}>
              {pendingCount} PENDING
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', backgroundColor: T.sageLight,
            border: `1px solid ${T.sage}25`, borderRadius: '0.5rem',
          }}>
            <ShieldCheck style={{ width: '13px', height: '13px', color: T.sage }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.65rem', color: T.sage, letterSpacing: '0.08em', fontWeight: 700 }}>
              {approvedCount} APPROVED
            </span>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '280px', backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', animation: 'shimmer 1.8s linear infinite' }} />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '4rem', backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
          borderRadius: '0.75rem', gap: '0.75rem',
        }}>
          <ShieldCheck style={{ width: '32px', height: '32px', color: T.inkGhost, opacity: 0.4 }} />
          <p style={{ fontFamily: T.MONO, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost }}>
            No active maintenance tickets
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {tickets.map((t, i) => {
            const meta = getStatusMeta(t.status);
            const isPending = t.status === "Pending" || t.status === "Pending Approval";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
                  borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                  cursor: 'default',
                }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(28,26,24,0.08)' }}
              >
                {/* Priority accent bar */}
                <div style={{ height: '3px', backgroundColor: isPending ? T.amber : meta.color }} />

                {/* Card Header */}
                <div style={{
                  padding: '1rem 1.25rem', borderBottom: `1px solid ${T.creamMid}`,
                  backgroundColor: T.cream, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <Wrench style={{ width: '13px', height: '13px', color: T.amber }} />
                      <span style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.9rem', color: T.ink }}>
                        Ticket #{t.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontFamily: T.MONO, fontSize: '0.62rem', color: T.inkGhost, letterSpacing: '0.08em' }}>
                      {t.machine_id}
                    </span>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.65rem', borderRadius: '100px',
                    backgroundColor: meta.bg,
                    border: `1px solid ${meta.color}25`,
                    fontFamily: T.FONT, fontWeight: 700, fontSize: '0.65rem',
                    color: meta.color, letterSpacing: '0.04em',
                  }}>
                    {t.status}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div>
                    <div style={{ fontFamily: T.MONO, fontSize: '0.56rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.375rem' }}>
                      Recommended Action
                    </div>
                    <p style={{ fontFamily: T.FONT, fontSize: '0.85rem', fontWeight: 500, color: T.ink, lineHeight: 1.5 }}>
                      {t.recommended_action || t.issue_summary || 'No description provided'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: T.cream, border: `1px solid ${T.creamMid}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <div style={{ fontFamily: T.MONO, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.2rem' }}>Est. Cost</div>
                      <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: T.sage }}>
                        ${t.repair_cost_est ?? t.estimated_cost ?? '—'}
                      </div>
                    </div>
                    <div style={{ backgroundColor: T.cream, border: `1px solid ${T.creamMid}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <div style={{ fontFamily: T.MONO, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.2rem' }}>Priority</div>
                      <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: T.ink }}>
                        {t.priority ?? 'Medium'}
                      </div>
                    </div>
                  </div>

                  {isPending && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', borderTop: `1px solid ${T.creamMid}`, paddingTop: '1rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleApprove(t.id)}
                        style={{
                          padding: '0.6rem 1rem', borderRadius: '0.5rem',
                          backgroundColor: T.sageLight, border: `1px solid ${T.sage}30`,
                          color: T.sage, fontFamily: T.FONT, fontWeight: 700, fontSize: '0.82rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#a8c8b4'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = T.sageLight}
                      >
                        <Check style={{ width: '13px', height: '13px' }} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(t.id)}
                        style={{
                          padding: '0.6rem 1rem', borderRadius: '0.5rem',
                          backgroundColor: T.cream, border: `1px solid ${T.creamMid}`,
                          color: T.rust, fontFamily: T.FONT, fontWeight: 700, fontSize: '0.82rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = T.rustLight}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = T.cream}
                      >
                        <X style={{ width: '13px', height: '13px' }} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
