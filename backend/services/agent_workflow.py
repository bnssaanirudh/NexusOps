import uuid
from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import models

# --------------------------------------------------------------------------------
# AI Agent Workflow (LangGraph Concept - Simulated for Demo Stability)
# --------------------------------------------------------------------------------
# In a full production environment, each of these functions would invoke an LLM 
# via LangChain (e.g. ChatGoogleGenerativeAI) with specific system prompts. 
# For the hackathon demo, we simulate the structured reasoning outputs to ensure 
# 100% reliability and fast execution without requiring API keys.
# --------------------------------------------------------------------------------

class AgentWorkflow:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _save_reasoning(self, machine_id: str, agent_name: str, evidence: str, conclusion: str, confidence: float):
        reasoning = models.AgentReasoning(
            machine_id=machine_id,
            agent_name=agent_name,
            evidence=evidence,
            conclusion=conclusion,
            confidence=confidence
        )
        self.db.add(reasoning)
        return reasoning

    async def run_workflow(self, machine_id: str, sensor_data: dict, shap_values: dict, failure_prob: float):
        """
        Executes the LangGraph sequence:
        Monitor -> Diagnose -> Planner -> Cost -> Approval -> Ticket
        """
        # --- 1. Monitoring Agent ---
        if failure_prob < 0.70:
            return {"status": "skipped", "reason": "Failure probability too low"}
            
        await self._save_reasoning(
            machine_id, "Monitoring Agent",
            f"Failure probability is {(failure_prob*100):.1f}% > 70% threshold.",
            "Anomaly detected. Triggering diagnosis.",
            0.99
        )

        # --- 2. Diagnosis Agent ---
        # Find top 2 driving factors from SHAP
        sorted_shap = sorted(shap_values.items(), key=lambda x: x[1], reverse=True)
        top_factors = [f[0] for f in sorted_shap[:2]]
        
        root_cause = "Unknown Component Failure"
        evidence = f"Sensors showing highest anomaly contributions: {', '.join(top_factors)}."
        
        if "vibration" in top_factors:
            root_cause = "Bearing Wear / Rotor Imbalance"
        elif "temperature" in top_factors:
            root_cause = "Motor Overheating"
        elif "pressure" in top_factors:
            root_cause = "Pneumatic/Hydraulic Pressure Leakage"
        elif "voltage" in top_factors:
            root_cause = "Power Supply Instability"
            
        await self._save_reasoning(machine_id, "Diagnosis Agent", evidence, root_cause, 0.92)

        # --- 3. Maintenance Planner Agent ---
        recommended_action = "General Inspection"
        repair_cost_est = 500.0
        
        if "Bearing" in root_cause:
            recommended_action = "Replace main bearings and recalibrate rotor."
            repair_cost_est = 1200.0
        elif "Overheating" in root_cause:
            recommended_action = "Clean cooling vents, replace thermal paste, inspect stator."
            repair_cost_est = 450.0
        elif "Leakage" in root_cause:
            recommended_action = "Replace hydraulic seals and run pressure test."
            repair_cost_est = 850.0
        elif "Power" in root_cause:
            recommended_action = "Replace voltage regulator and inspect power lines."
            repair_cost_est = 1500.0

        await self._save_reasoning(
            machine_id, "Planner Agent",
            f"Root cause identified as {root_cause}.",
            f"Recommended: {recommended_action}. Estimated repair cost: ${repair_cost_est}.",
            0.88
        )

        # --- 4. Cost Optimization Agent ---
        downtime_cost_per_hour = 400.0 # $400/hr
        avg_downtime_hours = 12.0
        failure_cost_est = downtime_cost_per_hour * avg_downtime_hours + repair_cost_est * 2 # catastrophic failure costs more

        evidence_cost = f"Repair Cost: ${repair_cost_est}. Estimated Failure Cost: ${failure_cost_est}."
        conclusion_cost = "Repair is significantly cheaper than failure downtime. Recommend immediate action."
        
        await self._save_reasoning(machine_id, "Cost Agent", evidence_cost, conclusion_cost, 0.95)

        # --- 5. Approval Agent ---
        await self._save_reasoning(
            machine_id, "Approval Agent",
            "Cost optimization justified the repair.",
            "Awaiting human approval before creating a maintenance ticket.",
            1.0
        )
        
        # We stop the workflow here and create a "Pending Approval" ticket
        ticket_id = f"T-{str(uuid.uuid4())[:8].upper()}"
        
        ticket = models.MaintenanceTicket(
            id=ticket_id,
            machine_id=machine_id,
            issue_summary=f"Predictive Alert: {root_cause}",
            root_cause=root_cause,
            recommended_action=recommended_action,
            priority="Critical" if failure_prob > 0.85 else "High",
            status="Pending Approval",
            repair_cost_est=repair_cost_est,
            downtime_cost_est=failure_cost_est
        )
        self.db.add(ticket)
        await self.db.commit()
        
        return {"status": "pending_approval", "ticket_id": ticket_id}

    async def approve_ticket(self, ticket_id: str):
        """
        Resumes the workflow after human approval.
        """
        res = await self.db.execute(select(models.MaintenanceTicket).where(models.MaintenanceTicket.id == ticket_id))
        ticket = res.scalar_one_or_none()
        if not ticket:
            return None
            
        ticket.status = "Approved"
        
        # --- 6. Ticket Generation Agent ---
        await self._save_reasoning(
            ticket.machine_id, "Ticket Agent",
            f"Human approval received for ticket {ticket_id}.",
            "Ticket status updated to Approved. Scheduling maintenance window.",
            1.0
        )
        
        # Schedule it for tomorrow at 10 AM
        tomorrow = datetime.utcnow() + timedelta(days=1)
        schedule_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        
        schedule = models.MaintenanceSchedule(
            machine_id=ticket.machine_id,
            ticket_id=ticket_id,
            scheduled_time=schedule_time,
            status="Scheduled"
        )
        self.db.add(schedule)
        
        ticket.status = "Scheduled"
        await self.db.commit()
        
        return ticket
