import type { AgentStep } from '../components/AgentStepSimulator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FiscalProgram {
  id: string;
  ministry: string;
  ministryShort: string;
  program: string;
  allocatedBudgetM: number;
  spentToDateM: number;
  spentPct: number;
  kpiName: string;
  kpiTarget: number;
  kpiActual: number;
  kpiUnit: string;
  efficiencyRatio: number;
  benchmarkRatio: number;
  riskFlag: 'green' | 'yellow' | 'red';
  insight: string;
}

export interface SpendingAnomaly {
  ministry: string;
  category: string;
  budgetedM: number;
  actualM: number;
  variance: number;
  variancePct: number;
  possibleCauses: { cause: string; likelihood: 'high' | 'medium' | 'low' }[];
  agentRecommendation: string;
}

export interface FiscalForecast {
  title: string;
  years: { year: number; costM: number; beneficiaries: number; cumulativeCostM: number }[];
  totalCostM: number;
  breakEvenYear: number;
  npvM: number;
  bcr: number;
  costPerBeneficiary: number;
}

// ---------------------------------------------------------------------------
// Ministry Programs
// ---------------------------------------------------------------------------

export const MINISTRY_PROGRAMS: FiscalProgram[] = [
  // Ministry of Education — 5 programs
  {
    id: 'moe-sls',
    ministry: 'Ministry of Education',
    ministryShort: 'Education',
    program: 'Student Learning Space (SLS)',
    allocatedBudgetM: 420,
    spentToDateM: 315,
    spentPct: 75,
    kpiName: 'Student Engagement Rate',
    kpiTarget: 85,
    kpiActual: 78,
    kpiUnit: '%',
    efficiencyRatio: 1.04,
    benchmarkRatio: 1.0,
    riskFlag: 'yellow',
    insight: 'Student engagement 7pp below target; recommend targeted content refresh for underperforming subjects.',
  },
  {
    id: 'moe-stem',
    ministry: 'Ministry of Education',
    ministryShort: 'Education',
    program: 'STEM Academy Network',
    allocatedBudgetM: 680,
    spentToDateM: 510,
    spentPct: 75,
    kpiName: 'STEM Graduates',
    kpiTarget: 12000,
    kpiActual: 11400,
    kpiUnit: 'students',
    efficiencyRatio: 0.94,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'On track. Cost per STEM graduate $1,200 vs OECD avg $1,450 — 17% more efficient.',
  },
  {
    id: 'moe-teacher',
    ministry: 'Ministry of Education',
    ministryShort: 'Education',
    program: 'Teacher Professional Development',
    allocatedBudgetM: 290,
    spentToDateM: 275,
    spentPct: 95,
    kpiName: 'Teachers Certified',
    kpiTarget: 8000,
    kpiActual: 6200,
    kpiUnit: 'teachers',
    efficiencyRatio: 1.30,
    benchmarkRatio: 1.0,
    riskFlag: 'red',
    insight: 'Budget 95% spent with only 78% of target certifications. Unit cost $44,350 vs planned $36,250.',
  },
  {
    id: 'moe-eced',
    ministry: 'Ministry of Education',
    ministryShort: 'Education',
    program: 'Early Childhood Centres of Excellence',
    allocatedBudgetM: 550,
    spentToDateM: 330,
    spentPct: 60,
    kpiName: 'Enrollment Rate (3-5yr)',
    kpiTarget: 95,
    kpiActual: 82,
    kpiUnit: '%',
    efficiencyRatio: 0.73,
    benchmarkRatio: 1.0,
    riskFlag: 'yellow',
    insight: 'Under-spending may indicate procurement delays. Enrollment gap of 13pp needs accelerated outreach.',
  },
  {
    id: 'moe-scholarship',
    ministry: 'Ministry of Education',
    ministryShort: 'Education',
    program: 'National Scholarship Programme',
    allocatedBudgetM: 380,
    spentToDateM: 361,
    spentPct: 95,
    kpiName: 'Scholars Abroad',
    kpiTarget: 5000,
    kpiActual: 4850,
    kpiUnit: 'students',
    efficiencyRatio: 1.0,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'On track — 97% of scholarship target achieved with proportional spend.',
  },

  // Ministry of Health — 4 programs
  {
    id: 'moh-telehealth',
    ministry: 'Ministry of Health',
    ministryShort: 'Health',
    program: 'Telemedicine Hub',
    allocatedBudgetM: 310,
    spentToDateM: 248,
    spentPct: 80,
    kpiName: 'Teleconsultations',
    kpiTarget: 500000,
    kpiActual: 430000,
    kpiUnit: 'sessions',
    efficiencyRatio: 0.93,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'Cost per teleconsultation $577 vs in-person $1,200 — 52% savings. High patient satisfaction (4.3/5).',
  },
  {
    id: 'moh-genomics',
    ministry: 'Ministry of Health',
    ministryShort: 'Health',
    program: 'National Genomics Programme',
    allocatedBudgetM: 750,
    spentToDateM: 600,
    spentPct: 80,
    kpiName: 'Genomes Sequenced',
    kpiTarget: 1000000,
    kpiActual: 720000,
    kpiUnit: 'genomes',
    efficiencyRatio: 1.04,
    benchmarkRatio: 1.0,
    riskFlag: 'yellow',
    insight: 'Sequencing pace needs +40% acceleration. Current cost $833/genome; target $750. Bulk procurement recommended.',
  },
  {
    id: 'moh-prevention',
    ministry: 'Ministry of Health',
    ministryShort: 'Health',
    program: 'Preventive Health Screening',
    allocatedBudgetM: 220,
    spentToDateM: 154,
    spentPct: 70,
    kpiName: 'Population Screened',
    kpiTarget: 2000000,
    kpiActual: 1650000,
    kpiUnit: 'people',
    efficiencyRatio: 0.81,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'Cost-effective delivery at $93/person vs $110 budget. Early detection rate 12% — aligned with WHO benchmarks.',
  },
  {
    id: 'moh-pharma',
    ministry: 'Ministry of Health',
    ministryShort: 'Health',
    program: 'Pharmaceutical Supply Chain',
    allocatedBudgetM: 480,
    spentToDateM: 504,
    spentPct: 105,
    kpiName: 'Drug Availability Index',
    kpiTarget: 98,
    kpiActual: 96,
    kpiUnit: '%',
    efficiencyRatio: 1.10,
    benchmarkRatio: 1.0,
    riskFlag: 'red',
    insight: 'Over-budget by 5% due to global supply chain disruptions. Stockpiling costs +$24M above plan.',
  },

  // Ministry of Finance — 4 programs
  {
    id: 'mof-tax',
    ministry: 'Ministry of Finance',
    ministryShort: 'Finance',
    program: 'Tax Compliance Automation',
    allocatedBudgetM: 185,
    spentToDateM: 148,
    spentPct: 80,
    kpiName: 'Compliance Rate',
    kpiTarget: 98,
    kpiActual: 94,
    kpiUnit: '%',
    efficiencyRatio: 0.86,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'Automated processing handles 89% of filings. Compliance gap of 4pp concentrated in SME segment.',
  },
  {
    id: 'mof-procurement',
    ministry: 'Ministry of Finance',
    ministryShort: 'Finance',
    program: 'Government Procurement Digitisation',
    allocatedBudgetM: 260,
    spentToDateM: 221,
    spentPct: 85,
    kpiName: 'Digital Tender Rate',
    kpiTarget: 100,
    kpiActual: 87,
    kpiUnit: '%',
    efficiencyRatio: 0.98,
    benchmarkRatio: 1.0,
    riskFlag: 'yellow',
    insight: '13% of tenders still paper-based — concentrated in Defence and classified procurement.',
  },
  {
    id: 'mof-debt',
    ministry: 'Ministry of Finance',
    ministryShort: 'Finance',
    program: 'Sovereign Debt Management',
    allocatedBudgetM: 95,
    spentToDateM: 76,
    spentPct: 80,
    kpiName: 'Portfolio Efficiency',
    kpiTarget: 95,
    kpiActual: 93,
    kpiUnit: '%',
    efficiencyRatio: 0.87,
    benchmarkRatio: 1.0,
    riskFlag: 'green',
    insight: 'On track. Weighted average borrowing cost 3.2% — below GCC peer average of 3.8%.',
  },
  {
    id: 'mof-audit',
    ministry: 'Ministry of Finance',
    ministryShort: 'Finance',
    program: 'Auditor-General Office',
    allocatedBudgetM: 130,
    spentToDateM: 136.5,
    spentPct: 105,
    kpiName: 'Entities Audited',
    kpiTarget: 120,
    kpiActual: 115,
    kpiUnit: 'entities',
    efficiencyRatio: 1.11,
    benchmarkRatio: 1.0,
    riskFlag: 'red',
    insight: 'Over-budget by 5% with 4% fewer audits than target. Complexity of new public-private entities driving cost.',
  },
];

