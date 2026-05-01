import type { AgentStep } from '../components/AgentStepSimulator';
import type { WEFFunction, AppId } from './agenticDemo';

// ---------------------------------------------------------------------------
// Ministerial Scorecard
// ---------------------------------------------------------------------------

export interface MinisterialScorecard {
  ministryId: string;
  name: string;
  shortName: string;
  functionsOwned: number[];
  overallReadiness: number;
  highReadyCount: number;
  mediumReadyCount: number;
  emergingCount: number;
  cautionCount: number;
  adoptionProgress: number;
}

// ---------------------------------------------------------------------------
// WEF 70 Government Functions
// ---------------------------------------------------------------------------

const CATEGORIES = [
  'IT & Cybersecurity',
  'Procurement & Finance',
  'Service Delivery',
  'Policy & Planning',
  'Regulatory & Legal',
  'Organization & Workforce',
  'Public Engagement',
] as const;

function tier(potential: number, complexity: number, risk: number): 'HIGH' | 'MEDIUM' | 'EMERGING' | 'CAUTION' {
  const net = potential - complexity;
  if (risk >= 3.5) return 'CAUTION';
  if (net >= 1.2) return 'HIGH';
  if (net >= 0.3) return 'MEDIUM';
  return 'EMERGING';
}

function timeline(t: 'HIGH' | 'MEDIUM' | 'EMERGING' | 'CAUTION'): '0-6mo' | '6-18mo' | '18-36mo' | '36mo+' {
  switch (t) {
    case 'HIGH': return '0-6mo';
    case 'MEDIUM': return '6-18mo';
    case 'EMERGING': return '18-36mo';
    case 'CAUTION': return '36mo+';
  }
}

function jurisdictionAdj(potential: number, complexity: number, risk: number): number {
  // has strong digital infrastructure (+0.3) but strict compliance needs (-0.1)
  const base = potential - complexity * 0.5 - risk * 0.3;
  return Math.round((base + 0.2) * 100) / 100;
}

function buildFn(
  id: number,
  name: string,
  category: string,
  potential: number,
  complexity: number,
  risk: number,
  ministry: string,
  agenticApp: AppId | null,
  description: string,
): WEFFunction {
  const t = tier(potential, complexity, risk);
  return {
    id,
    name,
    category,
    potentialScore: potential,
    complexityScore: complexity,
    riskScore: risk,
    readinessScore: Math.round((potential - complexity) * 100) / 100,
    readinessTier: t,
    jurisdictionAdjustedScore: jurisdictionAdj(potential, complexity, risk),
    ownerMinistry: ministry,
    timeline: timeline(t),
    dependencies: [],
    agenticApp,
    description,
  };
}

