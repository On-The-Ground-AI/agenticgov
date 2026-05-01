# IE Data Workflows: Competitor Analysis & Required Capabilities

*Research Date: February 17, 2026*

---

## Executive Summary

We analyzed three categories of tools that serve different parts of the impact evaluation workflow:

| Tool Category | Representative | Strength | Critical Gap |
|---------------|---------------|----------|-------------|
| **Researcher toolkits** | DIME ietoolkit (Stata) | Rigorous, reproducible causal analysis | Requires Stata expertise; no UI |
| **M&E platforms** | DevResults | Excellent UX for indicator tracking | Zero causal inference capability |
| **AI-native platforms** | Sopact Sense | Natural language interface, qualitative analysis | No counterfactual methods, outcome tracking only |

**The market gap is clear and unserved:** No existing platform combines rigorous causal inference + non-technical UX + AI-powered guidance. This is exactly where Causalis sits.

---

## Part 1: Lessons from DIME ietoolkit

### What ietoolkit Actually Does (and why researchers depend on it)

DIME's ietoolkit is a suite of 8 Stata commands used across the World Bank's entire impact evaluation portfolio. It turns multi-hour manual tasks into single commands.

### Must-Have Capabilities Derived from ietoolkit

#### 1. Balance Table Generator (from `iebaltab`)

This is the single most-used tool in impact evaluation. Every RCT and every quasi-experimental study needs a balance table. What `iebaltab` produces:

| Output | Detail |
|--------|--------|
| Group means | Treatment vs. control (supports multiple arms) |
| Dispersion | Standard error, standard deviation, or variance per group |
| Pair-wise tests | t-tests between each pair of groups with p-values |
| Normalized differences | Imbens-Rubin formula: `(μ₁ - μ₂) / √((σ₁² + σ₂²) / 2)` |
| F-test (joint) | Do ALL balance variables jointly predict treatment assignment? |
| F-test (equality) | For each variable: does it differ across ALL groups? |
| Sample sizes | N per group, per variable |
| Significance stars | Configurable thresholds (default: 0.1, 0.05, 0.01) |

**What Causalis must build:**
- Upload CSV/Excel → select treatment variable, balance variables, optionally covariates/cluster variable
- Compute all of the above server-side
- Display as a formatted, interactive table
- Export to PDF, Excel, LaTeX
- Handle clustering and stratification in variance estimation
- Support 2-5 treatment arms

**Why this matters:** A balance table is the first thing any reviewer, funder, or journal referee looks at. If treatment and control groups aren't balanced at baseline, the entire evaluation's credibility is undermined. Making this accessible to non-Stata users removes a major bottleneck.

#### 2. DiD Results Table (from `ieddtab`)

For Difference-in-Differences evaluations, `ieddtab` runs and displays the core regression:

```
outcome = β₀ + β₁(time) + β₂(treatment) + β₃(time × treatment) + covariates + ε
```

The table shows five columns per outcome variable:

| Column | Meaning |
|--------|---------|
| Baseline mean (control) | Starting point for comparison group |
| Baseline mean (treatment) | Starting point for treatment group |
| 1st difference (control) | How much control changed over time |
| 1st difference (treatment) | How much treatment changed over time |
| **2nd difference (DiD)** | **The causal impact estimate** — the difference of the differences |

**What Causalis must build:**
- User selects outcome(s), time variable (binary: pre/post), treatment variable, optional covariates
- Run DiD regression with configurable variance (robust, clustered, bootstrap)
- Display baseline means, first differences, and the DiD estimate with significance
- Visualize parallel trends (pre-treatment outcome trajectories for both groups)

#### 3. Treatment Effect Visualization (from `iegraph`)

After any regression, `iegraph` creates bar charts showing:
- Control group mean as the baseline bar
- Treatment group mean = control mean + treatment coefficient
- Confidence intervals as error bars
- Sample sizes and significance stars on labels

**What Causalis must build:**
- After any analysis, auto-generate a treatment effect bar chart
- Bars represent group means with CI whiskers
- Support 2-5 treatment arms
- Plain-language caption: "The treatment group scored X.X points higher (95% CI: [a, b], p = 0.0xx)"

#### 4. Distribution Comparison (from `iekdensity`)

Kernel density plots showing the full distribution of outcomes by treatment group, not just means. This reveals whether the treatment shifted the entire distribution or just the tails.

**What Causalis must build:**
- Kernel density or histogram overlay by treatment group
- Optional: overlay mean/median lines, treatment effect annotation
- Helps users understand heterogeneity beyond average effects

