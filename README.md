![NexusOps Banner](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80)

# NexusOps: Autonomous Industrial Reliability Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)

> **A multi-agent operations swarm for zero-downtime manufacturing and machine diagnostics.**

---

## 🛑 The Problem Statement

In modern manufacturing, **reactive maintenance is a multi-billion dollar problem.** 
When industrial machines (like turbines, CNC mills, or heavy-duty motors) fail unexpectedly, it results in catastrophic unplanned downtime, disrupted supply chains, and massive repair costs. 

Current "smart" factories often rely on simple threshold-based alerts (e.g., *“Alert: Temperature > 90°C”*). By the time these alerts trigger, the damage is usually already done. Engineers are left scrambling to diagnose the root cause manually while the factory floor bleeds money by the minute.

## 💡 The Solution: NexusOps

**NexusOps** transforms industrial monitoring from a reactive alarm system into a **proactive, autonomous intelligence platform**. 

By leveraging live-streaming Digital Twins and a Swarm of AI Agents, NexusOps doesn't just tell you *when* a machine is breaking—it predicts the failure before it happens, diagnoses the root cause, calculates the financial impact, and autonomously drafts the repair schedule.

### How it Works (The Multi-Agent Workflow):
1. **Monitoring Agent:** Continuously watches real-time streaming telemetry (vibration, temperature, RPM) to detect statistical anomalies.
2. **Diagnosis Agent:** Correlates anomalies with historical fault patterns (e.g., detecting early-stage *Bearing Wear* vs. *Lubrication Failure*).
3. **Planner Agent:** Calculates the financial risk of failure vs. the cost of early maintenance to propose an optimal repair schedule.
4. **Approval Agent:** Generates a human-readable maintenance ticket and requests executive sign-off.

---

## 🌟 Key Features

* **Real-time Digital Twins:** 1:1 virtual representations of physical assets streaming high-frequency sensor data.
* **Fault Injection Simulation Lab:** A built-in testing environment allowing engineers to manually inject faults (like Pressure Leaks or Rotor Imbalance) and watch the AI swarm react in real-time.
* **Predictive AI Engine:** Calculates Remaining Useful Life (RUL) and provides SHAP-based explainability (showing exactly *why* the AI believes a failure is imminent).
* **NASA-Style Command Center:** A sleek, daylight-industrial UI designed for maximum situational awareness.
* **Executive Impact Dashboard:** Translates engineering metrics into business value (Total Dollars Saved, Downtime Prevented).

---

## 🏗️ Technical Architecture

The platform is designed to be enterprise-ready, containerized, and scalable.

- **Frontend:** Next.js (App Router), Tailwind CSS v4, Framer Motion (for micro-animations & 3D WebGL-style effects), Recharts.
- **Backend:** Python, FastAPI, WebSockets (for real-time streaming).
- **Data Layer:** PostgreSQL (for state, reasoning traces, and ticket management).
- **Simulation Engine:** A detached Python service generating synthetic baseline and degradation telemetry.
- **Infrastructure:** Fully containerized via Docker Compose.

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bnssaanirudh/NexusOps.git
   cd NexusOps
   ```

2. **Start the Infrastructure:**
   Ensure Docker Desktop is running, then execute:
   ```bash
   cd docker
   docker-compose up --build -d
   ```

3. **Access the Platform:**
   - **Frontend (NexusOps UI):** [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎮 The Demo Sequence
To see the true power of NexusOps, visit the `http://localhost:3000/demo` route. This triggers an automated, storytelling sequence that walks through a machine operating normally, degrading via fault injection, and the entire AI Swarm stepping in to save the day!

