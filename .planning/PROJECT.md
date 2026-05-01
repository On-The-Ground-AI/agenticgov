# Impact Evaluation App

## What This Is

An AI-powered application that makes rigorous impact evaluation accessible to government officials without specialized econometric training. The app guides users through evaluation design, recommends appropriate methods, assesses proposal quality, and generates standards-compliant reports—all powered by a comprehensive 110,000-word knowledge base.

## Core Value

**Government officials can design rigorous impact evaluations without needing econometric expertise.** If everything else fails, this must work: a program manager describes their program and receives a methodologically sound, defensible evaluation design.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Must Have (MVP):**
- [ ] Evaluation Design Assistant — Guided workflow to design evaluations
- [ ] Method Recommender — Suggests methods based on program characteristics
- [ ] Basic Quality Scoring — Assesses evaluation proposal quality

**Should Have (v1.1):**
- [ ] Theory of Change Builder — Visual ToC construction tool
- [ ] Report Generator — Produces standardized evaluation reports
- [ ] Data Upload and Validation

**Could Have (v1.2):**
- [ ] Automated Analysis (DiD, RDD)
- [ ] Interactive Dashboards
- [ ] Multi-user Collaboration

### Out of Scope

- Full Statistical Analysis Engine — Too complex for v1; focus on design, not execution
- Real-time Data Integration — Requires extensive government system integration
- Automated Literature Review — Nice-to-have, not core value

## Context

**Knowledge Base:**
- 110,000 words of evaluation methodology content
- Part 7: Detailed architecture recommendations
- Part 8: Jurisdictional requirements (for compliance)
- Appendix A: Case studies (for testing/validation)
- Glossary: For UI terminology consistency

**User Personas:**
1. **Sarah (Primary)** — Senior Policy Officer designing workforce training program. Basic stats knowledge, no econometrics. Needs to design evaluable programs from day one.
2. **James (Secondary)** — MoF Evaluation Officer reviewing 50+ proposals/year. Graduate economics training. Needs efficient, consistent quality assessment.
3. **Dr. Chen (Tertiary)** — External evaluation consultant with PhD. Needs efficient documentation and standards compliance.

**Problem Being Solved:**
- Evaluation expertise costs $100K+ per engagement
- Months to design evaluation → hours with guided workflow
- Quality depends on consultant availability → consistent methodology
- Knowledge trapped in experts' heads → codified and reproducible

## Constraints

- **Tech Stack**: React + TypeScript (frontend), Python FastAPI (backend), PostgreSQL (database) — ML integration requirements and modern maintainability
- **LLM**: Claude API (Anthropic) — Best reasoning for complex methodological tasks
- **Vector Store**: Pinecone or Weaviate — For RAG/knowledge retrieval
- **Hosting**: AWS or GCP — Government compliance options required
- **Security**: Government-grade security and compliance requirements
- **Knowledge Base**: Must leverage existing 110K word corpus via RAG architecture

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| RAG architecture for knowledge base | Enables grounded responses with citations; prevents hallucination on methods | — Pending |
| Claude API as LLM | Best reasoning for complex evaluation methodology tasks | — Pending |
| Start with one jurisdiction vs all four | Reduces initial complexity; unclear from PRD | — Needs Decision |
| Cloud provider (AWS vs GCP vs Azure) | Government compliance requirements | — Needs Decision |
| Self-hosted vs managed vector database | Cost/control tradeoff | — Needs Decision |
| Free tier vs paid-only | Business model decision | — Needs Decision |

---
*Last updated: January 28, 2026 after initialization from PRD*
