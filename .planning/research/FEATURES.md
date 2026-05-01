# Feature Research

**Domain:** AI-powered government impact evaluation tools
**Researched:** 2026-01-28
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Evaluation Design Wizard** | Non-experts need structured guidance to navigate evaluation design decisions | MEDIUM | Interactive questionnaire that asks about program context, data availability, timeline, and budget to recommend appropriate evaluation approaches. Similar to TOCO's guided approach but focused on method selection rather than theory of change. |
| **Method Recommendation** | Users expect tool to recommend RCT, quasi-experimental (RDD, DID, PSM), or observational methods based on their context | HIGH | Must handle complexity of matching program characteristics (randomization feasible? baseline data? treatment assignment rules?) to appropriate methods. Core value proposition for non-experts. |
| **Quality Scoring/Rubric** | Government reviewers expect standardized, objective assessment frameworks for comparing proposals | MEDIUM | Rubrics should cover evaluation validity (internal/external), feasibility, cost-effectiveness, and ethical considerations. Must provide both scores and actionable feedback. |
| **Data Requirements Specification** | Users need to know what data to collect, when, and from whom | LOW | Output should specify: sample sizes, timing of data collection (baseline, midline, endline), required variables, comparison group requirements. |
| **Framework Compliance** | Government tools must align with Evidence Act (2018) and agency evaluation standards | MEDIUM | Built-in checks for Evidence Act requirements: systematic methods, independence, transparency. References to OMB M-19-23 and M-20-12 guidance. |
| **Non-Expert Interface** | Primary users are program managers without econometric training | MEDIUM | No coding required. Guided workflows. Plain language explanations of technical concepts (e.g., "selection bias" explained as "people who choose program may differ from those who don't"). |
| **Documentation Generation** | Users expect auto-generated evaluation plans, data collection protocols, and budget templates | LOW | Export to PDF/Word. Templates pre-populated with user inputs. Reduces writing burden for time-constrained government staff. |
| **Evaluation Question Development** | Tools should help users articulate clear, answerable evaluation questions | MEDIUM | Guidance on needs assessment, process evaluation, outcome/impact evaluation, and efficiency assessment questions. CDC framework widely used in government. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI-Powered Context Matching** | Goes beyond rule-based recommendation to learn from thousands of successful evaluations and match to user's specific context | HIGH | Train on corpus of published impact evaluations to identify patterns: "programs like yours typically use X method because Y." Competitive advantage over static decision trees. |
| **Automated Quality Assessment with Explanations** | Unlike generic rubrics, provides AI-generated critique with specific, actionable feedback | HIGH | Example: "Your comparison group selection may introduce selection bias because [specific reason]. Consider [specific alternative approach]." This is the "expert reviewer at scale" value proposition. |
| **Adaptive Guidance by Experience Level** | Automatically adjusts technical depth based on user responses and behavior | MEDIUM | Detects novice users (hesitant responses, basic questions) vs. experienced evaluators (quick navigation, technical terminology). Novices get more scaffolding; experts get less handholding. |
| **Causal Inference Validation** | Checks evaluation design for common threats to validity and suggests mitigations | HIGH | Identifies threats: selection bias, spillover effects, Hawthorne effects, attrition. Maps to specific design features (e.g., "randomization controls for selection bias"). High-value for ensuring rigorous designs. |
| **Batch Review Workflow** | Purpose-built for MoF reviewers assessing 50+ proposals/year | MEDIUM | Side-by-side comparison view, bulk scoring, reviewer assignment, consensus facilitation. Addresses secondary user (MoF reviewers) pain point of processing volume. |
| **Cross-Proposal Scoring Analytics** | Shows how one proposal compares to others in the batch on key criteria | LOW | "This evaluation's internal validity score is in the 75th percentile of proposals reviewed this year." Helps prioritize high-quality designs for funding. |
| **Theory of Change Integration** | Validates that evaluation design aligns with program's theory of change | MEDIUM | Imports from TOCO or allows visual ToC creation. Checks that evaluation measures all critical outcomes in causal chain. Prevents evaluating wrong outcomes. |
| **Collaboration Features for Reviewers** | Multiple reviewers can score independently, then system facilitates consensus | LOW | Independent scoring prevents anchoring bias. Flags large disagreements for discussion. Common in NSF and NIH proposal review systems. |
| **Method-Specific Guidance Libraries** | Deep-dive resources on power calculations, sample size, balance tests for each method | MEDIUM | Example: User selects RDD, gets specific guidance on bandwidth selection, local polynomial regression, McCrary density test. Bridges gap between recommendation and implementation. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Full Statistical Analysis** | "Can your tool run the regression?" | Scope creep into Stata/R/Python territory. These tools are mature, widely taught, and have large ecosystems. Competing with them is futile. | Provide clear handoff: "Your design is complete. Next step: analyze data in [Stata/R] using [specific commands]." Generate analysis scripts as output. |
| **Survey/Data Collection Execution** | "Can users collect data through your platform?" | Reinventing SurveyMonkey/Qualtrics/ODK. Data collection has complex requirements (offline mode, multimedia, skip logic) unrelated to evaluation design. | Integrate with existing tools (export to ODK format). Focus on specifying *what* data to collect, not *how* to collect it. |
| **Real-Time Collaborative Editing** | "Can our team edit the evaluation plan together like Google Docs?" | Adds architectural complexity (CRDTs, conflict resolution, operational transforms). Evaluation design is not typically simultaneous; it's sequential with review checkpoints. | Version control with commenting. Asynchronous review workflow (designer submits → reviewer comments → designer revises) matches actual process. |
| **Fully Automated Evaluation Design** | "Can AI design the whole evaluation without human input?" | Dangerous for rigorous evaluation. Context matters enormously. Automation without expert validation risks poor designs getting implemented. The accountability problem: who's responsible if automated design is flawed? | AI-assisted, human-validated. Tool provides 80% of work (draft design, identify issues) but requires human judgment on key decisions (is randomization ethical? is budget realistic?). |
| **Generic Templates Library** | "Provide 100 evaluation templates users can copy" | Without context, templates are misleading. A healthcare RCT template applied to infrastructure project produces invalid design. Users copy-paste without understanding. | Contextual generation. Instead of static templates, dynamically generate designs based on user's specific program, then allow customization. Every design is tailored. |
| **Complete M&E Platform** | "Track indicators, dashboards, reporting over program lifecycle" | Mission creep. M&E platforms (DevResults, Sopact) already exist and handle ongoing monitoring well. Evaluation design is a distinct, upfront activity. | Stay laser-focused on evaluation design phase. Integrate with M&E platforms via export/API for ongoing monitoring after evaluation launches. |
| **Custom Econometric Modeling** | "Let users build custom causal models" | Requires econometric expertise, which defeats purpose of tool for non-experts. Opens door to specification searching and p-hacking. | Stick to established methods (RCT, DID, RDD, PSM, IV) with proven validity. If user needs custom methods, they need an econometrician, not software. |