#### 5. Data Quality Tools (from `ieduplicates` + `iecodebook`)

| Tool | What it does | Causalis equivalent |
|------|-------------|---------------------|
| `ieduplicates` | Detects duplicate IDs, generates correction spreadsheet, applies corrections | Auto-detect duplicate IDs on upload, flag for user review |
| `iecompdup` | Side-by-side comparison of duplicate records | Show diff view of conflicting rows |
| `iecodebook` | Generates/applies data cleaning instructions via Excel | Variable profiling: auto-detect types, suggest labels, flag issues |

#### 6. Reproducibility Standards (from `ieboilstart` + `iefolder`)

DIME requires every analysis to be computationally reproducible — change one path, run one script, get all outputs.

**What Causalis must build (later phases):**
- Every analysis produces a downloadable "reproducibility package"
- Contains: the data used, the analysis specification, and all outputs
- Anyone can verify the results independently
- Audit trail: who ran what analysis, when, with what parameters

### Key Insight from DIME

> ietoolkit's value isn't the statistics — any statistician can run a t-test. The value is **standardization and automation** of tasks that are tedious, error-prone, and time-consuming when done manually. Causalis must do the same, but with a web UI instead of a Stata command line.

---

## Part 2: Lessons from DevResults

### What Makes DevResults' UX Effective

DevResults is the gold standard for M&E platform UX. Used by USAID programs costing $28K-$120K+/year. Key patterns to adopt:

#### 1. Excel as the Universal Bridge

DevResults' #1 UX insight: **M&E professionals live in Excel**. Every interaction supports Excel:
- Download pre-formatted Excel templates for data entry
- Fill in offline, upload back
- Auto-match spreadsheet columns to system fields
- Bulk import indicators, disaggregations, and geographies via Excel

**Lesson for Causalis:** Never force users to abandon Excel. Support:
- Upload CSV/Excel as the primary data entry method
- Download analysis results as Excel
- Provide Excel templates for data preparation
- Auto-detect column structure from uploaded files

#### 2. Automatic Aggregation — Users Never Calculate

DevResults automatically rolls up data:
- Geographic: district → province → country
- Temporal: monthly → quarterly → annual
- Disaggregation: subcategories → totals

Users enter raw numbers; the system does all math.

**Lesson for Causalis:** After analysis:
- Auto-calculate all derived statistics
- Show results at multiple levels (subgroup, full sample)
- Never ask users to compute anything manually

#### 3. Progressive Disclosure

DevResults introduces complexity gradually:
- Start with results framework and basic indicators
- Add disaggregations when needed
- Add formulas for calculated indicators
- Advanced: custom queries, API access

**Lesson for Causalis:** The data analysis workflow should be layered:
- **Layer 1** (everyone): Upload data → see summary statistics → understand your data
- **Layer 2** (most users): Map variables → run guided analysis → get plain-language results
- **Layer 3** (power users): Customize specifications → robustness checks → export full tables

#### 4. Geographic Context Built-In

Maps aren't optional in development work — program managers think spatially. DevResults integrates Google Maps for location entry and provides thematic maps with automatic geographic aggregation.

**Lesson for Causalis (future):** When data includes geographic variables:
- Auto-detect country/region columns
- Visualize treatment vs. control on a map
- Show outcome distributions geographically

#### 5. Multi-Stakeholder Permission Model

DevResults isolates partners to their own data while giving managers a portfolio view. Internal users see everything; partners see only their activities.

**Lesson for Causalis:** As the platform grows:
- Program managers see their own evaluations
- MoF reviewers see evaluations they're assigned to review
- Admins see everything
- External evaluators get scoped access

#### 6. Change History / Audit Trail

Every page in DevResults shows a full change history scrollable to the beginning.

**Lesson for Causalis:** Already partially implemented via `audit_logs` and `user_activities` tables. Extend to:
- Track every analysis run (parameters, results, who ran it)
- Show version history of evaluation designs
- Allow comparison between analysis versions

### What DevResults Does NOT Do (Causalis's Opportunity)

| DevResults limitation | Causalis fills the gap |
|----------------------|----------------------|
| No causal inference | Full method suite: RCT, DiD, RDD, IV, PSM, ITS, SC |
| No counterfactual analysis | Comparison group design and counterfactual estimation |
| No statistical modeling | Regression, hypothesis testing, CIs, power calculations |
| No evaluation design guidance | Method recommender, evaluation wizard, quality scoring |
| No AI capabilities | Knowledge-grounded AI for methodology guidance |
| No ex-ante evaluation | CBA, CEA, MCA frameworks |
| No qualitative analysis | Document analysis via AI (already implemented) |

