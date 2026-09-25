# Fynd Traceability – Backend API Service

High-performance, secure backend REST API for the **Fynd Traceability – End-to-End Buyer Traceability Portal**. Built with Node.js, Express.js, PostgreSQL, and multi-provider AI synthesis for manufacturing digital thread auditing.

---

## 1. Project Overview

Manufacturing systems require absolute certainty regarding product provenance. The Fynd Traceability backend exposes high-throughput, parameterized REST endpoints allowing buyers, field engineers, and quality assurance auditors to trace every unit from sub-tier silicon lots to final shipping cartons.

---

## 2. Problem Statement

Modern hardware manufacturing involves fragmented supply chains:
- Surface Mount Technology (SMT) pick-and-place lines, wave solder ovens, boundary scan benches, and automated optical inspection (AOI) systems typically log into disparate silos.
- When an anomaly or defect occurs (e.g., solder bridging or component misplacement), traceability records are often incomplete or hard to audit.
- Customers and buyers require a single source of truth to verify compliance with **ISO 9001:2015** and **IPC-A-610 Class 3 / IPC-7711/7721** standards.

---

## 3. Key Features

- **Consolidated Digital Thread API**: Combines product metadata, Bill of Materials (BOM) genealogy, station route history, operator signoffs, in-circuit test measurements, non-conformance defects, rework audit trails, and logistics dispatch into a single fast lookup.
- **Sub-Millisecond Querying**: Indexed PostgreSQL lookups on `serial_number`.
- **Multi-Provider AI Orchestration**: Modular AI synthesis layer supporting Gemini (Primary) and Groq (Fallback) with automatic provider fallback, timeout protection, exponential backoff, and strict factual anti-hallucination prompting.
- **Intelligent Caching**: Tiered caching architecture utilizing Redis with zero-configuration In-Memory fallback.
- **Enterprise Security**: Helmet HTTP protection, CORS isolation, parameterized SQL queries, and distinct rate-limit tiers for operational vs. AI APIs.

---

## 4. Architecture

```text
HTTP Request (Client / Frontend)
       │
       ▼
   Rate Limiter (express-rate-limit)
       │
       ▼
  Input Validation (Regex & Schema)
       │
       ▼
  Express Routes (/api/traceability, /api/products, /api/ai)
       │
       ▼
  Controllers (Request/Response Mapping)
       │
       ▼
  Services Layer
   ├── TraceabilityService  ───►  PostgreSQL Pool (pg)
   ├── ProductService       ───►  PostgreSQL Pool (pg)
   ├── CacheService         ───►  Redis / Memory Cache
   └── ProviderManager      ───►  Gemini ──► Groq Fallback
```

---

## 5. Technology Stack

- **Runtime**: Node.js (v18+)
- **Server Framework**: Express.js (v4)
- **Database**: PostgreSQL (v14+)
- **Driver**: `pg` (node-postgres)
- **Caching**: Redis client with transparent In-Memory Map fallback
- **Security**: Helmet, CORS, Express-Rate-Limit
- **AI Integration**: Axios targeting Google Gemini and Groq REST APIs
- **Testing**: Jest + Supertest (100% automated test suite)

---

## 6. Database Schema & Rationale

### Why PostgreSQL Was Chosen Over NoSQL / MongoDB
Manufacturing traceability data is inherently **relational and hierarchical**:
- Components belong to products.
- Route logs link specific products to fixed stations and certified operators.
- Rework actions remediate specific defects identified at specific test stations.
- Strict relational constraints (`FOREIGN KEY ... REFERENCES ... ON DELETE CASCADE`), `UNIQUE` serial identifiers, and `NOT NULL` constraints guarantee ACID data integrity.
- B-Tree indexes on `products(serial_number)` allow fast lookups even across millions of manufactured units.

### Entity Relationship Overview

```text
products (id, serial_number [UNIQUE, INDEXED], product_code, product_name, batch_number, manufacturing_date, status)
   ├── components (id, product_id [FK], component_name, component_code, lot_number, supplier, quantity)
   ├── route_logs (id, product_id [FK], station_id [FK], operator_id [FK], operation_name, start_time, end_time, result)
   │      ├── stations (id, station_code [UNIQUE], station_name, line_name)
   │      └── operators (id, employee_code [UNIQUE], name, role)
   ├── defects (id, product_id [FK], station_id [FK], defect_code, description, severity, detected_at, status)
   │      └── reworks (id, defect_id [FK], operator_id [FK], action_taken, started_at, completed_at, result)
   ├── inspections (id, product_id [FK], inspector_name, inspection_type, voltage, current, temperature, result, inspected_at)
   └── shipments (id, product_id [FK], shipment_id [UNIQUE], carton_number, destination, shipment_date, status)
```

---

## 7. API Documentation