## Feature Dependencies

```
[Non-Expert Interface]
    └──requires──> [Evaluation Design Wizard]
                       └──requires──> [Method Recommendation]
                                          └──requires──> [Data Requirements Specification]

[AI-Powered Context Matching]
    └──enhances──> [Method Recommendation]

[Automated Quality Assessment]
    └──requires──> [Quality Scoring/Rubric]
    └──enhances──> [Causal Inference Validation]

[Batch Review Workflow]
    └──requires──> [Quality Scoring/Rubric]
    └──enhances──> [Cross-Proposal Scoring Analytics]
    └──requires──> [Collaboration Features for Reviewers]

[Theory of Change Integration]
    └──enhances──> [Evaluation Question Development]
    └──validates──> [Method Recommendation]

[Adaptive Guidance by Experience Level]
    └──enhances──> [Evaluation Design Wizard]
    └──conflicts──> [Real-Time Collaborative Editing] (personalization breaks in multi-user context)
```

### Dependency Notes

- **Method Recommendation requires Data Requirements Specification:** Can't recommend RCT without knowing if baseline data exists. Can't recommend RDD without knowing if there's a threshold-based assignment rule.

- **AI-Powered Context Matching enhances Method Recommendation:** Upgrades rule-based logic ("if randomization is feasible, recommend RCT") to pattern-matching ("programs with your characteristics typically succeed with RDD because...").