// ---------------------------------------------------------------------------
// Spending Anomaly
// ---------------------------------------------------------------------------

export const SPENDING_ANOMALY: SpendingAnomaly = {
  ministry: 'Ministry of Finance',
  category: 'Q4 Consultancy Services',
  budgetedM: 350,
  actualM: 1200,
  variance: 850,
  variancePct: 243,
  possibleCauses: [
    { cause: 'Unplanned digital transformation consulting contracts awarded in Q4', likelihood: 'high' },
    { cause: 'International advisory fees for COP/climate commitments surge', likelihood: 'medium' },
    { cause: 'Duplicate invoicing or misclassification from legacy ERP migration', likelihood: 'medium' },
    { cause: 'Pre-emptive spend before fiscal year-end budget lapse', likelihood: 'high' },
    { cause: 'Emergency cybersecurity consulting post-incident response', likelihood: 'low' },
  ],
  agentRecommendation:
    'Immediate actions: (1) Freeze remaining Q4 consultancy commitments pending review. (2) Request itemised breakdown of top-10 contracts by value. (3) Cross-reference with TenderAI procurement records for compliance verification. (4) Escalate to Auditor-General Office if duplicate invoicing confirmed. Estimated recovery potential: $120-280M.',
};

// ---------------------------------------------------------------------------
// Impact Forecast — Universal Early Childhood Education
// ---------------------------------------------------------------------------

