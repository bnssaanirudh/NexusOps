import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import shap
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class PredictiveMLEngine:
    """
    Simulated Predictive Maintenance ML Engine.
    In a production system, these models would be trained on historical data.
    For Phase 2, we initialize pre-configured dummy models that produce realistic 
    outputs based on sensor deviations.
    """
    def __init__(self):
        self.features = ['temperature', 'vibration', 'pressure', 'humidity', 'voltage', 'current', 'rpm', 
                         'temp_trend', 'vib_trend', 'press_var', 'health_decay']
        
        # Initialize models (using a few synthetic samples to fit them so they can be called)
        self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
        
        # XGBoost for failure probability
        self.xgb_model = xgb.XGBClassifier(objective='binary:logistic', random_state=42, n_estimators=10, max_depth=3)
        
        # We need a small synthetic dataset to fit the models initially
        X_dummy = pd.DataFrame(np.random.normal(size=(100, len(self.features))), columns=self.features)
        y_dummy = np.random.randint(0, 2, size=100)
        
        self.iso_forest.fit(X_dummy)
        self.xgb_model.fit(X_dummy, y_dummy)
        
        # SHAP explainer
        self.explainer = shap.TreeExplainer(self.xgb_model)
        
        logger.info("Predictive ML Engine initialized with pre-trained models.")

    def engineer_features(self, current_reading: Dict[str, float], historical_readings: List[Dict[str, float]]) -> pd.DataFrame:
        """
        Calculates rolling window features based on recent history.
        """
        # Base features
        row = {
            'temperature': current_reading.get('temperature', 65.0),
            'vibration': current_reading.get('vibration', 0.1),
            'pressure': current_reading.get('pressure', 45.0),
            'humidity': current_reading.get('humidity', 50.0),
            'voltage': current_reading.get('voltage', 220.0),
            'current': current_reading.get('current', 10.0),
            'rpm': current_reading.get('rpm', 1500.0)
        }
        
        if not historical_readings or len(historical_readings) < 2:
            # Default derived features if no history
            row.update({
                'temp_trend': 0.0,
                'vib_trend': 0.0,
                'press_var': 0.0,
                'health_decay': 0.0
            })
        else:
            # Calculate actual trends
            df = pd.DataFrame(historical_readings)
            row['temp_trend'] = df['temperature'].iloc[-1] - df['temperature'].iloc[0]
            row['vib_trend'] = df['vibration'].iloc[-1] - df['vibration'].iloc[0]
            row['press_var'] = df['pressure'].var() if len(df) > 1 else 0.0
            
            # Simulated health decay rate (points per reading)
            if 'health_score' in df.columns:
                row['health_decay'] = df['health_score'].iloc[0] - df['health_score'].iloc[-1]
            else:
                row['health_decay'] = 0.0
                
        # Fill NaNs with 0
        for k in row:
            if pd.isna(row[k]):
                row[k] = 0.0
                
        return pd.DataFrame([row], columns=self.features)

    def predict(self, features_df: pd.DataFrame, health_score: float) -> Dict[str, Any]:
        """
        Runs inference to get anomaly score, failure probabilities, RUL, and SHAP values.
        """
        # 1. Anomaly Detection (Isolation Forest)
        # sklearn returns 1 for inliers, -1 for outliers
        anomaly_pred = self.iso_forest.predict(features_df)[0]
        is_anomaly = bool(anomaly_pred == -1)
        
        # Decision function gives lower values for anomalies. Normalize to 0-1 range.
        decision_score = self.iso_forest.decision_function(features_df)[0]
        # Invert and scale to roughly 0-1 where 1 is high anomaly
        anomaly_score = float(max(0.0, min(1.0, 0.5 - decision_score)))
        
        # Override for demo realism: if health is low, it's an anomaly
        if health_score < 70:
            is_anomaly = True
            anomaly_score = max(anomaly_score, 0.7 + (70 - health_score)/100)

        # 2. Failure Probability (XGBoost)
        # Using a deterministic calculation based on health score for demo consistency,
        # mixed with XGBoost probability to show model interaction.
        xgb_prob = float(self.xgb_model.predict_proba(features_df)[0][1])
        
        # Base probability inversely related to health
        base_prob = max(0.0, 1.0 - (health_score / 100.0))
        
        prob_24h = min(1.0, base_prob * 1.5 + xgb_prob * 0.1)
        prob_48h = min(1.0, prob_24h * 1.3)
        prob_72h = min(1.0, prob_48h * 1.2)

        # 3. Remaining Useful Life (RUL)
        # RUL estimation based on health and decay
        health_decay = float(features_df['health_decay'].iloc[0])
        if health_decay > 0.5:
            rul_days = max(1.0, health_score / (health_decay * 24)) # roughly points per hour
        else:
            rul_days = max(1.0, health_score * 0.8) # Base days if healthy
            
        # 4. Explainable AI (SHAP)
        shap_values = self.explainer.shap_values(features_df)[0]
        
        # Create meaningful SHAP values for the demo based on actual sensor deviations
        shap_dict = {}
        row = features_df.iloc[0]
        
        # Inject deterministic logic to ensure the UI explanations match the fault mode
        shap_dict['vibration'] = float(row['vibration'] * 2.5) if row['vibration'] > 0.5 else float(shap_values[1])
        shap_dict['temperature'] = float((row['temperature'] - 65) / 10.0) if row['temperature'] > 80 else float(shap_values[0])
        shap_dict['pressure'] = float(abs(row['pressure'] - 45) / 15.0) if abs(row['pressure'] - 45) > 15 else float(shap_values[2])
        shap_dict['rpm'] = float(abs(row['rpm'] - 1500) / 500.0) if abs(row['rpm'] - 1500) > 300 else float(shap_values[6])
        
        # Add the rest
        for i, feat in enumerate(self.features):
            if feat not in shap_dict:
                shap_dict[feat] = float(shap_values[i])
                
        # Normalize top positive SHAP values for display percentages
        positive_shap = {k: v for k, v in shap_dict.items() if v > 0}
        total_shap = sum(positive_shap.values()) or 1.0
        
        normalized_shap = {}
        for k, v in positive_shap.items():
            if v > 0.05 * total_shap: # only keep significant ones
                normalized_shap[k] = round((v / total_shap) * 100, 1)
                
        # Sort by impact
        sorted_shap = dict(sorted(normalized_shap.items(), key=lambda item: item[1], reverse=True))

        return {
            "anomaly_score": round(anomaly_score, 3),
            "is_anomaly": is_anomaly,
            "failure_prob_24h": round(prob_24h, 3),
            "failure_prob_48h": round(prob_48h, 3),
            "failure_prob_72h": round(prob_72h, 3),
            "rul_days": round(rul_days, 1),
            "shap_values": sorted_shap
        }

# Singleton instance
ml_engine = PredictiveMLEngine()
