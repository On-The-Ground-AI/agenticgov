# AgenticGov

> Making Agentic AI Work for Government — a visual companion to the [WEF Readiness Framework](https://www.weforum.org/publications/making-agentic-ai-work-for-government-a-readiness-framework/).

A live, demo-ready, no-login web app that shows what the WEF's *Readiness Framework* looks like when it's running. Six interconnected agentic apps across 70 government functions, wired into one orchestration portal with cross-app event chains.

## Stack

React 19 · Tailwind v4 · Vite · Vercel Functions · Neon Postgres (visitor counter) · No auth.

## Running

```bash
cd frontend
npm install
npm run dev
```

## Deploy

Push to GitHub, link a Vercel project to the repo. Set `NEON_DATABASE_URL` for the visitor counter (optional — soft-fails to 0).

## Founder

Hao Jun · [haojun@ontheground.agency](mailto:haojun@ontheground.agency) · [+65 9841 9481](https://wa.me/6598419481) · Built by [On The Ground](https://github.com/On-The-Ground-AI).
