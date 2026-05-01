import type { AgentStep } from '../components/AgentStepSimulator';

// ---------------------------------------------------------------------------
// 1. Global Rankings
// ---------------------------------------------------------------------------

export interface GlobalRanking {
  index: string;
  organization: string;
  jurisdictionRank: number;
  jurisdictionScore: number;
  maxScore: number;
  totalCountries: number;
  trend: 'up' | 'stable' | 'down';
  yearUpdated: number;
}

export const GLOBAL_RANKINGS: GlobalRanking[] = [
  {
    index: 'ITU Global Cybersecurity Index',
    organization: 'International Telecommunication Union',
    jurisdictionRank: 1, // Tier 1 "Role-modelling" — ITU GCI 2024 reports tiers, not absolute rank
    jurisdictionScore: 99.86,
    maxScore: 100,
    totalCountries: 194,
    trend: 'stable',
    yearUpdated: 2024,
  },
  {
    index: 'UN E-Government Development Index',
    organization: 'United Nations DESA',
    jurisdictionRank: 3,
    jurisdictionScore: 0.96912,
    maxScore: 1,
    totalCountries: 193,
    trend: 'up',
    yearUpdated: 2024,
  },
  {
    index: 'IMD World Competitiveness Ranking',
    organization: 'Institute for Management Development',
    jurisdictionRank: 1,
    jurisdictionScore: 100,
    maxScore: 100,
    totalCountries: 67,
    trend: 'up',
    yearUpdated: 2024,
  },
  {
    index: 'Government AI Readiness Index',
    organization: 'Oxford Insights',
    jurisdictionRank: 2,
    jurisdictionScore: 81.97, // TODO: verify exact 2024 score from Oxford Insights PDF
    maxScore: 100,
    totalCountries: 188,
    trend: 'up',
    yearUpdated: 2024,
  },
  {
    index: 'World Bank Ease of Doing Business',
    organization: 'World Bank Group (final 2020 edition)',
    jurisdictionRank: 2,
    jurisdictionScore: 86.2,
    maxScore: 100,
    totalCountries: 190,
    trend: 'stable',
    yearUpdated: 2020,
  },
  {
    index: 'Global Innovation Index',
    organization: 'WIPO',
    jurisdictionRank: 4,
    jurisdictionScore: 61.5, // TODO: verify exact GII 2024 composite score
    maxScore: 100,
    totalCountries: 133,
    trend: 'up',
    yearUpdated: 2024,
  },
  {
    index: 'Government Effectiveness (Percentile)',
    organization: 'World Bank WGI',
    jurisdictionRank: 1,
    jurisdictionScore: 100,
    maxScore: 100,
    totalCountries: 214,
    trend: 'stable',
    yearUpdated: 2023,
  },
  {
    index: 'IMD World Digital Competitiveness',
    organization: 'Institute for Management Development',
    jurisdictionRank: 1,
    jurisdictionScore: 100,
    maxScore: 100,
    totalCountries: 67,
    trend: 'up',
    yearUpdated: 2024,
  },
];

// ---------------------------------------------------------------------------
// 2. Peer Benchmarks (6 sectors x 5 peers)
// ---------------------------------------------------------------------------

export interface PeerBenchmark {
  sector: string;
  metric: string;
  jurisdictionValue: number;
  peers: { country: string; value: number; trend: 'up' | 'stable' | 'down' }[];
  unit: string;
  source: string;
}