export const IMPACT_FORECAST: FiscalForecast = {
  title: 'KidSTART Universal Early Childhood Programme',
  years: [
    { year: 2026, costM: 380, beneficiaries: 42000, cumulativeCostM: 380 },
    { year: 2027, costM: 520, beneficiaries: 78000, cumulativeCostM: 900 },
    { year: 2028, costM: 640, beneficiaries: 115000, cumulativeCostM: 1540 },
    { year: 2029, costM: 680, beneficiaries: 148000, cumulativeCostM: 2220 },
    { year: 2030, costM: 580, beneficiaries: 165000, cumulativeCostM: 2800 },
  ],
  totalCostM: 2800,
  breakEvenYear: 3,
  npvM: 5880,
  bcr: 2.1,
  costPerBeneficiary: 16970,
};

// ---------------------------------------------------------------------------
// Daily Scan Summary
// ---------------------------------------------------------------------------

export interface DailyScanSummary {
  scanTime: string;
  ministriesScanned: number;
  programsReviewed: number;
  onTrack: number;
  elevated: number;
  anomalies: number;
  totalSpendAED: number;
}

export const DAILY_SCAN: DailyScanSummary = {
  scanTime: '7:00 AM GST',
  ministriesScanned: 10,
  programsReviewed: 47,
  onTrack: 38,
  elevated: 6,
  anomalies: 3,
  totalSpendAED: 12_800_000_000,
};

// ---------------------------------------------------------------------------
// Anomaly Reasoning Chain
// ---------------------------------------------------------------------------

export interface AnomalyReasoningStep {
  step: number;
  action: string;
  finding: string;
  dataSource: string;
  confidence: number;
}

export const ANOMALY_REASONING: AnomalyReasoningStep[] = [
  { step: 1, action: 'Identified variance', finding: 'MOF Q4 consultancy spending $850M over budget', dataSource: 'eMunazamah fiscal system', confidence: 0.99 },
  { step: 2, action: 'Retrieved historical baseline', finding: 'Average Q4 consultancy: $420M (5-year rolling)', dataSource: 'Historical spending database', confidence: 0.95 },
  { step: 3, action: 'Checked budget amendments', finding: 'No approved supplementary allocation found', dataSource: 'National budget portal', confidence: 0.92 },
  { step: 4, action: 'Cross-referenced procurement', finding: '5 new contracts awarded in Q4, totaling $780M', dataSource: 'TenderAI contract database', confidence: 0.88 },
  { step: 5, action: 'Peer benchmarking', finding: 'government consultancy spend 2.1x OECD average for comparable scope', dataSource: 'GovBench international data', confidence: 0.85 },
  { step: 6, action: 'Root cause assessment', finding: 'Most likely: end-of-fiscal-year contract acceleration', dataSource: 'Pattern matching + historical analysis', confidence: 0.82 },
];

