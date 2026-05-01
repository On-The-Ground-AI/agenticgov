export type Sector = 'Education' | 'Healthcare' | 'Energy' | 'Technology' | 'Economy' | 'Defense';

export type AppId = 'policy-ai' | 'causalis' | 'tender-ai' | 'fiscal-ai' | 'readiness-map' | 'gov-bench' | 'transparency-ai';

export type AgentStatus = 'running' | 'complete' | 'alert' | 'waiting';

export interface AgentActivity {
  id: string;
  timestamp: string;
  app: AppId;
  message: string;
  status: AgentStatus;
  detail?: string;
}

export interface Ministry {
  id: string;
  name: string;
  shortName: string;
  mandate: string;
  functionsOwned: number[];
}

export interface WEFFunction {
  id: number;
  name: string;
  category: string;
  potentialScore: number;
  complexityScore: number;
  riskScore: number;
  readinessScore: number;
  readinessTier: 'HIGH' | 'MEDIUM' | 'EMERGING' | 'CAUTION';
  jurisdictionAdjustedScore: number;
  ownerMinistry: string;
  timeline: string;
  dependencies: number[];
  agenticApp: AppId | null;
  description: string;
}

export const AGENTIC_APPS = [
  {
    id: 'policy-ai' as AppId,
    name: 'PolicyAI',
    description: 'Full policy cycle analysis with governance hierarchy',
    color: '#334155',
    bgColor: 'bg-slate-700',
    textColor: 'text-slate-700',
    route: '/agenda-setting',
    isExternal: true,
    agentCount: 3,
    wefFunctions: [15, 29, 49, 55],
    icon: 'shield',
  },
  {
    id: 'causalis' as AppId,
    name: 'Causalis',
    description: 'Impact evaluation with 352 MDB evidence reports',
    color: '#059669',
    bgColor: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    route: '/evaluation',
    isExternal: true,
    agentCount: 2,
    wefFunctions: [55, 68],
    icon: 'chart',
  },
  {
    id: 'tender-ai' as AppId,
    name: 'TenderAI',
    description: 'Procurement intelligence & tender compliance',
    color: '#D97706',
    bgColor: 'bg-amber-600',
    textColor: 'text-amber-600',
    route: '/portal/tender',
    isExternal: false,
    agentCount: 2,
    wefFunctions: [6, 7, 41],
    icon: 'document',
  },
  {
    id: 'fiscal-ai' as AppId,
    name: 'FiscalAI',
    description: 'Budget monitoring, anomaly detection & fiscal forecasting',
    color: '#2563EB',
    bgColor: 'bg-blue-600',
    textColor: 'text-blue-600',
    route: '/portal/fiscal',
    isExternal: false,
    agentCount: 3,
    wefFunctions: [9, 44, 53],
    icon: 'currency',
  },
  {
    id: 'readiness-map' as AppId,
    name: 'ReadinessMap',
    description: 'WEF 70-function readiness tracking & ministerial scorecards',
    color: '#7C3AED',
    bgColor: 'bg-violet-600',
    textColor: 'text-violet-600',
    route: '/portal/readiness',
    isExternal: false,
    agentCount: 2,
    wefFunctions: [15, 17],
    icon: 'map',
  },
  {
    id: 'gov-bench' as AppId,
    name: 'GovBench',
    description: 'National governance benchmarking & peer intelligence',
    color: '#0891B2',
    bgColor: 'bg-cyan-600',
    textColor: 'text-cyan-600',
    route: '/portal/bench',
    isExternal: false,
    agentCount: 2,
    wefFunctions: [8, 21, 35],
    icon: 'globe',
  },
  {
    id: 'transparency-ai' as AppId,
    name: 'TransparencyAI',
    description: 'Disclosure compliance & transparency reporting',
    color: '#DC2626',
    bgColor: 'bg-red-600',
    textColor: 'text-red-600',
    route: '/portal/transparency',
    isExternal: false,
    agentCount: 2,
    wefFunctions: [8, 20, 47],
    icon: 'eye',
  },
];

export const DATA_FLOWS: { from: AppId; to: AppId; label: string }[] = [
  { from: 'policy-ai', to: 'fiscal-ai', label: 'Policy proposals' },
  { from: 'policy-ai', to: 'transparency-ai', label: 'KPI definitions' },
  { from: 'policy-ai', to: 'readiness-map', label: 'Sector classifications' },
  { from: 'causalis', to: 'fiscal-ai', label: 'CEA ratios' },
  { from: 'causalis', to: 'transparency-ai', label: 'Evidence quality' },
  { from: 'causalis', to: 'policy-ai', label: 'Evaluation evidence' },
  { from: 'tender-ai', to: 'fiscal-ai', label: 'Procurement costs' },
  { from: 'tender-ai', to: 'transparency-ai', label: 'Tender outcomes' },
  { from: 'fiscal-ai', to: 'transparency-ai', label: 'Spending data' },
  { from: 'fiscal-ai', to: 'readiness-map', label: 'Ministry performance' },
  { from: 'fiscal-ai', to: 'policy-ai', label: 'Budget constraints' },
  { from: 'readiness-map', to: 'policy-ai', label: 'Readiness scores' },
  { from: 'readiness-map', to: 'tender-ai', label: 'Ministry ownership' },
  { from: 'gov-bench', to: 'policy-ai', label: 'International benchmarks' },
  { from: 'gov-bench', to: 'readiness-map', label: 'Governance indices' },
  { from: 'transparency-ai', to: 'readiness-map', label: 'Compliance status' },
];

export const GENERIC_MINISTRIES: Ministry[] = [
  { id: 'moe', name: 'Ministry of Education', shortName: 'MOE', mandate: 'Education policy, schools, universities, KidSTART', functionsOwned: [15, 29, 35] },
  { id: 'moh', name: 'Ministry of Health', shortName: 'MOH', mandate: 'Healthcare policy, hospitals, public health', functionsOwned: [29, 35, 49] },
  { id: 'mnd', name: 'Ministry of National Development', shortName: 'MND', mandate: 'Energy policy, infrastructure, sustainability', functionsOwned: [44, 53] },
  { id: 'moiai', name: 'Ministry of Trade and Industry', shortName: 'MTI', mandate: 'Industrial policy, AI strategy, technology adoption', functionsOwned: [3, 17, 49] },
  { id: 'mof', name: 'Ministry of Finance', shortName: 'MOF', mandate: 'National budget, procurement, fiscal policy', functionsOwned: [6, 7, 9, 53] },
  { id: 'psd', name: 'Public Service Division', shortName: 'PSD', mandate: 'Government coordination, strategic planning, KPIs', functionsOwned: [8, 15, 20] },
  { id: 'mom', name: 'Ministry of Manpower', shortName: 'MOM', mandate: 'Labour market, National Workforce, workforce', functionsOwned: [22, 23, 24] },
  { id: 'msf', name: 'Ministry of Social and Family Development', shortName: 'MSF', mandate: 'Social welfare, family support, disability', functionsOwned: [29, 55] },
  { id: 'mfa', name: 'Ministry of Foreign Affairs', shortName: 'MFA', mandate: 'Diplomacy, international cooperation', functionsOwned: [20, 47] },
  { id: 'govtech', name: 'GovTech Singapore', shortName: 'GovTech', mandate: 'Digital infrastructure, e-government, cybersecurity', functionsOwned: [1, 3, 4, 5] },
];