- **Automated Quality Assessment requires Quality Scoring/Rubric:** AI feedback must align with scoring criteria. If rubric emphasizes internal validity, AI should critique threats to internal validity.

- **Batch Review Workflow requires Collaboration Features:** Reviewing 50+ proposals requires reviewer assignment, independent scoring, and consensus mechanisms.

- **Theory of Change Integration validates Method Recommendation:** If ToC shows program affects employment through skills training, evaluation must measure both skills and employment. Missing outcomes in evaluation design gets flagged.

- **Adaptive Guidance conflicts with Real-Time Collaboration:** Personalized interface for novice vs. expert breaks when two users with different levels edit simultaneously. This is why Google Docs is uniform for all users.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept for primary users (program managers).

- [ ] **Evaluation Design Wizard** — Core interaction model. Without guided workflow, tool is just documentation. Wizard validates that non-experts can navigate complex decisions.

- [ ] **Method Recommendation (rule-based)** — Essential value proposition. Must recommend appropriate method (RCT, quasi-experimental, observational) based on context. v1 uses decision tree logic; v2 adds AI learning.

- [ ] **Quality Scoring/Rubric** — Validates that generated designs are rigorous. Provides objective quality bar. Necessary for government adoption (accountability).

- [ ] **Data Requirements Specification** — Completes the evaluation design. Users need actionable output: "collect these variables from these people at these times."

- [ ] **Non-Expert Interface** — Plain language, guided workflows, glossary. Differentiates from Stata/R. If MVP requires econometric expertise, value proposition fails.

- [ ] **Documentation Generation** — Users must be able to export evaluation plan for review/approval. Without export, tool is a dead end.

### Add After Validation (v1.x)

Features to add once core is working and validated with real users.

- [ ] **Framework Compliance** — Add once core design validated. Government agencies will request this, but it's not needed to prove concept with initial pilot users.

- [ ] **Evaluation Question Development** — Enhances wizard but not strictly necessary. Many users arrive with questions already formulated ("Does program increase employment?").

- [ ] **Causal Inference Validation** — High-value enhancement to quality scoring. Identifies specific validity threats. Add after baseline quality scoring is working.

- [ ] **Adaptive Guidance by Experience Level** — Personalization that improves UX but not essential for MVP. Requires usage data to detect experience level patterns.

- [ ] **Method-Specific Guidance Libraries** — Deep resources for implementation. Valuable but users can Google "RDD bandwidth selection" if MVP already recommended RDD.

- [ ] **Batch Review Workflow** — Secondary user (MoF reviewers). Validate primary user value first, then build reviewer tools.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **AI-Powered Context Matching** — Requires large training corpus of evaluations. Defer until sufficient data accumulated from v1 usage. Could be transformative but high technical risk.

- [ ] **Automated Quality Assessment with Explanations** — AI-generated critique. High technical complexity (LLM fine-tuning, prompt engineering, validation). Defer until quality rubric is proven valuable.

- [ ] **Theory of Change Integration** — Valuable but narrow use case. Many government programs don't have formal ToC. Defer until larger user base can justify integration work.

- [ ] **Cross-Proposal Scoring Analytics** — Requires batch of proposals for comparison. Not feasible until adoption reaches critical mass.

- [ ] **Collaboration Features for Reviewers** — Depends on batch review workflow. Defer until MoF reviewer adoption is substantial.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Evaluation Design Wizard | HIGH | MEDIUM | P1 |
| Method Recommendation (rule-based) | HIGH | MEDIUM | P1 |
| Quality Scoring/Rubric | HIGH | MEDIUM | P1 |
| Data Requirements Specification | HIGH | LOW | P1 |
| Non-Expert Interface | HIGH | MEDIUM | P1 |
| Documentation Generation | MEDIUM | LOW | P1 |
| Framework Compliance | MEDIUM | LOW | P2 |
| Evaluation Question Development | MEDIUM | MEDIUM | P2 |
| Causal Inference Validation | HIGH | HIGH | P2 |
| Adaptive Guidance by Experience Level | MEDIUM | MEDIUM | P2 |
| Method-Specific Guidance Libraries | MEDIUM | MEDIUM | P2 |
| Batch Review Workflow | MEDIUM | MEDIUM | P2 |
| AI-Powered Context Matching | HIGH | HIGH | P3 |
| Automated Quality Assessment | HIGH | HIGH | P3 |
| Theory of Change Integration | LOW | MEDIUM | P3 |
| Cross-Proposal Scoring Analytics | LOW | LOW | P3 |
| Collaboration Features for Reviewers | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch (validates core value proposition)
- P2: Should have, add when possible (enhances value, reduces friction)
- P3: Nice to have, future consideration (new capabilities, requires scale)