---

## Part 3: Lessons from Sopact Sense

### What Sopact Does Well

#### 1. Natural Language Interface

Users issue plain-English commands: *"Compare pre and post confidence scores, segment by gender and age, include strongest participant quotes."*

No code, no dropdowns, no configuration forms. Just describe what you want.

**Lesson for Causalis:** The AI chat already supports this partially. Extend it to:
- "Run a balance table on my uploaded dataset"
- "What method should I use given this data structure?"
- "Show me the treatment effect for female participants only"
- "Explain these results to a non-technical audience"

#### 2. The Cell/Row/Column/Grid Abstraction

Sopact organizes analysis at four levels:

| Level | Scope | IE Equivalent |
|-------|-------|--------------|
| **Cell** | Single data point or document | Analyze one proposal, one transcript |
| **Row** | One participant/unit across all data | One household's complete evaluation data |
| **Column** | Cross-unit patterns | Treatment effect across all units |
| **Grid** | Portfolio synthesis | Multi-program evaluation synthesis |

**Lesson for Causalis:** Structure analysis outputs at multiple levels:
- **Variable level**: Summary stats for each variable
- **Unit level**: Individual observation profiles
- **Group level**: Treatment vs. control comparisons
- **Evaluation level**: Full analysis report with all outputs

#### 3. Speed-to-Value

Sopact's core marketing message: *"minutes not months."* They claim 80-85% reduction in analysis time, from 6-10 weeks to 1-2 days.

**Lesson for Causalis:** Every workflow should communicate speed:
- "Upload your data and get a balance table in 60 seconds"
- "Describe your program and get a method recommendation in 2 minutes"
- "Upload your proposal and get a quality score immediately"

#### 4. AI Playground / Try-Before-You-Buy

Users can test the AI on their own data before committing. Upload a sample, describe what you want, see results immediately.

**Lesson for Causalis:** Offer a demo mode:
- Upload a sample CSV (or use a built-in example dataset)
- Walk through the analysis workflow
- See real outputs before signing up
- Pre-loaded J-PAL study datasets for demonstration

### What Sopact Fails At (Causalis's Competitive Advantage)

| Sopact limitation | Why it matters | Causalis's answer |
|------------------|---------------|-------------------|
| **No causal inference** | Tracks outcomes but can't prove causation | Full counterfactual method suite |
| **No evaluation design** | Analyzes existing data but doesn't help design studies | Evaluation wizard + method recommender |
| **No quality scoring** | Can score documents against rubrics but not evaluation methodology | Dual rubric quality scoring |
| **No ex-ante evaluation** | No CBA, CEA, or MCA | Ex-ante evaluator with 4 frameworks |
| **No statistical modeling** | No regressions, no hypothesis tests | Server-side causal estimation |
| **Black-box AI** | Doesn't disclose models or explain methodology | Knowledge-grounded RAG with source attribution |
| **No domain-specific training** | Generic GPT performs poorly on evaluation terminology | 120K+ word knowledge base with 26 expert documents |

### Critical Validation: DevelopMetrics (DELLM)

DevelopMetrics built a domain-specific LLM fine-tuned on USAID evaluation data. Their key finding:

> "Generalized AI like ChatGPT is not effective at understanding the nuances of development terminology."

Their domain-trained model surfaced **10x more relevant evidence** than generic AI. This validates Causalis's knowledge-grounded RAG architecture as the right approach.

---

## Part 4: Competitive Landscape Map

### Emerging Competitor: Elevaid

Elevaid (elevaid.ai), currently in beta, is the closest direct competitor to Causalis:
- Generates evaluation designs from Terms of Reference documents
- Auto-generates Theories of Change and Logframes
- Evidence Matrix scans datasets for key insights
- Automates desk reviews

**Key difference:** Elevaid focuses on evaluation *design* but lacks causal methodology depth, quality scoring, and ex-ante evaluation that Causalis has. Monitor closely.

### Emerging Research: Econometrics AI Agent (arXiv, June 2025)

An academic project that automates OLS, Panel OLS, DiD, RDD, and IV using a domain-knowledge-enhanced AI agent. Achieves near-perfect completion rates on complex tasks vs. <50% for raw LLM code generation.

**Key insight:** Tool-augmented LLMs with domain knowledge dramatically outperform generic LLMs for causal inference tasks. This validates Causalis's architecture.

