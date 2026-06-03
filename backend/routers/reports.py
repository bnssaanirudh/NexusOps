from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta
import io
import csv

from database import get_db
import models
from services.digital_twin import digital_twin_store

router = APIRouter(prefix="/reports", tags=["reports"])


async def _gather_report_data(db: AsyncSession, days: int):
    """Gather all metrics for a report period."""
    since = datetime.utcnow() - timedelta(days=days)

    # Machine overview
    twins = digital_twin_store.get_all()
    total_machines = len(twins)
    healthy = sum(1 for t in twins if t.status == "Healthy")
    warning = sum(1 for t in twins if t.status == "Warning")
    risk = sum(1 for t in twins if t.status == "Risk")
    critical = sum(1 for t in twins if t.status == "Critical")

    # Alerts in period
    alert_result = await db.execute(
        select(models.Alert).where(models.Alert.timestamp >= since)
    )
    alerts = alert_result.scalars().all()
    critical_alerts = sum(1 for a in alerts if a.severity == "Critical")
    high_alerts = sum(1 for a in alerts if a.severity == "High Risk")

    # Tickets in period
    ticket_result = await db.execute(
        select(models.MaintenanceTicket).where(models.MaintenanceTicket.created_at >= since)
    )
    tickets = ticket_result.scalars().all()
    approved = sum(1 for t in tickets if t.status in ["Approved", "Scheduled", "Completed"])
    repair_cost = sum(t.repair_cost_est or 0 for t in tickets if t.status in ["Approved", "Scheduled", "Completed"])
    failure_cost = sum(t.downtime_cost_est or 0 for t in tickets if t.status in ["Approved", "Scheduled", "Completed"])
    savings = failure_cost - repair_cost

    # Predictions in period
    pred_result = await db.execute(
        select(func.count(models.Prediction.id), func.sum(
            models.Prediction.is_anomaly.cast(models.Prediction.is_anomaly.__class__)
        )).where(models.Prediction.timestamp >= since)
    )
    # Simple count
    pred_count_result = await db.execute(
        select(func.count(models.Prediction.id)).where(models.Prediction.timestamp >= since)
    )
    total_predictions = pred_count_result.scalar() or 0

    anomaly_count_result = await db.execute(
        select(func.count(models.Prediction.id)).where(
            models.Prediction.timestamp >= since,
            models.Prediction.is_anomaly == True
        )
    )
    total_anomalies = anomaly_count_result.scalar() or 0

    return {
        "period_days": days,
        "generated_at": datetime.utcnow().isoformat(),
        "machines": {
            "total": total_machines, "healthy": healthy, "warning": warning,
            "risk": risk, "critical": critical,
            "availability_pct": round((healthy / max(total_machines, 1)) * 100, 1),
        },
        "alerts": {
            "total": len(alerts), "critical": critical_alerts,
            "high_risk": high_alerts, "resolved": sum(1 for a in alerts if a.status == "Resolved"),
        },
        "predictions": {
            "total_scans": total_predictions,
            "anomalies_detected": total_anomalies,
            "accuracy_pct": 96.5,  # Simulated ML accuracy
        },
        "maintenance": {
            "tickets_generated": len(tickets),
            "tickets_approved": approved,
            "repair_cost_usd": round(repair_cost, 2),
            "failure_cost_averted_usd": round(failure_cost, 2),
            "net_savings_usd": round(savings, 2),
            "downtime_hours_prevented": approved * 12,
            "roi_multiplier": round(failure_cost / max(repair_cost, 1), 1),
        },
    }


@router.get("/daily")
async def daily_report(db: AsyncSession = Depends(get_db)):
    return await _gather_report_data(db, days=1)


@router.get("/weekly")
async def weekly_report(db: AsyncSession = Depends(get_db)):
    return await _gather_report_data(db, days=7)


@router.get("/export/csv")
async def export_csv(days: int = 7, db: AsyncSession = Depends(get_db)):
    """Export a CSV summary of tickets and savings."""
    since = datetime.utcnow() - timedelta(days=days)
    ticket_result = await db.execute(
        select(models.MaintenanceTicket).where(
            models.MaintenanceTicket.created_at >= since
        ).order_by(desc(models.MaintenanceTicket.created_at))
    )
    tickets = ticket_result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Ticket ID", "Machine ID", "Issue Summary", "Root Cause",
        "Priority", "Status", "Repair Cost ($)", "Failure Cost ($)", "Created At"
    ])
    for t in tickets:
        writer.writerow([
            t.id, t.machine_id, t.issue_summary, t.root_cause or "",
            t.priority, t.status,
            t.repair_cost_est or 0, t.downtime_cost_est or 0,
            t.created_at.strftime("%Y-%m-%d %H:%M") if t.created_at else "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sentinelai_report_{days}d.csv"},
    )
