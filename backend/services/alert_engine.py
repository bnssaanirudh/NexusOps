from typing import Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class AlertEngine:
    """
    Evaluates predictions and health to generate Risk Assessments and Maintenance Alerts.
    """
    
    def calculate_risk(self, failure_prob_24h: float, anomaly_score: float, health_score: float) -> Tuple[float, str]:
        """
        Risk Score = Failure Probability + Anomaly Severity + Health Decay
        Returns (risk_score, risk_level)
        """
        # Normalize inputs
        prob_factor = failure_prob_24h * 100.0  # 0 to 100
        anomaly_factor = anomaly_score * 50.0   # 0 to 50
        health_factor = max(0.0, 100.0 - health_score) # 0 to 100
        
        # Weighted Risk Score (max ~ 100)
        risk_score = (prob_factor * 0.5) + (anomaly_factor * 0.2) + (health_factor * 0.3)
        risk_score = min(100.0, round(risk_score, 1))
        
        # Categorize
        if risk_score >= 80:
            risk_level = "Critical Risk"
        elif risk_score >= 50:
            risk_level = "High Risk"
        elif risk_score >= 25:
            risk_level = "Medium Risk"
        else:
            risk_level = "Low Risk"
            
        return risk_score, risk_level

    def generate_alerts(self, machine_id: str, risk_level: str, shap_values: Dict[str, float], failure_prob_24h: float) -> list[Dict[str, str]]:
        """
        Generates actionable predictive maintenance alerts based on Risk Level and SHAP feature importance.
        """
        alerts = []
        
        # Only generate alerts for High or Critical Risk
        if risk_level not in ["High Risk", "Critical Risk"]:
            return alerts
            
        # Determine root cause from SHAP
        if not shap_values:
            top_feature = "unknown"
        else:
            # SHAP dict is pre-sorted descending by ml_engine
            top_feature = list(shap_values.keys())[0]
            
        severity = "Critical" if risk_level == "Critical Risk" else "High Risk"
        prob_pct = int(failure_prob_24h * 100)
        
        # Rule-based recommendations
        if top_feature == "vibration":
            alerts.append({
                "severity": severity,
                "message": f"Critical vibration detected. Failure Probability: {prob_pct}%",
                "recommendation": "Inspect bearing and structural mounts immediately."
            })
        elif top_feature == "temperature":
            alerts.append({
                "severity": severity,
                "message": f"Severe overheating predicted. Failure Probability: {prob_pct}%",
                "recommendation": "Check cooling system and lubrication levels."
            })
        elif top_feature == "pressure":
            alerts.append({
                "severity": severity,
                "message": f"Pressure instability detected. Failure Probability: {prob_pct}%",
                "recommendation": "Inspect for seal leaks or valve blockages."
            })
        elif top_feature == "voltage" or top_feature == "current":
            alerts.append({
                "severity": severity,
                "message": f"Electrical anomaly predicted. Failure Probability: {prob_pct}%",
                "recommendation": "Perform electrical system diagnostic and check connections."
            })
        elif top_feature == "rpm":
            alerts.append({
                "severity": severity,
                "message": f"Rotor imbalance or load anomaly. Failure Probability: {prob_pct}%",
                "recommendation": "Verify motor load and alignment."
            })
        else:
            alerts.append({
                "severity": severity,
                "message": f"High failure risk detected. Failure Probability: {prob_pct}%",
                "recommendation": "Schedule comprehensive preventative maintenance."
            })
            
        return alerts

# Singleton instance
alert_engine = AlertEngine()