export const PEER_BENCHMARKS: PeerBenchmark[] = [
  // Education
  {
    sector: 'Education',
    metric: 'PISA Math Score',
    jurisdictionValue: 431,
    peers: [
      { country: 'Singapore', value: 575, trend: 'stable' },
      { country: 'South Korea', value: 527, trend: 'down' },
      { country: 'Estonia', value: 510, trend: 'up' },
      { country: 'Denmark', value: 489, trend: 'stable' },
      { country: 'Finland', value: 484, trend: 'down' },
    ],
    unit: 'score',
    source: 'OECD PISA 2022',
  },
  {
    sector: 'Education',
    metric: 'Tertiary Enrollment Rate',
    jurisdictionValue: 60, // TODO: verify Singapore's gross tertiary enrolment rate (UNESCO shows ~98% in 2022)
    peers: [
      { country: 'Singapore', value: 98, trend: 'stable' },
      { country: 'South Korea', value: 98, trend: 'stable' },
      { country: 'Finland', value: 94, trend: 'stable' },
      { country: 'Denmark', value: 82, trend: 'stable' },
      { country: 'Estonia', value: 74, trend: 'up' },
    ],
    unit: '%',
    source: 'UNESCO Institute for Statistics (latest available, 2022-2023)',
  },
  // Healthcare
  {
    sector: 'Healthcare',
    metric: 'Life Expectancy',
    jurisdictionValue: 83.7, // SingStat 2023 figure
    peers: [
      { country: 'Singapore', value: 83.7, trend: 'up' },
      { country: 'South Korea', value: 83.5, trend: 'up' },
      { country: 'Denmark', value: 81.4, trend: 'stable' },
      { country: 'Finland', value: 81.6, trend: 'stable' },
      { country: 'Estonia', value: 78.8, trend: 'up' },
    ],
    unit: 'years',
    source: 'WHO Global Health Observatory / SingStat 2023',
  },
  {
    sector: 'Healthcare',
    metric: 'UHC Coverage Index',
    jurisdictionValue: 89,
    peers: [
      { country: 'Singapore', value: 89, trend: 'stable' },
      { country: 'South Korea', value: 89, trend: 'stable' },
      { country: 'Denmark', value: 85, trend: 'stable' }, // TODO: verify Denmark UHC SCI 2021
      { country: 'Finland', value: 83, trend: 'stable' }, // TODO: verify Finland UHC SCI 2021
      { country: 'Estonia', value: 79, trend: 'up' }, // TODO: verify Estonia UHC SCI 2021
    ],
    unit: 'index',
    source: 'WHO/World Bank UHC Service Coverage Index 2021',
  },
  // Energy
  {
    sector: 'Energy',
    metric: 'Renewable Energy Share (electricity)',
    jurisdictionValue: 5, // Singapore's electricity-mix share is ~3-5%
    peers: [
      { country: 'Denmark', value: 88, trend: 'up' }, // 88.4% of net electricity 2024
      { country: 'Finland', value: 50, trend: 'up' }, // TODO: verify Finland renewable electricity share
      { country: 'Estonia', value: 38, trend: 'up' }, // TODO: verify Estonia renewable electricity share
      { country: 'South Korea', value: 9, trend: 'up' }, // TODO: verify South Korea renewable electricity share
      { country: 'Singapore', value: 3, trend: 'stable' },
    ],
    unit: '% of electricity',
    source: 'IRENA / IEA / national regulators 2024',
  },
  {
    sector: 'Energy',
    metric: 'Clean Energy Investment',
    jurisdictionValue: 12.0,
    peers: [
      { country: 'South Korea', value: 18.5, trend: 'up' },
      { country: 'Denmark', value: 6.0, trend: 'stable' },
      { country: 'Finland', value: 3.5, trend: 'up' },
      { country: 'Singapore', value: 1.0, trend: 'up' },
      { country: 'Estonia', value: 0.8, trend: 'up' },
    ],
    unit: '$B',
    source: 'IEA World Energy Investment 2025',
  },
  // Technology
  {
    sector: 'Technology',
    metric: 'Digital Competitiveness Score',
    jurisdictionValue: 93.4,
    peers: [
      { country: 'Singapore', value: 96.0, trend: 'stable' },
      { country: 'Denmark', value: 95.3, trend: 'stable' },
      { country: 'Finland', value: 91.1, trend: 'stable' },
      { country: 'South Korea', value: 86.6, trend: 'up' },
      { country: 'Estonia', value: 80.2, trend: 'up' },
    ],
    unit: 'score',
    source: 'IMD World Digital Competitiveness 2025',
  },
  {
    sector: 'Technology',
    metric: 'AI Readiness Score',
    jurisdictionValue: 81.97, // TODO: verify exact Singapore Oxford AI Readiness 2024 score
    peers: [
      { country: 'Singapore', value: 81.97, trend: 'up' }, // TODO: verify
      { country: 'South Korea', value: 79.0, trend: 'up' }, // TODO: verify
      { country: 'Finland', value: 75.0, trend: 'stable' }, // TODO: verify
      { country: 'Denmark', value: 74.0, trend: 'stable' }, // TODO: verify
      { country: 'Estonia', value: 70.0, trend: 'up' }, // TODO: verify
    ],
    unit: 'score',
    source: 'Oxford Insights Government AI Readiness Index 2024',
  },
  // Economy
  {
    sector: 'Economy',
    metric: 'GDP per Capita (PPP)',
    jurisdictionValue: 153, // Singapore 2024 World Bank ~$150,689
    peers: [
      { country: 'Singapore', value: 153, trend: 'up' },
      { country: 'Denmark', value: 86, trend: 'stable' }, // TODO: verify Denmark 2024 PPP exact figure
      { country: 'Finland', value: 65, trend: 'stable' }, // TODO: verify Finland 2024 PPP
      { country: 'South Korea', value: 63, trend: 'up' },
      { country: 'Estonia', value: 49, trend: 'up' }, // TODO: verify Estonia 2024 PPP
    ],
    unit: '$K',
    source: 'IMF WEO October 2024 / World Bank 2024',
  },
  {
    sector: 'Economy',
    metric: 'Trade Openness',
    jurisdictionValue: 202,
    peers: [
      { country: 'Singapore', value: 322, trend: 'stable' },
      { country: 'Estonia', value: 168, trend: 'up' },
      { country: 'Denmark', value: 120, trend: 'stable' },
      { country: 'South Korea', value: 88, trend: 'stable' },
      { country: 'Finland', value: 80, trend: 'stable' },
    ],
    unit: '% GDP',
    source: 'World Bank WDI 2024',
  },
  // Defense
  {
    sector: 'Defense',
    metric: 'Cybersecurity Index',
    jurisdictionValue: 99.86,
    peers: [
      { country: 'Singapore', value: 99.86, trend: 'stable' },
      { country: 'South Korea', value: 98.0, trend: 'stable' }, // TODO: verify exact ITU GCI 2024 score
      { country: 'Estonia', value: 96.0, trend: 'up' }, // TODO: verify exact ITU GCI 2024 score
      { country: 'Denmark', value: 94.0, trend: 'stable' }, // TODO: verify exact ITU GCI 2024 score
      { country: 'Finland', value: 95.0, trend: 'stable' }, // TODO: verify exact ITU GCI 2024 score
    ],
    unit: '/100',
    source: 'ITU Global Cybersecurity Index 2024',
  },
  {
    sector: 'Defense',
    metric: 'Military Spending (% GDP)',
    jurisdictionValue: 2.84,
    peers: [
      { country: 'Singapore', value: 2.84, trend: 'stable' },
      { country: 'South Korea', value: 2.8, trend: 'up' },
      { country: 'Estonia', value: 2.9, trend: 'up' }, // TODO: verify Estonia 2024 SIPRI
      { country: 'Finland', value: 2.4, trend: 'up' },
      { country: 'Denmark', value: 2.4, trend: 'up' }, // TODO: verify Denmark 2024 SIPRI
    ],
    unit: '%',
    source: 'SIPRI Military Expenditure Database 2024',
  },
];