**Prioritization rationale:**
- P1 features form complete user journey: Wizard → Recommendation → Quality Check → Documentation. Without any P1 feature, tool is unusable or untrustworthy.
- P2 features reduce friction (Framework Compliance speeds government approval) or enhance quality (Causal Inference Validation catches more issues). Valuable but not blocking.
- P3 features require scale (AI needs training data, cross-proposal analytics needs volume) or serve secondary use cases (reviewer collaboration). Defer until PMF achieved with primary users.

## Competitive Feature Analysis

Based on research into existing impact evaluation and decision support tools in government context.

| Feature | DevResults (M&E Platform) | Sopact (Impact Measurement) | USA Hire (Assessment Platform) | Our Approach |
|---------|---------------------------|------------------------------|--------------------------------|--------------|
| **Evaluation Method Recommendation** | Not focused on evaluation design; tracks indicators after evaluation is defined | Not core feature; focuses on impact measurement frameworks (IRIS+, SDG) | Assessment test selection for hiring, not program evaluation | Core differentiator: AI-assisted method selection based on program context. Rule-based v1, ML-enhanced v2. |
| **Quality Scoring** | Project/indicator dashboards but not evaluation design quality | Framework alignment scoring (does data map to IRIS+ metrics?) | Candidate assessment scoring | Rubric-based scoring for evaluation design validity, feasibility, ethics. Government-specific criteria (Evidence Act compliance). |
| **Non-Expert Guidance** | Assumes M&E expertise; steep learning curve | Designed for impact practitioners; moderate complexity | Validated for HR professionals; user-friendly | Plain language wizard for econometric non-experts. Glossary, examples, contextual help. |
| **Batch Processing** | Yes - for multi-project portfolios | Not emphasized | Yes - bulk candidate assessment | Secondary user (MoF reviewers) workflow: 50+ proposals, side-by-side comparison, reviewer assignment. |
| **AI/Automation** | Limited; mostly manual data entry and report configuration | AI for qualitative coding and theme extraction | Validated assessments but not AI-driven | AI for context matching (P3) and quality feedback (P3). Start rule-based, evolve to ML. |
| **Framework Compliance** | Custom to donor requirements (USAID, DFID, etc.) | Strong: IRIS+, SDG, GRI alignment | Federal hiring compliance | Evidence Act (2018), OMB guidance (M-19-23, M-20-12). Pre-built compliance checks. |
| **Data Collection** | Yes - integrated forms and mobile data collection | Yes - survey builder and data import | Yes - test administration platform | No - anti-feature. Export to ODK/Qualtrics. Focus on design, not execution. |
| **Statistical Analysis** | Descriptive analytics and indicator tracking | Impact analysis with framework alignment | Psychometric analysis (not relevant to program eval) | No - anti-feature. Hand off to Stata/R with generated analysis scripts. |
| **Theory of Change** | Basic logic model support | Yes - impact pathway mapping | Not applicable | P3 feature: import from TOCO, validate evaluation measures all ToC outcomes. |

**Key competitive insights:**

1. **White space: Evaluation design phase.** Existing tools focus on ongoing M&E (DevResults) or measurement frameworks (Sopact). None specifically address upfront evaluation design for non-experts. This is the gap.

2. **Government context is underserved.** Most tools are for international development NGOs or social enterprises. Government-specific requirements (Evidence Act, OMB compliance, proposal review workflows) are unmet needs.

