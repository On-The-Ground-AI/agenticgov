# Technology Stack

**Project:** AI-Powered Impact Evaluation Tool for Government
**Domain:** RAG-based AI evaluation design assistant
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

For a government-facing AI evaluation tool with RAG architecture, the recommended stack balances proven stability (critical for compliance) with modern AI capabilities. **PostgreSQL with pgvector** eliminates the need for separate vector infrastructure while meeting government data sovereignty requirements. **FastAPI** provides async performance for AI workloads with excellent type safety via Pydantic v2. **React 19 + TypeScript 5.7** with Vitest ensures a maintainable, testable frontend. **Claude API via Anthropic SDK** offers best-in-class reasoning for evaluation methodology recommendations.

---

## Core Technologies

### Frontend Framework
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **React** | 19.2.x | UI framework | React 19 (Dec 2024) adds Actions for async transitions, crucial for streaming AI responses. Server Components ready for future phases. 40M+ weekly downloads, government-proven at scale. |
| **TypeScript** | 5.7.x | Type safety | TS 5.7 (Nov 2024) adds es2024 target, 2.5x faster compilation. Essential for large codebases with government compliance requirements. |
| **Vite** | 6.x | Build tool | 20-30x faster than Webpack for dev, <50ms HMR. Native ESM, esbuild-powered. Industry standard for React in 2026. |

### Backend Framework
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Python** | 3.13 | Runtime | Python 3.13 required for latest Pydantic features. Government ecosystems standardized on Python. |
| **FastAPI** | 0.128.x | API framework | Async-first for LLM streaming, auto-generated OpenAPI docs (compliance requirement), Pydantic v2 integration. 100K+ production deployments. |
| **Pydantic** | 2.12.x | Data validation | Pydantic v2.12+ required by FastAPI 0.126+. Type-safe config, JSON Schema generation for audit trails. 70M+ downloads/month. |
| **Uvicorn** | 0.34.x | ASGI server | Production standard with Gunicorn for multi-worker. Required for FastAPI async support. |

### Database & Vector Store
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **PostgreSQL** | 16.x | Primary database | ACID compliance for government data. Battle-tested, FedRAMP-certified hosting available (AWS RDS, Azure). |
| **pgvector** | 0.7.x | Vector extension | Unified infrastructure (no separate vector DB), hybrid queries (SQL + similarity), government data sovereignty friendly. Production-ready at 110K vectors. |
| **SQLAlchemy** | 2.x | ORM | Async support, type hints, migration-friendly. Standard for Python database access. |
| **Alembic** | 1.18.x | Migrations | Transaction-safe migrations, audit trail of schema changes (compliance requirement). |

### AI/LLM Integration
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Anthropic SDK** | Latest | Claude API client | Official Python SDK with async/sync clients, streaming, tool use, prompt caching (70-80% cost savings on 110K knowledge base), 200K context window. |

---

## Frontend Supporting Libraries

### State Management
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **TanStack Query** | 5.x | Server state | All API calls, caching, background updates. Handles ~80% of state needs. Industry standard for data fetching. |
| **Zustand** | 5.x | Client state | UI preferences, session data, form wizards. 30%+ YoY growth, simpler than Redux. Only when Context insufficient. |
| **React Context** | Built-in | Local state | Theme, auth status, simple shared state. Start here, add libraries only when needed. |

**Rationale:** Do NOT use Redux/Zustand for server data. Use TanStack Query for API state, lightweight stores for UI state only.

### UI & Components
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **assistant-ui** | 0.x | AI chat UI | Pre-built streaming chat, auto-scroll, accessibility. 50K+ monthly downloads, Y Combinator backed. Built for LLM interfaces. |
| **shadcn/ui** | Latest | Component library | Accessible, customizable, TypeScript-native. Copy-paste components (no bloat). Government 508 compliance friendly. |
| **React Hook Form** | 7.x | Form management | Complex evaluation forms with validation. Minimal re-renders, integrates with Pydantic schemas via JSON Schema. |
| **Zod** | 3.x | Client validation | Runtime type checking, schema validation matching backend Pydantic models. |

### Testing
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Vitest** | 3.x | Test runner | 10-20x faster than Jest, native ESM, Vite-integrated. Standard for Vite projects in 2026. |
| **React Testing Library** | 16.x | Component tests | User-focused testing (accessibility, behavior). Government 508 compliance validation. |
| **Playwright** | 1.x | E2E testing | Cross-browser, screenshot comparison for compliance documentation. |

---

## Backend Supporting Libraries