export const WEF_FUNCTIONS: WEFFunction[] = [
  // ── IT & Cybersecurity (1-10) ─────────────────────────────────────────
  buildFn(1, 'Cybersecurity monitoring', CATEGORIES[0], 3.50, 2.67, 2.33, 'GovTech', null, 'Continuous monitoring of government networks for threats, intrusions, and anomalies using AI-driven detection.'),
  buildFn(2, 'IT system management', CATEGORIES[0], 3.00, 2.33, 1.67, 'GovTech', null, 'Automated management, patching, and performance optimization of government IT infrastructure.'),
  buildFn(3, 'Network infrastructure optimization', CATEGORIES[0], 2.67, 2.67, 1.67, 'GovTech', null, 'AI-driven optimization of network traffic, bandwidth allocation, and connectivity across government.'),
  buildFn(4, 'Digital identity verification', CATEGORIES[0], 3.33, 2.33, 3.00, 'GovTech', null, 'Biometric and multi-factor authentication for secure access to government digital services.'),
  buildFn(5, 'Data center management', CATEGORIES[0], 3.00, 2.00, 1.33, 'GovTech', null, 'Automated cooling, load balancing, and resource allocation across federal data centers.'),
  buildFn(6, 'Tender preparation', CATEGORIES[1], 3.67, 2.00, 1.67, 'MOF', 'tender-ai', 'AI-assisted drafting, compliance checking, and optimization of government procurement tenders.'),
  buildFn(7, 'Document validation', CATEGORIES[1], 3.33, 2.00, 1.67, 'MOF', 'tender-ai', 'Automated verification of procurement documents, certificates, and compliance records.'),
  buildFn(8, 'Transparency reporting', CATEGORIES[1], 3.33, 1.33, 1.33, 'PSD', 'transparency-ai', 'Automated generation and validation of government transparency and disclosure reports.'),
  buildFn(9, 'Financial monitoring', CATEGORIES[1], 3.33, 2.00, 2.00, 'MOF', 'fiscal-ai', 'Real-time monitoring of budget execution, spending anomalies, and fiscal compliance.'),
  buildFn(10, 'Vendor performance tracking', CATEGORIES[1], 3.00, 1.67, 1.33, 'MOF', 'tender-ai', 'Tracking and scoring vendor delivery performance across government contracts.'),

  // ── Service Delivery (11-20) ──────────────────────────────────────────
  buildFn(11, 'Queue management', CATEGORIES[2], 3.33, 1.67, 1.00, 'GovTech', null, 'AI-optimized scheduling and queue routing for government service centers.'),
  buildFn(12, 'Service complaint handling', CATEGORIES[2], 3.00, 2.00, 1.67, 'MSF', null, 'Automated triage, categorization, and routing of citizen service complaints.'),
  buildFn(13, 'Permit & license processing', CATEGORIES[2], 3.33, 2.33, 2.00, 'MTI', null, 'Automated review and approval workflows for government permits and licenses.'),
  buildFn(14, 'Service quality monitoring', CATEGORIES[2], 3.00, 2.00, 1.33, 'PSD', null, 'Real-time tracking of service delivery KPIs and citizen satisfaction metrics.'),
  buildFn(15, 'Public needs identification', CATEGORIES[3], 3.00, 2.33, 1.67, 'PSD', 'policy-ai', 'AI-driven analysis of citizen needs through surveys, social media, and service data.'),
  buildFn(16, 'Emergency response coordination', CATEGORIES[2], 3.33, 3.00, 3.33, 'NCEMA', null, 'AI-assisted coordination of emergency services, resource deployment, and communication.'),
  buildFn(17, 'Digital service channel optimization', CATEGORIES[2], 3.33, 2.00, 1.33, 'GovTech', 'readiness-map', 'Optimizing digital government service channels based on usage patterns and citizen feedback.'),
  buildFn(18, 'Citizen feedback analysis', CATEGORIES[2], 3.00, 1.67, 1.33, 'PSD', null, 'Natural language processing of citizen feedback across all government touchpoints.'),
  buildFn(19, 'Healthcare service triage', CATEGORIES[2], 3.33, 2.67, 3.67, 'MOH', null, 'AI-assisted patient triage and appointment scheduling in government healthcare facilities.'),
  buildFn(20, 'Education program matching', CATEGORIES[2], 3.00, 2.33, 2.00, 'MOE', null, 'Matching students to appropriate educational programs based on aptitude and needs assessment.'),

  // ── Policy & Planning (21-30) ─────────────────────────────────────────
  buildFn(21, 'Policy impact assessment', CATEGORIES[3], 3.00, 2.67, 2.33, 'PSD', 'policy-ai', 'AI-powered simulation and analysis of potential policy impacts before implementation.'),
  buildFn(22, 'Urban planning optimization', CATEGORIES[3], 2.67, 3.00, 2.33, 'MND', null, 'AI-assisted urban development planning, zoning optimization, and infrastructure siting.'),
  buildFn(23, 'Budget allocation optimization', CATEGORIES[3], 3.00, 2.67, 2.67, 'MOF', 'fiscal-ai', 'Data-driven optimization of federal budget allocation across ministries and programs.'),
  buildFn(24, 'Economic forecasting', CATEGORIES[3], 2.67, 3.00, 2.00, 'MOF', 'fiscal-ai', 'AI-powered macroeconomic forecasting and scenario modeling for policy planning.'),
  buildFn(25, 'Energy demand forecasting', CATEGORIES[3], 3.00, 2.33, 1.67, 'MND', null, 'Predictive modeling of energy consumption patterns and demand forecasting for grid planning.'),
  buildFn(26, 'Environmental monitoring', CATEGORIES[3], 3.00, 2.33, 1.67, 'MOCCAE', null, 'AI-driven monitoring of air quality, water resources, and environmental compliance.'),
  buildFn(27, 'Transport demand modeling', CATEGORIES[3], 2.67, 2.67, 1.67, 'MND', null, 'Predictive modeling of transport demand and infrastructure utilization optimization.'),
  buildFn(28, 'Housing needs assessment', CATEGORIES[3], 2.67, 2.33, 2.00, 'MSF', null, 'Data-driven analysis of housing demand, affordability, and supply gap forecasting.'),
  buildFn(29, 'Policy implementation monitoring', CATEGORIES[3], 3.33, 2.33, 1.67, 'PSD', 'policy-ai', 'Real-time tracking of policy implementation milestones and outcome indicators.'),
  buildFn(30, 'Strategic foresight analysis', CATEGORIES[3], 2.33, 3.00, 2.00, 'PSD', null, 'AI-assisted horizon scanning and strategic foresight for long-term national planning.'),

  // ── Regulatory & Legal (31-40) ────────────────────────────────────────
  buildFn(31, 'Regulatory compliance checking', CATEGORIES[4], 3.33, 2.33, 2.33, 'MoJ', null, 'Automated checking of organizational compliance with federal regulations and standards.'),
  buildFn(32, 'Legal document analysis', CATEGORIES[4], 3.00, 2.33, 2.67, 'MoJ', null, 'AI-powered analysis of legal documents, contracts, and regulatory texts.'),
  buildFn(33, 'Inspection scheduling', CATEGORIES[4], 3.33, 1.67, 1.33, 'MTI', null, 'Risk-based scheduling and optimization of government inspection activities.'),
  buildFn(34, 'Anti-fraud detection', CATEGORIES[4], 3.33, 2.67, 2.67, 'MOF', 'fiscal-ai', 'AI-driven detection of fraudulent claims, transactions, and patterns in government systems.'),
  buildFn(35, 'Standards monitoring', CATEGORIES[4], 3.00, 2.00, 1.67, 'MTI', 'gov-bench', 'Automated monitoring of compliance with national and international standards.'),
  buildFn(36, 'Trade compliance verification', CATEGORIES[4], 3.00, 2.33, 2.33, 'MoE-Trade', null, 'Automated verification of trade documentation and customs compliance.'),
  buildFn(37, 'Intellectual property screening', CATEGORIES[4], 2.67, 2.33, 2.00, 'MoE-Trade', null, 'AI-assisted screening and analysis of intellectual property applications and conflicts.'),
  buildFn(38, 'Consumer protection monitoring', CATEGORIES[4], 3.00, 2.00, 2.00, 'MoE-Trade', null, 'Automated monitoring of market practices and consumer complaint patterns.'),
  buildFn(39, 'Environmental compliance tracking', CATEGORIES[4], 2.67, 2.33, 2.00, 'MOCCAE', null, 'Tracking organizational compliance with environmental regulations and emissions targets.'),
  buildFn(40, 'Immigration document processing', CATEGORIES[4], 3.33, 2.67, 3.33, 'ICA', null, 'Automated processing and verification of immigration applications and supporting documents.'),

  // ── Organization & Workforce (41-55) ──────────────────────────────────
  buildFn(41, 'Procurement workflow automation', CATEGORIES[5], 3.33, 2.00, 1.67, 'MOF', 'tender-ai', 'End-to-end automation of government procurement workflows from request to payment.'),
  buildFn(42, 'Employee performance analytics', CATEGORIES[5], 2.67, 2.33, 2.67, 'MOM', null, 'AI-driven analytics of workforce performance metrics and development recommendations.'),
  buildFn(43, 'Training needs assessment', CATEGORIES[5], 2.67, 2.00, 1.67, 'MOM', null, 'AI analysis of skills gaps and automated recommendation of training programs.'),
  buildFn(44, 'Asset management optimization', CATEGORIES[5], 3.00, 2.33, 1.33, 'MND', null, 'Predictive maintenance and lifecycle optimization of government physical assets.'),
  buildFn(45, 'Meeting scheduling & coordination', CATEGORIES[5], 3.33, 1.33, 1.00, 'PSD', null, 'AI-optimized scheduling across government entities respecting protocols and preferences.'),
  buildFn(46, 'Document management & archiving', CATEGORIES[5], 3.00, 1.67, 1.33, 'NA', null, 'Automated classification, indexing, and archival of government documents.'),
  buildFn(47, 'Correspondence drafting', CATEGORIES[5], 3.33, 1.67, 2.00, 'MFA', 'transparency-ai', 'AI-assisted drafting of official government correspondence and communications.'),
  buildFn(48, 'Translation services', CATEGORIES[5], 3.67, 1.33, 1.33, 'NA', null, 'AI translation of government documents and communications between Arabic and English.'),
  buildFn(49, 'Knowledge management', CATEGORIES[5], 2.67, 2.33, 1.67, 'MTI', null, 'AI-driven organization and retrieval of institutional knowledge across government.'),
  buildFn(50, 'Workforce planning', CATEGORIES[5], 2.67, 2.67, 2.33, 'MOM', null, 'Predictive modeling of workforce needs, National Workforce targets, and succession planning.'),
  buildFn(51, 'Facilities management', CATEGORIES[5], 3.00, 1.67, 1.00, 'MND', null, 'AI-optimized management of government facilities including energy and space utilization.'),
  buildFn(52, 'Internal audit support', CATEGORIES[5], 3.00, 2.33, 2.33, 'MOF', null, 'AI-assisted internal audit planning, sampling, and anomaly detection.'),
  buildFn(53, 'Budget execution tracking', CATEGORIES[5], 3.33, 2.00, 1.67, 'MOF', 'fiscal-ai', 'Real-time tracking of budget commitments, disbursements, and variance analysis.'),
  buildFn(54, 'Project portfolio management', CATEGORIES[5], 2.67, 2.33, 1.67, 'PSD', null, 'AI-driven portfolio optimization and resource allocation across government projects.'),
  buildFn(55, 'Program evaluation design', CATEGORIES[5], 2.67, 2.67, 2.00, 'MSF', 'causalis', 'AI-assisted design of impact evaluations for government programs and initiatives.'),

  // ── Public Engagement (56-70) ─────────────────────────────────────────
  buildFn(56, 'Social media monitoring', CATEGORIES[6], 3.33, 2.00, 2.33, 'GCMO', null, 'AI-driven monitoring and analysis of public sentiment across social media platforms.'),
  buildFn(57, 'Public consultation analysis', CATEGORIES[6], 3.00, 2.00, 1.67, 'PSD', null, 'NLP analysis of public consultation submissions for policy-relevant themes and sentiment.'),
  buildFn(58, 'Crisis communication', CATEGORIES[6], 3.00, 2.33, 3.00, 'GCMO', null, 'AI-assisted rapid drafting and dissemination of crisis communication across channels.'),
  buildFn(59, 'Chatbot citizen services', CATEGORIES[6], 3.67, 1.67, 1.67, 'GovTech', null, 'AI chatbots providing 24/7 citizen service support across government domains.'),
  buildFn(60, 'Content personalization', CATEGORIES[6], 3.00, 2.00, 2.33, 'GCMO', null, 'Personalized government communication and service recommendations based on citizen profiles.'),
  buildFn(61, 'Event management coordination', CATEGORIES[6], 2.67, 1.67, 1.00, 'GCMO', null, 'AI-optimized planning and logistics for government events and public gatherings.'),
  buildFn(62, 'Media analysis & briefing', CATEGORIES[6], 3.00, 2.00, 2.00, 'GCMO', null, 'Automated media monitoring, analysis, and briefing preparation for government leaders.'),
  buildFn(63, 'Community engagement mapping', CATEGORIES[6], 2.67, 2.33, 1.67, 'MSF', null, 'AI-driven mapping of community networks and stakeholder engagement opportunities.'),
  buildFn(64, 'Petition processing', CATEGORIES[6], 3.00, 2.00, 2.00, 'PSD', null, 'Automated processing, categorization, and routing of citizen petitions.'),
  buildFn(65, 'Public awareness campaign optimization', CATEGORIES[6], 3.00, 2.00, 1.67, 'GCMO', null, 'AI-optimized targeting and messaging for government awareness campaigns.'),
  buildFn(66, 'Volunteer coordination', CATEGORIES[6], 2.33, 1.67, 1.00, 'MSF', null, 'AI-assisted matching and scheduling of volunteers for government community programs.'),
  buildFn(67, 'Accessibility compliance', CATEGORIES[6], 2.67, 2.00, 1.67, 'GovTech', null, 'Automated monitoring and improvement of digital accessibility across government services.'),
  buildFn(68, 'Impact reporting to citizens', CATEGORIES[6], 3.00, 2.00, 1.67, 'PSD', 'causalis', 'Automated generation of citizen-facing impact reports on government programs.'),
  buildFn(69, 'Open data management', CATEGORIES[6], 2.67, 2.00, 1.67, 'GovTech', null, 'AI-assisted curation, quality assurance, and cataloging of government open data sets.'),
  buildFn(70, 'Multilingual service support', CATEGORIES[6], 3.33, 1.67, 1.33, 'GovTech', null, 'AI-powered multilingual support for government services in Arabic, English, and other languages.'),
];

