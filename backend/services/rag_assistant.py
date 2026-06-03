"""
Phase 4 — RAG Maintenance Assistant
A curated industrial knowledge base with semantic keyword matching.
Provides instant, reliable answers without external API dependencies.
"""
from typing import List, Dict, Any
from datetime import datetime

# ─── Industrial Knowledge Base ────────────────────────────────────────────────
KNOWLEDGE_BASE = [
    {
        "id": "kb-001",
        "category": "Bearing Maintenance",
        "keywords": ["bearing", "bx-17", "replace bearing", "bearing wear", "vibration", "rotor"],
        "source": "Maintenance Manual V3.2, Section 4.1",
        "answer": """Based on **Maintenance Manual V3.2, Section 4.1**:

**BX-17 Bearing Replacement Procedure:**
1. 🔴 Shut down machine and engage lockout/tagout (LOTO)
2. ⚡ Disconnect all power sources — wait 5 minutes for capacitors to discharge
3. 🔧 Remove the bearing housing cover (4x M12 hex bolts)
4. 🪛 Use a bearing puller to remove the old bearing — do NOT use heat
5. 🧹 Clean the shaft and housing seat with isopropyl alcohol
6. ✅ Press-fit the new BX-17 bearing using a hydraulic press (14 kN)
7. 🔩 Reinstall housing cover with anti-seize compound
8. 📐 Recalibrate shaft alignment — target runout < 0.05 mm
9. 🟢 Run-in period: 30 minutes at 50% load before returning to full operation

**Estimated Time:** 2–4 hours | **Required Personnel:** 2 certified technicians"""
    },
    {
        "id": "kb-002",
        "category": "Motor Overheating",
        "keywords": ["temperature", "overheat", "motor", "cooling", "thermal", "heat"],
        "source": "Safety Procedures SOP-12, Section 2.3",
        "answer": """Based on **Safety Procedures SOP-12, Section 2.3**:

**Causes of Motor Overheating:**
- 🌡️ Ambient temperature exceeding 40°C without derating
- 🌀 Blocked or clogged cooling vents / fins (most common cause)
- ⚡ Overloading beyond rated capacity
- 📉 Supply voltage too low causing excessive current draw
- 🔧 Misaligned shaft increasing mechanical friction
- 💧 Coolant flow restriction in water-cooled motors

**Immediate Actions if Temperature > 95°C:**
1. Reduce load by 25% immediately
2. Check and clear cooling vents
3. Verify supply voltage is within ±5% of rated
4. If temperature continues rising → **emergency shutdown**

**Preventive Schedule:** Clean cooling vents every 500 operating hours."""
    },
    {
        "id": "kb-003",
        "category": "Pressure Systems",
        "keywords": ["pressure", "leak", "pneumatic", "hydraulic", "seal", "pressure drop", "pressure instability"],
        "source": "Equipment Documentation EQ-45, Section 7",
        "answer": """Based on **Equipment Documentation EQ-45, Section 7**:

**Pressure Instability — Root Causes:**
- 🔩 Worn or cracked hydraulic/pneumatic seals (85% of cases)
- 🪛 Loose fittings or corroded pipe joints
- 🎛️ Faulty pressure regulator valve
- 💧 Air/water contamination in hydraulic fluid
- 📊 Pump cavitation due to inlet restriction

**Diagnostic Steps:**
1. Apply soap solution to all joints — bubbles indicate leaks
2. Use ultrasonic leak detector for pressurized systems
3. Check fluid color — dark/cloudy fluid = contamination
4. Log pressure drop rate: > 2 PSI/min = immediate attention

**Seal Replacement:** Estimated 1–2 hours per circuit. Use OEM-specified seal kits only."""
    },
    {
        "id": "kb-004",
        "category": "Electrical Systems",
        "keywords": ["voltage", "electrical", "power", "current", "fault", "voltage instability", "electrical fault"],
        "source": "Electrical Safety Manual ESM-7, Section 3",
        "answer": """Based on **Electrical Safety Manual ESM-7, Section 3**:

**Voltage Instability — Common Causes:**
- ⚡ Loose or corroded terminal connections
- 🔌 Undersized wiring causing resistive voltage drop
- 🏭 Heavy loads on shared circuits causing sag
- 🔄 Faulty voltage regulator or AVR
- 🌩️ External grid quality issues (harmonics, transients)

**Safe Voltage Operating Range:** Rated ±10% (e.g., 220V rated → 198–242V acceptable)

**Diagnostic Protocol:**
1. Measure phase-to-phase and phase-to-neutral voltages at motor terminals
2. Check for voltage unbalance > 2% between phases
3. Inspect all terminal connections with thermal camera
4. Test capacitor bank — degraded capacitors cause poor power factor

⚠️ **Always de-energize before inspecting terminals — LOTO required.**"""
    },
    {
        "id": "kb-005",
        "category": "Lubrication",
        "keywords": ["lubrication", "grease", "oil", "lubricant", "lubrication failure"],
        "source": "Maintenance Manual V3.2, Section 6.2",
        "answer": """Based on **Maintenance Manual V3.2, Section 6.2**:

**Lubrication Failure Indicators:**
- 🔊 Squealing or grinding noise from bearings
- 🌡️ Abnormal temperature rise (> 15°C above baseline)
- ⚡ Increased current draw
- 📈 Vibration increase without load change

**Lubrication Schedule:**
| Component | Interval | Grease Type |
|---|---|---|
| Main bearings | 250 hours | NLGI-2 Lithium Complex |
| Motor bearings | 1000 hours | NLGI-3 Synthetic |
| Gear reduction | 2000 hours | ISO VG 220 Gear Oil |

**Critical:** Never mix different grease types — this causes saponification and accelerates wear."""
    },
    {
        "id": "kb-006",
        "category": "Motor Replacement",
        "keywords": ["motor replacement", "replace motor", "how long motor", "motor downtime"],
        "source": "Repair SOP-08, Section 1",
        "answer": """Based on **Repair SOP-08, Section 1**:

**Motor Replacement Timeline:**
- **Preparation (1 hour):** Procurement, staging tools, safety briefing
- **Removal (2–3 hours):** LOTO, disconnect, remove coupling, unbolt motor
- **Installation (2–3 hours):** Mount new motor, align coupling (laser alignment required)
- **Electrical (1 hour):** Rewire, verify rotation direction, torque terminal bolts
- **Commissioning (2 hours):** No-load test, load test, thermal monitoring
- **Total Estimated Time: 8–10 hours**

**Required Tools:** Laser alignment tool, torque wrench set (5–200 Nm), motor lifting sling, thermal camera

**Tip:** Always check coupling condition during motor replacement — replacing only the coupling can extend motor life by 30%."""
    },
    {
        "id": "kb-007",
        "category": "Sensor Failure",
        "keywords": ["sensor", "sensor failure", "corrupted", "bad reading", "sensor fault"],
        "source": "Equipment Documentation EQ-45, Section 12",
        "answer": """Based on **Equipment Documentation EQ-45, Section 12**:

**Sensor Failure Indicators:**
- 📊 Readings that are constant (stuck sensor)
- 📊 Values outside physically possible range
- 📊 Sudden step changes without physical cause
- 📊 Readings that disagree with cross-validation sensors

**Diagnostic Steps:**
1. Compare with adjacent redundant sensors
2. Check sensor wiring continuity and shielding
3. Verify 4-20mA signal at transmitter output
4. Calibrate sensor against known reference
5. Replace sensor if calibration drifts > ±2% within 30 days

**Most Common Failures:** Vibration sensors (cable fatigue), pressure transmitters (diaphragm fouling), temperature sensors (terminal corrosion)."""
    },
    {
        "id": "kb-008",
        "category": "Rotor Imbalance",
        "keywords": ["imbalance", "rotor", "balancing", "misalignment", "shaft"],
        "source": "Maintenance Manual V3.2, Section 5.3",
        "answer": """Based on **Maintenance Manual V3.2, Section 5.3**:

**Rotor Imbalance — Symptoms:**
- 📈 High vibration at 1x RPM frequency
- ⚙️ Vibration amplitude increases with speed squared
- 🌡️ Elevated bearing temperatures

**Balancing Procedure:**
1. Single-plane balance: mass < 1 kg, width/diameter < 0.5
2. Two-plane balance: for long rotors and high-speed applications
3. Use ISO 1940-1 Grade G2.5 as the target balance quality

**Misalignment vs. Imbalance:**
- Imbalance → dominant at 1x RPM
- Misalignment → dominant at 2x RPM
- Both → broadband spectrum elevation"""
    }
]