export const SECTORS: Sector[] = ['Education', 'Healthcare', 'Energy', 'Technology', 'Economy', 'Defense'];

function hoursAgo(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() - h);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const AGENT_ACTIVITY_LOG: AgentActivity[] = [
  { id: 'a1', timestamp: hoursAgo(0.1), app: 'fiscal-ai', message: 'Detected spending anomaly: Ministry of Finance Q4 consultancy +$850M over budget', status: 'alert', detail: 'Spending 3.4x baseline. Root cause analysis initiated.' },
  { id: 'a2', timestamp: hoursAgo(0.2), app: 'transparency-ai', message: 'Flagged missing disclosure: MOF Q4 transparency report incomplete', status: 'alert', detail: 'Material variance not yet reflected in quarterly report.' },
  { id: 'a3', timestamp: hoursAgo(0.3), app: 'readiness-map', message: 'Updated Function #06 readiness: MEDIUM → HIGH after TenderAI deployment', status: 'complete' },
  { id: 'a4', timestamp: hoursAgo(0.5), app: 'tender-ai', message: 'Generated compliant tender document for MOE tablet procurement ($85M)', status: 'complete' },
  { id: 'a5', timestamp: hoursAgo(0.7), app: 'gov-bench', message: 'Monitoring World Bank Governance Indicators — maintained #7 competitiveness rank', status: 'complete' },
  { id: 'a6', timestamp: hoursAgo(1.0), app: 'fiscal-ai', message: 'Budget vs. outcome scan complete for Ministry of Education: 3 programs flagged yellow', status: 'complete' },
  { id: 'a7', timestamp: hoursAgo(1.2), app: 'policy-ai', message: 'Policy analysis generated: Universal Early Childhood Education (6-note framework)', status: 'complete' },
  { id: 'a8', timestamp: hoursAgo(1.5), app: 'causalis', message: 'Method recommendation: Cluster-RCT for KidSTART pilot evaluation across 25 sites', status: 'complete' },
  { id: 'a9', timestamp: hoursAgo(1.8), app: 'transparency-ai', message: 'Auto-generated disclosure report for Student Learning Space — score: 91/100', status: 'complete' },
  { id: 'a10', timestamp: hoursAgo(2.0), app: 'tender-ai', message: 'Compliance check: Healthcare procurement framework — 8/8 items passed', status: 'complete' },
  { id: 'a11', timestamp: hoursAgo(2.3), app: 'readiness-map', message: 'Ministerial scorecard updated: MOE progress 72% → 78%', status: 'complete' },
  { id: 'a12', timestamp: hoursAgo(2.5), app: 'fiscal-ai', message: 'Cost-effectiveness comparison: National STEM Academy $1,200/student vs OECD avg $1,450', status: 'complete' },
  { id: 'a13', timestamp: hoursAgo(3.0), app: 'gov-bench', message: 'National Cybersecurity Index maintained at 100/100 — top global position confirmed', status: 'complete' },
  { id: 'a14', timestamp: hoursAgo(3.2), app: 'transparency-ai', message: 'Compliance scan: 7/11 ministries on track for Q1 disclosure deadlines', status: 'complete' },
  { id: 'a15', timestamp: hoursAgo(3.5), app: 'tender-ai', message: 'Historical benchmark: Solar installation tenders average +8% overrun — recommending contingency', status: 'complete' },
  { id: 'a16', timestamp: hoursAgo(4.0), app: 'readiness-map', message: 'Dependency analysis: Function #35 (Service Quality) blocks Function #08 (Transparency)', status: 'complete' },
  { id: 'a17', timestamp: hoursAgo(4.5), app: 'fiscal-ai', message: 'Fiscal impact forecast: KidSTART proposal — $2.8B over 5 years, breakeven Year 3', status: 'complete' },
  { id: 'a18', timestamp: hoursAgo(5.0), app: 'policy-ai', message: 'Strategic scan: 4 emerging education policy issues aligned with Forward Singapore vision', status: 'complete' },
  { id: 'a19', timestamp: hoursAgo(5.5), app: 'causalis', message: 'Quality score: SkillsFuture evaluation design — 72/100 (moderate evidence quality)', status: 'complete' },
  { id: 'a20', timestamp: hoursAgo(6.0), app: 'gov-bench', message: 'Transferability assessment: Singapore teacher evaluation rubrics → HIGH compatibility for this jurisdiction', status: 'complete' },
  { id: 'a21', timestamp: hoursAgo(6.5), app: 'tender-ai', message: 'Contract compliance check: Smart City digital services tender — 2 non-compliant clauses flagged', status: 'alert' },
  { id: 'a22', timestamp: hoursAgo(7.0), app: 'fiscal-ai', message: 'Monthly report generated: Ministry of Health budget utilization at 68%', status: 'complete' },
  { id: 'a23', timestamp: hoursAgo(7.5), app: 'readiness-map', message: 'Wave 1 functions (6 HIGH-readiness) — all on track for 6-month deployment', status: 'complete' },
  { id: 'a24', timestamp: hoursAgo(8.0), app: 'transparency-ai', message: 'Evidence quality audit: 5 programs scored, average 78/100', status: 'complete' },
  { id: 'a25', timestamp: hoursAgo(8.5), app: 'policy-ai', message: 'Comparative note: education spending 3.8% GDP vs OECD avg 4.9%', status: 'complete' },
  { id: 'a26', timestamp: hoursAgo(9.0), app: 'fiscal-ai', message: 'Anomaly cleared: MND infrastructure spending within revised forecast (+2.1%)', status: 'complete' },
  { id: 'a27', timestamp: hoursAgo(10.0), app: 'gov-bench', message: 'National AI Readiness Index updated: Rank 18 globally, #1 in ASEAN region', status: 'complete' },
  { id: 'a28', timestamp: hoursAgo(11.0), app: 'readiness-map', message: 'Cross-function impact: TenderAI activation improved 3 downstream functions', status: 'complete' },
  { id: 'a29', timestamp: hoursAgo(12.0), app: 'tender-ai', message: 'Bid evaluation complete: 6 submissions scored for MOH hospital procurement', status: 'complete' },
  { id: 'a30', timestamp: hoursAgo(13.0), app: 'causalis', message: 'Ex-ante CBA: Telemedicine hub — NPV $280M, BCR 2.3, recommended for investment', status: 'complete' },
  { id: 'a31', timestamp: hoursAgo(14.0), app: 'transparency-ai', message: 'Deadline reminder sent: MOF quarterly report due in 5 business days', status: 'complete' },
  { id: 'a32', timestamp: hoursAgo(15.0), app: 'fiscal-ai', message: 'Capital investment scan: 12 projects totaling $4.2B reviewed for ROI', status: 'complete' },
  { id: 'a33', timestamp: hoursAgo(16.0), app: 'gov-bench', message: 'Best practice identified: Estonia X-Road data exchange — transferability MEDIUM for this jurisdiction', status: 'complete' },
  { id: 'a34', timestamp: hoursAgo(17.0), app: 'readiness-map', message: 'Quarterly readiness assessment: 12 functions improved, 3 declined, 55 stable', status: 'complete' },
  { id: 'a35', timestamp: hoursAgo(18.0), app: 'policy-ai', message: 'Implementation monitoring: STEM Academy rollout — 520/500 teachers trained (ahead of target)', status: 'complete' },
  { id: 'a36', timestamp: hoursAgo(19.0), app: 'tender-ai', message: 'Market intelligence: Cybersecurity vendor landscape updated — 23 qualified suppliers', status: 'complete' },
  { id: 'a37', timestamp: hoursAgo(20.0), app: 'fiscal-ai', message: 'Efficiency benchmark: cost-per-student $42K vs Singapore $38K', status: 'complete' },
  { id: 'a38', timestamp: hoursAgo(21.0), app: 'transparency-ai', message: 'Annual transparency report draft completed for Ministry of Education', status: 'complete' },
  { id: 'a39', timestamp: hoursAgo(22.0), app: 'causalis', message: 'Literature scan: 15 new impact evaluations in education sector identified', status: 'complete' },
  { id: 'a40', timestamp: hoursAgo(23.0), app: 'gov-bench', message: 'National Governance Model Library: Added "Future Foresight Foundation" case study', status: 'complete' },
];