// ---------------------------------------------------------------------------
// Tier Counts (derived)
// ---------------------------------------------------------------------------

export const TIER_COUNTS = {
  HIGH: WEF_FUNCTIONS.filter(f => f.readinessTier === 'HIGH').length,
  MEDIUM: WEF_FUNCTIONS.filter(f => f.readinessTier === 'MEDIUM').length,
  EMERGING: WEF_FUNCTIONS.filter(f => f.readinessTier === 'EMERGING').length,
  CAUTION: WEF_FUNCTIONS.filter(f => f.readinessTier === 'CAUTION').length,
};

// ---------------------------------------------------------------------------
// Ministerial Scorecards
// ---------------------------------------------------------------------------

function buildScorecard(
  ministryId: string,
  name: string,
  shortName: string,
  functionIds: number[],
  adoptionProgress: number,
): MinisterialScorecard {
  const owned = WEF_FUNCTIONS.filter(f => functionIds.includes(f.id));
  const high = owned.filter(f => f.readinessTier === 'HIGH').length;
  const medium = owned.filter(f => f.readinessTier === 'MEDIUM').length;
  const emerging = owned.filter(f => f.readinessTier === 'EMERGING').length;
  const caution = owned.filter(f => f.readinessTier === 'CAUTION').length;
  const overall = owned.length > 0
    ? Math.round((high * 100 + medium * 65 + emerging * 35 + caution * 10) / owned.length)
    : 0;
  return {
    ministryId,
    name,
    shortName,
    functionsOwned: functionIds,
    overallReadiness: overall,
    highReadyCount: high,
    mediumReadyCount: medium,
    emergingCount: emerging,
    cautionCount: caution,
    adoptionProgress,
  };
}

