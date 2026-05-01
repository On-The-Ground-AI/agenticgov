# Roadmap

## Overview

| # | Phase | Goal | Status | Completed |
|---|-------|------|--------|-----------|
| 1 | Foundation | Infrastructure, auth, and RAG pipeline ready | ✅ Complete | 2026-01-28 |
| 2 | Knowledge & Retrieval | RAG system with knowledge base ingestion | ✅ Complete | 2026-01-28 |
| 3 | Evaluation Design | Core evaluation design assistant | ✅ Complete | 2026-01-28 |
| 4 | Method Recommender | Method recommendation engine | ✅ Complete | 2026-01-28 |
| 5 | Quality Scoring | Proposal quality assessment | ✅ Complete | 2026-01-28 |
| 6 | Integration & Polish | End-to-end flows, UX refinement | ✅ Complete | 2026-02-04 |
| 7 | Beta Launch | User management, feedback, analytics | ✅ Complete | 2026-02-05 |
| 8 | J-PAL & Ex-Ante | J-PAL studies, ex-ante frameworks | ✅ Complete | 2026-02-05 |

**Total:** 8 phases | All complete ✓

---

## Phase 1: Foundation ✅

**Goal:** Infrastructure, authentication, and base RAG pipeline operational

**Requirements:**
- ✅ AUTH-01: User can create account with email/password
- ✅ AUTH-02: User can log in and maintain session
- ✅ AUTH-03: User can log out from any page
- ✅ AUTH-04: User can reset password via email link
- ✅ INFRA-01: API responds within 3 seconds
- ✅ INFRA-02: Audit log of AI interactions
- ✅ INFRA-03: Data encrypted at rest and in transit
- ✅ INFRA-04: Concurrent user handling

---

## Phase 2: Knowledge & Retrieval ✅

**Goal:** RAG system ingests knowledge base and retrieves relevant content with citations

**Requirements:**
- ✅ KB-01: System retrieves relevant methodology content
- ✅ KB-02: AI responses include citations
- ✅ KB-03: System indicates confidence level
- ✅ KB-04: System refuses when knowledge insufficient (no hallucination)

---

## Phase 3: Evaluation Design ✅

**Goal:** Users can design evaluations through guided workflow

**Requirements:**
- ✅ EVAL-01: Describe program → receive evaluation design
- ✅ EVAL-02: Answer guided questions about context
- ✅ EVAL-03: View recommended approach with explanation
- ✅ EVAL-04: See citations supporting recommendations
- ✅ EVAL-05: Save and retrieve designs

---

## Phase 4: Method Recommender ✅

**Goal:** System recommends appropriate evaluation methods with rationale

**Requirements:**
- ✅ METH-01: Recommend methods based on program characteristics
- ✅ METH-02: Show rationale with citations
- ✅ METH-03: Show alternatives with trade-offs
- ✅ METH-04: Flag when rigorous evaluation not feasible
- ✅ METH-05: Filter by constraints (budget, timeline, data)

---

## Phase 5: Quality Scoring ✅

**Goal:** Users can assess evaluation proposal quality

**Requirements:**
- ✅ QUAL-01: Upload/paste proposal text
- ✅ QUAL-02: Score on standardized rubric
- ✅ QUAL-03: Feedback on strengths and weaknesses
- ✅ QUAL-04: Improvement suggestions with references
- ✅ QUAL-05: Compare multiple proposals

---

## Phase 6: Integration & Polish ✅

**Goal:** End-to-end user flows polished, edge cases handled

**Success Criteria:**
- ✅ Complete user journey works: login → design evaluation → get methods → score proposal
- ✅ Error states handled gracefully with helpful messages
- ✅ Performance optimized (< 3s response times)
- ✅ UI consistent and accessible

---

## Phase 7: Beta Launch Preparation ✅

**Goal:** Production-ready platform for controlled beta testing

**Requirements:**
- ✅ BETA-01: User invitation/waitlist system
- ✅ BETA-02: User onboarding flow with role selection
- ✅ BETA-03: Feature flags for gradual rollout
- ✅ BETA-04: Usage analytics dashboard
- ✅ BETA-05: Feedback collection mechanism
- ✅ BETA-06: Audit log UI for admins
- ✅ BETA-07: User activity tracking
- ✅ BETA-08: Rate limiting

**Deliverables:**
- Database migration with beta tables
- Waitlist API and signup page
- Feedback widget and API
- Activity tracking hook
- Enhanced admin panel (7 tabs)
- Onboarding flow
- Rate limiting middleware

---

## Phase 8: J-PAL & Ex-Ante Content ✅

**Goal:** Expand knowledge base with J-PAL research and ex-ante evaluation frameworks

**Requirements:**
- ✅ JPAL-01: Add landmark J-PAL research studies to case studies
- ✅ JPAL-02: Create J-PAL studies filter on case studies page
- ✅ JPAL-03: Display policy influence and effect sizes
- ✅ EXANTE-01: Create ex-ante frameworks data file

**Deliverables:**
- 10 J-PAL landmark studies added to caseStudies.ts
- Case studies page with type/method filters
- J-PAL badges and policy influence display
- Ex-ante frameworks data (CBA, CEA, MCA, Simulation)

---

## Dependencies

```
Phase 1 (Foundation)
    ↓
Phase 2 (Knowledge & Retrieval)
    ↓
Phase 3 (Evaluation Design) ←──┐
    ↓                          │
Phase 4 (Method Recommender) ──┤ (parallel after Phase 2)
    ↓                          │
Phase 5 (Quality Scoring) ←────┘
    ↓
Phase 6 (Integration & Polish)
    ↓
Phase 7 (Beta Launch)
    ↓
Phase 8 (J-PAL & Ex-Ante Content)
```

---

## Next Steps (Future Phases)

Potential future work:
- Ex-ante evaluation wizard using frameworks data
- Method pages linking to J-PAL evidence
- Additional J-PAL studies
- User analytics and insights
- API rate limiting refinement
- Performance optimization

---
*Last updated: February 5, 2026 - All 8 phases complete*