### 7.1 Health Check
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "OK",
  "database": "connected"
}
```

### 7.2 Main Traceability Dossier
```http
GET /api/traceability/:serialNumber
```
**Example:** `GET /api/traceability/SN-2026-001245`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "serial_number": "SN-2026-001245",
      "product_code": "EGW-5000-X",
      "product_name": "Industrial IoT Edge Gateway Pro",
      "batch_number": "BATCH-2026-04B",
      "manufacturing_date": "2026-02-14",
      "status": "Dispatched"
    },
    "components": [
      {
        "id": 1,
        "component_name": "Multi-layer Master PCB",
        "component_code": "PCB-001-HQ",
        "lot_number": "LOT-PCB-102",
        "supplier": "ABC Electronics Ltd.",
        "quantity": 1
      }
    ],
    "productionHistory": [
      {
        "id": 1,
        "operation_name": "Component SMT Assembly",
        "start_time": "2026-02-14T07:45:00.000Z",
        "end_time": "2026-02-14T08:30:00.000Z",
        "result": "completed",
        "station_name": "Surface Mount Pick & Place 01",
        "operator_name": "Marcus Vance"
      }
    ],
    "defects": [],
    "rework": [],
    "inspections": [
      {
        "id": 1,
        "inspector_name": "Sarah Jenkins (QC-109)",
        "voltage": "12.04",
        "current": "342.00",
        "temperature": "41.80",
        "result": "PASSED"
      }
    ],
    "shipment": {
      "shipment_id": "SHIP-EU-2026-8841",
      "carton_number": "CTN-9022-A",
      "destination": "Rotterdam Distribution Center, Netherlands",
      "status": "In Transit"
    }
  }
}
```

### 7.3 Product Sub-Resources
- `GET /api/products` — List registered units
- `GET /api/products/:id` — Single unit by ID
- `GET /api/products/:id/components` — BOM components
- `GET /api/products/:id/route-history` — Journey station logs
- `GET /api/products/:id/defects` — Defect flags
- `GET /api/products/:id/inspections` — QA test readings
- `GET /api/products/:id/shipment` — Dispatch and carton manifest

### 7.4 AI Manufacturing Summary
```http
POST /api/ai/traceability-summary
```
**Request Body:**
```json
{
  "serialNumber": "SN-2026-001245"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "summary": "Unit SN-2026-001245 completed SMT assembly, automated soldering, and boundary-scan validation with zero defects. All parametric readings verified within Class 3 tolerance, and the unit is dispatched in transit to Rotterdam.",
  "cached": false,
  "provider": "groq"
}
```

---

## 8. AI Provider Architecture & Factual Integrity

### Why AI is Optional and Not Part of the Core Traceability Logic
1. **Source of Truth Integrity**: Regulatory frameworks (FDA, FAA, ISO) mandate immutable auditable records. AI must never generate, mutate, or guess manufacturing history.
2. **Deterministic Reliability**: If external LLM providers experience outages or latency spikes, factory floor scanning and shipment dispatch continue without interruption.
3. **Strict Anti-Hallucination Prompting**: When generating summaries, the backend extracts the verified SQL records, builds a closed-world context prompt, and instructs the LLM: *"Strictly summarize ONLY the provided database facts. DO NOT invent or extrapolate facts."*

### Provider Fallback Mechanism
```text
Primary Provider (Configured in AI_PRIMARY_PROVIDER, default: Gemini)
       │
    [Failure / Timeout / Rate Limit]
       ▼
Secondary Provider (Configured in AI_SECONDARY_PROVIDER, default: Groq)
       │
    [All External Keys Missing or Exhausted]
       ▼
Deterministic Rule-Based Synthesizer (Zero-Crash Fallback)
```

---

## 9. Caching Strategy

- AI summaries are cached under `traceability-ai:<SERIAL>` with a configurable TTL (`AI_CACHE_TTL`, default 3600 seconds).
- Before calling external LLMs, the system checks Redis / Memory cache. Cache hits return in `< 2ms` with zero token consumption.

---

## 10. Security & Protection

- **SQL Injection Prevention**: 100% of database queries use parameterized SQL (`$1`, `$2`).
- **Rate Limiting**:
  - Operational APIs: 100 requests / 15 minutes per IP.
  - AI APIs: 20 requests / 15 minutes per IP.
- **Input Sanitization**: Strict alphanumeric regex checks for serial numbers (`/^[A-Za-z0-9_-]{3,64}$/`).
- **Credential Protection**: Database passwords and API keys are strictly masked and never returned in error responses.

---

## 11. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/fynd_traceability` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `GROQ_API_KEY` | Groq API key for Llama fallback | `""` |
| `GEMINI_API_KEY` | Google Gemini API key | `""` |
| `AI_PRIMARY_PROVIDER` | First-choice AI provider | `gemini` |
| `AI_SECONDARY_PROVIDER` | Fallback AI provider | `groq` |
| `AI_CACHE_TTL` | Cache duration in seconds | `3600` |
| `REDIS_URL` | Optional Redis URL | `""` |

---

## 12. Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Records
```bash
npm run db:setup
```

### 3. Run in Development Mode
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### 4. Run Automated Test Suite
```bash
npm test
```
All unit and integration tests run in memory without requiring external AI keys.
