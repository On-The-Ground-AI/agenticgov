import type { AppId } from './agenticDemo';

// ---------------------------------------------------------------------------
// Core Concept: Agentic flows are the primary object, not org tiers.
// Agents PULL (top-down), PUSH (bottom-up), and SYNC (lateral).
// The hierarchy exists but is background — the connections are foreground.
// ---------------------------------------------------------------------------

export type FlowDirection = 'pull' | 'push' | 'sync';
export type FlowStatus = 'active' | 'completed' | 'waiting-human' | 'queued';
export type TierLevel = 'division' | 'ministry' | 'cabinet';
export type Priority = 'urgent' | 'high' | 'standard';
export type WorkStreamStatus = 'on-track' | 'at-risk' | 'delayed' | 'completed';

// ---------------------------------------------------------------------------
// AGENTIC FLOW — The primary data type. Every flow is an agent action.
// ---------------------------------------------------------------------------

export interface AgenticFlow {
  id: string;
  direction: FlowDirection;
  status: FlowStatus;
  initiator: string;
  initiatorTier: TierLevel;
  target: string;
  targetTier: TierLevel;
  action: string;
  reason: string;
  dataRequested?: string;
  dataDelivered?: string;
  triggeredBy?: string;
  timestamp: string;
  durationMs: number;
  agenticApp?: AppId;
  confidence?: number;
}

// ---------------------------------------------------------------------------
// LIVE FLOWS — Simulated real-time agent activity across all tiers
// These show agents proactively pulling and pushing — the agentic core
// ---------------------------------------------------------------------------

