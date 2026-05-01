import type { AgentStep } from '../components/AgentStepSimulator';

// ---------------------------------------------------------------------------
// 1. Program Disclosure Data
// ---------------------------------------------------------------------------

export interface ProgramDisclosure {
  id: string;
  name: string;
  ministry: string;
  overallCompleteness: number;
  dimensions: { name: string; complete: boolean; score: number }[];
  evidenceQuality: 'strong' | 'moderate' | 'weak';
  evidenceGaps: string[];
  wefBenchmark: number;
  recommendations: string[];
}

export const PROGRAMS_DISCLOSURE: ProgramDisclosure[] = [
  {
    id: 'sls',
    name: 'Student Learning Space (SLS)',
    ministry: 'Ministry of Education',
    overallCompleteness: 91,
    dimensions: [
      { name: 'Objectives', complete: true, score: 95 },
      { name: 'Budget', complete: true, score: 90 },
      { name: 'Timeline', complete: true, score: 92 },
      { name: 'KPIs', complete: true, score: 94 },
      { name: 'Results', complete: true, score: 88 },
      { name: 'Methodology', complete: true, score: 90 },
      { name: 'Limitations', complete: true, score: 85 },
      { name: 'External Audit', complete: true, score: 93 },
    ],
    evidenceQuality: 'strong',
    evidenceGaps: ['Long-term learning outcome tracking beyond 24 months'],
    wefBenchmark: 85,
    recommendations: [
      'Commission 36-month longitudinal study on student outcomes',
      'Publish annual open data release of platform analytics',
    ],
  },
  {
    id: 'stem-academy',
    name: 'National STEM Academy',
    ministry: 'Ministry of Education',
    overallCompleteness: 88,
    dimensions: [
      { name: 'Objectives', complete: true, score: 92 },
      { name: 'Budget', complete: true, score: 88 },
      { name: 'Timeline', complete: true, score: 90 },
      { name: 'KPIs', complete: true, score: 91 },
      { name: 'Results', complete: true, score: 85 },
      { name: 'Methodology', complete: true, score: 87 },
      { name: 'Limitations', complete: false, score: 72 },
      { name: 'External Audit', complete: true, score: 92 },
    ],
    evidenceQuality: 'strong',
    evidenceGaps: [
      'No published discussion of selection bias in pilot sites',
      'Cost-per-student methodology not externally validated',
    ],
    wefBenchmark: 85,
    recommendations: [
      'Add limitations section discussing site selection methodology',
      'Commission independent cost-effectiveness analysis',
    ],
  },
  {
    id: 'tax-compliance',
    name: 'Tax Compliance Modernisation',
    ministry: 'Ministry of Finance',
    overallCompleteness: 78,
    dimensions: [
      { name: 'Objectives', complete: true, score: 88 },
      { name: 'Budget', complete: true, score: 82 },
      { name: 'Timeline', complete: true, score: 80 },
      { name: 'KPIs', complete: true, score: 76 },
      { name: 'Results', complete: false, score: 65 },
      { name: 'Methodology', complete: true, score: 78 },
      { name: 'Limitations', complete: false, score: 58 },
      { name: 'External Audit', complete: true, score: 85 },
    ],
    evidenceQuality: 'moderate',
    evidenceGaps: [
      'Interim results not yet published for Phase 2',
      'No independent evaluation framework established',
      'Limitations section absent from public disclosure',
    ],
    wefBenchmark: 85,
    recommendations: [
      'Publish Phase 2 interim results within 90 days',
      'Establish independent evaluation panel with external experts',
      'Add limitations and risk disclosure section',
    ],
  },
  {
    id: 'skillsfuture',
    name: 'SkillsFuture National Workforce Programme',
    ministry: 'Ministry of Manpower',
    overallCompleteness: 72,
    dimensions: [
      { name: 'Objectives', complete: true, score: 90 },
      { name: 'Budget', complete: true, score: 78 },
      { name: 'Timeline', complete: true, score: 82 },
      { name: 'KPIs', complete: true, score: 75 },
      { name: 'Results', complete: false, score: 60 },
      { name: 'Methodology', complete: false, score: 55 },
      { name: 'Limitations', complete: false, score: 42 },
      { name: 'External Audit', complete: true, score: 80 },
    ],
    evidenceQuality: 'moderate',
    evidenceGaps: [
      'No counterfactual analysis of employment outcomes',
      'Methodology for calculating job placement rates not published',
      'No discussion of limitations or potential displacement effects',
      'Long-term retention data (beyond 12 months) not disclosed',
    ],
    wefBenchmark: 85,
    recommendations: [
      'Commission quasi-experimental evaluation (DiD or RDD)',
      'Publish full methodology document for KPI calculations',
      'Add limitations section addressing selection and displacement',
      'Establish 36-month employment retention tracking',
    ],
  },
  {
    id: 'telemedicine',
    name: 'National Telemedicine Hub',
    ministry: 'Ministry of Health',
    overallCompleteness: 65,
    dimensions: [
      { name: 'Objectives', complete: true, score: 85 },
      { name: 'Budget', complete: false, score: 50 },
      { name: 'Timeline', complete: true, score: 78 },
      { name: 'KPIs', complete: true, score: 72 },
      { name: 'Results', complete: false, score: 48 },
      { name: 'Methodology', complete: false, score: 45 },
      { name: 'Limitations', complete: false, score: 38 },
      { name: 'External Audit', complete: false, score: 55 },
    ],
    evidenceQuality: 'weak',
    evidenceGaps: [
      'Budget allocation breakdown not publicly disclosed',
      'No published results beyond aggregate consultation counts',
      'No evaluation methodology or framework established',
      'No limitations or risk disclosure',
      'External audit not yet conducted',
    ],
    wefBenchmark: 85,
    recommendations: [
      'Publish full budget allocation and expenditure data',
      'Establish evaluation framework with clinical outcome KPIs',
      'Disclose patient satisfaction and health outcome results',
      'Commission external audit within next fiscal quarter',
      'Add limitations section addressing equity of access',
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. Pre-generated Transparency Report (KidSTART example)
// ---------------------------------------------------------------------------

export const GENERATED_REPORT = `TRANSPARENCY DISCLOSURE REPORT
KidSTART Universal Early Childhood Programme
Ministry of Education — Federal Government
Report Period: FY 2025-26

1. PROGRAMME OBJECTIVES
Provide universal access to quality early childhood education for children aged 4-5 across all five regions. Target: 95% enrollment by 2028 aligned with Long-Range Vision human capital pillar.

2. BUDGET ALLOCATION
Total Programme Budget: $2.8B over 5 years (FY 2025-2030).
FY 2025-26 Allocation: $480M (infrastructure: 55%, staffing: 30%, curriculum: 10%, M&E: 5%).
Funding Source: Whole-of-Government budget with co-financing from region-level education authorities.

3. TIMELINE & MILESTONES
Phase 1 (2025-2026): Pilot in 120 centres across Singapore and Singapore. COMPLETE.
Phase 2 (2026-2027): Scale to 500 centres across all regions. IN PROGRESS.
Phase 3 (2027-2028): Full national coverage with 1,200+ centres. PLANNED.

4. KEY PERFORMANCE INDICATORS
- Enrollment rate: 62% of eligible children (target: 70% by end FY26)
- Teacher-to-child ratio: 1:12 (target: 1:10)
- Parental satisfaction: 84% (target: 85%)
- Learning readiness assessment: 71% meeting benchmarks (target: 75%)

5. RESULTS TO DATE
14,400 children enrolled in Phase 1 pilot. Early developmental assessments show 8.2 percentage point improvement in school readiness compared to non-KidSTART peers. Cost per child: $33,200/year.

6. METHODOLOGY
Evaluation design: Cluster-RCT across 25 treatment and 25 control sites. Pre-registered analysis plan. Independent data collection by external research partner.

7. LIMITATIONS
Pilot sites are disproportionately urban. Rural and remote communities underrepresented in Phase 1 data. Self-selection bias in enrollment may overstate effects. Longer-term outcomes (primary school performance) not yet measurable.

8. EXTERNAL AUDIT
PricewaterhouseCoopers appointed as independent auditor. First audit report expected Q2 2026.

---
Classification: PUBLIC
Generated by TransparencyAI Agent | Advisory Only | ${new Date().toISOString().split('T')[0]}`;

// ---------------------------------------------------------------------------
// 3. Deadline Tracker
// ---------------------------------------------------------------------------

export interface DeadlineItem {
  ministry: string;
  reportType: string;
  dueDate: string;
  daysRemaining: number;
  completionPct: number;
  status: 'on-track' | 'at-risk' | 'overdue';
  agentAction: string;
}

export const DEADLINE_TRACKER: DeadlineItem[] = [
  {
    ministry: 'Ministry of Finance',
    reportType: 'Quarterly Fiscal Transparency Report',
    dueDate: '2026-05-15',
    daysRemaining: 17,
    completionPct: 82,
    status: 'on-track',
    agentAction: 'Auto-populated 12/15 fields from FiscalAI. Awaiting MOF sign-off.',
  },
  {
    ministry: 'Ministry of Education',
    reportType: 'Annual Programme Evaluation Disclosure',
    dueDate: '2026-05-30',
    daysRemaining: 32,
    completionPct: 65,
    status: 'on-track',
    agentAction: 'Draft generated. Pending methodology section review by evaluation unit.',
  },
  {
    ministry: 'Ministry of Health',
    reportType: 'Quarterly Spending Disclosure',
    dueDate: '2026-05-10',
    daysRemaining: 12,
    completionPct: 45,
    status: 'at-risk',
    agentAction: 'Escalation sent to MOH compliance officer. Budget breakdown incomplete.',
  },
  {
    ministry: 'Ministry of Manpower',
    reportType: 'SkillsFuture Programme Transparency Report',
    dueDate: '2026-05-20',
    daysRemaining: 22,
    completionPct: 38,
    status: 'at-risk',
    agentAction: 'Awaiting employment outcome data from MOM statistical unit. Reminder sent.',
  },
  {
    ministry: 'Ministry of Economy',
    reportType: 'FDI Incentive Programme Disclosure',
    dueDate: '2026-04-25',
    daysRemaining: -3,
    completionPct: 71,
    status: 'overdue',
    agentAction: 'OVERDUE: Escalated to Undersecretary. Missing external audit section.',
  },
  {
    ministry: 'GovTech Singapore (GovTech)',
    reportType: 'Digital Services Annual Report',
    dueDate: '2026-06-15',
    daysRemaining: 48,
    completionPct: 90,
    status: 'on-track',
    agentAction: 'Near complete. Final citizen satisfaction survey data expected next week.',
  },
];

// ---------------------------------------------------------------------------
// 4. Auto-Generated Report Data Sources
// ---------------------------------------------------------------------------

export interface ReportDataSource {
  app: string;
  appColor: string;
  dataType: string;
  fieldsPopulated: number;
  totalFields: number;
  lastUpdated: string;
}

export const REPORT_DATA_SOURCES: ReportDataSource[] = [
  {
    app: 'FiscalAI',
    appColor: '#059669',
    dataType: 'Budget allocation & expenditure',
    fieldsPopulated: 12,
    totalFields: 15,
    lastUpdated: '2 hours ago',
  },
  {
    app: 'TenderAI',
    appColor: '#7C3AED',
    dataType: 'Procurement outcomes & vendor data',
    fieldsPopulated: 8,
    totalFields: 10,
    lastUpdated: '4 hours ago',
  },
  {
    app: 'GovBench',
    appColor: '#0891B2',
    dataType: 'KPI benchmarks & peer comparisons',
    fieldsPopulated: 6,
    totalFields: 8,
    lastUpdated: '1 day ago',
  },
  {
    app: 'PolicyAI',
    appColor: '#6366F1',
    dataType: 'Policy impact assessments',
    fieldsPopulated: 4,
    totalFields: 7,
    lastUpdated: '3 days ago',
  },
];

// ---------------------------------------------------------------------------
// 5. Quality Improvement Recommendations
// ---------------------------------------------------------------------------

export interface QualityRecommendation {
  dimension: string;
  currentScore: number;
  targetScore: number;
  recommendation: string;
  dataAvailable: boolean;
  sourceApp?: string;
}

export const QUALITY_RECOMMENDATIONS: QualityRecommendation[] = [
  {
    dimension: 'Budget Transparency',
    currentScore: 50,
    targetScore: 85,
    recommendation: 'Publish line-item budget breakdown with expenditure tracking. FiscalAI already holds this data — approve cross-platform sharing to auto-populate.',
    dataAvailable: true,
    sourceApp: 'FiscalAI',
  },
  {
    dimension: 'Results Reporting',
    currentScore: 48,
    targetScore: 85,
    recommendation: 'Add quantitative outcome metrics with baseline comparisons. PolicyAI has impact assessment data for 3 of 5 programmes.',
    dataAvailable: true,
    sourceApp: 'PolicyAI',
  },
  {
    dimension: 'Methodology Disclosure',
    currentScore: 45,
    targetScore: 85,
    recommendation: 'Publish evaluation methodology and data collection approach. No automated source available — requires manual input from programme evaluation unit.',
    dataAvailable: false,
  },
  {
    dimension: 'Limitations & Risks',
    currentScore: 38,
    targetScore: 85,
    recommendation: 'Add section on known limitations, selection bias, and external validity constraints. Agent can generate draft from programme design documents.',
    dataAvailable: false,
  },
  {
    dimension: 'External Audit',
    currentScore: 55,
    targetScore: 85,
    recommendation: 'Commission independent audit and publish findings. TenderAI procurement records can verify audit firm selection compliance.',
    dataAvailable: true,
    sourceApp: 'TenderAI',
  },
];

// ---------------------------------------------------------------------------
// 6. Fiscal Anomaly Alert (from FiscalAI)
// ---------------------------------------------------------------------------

export interface FiscalAnomalyAlert {
  source: string;
  amount: string;
  ministry: string;
  description: string;
  disclosureRequired: boolean;
  deadline: string;
  confidence: number;
}

export const FISCAL_ANOMALY: FiscalAnomalyAlert = {
  source: 'FiscalAI',
  amount: '$850M',
  ministry: 'Ministry of Economy',
  description: 'FiscalAI detected an $850M variance between approved budget and actual expenditure in the FDI Incentive Programme. This exceeds the 10% materiality threshold and must be disclosed in the quarterly transparency report per Public Sector (Governance) Act 2018.',
  disclosureRequired: true,
  deadline: '2026-05-15',
  confidence: 94,
};

// ---------------------------------------------------------------------------
// 7. Agent Workflow Steps
// ---------------------------------------------------------------------------

export const TRANSPARENCY_AGENT_STEPS: AgentStep[] = [
  { icon: 'search', message: 'Scanning programme disclosure documents across ministries', duration: 1300 },
  { icon: 'check', message: 'Evaluating 8-dimension compliance checklist per programme', duration: 1400, detail: 'Objectives, Budget, Timeline, KPIs, Results, Methodology, Limitations, Audit' },
  { icon: 'analyze', message: 'Assessing evidence quality against WEF transparency benchmarks', duration: 1200 },
  { icon: 'compare', message: 'Comparing disclosure scores to 85% WEF benchmark threshold', duration: 1000 },
  { icon: 'generate', message: 'Generating gap analysis and remediation recommendations', duration: 1500, detail: '5 programmes assessed' },
  { icon: 'alert', message: 'Flagging programmes below compliance threshold', duration: 800, detail: '2 programmes require immediate attention' },
  { icon: 'send', message: 'Publishing compliance tracker and transparency reports', duration: 700, detail: 'Dashboard updated' },
];