export const SIMULATED_NEW_ACTIVITIES: AgentActivity[] = [
  { id: 'sim1', timestamp: '', app: 'fiscal-ai', message: 'Real-time monitoring: Ministry of Education Q1 spending on track ($312M / $525M budget)', status: 'running' },
  { id: 'sim2', timestamp: '', app: 'readiness-map', message: 'Scanning ministerial adoption metrics for weekly scorecard update...', status: 'running' },
  { id: 'sim3', timestamp: '', app: 'tender-ai', message: 'New tender detected: MND renewable energy infrastructure ($1.2B) — initiating compliance pre-check', status: 'running' },
  { id: 'sim4', timestamp: '', app: 'gov-bench', message: 'UN E-Government Survey 2026 data available — updating position analysis', status: 'running' },
  { id: 'sim5', timestamp: '', app: 'transparency-ai', message: 'Automated quality check: MOH telemedicine program disclosure — 84/100', status: 'complete' },
  { id: 'sim6', timestamp: '', app: 'fiscal-ai', message: 'Cross-referencing TenderAI procurement data with budget allocation for MoE...', status: 'running' },
  { id: 'sim7', timestamp: '', app: 'causalis', message: 'Evaluation design review: SkillsFuture Phase 3 — recommending DiD with staggered rollout', status: 'complete' },
  { id: 'sim8', timestamp: '', app: 'readiness-map', message: 'Function #09 (Financial Monitoring) prerequisite check: FiscalAI integration verified', status: 'complete' },
  { id: 'sim9', timestamp: '', app: 'policy-ai', message: 'Stakeholder mapping update: 3 new entities identified for education reform coalition', status: 'complete' },
  { id: 'sim10', timestamp: '', app: 'tender-ai', message: 'Bid deadline approaching: MOH medical equipment tender — 4 submissions received, 2 pending', status: 'alert' },
];

export const PORTAL_STATS = {
  activeAgents: 16,
  tasksToday: 847,
  anomaliesDetected: 3,
  reportsGenerated: 24,
  functionsMonitored: 70,
  ministriesCovered: 10,
};

// ---------------------------------------------------------------------------
// Orchestration Layer — Morning Briefing, Event Chains, Decision Queue, etc.
// ---------------------------------------------------------------------------

export type BriefingSeverity = 'critical' | 'attention' | 'info';

export interface BriefingDeepDetail {
  summary: string;
  timeline: { time: string; event: string; agent: string }[];
  evidence: { label: string; value: string; source: string }[];
  affectedPrograms: { name: string; budget: string; impact: string }[];
  agentRecommendation: string;
  relatedFlows: string[];
  riskIfIgnored: string;
}

export interface BriefingAction {
  id: string;
  severity: BriefingSeverity;
  app: AppId;
  title: string;
  detail: string;
  ministry: string;
  metric?: string;
  deadline?: string;
  actions: string[];
  deepDetail: BriefingDeepDetail;
}

export interface ImpactBreakdown {
  description: string;
  components: { label: string; value: string; percentage: number }[];
  methodology: string;
  comparison: { label: string; before: string; after: string }[];
  topContributors: { name: string; contribution: string }[];
}

export interface DecisionDeepDetail {
  investigationChain: { step: number; agent: string; finding: string; confidence: number }[];
  options: { label: string; description: string; risk: string; recommendation: boolean }[];
  affectedStakeholders: { role: string; impact: string }[];
  evidenceSources: { source: string; dataPoints: number; lastUpdated: string }[];
  precedents: string[];
}

export interface EventChainStep {
  app: AppId;
  message: string;
  delayLabel: string;
  status: 'trigger' | 'response' | 'outcome';
}

export interface EventChain {
  id: string;
  title: string;
  trigger: string;
  steps: EventChainStep[];
}

export interface ScheduledTask {
  id: string;
  agent: string;
  app: AppId;
  schedule: string;
  lastRun: string;
  lastStatus: 'success' | 'warning' | 'error';
  nextRun: string;
  findingsCount: number;
  summary: string;
}

export interface DecisionItem {
  id: string;
  app: AppId;
  severity: BriefingSeverity;
  title: string;
  detail: string;
  confidence: number;
  suggestedAction: string;
  detectedAt: string;
  deadline?: string;
  deepDetail: DecisionDeepDetail;
}

export interface ImpactMetric {
  label: string;
  value: number;
  unit: string;
  trend: number;
  trendLabel: string;
  sparkline: number[];
  breakdown: ImpactBreakdown;
}

export interface AgentHealth {
  app: AppId;
  status: 'healthy' | 'degraded' | 'error';
  uptime: string;
  tasksToday: number;
  avgLatencyMs: number;
  lastActive: string;
  note?: string;
}