export const MINISTERIAL_SCORECARDS: MinisterialScorecard[] = [
  buildScorecard('mof', 'Ministry of Finance', 'MOF', [6, 7, 9, 10, 23, 34, 41, 52, 53], 78),
  buildScorecard('govtech', 'GovTech Singapore', 'GovTech', [1, 2, 3, 4, 5, 17, 59, 67, 69, 70], 82),
  buildScorecard('psd', 'Public Service Division', 'PSD', [8, 14, 15, 18, 29, 30, 45, 54, 57, 64], 71),
  buildScorecard('mti', 'Ministry of Trade and Industry', 'MTI', [13, 33, 35, 49], 65),
  buildScorecard('moe', 'Ministry of Education', 'MOE', [20], 58),
  buildScorecard('moh', 'Ministry of Health', 'MOH', [19], 42),
  buildScorecard('mnd', 'Ministry of National Development', 'MND', [22, 25, 27, 44, 51], 61),
  buildScorecard('mom', 'Ministry of Manpower', 'MOM', [42, 43, 50], 55),
  buildScorecard('msf', 'Ministry of Social and Family Development', 'MSF', [12, 28, 55, 63, 66], 48),
  buildScorecard('gcmo', 'Government Communications & Media Office', 'GCMO', [56, 58, 60, 61, 62, 65], 63),
];