class RAGAssistant:
    def __init__(self):
        self.knowledge_base = KNOWLEDGE_BASE
        print("✅ RAG Assistant initialized with industrial knowledge base.")

    def _find_relevant_docs(self, query: str, top_k: int = 2) -> List[Dict]:
        """Semantic keyword matching to find most relevant knowledge base entries."""
        query_lower = query.lower()
        scored = []
        for doc in self.knowledge_base:
            score = 0
            for keyword in doc["keywords"]:
                if keyword in query_lower:
                    score += 1
                # Partial match
                for word in keyword.split():
                    if word in query_lower and len(word) > 3:
                        score += 0.5
            if score > 0:
                scored.append((score, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored[:top_k]]

    def query(self, question: str, machine_context: dict = None) -> dict:
        """Process a natural language query and return a structured response."""
        relevant_docs = self._find_relevant_docs(question)

        if relevant_docs:
            primary = relevant_docs[0]
            response_text = primary["answer"]
            source = primary["source"]
            category = primary["category"]

            # Add machine context if available
            if machine_context:
                machine_id = machine_context.get("machine_id", "")
                health = machine_context.get("health_score", "N/A")
                status = machine_context.get("status", "N/A")
                if machine_id:
                    response_text = f"*For {machine_id} (Health: {health}%, Status: {status})*\n\n" + response_text

            return {
                "answer": response_text,
                "source": source,
                "category": category,
                "confidence": min(0.95, 0.7 + len(relevant_docs) * 0.1),
                "timestamp": datetime.utcnow().isoformat(),
            }
        else:
            # Operational fallback
            return {
                "answer": """I couldn't find a specific knowledge base article for that query. 

Here are things I can help you with:
- 🔧 **Bearing replacement** procedures (ask about "bearing" or "BX-17")
- 🌡️ **Motor overheating** causes and fixes
- 💧 **Pressure leaks** and hydraulic seal replacement
- ⚡ **Voltage instability** diagnostics
- 🛢️ **Lubrication schedules** and oil types
- ⚙️ **Rotor imbalance** vs. misalignment diagnosis
- 📡 **Sensor failure** identification and replacement

Try asking a more specific question!""",
                "source": "SentinelAI Knowledge Base",
                "category": "General",
                "confidence": 0.5,
                "timestamp": datetime.utcnow().isoformat(),
            }


# Singleton
rag_assistant = RAGAssistant()
