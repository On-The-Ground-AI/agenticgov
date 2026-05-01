// ---------------------------------------------------------------------------
// Jurisdiction reference table — seven government systems mapped to the WEF
// Readiness Framework's pillars and AgenticGov's six demo apps.
//
// All jurisdictions sit at the same level. There is no "primary" or
// "secondary" reference. The demo data files use Singapore agencies in
// places only because the demo needs ONE worked example concrete enough to
// click through; the architecture itself is jurisdiction-neutral, and every
// popup pulls from this table to surface equivalents in all seven systems.
// ---------------------------------------------------------------------------

export type JurisdictionCode = 'CN' | 'IN' | 'JP' | 'PK' | 'SG' | 'AE' | 'US';

export interface Jurisdiction {
  code: JurisdictionCode;
  name: string;
  shortName: string;
  flag: string;

  // The five WEF Readiness Framework pillars
  pillars: {
    foresight: string;       // 01 Strategic Foresight & Agenda Setting
    policyDesign: string;    // 02 Policy Design & Analysis
    serviceDelivery: string; // 03 Service Delivery & Operations
    oversight: string;       // 04 Monitoring, Evaluation & Transparency
    coordination: string;    // 05 Cross-Government Coordination
  };

  // AgenticGov's six demo apps mapped to local equivalents
  apps: {
    missionControl: string;
    tender: string;
    fiscal: string;
    readiness: string;
    bench: string;
    transparency: string;
  };

  // Flagship platforms / programmes a jurisdiction's officials will recognise
  platforms: {
    digitalIdentity: string;
    citizenPortal: string;
    aiStrategy: string;
    workforce: string;
    earlyChildhood: string;
    smartCity: string;
  };
}