// ---------------------------------------------------------------------------
// Agent Steps for Readiness Assessment
// ---------------------------------------------------------------------------

export const READINESS_AGENT_STEPS: AgentStep[] = [
  { icon: 'search', message: 'Scanning 70 WEF government functions against capabilities', duration: 2200 },
  { icon: 'analyze', message: 'Computing potential, complexity, and risk scores per function', duration: 1800 },
  { icon: 'compare', message: 'Cross-referencing with National Digital Government Strategy 2026', duration: 1500 },
  { icon: 'check', message: 'Identifying AgenticGov app coverage for high-readiness functions', duration: 1200 },
  { icon: 'generate', message: 'Generating ministerial scorecards and adoption metrics', duration: 2000 },
  { icon: 'send', message: 'Compiling readiness map with deployment timelines', duration: 1000, detail: '70 functions assessed, 11 ministries scored' },
];

// ---------------------------------------------------------------------------
// Tier color utilities
// ---------------------------------------------------------------------------

export const TIER_COLORS: Record<string, string> = {
  HIGH: '#10b981',     // emerald-500
  MEDIUM: '#f59e0b',   // amber-500
  EMERGING: '#3b82f6', // blue-500
  CAUTION: '#ef4444',  // red-500
};

export const TIER_BG_CLASSES: Record<string, string> = {
  HIGH: 'bg-emerald-100 text-emerald-800',
  MEDIUM: 'bg-amber-100 text-amber-800',
  EMERGING: 'bg-blue-100 text-blue-800',
  CAUTION: 'bg-red-100 text-red-800',
};