export const MORNING_BRIEFING: {
  date: string;
  overnightSummary: { agents: number; tasks: number; anomalies: number; reports: number; escalations: number };
  actions: BriefingAction[];
  trends: { label: string; value: string; direction: 'up' | 'down' | 'stable'; good: boolean }[];
} = {
  date: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  overnightSummary: { agents: 16, tasks: 847, anomalies: 3, reports: 24, escalations: 0 },
  actions: [
    {
      id: 'ba1',
      severity: 'critical',
      app: 'fiscal-ai',
      title: 'Q4 consultancy overspend: $850M',
      detail: 'Ministry of Finance consultancy spending is 3.4× baseline. Root cause analysis indicates contract acceleration for end-of-fiscal-year procurement. 5 invoices flagged for review.',
      ministry: 'Ministry of Finance',
      metric: '3.4× baseline',
      deadline: '5 business days',
      actions: ['View Details', 'Acknowledge', 'Escalate to CFO'],
      deepDetail: {
        summary: 'FiscalAI\'s overnight scan at 2:00 AM identified a 3.4× variance in MOF consultancy spending against the 12-month rolling baseline. The anomaly is concentrated in 5 contracts awarded between October 15–28, all under the accelerated procurement pathway. Total affected value: $850M across professional services, IT consulting, and legal advisory categories.',
        timeline: [
          { time: '2:00 AM', event: 'FiscalAI daily scan initiated — 47 ministry budgets', agent: 'Fiscal Scanner' },
          { time: '2:04 AM', event: 'Anomaly detected: MOF consultancy line item 3.4× above baseline', agent: 'Anomaly Detector' },
          { time: '2:06 AM', event: 'Root cause analysis: 5 contracts via accelerated pathway flagged', agent: 'Root Cause Analyzer' },
          { time: '2:08 AM', event: 'Cross-check: OECD benchmark pulled — 2.1× OECD average', agent: 'GovBench Agent' },
          { time: '2:10 AM', event: 'TransparencyAI notified: Q4 disclosure missing consultancy breakdown', agent: 'Transparency Sync' },
          { time: '2:12 AM', event: 'Alert pushed to Morning Briefing queue as CRITICAL', agent: 'Briefing Compiler' },
        ],
        evidence: [
          { label: 'Total variance', value: '$850M', source: 'FiscalAI Budget Monitor' },
          { label: 'Variance ratio', value: '3.4× rolling baseline', source: 'FiscalAI Anomaly Detector' },
          { label: 'Contracts affected', value: '5 contracts (Oct 15–28)', source: 'TenderAI Pipeline' },
          { label: 'OECD comparison', value: '2.1× OECD avg consultancy spend', source: 'GovBench' },
          { label: 'Disclosure status', value: '64% complete (missing consultancy)', source: 'TransparencyAI' },
          { label: 'Historical pattern', value: 'Q4 spike seen in 3 of last 5 years', source: 'FiscalAI Trends' },
        ],
        affectedPrograms: [
          { name: 'Digital Transformation Advisory', budget: '$320M', impact: 'Largest single contract — awarded Oct 18 via accelerated pathway' },
          { name: 'Legal & Regulatory Consulting', budget: '$210M', impact: 'Scope expanded 3× from original terms without re-tender' },
          { name: 'IT Infrastructure Assessment', budget: '$185M', impact: 'Duplicate scope overlap with GovTech existing contract detected' },
          { name: 'Strategic Planning Services', budget: '$85M', impact: 'Within normal range — flagged due to association' },
          { name: 'Financial Audit Support', budget: '$50M', impact: 'Within normal range — flagged due to association' },
        ],
        agentRecommendation: 'Approve invoice-level investigation for the top 3 contracts ($715M combined). The two smaller contracts appear within normal parameters. Require MOF to submit supplementary disclosure within 5 business days. Consider implementing a consultancy spending cap for FY2027 to prevent Q4 acceleration pattern.',
        relatedFlows: ['FiscalAI → TransparencyAI sync', 'FiscalAI → Cabinet push (anomaly)', 'GovBench → FiscalAI pull (OECD benchmarks)'],
        riskIfIgnored: 'If unresolved: -15 points on WEF Function #09 (Financial Monitoring), potential audit finding, Q4 disclosure deadline breach in 5 days, reputational risk from OECD comparison data.',
      },
    },
    {
      id: 'ba2',
      severity: 'attention',
      app: 'transparency-ai',
      title: 'MOF Q4 transparency report incomplete',
      detail: 'Material variance from FiscalAI anomaly not yet reflected in quarterly disclosure. Missing: consultancy breakdown, variance explanation, corrective action plan.',
      ministry: 'Ministry of Finance',
      deadline: '5 business days',
      actions: ['View Report', 'Assign to Team', 'Defer'],
      deepDetail: {
        summary: 'TransparencyAI auto-generated 80% of the MOF Q4 disclosure report. Three sections require human input due to the consultancy anomaly flagged by FiscalAI. The report currently scores 64/100 on the WEF transparency benchmark — it needs to reach 80+ to maintain the ministry\'s compliance standing.',
        timeline: [
          { time: '2:10 AM', event: 'Received anomaly notification from FiscalAI sync', agent: 'Transparency Sync' },
          { time: '2:15 AM', event: 'Auto-generated 80% of Q4 report from available data', agent: 'Report Generator' },
          { time: '2:20 AM', event: 'Identified 3 gaps requiring human input', agent: 'Completeness Checker' },
          { time: '2:25 AM', event: 'Scored report at 64/100 — below 80 threshold', agent: 'Quality Scorer' },
          { time: '6:30 AM', event: 'Deadline reminder: 5 business days remaining', agent: 'Deadline Monitor' },
        ],
        evidence: [
          { label: 'Report completeness', value: '80% auto-generated', source: 'TransparencyAI' },
          { label: 'Quality score', value: '64/100 (needs 80+)', source: 'Quality Scorer' },
          { label: 'Missing sections', value: '3 (consultancy breakdown, variance, corrective plan)', source: 'Completeness Checker' },
          { label: 'Deadline', value: '5 business days', source: 'Deadline Monitor' },
        ],
        affectedPrograms: [
          { name: 'MOF Q4 Quarterly Disclosure', budget: 'N/A', impact: 'Compliance deadline at risk — must reach 80/100 quality score' },
          { name: 'Annual Transparency Report', budget: 'N/A', impact: 'Q4 disclosure feeds into annual report — cascading delay risk' },
        ],
        agentRecommendation: 'Assign finance team to complete 3 missing sections. TransparencyAI has pre-drafted templates for each section based on the FiscalAI anomaly data. Estimated human effort: 4-6 hours. If completed within 2 days, quality score should reach 82/100.',
        relatedFlows: ['FiscalAI → TransparencyAI sync (anomaly data)', 'TransparencyAI → Cabinet push (deadline alert)'],
        riskIfIgnored: 'Disclosure deadline breach, -8 points on WEF Function #08 (Transparency Reporting), potential audit finding, public trust impact.',
      },
    },
    {
      id: 'ba3',
      severity: 'attention',
      app: 'tender-ai',
      title: 'Smart City contract: 2 non-compliant clauses',
      detail: 'Digital services tender TND-2026-4471 missing environmental sustainability criteria (National Agenda 2030) and local content (ICV) minimum threshold.',
      ministry: 'GovTech',
      actions: ['View Tender', 'Route to Legal', 'Override'],
      deepDetail: {
        summary: 'TenderAI\'s compliance scanner detected 2 missing mandatory clauses in tender TND-2026-4471 (Smart City Digital Services, $340M). This is part of a systemic pattern — 3 of 12 recent large tenders are missing Sustainability Framework criteria, suggesting the standard templates haven\'t been updated.',
        timeline: [
          { time: '1:00 PM', event: 'New tender TND-2026-4471 entered pipeline', agent: 'Tender Pipeline' },
          { time: '1:02 PM', event: 'Automated compliance scan initiated', agent: 'Compliance Scanner' },
          { time: '1:04 PM', event: 'Gap 1: Missing Sustainability Framework environmental criteria', agent: 'Compliance Scanner' },
          { time: '1:05 PM', event: 'Gap 2: Missing ICV (In-Country Value) minimum threshold', agent: 'Compliance Scanner' },
          { time: '1:08 PM', event: 'Pattern check: 3/12 recent tenders have same gap — systemic', agent: 'Pattern Detector' },
          { time: '1:10 PM', event: 'Alert pushed to Morning Briefing', agent: 'Briefing Compiler' },
        ],
        evidence: [
          { label: 'Tender value', value: '$340M', source: 'TenderAI Pipeline' },
          { label: 'Missing clauses', value: '2 (Sustainability Framework + ICV)', source: 'Compliance Scanner' },
          { label: 'Systemic pattern', value: '3/12 large tenders affected', source: 'Pattern Detector' },
          { label: 'Total affected value', value: '$3.8B across 3 tenders', source: 'TenderAI' },
        ],
        affectedPrograms: [
          { name: 'TND-2026-4471 Smart City Digital Services', budget: '$340M', impact: 'Cannot proceed to bidding without compliance fix' },
          { name: 'TND-2026-4389 Solar Farm Phase III', budget: '$1.2B', impact: 'Same Sustainability Framework gap — already in bidding stage' },
          { name: 'TND-2026-4402 Water Infrastructure', budget: '$2.3B', impact: 'Same Sustainability Framework gap — pre-qualification stage' },
        ],
        agentRecommendation: 'Route to legal for clause revision (estimated 2-day turnaround). Recommend cabinet-level directive to update all standard procurement templates with Sustainability Framework criteria to prevent recurrence.',
        relatedFlows: ['TenderAI → Cabinet push (systemic gap)', 'TenderAI → FiscalAI sync (budget impact)'],
        riskIfIgnored: 'Non-compliance with Sustainability Framework 2030, potential legal challenge from bidders, -10 points on WEF Function #06 (Tender Preparation).',
      },
    },
    {
      id: 'ba4',
      severity: 'info',
      app: 'gov-bench',
      title: 'WEF Competitiveness Report 2026 published',
      detail: 'The country maintained #7 overall. ICT Adoption dropped from #4 to #6 (Estonia, South Korea overtook). Transferable policy recommendations generated.',
      ministry: 'GovTech',
      actions: ['View Analysis', 'Share with Minister'],
      deepDetail: {
        summary: 'GovBench\'s overnight monitoring detected the publication of the WEF Global Competitiveness Report 2026. maintained its #7 overall ranking but lost 2 positions in ICT Adoption (from #4 to #6). The agent auto-generated a comparative analysis and identified two high-transferability policies from the overtaking countries.',
        timeline: [
          { time: '6:30 AM', event: 'WEF report publication detected', agent: 'Benchmark Scanner' },
          { time: '6:32 AM', event: 'country position extracted: #7 overall, ICT #4→#6', agent: 'Ranking Tracker' },
          { time: '6:35 AM', event: 'Peer analysis: Estonia X-Road, South Korea MyData identified', agent: 'Peer Analyzer' },
          { time: '6:40 AM', event: 'Transferability assessment: S. Korea MyData = HIGH for this jurisdiction', agent: 'Transfer Assessor' },
          { time: '6:45 AM', event: 'ReadinessMap updated: 8 WEF functions recalibrated', agent: 'ReadinessMap Sync' },
          { time: '6:50 AM', event: 'Policy brief auto-generated with cost estimates', agent: 'PolicyAI Sync' },
        ],
        evidence: [
          { label: 'Overall rank', value: '#7 (maintained)', source: 'WEF GCR 2026' },
          { label: 'ICT Adoption rank', value: '#4 → #6 (-2 positions)', source: 'WEF GCR 2026' },
          { label: 'Overtaking countries', value: 'Estonia (#4), South Korea (#5)', source: 'GovBench Analysis' },
          { label: 'Transferability — MyData', value: 'HIGH (South Korea)', source: 'Transfer Assessor' },
          { label: 'Estimated adoption cost', value: '$120M over 3 years', source: 'FiscalAI Forecast' },
        ],
        affectedPrograms: [
          { name: 'National Digital Government Strategy 2026', budget: '$1.8B', impact: 'ICT ranking decline signals need for acceleration' },
          { name: 'National AI Strategy 2031', budget: '$3.5B', impact: 'Digital infrastructure gaps may slow AI adoption targets' },
        ],
        agentRecommendation: 'Share comparative analysis with GovTech Minister. Commission assessment of South Korea MyData model for adaptation. Estimated $120M over 3 years — can be fast-tracked through Digital Government Strategy 2026 budget.',
        relatedFlows: ['GovBench → ReadinessMap sync', 'GovBench → PolicyAI sync', 'GovBench → FiscalAI pull (cost estimates)'],
        riskIfIgnored: 'Further ranking decline in WEF 2027 report, competitive disadvantage vs regional peers, missed digitization opportunities.',
      },
    },
  ],
  trends: [
    { label: 'Procurement cycle time', value: '47 days', direction: 'down', good: true },
    { label: 'Education sector efficiency', value: '+4.2%', direction: 'up', good: true },
    { label: 'MOH budget utilization', value: '68%', direction: 'down', good: false },
    { label: 'Compliance rate (11 ministries)', value: '91%', direction: 'up', good: true },
    { label: 'Policy proposals in pipeline', value: '23 active', direction: 'stable', good: true },
    { label: 'Average evidence quality score', value: '78/100', direction: 'up', good: true },
  ],
};

