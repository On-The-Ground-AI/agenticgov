# Requirements

## v1 Requirements

### Authentication & User Management (AUTH)

- [ ] **AUTH-01**: User can create account with email/password
- [ ] **AUTH-02**: User can log in and maintain session across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can reset password via email link

### Evaluation Design Assistant (EVAL)

- [ ] **EVAL-01**: User can describe their program in natural language and receive structured evaluation design
- [ ] **EVAL-02**: User can answer guided questions about program context (timeline, budget, data availability)
- [ ] **EVAL-03**: User can view recommended evaluation approach with methodology explanation
- [ ] **EVAL-04**: User can see citations from knowledge base supporting recommendations
- [ ] **EVAL-05**: User can save and retrieve evaluation designs

### Method Recommender (METH)

- [ ] **METH-01**: System recommends appropriate evaluation methods based on program characteristics
- [ ] **METH-02**: User can see why specific methods are recommended (rationale with citations)
- [ ] **METH-03**: User can see alternative methods with trade-off explanations
- [ ] **METH-04**: System flags when program characteristics don't support rigorous evaluation
- [ ] **METH-05**: User can filter methods by feasibility constraints (budget, timeline, data)

### Quality Scoring (QUAL)

- [ ] **QUAL-01**: User can upload or paste evaluation proposal text
- [ ] **QUAL-02**: System scores proposal quality on standardized rubric
- [ ] **QUAL-03**: User can see specific feedback on proposal strengths and weaknesses
- [ ] **QUAL-04**: User can see improvement suggestions with knowledge base references
- [ ] **QUAL-05**: User can compare multiple proposals side-by-side

### Knowledge Base & RAG (KB)

- [ ] **KB-01**: System retrieves relevant methodology content for user queries
- [ ] **KB-02**: All AI responses include citations to source documents
- [ ] **KB-03**: System indicates confidence level for recommendations
- [ ] **KB-04**: System refuses to answer when knowledge base doesn't contain relevant information (no hallucination)

### Core Infrastructure (INFRA)

- [ ] **INFRA-01**: API endpoints respond within 3 seconds for standard queries
- [ ] **INFRA-02**: System maintains audit log of all AI interactions
- [ ] **INFRA-03**: Data encrypted at rest and in transit
- [ ] **INFRA-04**: System handles concurrent users without degradation

---

## v2 Requirements (Deferred)

### Theory of Change Builder
- [ ] Visual ToC construction with drag-and-drop
- [ ] Export ToC as image/PDF
- [ ] Link ToC elements to evaluation design

### Report Generator
- [ ] Generate standardized evaluation reports
- [ ] Multiple output formats (PDF, Word, HTML)
- [ ] Template customization per jurisdiction

### Advanced Analysis
- [ ] Automated DiD analysis
- [ ] Automated RDD analysis
- [ ] Statistical power calculations

### Collaboration
- [ ] Multi-user workspaces
- [ ] Comment and review workflows
- [ ] Role-based permissions

---

## Out of Scope

- **Full statistical analysis engine** — Focus on design, not execution; users have existing tools
- **Real-time government data integration** — Requires extensive API work with external systems
- **Automated literature review** — Nice-to-have, not core to evaluation design
- **Multi-language support** — English only for v1; revisit based on user demand
- **Mobile app** — Web responsive is sufficient for v1 use cases
- **Offline mode** — Government users have reliable connectivity

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| AUTH-01 | 1 | Pending |
| AUTH-02 | 1 | Pending |
| AUTH-03 | 1 | Pending |
| AUTH-04 | 1 | Pending |
| EVAL-01 | 2 | Pending |
| EVAL-02 | 2 | Pending |
| EVAL-03 | 2 | Pending |
| EVAL-04 | 2 | Pending |
| EVAL-05 | 2 | Pending |
| METH-01 | 3 | Pending |
| METH-02 | 3 | Pending |
| METH-03 | 3 | Pending |
| METH-04 | 3 | Pending |
| METH-05 | 3 | Pending |
| QUAL-01 | 4 | Pending |
| QUAL-02 | 4 | Pending |
| QUAL-03 | 4 | Pending |
| QUAL-04 | 4 | Pending |
| QUAL-05 | 4 | Pending |
| KB-01 | 2 | Pending |
| KB-02 | 2 | Pending |
| KB-03 | 2 | Pending |
| KB-04 | 2 | Pending |
| INFRA-01 | 1 | Pending |
| INFRA-02 | 1 | Pending |
| INFRA-03 | 1 | Pending |
| INFRA-04 | 1 | Pending |

---
*Last updated: January 28, 2026 after requirements definition*