// ---------------------------------------------------------------------------
// Dependency Chains
// ---------------------------------------------------------------------------

export interface DependencyChain {
  blockingFunction: number;
  blockedFunctions: number[];
  impact: string;
  suggestedIntervention: string;
  estimatedTimeline: string;
  ownerMinistry: string;
}

export const DEPENDENCY_CHAINS: DependencyChain[] = [
  {
    blockingFunction: 35,
    blockedFunctions: [8, 20, 47],
    impact: 'Function #35 (Standards Monitoring) blocks 3 transparency functions from reaching HIGH readiness',
    suggestedIntervention: 'Deploy standardized service quality measurement across 5 priority ministries',
    estimatedTimeline: '4 months',
    ownerMinistry: 'MTI',
  },
  {
    blockingFunction: 4,
    blockedFunctions: [13, 40, 59],
    impact: 'Function #4 (Digital Identity Verification) blocks 3 citizen-facing functions due to CAUTION-tier risk',
    suggestedIntervention: 'Complete biometric authentication pilot with GovTech and scale to federal ID gateway',
    estimatedTimeline: '6 months',
    ownerMinistry: 'GovTech',
  },
  {
    blockingFunction: 23,
    blockedFunctions: [9, 34, 53],
    impact: 'Function #23 (Budget Allocation) at MEDIUM blocks real-time fiscal functions from full automation',
    suggestedIntervention: 'Integrate FiscalAI optimization engine with MOF IFMIS for live allocation feeds',
    estimatedTimeline: '5 months',
    ownerMinistry: 'MOF',
  },
  {
    blockingFunction: 50,
    blockedFunctions: [42, 43],
    impact: 'Function #50 (Workforce Planning) at EMERGING blocks performance analytics and training needs assessment',
    suggestedIntervention: 'Complete National Workforce workforce model and integrate MOM skills taxonomy',
    estimatedTimeline: '8 months',
    ownerMinistry: 'MOM',
  },
];

// ---------------------------------------------------------------------------
// Readiness Pulse (weekly agent scan results)
// ---------------------------------------------------------------------------

export interface ReadinessPulse {
  lastScan: string;
  improved: number;
  declined: number;
  stable: number;
  recentChanges: { functionId: number; name: string; from: string; to: string; cause: string }[];
}

