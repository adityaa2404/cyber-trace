# CyberTrace — Implementation Plan

## 1. What We're Building & Why

**CyberTrace** is a mini SIEM (Security Information and Event Management) platform. It solves the problem of fragmented, manual cybersecurity incident tracking by providing:

- A **centralized web app** where analysts log and manage security incidents
- A **dimensional database** (star schema) optimized for analytics queries
- An **interactive dashboard** showing attack patterns, risk trends, and response metrics
- An **alert system** that flags high-severity or repeated attacks automatically

**Tech Stack:**
| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| Frontend | React 19 + TypeScript + Vite | Fast dev server, type safety, modern React features |
| UI Library | MUI (Material UI) v6 | Built-in DataGrid, DateTimePicker, Autocomplete — perfect for data-heavy SIEM tables |
| Charts | Recharts v2 | Pure React components, lightweight, supports bar/line/pie charts |
| State/Fetching | @tanstack/react-query v5 | Caching, auto-refetch, polling (used for alert notifications) |
| Backend | FastAPI (Python) | Auto-generated Swagger docs, async support, Pydantic validation built-in |
| ORM | SQLAlchemy 2.0 | Modern `Mapped[]` typed models, mature migration support via Alembic |
| Database | MySQL 8.0 (Docker locally, RDS on AWS) | Reliable, well-suited for star schema analytics |
| MySQL Driver | pymysql | Pure Python — avoids C compiler issues on Windows |
| Hosting | AWS EC2 + RDS + CloudWatch | Scalable cloud infrastructure with built-in monitoring |

---

## 2. Project Folder Structure