// ---------------------------------------------------------------------------
// 3. Governance Innovations
// ---------------------------------------------------------------------------

export interface NationalInnovation {
  title: string;
  ministry: string;
  description: string;
  year: number;
  impact: string;
  transferability: string;
}

export const NATIONAL_INNOVATIONS: NationalInnovation[] = [
  {
    title: 'Smart Government Initiative',
    ministry: 'Infocomm Media Development Authority (IMDA)',
    description: 'Full transition of government services to mobile-first digital platforms, enabling citizens to complete 100% of federal transactions via smartphone. Includes PASS national digital identity.',
    year: 2013,
    impact: 'Over 7,000 government services digitised. Average transaction time reduced from 20 days to under 5 minutes. Saved $3B+ annually in operational costs.',
    transferability: 'HIGH - Modular architecture allows adoption by governments at any digital maturity level. Key success factor: strong political mandate from leadership.',
  },
  {
    title: 'Ministry of Possibilities',
    ministry: 'Public Service Division (PSD)',
    description: 'Experimental government lab that convenes cross-ministry teams to tackle unconventional policy challenges using design thinking, rapid prototyping, and agile sprints. Operates outside traditional bureaucratic constraints.',
    year: 2019,
    impact: 'Incubated 15+ cross-cutting policy experiments including space governance, government-as-a-platform, and predictive policy analytics. Three initiatives scaled to full national programs.',
    transferability: 'MEDIUM - Requires strong executive sponsorship and willingness to tolerate controlled failure. Cultural readiness for experimentation is the primary barrier.',
  },
  {
    title: 'Long-Range Vision',
    ministry: 'Office of the Prime Minister',
    description: 'Fifty-year national development plan targeting world-leading outcomes in education, economy, social cohesion, and government effectiveness by 2071. The longest-horizon national strategy in the region.',
    year: 2017,
    impact: 'Provides a unifying strategic framework that all ministry strategies must align to. Has driven $300B+ in long-term infrastructure and human capital investments.',
    transferability: 'MEDIUM - Long-horizon planning requires institutional continuity and political stability. Democracies with frequent government turnover may need cross-party consensus mechanisms.',
  },
  {
    title: 'FAHR HR AI Agent',
    ministry: 'Federal Authority for Government Human Resources (FAHR)',
    description: 'AI-powered HR management system deployed across 60+ federal entities, automating recruitment screening, performance evaluation, training recommendations, and workforce planning using predictive analytics.',
    year: 2023,
    impact: 'Reduced average recruitment cycle from 45 days to 12 days. 92% accuracy in matching candidates to roles. Projected $180M annual savings across whole-of-government.',
    transferability: 'HIGH - Cloud-based SaaS model with configurable rules engine. Successfully piloted in 3 GCC countries. Data privacy and localisation requirements are the main adaptation points.',
  },
  {
    title: 'Future Foresight Foundation',
    ministry: 'Public Service Division (PSD)',
    description: 'Systematic government foresight capability that scans global trends, models scenarios, and stress-tests policies against potential futures. Produces annual Global Foresight Report distributed to 50+ governments.',
    year: 2016,
    impact: 'Identified 3 major disruptions 2+ years before impact (autonomous vehicles policy, space economy, generative AI governance). Informed pre-emptive legislation in all three areas.',
    transferability: 'HIGH - Methodology and training programs actively shared via bilateral agreements. 12 countries have adopted the demo jurisdiction foresight methodology framework.',
  },
  {
    title: 'National AI Strategy 2031',
    ministry: 'Ministry of Trade and Industry (MTI)',
    description: 'Comprehensive national AI roadmap targeting 12% GDP contribution from AI by 2031. Includes the world\'s first Minister of State for AI, a national AI ethics framework, and AI-first government operations mandate.',
    year: 2017,
    impact: 'The country ranked #1 in ASEAN and #18 globally for AI Readiness. AI contributes an estimated 4.2% to GDP in 2025. 600+ AI use cases deployed across whole-of-government.',
    transferability: 'HIGH - The governance model (dedicated minister + national strategy + ethics framework) has been replicated in 8+ countries. The framework is well-documented and publicly available.',
  },
];