export const EVENT_CHAINS: EventChain[] = [
  {
    id: 'chain1',
    title: 'Fiscal Anomaly → Transparency Alert',
    trigger: 'FiscalAI spending scan detected $850M variance',
    steps: [
      { app: 'fiscal-ai', message: 'Detected spending anomaly: MOF Q4 consultancy +$850M over budget', delayLabel: '0s', status: 'trigger' },
      { app: 'fiscal-ai', message: 'Root cause analysis: Contract acceleration (high confidence), duplicate payments (low)', delayLabel: '+45s', status: 'response' },
      { app: 'transparency-ai', message: 'Flagged: Material variance must be disclosed in quarterly report', delayLabel: '+2min', status: 'response' },
      { app: 'gov-bench', message: 'Benchmark check: consultancy spend vs OECD peers — 2.1× average', delayLabel: '+3min', status: 'response' },
      { app: 'readiness-map', message: 'Function #09 (Financial Monitoring) alert: -15 point impact if unresolved', delayLabel: '+4min', status: 'outcome' },
      { app: 'policy-ai', message: 'Advisory note drafted: Consultancy spending controls for Cabinet Affairs', delayLabel: '+5min', status: 'outcome' },
    ],
  },
  {
    id: 'chain2',
    title: 'Policy Proposal → Full Impact Assessment',
    trigger: 'New KidSTART policy proposal submitted to PolicyAI',
    steps: [
      { app: 'policy-ai', message: 'Received: KidSTART Universal Early Childhood policy proposal', delayLabel: '0s', status: 'trigger' },
      { app: 'fiscal-ai', message: '5-year fiscal impact: $2.8B total, breakeven Year 3, BCR 2.1×', delayLabel: '+90s', status: 'response' },
      { app: 'causalis', message: 'Evaluation design: Cluster-RCT across 25 sites, power 0.85', delayLabel: '+2min', status: 'response' },
      { app: 'tender-ai', message: 'Procurement estimate: 12 tender packages, $1.4B infrastructure', delayLabel: '+3min', status: 'response' },
      { app: 'transparency-ai', message: 'Disclosure template generated: 87/100 WEF benchmark score', delayLabel: '+4min', status: 'outcome' },
      { app: 'readiness-map', message: 'Functions #15, #29, #55 flagged for readiness tracking', delayLabel: '+5min', status: 'outcome' },
    ],
  },
  {
    id: 'chain3',
    title: 'International Signal → Domestic Action',
    trigger: 'GovBench detected WEF Competitiveness Report publication',
    steps: [
      { app: 'gov-bench', message: 'New data: WEF Competitiveness 2026 — ICT Adoption dropped #4→#6', delayLabel: '0s', status: 'trigger' },
      { app: 'gov-bench', message: 'Peer analysis: Estonia X-Road (MEDIUM transferability), S.Korea MyData (HIGH)', delayLabel: '+60s', status: 'response' },
      { app: 'readiness-map', message: 'Recalibrated 8 WEF functions with updated benchmark data', delayLabel: '+2min', status: 'response' },
      { app: 'policy-ai', message: 'Policy brief: ICT competitiveness recovery options with cost estimates', delayLabel: '+3min', status: 'outcome' },
      { app: 'fiscal-ai', message: 'Budget impact: S.Korea MyData adoption estimated $120M over 3 years', delayLabel: '+4min', status: 'outcome' },
    ],
  },
];

