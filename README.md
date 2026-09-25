# Fynd Traceability – End-to-End Buyer Traceability Portal

An enterprise-grade manufacturing digital thread and buyer traceability portal built with **React (Frontend)** and **Node.js + Express + PostgreSQL (Backend)**, featuring multi-provider AI manufacturing quality summarization.

---

## 🌟 Architecture Overview

```text
               ┌──────────────────────────────────────────────┐
               │    Frontend (React + Vite + Tailwind CSS)    │
               │  - Dashboard & Traceability Search           │
               │  - Optical QR / Barcode Scanner Modal        │
               │  - Interactive AI Quality Summary Card       │
               └──────────────────────┬───────────────────────┘
                                      │ Axios REST (Port 5000)
                                      ▼
               ┌──────────────────────────────────────────────┐
               │        Backend (Node.js + Express.js)        │
               │  - Rate Limiting (express-rate-limit)        │
               │  - Input Validation (Regex & Schema)         │
               │  - Parameterized Relational Queries          │
               └───────────┬──────────────────────┬───────────┘
                           │                      │
                           ▼                      ▼
               ┌──────────────────────┐ ┌─────────────────────┐
               │ PostgreSQL Database  │ │ Redis / Memory Cache│
               │ - products           │ └─────────┬───────────┘
               │ - components (BOM)   │           │
               │ - route_logs (Lines) │           ▼
               │ - defects & reworks  │ ┌─────────────────────┐
               │ - inspections (QC)   │ │AI Provider Fallback │
               │ - shipments          │ │ Gemini ──► Groq     │
               └──────────────────────┘ └─────────────────────┘
```

---

## 🚀 Key Capabilities

1. **Digital Thread Lifecycle**:
   $$\text{Serial Number} \longrightarrow \text{Product} \longrightarrow \text{Components (BOM)} \longrightarrow \text{Route History} \longrightarrow \text{Quality Parametrics} \longrightarrow \text{Defects / Rework} \longrightarrow \text{Final QC} \longrightarrow \text{Shipment}$$
2. **PostgreSQL Relational Storage**:
   - 9 relational tables with strict foreign keys and indexed serial lookups.
   - ACID guarantee for manufacturing provenance.
3. **Multi-Provider AI Quality Summaries**:
   - Executive quality summaries synthesized strictly from database facts.
   - Fallback chain: **Gemini $\to$ Groq Fallback $\to$ Deterministic Synthesizer**.
   - Zero-hallucination prompt design: LLMs summarize ONLY verified database facts.
4. **Resilient Caching**:
   - Redis caching for AI summaries with automatic transparent In-Memory fallback.
5. **Interactive UI**:
   - Optical barcode camera simulator for instant hackathon demonstrations.
   - Top horizontal milestone progress stepper.
   - Complete defect and IPC-7711/7721 micro-rework audit trail.
   - Printable dossier certificates.

---

## 📂 Project Structure

```
End-to-End Buyer Traceability Portal/
├── README.md
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                       # Main application shell with routes & providers
│       ├── services/
│       │   └── api.js                    # Axios client connecting to http://localhost:5000/api
│       ├── components/
│       │   ├── common/                   # Navbar, Sidebar, StatCard, SearchBar, Scanner
│       │   └── details/                  # Stepper, Overview, BOM, Timeline, QA, Defects, Rework, AI
│       └── pages/                        # Dashboard, TraceabilitySearch, ProductDetails, Recent, About
│
└── backend/
    ├── package.json
    ├── .env.example
    ├── .env
    ├── README.md
    ├── database/
    │   ├── schema.sql                    # PostgreSQL relational schema (9 tables)
    │   ├── seed.sql                      # Realistic manufacturing seed data
    │   └── initDb.js                     # Migration runner (npm run db:setup)
    ├── src/
    │   ├── app.js                        # Express app with Helmet, CORS, Rate Limiters
    │   ├── server.js                     # Server entry point
    │   ├── config/                       # db.js (pg Pool) and env.js
    │   ├── controllers/                  # traceabilityController, productController, aiController
    │   ├── routes/                       # traceabilityRoutes, productRoutes, aiRoutes
    │   ├── services/                     # traceabilityService, aiService, cacheService, providerManager
    │   └── middleware/                   # rateLimiter, validationMiddleware, errorMiddleware
    └── tests/
        ├── health.test.js                # GET /api/health test
        ├── traceability.test.js          # Dossier lookups, 404s, input validation
        └── ai.test.js                    # Mocked AI provider fallback, cache hit/miss tests
```

---

## 🧪 Verified Demonstration Serial Numbers

| Serial Number | Product Name | Status | Scenario Demonstrated |
| :--- | :--- | :--- | :--- |
| **`SN-2026-001245`** | Industrial IoT Edge Gateway Pro | **Dispatched** | **Flawless Run**: Passed all stations first-time, 0 defects, 0 rework, dispatched to Rotterdam. |
| **`SN-2026-001246`** | Smart Edge Controller X1 | **Dispatched** | **Defect & Rework**: Defect `D-104` (Solder Joint Bridge) detected at test bench, reworked by senior specialist under IPC-7711 standards, retested, passed, and dispatched to Stuttgart. |
| **`SN-2026-001247`** | Telemetry Sensor Node Ultra | **In Production** | **In-Progress**: Live unit undergoing continuous RF soak testing on Line Alpha. |

---

## 🏃 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install

# Initialize PostgreSQL Schema & Seed Data (Optional if Postgres is running)
npm run db:setup

# Run automated test suite (11/11 tests pass with zero external dependencies)
npm test

# Start the Backend Server (Port 5000)
npm run dev
```

The backend will be running at **`http://localhost:5000`**.
- Health check: `http://localhost:5000/api/health`
- Traceability: `http://localhost:5000/api/traceability/SN-2026-001245`

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser to explore the dashboard, search console, and interactive QR scanner.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and database connectivity status |
| `GET` | `/api/traceability/:serialNumber` | Complete consolidated product manufacturing dossier |
| `GET` | `/api/products` | List of all registered products |
| `GET` | `/api/products/:id` | Single product record |
| `GET` | `/api/products/:id/components` | Bill of Materials (BOM) genealogy |
| `GET` | `/api/products/:id/route-history` | Station-by-station manufacturing timeline |
| `GET` | `/api/products/:id/defects` | Defect and anomaly records |
| `GET` | `/api/products/:id/inspections` | Parametric QA voltage, current, and temperature measurements |
| `GET` | `/api/products/:id/shipment` | Carton packaging and carrier tracking info |
| `POST` | `/api/ai/traceability-summary` | Executive AI manufacturing summary (cached, rate-limited) |

---

## 🔒 Security & Resilience Highlights

- **Zero SQL Injection**: 100% of queries use parameterized prepared statements (`$1`, `$2`).
- **Rate Limiting**: Operational endpoints limited to 100 req/15min; AI endpoints limited to 20 req/15min.
- **Strict Anti-Hallucination**: AI summaries are synthesized strictly from database facts and never extrapolate missing records.
- **Zero-Crash Offline Fallback**: If PostgreSQL or external AI APIs are unreachable, the system transparently utilizes verified fallback data and in-memory caching.