3. **AI is emerging but narrow.** Sopact uses AI for qualitative coding. No tool uses AI for evaluation method recommendation or design quality critique. Opportunity for differentiation.

4. **Integration over reinvention.** Both DevResults and Sopact built full data collection and analysis stacks, creating maintenance burden. Our anti-features strategy (no data collection, no statistical analysis) avoids this trap.

5. **Expertise gap is real.** All existing tools assume evaluation expertise. Non-expert interface is differentiator.

## User Persona Feature Mapping

Understanding which features serve which user personas guides prioritization.

### Primary User: Program Manager (Non-Expert)

**Needs:** Design evaluation for their program without hiring econometrician. Get approval from supervisor/review board.

**Critical features:**
- Evaluation Design Wizard (guides through decisions)
- Method Recommendation (tells them what to do)
- Non-Expert Interface (accessible without training)
- Data Requirements Specification (actionable output)
- Documentation Generation (presentable plan)

**Nice-to-have features:**
- Framework Compliance (speeds approval)
- Evaluation Question Development (helps articulate goals)
- Adaptive Guidance (makes learning easier)

**Don't need:**
- Batch Review Workflow (they submit one proposal, not 50)
- Collaboration Features for Reviewers (they're not reviewers)
- Cross-Proposal Analytics (no comparison group)

### Secondary User: MoF Reviewer

**Needs:** Assess 50+ proposals/year. Identify high-quality evaluation designs. Justify funding decisions.

**Critical features:**
- Quality Scoring/Rubric (objective assessment)
- Batch Review Workflow (handle volume)
- Cross-Proposal Scoring Analytics (relative quality)
- Collaboration Features for Reviewers (consensus)

**Nice-to-have features:**
- Automated Quality Assessment (faster initial review)
- Causal Inference Validation (catches issues they might miss)
- Framework Compliance (checks Evidence Act requirements)

**Don't need:**
- Evaluation Design Wizard (they review, not design)
- Method Recommendation (reviewing existing designs)
- Non-Expert Interface (they are experts, or work with them)

### Tertiary User: Econometrician/Evaluation Consultant

**Needs:** Validate that recommended design is rigorous. Customize for edge cases. Hand off to statistical software.

**Critical features:**
- Method-Specific Guidance Libraries (deep technical resources)
- Causal Inference Validation (comprehensive validity checks)
- Documentation Generation (export for client)

**Nice-to-have features:**
- AI-Powered Context Matching (learn from their past work)
- Theory of Change Integration (validate program logic)

**Don't need:**
- Non-Expert Interface (they are experts; may find scaffolding annoying)
- Adaptive Guidance (they know what they're doing)
- Batch Review Workflow (they design, not review)

**Feature overlap insights:**
- Quality Scoring serves both program managers (self-check) and reviewers (assessment)
- Documentation Generation serves program managers (submission) and consultants (deliverable)
- Causal Inference Validation serves program managers (learning) and consultants (validation)
- Batch features serve only reviewers → defer until primary user validated

## Sources

### Government AI and Evaluation
- [AI in Government: Examples & Challenges in 2026](https://research.aimultiple.com/ai-government/)
- [AI Guide for Government - AI CoE](https://coe.gsa.gov/coe/ai-guide-for-government/print-all/index.html)
- [GSA Capacity Assessment for Evidence-Building and Evaluation](https://www.gsa.gov/system/files/GSA%20Capacity%20Assessment%20for%20Evidence-Building%20and%20Evaluation(update).pdf)
- [Program Evaluation Resources | US EPA](https://www.epa.gov/evaluate/program-evaluation-resources)
- [Program Evaluation | OPM](https://www.opm.gov/services-for-agencies/assessment-evaluation/program-evaluation/)

### Impact Evaluation Software and Best Practices
- [Impact Measurement That Actually Works - Sopact](https://www.sopact.com/use-case/impact-measurement)
- [Impact Evaluation — From Data Chaos to Clean, Continuous Learning - Sopact](https://www.sopact.com/use-case/impact-evaluation)
- [Best Impact Evaluation Tools to Use for Smarter 2025 Goals - Insight7](https://insight7.io/top-6-impact-evaluation-tools/)
- [Impact evaluation in practice | Better Evaluation](https://www.betterevaluation.org/tools-resources/impact-evaluation-practice)
- [Impact evaluation | Better Evaluation](https://www.betterevaluation.org/methods-approaches/themes/impact-evaluation)

### Decision Support Systems
- [Best Decision Support Software 2026 | Capterra](https://www.capterra.com/decision-support-software/)
- [Decision Support System (DSS): Definition & Best Practices - Qlik](https://www.qlik.com/us/business-intelligence/decision-support-system)
- [Evaluating the Effectiveness of Decision Support System](https://thesai.org/Downloads/Volume9No10/Paper_23-Evaluating_the_Effectiveness_of_Decision_Support_System.pdf)

### Econometric Software for Non-Experts
- [A Comprehensive Overview of Econometrics Software - Econometrics Tutor](https://www.econometricstutor.co.uk/statistical-software-packages-r)
- [Top Econometrics Tools for Data Analysis - Statswork](https://www.statswork.com/insights/q-and-a/econometrics-tools-for-data-analysis/)
- [A Simple Guide to Econometrics Software in Depth - Number Analytics](https://www.numberanalytics.com/blog/simple-guide-econometrics-software-depth)

### Proposal Evaluation and Review
- [How to Evaluate Proposals for RFP? Top 10 Strategies for 2026 - Inventive AI](https://www.inventive.ai/blog-posts/evaluating-proposals-tips-strategies)
- [RFP Scoring Software: Measuring Proposal Excellence - oboloo](https://oboloo.com/rfp-scoring-software-measuring-proposal-excellence/)
- [Master the Art of Software Proposal Evaluation in 2026 - BayTech Consulting](https://www.baytechconsulting.com/blog/software-proposal-evaluation-2026)

### Evaluation Design and Methods
- [Randomised controlled trials—the gold standard for effectiveness research - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6235704/)
- [Alternatives to Randomized Control Trials: A Review of Three Quasi-experimental Designs for Causal Inference](https://www.scielo.sa.cr/scielo.php?script=sci_arttext&pid=S2215-35352015000200020)
- [Developing Evaluation Questions - CDC](https://www.cdc.gov/training-development/media/pdfs/2024/04/Developing-Evaluation-Questions.pdf)
- [Resources and Tools for Impact Evaluation | IPA](https://poverty-action.org/publication/resources-and-tools-impact-evaluation)

### Rubrics and Quality Assessment
- [Using rubrics | Center for Teaching Innovation - Cornell](https://teaching.cornell.edu/teaching-resources/assessment-evaluation/using-rubrics)
- [Rubrics for Assessment | Center for Innovative Teaching and Learning - NIU](https://www.niu.edu/citl/resources/guides/instructional-guide/rubrics-for-assessment.shtml)

### Common Pitfalls
- [Avoid These 5 Things When Developing Program Evaluation Surveys - Clear Impact](https://clearimpact.com/3-most-common-mistakes-when-using-surveys/)
- [Ten Common Flaws in Evaluations | Global Development Network](https://www.gdn.int/ten-common-flaws-evaluations)
- [Software evaluation criteria checklist in 2025 - Spendflo](https://www.spendflo.com/blog/software-assessment-checklist)

### Theory of Change Tools
- [Theory of change software | Better Evaluation](https://www.betterevaluation.org/tools-resources/theory-change-software)
- [TOCO | Better Evaluation](https://www.betterevaluation.org/tools-resources/toco)
- [TOCO Software - Theory of Change Community](https://www.theoryofchange.org/toco-software/)

### Competitive Tools
- [AI Powered Monitoring and Evaluation Tools - Sopact](https://www.sopact.com/use-case/monitoring-and-evaluation-tools)
- [DevResults Features, Specifications and More in 2026 | TopSoftwareAdvisor](https://www.topsoftwareadvisor.com/software/devresults)
- [ImpactMapper Features](https://www.impactmapper.com/features)

---
*Feature research for: AI-powered government impact evaluation tools*
*Researched: 2026-01-28*
*Primary focus: Feature landscape for evaluation design assistant targeting non-expert program managers and MoF reviewers*
