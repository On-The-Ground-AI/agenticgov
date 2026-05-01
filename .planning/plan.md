# Plan: Dashboard Restructure — Hub/Card Home Screen

## Overview

Transform the dashboard from a flat 9-tab layout to a hub/card-based home screen with two hero functions front and center, grouped tools, learning resources, and chat.

**Naming decisions:**
- Hero 1: **Policy Analysis** (subtitle: Ex-Ante Evaluation)
- Hero 2: **Policy Impact Evaluation** (subtitle: Ex-Post Evaluation)
- Secondary tools grouped as **"Tools"**
- Learning resources grouped as **"Learn & Explore"**

---

## Step 1: Restructure `DashboardPage.tsx`

**File:** `frontend/src/pages/DashboardPage.tsx`

### Changes:

1. **Remove** `BenchmarkExplorerTab` import (line 4) — Benchmarks lives at `/benchmarks`, will be linked in Learn section
2. **Remove** `'benchmarks'` from `TabId` union type
3. **Remove** `Tab` interface and `TABS` array (lines 21-73) — replaced by hub cards
4. **Add** `TOOL_META` record for back-button descriptions
5. **Change** `activeTab` initial state from `'chat'` to `null` (type: `TabId | null`)
6. **Add** `Link` import from `react-router-dom`
7. **Remove** `case 'benchmarks'` from `renderContent` switch

### New hub layout (when `activeTab === null`):

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back, {firstName}!                                   │
│ What would you like to work on today?                        │
├─────────────────────────────┬───────────────────────────────┤
│  Policy Analysis            │  Policy Impact Evaluation      │
│  Ex-Ante Evaluation         │  Ex-Post Evaluation            │
│  Assess projects before     │  Design rigorous evaluations   │
│  implementation using CBA,  │  to measure actual program     │
│  CEA, or MCA frameworks     │  impact after implementation   │
│  [Start Analysis →]         │  [Design Evaluation →]         │
├──────────┬──────────┬───────┴──┬──────────────────────────────┤
│ Upload & │ Method   │ Quality  │ Data                         │
│ Analyze  │ Recomm.  │ Scoring  │ Analysis                     │
├──────────┴──────────┴──────────┴──────────────────────────────┤
│  💬 Ask the Evaluation Assistant                              │
│  Get answers grounded in 145 docs and 352 MDB reports         │
├───────────────────────────────────────────────────────────────┤
│  Learn & Explore                                              │
│  [Methods] [Case Studies] [Benchmarks] [Frameworks]           │
│  [Rubrics] [Knowledge Base]                                   │
├───────────────────────────────────────────────────────────────┤
│  ⚙ Admin Panel (visible to all, AdminPanel handles auth)      │
└───────────────────────────────────────────────────────────────┘
```

### When a tool is active (`activeTab !== null`):

```
← Back to Dashboard
{TOOL_META[activeTab].name} — {TOOL_META[activeTab].description}
{renderContent()}
<ResourcesSection />
```

### Key implementation details:

- Hero cards: `grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`
  - Policy Analysis: amber accent (`bg-amber-50 border-amber-200`)
  - Policy Impact Evaluation: blue accent (`bg-blue-50 border-blue-200`)
  - Both: `min-h-[180px] rounded-xl border-2 p-6 cursor-pointer hover:shadow-md`

- Tools: `grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8`
  - White cards with `hover:border-indigo-300 hover:shadow-sm`

- Chat: full-width card, `mb-8`

- Learn: section label + flex wrap of pill-style `<Link>` buttons to public routes
  - `/methods`, `/case-studies`, `/benchmarks`, `/frameworks`, `/rubrics`, `/knowledge`

- Admin: small de-emphasized card at bottom

- Back button: `← Back to Dashboard` with chevron SVG

- ResourcesSection: only rendered when `activeTab !== null` (not on hub)

- Welcome name: extract from `user?.user_metadata?.full_name?.split(' ')[0]` with fallback

---

## Step 2: Update `EvaluationWizard.tsx` — UX fixes

**File:** `frontend/src/components/EvaluationWizard.tsx`

These are UX issues identified in prior analysis that should be fixed as part of this restructure:

1. **Remove `line-clamp-4`** from the review step's program description display — users should see their full description
2. **Add `dataAvailability` and `constraints` to review step** — currently collected but not shown in the review summary
3. **Add step validation** — prevent advancing from Step 1 without a program description, from Step 2 without sector/assignment mechanism
4. **Scroll to results** — after generation completes, auto-scroll to the results section
5. **Add cancel button** — allow cancelling SSE generation in progress
6. **Fix mobile wizard header** — step connectors overflow on small screens

---

## Step 3: Rename references in component titles

Minor text updates within the components themselves:

- `ExAnteEvaluator.tsx`: The component's internal header already says "Ex-Ante Evaluation" — consider adding "Policy Analysis" as the primary title with "Ex-Ante Evaluation" as subtitle, or leave as-is (the hub card handles naming)
- `EvaluationWizard.tsx`: Same consideration — the component's header says "Design Your Evaluation" which is fine

**Decision:** No changes needed inside the evaluator components. The hub cards provide the user-facing names ("Policy Analysis" and "Policy Impact Evaluation"). The components themselves use descriptive headers that make sense once you're inside the tool.

---

## Files Modified

| File | Change Type | Scope |
|------|-------------|-------|
| `frontend/src/pages/DashboardPage.tsx` | Major rewrite | Hub/card home screen, remove tab bar |
| `frontend/src/components/EvaluationWizard.tsx` | Bug fixes | 6 UX improvements |

## Files NOT Modified

- `App.tsx` — No routing changes needed
- `ExAnteEvaluator.tsx` — Internal UI stays the same
- API files — No backend changes
- `ResourcesSection.tsx` — Still used when viewing individual tools

---

## Risk Assessment

1. **Low risk:** All changes are frontend-only, no API or DB changes
2. **Low risk:** `activeTab` state approach is preserved, just nullable now
3. **Low risk:** BenchmarkExplorerTab removal — it's only referenced in DashboardPage
4. **Medium risk:** EvaluationWizard UX fixes touch a large component (1400+ lines) — careful editing needed
5. **No risk:** Hub card links to public pages use existing routes that already work

## Estimated Scope

- `DashboardPage.tsx`: ~200-250 lines of new hub JSX replacing ~30 lines of tab bar
- `EvaluationWizard.tsx`: ~6 targeted edits (line-clamp, review fields, validation, scroll, cancel, mobile)
- Total: 2 files, moderate complexity