export const LIVE_FLOWS: AgenticFlow[] = [
  // --- PULL flows: Higher tiers proactively requesting intel ---
  {
    id: 'f-01',
    direction: 'pull',
    status: 'completed',
    initiator: 'Cabinet Briefing Agent',
    initiatorTier: 'cabinet',
    target: 'MOF Fiscal Monitor',
    targetTier: 'ministry',
    action: 'Pulled Q4 spending variance',
    reason: 'PM requested fiscal update for tomorrow\'s cabinet — agent auto-queried all ministries with >10% variance',
    dataRequested: 'Q4 budget vs actuals for programs with >10% variance',
    dataDelivered: 'MOF Q4 consultancy overspend $850M (3.4× baseline). Root cause: year-end contract acceleration.',
    timestamp: '2 min ago',
    durationMs: 3200,
    agenticApp: 'fiscal-ai',
    confidence: 0.94,
  },
  {
    id: 'f-02',
    direction: 'pull',
    status: 'active',
    initiator: 'Cabinet Briefing Agent',
    initiatorTier: 'cabinet',
    target: 'MOE Division Agents',
    targetTier: 'division',
    action: 'Pulling KidSTART enrollment data',
    reason: 'Cabinet agenda item on Year 2 budget — agent skipped ministry layer to get live enrollment numbers directly from division',
    dataRequested: 'KidSTART pilot: current enrollment, center operational status, teacher certification rate',
    timestamp: '45 sec ago',
    durationMs: 0,
    agenticApp: 'policy-ai',
  },
  {
    id: 'f-03',
    direction: 'pull',
    status: 'completed',
    initiator: 'MOE Strategy Agent',
    initiatorTier: 'ministry',
    target: 'GovBench Ranking Monitor',
    targetTier: 'ministry',
    action: 'Pulled Singapore teacher evaluation benchmarks',
    reason: 'Teacher evaluation reform stalled — agent proactively fetched peer country approaches to unblock',
    dataRequested: 'Teacher evaluation frameworks from top-5 education systems',
    dataDelivered: 'Singapore phased rollout model: Year 1 pilot 50 schools, Year 2 expand to 200, Year 3 national. Union consultation built into timeline.',
    timestamp: '15 min ago',
    durationMs: 4800,
    agenticApp: 'gov-bench',
    confidence: 0.88,
  },
  {
    id: 'f-04',
    direction: 'pull',
    status: 'completed',
    initiator: 'Cross-Ministry SkillsFuture Agent',
    initiatorTier: 'cabinet',
    target: 'MOE + MOM + MTI Agents',
    targetTier: 'ministry',
    action: 'Pulled employment + training data from 3 ministries simultaneously',
    reason: 'SkillsFuture post-graduation employment declining — agent correlated education outputs with labor market data to identify skills gap',
    dataRequested: 'MoE: graduate field distribution. MOM: private sector vacancy types. MTI: AI skills demand forecast.',
    dataDelivered: 'Skills mismatch confirmed: 40% of graduates in business/admin, but 65% of vacancies in tech/engineering. MTI AI demand growing 23% YoY.',
    timestamp: '28 min ago',
    durationMs: 8200,
    agenticApp: 'readiness-map',
    confidence: 0.91,
  },

  // --- PUSH flows: Lower tiers autonomously escalating ---
  {
    id: 'f-05',
    direction: 'push',
    status: 'waiting-human',
    initiator: 'FiscalAI Anomaly Detector',
    initiatorTier: 'division',
    target: 'Cabinet Decision Queue',
    targetTier: 'cabinet',
    action: 'Pushed spending anomaly alert',
    reason: 'Detected 3.4× baseline variance in MOF consultancy — exceeded auto-escalation threshold (>2× baseline)',
    dataDelivered: '$850M overspend flagged. Confidence 92%. Recommended: invoice-level investigation + 5-day supplementary disclosure deadline.',
    triggeredBy: 'Automated threshold breach (>2× baseline variance)',
    timestamp: '1 hour ago',
    durationMs: 1200,
    agenticApp: 'fiscal-ai',
    confidence: 0.92,
  },
  {
    id: 'f-06',
    direction: 'push',
    status: 'completed',
    initiator: 'TenderAI Compliance Scanner',
    initiatorTier: 'division',
    target: 'MND Ministry Agent',
    targetTier: 'ministry',
    action: 'Pushed compliance gap alert',
    reason: 'Detected 3/12 large tenders missing Sustainability Framework environmental criteria — systemic gap, not one-off',
    dataDelivered: 'Missing criteria: carbon offset provisions, sustainability scoring, environmental impact assessment. Affected tenders totaling $3.8B.',
    triggeredBy: 'Automated compliance scan (daily 2:00 AM)',
    timestamp: '4 hours ago',
    durationMs: 6400,
    agenticApp: 'tender-ai',
    confidence: 0.91,
  },
  {
    id: 'f-07',
    direction: 'push',
    status: 'completed',
    initiator: 'TransparencyAI Deadline Monitor',
    initiatorTier: 'division',
    target: 'MOF Ministry Agent + Cabinet Alert',
    targetTier: 'ministry',
    action: 'Pushed disclosure deadline warning',
    reason: 'MOF Q4 report due in 5 days, only 64% complete — auto-escalated because completion rate too low for deadline',
    dataDelivered: 'Missing: consultancy breakdown, sub-program allocations, variance explanations. Current completion 64%, need 100% in 5 days.',
    triggeredBy: 'Deadline proximity + low completion rate',
    timestamp: '6 hours ago',
    durationMs: 800,
    agenticApp: 'transparency-ai',
    confidence: 0.95,
  },
  {
    id: 'f-08',
    direction: 'push',
    status: 'completed',
    initiator: 'ReadinessMap Score Agent',
    initiatorTier: 'ministry',
    target: 'Cabinet National KPI Tracker',
    targetTier: 'cabinet',
    action: 'Pushed WEF function score update',
    reason: 'Function #06 (Tender Preparation) moved to HIGH readiness — auto-notified cabinet because it affects National AI Strategy KPI',
    dataDelivered: '12 WEF functions improved this quarter. Function #06 now HIGH. Overall readiness: 34/70 functions at HIGH or MEDIUM.',
    triggeredBy: 'Score threshold crossed (MEDIUM → HIGH)',
    timestamp: '1 day ago',
    durationMs: 2100,
    agenticApp: 'readiness-map',
    confidence: 0.87,
  },

  // --- SYNC flows: Lateral coordination between peers ---
  {
    id: 'f-09',
    direction: 'sync',
    status: 'completed',
    initiator: 'FiscalAI Budget Agent',
    initiatorTier: 'ministry',
    target: 'TransparencyAI Disclosure Agent',
    targetTier: 'ministry',
    action: 'Synced anomaly data for auto-disclosure',
    reason: 'Spending anomaly detected → transparency report needs the same data for public disclosure — agents coordinate to avoid duplicate work',
    dataDelivered: 'Anomaly details, root cause analysis, and remediation timeline shared. TransparencyAI auto-drafted supplementary disclosure.',
    timestamp: '55 min ago',
    durationMs: 1800,
    agenticApp: 'transparency-ai',
    confidence: 0.89,
  },
  {
    id: 'f-10',
    direction: 'sync',
    status: 'active',
    initiator: 'TenderAI Procurement Agent',
    initiatorTier: 'ministry',
    target: 'FiscalAI Budget Agent',
    targetTier: 'ministry',
    action: 'Syncing tender cost data with budget forecaster',
    reason: 'New $1.2B solar tender submitted — fiscal impact needs to be computed before approval',
    dataRequested: 'Budget headroom check for MND energy procurement FY2026-2027',
    timestamp: '3 min ago',
    durationMs: 0,
    agenticApp: 'fiscal-ai',
  },
  {
    id: 'f-11',
    direction: 'sync',
    status: 'completed',
    initiator: 'PolicyAI Impact Agent',
    initiatorTier: 'ministry',
    target: 'Causalis Evaluation Agent',
    targetTier: 'ministry',
    action: 'Synced KidSTART policy data for evaluation design',
    reason: 'KidSTART pilot Year 2 budget needs cabinet approval — Causalis auto-generated evaluation design to strengthen the case',
    dataDelivered: 'Cluster-RCT design with 50 treatment + 50 control centers, 3-year measurement plan, estimated BCR 2.1×.',
    timestamp: '2 hours ago',
    durationMs: 12000,
    agenticApp: 'causalis',
    confidence: 0.88,
  },
  {
    id: 'f-12',
    direction: 'pull',
    status: 'completed',
    initiator: 'MOE Budget Agent',
    initiatorTier: 'ministry',
    target: 'FiscalAI National Benchmarks',
    targetTier: 'cabinet',
    action: 'Pulled OECD education spending benchmarks',
    reason: 'Year 2 KidSTART budget request needs justification — agent pulled comparable country spending to strengthen cabinet submission',
    dataRequested: 'OECD average KidSTART spend per child, top-5 country benchmarks',
    dataDelivered: 'National KidSTART spend: $18K/child. OECD avg: $22K. Finland: $31K. Agent recommendation: budget request is conservative vs peers.',
    timestamp: '3 hours ago',
    durationMs: 3600,
    agenticApp: 'fiscal-ai',
    confidence: 0.93,
  },
];