```
d:\cybertrace\
│
├── docker-compose.yml .......... Runs MySQL 8.0 in a container for local development
├── .gitignore .................. Ignores .env, __pycache__, node_modules, .venv, dist
├── .env.example ................ Template showing all required environment variables
│
├── backend/ .................... Python FastAPI application
│   ├── pyproject.toml .......... Python dependencies & project metadata
│   ├── alembic.ini ............. Database migration configuration
│   │
│   ├── alembic/
│   │   ├── env.py .............. Reads DB URL from app config, imports all models
│   │   └── versions/ .......... Auto-generated migration scripts live here
│   │
│   ├── app/
│   │   ├── main.py ............. FastAPI app creation, CORS setup, mounts all routers
│   │   ├── config.py ........... Reads DATABASE_URL, CORS_ORIGINS, DEBUG from .env
│   │   ├── database.py ......... SQLAlchemy engine, session factory, get_db dependency
│   │   │
│   │   ├── models/ ............. One file per database table (SQLAlchemy ORM)
│   │   │   ├── __init__.py ..... Re-exports all models (needed by Alembic)
│   │   │   ├── date_dim.py .... Pre-populated calendar dimension (2024-2028)
│   │   │   ├── attack_dim.py .. Attack types with category (SQL Injection, Phishing, etc.)
│   │   │   ├── user_dim.py .... Users who report incidents (includes department)
│   │   │   ├── system_dim.py .. IT assets/systems (includes department)
│   │   │   ├── incident_fact.py  CENTRAL TABLE: each row = one incident, FKs to all dims
│   │   │   └── alert.py ....... alert_rule (config) + alert_log (triggered alerts)
│   │   │
│   │   ├── schemas/ ............ Pydantic models for API request/response validation
│   │   │   ├── attack.py ...... AttackType schemas
│   │   │   ├── user.py ........ UserCreate (validates email), UserRead
│   │   │   ├── system.py ...... SystemCreate, SystemRead
│   │   │   ├── incident.py .... SeverityEnum validation, timestamp-not-future check
│   │   │   └── analytics.py ... Response shapes for dashboard chart data
│   │   │
│   │   ├── routers/ ............ API endpoint definitions (one file per resource)
│   │   │   ├── attacks.py ..... /api/attack-types — CRUD
│   │   │   ├── users.py ....... /api/users — CRUD
│   │   │   ├── systems.py ..... /api/systems — CRUD
│   │   │   ├── incidents.py ... /api/incidents — CRUD with filtering & pagination
│   │   │   ├── analytics.py ... /api/analytics/* — aggregation queries for dashboard
│   │   │   └── alerts.py ...... /api/alerts — list, acknowledge, unread count
│   │   │
│   │   ├── services/ ........... Business logic layer (keeps routers thin)
│   │   │   ├── incident_service.py  Auto-derives date_id, triggers alert check
│   │   │   ├── analytics_service.py Star-schema aggregation queries (SQL Core)
│   │   │   └── alert_service.py ... Evaluates alert rules when incidents are created
│   │   │
│   │   └── seed.py ............. Populates date_dim + sample data for development
│   │
│   └── tests/ .................. pytest test suite
│       ├── conftest.py ......... Test DB setup, session fixtures, TestClient
│       ├── test_users.py
│       ├── test_systems.py
│       ├── test_attacks.py
│       ├── test_incidents.py ... Tests CRUD + validation + alert triggering
│       ├── test_analytics.py ... Seeds known data, verifies aggregation results
│       └── test_alerts.py ...... Tests high-severity + repeated-attack detection
│
└── frontend/ ................... React + TypeScript application
    ├── package.json ............ npm dependencies
    ├── vite.config.ts .......... Vite build configuration
    ├── tsconfig.json
    ├── index.html
    ├── .env .................... VITE_API_BASE_URL=http://localhost:8000
    │
    └── src/
        ├── main.tsx ............ React root: BrowserRouter + QueryClientProvider
        ├── App.tsx ............. Layout shell: Sidebar + TopBar + page Outlet
        ├── theme.ts ............ MUI dark theme (security-themed color palette)
        │
        ├── api/ ................ HTTP client wrappers (one file per backend resource)
        │   ├── client.ts ....... Axios instance with baseURL + error interceptor
        │   ├── incidents.ts .... getIncidents(), createIncident(), etc.
        │   ├── users.ts
        │   ├── systems.ts
        │   ├── attacks.ts
        │   ├── analytics.ts .... Fetches all dashboard chart data
        │   └── alerts.ts
        │
        ├── types/ .............. TypeScript interfaces (mirror Pydantic schemas)
        │   ├── incident.ts ..... Incident, SeverityLevel, IncidentStatus
        │   ├── user.ts
        │   ├── system.ts
        │   ├── attack.ts
        │   └── analytics.ts .... Chart data shapes
        │
        ├── components/ ......... Reusable UI building blocks
        │   ├── Layout/
        │   │   ├── Sidebar.tsx . Navigation menu (Dashboard, Incidents, Users, etc.)
        │   │   ├── TopBar.tsx .. App bar with alert notification badge
        │   │   └── Layout.tsx .. Combines Sidebar + TopBar + content area
        │   ├── DataTable.tsx ... Generic sortable/paginated table (wraps MUI DataGrid)
        │   ├── SeverityBadge.tsx  Color-coded chip (green/yellow/orange/red)
        │   ├── ConfirmDialog.tsx  "Are you sure?" dialog for deletes
        │   └── AlertSnackbar.tsx  Toast notification for new alerts
        │
        ├── pages/ .............. One folder per route group
        │   ├── Dashboard/
        │   │   ├── Dashboard.tsx ........... Main analytics page (grid of charts)
        │   │   ├── AttackFrequencyChart.tsx  Horizontal bar: top 10 attack types
        │   │   ├── IncidentTrendChart.tsx .. Line chart: daily/monthly incident count
        │   │   ├── ResponseTimeBySeverity.tsx  Bar chart: avg response time per level
        │   │   ├── IncidentsBySystem.tsx ... Pie chart: distribution across systems
        │   │   └── HighRiskSystems.tsx ..... Table: systems ranked by risk score
        │   │
        │   ├── Incidents/
        │   │   ├── IncidentList.tsx ........ Table with filters (severity, date range)
        │   │   └── IncidentForm.tsx ........ Create/Edit form (shared component)
        │   │
        │   ├── Users/
        │   │   ├── UserList.tsx
        │   │   └── UserForm.tsx
        │   │
        │   ├── Systems/
        │   │   ├── SystemList.tsx
        │   │   └── SystemForm.tsx
        │   │
        │   └── Alerts/
        │       └── AlertList.tsx ........... Alert history + acknowledge button
        │
        ├── hooks/
        │   ├── useApi.ts ........ Generic React Query wrapper for data fetching
        │   └── useAlerts.ts ..... Polls /api/alerts/unacknowledged-count every 30s
        │
        └── utils/
            ├── formatDate.ts .... Date formatting helpers (using dayjs)
            └── constants.ts ..... Severity levels, color mappings, route paths
```

---

## 3. Database Design — Star Schema

The database uses a **star schema** for dimensional modeling. The fact table sits at the center, with dimension tables radiating outward like points of a star. No sub-tables branch off the dimensions (that would be snowflake).