### Security & Authentication
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **fastapi-sso** | 0.x | OAuth2/SAML | Enterprise SSO (Okta, Azure AD, Keycloak). Government requires SAML/OAuth, not username/password. |
| **python-jose** | 3.x | JWT handling | Token validation, signing. Standard for FastAPI auth. |
| **passlib** | 1.7.x | Password hashing | If username/password needed for admin. bcrypt with proper rounds for NIST compliance. |
| **slowapi** | 0.x | Rate limiting | DDoS protection, fair usage. 5-10 req/min for free tier typical. Essential for public-facing gov APIs. |

### CORS & Security Headers
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **starlette.middleware** | Built-in | CORS, security | Use CORSMiddleware (must be first middleware). NO wildcards in production (list specific domains). |
| **fastapi-security** | Built-in | OAuth2, API keys | Built-in security schemes for OpenAPI docs. |

**Critical:** CORSMiddleware must be FIRST middleware or error responses lack CORS headers. List specific origins (no "*" with credentials).

### Logging & Observability
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **structlog** | 25.5.x | Structured logging | JSON logs for compliance audit trails. Machine-readable, searchable. FinTech/gov standard since 2013. |
| **OpenTelemetry** | Latest | Distributed tracing | Trace LLM calls, DB queries, API latency. Government requires observability for SLA compliance. |
| **Sentry** | Latest | Error tracking | Production error monitoring, integrates with OpenTelemetry. FedRAMP-certified hosting available. |

### Configuration Management
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **pydantic-settings** | 2.x | Environment vars | Type-safe config from env vars, .env files, secrets managers. 12-factor app pattern for gov deployments. |

### Testing
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **pytest** | 8.x | Test runner | Industry standard Python testing. |
| **pytest-asyncio** | 0.24.x | Async tests | Required for FastAPI async endpoints. |
| **httpx** | 0.28.x | HTTP client | AsyncClient for API testing, replaces requests for async. |
| **pytest-cov** | 6.x | Coverage reporting | Compliance often requires 80%+ coverage. |

---

## Infrastructure & DevOps

### Containerization
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Docker** | 27.x | Containerization | Consistent dev/prod environments. FedRAMP hosting requires containers. |
| **Docker Compose** | 2.x | Local orchestration | Multi-container local dev (API + DB + pgvector). |

### Deployment
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Gunicorn** | 23.x | WSGI server | Multi-worker process manager for Uvicorn. Production standard. |
| **Nginx** | 1.27.x | Reverse proxy | Static file serving, SSL termination, rate limiting. Gov deployments often require reverse proxy for security. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| **Vector Store** | pgvector | Pinecone | Pinecone: Best performance (30ms p99 latency) but $70/mo minimum, data sovereignty issues for gov. pgvector: Free, data stays in gov-controlled DB, hybrid queries easier. |
| **Vector Store** | pgvector | Weaviate | Weaviate: Great for hybrid search, but separate infrastructure. pgvector: Unified PostgreSQL, simpler ops, sufficient for 110K vectors. |
| **Vector Store** | pgvector | Chroma | Chroma: Good for prototyping but less production-proven. pgvector: Battle-tested, enterprise support available. |
| **Frontend Framework** | React 19 | Vue 3 | Vue: Less gov adoption, smaller talent pool. React: Proven at GSA, USDS, 18F. |
| **Backend Framework** | FastAPI | Flask | Flask: No async native, no auto docs, manual validation. FastAPI: Async-first (LLM streaming), auto OpenAPI docs (compliance), Pydantic validation. |
| **Backend Framework** | FastAPI | Django | Django: Batteries-included but sync-heavy, admin not needed. FastAPI: Lighter, async, better for API-only + AI workloads. |
| **State Management** | TanStack Query | Redux Toolkit | Redux: Overkill for server state, more boilerplate. TanStack Query: Purpose-built for API data, caching, background updates. Redux down to ~10% of new projects. |
| **Build Tool** | Vite | Webpack | Webpack: Slower (20-30x), complex config. Vite: Native ESM, instant HMR, esbuild-powered. |
| **Testing** | Vitest | Jest | Jest: Slower, legacy CJS module issues. Vitest: 10-20x faster, native ESM, Vite-aligned. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Pydantic v1** | Deprecated since FastAPI 0.126.0 (Dec 2025). Python 3.14 incompatible. | Pydantic v2.12+ |
| **Create React App** | Unmaintained since 2023. Slow builds, outdated dependencies. | Vite with React template |
| **Requests library** | Synchronous only, blocks event loop in async code. | httpx (async-compatible) |
| **Redux for API state** | Server state belongs in TanStack Query. Redux adds boilerplate without benefit. | TanStack Query for server, Zustand for UI state |
| **python-dotenv** | Not type-safe, manual parsing. | pydantic-settings (type-safe, validated) |
| **CORS wildcard (*)** | Insecure for gov apps, rejected if allow_credentials=True. | List specific frontend domains |
| **Separate vector DB (Pinecone, Weaviate)** | Adds infrastructure complexity, potential data sovereignty issues for gov. | pgvector in existing PostgreSQL |
| **Global exception handlers without audit logging** | Compliance violation. All errors must be logged with context. | structlog + OpenTelemetry + exception middleware |

