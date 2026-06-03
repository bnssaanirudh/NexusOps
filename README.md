# Industrial IoT Monitoring Platform — Phase 1

> **Smart Asset Monitoring Foundation** — Real-time Digital Twin platform for industrial machines.

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for full stack)
- OR: Python 3.12+, Node.js 20+, PostgreSQL 15

---

### Option A: Docker Compose (Recommended)

```bash
cd docker
docker-compose up --build
```

Services will be available at:
| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

---

### Option B: Local Development

#### 1. PostgreSQL
```bash
# Start PostgreSQL (Docker-only)
docker run -d --name iot-postgres \
  -e POSTGRES_DB=industrialdb \
  -e POSTGRES_USER=iotuser \
  -e POSTGRES_PASSWORD=iotpassword \
  -p 5432:5432 \
  postgres:15-alpine

# Apply schema
docker exec -i iot-postgres psql -U iotuser industrialdb < database/init.sql
```

#### 2. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 3. Sensor Simulator
```bash
cd sensor-simulator
pip install -r requirements.txt
python simulator.py
```

#### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
project-root/
├── frontend/              # Next.js 14 + TypeScript + TailwindCSS
│   ├── app/
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── machines/
│   │   │   ├── page.tsx   # Machine management table
│   │   │   └── [id]/      # Machine detail + Digital Twin
│   ├── components/        # Reusable UI components
│   └── lib/               # API client + WebSocket hook + types
│
├── backend/               # FastAPI Python backend
│   ├── main.py            # App entry + WebSocket endpoints
│   ├── models.py          # SQLAlchemy ORM models
│   ├── schemas.py         # Pydantic validation
│   ├── routers/           # API route handlers
│   │   ├── machines.py    # GET/POST/PUT/DELETE /machines
│   │   ├── sensors.py     # POST /sensors/ingest, GET /sensors
│   │   ├── health.py      # GET /health
│   │   └── events.py      # GET /events
│   └── services/
│       ├── health_engine.py   # Health score calculation
│       └── digital_twin.py    # In-memory twin store
│
├── sensor-simulator/      # Python IoT data generator
│   ├── simulator.py       # Main simulation loop
│   └── machines_config.json
│
├── database/
│   └── init.sql           # Schema + seed data
│
└── docker/
    └── docker-compose.yml
```

---

## 🏭 Virtual Machines

| ID | Name | Type | Location |
|---|---|---|---|
| M001 | Compressor Alpha | Air Compressor | Plant A - Bay 1 |
| M002 | Pump Station Beta | Hydraulic Pump | Plant A - Bay 2 |
| M003 | Motor Gamma | Electric Motor | Plant B - Bay 1 |
| M004 | Turbine Delta | Steam Turbine | Plant B - Bay 3 |
| M005 | Conveyor Epsilon | Belt Conveyor | Plant C - Bay 1 |

---

## 📊 Health Score Formula

```
Health Score = 100 - penalties

Penalties (max):
  Vibration   : -30 pts  (most critical)
  Temperature : -25 pts
  Pressure    : -20 pts
  Voltage     : -15 pts
  RPM         : -10 pts

Status Classification:
  90–100 → ✅ Healthy
  70–89  → ⚠️ Warning
  40–69  → 🟠 Risk
   0–39  → 🔴 Critical
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/machines` | List all machines |
| POST | `/machines` | Create machine |
| GET | `/machines/{id}` | Get machine |
| PUT | `/machines/{id}` | Update machine |
| DELETE | `/machines/{id}` | Soft-delete machine |
| GET | `/machines/kpi` | KPI summary counts |
| GET | `/machines/twins` | All Digital Twin states |
| GET | `/machines/{id}/twin` | Single machine twin |
| POST | `/sensors/ingest` | Ingest sensor reading |
| GET | `/sensors` | Paginated readings |
| GET | `/sensors/machine/{id}` | Machine sensor history |
| GET | `/health` | All health summaries |
| GET | `/health/machine/{id}` | Machine health history |
| GET | `/events` | Global event log |
| GET | `/events/machine/{id}` | Machine events |
| WS | `/ws` | Global real-time feed |
| WS | `/ws/machine/{id}` | Per-machine feed |

---

## 🎯 Phase 1 Success Criteria

- ✅ 5 virtual machines simulated
- ✅ Sensor simulator with 4 operating modes
- ✅ WebSocket real-time streaming
- ✅ PostgreSQL storing all data
- ✅ Digital Twin implemented
- ✅ Health score engine with weighted penalties
- ✅ Dashboard with live KPI cards
- ✅ 7 live telemetry charts per machine
- ✅ Machine management (CRUD)
- ✅ Event log auto-generated
- ✅ Search + filter by status
- ✅ Role indicator (Admin/Engineer foundation)
