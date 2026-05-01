import { type AgentStep } from '../components/AgentStepSimulator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TenderType = 'goods' | 'services' | 'works' | 'consultancy';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface TenderDemo {
  id: string;
  title: string;
  type: TenderType;
  ministry: string;
  sector: string;
  budgetAED: number;
  oecdBenchmarkAED: number;
  riskLevel: RiskLevel;
  daysToComplete: number;
  compliance: { item: string; passed: boolean }[];
  similarTenders: { title: string; budgetAED: number; actualAED: number; overrunPct: number }[];
}

// ---------------------------------------------------------------------------
// Agent Steps
// ---------------------------------------------------------------------------

export const TENDER_AGENT_STEPS: AgentStep[] = [
  { icon: 'analyze', message: 'Analyzing procurement requirements and scope', duration: 1500 },
  { icon: 'search', message: 'Searching Government Procurement Act on Government Procurement', duration: 2000 },
  { icon: 'check', message: 'Running 8-point compliance checklist against federal regulations', duration: 1800 },
  { icon: 'compare', message: 'Benchmarking budget against OECD procurement averages', duration: 1600 },
  { icon: 'search', message: 'Retrieving similar historical tenders from procurement database', duration: 2200 },
  { icon: 'analyze', message: 'Calculating cost overrun risk from historical patterns', duration: 1400 },
  { icon: 'alert', message: 'Flagging risk factors and generating mitigation recommendations', duration: 1200 },
  { icon: 'generate', message: 'Compiling procurement intelligence report', duration: 1500 },
];

// ---------------------------------------------------------------------------
// Demo Tenders — 12 total, 2 per sector
// ---------------------------------------------------------------------------