// Listed alphabetically by country name to avoid implying any hierarchy.
// (China, India, Japan, Pakistan, Singapore, UAE, US.)
export const JURISDICTIONS: Record<JurisdictionCode, Jurisdiction> = {
  CN: {
    code: 'CN',
    name: 'China',
    shortName: 'CN',
    flag: '🇨🇳',
    pillars: {
      foresight:
        'Development Research Center of the State Council (DRC) · CASS · CICIR · NDRC Strategy Bureau · Tsinghua and Peking university think tanks',
      policyDesign:
        'State Council · NDRC · Central Committee Policy Research Office · Central Financial and Economic Affairs Commission · provincial policy research offices',
      serviceDelivery:
        'National Government Service Platform 国务院客户端 · provincial super-apps (Zhejiang "Like One Thing" 浙里办, Guangdong "Yueshengshi" 粤省事, Shanghai "Suishenban" 随申办) · 12345 hotlines · Resident Service centres 政务服务中心',
      oversight:
        'National Audit Office (NAO 审计署) · National Supervisory Commission (NSC 国家监委) · CCP Central Commission for Discipline Inspection · State Council Information Office',
      coordination:
        'General Office of the State Council · Cyberspace Administration of China (CAC 网信办) · MIIT 工信部 · National Data Bureau 国家数据局 (2023→)',
    },
    apps: {
      missionControl: 'State Council General Office · Central Committee · NDRC',
      tender: 'China Government Procurement Network (中国政府采购网) · MoF Procurement Office · provincial procurement centres',
      fiscal: 'Ministry of Finance (财政部) · State Taxation Administration · NAO · Bureau of Customs',
      readiness: 'CAC · MIIT · National Data Bureau · National AI Industry Innovation Plan office',
      bench: 'National Bureau of Statistics (NBS 国家统计局) · CAICT 中国信通院 · Development Research Center DRC',
      transparency: 'NAO 审计署 · NSC 国家监委 · State Council Information Office · Open Government Information regulations (2008→)',
    },
    platforms: {
      digitalIdentity: 'Resident ID 居民身份证 + Alipay/WeChat unified credentials · Network ID 网络身份证 trial (2024→) · Health Code legacy infrastructure',
      citizenPortal: 'National Government Service Platform · 12345 hotlines · provincial super-apps 浙里办 / 粤省事 / 随申办 / 渝快办',
      aiStrategy: 'New Generation AI Development Plan (2017→) · MIIT AI roadmap · CAC AI generated content rules (2023) · Beijing AI Industry Plan · Shanghai AI Pilot Zone',
      workforce: 'Ministry of Human Resources & Social Security (人社部) · 1+X vocational scheme · Made in China 2025 talent plan',
      earlyChildhood: 'Three-Year Action Plan for Preschool Education · MOE Department of Basic Education · Three-Child Policy supportive measures (2021→)',
      smartCity: 'New-Type Smart Cities programme · Xiong\'an New Area · Hangzhou City Brain · Shenzhen Digital City · Beijing City Sub-Centre',
    },
  },

  IN: {
    code: 'IN',
    name: 'India',
    shortName: 'IN',
    flag: '🇮🇳',
    pillars: {
      foresight:
        'NITI Aayog · PMO · Office of the Principal Scientific Adviser · National Council of Applied Economic Research (NCAER) · Centre for Policy Research (CPR) · IDFC Institute',
      policyDesign:
        'NITI Aayog · ministry policy units · Indian Institute of Public Administration (IIPA) · Centre for the Study of Developing Societies (CSDS) · Pahle India Foundation · ORF · Takshashila',
      serviceDelivery:
        'India Stack (Aadhaar, UPI, DigiLocker, eSign, Account Aggregator) · MeitY · Digital India Corporation · CSC e-Governance · State Resident Data Hubs (SRDH) · UMANG · MyGov',
      oversight:
        'Comptroller & Auditor General of India (CAG) · Public Accounts Committee · Central Vigilance Commission (CVC) · Central Information Commission (CIC) · Lokpal · National Statistical Commission',
      coordination:
        'PMO · Cabinet Secretariat · e-Office · National Informatics Centre (NIC) · Department of Administrative Reforms & Public Grievances (DARPG) · Capacity Building Commission',
    },
    apps: {
      missionControl: 'PMO · Cabinet Secretariat · NITI Aayog · National Security Council Secretariat',
      tender: 'GeM (Government e-Marketplace) · CPP Portal · MSME Sambandh portal · DGS&D legacy systems',
      fiscal: 'Ministry of Finance · CGA (Controller General of Accounts) · PFMS · IFMS · Public Debt Management Cell',
      readiness: 'IndiaAI Mission · MeitY · Digital India Corporation · NeGD · Bhashini',
      bench: 'NITI Aayog dashboards · Ministry of Statistics & Programme Implementation (MoSPI) · NSO · CSO · NSSO',
      transparency: 'CAG · CVC · CIC · MyGov · Pragati portal · Open Government Data platform (data.gov.in)',
    },
    platforms: {
      digitalIdentity: 'Aadhaar (UIDAI) · DigiLocker · eSign · CKYC · UMANG · ABHA (health ID) · APAAR (academic)',
      citizenPortal: 'UMANG · MyGov · CSC · Jan Aushadhi Sugam · Pragati · CoWIN · Bhuvan',
      aiStrategy: 'IndiaAI Mission · NITI Aayog "AI for All" · MeitY Responsible AI guidelines · BharatGen · Bhashini · INDIAai.gov.in',
      workforce: 'Skill India · NSDC · PMKVY · Sankalp · MSDE · Apprenticeship Promotion Scheme · NCVET',
      earlyChildhood: 'ICDS · POSHAN Abhiyaan · Anganwadi (1.4M centres) · NEP 2020 ECCE strand · Saksham Anganwadi · Mission Vatsalya',
      smartCity: '100 Smart Cities Mission · AMRUT · Atal Mission · GIFT City · Aspirational Districts Programme · NIUA',
    },
  },

  JP: {
    code: 'JP',
    name: 'Japan',
    shortName: 'JP',
    flag: '🇯🇵',
    pillars: {
      foresight:
        'Cabinet Office (内閣府) · Council for Science, Technology and Innovation (CSTI 総合科学技術・イノベーション会議) · NIRA · MEXT · MITI / METI Future Strategy Office',
      policyDesign:
        'Cabinet Secretariat (内閣官房) · MIC 総務省 · Council on Economic and Fiscal Policy (CEFP 経済財政諮問会議) · Industrial Structure Council · Regulatory Reform Council',
      serviceDelivery:
        'Digital Agency (デジタル庁, est. 2021) · e-Gov · Mynaportal · J-LIS · municipal one-stop offices · 24/7 disaster broadcasting via J-Alert',
      oversight:
        'Board of Audit (会計検査院) · Diet Public Accounts Committee · Cabinet Personnel Bureau · Administrative Evaluation Bureau (MIC)',
      coordination:
        'Cabinet Secretariat · Cabinet Office · Digital Agency · Council for the Promotion of Regulatory Reform · Society 5.0 Council',
    },
    apps: {
      missionControl: 'PMO 官邸 · Cabinet Secretariat 内閣官房 · Cabinet Office 内閣府',
      tender: 'Cabinet Office Public Procurement · MOF Procurement Division · MLIT for public works · National Public Procurement Service Centre',
      fiscal: 'Ministry of Finance (財務省) · Board of Audit · Bank of Japan (monetary side) · Tax Agency (国税庁)',
      readiness: 'Digital Agency · CSTI · AI Strategic Council 内閣府AI戦略会議 · METI AI Promotion Group',
      bench: 'Statistics Bureau (総務省統計局) · Cabinet Office Statistics · METI · BoJ data',
      transparency: 'Board of Audit · MIC Administrative Evaluation Bureau · Information Disclosure Law mechanisms · Cabinet Personnel Bureau',
    },
    platforms: {
      digitalIdentity: 'My Number Card (マイナンバーカード) · Mynaportal · J-LIS · Health Insurance Card integration',
      citizenPortal: 'e-Gov · Mynaportal · Pia City municipal portals · gBizID for businesses',
      aiStrategy: 'AI Strategy 2024 · Hiroshima AI Process · Cabinet Office AI Strategic Council · Society 5.0 framework · METI AI Guidelines for Business',
      workforce: 'METI Recurrent Education · MHLW Hello Work · Society 5.0 reskilling · Career Consultant system',
      earlyChildhood: 'Children and Families Agency (こども家庭庁, est. 2023) · MEXT preschool division · Hoikuen / Yochien framework',
      smartCity: 'Society 5.0 Smart Cities · Toyota Woven City · Super City Initiative · Cabinet Office Smart City consortium · Maebashi / Aizuwakamatsu pilots',
    },
  },

  PK: {
    code: 'PK',
    name: 'Pakistan',
    shortName: 'PK',
    flag: '🇵🇰',
    pillars: {
      foresight:
        'Planning Commission · Pakistan Institute of Development Economics (PIDE) · Strategic Plans Division (national security policy) · National Institute of Population Studies (NIPS) · Pakistan Institute of Public Policy',
      policyDesign:
        'Cabinet Division · Planning Commission · ministry policy units · Sustainable Development Policy Institute (SDPI) · Centre for Aerospace & Security Studies · Tabadlab',
      serviceDelivery:
        'NADRA (National Database & Registration Authority) · Pakistan Citizen Portal · Pak Identity · EHSAAS programme dashboards · Punjab Information Technology Board (PITB) · Sindh IT Department · KP IT Board · Balochistan IT initiatives',
      oversight:
        'Auditor General of Pakistan (AGP) · Public Accounts Committee · National Accountability Bureau (NAB) · Federal Tax Ombudsman · Wafaqi Mohtasib',
      coordination:
        'Cabinet Division · PMO · National Centre for AI (NCAI) · Special Investment Facilitation Council (SIFC, 2023→) · Council of Common Interests',
    },
    apps: {
      missionControl: 'PMO · Cabinet Division · SIFC · National Security Committee',
      tender: 'PPRA (federal) · SPPRA (Sindh) · KPPRA (KP) · BPPRA (Balochistan) · PPRA Punjab · e-PADS portal',
      fiscal: 'Ministry of Finance · Federal Board of Revenue (FBR) · Auditor General audit · Controller General of Accounts',
      readiness: 'National Centre for AI (NCAI) · Ministry of IT & Telecom · Digital Pakistan Initiative · Special Technology Zones Authority',
      bench: 'Pakistan Bureau of Statistics · State Bank of Pakistan data · PIDE',
      transparency: 'AGP · NAB · Public Accounts Committee · Right to Information commissions (federal + provincial)',
    },
    platforms: {
      digitalIdentity: 'NADRA CNIC · Pak Identity · NICOP · POC · NADRA e-Sahulat · Smart NIC',
      citizenPortal: 'Pakistan Citizen Portal · EHSAAS dashboards · NADRA self-service · Pak Hajj · Punjab Rozgar app',
      aiStrategy: 'National AI Policy (draft, 2023) · NCAI · Digital Pakistan Vision · Pakistan Tech Destination',
      workforce: 'Ministry of Federal Education & Professional Training · NAVTTC · TEVTA (provincial) · Kamyab Jawan Programme',
      earlyChildhood: 'MoFEPT Early Childhood Education wing · provincial education departments · UNICEF Pakistan partnerships · Single National Curriculum ECCE strand',
      smartCity: 'CPEC special economic zones · Islamabad Smart City Project · Lahore Knowledge Park · Ravi Urban Development · Gwadar Smart City · DHA City Karachi',
    },
  },

  SG: {
    code: 'SG',
    name: 'Singapore',
    shortName: 'SG',
    flag: '🇸🇬',
    pillars: {
      foresight:
        'PMO Strategy Group · Centre for Strategic Futures (CSF) · MTI Foresight · Civil Service College · Institute of Policy Studies (IPS)',
      policyDesign:
        'Public Service Division (PSD) · ministry policy offices · Lee Kuan Yew School of Public Policy (LKYSPP) · NCSS (social policy)',
      serviceDelivery:
        'GovTech · IMDA · statutory boards (HDB, LTA, NEA, NParks, EDB) · OneService · LifeSG · ServiceSG centres',
      oversight:
        'Auditor-General\'s Office (AGO) · Public Accounts Committee · Parliament Estimates Committee · IRAS audit · CPIB',
      coordination:
        'PMO · Whole-of-Government · ServiceSG · Smart Nation Group · Strategic Planning Office',
    },
    apps: {
      missionControl: 'PMO · Cabinet Office · Smart Nation Group · Strategic Planning Office',
      tender: 'GeBIZ · MOF Procurement & Finance Division',
      fiscal: 'Ministry of Finance · Accountant-General\'s Department (AGD) · IRAS · MAS reserves',
      readiness: 'Smart Nation Group · GovTech · IMDA · EDB Office for AI',
      bench: 'SingStat · MTI Economic Survey · MAS data · MOH Health Information',
      transparency: 'AGO · Parliament Public Accounts Committee · Open Data portal (data.gov.sg)',
    },
    platforms: {
      digitalIdentity: 'Singpass · MyInfo · Corppass · SGFinDex',
      citizenPortal: 'LifeSG · OneService · GoBusiness · ServiceSG',
      aiStrategy: 'National AI Strategy 2.0 (NAIS 2.0) · AI Verify · Smart Nation 2030 · GovTech AI Practice',
      workforce: 'SkillsFuture · Workforce Singapore · WorkPro · NTUC LearningHub partnerships',
      earlyChildhood: 'KidSTART · ECDA · Anchor Operator preschools · MOE Kindergartens',
      smartCity: 'Smart Nation 2030 · Punggol Digital District · Jurong Innovation District · One-North',
    },
  },

  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    shortName: 'AE',
    flag: '🇦🇪',
    pillars: {
      foresight:
        'UAE PMO · Mohammed Bin Rashid Centre for Government Innovation (MBRCGI) · MBR School of Government · UAE Government Foresight Network · Federal Strategy Office',
      policyDesign:
        'Cabinet · Ministry of Cabinet Affairs (MoCA) · UAE PMO · Federal Strategy Office · Federal Competitiveness & Statistics Centre',
      serviceDelivery:
        'TAMM (Abu Dhabi) · DubaiNow · U.AE federal portal · UAE Pass · Smart Dubai · Federal Authority for Identity, Citizenship, Customs & Port Security (ICA)',
      oversight:
        'State Audit Institution (SAI) · Federal Tax Authority audit · Anti-Corruption Authority · Federal National Council oversight',
      coordination:
        'Cabinet · UAE PMO · Ministry of Cabinet Affairs · Council of Ministers · Office of the Minister of State for AI',
    },
    apps: {
      missionControl: 'UAE Cabinet · UAE PMO · MoCA · Ministerial Development Council',
      tender: 'Federal procurement portals · Abu Dhabi Government Services (ADGS) · Dubai Government Procurement',
      fiscal: 'Ministry of Finance · Federal Tax Authority · Abu Dhabi Department of Finance · Dubai Department of Finance',
      readiness: 'Office of the Minister of State for AI, Digital Economy & Remote Work Applications · TDRA · Smart Dubai · Abu Dhabi Department of Government Enablement',
      bench: 'Federal Competitiveness & Statistics Centre · UAE Stat · Abu Dhabi Statistics Centre (SCAD)',
      transparency: 'State Audit Institution · MoCA Open Government · Federal National Council',
    },
    platforms: {
      digitalIdentity: 'UAE Pass · Emirates ID',
      citizenPortal: 'TAMM (Abu Dhabi) · DubaiNow · U.AE federal portal · Sharjah Digital · DEWA app',
      aiStrategy: 'UAE National AI Strategy 2031 · Office of the Minister of State for AI · MGX · G42 ecosystem · Falcon LLM',
      workforce: 'NAFIS · MOHRE · Emiratisation Council · National Programme for Coders',
      earlyChildhood: 'Ministry of Education ECE division · Abu Dhabi Early Childhood Authority · Sharjah Baby-Friendly emirate initiative',
      smartCity: 'Smart Dubai · Masdar City · Sharjah Smart City · NEOM-adjacent cooperation · Dubai 10X',
    },
  },

  US: {
    code: 'US',
    name: 'United States',
    shortName: 'US',
    flag: '🇺🇸',
    pillars: {
      foresight:
        'NSC · OMB Strategic Planning · GAO Strategic Foresight · OSTP · National Intelligence Council · Federally Funded R&D Centers (RAND, MITRE)',
      policyDesign:
        'OMB · OSTP · Domestic Policy Council · GSA TTS (18F, USDS) · Congressional Research Service · think tanks (Brookings, RAND, Heritage, AEI)',
      serviceDelivery:
        'GSA · USDS · 18F · Login.gov · USA.gov · agency-specific (IRS Direct File, SSA mySSA, VA.gov, USCIS myAccount, IRS Online Account)',
      oversight:
        'GAO · agency Inspectors General (75+) · OMB · CBO · Congressional oversight committees · OSC',
      coordination:
        'White House Office · OMB · OPM · Federal CIO Council · CDO Council · Federal Data Strategy team · GSA Centers of Excellence',
    },
    apps: {
      missionControl: 'White House Office · OMB · NSC · Cabinet Affairs',
      tender: 'GSA · SAM.gov · FAR Council · agency contracting offices · CIO-CS / GWAC vehicles',
      fiscal: 'OMB · Treasury · CBO · GAO · Federal Reserve (monetary)',
      readiness: 'OSTP · OMB M-24-10 AI Use Case Inventory · CDO Council · GSA AI Center of Excellence · NIST',
      bench: 'Census Bureau · Bureau of Economic Analysis (BEA) · BLS · NIH Data Strategy · Federal Reserve Economic Data (FRED)',
      transparency: 'GAO · USAspending.gov · IGs · Pandemic Response Accountability Committee patterns · Recovery Accountability legacy',
    },
    platforms: {
      digitalIdentity: 'Login.gov · ID.me · State-level mobile driver\'s licenses (mDLs) · Real ID',
      citizenPortal: 'USA.gov · Vote.gov · benefits.gov · agency portals (IRS, SSA, VA, USCIS) · Notify.gov',
      aiStrategy: 'Executive Order 14110 on AI (2023) · OMB M-24-10 · AI Bill of Rights · NIST AI RMF · State AI guidance',
      workforce: 'Department of Labor · CareerOneStop · WIOA · Apprenticeship USA · DoL Employment & Training Administration',
      earlyChildhood: 'Head Start · Child Care & Development Block Grant · Administration for Children and Families (ACF) · Build Back Better child care',
      smartCity: 'DOT Smart City Challenge · NIST GCTC · MetroLab Network · Connected Communities programme',
    },
  },
};

