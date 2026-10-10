# PolicyPulse AI
> **Intelligent Customer Complaint Response Assistant Grounded in Enterprise Policy**

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TypeScript%20%7C%20TailwindCSS-blue)](#)
[![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI%20%7C%20Pydantic-green)](#)
[![Database](https://img.shields.io/badge/Data-Supabase%20%7C%20pgvector%20%7C%20Postgres%20FTS-emerald)](#)
[![Safety](https://img.shields.io/badge/Guardrails-Human--in--the--Loop%20%7C%20Zero%20Unauthorized%20Commitments-red)](#)

---

## 1. Executive Overview

Support teams lose critical hours manually cross-referencing customer complaints with fragmented enterprise policy manuals. When generic LLMs are deployed, they frequently hallucinate or make **unauthorized financial and contractual commitments** (e.g., unauthorized refunds, warranty waivers) that incur severe corporate liability.

**PolicyPulse AI** solves this with an enterprise-grade AI co-pilot designed for customer support teams:
1. **Multi-Concern Decomposition**: Breaks complex, emotionally charged grievances into atomic sub-issues.
2. **Hybrid Policy Retrieval (RRF)**: Merges dense vector embeddings (`pgvector`) with lexical full-text search (`tsvector`) via Reciprocal Rank Fusion ($k=60$).
3. **Transparent Evidence Citations**: Direct clause references (`Clause 3.2`, page numbers, exact excerpts) ground every response claim.
4. **Unsupported-Commitment Blocker**: Deterministic guardrails flag unauthorized monetary or exception promises before agent dispatch.
5. **Tone Customization Engine**: Switch seamlessly between *Empathetic*, *Concise*, and *Formal* styles without altering policy bounds.
6. **Human-in-the-Loop Studio**: Agents inspect evidence, edit drafts, verify guardrails, and authorize final dispatch.

---

## 2. Architecture & Technology Stack

```
Frontend (Vercel)                    Backend (Render)                    Database & Storage (Supabase)
┌───────────────────────────┐        ┌───────────────────────────┐       ┌───────────────────────────┐
│ React 18 + Vite + TS      │ ◄────► │ FastAPI (Python 3.11)     │ ◄───► │ Supabase PostgreSQL 15    │
│ Tailwind CSS + shadcn/ui  │  JSON  │ Pydantic v2 Models        │  SQL  │ pgvector (HNSW Index)     │
│ Lucide React Icons        │  REST  │ Hybrid RRF Retriever      │       │ PostgreSQL FTS (GIN Index)│
│ Landing Page + Workspace  │        │ Commitment Guardrails     │       │ Storage (Policy Documents)│
└───────────────────────────┘        └───────────────────────────┘       └───────────────────────────┘
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React.
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2.
- **Database & Retrieval**: Supabase PostgreSQL 15, `pgvector` (HNSW indexing), PostgreSQL Full-Text Search, Reciprocal Rank Fusion.
- **Target Deployments**: Frontend on Vercel, Backend on Render, Database on Supabase.

---

## 3. Repository Structure

```
├── API_SPEC.md              # Formal REST API contract & schemas
├── ARCHITECTURE.md          # Multi-layer system design & topology
├── DATABASE_SCHEMA.md       # PostgreSQL DDL, pgvector indexes & RRF function
├── DEPLOYMENT.md            # Cloud runbook for Vercel, Render & Supabase
├── PRD.md                   # Product Requirements Document
├── RAG_PIPELINE.md          # Chunking, hybrid retrieval & generation rules
├── README.md                # Project documentation & local run guide
├── SAFETY_AND_VALIDATION.md # Guardrails, commitment blocker & audit trail
├── TESTING_AND_EVALUATION.md# Quality benchmarks & test scenarios
├── .env.example             # Environment variables template
│
├── backend/                 # FastAPI Python backend service
│   ├── main.py              # Application entrypoint & routes
│   ├── app/
│   │   ├── models/          # Pydantic schemas (synchronized with API_SPEC.md)
│   │   ├── services/        # Decomposer, Retriever, Guardrails, Generator
│   │   └── data/            # Active policy documents & sample complaints
│   └── requirements.txt     # Python backend dependencies
│
├── src/                     # React + Vite TypeScript frontend
│   ├── components/
│   │   ├── landing/         # Marketing landing page (MotionSites visual style)
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── InteractiveDemo.tsx
│   │   │   ├── CoreCapabilities.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── EvidencePanelPreview.tsx
│   │   │   └── Footer.tsx
│   │   ├── workspace/       # Agent Review Studio
│   │   │   ├── WorkspaceLayout.tsx
│   │   │   ├── TicketSidebar.tsx
│   │   │   ├── ComplaintHeader.tsx
│   │   │   ├── DecomposedConcerns.tsx
│   │   │   ├── EvidenceViewer.tsx
│   │   │   ├── GuardrailBanner.tsx
│   │   │   ├── DraftEditor.tsx
│   │   │   └── DispatchModal.tsx
│   │   └── ui/              # shadcn/ui design primitives
│   ├── services/            # Typed API client with seamless demo fallback
│   ├── types/               # TypeScript interfaces matching API_SPEC.md
│   ├── App.tsx              # Root application router / view controller
│   ├── main.tsx             # React entrypoint
│   └── index.css            # Tailwind directives & design tokens
│
├── index.html               # HTML entrypoint
├── package.json             # Frontend dependencies & scripts
├── tailwind.config.js       # Tailwind theme & animation configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

---

## 4. Local Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on v22+)
- **npm**: v9+
- **Python**: v3.10+ (for FastAPI backend in `AI-SupportSystem`)

### Step 1: Start the Backend Service
From the backend repository root (`AI-SupportSystem`):
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation and OpenAPI specifications are available at **`http://localhost:8000/docs`**.  
Root health check: **`http://localhost:8000/health`**.

### Step 2: Configure and Start the Frontend
From the frontend repository (`AI_Assistant-customer_support-`):
```bash
cp .env.example .env
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

The frontend connects to the backend at `http://localhost:8000` (or the configured `VITE_API_BASE_URL`).
If the backend is not running, the application gracefully indicates connection status in the header and falls back to illustrative benchmark scenarios.

---

## 5. Key Verification Flows

1. **Complaint Submission & Inbound Intake**:
   - Click `Intake New Complaint` in the sidebar to submit arbitrary customer statements directly to `POST /api/v1/complaints`.
   - The backend runs PII sanitization, adversarial prompt injection checks, multi-concern decomposition, and pgvector hybrid retrieval.
2. **Issue Decomposition & Policy Citations**:
   - Inspect individual decomposed issues with eligibility statuses (`covered`, `partially_covered`, `uncovered`, `prohibited`, `conflict`, `needs_human_review`).
   - Click an issue to view policy evidence citations, exact excerpts, page numbers, and section paths.
3. **Draft Generation & Tone Variations**:
   - View grounded draft response generated by Gemini and anchored to retrieved policy clauses.
   - Switch between *Empathetic*, *Concise*, and *Formal* styles to preview pre-validated tone variations.
4. **Deterministic Commitment Guardrails**:
   - The safety banner displays validation results. Unauthorized monetary or policy concessions are blocked before review.
5. **Human-in-the-Loop Review & Compliance Audit Trail**:
   - The human reviewer can edit the draft response and click `Approve & Dispatch`, `Escalate to Lead`, or `Reject / Reset`.
   - Recorded review decisions are persisted via `POST /api/v1/complaints/{id}/review` into the immutable audit ledger.
   - Click `Audit Trail` in the header to review historical decisions and drafts via `GET /api/v1/complaints/{id}/history`.
   - **Safety Invariant**: Human review approval records decisions in the audit log; customer messages are **never** automatically sent.
6. **Policy Ingestion**:
   - Click `Upload` in the Indexed Policies section of the sidebar to upload PDF, DOCX, or TXT policy documents directly to `POST /api/v1/policies`.

---

## 6. Implementation and Integration Status
- [x] Centralized API client configured with `VITE_API_BASE_URL`.
- [x] Connected complaint submission (`POST /api/v1/complaints`).
- [x] Connected issue analysis and hybrid evidence mapping (`pgvector` + FTS).
- [x] Connected grounded response draft generation and tone variants (`professional`, `empathetic`, `concise`).
- [x] Connected human review decisions (`approved`, `rejected`, `escalated`).
- [x] Connected compliance audit history (`GET /api/v1/complaints/{id}/history`).
- [x] Connected policy manual ingestion (`POST /api/v1/policies`).
- [x] Strict non-automated messaging invariant enforced.
- [x] Clean zero-error build verified locally.