export const SCHEDULED_TASKS: ScheduledTask[] = [
  { id: 'st1', agent: 'Fiscal Scanner', app: 'fiscal-ai', schedule: 'Daily 7:00 AM', lastRun: 'Today 7:00 AM', lastStatus: 'warning', nextRun: 'Tomorrow 7:00 AM', findingsCount: 3, summary: 'Scanned 47 ministry budgets. 3 anomalies detected.' },
  { id: 'st2', agent: 'Compliance Monitor', app: 'transparency-ai', schedule: 'Daily 6:30 AM', lastRun: 'Today 6:30 AM', lastStatus: 'success', nextRun: 'Tomorrow 6:30 AM', findingsCount: 0, summary: '7/11 ministries on track. 2 approaching deadlines. 1 overdue.' },
  { id: 'st3', agent: 'Tender Pipeline', app: 'tender-ai', schedule: 'Every 6 hours', lastRun: 'Today 1:00 PM', lastStatus: 'success', nextRun: 'Today 7:00 PM', findingsCount: 4, summary: '4 new tenders indexed. 1 compliance flag raised.' },
  { id: 'st4', agent: 'KPI Tracker', app: 'fiscal-ai', schedule: 'Daily 8:00 AM', lastRun: 'Today 8:00 AM', lastStatus: 'warning', nextRun: 'Tomorrow 8:00 AM', findingsCount: 2, summary: '2 ministry KPIs at risk. Education on target.' },
  { id: 'st5', agent: 'Benchmark Scanner', app: 'gov-bench', schedule: 'Daily 6:30 AM', lastRun: 'Today 6:30 AM', lastStatus: 'success', nextRun: 'Tomorrow 6:30 AM', findingsCount: 1, summary: 'WEF Competitiveness 2026 data detected and processed.' },
  { id: 'st6', agent: 'Readiness Pulse', app: 'readiness-map', schedule: 'Weekly Mon 7:00 AM', lastRun: 'Mon 7:00 AM', lastStatus: 'success', nextRun: 'Next Mon 7:00 AM', findingsCount: 0, summary: '12 functions improved, 3 declined, 55 stable.' },
  { id: 'st7', agent: 'Briefing Compiler', app: 'policy-ai', schedule: 'Daily 7:45 AM', lastRun: 'Today 7:45 AM', lastStatus: 'success', nextRun: 'Tomorrow 7:45 AM', findingsCount: 4, summary: 'Morning briefing compiled: 1 critical, 2 attention, 1 info.' },
];