// ---------------------------------------------------------------------------
// ROUTING RULES — How agents decide what to surface and to whom
// These are the "intelligence" in agentic — not just forwarding everything
// ---------------------------------------------------------------------------

export interface RoutingRule {
  id: string;
  name: string;
  trigger: string;
  agentAction: string;
  direction: FlowDirection;
  fromTier: TierLevel;
  toTier: TierLevel;
  condition: string;
  exampleFired: string;
  frequency: string;
}

export const ROUTING_RULES: RoutingRule[] = [
  {
    id: 'rr-1',
    name: 'Anomaly Auto-Escalation',
    trigger: 'Spending variance > 2× baseline',
    agentAction: 'Push alert to cabinet + auto-draft disclosure',
    direction: 'push',
    fromTier: 'division',
    toTier: 'cabinet',
    condition: 'Bypass ministry layer when variance exceeds 2× and amount > $100M',
    exampleFired: 'MOF Q4 consultancy $850M overspend → pushed directly to Cabinet Decision Queue',
    frequency: '~3 per quarter',
  },
  {
    id: 'rr-2',
    name: 'Cabinet Briefing Pre-fetch',
    trigger: '24 hours before scheduled cabinet meeting',
    agentAction: 'Pull latest data from all relevant divisions',
    direction: 'pull',
    fromTier: 'cabinet',
    toTier: 'division',
    condition: 'For each agenda item, identify source divisions and pull live data — skip cached ministry reports',
    exampleFired: 'KidSTART Year 2 budget item → pulled enrollment data directly from Early Childhood division',
    frequency: 'Weekly (pre-cabinet)',
  },
  {
    id: 'rr-3',
    name: 'Cross-Ministry Conflict Detection',
    trigger: 'Two ministries submit overlapping budget requests or contradictory policy proposals',
    agentAction: 'Sync data between both ministries, generate conflict brief, push to cabinet',
    direction: 'sync',
    fromTier: 'ministry',
    toTier: 'ministry',
    condition: 'Overlap detected via semantic similarity > 0.8 or budget line collision',
    exampleFired: 'MOE AI Curriculum + MTI AI Training → duplicate $45M budget lines identified',
    frequency: '~5 per quarter',
  },
  {
    id: 'rr-4',
    name: 'Stalled Reform Unblock',
    trigger: 'Work stream progress < 30% at midpoint',
    agentAction: 'Pull peer country benchmarks + generate recommended approach',
    direction: 'pull',
    fromTier: 'ministry',
    toTier: 'ministry',
    condition: 'Auto-fetch relevant international examples when reform stalls — present options to ministry leadership',
    exampleFired: 'HE Governance Reform at 28% → pulled Singapore, UK, Australia university governance models',
    frequency: '~2 per quarter',
  },
  {
    id: 'rr-5',
    name: 'Compliance Gap Cascade',
    trigger: 'Systematic compliance gap detected (>2 instances in same category)',
    agentAction: 'Push finding up + sync with transparency agent + flag affected tenders',
    direction: 'push',
    fromTier: 'division',
    toTier: 'cabinet',
    condition: 'Not just one bad tender — agent looks for patterns. Single violations go to ministry; systemic gaps go to cabinet.',
    exampleFired: '3/12 tenders missing Sustainability Framework criteria → classified as systemic → escalated to cabinet for policy update',
    frequency: '~1 per quarter',
  },
  {
    id: 'rr-6',
    name: 'KPI Impact Propagation',
    trigger: 'Division-level change affects national KPI trajectory',
    agentAction: 'Push updated projection to cabinet KPI tracker + recalculate 2031 forecast',
    direction: 'push',
    fromTier: 'division',
    toTier: 'cabinet',
    condition: 'When a division metric moves >5%, agent recalculates its impact on the national KPI chain',
    exampleFired: 'KidSTART enrollment +8% above target → Education Quality Index projection improved → cabinet KPI tracker updated',
    frequency: '~8 per quarter',
  },
  {
    id: 'rr-7',
    name: 'Evidence Demand Signal',
    trigger: 'Cabinet or minister requests budget approval for program',
    agentAction: 'Pull evaluation evidence + generate cost-benefit summary',
    direction: 'pull',
    fromTier: 'cabinet',
    toTier: 'ministry',
    condition: 'Before any budget request reaches cabinet vote, agents auto-attach evidence strength rating and comparable benchmarks',
    exampleFired: 'KidSTART Year 2 $520M request → Causalis attached Cluster-RCT design + BCR 2.1× + OECD spend comparison',
    frequency: 'Every cabinet budget item',
  },
  {
    id: 'rr-8',
    name: 'Directive Tracking',
    trigger: 'Cabinet issues directive or decision',
    agentAction: 'Push directive to responsible divisions + set up progress monitors',
    direction: 'pull',
    fromTier: 'cabinet',
    toTier: 'division',
    condition: 'After cabinet decision, agents decompose into trackable milestones and assign monitors at division level',
    exampleFired: 'Cabinet approved TenderAI compliance pre-check mandate → agents created compliance monitor for all >$100M tenders',
    frequency: 'Every cabinet decision',
  },
];