```
                    ┌──────────────────┐
                    │    attack_dim    │  ← Dimension
                    │  (SQL Injection, │
                    │   Phishing, etc.)│
                    │  + category_name │
                    └────────┬─────────┘
                             │ FK
┌────────────┐      ┌───────┴──────────┐      ┌────────────────┐
│  date_dim  │──FK──│  incident_fact   │──FK──│    user_dim     │ ← Dimension
│ (calendar) │      │  (CENTRAL TABLE) │      │  (reporters)    │
└────────────┘      │  One row = one   │      │  + department   │
                    │  security event  │      └────────────────┘
                    └───────┬──────────┘
                            │ FK
                    ┌───────┴──────────┐
                    │   system_dim     │ ← Dimension
                    │ (affected assets)│
                    │  + department    │
                    └──────────────────┘
```

**Why star (not snowflake)?**
- Fewer tables (7 vs 9) → simpler to build and explain
- Fewer JOINs → faster analytical queries
- Department and category info is denormalized INTO the dimension tables

### 3.1 Table Definitions

**attack_dim** (Dimension — attack methods with their category)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| attack_type_id | INT | PK, AUTO_INCREMENT | 1 |
| attack_type_name | VARCHAR(150) | NOT NULL, UNIQUE | "SQL Injection" |
| category_name | VARCHAR(100) | NOT NULL | "Application" |

**user_dim** (Dimension — people who report incidents)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| user_id | INT | PK, AUTO_INCREMENT | 1 |
| name | VARCHAR(150) | NOT NULL | "Aditya Sharma" |
| email | VARCHAR(255) | NOT NULL, UNIQUE | "aditya@company.com" |
| department | VARCHAR(100) | NOT NULL | "IT Security" |

**system_dim** (Dimension — IT assets that get attacked)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| system_id | INT | PK, AUTO_INCREMENT | 1 |
| system_name | VARCHAR(200) | NOT NULL | "prod-web-server-01" |
| system_type | VARCHAR(100) | NOT NULL | "Web Server" |
| department | VARCHAR(100) | NOT NULL | "IT Security" |

**date_dim** (Dimension — pre-populated calendar for time-based analytics)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| date_id | INT | PK (format: YYYYMMDD) | 20260320 |
| full_date | DATE | NOT NULL, UNIQUE | 2026-03-20 |
| day_of_week | TINYINT | 1-7 | 5 (Friday) |
| day_name | VARCHAR(10) | | "Friday" |
| month | TINYINT | | 3 |
| month_name | VARCHAR(10) | | "March" |
| quarter | TINYINT | | 1 |
| year | SMALLINT | | 2026 |
| is_weekend | BOOLEAN | | FALSE |

**incident_fact** (Fact table — THE CENTRAL TABLE, one row per security incident)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| incident_id | INT | PK, AUTO_INCREMENT | 1 |
| attack_type_id | INT | FK → attack_dim, NOT NULL | 1 (SQL Injection) |
| severity | ENUM('Low','Medium','High','Critical') | NOT NULL | "Critical" |
| system_id | INT | FK → system_dim, NOT NULL | 1 |
| reported_by | INT | FK → user_dim, NOT NULL | 1 |
| date_id | INT | FK → date_dim, NOT NULL | 20260320 |
| incident_timestamp | DATETIME | NOT NULL | 2026-03-20 14:30:00 |
| response_time_minutes | INT | NULLABLE (filled on resolution) | 45 |
| description | TEXT | NULLABLE | "SQL injection detected on login endpoint" |
| status | ENUM('Open','Investigating','Resolved','Closed') | NOT NULL, DEFAULT 'Open' | "Investigating" |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP | |

**alert_rule** (Configuration — what triggers an alert)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| rule_id | INT | PK, AUTO_INCREMENT | 1 |
| rule_name | VARCHAR(200) | NOT NULL | "High Severity Incident" |
| rule_type | ENUM('high_severity','repeated_attack') | NOT NULL | "high_severity" |
| threshold | INT | | 3 |
| window_minutes | INT | Time window for repeated checks | 1440 (24 hours) |
| is_active | BOOLEAN | DEFAULT TRUE | TRUE |

**alert_log** (History — every alert that was triggered)
| Column | Type | Constraints | Example |
|--------|------|-------------|---------|
| alert_id | INT | PK, AUTO_INCREMENT | 1 |
| rule_id | INT | FK → alert_rule, NOT NULL | 1 |
| incident_id | INT | FK → incident_fact, NOT NULL | 5 |
| triggered_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | |
| message | TEXT | Human-readable description | "Critical incident #5 on prod-web-server-01" |
| acknowledged | BOOLEAN | DEFAULT FALSE | FALSE |