---

## Installation

### Frontend
```bash
# Create project
npm create vite@latest frontend -- --template react-swc-ts

# Core dependencies
npm install @tanstack/react-query zustand
npm install @hookform/resolvers react-hook-form zod
npm install assistant-ui

# shadcn/ui (copy/paste components)
npx shadcn-ui@latest init

# Dev dependencies
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

### Backend
```bash
# Core
pip install fastapi==0.128.* uvicorn[standard]==0.34.*
pip install pydantic==2.12.* pydantic-settings==2.7.*
pip install sqlalchemy==2.0.* alembic==1.18.*
pip install psycopg2-binary==2.9.*  # or psycopg[binary] for async
pip install pgvector==0.3.*

# AI
pip install anthropic  # latest

# Authentication & Security
pip install fastapi-sso python-jose[cryptography] passlib[bcrypt]
pip install slowapi

# Logging & Observability
pip install structlog==25.5.*
pip install opentelemetry-api opentelemetry-sdk
pip install opentelemetry-instrumentation-fastapi
pip install sentry-sdk[fastapi]

# Testing
pip install pytest==8.* pytest-asyncio==0.24.*
pip install httpx==0.28.* pytest-cov==6.*

# Dev dependencies
pip install ruff black mypy
```

### Database
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector column example
CREATE TABLE evaluation_knowledge (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI/Claude embedding dimension
    metadata JSONB
);

-- Create HNSW index for fast similarity search
CREATE INDEX ON evaluation_knowledge
USING hnsw (embedding vector_cosine_ops);
```

---

## Stack Patterns by Variant

### Pattern 1: Government On-Premise Deployment
**If deploying to gov data center (FedRAMP High, IL5+):**
- Use pgvector (data sovereignty requirement, no external vector DB)
- Add fastapi-opa for policy-based access control
- Enable audit logging middleware (ALL requests logged with user context)
- Use SAML via fastapi-sso (no cloud OAuth providers)
- Disable external monitoring (self-hosted OpenTelemetry + ELK stack)
- Add python-audit-log for immutable audit trails

### Pattern 2: FedRAMP Moderate Cloud Deployment
**If deploying to AWS GovCloud / Azure Government:**
- Use AWS RDS PostgreSQL or Azure Database for PostgreSQL (FedRAMP certified)
- Anthropic Claude via AWS Bedrock (FedRAMP Moderate certified) OR direct API with documented data handling
- Sentry (FedRAMP certified tier available)
- AWS CloudWatch / Azure Monitor for OpenTelemetry backend
- AWS Cognito or Azure AD for SAML/OAuth

### Pattern 3: Rapid Prototyping / Demo
**If building proof-of-concept for stakeholder demo:**
- Simplify: Use only React useState (no TanStack Query initially)
- Skip authentication (add later)
- Use SQLite with sqlite-vss instead of PostgreSQL + pgvector
- Local structlog only (skip OpenTelemetry/Sentry)
- Docker Compose for one-command startup

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| **FastAPI 0.128.x** | Pydantic 2.12.x+ | FastAPI 0.126+ dropped Pydantic v1 support. Must use v2. |
| **Pydantic 2.12.x** | Python 3.13+ | Pydantic v1 incompatible with Python 3.14. |
| **React 19.x** | TypeScript 5.7+ | React 19 requires updated @types/react (19.x). |
| **Vitest 3.x** | Vite 6.x | Vitest versioning tracks Vite major versions. |
| **pgvector 0.7.x** | PostgreSQL 12+ | HNSW index requires PostgreSQL 14+. Use 16+ for best performance. |
| **SQLAlchemy 2.x** | asyncpg OR psycopg 3.x | Use asyncpg for async, psycopg2 for sync. Don't mix. |
| **OpenTelemetry** | Python 3.8+ | Instrument FastAPI, SQLAlchemy, httpx for full traces. |

---

## Government Compliance Notes