export const DECISION_QUEUE: DecisionItem[] = [
  {
    id: 'dq1', app: 'fiscal-ai', severity: 'critical',
    title: 'Approve investigation: MOF Q4 consultancy overspend',
    detail: 'FiscalAI recommends a detailed invoice-level review of 5 contracts totaling $850M. This requires CFO authorization to access detailed procurement records.',
    confidence: 0.92, suggestedAction: 'Approve invoice-level investigation',
    detectedAt: hoursAgo(0.1), deadline: '5 business days',
    deepDetail: {
      investigationChain: [
        { step: 1, agent: 'Fiscal Scanner', finding: 'Q4 consultancy line item 340% above 12-month rolling average', confidence: 0.98 },
        { step: 2, agent: 'Root Cause Analyzer', finding: 'Concentration in 5 contracts awarded Oct 15–28 via accelerated pathway', confidence: 0.94 },
        { step: 3, agent: 'Pattern Detector', finding: 'Q4 spike pattern observed in 3 of last 5 fiscal years — systemic', confidence: 0.89 },
        { step: 4, agent: 'GovBench Agent', finding: 'government consultancy spend 2.1× OECD average for comparable governments', confidence: 0.92 },
        { step: 5, agent: 'TenderAI Cross-Check', finding: 'IT Infrastructure Assessment overlaps with existing GovTech contract scope', confidence: 0.86 },
      ],
      options: [
        { label: 'Full invoice-level investigation', description: 'Authorize FiscalAI to access line-item procurement data for all 5 contracts. CFO signs off. 10 business days.', risk: 'Low — standard audit procedure', recommendation: true },
        { label: 'Targeted review (top 3 only)', description: 'Focus on 3 contracts above $100M ($715M combined). Faster turnaround: 5 business days.', risk: 'Medium — may miss issues in smaller contracts', recommendation: false },
        { label: 'Defer to external auditor', description: 'Engage external audit firm for independent review. Most thorough but 30-day timeline.', risk: 'Low risk, high cost ($2-3M)', recommendation: false },
      ],
      affectedStakeholders: [
        { role: 'MOF Chief Financial Officer', impact: 'Must authorize access to procurement records' },
        { role: 'Cabinet Affairs Secretary', impact: 'Oversight of investigation findings' },
        { role: 'Contracted vendors (5)', impact: 'May face invoice audit and scope review' },
        { role: 'TransparencyAI', impact: 'Awaiting findings for Q4 disclosure completion' },
      ],
      evidenceSources: [
        { source: 'FiscalAI Budget Monitor', dataPoints: 47, lastUpdated: 'Today 2:00 AM' },
        { source: 'TenderAI Contract Database', dataPoints: 12, lastUpdated: 'Today 1:00 PM' },
        { source: 'GovBench OECD Benchmarks', dataPoints: 8, lastUpdated: 'Today 6:30 AM' },
        { source: 'MOF Historical Spending (5yr)', dataPoints: 60, lastUpdated: 'Monthly refresh' },
      ],
      precedents: [
        'FY2024 Q4: Similar pattern detected ($420M) — investigation found 15% duplicate billing, recovered $63M',
        'FY2022 Q4: MOH consultancy spike ($180M) — root cause was legitimate COVID response acceleration',
      ],
    },
  },
  {
    id: 'dq2', app: 'tender-ai', severity: 'attention',
    title: 'Override or fix: Smart City tender compliance gaps',
    detail: 'TenderAI flagged 2 non-compliant clauses in TND-2026-4471. Options: (a) route to legal for clause revision, (b) override with justification for urgent procurement.',
    confidence: 0.88, suggestedAction: 'Route to legal for clause revision',
    detectedAt: hoursAgo(6.5),
    deepDetail: {
      investigationChain: [
        { step: 1, agent: 'Compliance Scanner', finding: 'Missing Sustainability Framework 2030 environmental sustainability criteria in Section 4.2', confidence: 0.95 },
        { step: 2, agent: 'Compliance Scanner', finding: 'Missing In-Country Value (ICV) minimum threshold in Section 7.1', confidence: 0.93 },
        { step: 3, agent: 'Pattern Detector', finding: 'Same gaps found in 2 other recent tenders — template not updated', confidence: 0.88 },
        { step: 4, agent: 'Legal Reference', finding: 'Government Procurement Act §8 requires environmental criteria for >$100M', confidence: 0.97 },
      ],
      options: [
        { label: 'Route to legal for clause revision', description: 'Add missing clauses to tender document before bid opening. 2-day turnaround. No bidding delay if fast-tracked.', risk: 'Low — standard procedure', recommendation: true },
        { label: 'Override with justification', description: 'Proceed without clauses, document justification for urgent procurement. Minister signature required.', risk: 'High — potential legal challenge from bidders, audit finding', recommendation: false },
        { label: 'Withdraw and re-tender', description: 'Cancel current tender, update template, re-issue. 30-day delay, higher cost.', risk: 'Low legal risk, high time cost', recommendation: false },
      ],
      affectedStakeholders: [
        { role: 'GovTech Procurement Director', impact: 'Must approve revised tender document' },
        { role: 'Pre-qualified bidders (6)', impact: 'Minor delay if legal revision chosen' },
        { role: 'MND Sustainability Framework Team', impact: 'Systemic gap affects Sustainability Framework compliance metrics' },
      ],
      evidenceSources: [
        { source: 'TenderAI Compliance Scanner', dataPoints: 24, lastUpdated: 'Today 1:00 PM' },
        { source: 'Government Procurement Act', dataPoints: 1, lastUpdated: 'Statutory' },
        { source: 'Sustainability Framework 2030 Framework', dataPoints: 1, lastUpdated: 'Policy document' },
      ],
      precedents: [
        'TND-2025-3891: Similar compliance gap discovered post-award — required contract amendment costing $12M and 3-month delay',
      ],
    },
  },
  {
    id: 'dq3', app: 'transparency-ai', severity: 'attention',
    title: 'Approve auto-generated MOF Q4 disclosure draft',
    detail: 'TransparencyAI generated 80% of the required quarterly report. 3 sections need human input: executive summary, policy impact narrative, forward-looking risk assessment.',
    confidence: 0.76, suggestedAction: 'Review and complete 3 remaining sections',
    detectedAt: hoursAgo(0.2),
    deepDetail: {
      investigationChain: [
        { step: 1, agent: 'Report Generator', finding: 'Auto-generated 16/20 report sections from available data sources', confidence: 0.88 },
        { step: 2, agent: 'Completeness Checker', finding: '3 sections require human judgment: executive summary, policy narrative, risk assessment', confidence: 0.95 },
        { step: 3, agent: 'Quality Scorer', finding: 'Current score 64/100 — needs 80+ for compliance standing', confidence: 0.92 },
        { step: 4, agent: 'Template Drafter', finding: 'Pre-drafted templates available for all 3 missing sections', confidence: 0.76 },
      ],
      options: [
        { label: 'Complete with pre-drafted templates', description: 'Use TransparencyAI templates as starting point. Finance team reviews and customizes. Estimated 4-6 hours of human effort.', risk: 'Low — fastest path to compliance', recommendation: true },
        { label: 'Assign to finance team from scratch', description: 'Finance team writes 3 sections without AI assistance. Higher quality but 2-3 day effort.', risk: 'Medium — may miss deadline if delayed', recommendation: false },
        { label: 'Request deadline extension', description: 'Formally request 5-day extension from oversight body. Requires justification.', risk: 'Medium — signals capacity issues', recommendation: false },
      ],
      affectedStakeholders: [
        { role: 'MOF Reporting Team', impact: 'Must complete 3 remaining sections' },
        { role: 'MOF Under-Secretary', impact: 'Must approve final report before publication' },
        { role: 'Cabinet Affairs', impact: 'Awaiting disclosure for quarterly governance review' },
      ],
      evidenceSources: [
        { source: 'TransparencyAI Report Generator', dataPoints: 156, lastUpdated: 'Today 2:15 AM' },
        { source: 'FiscalAI Anomaly Data', dataPoints: 47, lastUpdated: 'Today 2:00 AM' },
        { source: 'WEF Transparency Benchmark', dataPoints: 20, lastUpdated: 'Quarterly refresh' },
      ],
      precedents: [
        'MOE Q3 2025: TransparencyAI auto-generated 85% of report, human completion took 3 hours, scored 88/100',
      ],
    },
  },
  {
    id: 'dq4', app: 'gov-bench', severity: 'info',
    title: 'Share ICT competitiveness analysis with GovTech',
    detail: 'GovBench generated comparative analysis of ICT ranking decline (#4→#6). Contains transferable policy recommendations from Estonia and South Korea. Awaiting distribution approval.',
    confidence: 0.95, suggestedAction: 'Share with GovTech Minister',
    detectedAt: hoursAgo(3.0),
    deepDetail: {
      investigationChain: [
        { step: 1, agent: 'Benchmark Scanner', finding: 'WEF GCR 2026 published — ICT Adoption dropped 2 positions', confidence: 0.99 },
        { step: 2, agent: 'Peer Analyzer', finding: 'Estonia X-Road and South Korea MyData identified as overtaking factors', confidence: 0.93 },
        { step: 3, agent: 'Transfer Assessor', finding: 'South Korea MyData: HIGH transferability to context', confidence: 0.88 },
        { step: 4, agent: 'FiscalAI Estimator', finding: 'Estimated adoption cost: $120M over 3 years', confidence: 0.85 },
      ],
      options: [
        { label: 'Share analysis with GovTech Minister', description: 'Distribute the full comparative report including transferability assessment and cost estimates.', risk: 'Low — information sharing', recommendation: true },
        { label: 'Commission detailed feasibility study', description: 'Before sharing, commission GovTech to conduct 60-day feasibility study of MyData model.', risk: 'Low risk, but delays response by 2 months', recommendation: false },
      ],
      affectedStakeholders: [
        { role: 'GovTech Minister', impact: 'Primary recipient — responsible for ICT competitiveness' },
        { role: 'MTI', impact: 'AI Strategy depends on digital infrastructure' },
        { role: 'MOE', impact: 'EdTech programs benefit from improved ICT ranking' },
      ],
      evidenceSources: [
        { source: 'WEF Global Competitiveness Report 2026', dataPoints: 23, lastUpdated: 'Today 6:30 AM' },
        { source: 'GovBench Peer Database', dataPoints: 45, lastUpdated: 'Today 6:40 AM' },
        { source: 'FiscalAI Cost Estimator', dataPoints: 12, lastUpdated: 'Today 6:50 AM' },
      ],
      precedents: [
        'GovBench 2025: Shared Singapore teacher evaluation benchmarks with MOE — led to adoption of phased rollout approach',
      ],
    },
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Analyst Hours Saved', value: 4200, unit: 'hrs/month', trend: 12, trendLabel: '+12% vs last month', sparkline: [2800, 3100, 3400, 3600, 3800, 4200],
    breakdown: {
      description: 'Total analyst hours saved across all 7 AgenticGov agent domains through automated scanning, report generation, and anomaly detection.',
      components: [
        { label: 'FiscalAI automated budget scans', value: '1,400 hrs', percentage: 33 },
        { label: 'TransparencyAI auto-generated reports', value: '980 hrs', percentage: 23 },
        { label: 'TenderAI compliance pre-checks', value: '720 hrs', percentage: 17 },
        { label: 'GovBench ranking monitoring', value: '460 hrs', percentage: 11 },
        { label: 'ReadinessMap function tracking', value: '380 hrs', percentage: 9 },
        { label: 'PolicyAI policy analysis', value: '260 hrs', percentage: 7 },
      ],
      methodology: 'Calculated by comparing estimated manual effort (from pre-deployment baseline study) with actual agent processing time. Validated by ministry operations teams quarterly.',
      comparison: [
        { label: 'Budget analysis per ministry', before: '40 hrs/month', after: '4 hrs/month' },
        { label: 'Tender compliance review', before: '8 hrs/tender', after: '12 min/tender' },
        { label: 'Quarterly disclosure report', before: '120 hrs', after: '24 hrs (80% auto)' },
        { label: 'International benchmark scan', before: '60 hrs/quarter', after: 'Continuous + 2 hrs review' },
      ],
      topContributors: [
        { name: 'FiscalAI Daily Budget Scanner', contribution: 'Scans 47 ministry budgets in 4 minutes vs 2 weeks manually' },
        { name: 'TransparencyAI Report Generator', contribution: 'Auto-generates 80% of quarterly disclosures across 11 ministries' },
        { name: 'TenderAI Compliance Scanner', contribution: 'Pre-checks every tender against Government Procurement Act in under 1 minute' },
      ],
    },
  },
  {
    label: 'Cost Avoidance', value: 1.2, unit: '$B', trend: 8, trendLabel: '$1.2B anomalies caught', sparkline: [0.4, 0.6, 0.7, 0.9, 1.0, 1.2],
    breakdown: {
      description: 'Cumulative value of spending anomalies, procurement overpricing, and compliance gaps detected by AgenticGov agents that were corrected before funds were disbursed.',
      components: [
        { label: 'Spending anomalies (FiscalAI)', value: '$850M', percentage: 71 },
        { label: 'Procurement overpricing (TenderAI)', value: '$210M', percentage: 18 },
        { label: 'Duplicate contract detection', value: '$95M', percentage: 8 },
        { label: 'Compliance penalty avoidance', value: '$45M', percentage: 3 },
      ],
      methodology: 'Anomalies flagged by agents, verified by human reviewers, and confirmed as legitimate cost avoidance by Ministry of Finance audit team.',
      comparison: [
        { label: 'Anomaly detection rate', before: '2-3 per year (manual audit)', after: '12+ per quarter (continuous monitoring)' },
        { label: 'Detection speed', before: '3-6 months after expenditure', after: 'Same-day detection' },
        { label: 'Recovery rate', before: '15% of detected anomalies', after: '68% of detected anomalies' },
      ],
      topContributors: [
        { name: 'MOF Q4 Consultancy Anomaly', contribution: '$850M variance detected — investigation in progress' },
        { name: 'Solar Procurement Overpricing', contribution: '$1.2B tender flagged as 34% above OECD benchmark' },
        { name: 'GovTech Duplicate Contract', contribution: '$95M IT Infrastructure scope overlap with existing contract' },
      ],
    },
  },
  {
    label: 'Compliance Rate', value: 91, unit: '%', trend: 24, trendLabel: 'Up from 67% baseline', sparkline: [67, 72, 78, 83, 87, 91],
    breakdown: {
      description: 'Percentage of government programs meeting transparency and compliance requirements across all 10 monitored ministries.',
      components: [
        { label: 'Disclosure completeness', value: '93%', percentage: 93 },
        { label: 'Deadline adherence', value: '89%', percentage: 89 },
        { label: 'Evidence quality standards', value: '87%', percentage: 87 },
        { label: 'Procurement compliance', value: '94%', percentage: 94 },
      ],
      methodology: 'Composite score based on 4 sub-dimensions, weighted equally. Measured against WEF transparency benchmarks and federal compliance standards.',
      comparison: [
        { label: 'On-time disclosure', before: '6/11 ministries', after: '9/11 ministries' },
        { label: 'Report quality score', before: '62/100 average', after: '82/100 average' },
        { label: 'Procurement pre-checks', before: 'Manual spot-checks', after: '100% automated pre-check' },
        { label: 'Evidence documentation', before: '45% of programs', after: '87% of programs' },
      ],
      topContributors: [
        { name: 'TransparencyAI Auto-Disclosure', contribution: 'Raised average disclosure completeness from 58% to 93%' },
        { name: 'TenderAI Compliance Scanner', contribution: 'All tenders >$50M now auto-checked against law' },
        { name: 'FiscalAI KPI Tracking', contribution: 'Real-time budget compliance monitoring for all 47 programs' },
      ],
    },
  },
  {
    label: 'Evidence Quality', value: 78, unit: '/100', trend: 36, trendLabel: 'Up from 42 baseline', sparkline: [42, 51, 58, 65, 72, 78],
    breakdown: {
      description: 'Average quality score of evaluation evidence across all government programs, measured against the WEF transparency framework and Causalis evaluation standards.',
      components: [
        { label: 'Data completeness', value: '84/100', percentage: 84 },
        { label: 'Methodological rigor', value: '72/100', percentage: 72 },
        { label: 'Source attribution', value: '81/100', percentage: 81 },
        { label: 'Impact measurement', value: '75/100', percentage: 75 },
      ],
      methodology: 'Scored by Causalis evaluation quality rubric (15 dimensions, weighted). Calibrated against corpus of 352 MDB evaluation reports. Validated by independent assessment.',
      comparison: [
        { label: 'Programs with evaluation design', before: '23%', after: '67%' },
        { label: 'Programs with baseline data', before: '31%', after: '72%' },
        { label: 'Programs with counterfactual', before: '8%', after: '34%' },
        { label: 'Average quality score', before: '42/100', after: '78/100' },
      ],
      topContributors: [
        { name: 'Causalis Evaluation Designer', contribution: 'Auto-generated rigorous evaluation designs for 15 major programs' },
        { name: 'PolicyAI Evidence Framework', contribution: 'Standardized evidence requirements across all policy proposals' },
        { name: 'ReadinessMap Quality Tracking', contribution: 'Continuous monitoring of WEF function readiness with quality metrics' },
      ],
    },
  },
];