---

## 4. API Endpoints — Complete Reference

Base URL: `http://localhost:8000/api`

### 4.1 Attack Type Endpoints
| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/attack-types` | List all attack types | — |
| POST | `/attack-types` | Create attack type | `{attack_type_name, category_name}` |
| PATCH | `/attack-types/{id}` | Update | `{attack_type_name?, category_name?}` |
| DELETE | `/attack-types/{id}` | Delete | — |

### 4.2 User Endpoints
| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/users` | List all users | — |
| GET | `/users/{id}` | Get one user | — |
| POST | `/users` | Create user | `{name, email, department}` |
| PATCH | `/users/{id}` | Update user | `{name?, email?, department?}` |
| DELETE | `/users/{id}` | Delete user | — |

### 4.3 System Endpoints
| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/systems` | List all systems | — |
| GET | `/systems/{id}` | Get one system | — |
| POST | `/systems` | Create system | `{system_name, system_type, department}` |
| PATCH | `/systems/{id}` | Update | `{system_name?, system_type?, department?}` |
| DELETE | `/systems/{id}` | Delete | — |

### 4.4 Incident Endpoints (Core Feature)
| Method | Path | Description | Request Body / Query Params |
|--------|------|-------------|---------------------------|
| GET | `/incidents?skip=0&limit=20&severity=High&system_id=1&from_date=2026-01-01&to_date=2026-03-20` | List incidents with pagination & filters | Query params (all optional) |
| GET | `/incidents/{id}` | Get incident with all dimension data joined | — |
| POST | `/incidents` | Create incident (auto-derives date_id, triggers alert check) | `{attack_type_id, severity, system_id, reported_by, incident_timestamp, response_time_minutes?, description?}` |
| PATCH | `/incidents/{id}` | Update incident | Any field from create (all optional) |
| DELETE | `/incidents/{id}` | Delete incident | — |

**Key business logic on POST /incidents:**
1. Extract `date_id` from `incident_timestamp` (e.g., 2026-03-20 → 20260320)
2. Save to database
3. Call `alert_service.evaluate(incident)` → may create alert_log entries

### 4.5 Analytics Endpoints (Dashboard Data)
| Method | Path | Description | Returns |
|--------|------|-------------|---------|
| GET | `/analytics/attack-frequency` | Top 10 attack types by incident count | `[{attack_type, count}, ...]` |
| GET | `/analytics/incident-trends?granularity=daily` | Incident count over time (daily or monthly) | `[{date, count}, ...]` |
| GET | `/analytics/response-time-by-severity` | Average response time per severity level | `[{severity, avg_minutes}, ...]` |
| GET | `/analytics/incidents-by-system` | Incident distribution across systems | `[{system_name, count}, ...]` |
| GET | `/analytics/incidents-by-department` | Incident count per department | `[{department_name, count}, ...]` |
| GET | `/analytics/high-risk-systems` | Systems with most incidents in last 30 days | `[{system_name, count, latest_severity}, ...]` |
| GET | `/analytics/repeated-attacks` | Attack+system combos seen multiple times | `[{attack_type, system_name, count}, ...]` |

**How these queries work:** All analytics use SQL GROUP BY / JOIN against the fact table + dimension tables. This is exactly what the star schema is designed for — each dimension join adds context (names, categories) while the fact table provides the measures (counts, averages).

### 4.6 Alert Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/alerts?acknowledged=false` | List alerts, optionally filter by acknowledged status |
| PATCH | `/alerts/{id}/acknowledge` | Mark an alert as acknowledged |
| GET | `/alerts/unacknowledged-count` | Returns `{count: N}` — used for badge in UI |

---

## 5. Frontend Pages & Components

### 5.1 Page Routing
| Route | Page Component | What It Shows |
|-------|---------------|---------------|
| `/` | Dashboard | KPI cards + analytics charts |
| `/incidents` | IncidentList | Sortable/filterable table of all incidents |
| `/incidents/new` | IncidentForm | Form to create a new incident |
| `/incidents/:id/edit` | IncidentForm | Pre-filled form to edit an incident |
| `/users` | UserList | Table of all users |
| `/users/new` | UserForm | Create user form |
| `/users/:id/edit` | UserForm | Edit user form |
| `/systems` | SystemList | Table of all systems |
| `/systems/new` | SystemForm | Create system form |
| `/systems/:id/edit` | SystemForm | Edit system form |
| `/alerts` | AlertList | Alert history with acknowledge buttons |