// ---------------------------------------------------------------------------
// FLOW STATISTICS — Aggregate metrics showing agentic volume
// ---------------------------------------------------------------------------

export interface FlowStats {
  pullsToday: number;
  pushesToday: number;
  syncsToday: number;
  avgResponseMs: number;
  humanDecisionsPending: number;
  autoResolvedToday: number;
  dataPointsRouted: number;
  tiersSkipped: number;
}

export const FLOW_STATS: FlowStats = {
  pullsToday: 34,
  pushesToday: 12,
  syncsToday: 28,
  avgResponseMs: 3400,
  humanDecisionsPending: 3,
  autoResolvedToday: 71,
  dataPointsRouted: 1247,
  tiersSkipped: 8,
};

// ---------------------------------------------------------------------------
// AGENT NETWORK NODES — For the flow visualization
// ---------------------------------------------------------------------------

export interface NetworkNode {
  id: string;
  label: string;
  tier: TierLevel;
  type: 'agent' | 'human' | 'data-source';
  activeFlows: number;
}

export const NETWORK_NODES: NetworkNode[] = [
  { id: 'cab-briefing', label: 'Cabinet Briefing Agent', tier: 'cabinet', type: 'agent', activeFlows: 4 },
  { id: 'cab-kpi', label: 'National KPI Tracker', tier: 'cabinet', type: 'agent', activeFlows: 6 },
  { id: 'cab-conflict', label: 'Cross-Ministry Coordinator', tier: 'cabinet', type: 'agent', activeFlows: 3 },
  { id: 'cab-directive', label: 'Directive Monitor', tier: 'cabinet', type: 'agent', activeFlows: 2 },
  { id: 'pm-office', label: 'PM Office', tier: 'cabinet', type: 'human', activeFlows: 1 },

  { id: 'moe-strategy', label: 'MOE Strategy Agent', tier: 'ministry', type: 'agent', activeFlows: 3 },
  { id: 'mof-fiscal', label: 'MOF Fiscal Monitor', tier: 'ministry', type: 'agent', activeFlows: 5 },
  { id: 'moiat-ai', label: 'MTI AI Strategy Agent', tier: 'ministry', type: 'agent', activeFlows: 2 },
  { id: 'moei-green', label: 'MND Sustainability Framework Agent', tier: 'ministry', type: 'agent', activeFlows: 2 },
  { id: 'tdra-digital', label: 'GovTech Digital Gov Agent', tier: 'ministry', type: 'agent', activeFlows: 3 },

  { id: 'fiscal-anomaly', label: 'FiscalAI Anomaly Detector', tier: 'division', type: 'agent', activeFlows: 2 },
  { id: 'tender-compliance', label: 'TenderAI Compliance Scanner', tier: 'division', type: 'agent', activeFlows: 3 },
  { id: 'transparency-deadline', label: 'TransparencyAI Deadline Monitor', tier: 'division', type: 'agent', activeFlows: 2 },
  { id: 'readiness-score', label: 'ReadinessMap Score Agent', tier: 'division', type: 'agent', activeFlows: 1 },
  { id: 'govbench-ranking', label: 'GovBench Ranking Monitor', tier: 'division', type: 'agent', activeFlows: 1 },
  { id: 'moe-ecce', label: 'MOE KidSTART Division Agent', tier: 'division', type: 'agent', activeFlows: 2 },
  { id: 'policy-impact', label: 'PolicyAI Impact Agent', tier: 'division', type: 'agent', activeFlows: 2 },
];

// ---------------------------------------------------------------------------
// Keep existing data for ministry drill-down (unchanged)
// ---------------------------------------------------------------------------

