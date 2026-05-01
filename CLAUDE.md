# AgenticGov

A live, demo-ready visualisation of the World Economic Forum's *Making Agentic AI Work for Government — A Readiness Framework* (April 2026). Six interconnected agentic apps across 70 government functions, with one orchestration portal.

This is a **public, no-login demo** — anyone with the link can explore. All data is illustrative; the architecture and bi-directional intelligence flows are real reference implementations of the framework's recommended patterns.

---

## Architecture

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind v4 + Vite |
| Routing | React Router 7 (BrowserRouter) |
| Server | Vercel Serverless Functions (`api/*.ts`) |
| Database | Neon Postgres (visitor counter only) |
| Hosting | Vercel |
| Auth | None — fully public |

---

## Routes

```
/                      → LandingPage (WEF framework + founder + visitor count)
/portal                → AgenticGovPortalPage (Mission Control orchestration)
/portal/tender         → TenderAIPage
/portal/fiscal         → FiscalAIPage
/portal/readiness      → ReadinessMapPage
/portal/bench          → GovBenchPage
/portal/transparency   → TransparencyAIPage
/privacy               → PrivacyPolicyPage
/terms                 → TermsOfServicePage
```

---

## API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/visit` | GET / POST | Public visitor counter, Neon-backed |

The visit endpoint auto-creates its `site_visits` table on first call. No migrations needed.

---

## Environment

For Vercel deployment:

```
NEON_DATABASE_URL=postgres://...   # Required for visitor counter
ALLOWED_ORIGIN=https://agenticgov.vercel.app   # Optional CORS lock-down
```

If `NEON_DATABASE_URL` isn't set, the visitor counter soft-fails to `0` — the rest of the demo still works.

---

## Local development

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

For the visitor counter, set `NEON_DATABASE_URL` in `.env` and run `vercel dev` from the project root.

---

## Source

Visualises: [Making Agentic AI Work for Government — A Readiness Framework](https://www.weforum.org/publications/making-agentic-ai-work-for-government-a-readiness-framework/) (World Economic Forum, April 2026).

PDF copy: `frontend/public/wef-readiness-framework.pdf`.

---

## Founder

Hao Jun · [haojun@ontheground.agency](mailto:haojun@ontheground.agency) · [WhatsApp](https://wa.me/6598419481)

Built by [On The Ground](https://github.com/On-The-Ground-AI).