// Order: alphabetical by country name. China, India, Japan, Pakistan,
// Singapore, UAE, United States. Avoids any privileging of one jurisdiction.
export const JURISDICTION_ORDER: JurisdictionCode[] = ['CN', 'IN', 'JP', 'PK', 'SG', 'AE', 'US'];

/**
 * Build the array of {label, value} pairs that HoverInsight's `jurisdiction`
 * prop expects, for a given pillar.
 */
export function jurisdictionsForPillar(
  pillar: keyof Jurisdiction['pillars'],
): { label: string; value: string }[] {
  return JURISDICTION_ORDER.map((code) => ({
    label: `${JURISDICTIONS[code].flag} ${code}`,
    value: JURISDICTIONS[code].pillars[pillar],
  }));
}

export function jurisdictionsForApp(
  app: keyof Jurisdiction['apps'],
): { label: string; value: string }[] {
  return JURISDICTION_ORDER.map((code) => ({
    label: `${JURISDICTIONS[code].flag} ${code}`,
    value: JURISDICTIONS[code].apps[app],
  }));
}

export function jurisdictionsForPlatform(
  platform: keyof Jurisdiction['platforms'],
): { label: string; value: string }[] {
  return JURISDICTION_ORDER.map((code) => ({
    label: `${JURISDICTIONS[code].flag} ${code}`,
    value: JURISDICTIONS[code].platforms[platform],
  }));
}