### Security Requirements
- **Authentication:** SAML 2.0 or OAuth 2.0 with MFA (no username/password for production users)
- **Authorization:** Role-based access control (RBAC) with audit logging
- **Encryption:** TLS 1.3+ in transit, AES-256 at rest (PostgreSQL encrypted volumes)
- **Rate Limiting:** Required to prevent DoS (slowapi or Nginx)
- **CORS:** Whitelist specific domains only (no wildcards)

### Audit & Compliance
- **Audit Logging:** ALL API calls logged with user ID, timestamp, action, result (use structlog + middleware)
- **Data Retention:** 7 years typical for government evaluation data (configure PostgreSQL archival)
- **Immutability:** Audit logs must be append-only (consider python-audit-log or write-once S3)
- **Observability:** SLA monitoring required (OpenTelemetry + alerts)

### NIST SP 800-53 Controls
FastAPI stack satisfies these controls with proper configuration:
- **AC-2:** Account Management (SAML/OAuth integration)
- **AU-2:** Audit Events (structlog + middleware)
- **AU-3:** Content of Audit Records (user context in logs)
- **SC-7:** Boundary Protection (CORS, rate limiting, reverse proxy)
- **SC-8:** Transmission Confidentiality (TLS 1.3+)

---

## Performance Benchmarks (Estimated)

| Metric | Target | Configuration |
|--------|--------|---------------|
| **API Response Time** | <100ms (non-LLM) | FastAPI async + PostgreSQL connection pooling (SQLAlchemy) |
| **LLM Streaming Latency** | <500ms first token | Claude API + Anthropic SDK streaming |
| **Vector Search** | <50ms for 110K vectors | pgvector with HNSW index (m=16, ef_construction=64) |
| **Frontend HMR** | <50ms | Vite native ESM |
| **Test Suite** | <10s for 100 tests | Vitest parallel execution |

---

## Sources

### High Confidence (Official Docs / Context7)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) — React 19 features
- [TypeScript 5.7 Release](https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/) — TypeScript 5.7 features
- [FastAPI Versions](https://fastapi.tiangolo.com/deployment/versions/) — Current FastAPI version policy
- [Pydantic Changelog](https://docs.pydantic.dev/latest/changelog/) — Pydantic v2.12 features
- [Anthropic SDK Python](https://github.com/anthropics/anthropic-sdk-python) — Official SDK usage patterns
- [pgvector GitHub](https://github.com/pgvector/pgvector) — Vector extension documentation
- [SQLAlchemy Best Practices with Alembic](https://medium.com/@pavel.loginov.dev/best-practices-for-alembic-and-sqlalchemy-73e4c8a6c205) — Migration patterns
- [Vitest Documentation](https://vitest.dev/) — Vitest features and benchmarks

### Medium Confidence (Multiple Sources / WebSearch Verified)
- [Vector Database Comparison 2025](https://liquidmetal.ai/casesAndBlogs/vector-comparison/) — pgvector vs alternatives
- [React AI Stack for 2026](https://www.builder.io/blog/react-ai-stack-2026) — assistant-ui, TanStack Query patterns
- [FastAPI Production Best Practices](https://github.com/zhanymkanov/fastapi-best-practices) — Gunicorn + Uvicorn, async patterns
- [State Management in 2026](https://makersden.io/blog/react-state-management-in-2025) — Zustand vs Redux vs TanStack Query adoption
- [Structlog Async Logging 2026](https://johal.in/structlog-contextvars-python-async-logging-2026/) — Compliance logging patterns
- [OpenTelemetry Python Guide](https://www.highlight.io/blog/the-complete-guide-to-python-and-opentelemetry) — OTEL + Sentry integration
- [FastAPI CORS Production](https://davidmuraya.com/blog/fastapi-cors-configuration/) — Security headers, wildcard risks
- [SlowAPI Rate Limiting](https://github.com/laurentS/slowapi) — Rate limiting implementation

### Context on Government Compliance
- [FedRAMP Requirements 2026](https://www.trustcloud.ai/fedramp/what-is-fedramp/) — Compliance overview
- [FISMA Guide 2026](https://concentric.ai/a-guide-to-federal-information-security-modernization-act-fisma-compliance-in-2025/) — NIST SP 800-53 controls
- [FastAPI SAML Integration](https://github.com/ais-one/fastapi-saml) — Government SSO patterns

---

*Stack research for: AI-Powered Impact Evaluation Tool*
*Researched: 2026-01-28*
*Confidence: HIGH (all major libraries verified with official sources or multiple recent tutorials)*