### 5.2 Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  TopBar                                    [Alert Badge: 3]     │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Sidebar  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│          │  │ Total    │ │ Open     │ │ Avg Resp │ │ Alerts │ │
│ Dashboard│  │ Incidents│ │ Incidents│ │ Time     │ │ Unread │ │
│ Incidents│  │ 142      │ │ 12       │ │ 38 min   │ │ 3      │ │
│ Users    │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│ Systems  │                                                      │
│ Alerts   │  ┌─────────────────────┐ ┌─────────────────────────┐│
│          │  │ Attack Frequency    │ │ Incident Trends         ││
│          │  │ (Horizontal Bar)    │ │ (Line Chart)            ││
│          │  │                     │ │ [Daily] [Monthly]       ││
│          │  └─────────────────────┘ └─────────────────────────┘│
│          │                                                      │
│          │  ┌─────────────────────┐ ┌─────────────────────────┐│
│          │  │ Response Time by    │ │ Incidents by System     ││
│          │  │ Severity (Bar)      │ │ (Pie Chart)             ││
│          │  └─────────────────────┘ └─────────────────────────┘│
│          │                                                      │
│          │  ┌─────────────────────────────────────────────────┐ │
│          │  │ High Risk Systems (Table ranked by risk)        │ │
│          │  └─────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────┘
```

### 5.3 Incident Form Fields
| Field | Component | Validation | Data Source |
|-------|-----------|-----------|-------------|
| Attack Type | MUI Autocomplete | Required | GET /api/attack-types |
| Severity | MUI Select | Required, enum only | Hardcoded: Low/Medium/High/Critical |
| Affected System | MUI Autocomplete | Required | GET /api/systems |
| Reported By | MUI Autocomplete | Required | GET /api/users |
| Timestamp | MUI DateTimePicker | Required, not in future | — |
| Response Time (min) | TextField (number) | Optional, >= 0 | — |
| Description | TextField (multiline) | Optional | — |

### 5.4 Alert Notification Flow
1. `useAlerts` hook polls `GET /api/alerts/unacknowledged-count` every 30 seconds
2. Count > 0 → red badge on "Alerts" in sidebar + TopBar bell icon
3. When count increases → show Snackbar toast: "New alert: {message}"
4. User navigates to `/alerts` → sees full alert list → clicks "Acknowledge"

---

## 6. Implementation Sequence (Step-by-Step Build Order)

### Phase 0: Project Bootstrap
**What:** Set up the project skeleton and development environment.
1. Create root files: `.gitignore`, `docker-compose.yml`, `.env.example`
2. Initialize git repository
3. Create backend scaffold: `pyproject.toml`, virtual environment, install dependencies
4. Create frontend scaffold: Vite + React + TS template, install npm dependencies (MUI, Recharts, Axios, React Query, React Router, dayjs)

### Phase 1: Backend — Database Layer
**What:** Define all database tables and populate them with sample data.
**Build order matters** — each model depends on tables built before it:
1. `config.py` — reads DATABASE_URL, CORS_ORIGINS from `.env`
2. `database.py` — SQLAlchemy engine, session factory, `get_db()` dependency
3. Models in FK-dependency order:
   - `date_dim.py` (no FKs)
   - `attack_dim.py` (no FKs — category_name is a column, not a FK)
   - `user_dim.py` (no FKs — department is a column, not a FK)
   - `system_dim.py` (no FKs — department is a column, not a FK)
   - `incident_fact.py` (FKs → attack_dim, user_dim, system_dim, date_dim)
   - `alert.py` (alert_rule: no FKs; alert_log: FKs → alert_rule + incident_fact)
4. Initialize Alembic, autogenerate migration, run `alembic upgrade head`
5. Write `seed.py`: populate date_dim (2024-2028), attack types, sample users, systems, and 50-100 realistic incidents

### Phase 2: Backend — CRUD APIs
**What:** Build REST endpoints for every entity.
For each entity (departments, attack-categories, attack-types, users, systems, incidents):
1. Create Pydantic schemas: `EntityCreate`, `EntityUpdate` (all Optional), `EntityRead` (with `from_attributes=True`)
2. Create router with GET (list + single), POST, PATCH, DELETE
3. Wire router into `main.py`

**Special handling for incidents:**
- `incident_service.py` auto-derives `date_id` from `incident_timestamp`
- After saving, calls `alert_service.evaluate(incident)` to check alert rules
- Severity validated as strict enum; timestamp validated as not-in-future

### Phase 3: Backend — Analytics & Alerts
**What:** Build the analytical query endpoints and alert mechanism.

Analytics endpoints — all use SQLAlchemy Core `select()` for performance:
- Attack frequency (GROUP BY attack_type, COUNT, TOP 10)
- Incident trends (JOIN date_dim, GROUP BY day/month)
- Response time by severity (GROUP BY severity, AVG)
- Incidents by system/department (GROUP BY, COUNT, JOIN for names)
- High-risk systems (incidents in last 30 days, ranked)
- Repeated attacks (same attack+system above threshold)

Alert service — called synchronously on incident creation:
- Rule 1: If severity is "High" or "Critical" → create alert_log entry
- Rule 2: If same attack_type + system has occurred >= threshold times in window → create alert_log entry

### Phase 4: Frontend — Shell & Navigation
**What:** Build the app frame that all pages live inside.
1. MUI dark theme configuration (security-appropriate colors)
2. Layout component: Sidebar + TopBar + content area (React Router Outlet)
3. Define all routes
4. Build API client layer (Axios + typed wrappers)
5. Build reusable components: DataTable, SeverityBadge, ConfirmDialog, AlertSnackbar

### Phase 5: Frontend — CRUD Pages
**What:** Build the create/read/update/delete interfaces.
1. Incident list page (filterable table) + incident form (create/edit)
2. User list + form pages
3. System list + form pages

### Phase 6: Frontend — Dashboard & Alerts
**What:** Build the analytics dashboard and alert management.
1. KPI summary cards (total incidents, open count, avg response time, unread alerts)
2. Five analytics charts using Recharts (bar, line, pie)
3. High-risk systems table
4. Alert list page with acknowledge functionality
5. Alert polling hook (30-second interval) + notification badge

### Phase 7: Testing
- **Backend:** pytest + httpx TestClient with per-test DB rollback
- **Frontend:** Vitest + React Testing Library for form validation and rendering

### Phase 8: AWS Deployment
| Component | AWS Service | Config |
|-----------|-------------|--------|
| Database | RDS MySQL 8.0 (db.t3.micro) | Private subnet, automated backups |
| Backend | EC2 (t3.small) | Gunicorn + Uvicorn workers behind Nginx |
| Frontend | S3 + CloudFront (or same EC2 Nginx) | `npm run build` → static files |
| Monitoring | CloudWatch | Custom metrics: request count, latency, error rate |
| Security | Security Groups | EC2: 80/443 inbound; RDS: 3306 from EC2 only |

---

## 7. How to Verify Everything Works

1. **Database:** `docker compose up -d` → MySQL on port 3306 ✓
2. **Migrations:** `cd backend && alembic upgrade head` → all tables created ✓
3. **Seed data:** `python -m app.seed` → sample data populated ✓
4. **Backend API:** `uvicorn app.main:app --reload` → Swagger UI at `localhost:8000/docs` ✓
5. **Test CRUD:** Use Swagger to create/read/update/delete an incident ✓
6. **Test alerts:** Create a "Critical" incident → check `GET /api/alerts` returns it ✓
7. **Frontend:** `cd frontend && npm run dev` → UI at `localhost:5173` ✓
8. **Dashboard:** Charts render with data from seed ✓
9. **Full flow:** Create incident in UI → see it in list → see alert notification → dashboard updates ✓
10. **Tests:** `cd backend && pytest` → all green ✓

---

## 8. Key Dependencies (Versions)

**Backend (pyproject.toml):**
```
fastapi >= 0.115.0
uvicorn[standard] >= 0.34.0
sqlalchemy >= 2.0.36
pymysql >= 1.1.0
alembic >= 1.14.0
pydantic >= 2.10.0
pydantic-settings >= 2.7.0
python-dotenv >= 1.0.0
# Dev
pytest >= 8.0
httpx >= 0.28.0
```

**Frontend (package.json):**
```
react: ^19.0
react-dom: ^19.0
react-router-dom: ^7.0
@mui/material: ^6.0
@mui/x-data-grid: ^7.0
@mui/x-date-pickers: ^7.0
@emotion/react: ^11.0
@emotion/styled: ^11.0
@tanstack/react-query: ^5.0
axios: ^1.7
recharts: ^2.14
dayjs: ^1.11
```