export const READINESS_PULSE: ReadinessPulse = {
  lastScan: 'Monday 7:00 AM',
  improved: 12,
  declined: 3,
  stable: 55,
  recentChanges: [
    { functionId: 6, name: 'Tender Preparation', from: 'MEDIUM', to: 'HIGH', cause: 'TenderAI deployment achieving 92% compliance rate' },
    { functionId: 9, name: 'Financial Monitoring', from: 'MEDIUM', to: 'HIGH', cause: 'FiscalAI anomaly detection active across 11 ministries' },
    { functionId: 21, name: 'Policy Impact Assessment', from: 'EMERGING', to: 'MEDIUM', cause: 'GovBench sustainability metrics integration' },
    { functionId: 48, name: 'Translation Services', from: 'HIGH', to: 'HIGH', cause: 'Maintained 99.2% accuracy across Arabic-English pair' },
    { functionId: 19, name: 'Healthcare Service Triage', from: 'CAUTION', to: 'CAUTION', cause: 'Risk assessment still pending MOH clinical validation' },
    { functionId: 40, name: 'Immigration Document Processing', from: 'EMERGING', to: 'CAUTION', cause: 'New biometric verification requirement increased complexity score' },
    { functionId: 22, name: 'Urban Planning Optimization', from: 'EMERGING', to: 'EMERGING', cause: 'MND data integration delayed by 2 weeks' },
  ],
};

// ---------------------------------------------------------------------------
// Next-Best-Action per Ministry
// ---------------------------------------------------------------------------

export interface NextBestAction {
  ministry: string;
  ministryId: string;
  functionId: number;
  functionName: string;
  currentTier: string;
  targetTier: string;
  action: string;
  estimatedImpact: string;
  dependsOn?: string;
}

export const NEXT_BEST_ACTIONS: NextBestAction[] = [
  {
    ministry: 'Ministry of Finance',
    ministryId: 'mof',
    functionId: 34,
    functionName: 'Anti-fraud Detection',
    currentTier: 'EMERGING',
    targetTier: 'MEDIUM',
    action: 'Activate FiscalAI pattern detection module on historical procurement data (18 months of transaction logs)',
    estimatedImpact: 'Estimated $45M in fraud prevention annually across 9 functions',
    dependsOn: 'Budget Allocation Optimization (#23) reaching MEDIUM tier',
  },
  {
    ministry: 'GovTech Singapore',
    ministryId: 'govtech',
    functionId: 4,
    functionName: 'Digital Identity Verification',
    currentTier: 'CAUTION',
    targetTier: 'MEDIUM',
    action: 'Complete Phase 2 biometric pilot with 3 ministry service centers, then extend to federal ID gateway',
    estimatedImpact: 'Unblocks 3 dependent functions (#13, #40, #59) from advancing past EMERGING',
  },
  {
    ministry: 'Public Service Division',
    ministryId: 'psd',
    functionId: 29,
    functionName: 'Policy Implementation Monitoring',
    currentTier: 'MEDIUM',
    targetTier: 'HIGH',
    action: 'Connect PolicyAI real-time tracking dashboard to PMO Decision Tracking System',
    estimatedImpact: 'Reduces policy implementation reporting lag from 14 days to real-time',
  },
  {
    ministry: 'Ministry of Trade and Industry',
    ministryId: 'mti',
    functionId: 33,
    functionName: 'Inspection Scheduling',
    currentTier: 'HIGH',
    targetTier: 'HIGH',
    action: 'Scale risk-based scheduling algorithm from pilot (Singapore) to all 7 regions',
    estimatedImpact: '40% reduction in inspection backlog, 25% improvement in violation detection rate',
  },
  {
    ministry: 'Ministry of Manpower',
    ministryId: 'mom',
    functionId: 50,
    functionName: 'Workforce Planning',
    currentTier: 'EMERGING',
    targetTier: 'MEDIUM',
    action: 'Deploy National Workforce workforce model with MOM skills taxonomy and private sector demand signals',
    estimatedImpact: 'Enables predictive National Workforce gap analysis and unblocks 2 dependent functions (#42, #43)',
    dependsOn: 'Completion of national skills taxonomy v2.0',
  },
  {
    ministry: 'Government Communications & Media Office',
    ministryId: 'gcmo',
    functionId: 58,
    functionName: 'Crisis Communication',
    currentTier: 'CAUTION',
    targetTier: 'EMERGING',
    action: 'Establish AI-assisted drafting protocol with mandatory human review gate for crisis messages',
    estimatedImpact: 'Reduces crisis response drafting time from 4 hours to 25 minutes while maintaining editorial control',
  },
];

