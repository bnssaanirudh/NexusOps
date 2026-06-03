from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

from database import get_db
import models
from services.rag_assistant import rag_assistant
from services.digital_twin import digital_twin_store

router = APIRouter(prefix="/copilot", tags=["copilot"])


class ChatRequest(BaseModel):
    message: str
    machine_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    source: str
    category: str
    confidence: float
    timestamp: str
    data: Optional[Dict[str, Any]] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Handle conversational queries — routing to RAG or live operational data."""
    msg = req.message.lower()
    machine_id = req.machine_id

    # ── Route 1: Operational queries about machine status ────────────────────
    if any(w in msg for w in ["which machine", "at risk", "need attention", "critical", "status"]):
        twins = digital_twin_store.get_all()
        at_risk = [t for t in twins if t.status in ("Critical", "Risk", "Warning")]
        at_risk.sort(key=lambda t: t.health_score)

        if not at_risk:
            answer = "✅ **All machines are currently healthy!** No immediate action required.\n\nAll systems are operating within normal parameters."
        else:
            lines = [f"⚠️ **{len(at_risk)} machine(s) require attention:**\n"]
            for t in at_risk[:5]:
                emoji = "🔴" if t.status == "Critical" else "🟠" if t.status == "Risk" else "🟡"
                lines.append(f"{emoji} **{t.machine_id}** ({t.machine_name})")
                lines.append(f"   • Health Score: **{t.health_score:.1f}%**")
                lines.append(f"   • Status: **{t.status}**")
                lines.append(f"   • Temperature: {t.temperature:.1f}°C | Vibration: {t.vibration:.3f} g")
                lines.append("")
            answer = "\n".join(lines)

        return ChatResponse(
            answer=answer,
            source="Live Digital Twin Store",
            category="Operational Intelligence",
            confidence=1.0,
            timestamp=datetime.utcnow().isoformat(),
            data={"at_risk_count": len(at_risk)},
        )

    # ── Route 2: Downtime / cost queries ────────────────────────────────────
    if any(w in msg for w in ["downtime", "cost", "savings", "how much", "prevent", "avoid"]):
        # Pull ticket data to compute savings
        result = await db.execute(
            select(models.MaintenanceTicket)
            .where(models.MaintenanceTicket.status.in_(["Approved", "Scheduled", "Completed"]))
        )
        tickets = result.scalars().all()
        repair_cost = sum(t.repair_cost_est or 0 for t in tickets)
        failure_cost = sum(t.downtime_cost_est or 0 for t in tickets)
        saved = failure_cost - repair_cost
        hours_prevented = len(tickets) * 12

        answer = f"""💰 **Predictive Maintenance ROI Summary:**

- **Machines monitored continuously:** {digital_twin_store.count}
- **Maintenance tickets actioned:** {len(tickets)}
- **Estimated downtime prevented:** **{hours_prevented} hours**
- **Repair costs invested:** ${repair_cost:,.0f}
- **Failure costs averted:** ${failure_cost:,.0f}
- **Net savings this period:** **${saved:,.0f}**

The AI agents have achieved a **{(failure_cost / max(repair_cost, 1)):.1f}x ROI** on maintenance spend."""

        return ChatResponse(
            answer=answer,
            source="Live Ticket & Cost Database",
            category="Financial Intelligence",
            confidence=1.0,
            timestamp=datetime.utcnow().isoformat(),
            data={"saved": saved, "tickets": len(tickets)},
        )

    # ── Route 3: Specific machine queries ────────────────────────────────────
    # Detect machine ID in the message (e.g., "M001", "M-003", "Machine 2")
    detected_machine = machine_id
    if not detected_machine:
        twins = digital_twin_store.get_all()
        for t in twins:
            if t.machine_id.lower() in msg or t.machine_name.lower() in msg:
                detected_machine = t.machine_id
                break

    if detected_machine:
        twin = digital_twin_store.get(detected_machine)
        if twin:
            # Get recent alerts
            alert_result = await db.execute(
                select(models.Alert)
                .where(models.Alert.machine_id == detected_machine, models.Alert.status == "Active")
                .order_by(desc(models.Alert.timestamp))
                .limit(3)
            )
            alerts = alert_result.scalars().all()
            alert_text = ""
            if alerts:
                alert_text = "\n\n**Active Alerts:**\n" + "\n".join(
                    f"  • [{a.severity}] {a.message}" for a in alerts
                )

            answer = f"""📊 **{twin.machine_id} — {twin.machine_name}** Status Report:

- **Health Score:** {twin.health_score:.1f}% ({twin.status})
- **Temperature:** {twin.temperature:.1f}°C
- **Vibration:** {twin.vibration:.3f} g
- **Pressure:** {twin.pressure:.1f} PSI
- **Voltage:** {twin.voltage:.1f} V
- **RPM:** {twin.rpm:.0f}
- **Last Updated:** {twin.last_updated[:19].replace('T', ' ')}
{alert_text}"""

            # Query the knowledge base with machine context
            machine_context = {"machine_id": twin.machine_id, "health_score": twin.health_score, "status": twin.status}
            kb_result = rag_assistant.query(req.message, machine_context)

            if kb_result["confidence"] > 0.7:
                answer += f"\n\n---\n{kb_result['answer']}"

            return ChatResponse(
                answer=answer,
                source=f"Live Twin + {kb_result.get('source', 'Knowledge Base')}",
                category="Machine Intelligence",
                confidence=0.95,
                timestamp=datetime.utcnow().isoformat(),
            )

    # ── Route 4: Default — RAG knowledge base ────────────────────────────────
    result = rag_assistant.query(req.message)
    return ChatResponse(**result)