// ---------------------------------------------------------------------------
// Cross-App Intelligence
// ---------------------------------------------------------------------------

export interface FiscalCrossAppIntel {
  sourceApp: string;
  dataReceived: string;
  impact: string;
  timestamp: string;
}

export const CROSS_APP_INTEL: FiscalCrossAppIntel[] = [
  { sourceApp: 'TenderAI', dataReceived: 'Q4 procurement costs for 5 contracts', impact: 'Confirmed $780M in new contract commitments', timestamp: '2h ago' },
  { sourceApp: 'PolicyAI', dataReceived: 'KidSTART policy proposal metadata', impact: 'Auto-generated 5-year fiscal impact forecast', timestamp: '4h ago' },
  { sourceApp: 'TransparencyAI', dataReceived: 'Disclosure deadline alerts for 3 ministries', impact: 'Flagged spending data gaps in 2 quarterly reports', timestamp: '6h ago' },
];

// ---------------------------------------------------------------------------
// Confidence Thresholds
// ---------------------------------------------------------------------------

export interface ConfidenceAction {
  label: string;
  threshold: string;
  action: string;
  example: string;
  color: string;
}

export const CONFIDENCE_ACTIONS: ConfidenceAction[] = [
  { label: 'Auto-proceed', threshold: '> 85%', action: 'Log and continue', example: 'Routine budget utilization within 5% of target', color: '#22c55e' },
  { label: 'Flag for review', threshold: '50-85%', action: 'Add to daily digest', example: 'Spending velocity 15% above plan', color: '#eab308' },
  { label: 'Escalate immediately', threshold: '< 50%', action: 'Human decision required', example: 'Anomaly with conflicting data sources', color: '#ef4444' },
];

// ---------------------------------------------------------------------------
// Spending Trend Indicators (for Budget Monitor cards)
// ---------------------------------------------------------------------------

export const SPENDING_TRENDS: Record<string, 'accelerating' | 'decelerating' | 'steady'> = {
  'moe-sls': 'steady',
  'moe-stem': 'steady',
  'moe-teacher': 'accelerating',
  'moe-eced': 'decelerating',
  'moe-scholarship': 'steady',
  'moh-telehealth': 'accelerating',
  'moh-genomics': 'steady',
  'moh-prevention': 'decelerating',
  'moh-pharma': 'accelerating',
  'mof-tax': 'steady',
  'mof-procurement': 'steady',
  'mof-debt': 'decelerating',
  'mof-audit': 'accelerating',
};

// ---------------------------------------------------------------------------
// Agent Steps — Budget Monitoring Workflow
// ---------------------------------------------------------------------------

export const FISCAL_AGENT_STEPS: AgentStep[] = [
  {
    icon: 'search',
    message: 'Scanning federal budget ledger for Q4 transactions...',
    duration: 1800,
    detail: 'Querying 14,200 line items across 11 ministries',
  },
  {
    icon: 'alert',
    message: 'Anomaly detected: MOF Consultancy spending +243% over budget',
    duration: 1200,
    detail: '$1,200M actual vs $350M budgeted — flagging for investigation',
  },
  {
    icon: 'analyze',
    message: 'Running root cause analysis with historical patterns...',
    duration: 2200,
    detail: 'Comparing against 3-year quarterly averages and peer ministry baselines',
  },
  {
    icon: 'compare',
    message: 'Cross-referencing TenderAI procurement records...',
    duration: 1500,
    detail: 'Matching 47 consultancy contracts against approved tender frameworks',
  },
  {
    icon: 'check',
    message: 'Compliance check: 12 contracts flagged for review',
    duration: 1400,
    detail: '8 above single-source threshold, 4 with missing approval signatures',
  },
  {
    icon: 'generate',
    message: 'Generating anomaly report with recommendations...',
    duration: 2000,
    detail: 'Preparing executive brief with recovery potential $120-280M',
  },
  {
    icon: 'send',
    message: 'Routing alert to Auditor-General Office and TransparencyAI',
    duration: 1000,
    detail: 'Alert dispatched with priority: HIGH — response expected within 48h',
  },
];