// ---------------------------------------------------------------------------
// 4. Agent Workflow Steps
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 4. Ranking Change Alerts
// ---------------------------------------------------------------------------

export interface TransferablePolicy {
  country: string;
  policy: string;
  transferability: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
}

export interface RankingAlert {
  index: string;
  previousRank: number;
  currentRank: number;
  direction: 'up' | 'down' | 'stable';
  countriesOvertook: string[];
  countriesOvertakenBy: string[];
  analysis: string;
  transferablePolicies: TransferablePolicy[];
}

export const RANKING_ALERTS: RankingAlert[] = [
  {
    index: 'UN E-Government Development Index — ICT Adoption Sub-Index',
    previousRank: 4,
    currentRank: 6,
    direction: 'down',
    countriesOvertook: [],
    countriesOvertakenBy: ['Estonia', 'South Korea'],
    analysis:
      'The country dropped from #4 to #6 on the ICT Adoption sub-index in the 2024 EGDI update. Estonia (+2) and South Korea (+1) overtook primarily due to stronger open data portals and higher citizen digital engagement metrics. scores remain strong in e-participation but weakened in the "open government data" component where Estonia scored 0.98 vs 0.91.',
    transferablePolicies: [
      {
        country: 'Estonia',
        policy: 'X-Road Interoperability Platform',
        transferability: 'HIGH',
        rationale:
          'Estonia\'s X-Road enables seamless cross-agency data exchange with built-in privacy controls. The country\'s PASS infrastructure is architecturally compatible — integration could be completed within 12 months.',
      },
      {
        country: 'South Korea',
        policy: 'Government 24 Proactive Service Delivery',
        transferability: 'MEDIUM',
        rationale:
          'South Korea\'s proactive notification system identifies citizens eligible for benefits and auto-enrolls them. Requires population registry integration that has but would need policy changes for auto-enrollment.',
      },
      {
        country: 'Estonia',
        policy: 'Open Data Portal with API-First Architecture',
        transferability: 'HIGH',
        rationale:
          'Estonia publishes 95% of non-classified government datasets with machine-readable APIs. currently publishes 72%. GovTech could adopt the Estonian open data maturity model to close the gap within 2 fiscal quarters.',
      },
    ],
  },
  {
    index: 'Global Innovation Index — Innovation Outputs',
    previousRank: 30,
    currentRank: 32,
    direction: 'down',
    countriesOvertook: [],
    countriesOvertakenBy: ['Ireland', 'Luxembourg'],
    analysis:
      'The country slipped 2 positions on Innovation Outputs, primarily due to lower scores on knowledge diffusion and creative goods exports. Ireland and Luxembourg advanced with stronger patent commercialisation rates and higher creative industry revenue per capita.',
    transferablePolicies: [
      {
        country: 'Ireland',
        policy: 'Enterprise Ireland Technology Transfer Programme',
        transferability: 'MEDIUM',
        rationale:
          'Ireland\'s university-to-industry tech transfer pipeline generated 142 spinouts in 2024. has the research base but lacks a formalised commercialisation pathway from universities to market.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 5. Agent Monitoring Summary
// ---------------------------------------------------------------------------

export const GOVBENCH_MONITORING = {
  indicesTracked: 12,
  lastFullScan: 'Today 6:30 AM',
  newDataDetected: 1,
  rankingChanges: 1,
  practicesIdentified: 6,
};

// ---------------------------------------------------------------------------
// 6. Cross-App Outputs
// ---------------------------------------------------------------------------

export interface CrossAppOutput {
  targetApp: string;
  targetAppColor: string;
  dataType: string;
  description: string;
  timestamp: string;
  status: 'sent' | 'pending' | 'acknowledged';
}

export const CROSS_APP_OUTPUTS: CrossAppOutput[] = [
  {
    targetApp: 'PolicyAI',
    targetAppColor: '#6366F1',
    dataType: 'Ranking Alert',
    description: 'ICT Adoption sub-index decline shared for policy impact assessment',
    timestamp: 'Today 7:12 AM',
    status: 'acknowledged',
  },
  {
    targetApp: 'ReadinessMap',
    targetAppColor: '#059669',
    dataType: 'Capability Gap',
    description: 'Open data portal gap flagged for GovTech readiness assessment',
    timestamp: 'Today 7:14 AM',
    status: 'acknowledged',
  },
  {
    targetApp: 'PolicyAI',
    targetAppColor: '#6366F1',
    dataType: 'Innovation Benchmark',
    description: 'Innovation outputs decline sent for economic policy review',
    timestamp: 'Today 7:18 AM',
    status: 'sent',
  },
  {
    targetApp: 'AgendaSetting',
    targetAppColor: '#F59E0B',
    dataType: 'Transferable Practice',
    description: 'X-Road interoperability model recommended for 2027 agenda',
    timestamp: 'Today 7:20 AM',
    status: 'pending',
  },
];

// ---------------------------------------------------------------------------
// 7. Agent Workflow Steps
// ---------------------------------------------------------------------------

export const GOVBENCH_AGENT_STEPS: AgentStep[] = [
  { icon: 'search', message: 'Scanning global governance indices for latest positions', duration: 1200 },
  { icon: 'analyze', message: 'Comparing scores against peer countries', duration: 1500, detail: '5 peer countries across 6 sectors' },
  { icon: 'compare', message: 'Identifying rank changes and trend inflection points', duration: 1100 },
  { icon: 'search', message: 'Retrieving governance innovation case library', duration: 900, detail: '6 flagship programmes assessed' },
  { icon: 'generate', message: 'Generating transferability assessments for best practices', duration: 1400 },
  { icon: 'check', message: 'Cross-referencing with WEF 70-function readiness framework', duration: 1000 },
  { icon: 'send', message: 'Compiling GovBench intelligence briefing', duration: 800, detail: 'Dashboard updated' },
];