### Full Competitive Map

```
                        QUALITATIVE ←————————————→ QUANTITATIVE
                              |                         |
                    Sopact Sense                 DIME ietoolkit
                    Dovetail                     rdrobust (R)
                    Insight7                     did (R)
                    NVivo + AI                   CausalImpact (R)
                              |                         |
              AI-NATIVE ←—————+————————→ TRADITIONAL TOOLS
                              |                         |
                    Elevaid (beta)              DevResults
                    DevelopMetrics/DELLM        ActivityInfo
                                               TolaData
                              |                         |
                              +————— CAUSALIS ——————————+
                              |                         |
                    AI-powered guidance    +    Causal inference
                    Natural language       +    Statistical rigor
                    Knowledge-grounded     +    Non-technical UX
                    Document analysis      +    Data analysis
                    Ex-ante frameworks     +    Ex-post methods
```

---

## Part 5: Required Capabilities — Priority Matrix

### Tier 1: Must-Have (Differentiators)

These capabilities define Causalis and must be implemented to claim the market position:

| # | Capability | Source Lesson | Complexity |
|---|-----------|--------------|------------|
| 1 | **CSV/Excel upload with auto-profiling** | DevResults (Excel bridge), ietoolkit (data quality) | Medium |
| 2 | **Balance table generator** | ietoolkit `iebaltab` (most-used IE tool) | Medium-High |
| 3 | **Document → Evaluator pipeline** | Sopact (document intelligence), existing Causalis feature | Low |
| 4 | **AI-guided variable mapping** | Sopact (NL interface), ietoolkit (variable conventions) | Medium |
| 5 | **Treatment effect estimation (RCT at minimum)** | ietoolkit `iegraph`, academic standard | High |
| 6 | **Plain-language results interpretation** | Sopact (NL output), DevResults (non-technical users) | Medium |
| 7 | **Source attribution on all AI outputs** | DevelopMetrics (trust), NIST (transparency) | Low |

### Tier 2: High-Value (Competitive Advantage)

| # | Capability | Source Lesson | Complexity |
|---|-----------|--------------|------------|
| 8 | **DiD analysis with parallel trends visualization** | ietoolkit `ieddtab` | High |
| 9 | **RDD analysis with running variable plots** | rdrobust, academic standard | High |
| 10 | **Data quality dashboard** (duplicates, missing values, outliers) | ietoolkit `ieduplicates` + `iecodebook` | Medium |
| 11 | **PII detection and flagging** | DIME data security standards | Medium |
| 12 | **Export to PDF/Excel/LaTeX** | ietoolkit (publication-ready), DevResults (Excel export) | Medium |
| 13 | **Ex-ante evaluator fed by real data** (costs from spreadsheet) | Gap in all competitors | Medium |
| 14 | **Kernel density / distribution plots by group** | ietoolkit `iekdensity` | Low-Medium |

### Tier 3: Future Differentiators

| # | Capability | Source Lesson | Complexity |
|---|-----------|--------------|------------|
| 15 | **PSM with propensity score diagnostics** | Academic standard, no platform offers this | High |
| 16 | **IV estimation with first-stage diagnostics** | Academic standard | High |
| 17 | **Synthetic control visualization** | Growing academic use | High |
| 18 | **Reproducibility package download** | DIME standards (gold standard) | Medium |
| 19 | **Pre-analysis plan generator** | DIME reproducibility framework | Medium |
| 20 | **Geographic visualization of treatment/outcomes** | DevResults (mapping), spatial IE | High |
| 21 | **Multi-language UI** | DevResults (12 languages) | Medium |
| 22 | **AI Playground / demo mode** | Sopact (try before you buy) | Low-Medium |

---

## Part 6: Technical Architecture for Data Analysis

### Computation Strategy

| Analysis Type | Computation Approach | Justification |
|--------------|---------------------|---------------|
| Descriptive stats (mean, SD, N) | Client-side JavaScript | Fast, no server round-trip, works offline |
| Balance tables (t-tests, F-tests) | Server-side Python (statsmodels) | Needs proper statistical tests with correct SEs |
| DiD regression | Server-side Python (linearmodels) | Full regression with clustering, FE |
| RDD estimation | Server-side Python or R (rdrobust) | Bandwidth selection, local polynomial |
| PSM | Server-side Python (causalinference) or R (MatchIt) | Propensity score estimation, matching algorithms |
| IV estimation | Server-side Python (linearmodels) | 2SLS, first-stage diagnostics |
| Visualizations | Client-side (Recharts/D3) from server results | Interactive, responsive |