export const AGENT_HEALTH: AgentHealth[] = [
  { app: 'policy-ai', status: 'healthy', uptime: '99.8%', tasksToday: 127, avgLatencyMs: 2400, lastActive: hoursAgo(0.5) },
  { app: 'causalis', status: 'healthy', uptime: '99.9%', tasksToday: 84, avgLatencyMs: 3100, lastActive: hoursAgo(1.0) },
  { app: 'tender-ai', status: 'healthy', uptime: '99.7%', tasksToday: 156, avgLatencyMs: 1800, lastActive: hoursAgo(0.2) },
  { app: 'fiscal-ai', status: 'healthy', uptime: '99.5%', tasksToday: 203, avgLatencyMs: 2100, lastActive: hoursAgo(0.1) },
  { app: 'readiness-map', status: 'healthy', uptime: '99.9%', tasksToday: 67, avgLatencyMs: 1500, lastActive: hoursAgo(2.0) },
  { app: 'gov-bench', status: 'healthy', uptime: '99.8%', tasksToday: 93, avgLatencyMs: 2800, lastActive: hoursAgo(0.5) },
  { app: 'transparency-ai', status: 'degraded', uptime: '98.2%', tasksToday: 117, avgLatencyMs: 3400, lastActive: hoursAgo(0.2), note: 'Disclosure backlog: 3 ministries pending review' },
];

export function getAppColor(appId: AppId): string {
  return AGENTIC_APPS.find(a => a.id === appId)?.color ?? '#64748B';
}

export function getAppName(appId: AppId): string {
  return AGENTIC_APPS.find(a => a.id === appId)?.name ?? appId;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString();
}