export const TENDERS: TenderDemo[] = [
  // ---- Education ----
  {
    id: 'edu-goods-01',
    title: 'Tablet & E-Learning Device Procurement for Federal Schools',
    type: 'goods',
    ministry: 'Ministry of Education',
    sector: 'Education',
    budgetAED: 85_000_000,
    oecdBenchmarkAED: 78_000_000,
    riskLevel: 'low',
    daysToComplete: 120,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Warranty & after-sales service terms specified', passed: true },
      { item: 'Data privacy compliance for student devices', passed: true },
      { item: 'Environmental sustainability criteria included', passed: false },
    ],
    similarTenders: [
      { title: 'MOE Laptop Procurement 2024', budgetAED: 72_000_000, actualAED: 74_500_000, overrunPct: 3.5 },
      { title: 'MOE EdTech Tablet Phase 2', budgetAED: 45_000_000, actualAED: 44_200_000, overrunPct: -1.8 },
      { title: 'MOE Smart Classroom Devices', budgetAED: 38_000_000, actualAED: 41_000_000, overrunPct: 7.9 },
      { title: 'MOE Schools Division Devices', budgetAED: 28_000_000, actualAED: 27_600_000, overrunPct: -1.4 },
    ],
  },
  {
    id: 'edu-consult-01',
    title: 'National Curriculum Reform Advisory Services',
    type: 'consultancy',
    ministry: 'Ministry of Education',
    sector: 'Education',
    budgetAED: 22_000_000,
    oecdBenchmarkAED: 18_500_000,
    riskLevel: 'medium',
    daysToComplete: 365,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: false },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Conflict of interest declarations collected', passed: true },
      { item: 'Deliverable milestones and payment schedule defined', passed: true },
      { item: 'Knowledge transfer clause to nationals included', passed: false },
    ],
    similarTenders: [
      { title: 'MOE STEM Curriculum Redesign 2023', budgetAED: 18_000_000, actualAED: 21_500_000, overrunPct: 19.4 },
      { title: 'Singapore Bilingual Education Advisory', budgetAED: 15_000_000, actualAED: 16_200_000, overrunPct: 8.0 },
      { title: 'Qatar Education Reform Consultancy', budgetAED: 25_000_000, actualAED: 28_000_000, overrunPct: 12.0 },
    ],
  },

  // ---- Healthcare ----
  {
    id: 'hc-works-01',
    title: 'Federal Hospital Expansion — Northern Emirates',
    type: 'works',
    ministry: 'Ministry of Health',
    sector: 'Healthcare',
    budgetAED: 480_000_000,
    oecdBenchmarkAED: 420_000_000,
    riskLevel: 'high',
    daysToComplete: 730,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: false },
      { item: 'Environmental impact assessment completed', passed: true },
      { item: 'Construction safety standards (National Fire & Safety Code)', passed: true },
      { item: 'Medical equipment integration plan approved', passed: false },
    ],
    similarTenders: [
      { title: 'Tan Tock Seng Hospital Expansion 2023', budgetAED: 350_000_000, actualAED: 412_000_000, overrunPct: 17.7 },
      { title: 'Khoo Teck Puat Medical Complex Phase 1', budgetAED: 280_000_000, actualAED: 305_000_000, overrunPct: 8.9 },
      { title: 'Sengkang Hospital Renovation', budgetAED: 190_000_000, actualAED: 215_000_000, overrunPct: 13.2 },
      { title: 'Polyclinic Network Expansion (5 sites)', budgetAED: 120_000_000, actualAED: 128_000_000, overrunPct: 6.7 },
    ],
  },
  {
    id: 'hc-goods-01',
    title: 'National Medical Equipment & Diagnostic Devices',
    type: 'goods',
    ministry: 'Ministry of Health',
    sector: 'Healthcare',
    budgetAED: 165_000_000,
    oecdBenchmarkAED: 150_000_000,
    riskLevel: 'medium',
    daysToComplete: 180,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'FDA/CE marking certification required', passed: true },
      { item: 'Maintenance & spare parts availability (5-year guarantee)', passed: true },
      { item: 'Clinical trial data for new equipment provided', passed: false },
    ],
    similarTenders: [
      { title: 'HCI Imaging Equipment 2024', budgetAED: 120_000_000, actualAED: 118_000_000, overrunPct: -1.7 },
      { title: 'National Healthcare Group Laboratory Refresh Refresh', budgetAED: 95_000_000, actualAED: 102_000_000, overrunPct: 7.4 },
      { title: 'MOH Ventilator & ICU Procurement', budgetAED: 55_000_000, actualAED: 54_000_000, overrunPct: -1.8 },
    ],
  },

  // ---- Energy ----
  {
    id: 'en-works-01',
    title: 'Solar Farm Installation — Al Dhafra Phase 3',
    type: 'works',
    ministry: 'Ministry of National Development',
    sector: 'Energy',
    budgetAED: 1_200_000_000,
    oecdBenchmarkAED: 1_050_000_000,
    riskLevel: 'medium',
    daysToComplete: 900,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Environmental impact assessment completed', passed: true },
      { item: 'Grid connection & SP Group/EMA coordination approved', passed: true },
      { item: 'Land acquisition & right-of-way permits secured', passed: false },
    ],
    similarTenders: [
      { title: 'Al Dhafra Solar Phase 2 (2GW)', budgetAED: 980_000_000, actualAED: 1_020_000_000, overrunPct: 4.1 },
      { title: 'Tengeh Solar Farm Phase 5', budgetAED: 1_500_000_000, actualAED: 1_580_000_000, overrunPct: 5.3 },
      { title: 'Noor Singapore Solar Plant', budgetAED: 870_000_000, actualAED: 895_000_000, overrunPct: 2.9 },
      { title: 'Tengeh Solar Tower Tower', budgetAED: 550_000_000, actualAED: 610_000_000, overrunPct: 10.9 },
    ],
  },
  {
    id: 'en-services-01',
    title: 'Smart Grid Monitoring & Analytics Platform',
    type: 'services',
    ministry: 'Ministry of National Development',
    sector: 'Energy',
    budgetAED: 95_000_000,
    oecdBenchmarkAED: 82_000_000,
    riskLevel: 'low',
    daysToComplete: 240,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Cybersecurity compliance (National IA Standard)', passed: true },
      { item: 'Data residency within borders', passed: true },
      { item: 'SLA and uptime guarantees (99.9%) defined', passed: true },
    ],
    similarTenders: [
      { title: 'EMA Grid Analytics Platform', budgetAED: 68_000_000, actualAED: 71_000_000, overrunPct: 4.4 },
      { title: 'EMA Grid Monitoring System', budgetAED: 110_000_000, actualAED: 108_000_000, overrunPct: -1.8 },
      { title: 'SP Group Smart Metering Phase 2', budgetAED: 85_000_000, actualAED: 89_000_000, overrunPct: 4.7 },
    ],
  },

  // ---- Technology ----
  {
    id: 'tech-services-01',
    title: 'Federal AI Platform & Government LLM Deployment',
    type: 'services',
    ministry: 'Ministry of Trade and Industry',
    sector: 'Technology',
    budgetAED: 220_000_000,
    oecdBenchmarkAED: 195_000_000,
    riskLevel: 'high',
    daysToComplete: 365,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: false },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'AI ethics & responsible use framework referenced', passed: false },
      { item: 'Data sovereignty & model hosting withdomestically', passed: true },
      { item: 'Security clearance for classified government data', passed: true },
    ],
    similarTenders: [
      { title: 'GovTech Government Cloud Platform', budgetAED: 180_000_000, actualAED: 210_000_000, overrunPct: 16.7 },
      { title: 'Singapore AI Services Contract', budgetAED: 150_000_000, actualAED: 162_000_000, overrunPct: 8.0 },
      { title: 'Singapore Government Data Platform', budgetAED: 95_000_000, actualAED: 105_000_000, overrunPct: 10.5 },
      { title: 'Saudi GovTech AI National AI Platform', budgetAED: 280_000_000, actualAED: 315_000_000, overrunPct: 12.5 },
    ],
  },
  {
    id: 'tech-goods-01',
    title: 'National Cybersecurity Infrastructure Upgrade',
    type: 'goods',
    ministry: 'GovTech Singapore',
    sector: 'Technology',
    budgetAED: 145_000_000,
    oecdBenchmarkAED: 130_000_000,
    riskLevel: 'medium',
    daysToComplete: 210,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'NESA cybersecurity standards compliance', passed: true },
      { item: 'Supply chain security audit (no banned vendors)', passed: true },
      { item: 'Penetration testing by independent third party', passed: false },
    ],
    similarTenders: [
      { title: 'GovTech Network Security Refresh 2024', budgetAED: 110_000_000, actualAED: 115_000_000, overrunPct: 4.5 },
      { title: 'CBNational Cybersecurity Upgrade', budgetAED: 85_000_000, actualAED: 83_000_000, overrunPct: -2.4 },
      { title: 'MAS Cyber Infrastructure', budgetAED: 65_000_000, actualAED: 68_000_000, overrunPct: 4.6 },
    ],
  },

  // ---- Economy ----
  {
    id: 'econ-consult-01',
    title: 'Economic Diversification Impact Assessment Advisory',
    type: 'consultancy',
    ministry: 'Ministry of Finance',
    sector: 'Economy',
    budgetAED: 35_000_000,
    oecdBenchmarkAED: 28_000_000,
    riskLevel: 'medium',
    daysToComplete: 300,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: false },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Conflict of interest declarations collected', passed: true },
      { item: 'Deliverable milestones and payment schedule defined', passed: true },
      { item: 'Knowledge transfer clause to nationals included', passed: true },
    ],
    similarTenders: [
      { title: 'MOF Fiscal Policy Advisory 2023', budgetAED: 28_000_000, actualAED: 32_000_000, overrunPct: 14.3 },
      { title: 'Singapore Economic Vision Review', budgetAED: 40_000_000, actualAED: 42_000_000, overrunPct: 5.0 },
      { title: 'MTI Economy Strategy Consultancy', budgetAED: 22_000_000, actualAED: 24_500_000, overrunPct: 11.4 },
    ],
  },
  {
    id: 'econ-services-01',
    title: 'SME Digital Marketplace & Trade Facilitation Platform',
    type: 'services',
    ministry: 'Ministry of Finance',
    sector: 'Economy',
    budgetAED: 68_000_000,
    oecdBenchmarkAED: 60_000_000,
    riskLevel: 'low',
    daysToComplete: 210,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Integration with existing government systems specified', passed: true },
      { item: 'User acceptance testing plan included', passed: true },
      { item: 'Accessibility standards (WCAG 2.1 AA) required', passed: true },
    ],
    similarTenders: [
      { title: 'MTI Digital Trade Platform 2024', budgetAED: 52_000_000, actualAED: 54_000_000, overrunPct: 3.8 },
      { title: 'Enterprise Singapore SME Portal', budgetAED: 35_000_000, actualAED: 36_200_000, overrunPct: 3.4 },
      { title: 'GoBusiness SME Digital Marketplace', budgetAED: 48_000_000, actualAED: 47_000_000, overrunPct: -2.1 },
      { title: 'Bahrain SME Digitization Platform', budgetAED: 30_000_000, actualAED: 32_500_000, overrunPct: 8.3 },
    ],
  },

  // ---- Defense ----
  {
    id: 'def-works-01',
    title: 'Border Surveillance Infrastructure Modernization',
    type: 'works',
    ministry: 'Ministry of Interior',
    sector: 'Defense',
    budgetAED: 890_000_000,
    oecdBenchmarkAED: 820_000_000,
    riskLevel: 'high',
    daysToComplete: 540,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: false },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: true },
      { item: 'Security clearance for all contractor personnel', passed: true },
      { item: 'Technology export control compliance verified', passed: true },
      { item: 'Interoperability with existing defense systems', passed: false },
    ],
    similarTenders: [
      { title: 'MHA Border Security Phase 2 (2023)', budgetAED: 720_000_000, actualAED: 795_000_000, overrunPct: 10.4 },
      { title: 'Singapore Police Surveillance Upgrade', budgetAED: 450_000_000, actualAED: 488_000_000, overrunPct: 8.4 },
      { title: 'Oman Border Modernization Program', budgetAED: 650_000_000, actualAED: 710_000_000, overrunPct: 9.2 },
      { title: 'Saudi DSTA Border Systems', budgetAED: 1_100_000_000, actualAED: 1_250_000_000, overrunPct: 13.6 },
    ],
  },
  {
    id: 'def-goods-01',
    title: 'Unmanned Aerial Systems (UAS) Fleet Acquisition',
    type: 'goods',
    ministry: 'Ministry of Defence',
    sector: 'Defense',
    budgetAED: 520_000_000,
    oecdBenchmarkAED: 480_000_000,
    riskLevel: 'high',
    daysToComplete: 450,
    compliance: [
      { item: 'Tender notice published 30+ days before deadline', passed: true },
      { item: 'Minimum 3 qualified bidders requirement met', passed: true },
      { item: 'Technical specifications reviewed by independent body', passed: true },
      { item: 'Budget ceiling approved by Ministry of Finance', passed: true },
      { item: 'National Workforce clause included (ICV score >= 30%)', passed: false },
      { item: 'End-user certificate & export license obtained', passed: true },
      { item: 'Maintenance, repair & overhaul (MRO) plan included', passed: true },
      { item: 'Offset obligation (National Defence Offset) met', passed: false },
    ],
    similarTenders: [
      { title: 'Armed Forces UAS Phase 1', budgetAED: 380_000_000, actualAED: 415_000_000, overrunPct: 9.2 },
      { title: 'ST Engineering Drone Systems Contract', budgetAED: 290_000_000, actualAED: 305_000_000, overrunPct: 5.2 },
      { title: 'Saudi ST Engineering UAS Procurement', budgetAED: 620_000_000, actualAED: 680_000_000, overrunPct: 9.7 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tender Pipeline — proactive monitoring
// ---------------------------------------------------------------------------

export type PipelineStage = 'detected' | 'compliance-check' | 'benchmark' | 'ready' | 'flagged';

export interface TenderPipelineItem {
  id: string;
  title: string;
  ministry: string;
  valueAED: number;
  stage: PipelineStage;
  complianceScore: number; // out of 8
  riskLevel: RiskLevel;
  detectedAt: string;
  agentNote: string;
}

export const TENDER_PIPELINE: TenderPipelineItem[] = [
  {
    id: 'pip-001',
    title: 'Federal Data Center Cooling System Upgrade',
    ministry: 'GovTech Singapore',
    valueAED: 42_000_000,
    stage: 'ready',
    complianceScore: 8,
    riskLevel: 'low',
    detectedAt: '2026-04-28T06:12:00Z',
    agentNote: 'All 8 compliance criteria met. Budget 3% below OECD benchmark. Recommend proceeding to evaluation committee.',
  },
  {
    id: 'pip-002',
    title: 'National Electronic Health Record Interoperability Platform',
    ministry: 'Ministry of Health',
    valueAED: 310_000_000,
    stage: 'flagged',
    complianceScore: 5,
    riskLevel: 'high',
    detectedAt: '2026-04-28T07:45:00Z',
    agentNote: 'FLAGGED: Missing National Workforce clause, no data residency confirmation, vendor lock-in risk detected. Budget 28% above OECD benchmark.',
  },
  {
    id: 'pip-003',
    title: 'Singapore Public Schools HVAC Modernization',
    ministry: 'Ministry of Education',
    valueAED: 178_000_000,
    stage: 'benchmark',
    complianceScore: 7,
    riskLevel: 'medium',
    detectedAt: '2026-04-28T08:30:00Z',
    agentNote: 'Compliance 7/8. Running benchmark against 12 similar HVAC contracts from 2022-2025. Environmental sustainability clause missing.',
  },
  {
    id: 'pip-004',
    title: 'Federal Police Fleet Electrification Program',
    ministry: 'Ministry of Interior',
    valueAED: 520_000_000,
    stage: 'compliance-check',
    complianceScore: 4,
    riskLevel: 'high',
    detectedAt: '2026-04-28T09:15:00Z',
    agentNote: 'Currently verifying export control compliance and offset obligations under Defence Offset Program. 4 of 8 checks complete.',
  },
  {
    id: 'pip-005',
    title: 'Smart Water Metering Infrastructure — Northern Emirates',
    ministry: 'Ministry of National Development',
    valueAED: 95_000_000,
    stage: 'detected',
    complianceScore: 0,
    riskLevel: 'low',
    detectedAt: '2026-04-28T10:02:00Z',
    agentNote: 'New tender detected on Government Procurement Portal. Queued for automated compliance screening.',
  },
  {
    id: 'pip-006',
    title: 'National Tourism Data Analytics Dashboard',
    ministry: 'Ministry of Finance',
    valueAED: 28_000_000,
    stage: 'ready',
    complianceScore: 8,
    riskLevel: 'low',
    detectedAt: '2026-04-27T14:20:00Z',
    agentNote: 'Fully compliant. Budget aligned with OECD average. 3 qualified bidders confirmed. Ready for committee review.',
  },
  {
    id: 'pip-007',
    title: 'Military Communications Satellite Ground Station',
    ministry: 'Ministry of Defence',
    valueAED: 380_000_000,
    stage: 'flagged',
    complianceScore: 5,
    riskLevel: 'high',
    detectedAt: '2026-04-27T16:45:00Z',
    agentNote: 'FLAGGED: Only 2 qualified bidders (minimum 3 required). Technology export control verification pending. Recommend extending bid window.',
  },
];

// ---------------------------------------------------------------------------
// Cross-App Intelligence Outputs
// ---------------------------------------------------------------------------

export type CrossAppStatus = 'sent' | 'acknowledged' | 'acted-on';

export interface CrossAppOutput {
  targetApp: 'fiscal-ai' | 'transparency-ai' | 'gov-bench' | 'policy-ai';
  dataType: string;
  summary: string;
  timestamp: string;
  status: CrossAppStatus;
}

export const CROSS_APP_OUTPUTS: CrossAppOutput[] = [
  {
    targetApp: 'fiscal-ai',
    dataType: 'Cost Benchmark Alert',
    summary: 'Sent $310M health IT tender budget variance data (+28% vs OECD) to FiscalAI for fiscal risk assessment and budget reconciliation.',
    timestamp: '2026-04-28T08:12:00Z',
    status: 'acted-on',
  },
  {
    targetApp: 'transparency-ai',
    dataType: 'Compliance Failure Report',
    summary: 'Forwarded 2 flagged tenders (missing National Workforce clauses, single-bidder risk) to TransparencyAI for anti-corruption audit trail.',
    timestamp: '2026-04-28T09:30:00Z',
    status: 'acknowledged',
  },
  {
    targetApp: 'gov-bench',
    dataType: 'Procurement Efficiency Metrics',
    summary: 'Published Q1 2026 procurement KPIs: 156 tenders processed, avg compliance score 6.8/8, 4.2% avg cost overrun vs 7.1% regional benchmark.',
    timestamp: '2026-04-28T07:00:00Z',
    status: 'sent',
  },
  {
    targetApp: 'fiscal-ai',
    dataType: 'Historical Overrun Analysis',
    summary: 'Sent 5-year overrun trend data for healthcare works contracts (avg +11.6%) to FiscalAI for contingency budget modeling.',
    timestamp: '2026-04-27T16:00:00Z',
    status: 'acted-on',
  },
];

// ---------------------------------------------------------------------------
// Agent Reasoning Trace
// ---------------------------------------------------------------------------

export interface ReasoningStep {
  step: number;
  action: string;
  finding: string;
  sources: string[];
  confidence: number; // 0–1
}

export const REASONING_TRACE: ReasoningStep[] = [
  {
    step: 1,
    action: 'Classify tender type and identify applicable legal framework',
    finding: 'Tender classified as federal goods procurement (above $5M threshold). Primary regulation: Government Procurement Act on Government Procurement, Articles 18-24 (Competitive Bidding). Secondary: Finance Circular Minute 32/2023 on procurement procedures.',
    sources: ['Government Procurement Act', 'Finance Circular Minute 32/2023', 'National Procurement Portal classification'],
    confidence: 0.97,
  },
  {
    step: 2,
    action: 'Determine mandatory compliance criteria for this procurement category',
    finding: 'Identified 8 mandatory compliance criteria: public notice period (Art. 20), minimum bidder count (Art. 22), independent technical review (Art. 25), MOF budget approval (Art. 31), National Workforce/ICV (Art. 38), sector-specific safety standards, environmental assessment, and conflict-of-interest declarations.',
    sources: ['Government Procurement Act §20–38', 'ICV Program Guidelines 2024', 'Federal Procurement Manual Ch. 4'],
    confidence: 0.95,
  },
  {
    step: 3,
    action: 'Execute 8-point compliance checklist against tender documentation',
    finding: 'Compliance check complete: 7/8 criteria passed. FAILED: Environmental sustainability criteria not included in tender specifications — required under Article 35(c) for goods procurement exceeding $50M.',
    sources: ['Tender document analysis', 'Government Procurement Act §35(c)', 'National Public Procurement Policy 2024'],
    confidence: 0.92,
  },
  {
    step: 4,
    action: 'Benchmark budget against OECD procurement cost database and regional comparators',
    finding: 'Tender budget is 9.0% above OECD median for comparable ICT goods procurement. Within acceptable range (< 15% threshold). GCC regional average is 11.3% above OECD, so this tender is below regional norms.',
    sources: ['OECD Government at a Glance 2025', 'GCC Procurement Benchmark Database', 'World Bank Benchmarking Public Procurement 2024'],
    confidence: 0.88,
  },
  {
    step: 5,
    action: 'Retrieve and analyze similar historical tenders for cost overrun patterns',
    finding: 'Analyzed 4 comparable historical tenders. Average cost overrun: +2.1%. Two completed under budget. Pattern: ICT goods procurement in has lower overrun risk than works or consultancy categories (national avg overrun: goods 3.2%, works 9.8%, consultancy 12.1%).',
    sources: ['Federal Procurement Database (2020-2025)', 'MOF Annual Procurement Report 2025', 'Internal historical tender analysis'],
    confidence: 0.91,
  },
  {
    step: 6,
    action: 'Generate risk assessment and actionable recommendations',
    finding: 'Overall risk: LOW. One remediation required: add environmental sustainability criteria per Art. 35(c). Recommendation: (1) Include green procurement clause referencing National Agenda 2030, (2) Add e-waste disposal requirements for replaced equipment, (3) Consider lifecycle cost analysis. Estimated remediation effort: 2-3 business days.',
    sources: ['Risk scoring model v3.2', 'National Agenda 2030', 'Federal Procurement Best Practice Guide'],
    confidence: 0.94,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const TENDER_TYPES: { value: TenderType; label: string }[] = [
  { value: 'goods', label: 'Goods' },
  { value: 'services', label: 'Services' },
  { value: 'works', label: 'Works' },
  { value: 'consultancy', label: 'Consultancy' },
];

export function formatAED(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
}

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'detected', label: 'Detected', color: 'bg-slate-100 text-slate-700' },
  { key: 'compliance-check', label: 'Compliance Check', color: 'bg-blue-100 text-blue-700' },
  { key: 'benchmark', label: 'Benchmarked', color: 'bg-purple-100 text-purple-700' },
  { key: 'ready', label: 'Ready', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'flagged', label: 'Flagged', color: 'bg-red-100 text-red-700' },
];
