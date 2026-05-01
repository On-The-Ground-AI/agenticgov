# Project State

## Current Status

**Phase:** 8. J-PAL & Ex-Ante Content Integration (Complete)
**Last activity:** Added J-PAL studies, case studies page filters, ex-ante frameworks data
**Next action:** Deploy and test; consider additional content or features

## Project Reference

See: CLAUDE.md (comprehensive architecture guide - updated February 4, 2026)
See: .planning/PROJECT.md (project overview)

**Core value:** Government officials can design rigorous impact evaluations without econometric expertise
**Current focus:** Content expansion complete, ready for testing and deployment

## Architecture

| Component | Service | Status |
|-----------|---------|--------|
| Frontend | Vercel (React + Vite) | Built |
| Auth | Supabase Auth | Built |
| Database | Supabase PostgreSQL | Schema ready |
| Vector Search | Supabase pgvector | Schema ready |
| AI Chat | Vercel Serverless + Claude | Built |
| Evaluation Design | Vercel Serverless + Claude | Built |
| Method Recommender | Vercel Serverless + Claude | Built |
| Quality Scoring | Vercel Serverless + Claude | Built |
| Audit Logging | Supabase | Complete |
| User Management | Supabase Auth | Complete |
| J-PAL Case Studies | Frontend data | Complete |
| Ex-Ante Frameworks | Frontend data | Complete |

## Phase Progress

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1. Foundation | Complete | 2026-01-28 | 2026-01-28 |
| 2. Knowledge & Retrieval | Complete | 2026-01-28 | 2026-01-28 |
| 3. Evaluation Design | Complete | 2026-01-28 | 2026-01-28 |
| 4. Method Recommender | Complete | 2026-01-28 | 2026-01-28 |
| 5. Quality Scoring | Complete | 2026-01-28 | 2026-01-28 |
| 6. Integration & Polish | Complete | 2026-01-28 | 2026-02-04 |
| 7. Beta Launch | Complete | 2026-02-05 | 2026-02-05 |
| 8. J-PAL & Ex-Ante | **Complete** | 2026-02-05 | 2026-02-05 |

## Phase 8 Deliverables

### J-PAL Landmark Studies
Added 10 rigorous J-PAL research studies to `frontend/src/data/caseStudies.ts`:
- Graduation Approach (Multi-Country)
- Remedial Education - Pratham (India)
- Bed Nets Pricing (Kenya)
- Microcredit Evaluation (India)
- Chlorine Dispensers (Kenya)
- SMS Savings Reminders (Multi-Country)
- Teacher Absence Monitoring (India)
- Voter Information (Brazil)
- GiveDirectly Cash Transfers (Kenya)
- Iron Fortification (India)

Each study includes:
- Policy influence documentation
- Effect sizes and cost-effectiveness
- Replication status
- Link to J-PAL website

### Case Studies Page Enhancements
Updated `frontend/src/pages/CaseStudiesPage.tsx`:
- Type filter tabs (All, Academic, Worked Examples, J-PAL Research)
- Method filter buttons with active states
- J-PAL badge and policy influence on cards
- Effect size display for J-PAL studies

Updated `frontend/src/pages/CaseStudyDetailPage.tsx`:
- J-PAL badge in hero section
- Policy Impact & Evidence section
- Effect size, cost-effectiveness, replication status
- Link to J-PAL website

### Ex-Ante Frameworks Data
Created `frontend/src/data/exAnteFrameworks.ts` with:
- Cost-Benefit Analysis (CBA)
- Cost-Effectiveness Analysis (CEA)
- Multi-Criteria Analysis (MCA)
- Simulation and Modeling

Each framework includes:
- When to use / not use
- Key metrics with formulas
- Step-by-step methodology
- Data requirements
- Strengths and limitations
- Example applications

Also includes:
- Framework selection decision criteria
- Standard discount rates by institution
- WHO cost-effectiveness thresholds
- Common pitfalls and solutions

## Features Implemented

### Chat Assistant
- Knowledge base search using PostgreSQL full-text search
- Streaming responses from Claude
- Conversation history support
- Source citations

### Evaluation Design Wizard
- 3-step wizard (Program → Context → Generate)
- Theory of Change generation
- Method recommendation with rationale
- Data requirements and feasibility assessment

### Method Recommender
- Program characteristics input
- Primary method with suitability score
- Alternative methods with trade-offs
- Feasibility warnings

### Quality Scoring
- Dual rubric system (ADB + Proposal Quality)
- 8-dimension scoring
- Prioritized recommendations
- MDB standards comparison

### Beta Features (Phase 7)
- Waitlist system with API
- User onboarding flow
- Feedback collection widget
- Activity tracking hooks
- Admin panel with 7 tabs
- Rate limiting

### Content (Phase 8)
- 10 J-PAL landmark studies
- Case studies filtering by type
- Ex-ante evaluation frameworks data

## Key Files

| Purpose | Location |
|---------|----------|
| Architecture guide | `CLAUDE.md` |
| Case study data | `frontend/src/data/caseStudies.ts` |
| Ex-ante frameworks | `frontend/src/data/exAnteFrameworks.ts` |
| DB schema | `supabase/schema.sql` |
| Beta migration | `supabase/migrations/001_beta_launch.sql` |
| Chat API | `api/chat.ts` |
| Evaluation API | `api/evaluate.ts` |
| Recommender API | `api/recommend.ts` |
| Scoring API | `api/score.ts` |
| Feedback API | `api/feedback.ts` |
| Waitlist API | `api/waitlist.ts` |
| Activity API | `api/activity.ts` |

## Required Configuration

### Frontend (Vercel Environment Variables)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### API Functions (Vercel Environment Variables)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
VOYAGE_API_KEY=your-voyage-key  # Optional
```

## Recent Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-02-05 | Add 10 J-PAL studies | Phase 8 content expansion |
| 2026-02-05 | Create ex-ante frameworks data | Phase 8 content expansion |
| 2026-02-05 | Add case studies filtering | Better UX for finding studies |
| 2026-02-04 | Add Phase 7 (Beta) and Phase 8 (J-PAL) to roadmap | Preparing for beta testers |
| 2026-02-04 | Comprehensive CLAUDE.md rewrite | Single source of truth for architecture |
| 2026-01-28 | Use PostgreSQL FTS instead of embeddings | Simpler, works without OpenAI |
| 2026-01-28 | All features in single Dashboard | Tabbed interface for simplicity |
| 2026-01-28 | Edge runtime for API | Faster cold starts |

## Next Steps

1. **Deploy and Test**
   - Run database migrations
   - Deploy to Vercel
   - Test all features end-to-end

2. **Consider Additional Features**
   - Ex-ante evaluation wizard using frameworks data
   - Method pages linking to J-PAL evidence
   - Knowledge base ingestion of new content

3. **Beta Launch**
   - Configure Supabase project
   - Set up environment variables
   - Invite beta testers

---
*Last updated: February 5, 2026*