export interface KPI {
  name: string;
  target: number;
  actual: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface WorkStream {
  id: string;
  name: string;
  division: string;
  ministry: string;
  type: 'program' | 'project' | 'initiative' | 'reform';
  status: WorkStreamStatus;
  progress: number;
  budgetAEDM: number;
  spentAEDM: number;
  kpis: KPI[];
  crossMinistry?: string[];
  lastUpdate: string;
  aiSummary: string;
  riskFlag?: string;
}

export interface Division {
  id: string;
  name: string;
  ministryId: string;
  head: string;
  headCount: number;
  workStreams: string[];
  aiHealthScore: number;
  lastReportGenerated: string;
}

export interface MinistryIntel {
  id: string;
  name: string;
  shortName: string;
  minister: string;
  divisions: string[];
  overallProgress: number;
  totalBudgetAEDM: number;
  totalSpentAEDM: number;
  riskCount: number;
  aiSummary: string;
  cabinetItems: string[];
}

export interface CabinetAgendaItem {
  id: string;
  title: string;
  sourceMinistry: string;
  type: 'decision' | 'information' | 'discussion';
  priority: Priority;
  relatedMinistries: string[];
  aiSummary: string;
  recommendation: string;
  agenticApps: AppId[];
  dataPoints: number;
  confidenceScore: number;
}

export interface CrossMinistryProgram {
  id: string;
  name: string;
  leadMinistry: string;
  participatingMinistries: string[];
  overallProgress: number;
  totalBudgetAEDM: number;
  status: WorkStreamStatus;
  aiCoordinationNote: string;
  conflictsDetected: number;
  synergyOpportunities: number;
}

export interface NationalKPI {
  id: string;
  name: string;
  category: string;
  target2031: number;
  current: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  ownerMinistry: string;
  contributingMinistries: string[];
  aiAssessment: string;
  onTrack: boolean;
}

export const MOE_DIVISIONS: Division[] = [
  { id: 'moe-ecce', name: 'Early Childhood Education', ministryId: 'moe', head: 'Dr. Fatima Al Shamsi', headCount: 340, workStreams: ['ws-ecce-pilot', 'ws-ecce-standards'], aiHealthScore: 82, lastReportGenerated: 'Today 6:30 AM' },
  { id: 'moe-k12', name: 'K-12 Schools', ministryId: 'moe', head: 'Ahmed Al Dhaheri', headCount: 1200, workStreams: ['ws-madrasa', 'ws-stem-academy'], aiHealthScore: 91, lastReportGenerated: 'Today 6:30 AM' },
  { id: 'moe-higher', name: 'Higher Education', ministryId: 'moe', head: 'Dr. Mariam Al Ketbi', headCount: 280, workStreams: ['ws-scholarship', 'ws-uni-reform'], aiHealthScore: 78, lastReportGenerated: 'Today 6:30 AM' },
  { id: 'moe-teacher', name: 'Teacher Development', ministryId: 'moe', head: 'Khalid Al Mansouri', headCount: 180, workStreams: ['ws-teacher-train', 'ws-teacher-eval'], aiHealthScore: 88, lastReportGenerated: 'Today 6:30 AM' },
  { id: 'moe-digital', name: 'Digital Education', ministryId: 'moe', head: 'Sara Al Marzouqi', headCount: 95, workStreams: ['ws-edtech', 'ws-ai-curriculum'], aiHealthScore: 95, lastReportGenerated: 'Today 6:30 AM' },
];

export const WORK_STREAMS: WorkStream[] = [
  {
    id: 'ws-ecce-pilot', name: 'KidSTART Pilot Programme', division: 'moe-ecce', ministry: 'MOE',
    type: 'program', status: 'on-track', progress: 45, budgetAEDM: 380, spentAEDM: 168,
    kpis: [
      { name: 'Centers Operational', target: 50, actual: 23, unit: 'centers', trend: 'improving' },
      { name: 'Children Enrolled', target: 42000, actual: 18500, unit: 'children', trend: 'improving' },
      { name: 'Teacher Certification Rate', target: 100, actual: 87, unit: '%', trend: 'stable' },
    ],
    lastUpdate: '2 hours ago', aiSummary: 'Enrollment ahead of projections by 8%. Construction delays in Al Ain cluster may impact Q3 target. Recommend contractor acceleration or scope adjustment.',
  },
  {
    id: 'ws-ecce-standards', name: 'KidSTART Quality Standards Framework', division: 'moe-ecce', ministry: 'MOE',
    type: 'reform', status: 'at-risk', progress: 35, budgetAEDM: 12, spentAEDM: 7,
    kpis: [
      { name: 'Standards Drafted', target: 45, actual: 28, unit: 'standards', trend: 'stable' },
      { name: 'Stakeholder Consultations', target: 20, actual: 8, unit: 'sessions', trend: 'declining' },
    ],
    lastUpdate: '1 day ago', aiSummary: 'Stakeholder consultation pace below target. 3 key consultations postponed due to scheduling conflicts. Risk of missing Q2 drafting deadline.',
    riskFlag: 'Consultation pace 60% below plan — may delay standards approval by 2 months',
  },
  {
    id: 'ws-madrasa', name: 'Madrasa E-Learning Platform', division: 'moe-k12', ministry: 'MOE',
    type: 'program', status: 'on-track', progress: 78, budgetAEDM: 220, spentAEDM: 175,
    kpis: [
      { name: 'Active Students', target: 500000, actual: 462000, unit: 'students', trend: 'improving' },
      { name: 'Course Completion Rate', target: 65, actual: 71, unit: '%', trend: 'improving' },
      { name: 'Teacher Adoption', target: 85, actual: 82, unit: '%', trend: 'stable' },
    ],
    lastUpdate: '3 hours ago', aiSummary: 'Platform usage exceeding targets. Completion rate 6pts above plan. Recommend reallocating surplus to content expansion for vocational tracks.',
  },
  {
    id: 'ws-stem-academy', name: 'National STEM Academy Network', division: 'moe-k12', ministry: 'MOE',
    type: 'project', status: 'on-track', progress: 62, budgetAEDM: 340, spentAEDM: 198,
    kpis: [
      { name: 'Teachers Trained', target: 500, actual: 520, unit: 'teachers', trend: 'improving' },
      { name: 'Student Enrollment', target: 12000, actual: 8400, unit: 'students', trend: 'improving' },
      { name: 'Lab Facilities Operational', target: 30, actual: 19, unit: 'labs', trend: 'stable' },
    ],
    crossMinistry: ['MTI', 'GovTech'],
    lastUpdate: '5 hours ago', aiSummary: 'Teacher training ahead of schedule (+4%). Lab construction on track. Cross-ministry partnership with MTI for AI curriculum content progressing well.',
  },
  {
    id: 'ws-scholarship', name: 'National Scholarship Programme', division: 'moe-higher', ministry: 'MOE',
    type: 'program', status: 'on-track', progress: 55, budgetAEDM: 890, spentAEDM: 512,
    kpis: [
      { name: 'Scholars Abroad', target: 3000, actual: 2650, unit: 'scholars', trend: 'stable' },
      { name: 'Completion Rate', target: 85, actual: 88, unit: '%', trend: 'improving' },
      { name: 'Post-Graduation Employment', target: 90, actual: 82, unit: '%', trend: 'declining' },
    ],
    lastUpdate: '1 day ago', aiSummary: 'Completion rate above target. Post-graduation employment declined 3pts — recommend labor market alignment review with MOM.',
    riskFlag: 'Post-graduation employment trending down — requires inter-ministry coordination with MOM',
  },
  {
    id: 'ws-uni-reform', name: 'Higher Education Governance Reform', division: 'moe-higher', ministry: 'MOE',
    type: 'reform', status: 'delayed', progress: 28, budgetAEDM: 45, spentAEDM: 18,
    kpis: [
      { name: 'Universities Assessed', target: 12, actual: 5, unit: 'universities', trend: 'stable' },
      { name: 'Governance Frameworks Approved', target: 8, actual: 2, unit: 'frameworks', trend: 'declining' },
    ],
    lastUpdate: '3 days ago', aiSummary: 'Reform pace significantly behind schedule. University leadership resistance to new governance frameworks. Requires ministerial intervention.',
    riskFlag: 'Reform stalled — only 2/8 frameworks approved after 6 months',
  },
  {
    id: 'ws-teacher-train', name: 'Teacher Professional Development', division: 'moe-teacher', ministry: 'MOE',
    type: 'program', status: 'on-track', progress: 70, budgetAEDM: 85, spentAEDM: 61,
    kpis: [
      { name: 'Teachers Certified', target: 8000, actual: 5800, unit: 'teachers', trend: 'improving' },
      { name: 'Training Satisfaction', target: 85, actual: 91, unit: '%', trend: 'improving' },
    ],
    lastUpdate: '6 hours ago', aiSummary: 'Program performing above expectations. High satisfaction scores suggest effective curriculum design. On track for full year target.',
  },
  {
    id: 'ws-teacher-eval', name: 'Performance-Based Teacher Evaluation', division: 'moe-teacher', ministry: 'MOE',
    type: 'reform', status: 'at-risk', progress: 40, budgetAEDM: 25, spentAEDM: 14,
    kpis: [
      { name: 'Schools Piloting', target: 200, actual: 120, unit: 'schools', trend: 'stable' },
      { name: 'Teacher Union Approval', target: 1, actual: 0, unit: 'approval', trend: 'stable' },
    ],
    crossMinistry: ['MOM'],
    lastUpdate: '2 days ago', aiSummary: 'Pilot rollout slower than planned. Teacher union consultation ongoing — no formal approval yet. Singapore benchmarks (via GovBench) suggest phased rollout approach.',
    riskFlag: 'Union consultation required before national rollout',
  },
  {
    id: 'ws-edtech', name: 'National EdTech Integration Programme', division: 'moe-digital', ministry: 'MOE',
    type: 'project', status: 'on-track', progress: 58, budgetAEDM: 150, spentAEDM: 92,
    kpis: [
      { name: 'Schools Equipped', target: 800, actual: 480, unit: 'schools', trend: 'improving' },
      { name: 'Digital Literacy Score', target: 80, actual: 74, unit: '/100', trend: 'improving' },
    ],
    crossMinistry: ['GovTech'],
    lastUpdate: '4 hours ago', aiSummary: 'Rollout on schedule. GovTech bandwidth upgrades enabling faster deployment. Digital literacy improving steadily across pilot schools.',
  },
  {
    id: 'ws-ai-curriculum', name: 'AI & Future Skills Curriculum', division: 'moe-digital', ministry: 'MOE',
    type: 'initiative', status: 'on-track', progress: 35, budgetAEDM: 45, spentAEDM: 18,
    kpis: [
      { name: 'Curriculum Modules Developed', target: 24, actual: 12, unit: 'modules', trend: 'improving' },
      { name: 'Pilot Schools', target: 50, actual: 15, unit: 'schools', trend: 'improving' },
    ],
    crossMinistry: ['MTI', 'GovTech'],
    lastUpdate: '1 day ago', aiSummary: 'Module development on track. Partnership with MTI for industry-aligned content. AI ethics module receiving strong feedback from pilot teachers.',
  },
];

export const MOE_INTEL: MinistryIntel = {
  id: 'moe', name: 'Ministry of Education', shortName: 'MOE', minister: 'H.E. Ahmad Al Falasi',
  divisions: ['moe-ecce', 'moe-k12', 'moe-higher', 'moe-teacher', 'moe-digital'],
  overallProgress: 56,
  totalBudgetAEDM: 2192,
  totalSpentAEDM: 1263,
  riskCount: 4,
  aiSummary: 'Ministry performing at 56% overall progress against annual targets. 6/10 work streams on track, 2 at risk, 1 delayed, 1 completed. Key risks: HE Governance Reform stalled (requires ministerial intervention), KidSTART Standards consultation pace below target. Strengths: Student Learning Space exceeding engagement targets, STEM Academy teacher training ahead of schedule. Cross-ministry dependencies with MOM (scholarship employment, teacher evaluation) and GovTech (EdTech, AI Curriculum) require coordination.',
  cabinetItems: ['cab-1', 'cab-3'],
};

export const CROSS_MINISTRY_PROGRAMS: CrossMinistryProgram[] = [
  {
    id: 'cmp-1', name: 'SkillsFuture — National Workforce Programme',
    leadMinistry: 'MOM', participatingMinistries: ['MOE', 'MOF', 'MTI', 'MSF'],
    overallProgress: 64, totalBudgetAEDM: 4200, status: 'on-track',
    aiCoordinationNote: 'MOE scholarship employment data shows declining placement rates (82% vs 90% target). MOM reports private sector absorption at capacity. Recommend: expand government placement pathway and align MTI skills training with demand gaps.',
    conflictsDetected: 1, synergyOpportunities: 2,
  },
  {
    id: 'cmp-2', name: 'National Digital Government Strategy 2026',
    leadMinistry: 'GovTech', participatingMinistries: ['MOF', 'MOE', 'MOH', 'PSD'],
    overallProgress: 72, totalBudgetAEDM: 1800, status: 'on-track',
    aiCoordinationNote: 'Strong progress on service digitization. MOE EdTech programme and GovTech bandwidth upgrades creating positive synergy. MOF fiscal monitoring integration ahead of schedule. Potential conflict: data sovereignty requirements differ between MOH health records and GovTech interoperability standards.',
    conflictsDetected: 1, synergyOpportunities: 3,
  },
  {
    id: 'cmp-3', name: 'National AI Strategy 2031',
    leadMinistry: 'MTI', participatingMinistries: ['GovTech', 'MOE', 'MOF', 'PSD'],
    overallProgress: 48, totalBudgetAEDM: 3500, status: 'at-risk',
    aiCoordinationNote: 'Overall progress below 50% with 2 years remaining. Talent pipeline (via MOE AI Curriculum) is early-stage. Government adoption (via AgenticGov platform) accelerating faster than private sector. Recommend: cabinet discussion on acceleration strategy.',
    conflictsDetected: 0, synergyOpportunities: 4,
  },
  {
    id: 'cmp-4', name: 'Sustainability Framework 2030 — Sustainability Transition',
    leadMinistry: 'MND', participatingMinistries: ['MOF', 'MTI', 'PSD'],
    overallProgress: 38, totalBudgetAEDM: 8500, status: 'at-risk',
    aiCoordinationNote: 'Infrastructure investment pace behind schedule. MOF flagged $1.2B solar procurement tender as significantly above OECD benchmarks. TenderAI compliance check detected missing environmental sustainability criteria in 3 recent tenders — systemic gap.',
    conflictsDetected: 2, synergyOpportunities: 1,
  },
];

export const CABINET_AGENDA: CabinetAgendaItem[] = [
  {
    id: 'cab-1', title: 'MOF Q4 Consultancy Overspend — $850M Variance',
    sourceMinistry: 'MOF', type: 'decision', priority: 'urgent',
    relatedMinistries: ['PSD'],
    aiSummary: 'FiscalAI detected 3.4× baseline spending on Q4 consultancy contracts. Root cause: end-of-fiscal-year contract acceleration. TransparencyAI flagged incomplete quarterly disclosure. GovBench shows consultancy spend 2.1× OECD average.',
    recommendation: 'Approve invoice-level investigation. Require supplementary disclosure within 5 business days. Consider consultancy spending cap for FY2027.',
    agenticApps: ['fiscal-ai', 'transparency-ai', 'gov-bench'],
    dataPoints: 47, confidenceScore: 0.92,
  },
  {
    id: 'cab-2', title: 'National ICT Competitiveness — Ranking Decline #4 → #6',
    sourceMinistry: 'GovTech', type: 'discussion', priority: 'high',
    relatedMinistries: ['MOE', 'MTI'],
    aiSummary: 'WEF Global Competitiveness 2026 shows ICT Adoption dropped 2 positions. Estonia (X-Road platform) and South Korea (MyData initiative) overtook this country. GovBench transferability analysis: South Korea MyData approach is HIGH transferability for this jurisdiction.',
    recommendation: 'Commission GovTech to assess South Korea MyData model for adaptation. Estimated budget $120M over 3 years. Fast-track via Digital Government Strategy 2026.',
    agenticApps: ['gov-bench', 'policy-ai', 'readiness-map'],
    dataPoints: 23, confidenceScore: 0.87,
  },
  {
    id: 'cab-3', title: 'KidSTART Pilot Programme — Year 2 Progress & Year 2 Budget',
    sourceMinistry: 'MOE', type: 'information', priority: 'standard',
    relatedMinistries: ['MOF', 'MSF'],
    aiSummary: 'Universal KidSTART pilot at 45% progress, enrollment 8% ahead of projections. FiscalAI 5-year forecast: $2.8B total cost, BCR 2.1×, breakeven Year 3. Causalis recommends Cluster-RCT evaluation design for rigorous impact measurement. Year 2 budget approval ($520M) required by June.',
    recommendation: 'Note progress. Approve Year 2 budget allocation. Endorse Cluster-RCT evaluation design for evidence-based scaling decision.',
    agenticApps: ['fiscal-ai', 'causalis', 'transparency-ai'],
    dataPoints: 156, confidenceScore: 0.88,
  },
  {
    id: 'cab-4', title: 'National AI Strategy 2031 — Mid-Term Review',
    sourceMinistry: 'MTI', type: 'discussion', priority: 'high',
    relatedMinistries: ['GovTech', 'MOE', 'MOF', 'PSD'],
    aiSummary: 'Strategy at 48% progress with 2 years remaining. Government AI adoption (via AgenticGov) accelerating well. Private sector adoption lagging. Talent pipeline (MOE AI Curriculum) still in pilot phase with 15 schools. ReadinessMap shows 12 WEF functions improved since strategy launch.',
    recommendation: 'Establish AI Acceleration Task Force. Triple AI curriculum pilot to 50 schools. Consider public-private AI adoption incentive framework.',
    agenticApps: ['readiness-map', 'policy-ai', 'fiscal-ai'],
    dataPoints: 89, confidenceScore: 0.82,
  },
  {
    id: 'cab-5', title: 'Sustainability Framework 2030 — Procurement Compliance Gaps',
    sourceMinistry: 'MND', type: 'decision', priority: 'high',
    relatedMinistries: ['MOF', 'PSD'],
    aiSummary: 'TenderAI detected environmental sustainability criteria missing from 3 of 12 recent large tenders. This is a systemic gap — Sustainability Framework 2030 requirements not yet embedded in standard procurement templates. Solar procurement tender $1.2B is 34% above OECD benchmarks.',
    recommendation: 'Mandate updated procurement templates with Sustainability Framework criteria. Require TenderAI compliance pre-check for all tenders > $100M.',
    agenticApps: ['tender-ai', 'fiscal-ai', 'transparency-ai'],
    dataPoints: 34, confidenceScore: 0.91,
  },
];

export const NATIONAL_KPIS: NationalKPI[] = [
  { id: 'nk1', name: 'AI Adoption in Government Services', category: 'Digital', target2031: 50, current: 22, unit: '%', trend: 'improving', ownerMinistry: 'MTI', contributingMinistries: ['GovTech', 'PSD'], aiAssessment: 'AgenticGov platform deployment accelerating adoption. Current trajectory reaches 38% by 2031 — need acceleration for 50% target.', onTrack: false },
  { id: 'nk2', name: 'E-Government Services Digitized', category: 'Digital', target2031: 100, current: 89, unit: '%', trend: 'improving', ownerMinistry: 'GovTech', contributingMinistries: ['All'], aiAssessment: 'Strong progress. 11% remaining services are complex multi-agency processes. On track for 2029 completion.', onTrack: true },
  { id: 'nk3', name: 'Education Quality Index', category: 'Human Capital', target2031: 85, current: 74, unit: '/100', trend: 'improving', ownerMinistry: 'MOE', contributingMinistries: ['MOM'], aiAssessment: 'Student Learning Space and STEM Academy contributing positively. KidSTART pilot expected to accelerate improvement from 2027.', onTrack: true },
  { id: 'nk4', name: 'National Workforce Rate (Private Sector)', category: 'Economy', target2031: 10, current: 5.8, unit: '%', trend: 'stable', ownerMinistry: 'MOM', contributingMinistries: ['MOE', 'MTI'], aiAssessment: 'SkillsFuture programme achieving targets in banking/insurance. Other sectors lagging. Post-graduation employment decline signals skills mismatch.', onTrack: false },
  { id: 'nk5', name: 'Carbon Intensity Reduction', category: 'Sustainability', target2031: 30, current: 12, unit: '% reduction', trend: 'improving', ownerMinistry: 'MND', contributingMinistries: ['MOF', 'MTI'], aiAssessment: 'Sustainability Framework procurement gaps may slow progress. Solar procurement overpricing detected by TenderAI. On current trajectory: 22% by 2031.', onTrack: false },
  { id: 'nk6', name: 'Government Transparency Score', category: 'Governance', target2031: 90, current: 78, unit: '/100', trend: 'improving', ownerMinistry: 'PSD', contributingMinistries: ['MOF', 'All'], aiAssessment: 'TransparencyAI driving improvement — auto-generated disclosures raising quality. MOF Q4 gap and 3 ministry deadline risks could stall progress.', onTrack: true },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getWorkStreamsByDivision(divisionId: string): WorkStream[] {
  return WORK_STREAMS.filter(ws => ws.division === divisionId);
}

export function getWorkStreamsByMinistry(ministryShort: string): WorkStream[] {
  return WORK_STREAMS.filter(ws => ws.ministry === ministryShort);
}

export function getDivisionHealth(divisionId: string): { onTrack: number; atRisk: number; delayed: number } {
  const streams = getWorkStreamsByDivision(divisionId);
  return {
    onTrack: streams.filter(ws => ws.status === 'on-track').length,
    atRisk: streams.filter(ws => ws.status === 'at-risk').length,
    delayed: streams.filter(ws => ws.status === 'delayed').length,
  };
}