### Recommended Python Stack (Server-Side)

```
statsmodels          — OLS, t-tests, F-tests, robust SEs
linearmodels         — Panel data, IV, clustered SEs, DiD
scipy.stats          — Distribution tests, kernel density
pandas               — Data manipulation, descriptive stats
numpy                — Numerical computation
rdrobust (via rpy2)  — RDD estimation (R bridge if needed)
```

### Data Flow Architecture

```
Browser                          Server (Vercel Serverless)
───────                          ──────────────────────────

Upload CSV/Excel ──────────────→ Parse & validate
       │                               │
       ▼                               ▼
Client-side preview              Store temporarily (encrypted)
(PapaParse / SheetJS)            Detect column types
       │                         Flag PII columns
       ▼                               │
Variable mapping UI ◄───── AI suggests mappings (Claude)
       │                               │
       ▼                               ▼
User confirms:                   Run analysis:
 - treatment var                  - Balance table
 - outcome vars                   - Regression
 - covariates                     - Method-specific estimation
 - cluster var                          │
       │                               ▼
       ▼                         Return results JSON
Display results: ◄──────────────       │
 - Tables                              ▼
 - Charts                        AI interprets results
 - Plain-language summary         (Claude + knowledge base)
 - Export options
```

### Security Model

| Concern | Approach |
|---------|----------|
| PII in uploaded data | Client-side heuristic detection before upload; warn user |
| Data at rest | Encrypted storage; configurable retention (24h/7d/30d/never-store) |
| Data in transit | TLS 1.3 |
| Access control | User owns their data; admin cannot see user uploads |
| Audit trail | Log every analysis run (parameters, not raw data) |
| Ephemeral mode | Option to analyze without storing data — results only |

---

## Part 7: Implementation Roadmap

### Phase A: Document-to-Evaluator Pipeline (Lowest effort, highest immediate value)

Wire existing Upload & Analyze output into Ex-Ante and Ex-Post evaluators:
- After document analysis extracts program info, offer "Continue to Ex-Ante Evaluation" / "Continue to Ex-Post Design"
- Auto-populate evaluator forms with extracted data (sector, costs, population, timeline)
- **No new backend work needed** — just UI piping between existing features

### Phase B: Data Ingestion & Profiling

- CSV parsing (PapaParse) + Excel parsing (SheetJS) in the browser
- DataPreview component: first N rows, column types, basic stats
- PII detection heuristics (names, IDs, phone numbers, GPS)
- Variable profiling: numeric/categorical/binary/date/ID classification
- Data quality flags: missing values %, duplicates, outlier detection

### Phase C: Balance Tables & Descriptive Analysis

- AI-guided variable mapping dialog
- Summary statistics dashboard (N, mean, SD, min, max, missing — grouped by treatment)
- Balance table: group means, t-tests, p-values, normalized differences, F-tests
- Interactive table with sorting, filtering, significance highlighting
- Export to PDF/Excel

### Phase D: Causal Estimation (Method-Specific)

- RCT: Mean difference, OLS with controls, ANCOVA
- DiD: Parallel trends visualization, DiD regression, event study plot
- RDD: Running variable plot, bandwidth selection, local polynomial estimate
- Treatment effect visualizations: bar charts with CIs, coefficient plots
- AI-generated plain-language interpretation of results

### Phase E: Advanced Methods & Reporting

- PSM: Propensity score estimation, matching diagnostics, ATT
- IV: First stage F-stat, second stage estimate, weak instrument test
- Synthetic Control: Counterfactual trajectory plot
- Full PDF report generation with all tables, charts, and narrative
- Reproducibility package download

---

## Key Strategic Takeaways

1. **Balance tables are the #1 priority** — they're needed for every evaluation design and no web platform offers them to non-technical users
2. **Excel is the lingua franca** — every import/export must support Excel; this is non-negotiable
3. **Plain language over jargon** — DevResults and Sopact both succeed because non-technical users can understand the outputs
4. **AI interprets, statistics compute** — use proper statistical methods for estimation, then use Claude to explain results in plain language
5. **Source attribution builds trust** — in a field where "generic AI is not effective" (DevelopMetrics), showing your methodological sources is a competitive advantage
6. **The document→analysis pipeline is low-hanging fruit** — connecting existing features (Upload & Analyze → Evaluators) delivers value with minimal engineering
7. **No competitor does what Causalis does** — the combination of causal inference + non-technical UX + AI guidance + knowledge grounding is genuinely unprecedented