// ---------------------------------------------------------------------------
// Wave Deployment Plan
// ---------------------------------------------------------------------------

export interface DeploymentWave {
  wave: number;
  label: string;
  timeline: string;
  functions: { id: number; name: string; tier: string }[];
  status: 'complete' | 'in-progress' | 'planned';
  progress?: number;
}

const wefById = (id: number) => WEF_FUNCTIONS.find(f => f.id === id)!;

export const DEPLOYMENT_WAVES: DeploymentWave[] = [
  {
    wave: 1,
    label: 'Quick Wins',
    timeline: '0-6 months',
    status: 'in-progress',
    progress: 62,
    functions: [
      { id: 6, name: wefById(6).name, tier: 'HIGH' },
      { id: 8, name: wefById(8).name, tier: 'HIGH' },
      { id: 11, name: wefById(11).name, tier: 'HIGH' },
      { id: 33, name: wefById(33).name, tier: 'HIGH' },
      { id: 45, name: wefById(45).name, tier: 'HIGH' },
      { id: 48, name: wefById(48).name, tier: 'HIGH' },
    ],
  },
  {
    wave: 2,
    label: 'Core Capabilities',
    timeline: '6-18 months',
    status: 'planned',
    functions: [
      { id: 7, name: wefById(7).name, tier: 'MEDIUM' },
      { id: 9, name: wefById(9).name, tier: 'MEDIUM' },
      { id: 10, name: wefById(10).name, tier: 'MEDIUM' },
      { id: 14, name: wefById(14).name, tier: 'MEDIUM' },
      { id: 17, name: wefById(17).name, tier: 'MEDIUM' },
      { id: 29, name: wefById(29).name, tier: 'MEDIUM' },
      { id: 31, name: wefById(31).name, tier: 'MEDIUM' },
      { id: 41, name: wefById(41).name, tier: 'MEDIUM' },
      { id: 46, name: wefById(46).name, tier: 'MEDIUM' },
      { id: 53, name: wefById(53).name, tier: 'MEDIUM' },
    ],
  },
  {
    wave: 3,
    label: 'Advanced & Emerging',
    timeline: '18-36 months',
    status: 'planned',
    functions: [
      { id: 21, name: wefById(21).name, tier: 'EMERGING' },
      { id: 22, name: wefById(22).name, tier: 'EMERGING' },
      { id: 24, name: wefById(24).name, tier: 'EMERGING' },
      { id: 30, name: wefById(30).name, tier: 'EMERGING' },
      { id: 34, name: wefById(34).name, tier: 'EMERGING' },
      { id: 37, name: wefById(37).name, tier: 'EMERGING' },
      { id: 42, name: wefById(42).name, tier: 'EMERGING' },
      { id: 50, name: wefById(50).name, tier: 'EMERGING' },
      { id: 55, name: wefById(55).name, tier: 'EMERGING' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ministerial Trend Data (static sparkline data, 6 points per ministry)
// ---------------------------------------------------------------------------

// 6-month trends — varied: some rising, some flat, some oscillating, some declining.
// Reflects realistic ministry-level capability evolution; not everything trends up.
export const MINISTERIAL_TRENDS: Record<string, number[]> = {
  mof:   [73, 76, 78, 75, 77, 78],   // plateaued at high
  govtech:  [72, 76, 79, 80, 81, 82],   // steady climb (digital infra well-funded)
  psd:  [68, 70, 71, 69, 70, 71],   // basically flat
  mti: [62, 64, 67, 65, 66, 65],   // wobbled
  moe:   [54, 55, 53, 56, 58, 58],   // dipped then recovered
  moh:  [52, 50, 48, 46, 44, 42],   // declining (data-quality issues)
  mnd:  [55, 58, 60, 61, 60, 61],   // climb then flat
  mom: [48, 51, 54, 53, 54, 55],   // slow climb
  msf:  [38, 41, 45, 47, 48, 48],   // consistent climb, plateau
  gcmo:  [70, 66, 60, 58, 61, 63],   // sharp dip mid-cycle, recovering
};
