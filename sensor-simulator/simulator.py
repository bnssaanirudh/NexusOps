import asyncio
import json
import logging
import random
import time
import httpx
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

API_URL = "http://backend:8000/sensors/ingest"

class VirtualMachine:
    def __init__(self, config: Dict[str, Any]):
        self.machine_id = config["machine_id"]
        self.nominals = config["nominal"]  # key in JSON is "nominal", not "nominals"
        
        # State machine
        # Modes: Normal, Fluctuation, Stressed, Recovery, FaultProgression
        self.mode = "Normal"
        self.ticks_in_mode = 0
        self.mode_duration = random.randint(20, 60)
        
        # Current state values
        self.current = self.nominals.copy()
        
        # Fault configuration
        self.active_fault = None
        self.fault_severity = 0.0 # 0.0 to 1.0
        
    def transition_mode(self):
        """State machine for simulation modes."""
        self.ticks_in_mode = 0
        
        # If in a fault progression, we don't randomly switch out of it easily
        if self.mode == "FaultProgression":
            if self.fault_severity >= 1.0 and random.random() < 0.1:
                # 10% chance to recover from a full fault (simulated maintenance)
                logger.info(f"[{self.machine_id}] Maintenance performed. Recovering from {self.active_fault}.")
                self.mode = "Recovery"
                self.active_fault = None
                self.fault_severity = 0.0
                self.mode_duration = random.randint(10, 20)
            else:
                self.mode_duration = random.randint(10, 30) # Keep degrading or stay critical
            return

        choices = ["Normal", "Fluctuation", "Stressed", "FaultProgression"]
        weights = [0.60, 0.20, 0.10, 0.10]
        
        # Force Normal if we just recovered
        if self.mode == "Recovery":
            self.mode = "Normal"
            self.mode_duration = random.randint(30, 80)
            return
            
        self.mode = random.choices(choices, weights=weights)[0]
        
        if self.mode == "Normal":
            self.mode_duration = random.randint(30, 80)
        elif self.mode == "Fluctuation":
            self.mode_duration = random.randint(15, 40)
        elif self.mode == "Stressed":
            self.mode_duration = random.randint(10, 25)
        elif self.mode == "FaultProgression":
            self.mode_duration = random.randint(60, 120) # Faults take a long time to develop
            faults = [
                ("vibration", "Bearing Wear"),
                ("temperature", "Motor Overheating"),
                ("pressure", "Pressure Leakage"),
                ("voltage", "Voltage Instability"),
                ("rpm", "Rotor Imbalance")
            ]
            self.active_fault = random.choice(faults)
            self.fault_severity = 0.1
            logger.warning(f"[{self.machine_id}] Started Fault Progression: {self.active_fault[1]}")
            
    def generate_reading(self) -> Dict[str, Any]:
        self.ticks_in_mode += 1
        if self.ticks_in_mode >= self.mode_duration:
            self.transition_mode()
            
        reading = {"machine_id": self.machine_id}
        
        if self.mode == "Normal":
            # Small gaussian noise
            for k, v in self.nominals.items():
                noise = v * 0.02
                self.current[k] = max(0.0, random.gauss(v, noise))
                
        elif self.mode == "Fluctuation":
            # Sinusoidal drift
            import math
            phase = self.ticks_in_mode / 5.0
            for k, v in self.nominals.items():
                noise = v * 0.05
                self.current[k] = max(0.0, v + math.sin(phase) * noise)
                
        elif self.mode == "Stressed":
            # Higher values, more variance
            for k, v in self.nominals.items():
                noise = v * 0.08
                self.current[k] = max(0.0, random.gauss(v * 1.1, noise))
                
        elif self.mode == "Recovery":
            # Lerp back to nominal
            for k, v in self.nominals.items():
                self.current[k] = self.current[k] + (v - self.current[k]) * 0.2
                
        elif self.mode == "FaultProgression":
            # Linearly increase severity up to 1.0
            self.fault_severity = min(1.0, self.fault_severity + 0.01)
            
            # Base noise
            for k, v in self.nominals.items():
                noise = v * 0.03
                self.current[k] = max(0.0, random.gauss(v, noise))
                
            # Apply severe deviation to the faulted metric
            fault_metric, _ = self.active_fault
            base = self.nominals[fault_metric]
            
            # Different fault signatures
            if fault_metric == "vibration":
                # Exponential increase for bearing wear
                multiplier = 1.0 + (3.0 * self.fault_severity**2)
                self.current[fault_metric] = base * multiplier
            elif fault_metric == "temperature":
                # Linear increase for overheating
                self.current[fault_metric] = base + (30.0 * self.fault_severity)
            elif fault_metric == "pressure":
                # Drops for leak
                self.current[fault_metric] = max(0.0, base - (base * 0.6 * self.fault_severity))
            elif fault_metric == "voltage":
                # High variance for instability
                noise = base * 0.15 * self.fault_severity
                self.current[fault_metric] = random.gauss(base, noise)
            elif fault_metric == "rpm":
                # Drops and fluctuates for imbalance
                self.current[fault_metric] = base - (base * 0.3 * self.fault_severity)

        # Ensure realistic constraints and package reading
        reading["temperature"] = round(self.current["temperature"], 2)
        reading["pressure"] = round(self.current["pressure"], 2)
        reading["vibration"] = round(self.current["vibration"], 3)
        reading["voltage"] = round(self.current["voltage"], 2)
        reading["rpm"] = round(self.current["rpm"], 1)
        reading["current"] = round(self.current.get("current", 10.0), 2)
        reading["humidity"] = round(max(0.0, min(100.0, random.gauss(50.0, 5.0))), 2)
        
        return reading

async def send_data(client: httpx.AsyncClient, data: dict):
    try:
        resp = await client.post(API_URL, json=data, timeout=3.0)
        if resp.status_code != 200:
            logger.error(f"Failed to ingest: {resp.text}")
    except Exception as e:
        logger.error(f"Connection error: {e}")

async def main():
    logger.info("Starting Phase 2 ML IoT Simulator...")
    
    with open("machines_config.json") as f:
        config = json.load(f)
        
    machines = [VirtualMachine(m) for m in config["machines"]]
    
    async with httpx.AsyncClient() as client:
        while True:
            tasks = []
            for m in machines:
                data = m.generate_reading()
                tasks.append(send_data(client, data))
                
            await asyncio.gather(*tasks)
            await asyncio.sleep(2.0) # 2 seconds tick rate

if __name__ == "__main__":
    asyncio.run(main())
