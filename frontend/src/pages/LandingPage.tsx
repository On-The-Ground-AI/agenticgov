import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppNavbar } from '../components/AppNavbar';
import { HoverInsight } from '../components/HoverInsight';
import { LiveScanDemo } from '../components/LiveScanDemo';
import { VisitorCounter } from '../components/VisitorCounter';
import { GuidedTour } from '../components/GuidedTour';
import {
  JURISDICTIONS,
  JURISDICTION_ORDER,
  jurisdictionsForPillar,
} from '../data/jurisdictions';

const READINESS_PILLARS = [
  {
    n: '01',
    title: 'Strategic Foresight & Agenda Setting',
    description: 'Horizon scanning, stakeholder mapping, and prioritisation — the upstream functions that decide what governments should pay attention to.',
    functions: 11,
    tier: 'HIGH',
    color: '#B8860B',
    wefRef: 'Section 2 (Functional Map, p.18)',
    jurisdiction: jurisdictionsForPillar('foresight'),
  },
  {
    n: '02',
    title: 'Policy Design & Analysis',
    description: 'Comparative benchmarking, options appraisal, fiscal impact modelling, and ex-ante evaluation of proposed interventions.',
    functions: 18,
    tier: 'HIGH',
    color: '#0E7490',
    wefRef: 'Section 3 (Policy Cycle, p.24)',
    jurisdiction: jurisdictionsForPillar('policyDesign'),
  },
  {
    n: '03',
    title: 'Service Delivery & Operations',
    description: 'Procurement, citizen services, regulatory compliance, and the day-to-day machinery of public administration.',
    functions: 16,
    tier: 'MEDIUM',
    color: '#7C3AED',
    wefRef: 'Section 4 (Operational Functions, p.34)',
    jurisdiction: jurisdictionsForPillar('serviceDelivery'),
  },
  {
    n: '04',
    title: 'Monitoring, Evaluation & Transparency',
    description: 'Real-time KPI tracking, anomaly detection, impact evaluation, and disclosure to legislators and citizens.',
    functions: 15,
    tier: 'HIGH',
    color: '#059669',
    wefRef: 'Section 5 (Oversight Layer, p.42)',
    jurisdiction: jurisdictionsForPillar('oversight'),
  },
  {
    n: '05',
    title: 'Cross-Government Coordination',
    description: 'Inter-ministerial workflows, cabinet briefings, escalation governance, and bi-directional intelligence flows that bind agencies together.',
    functions: 10,
    tier: 'EMERGING',
    color: '#DC2626',
    wefRef: 'Section 6 (Whole-of-Government, p.51)',
    jurisdiction: jurisdictionsForPillar('coordination'),
  },
];

const TIER_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  HIGH: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  EMERGING: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
  CAUTION: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
};

const DEMO_APPS = [
  {
    name: 'Mission Control',
    tag: 'Portal',
    description: 'Morning briefing, decision queue, agent health, cross-app event chains. The orchestration layer.',
    longDescription: 'Acts as the cabinet- or PS-level "front page" for everything happening across the suite. Every agent in every other app reports its activity here, ranked by severity. The surface a Permanent Secretary or Cabinet Secretariat would actually open at 7 AM.',
    route: '/portal',
    color: '#334155',
    primary: true,
    wefRef: 'Section 6 (Coordination, p.51)',
  },
  {
    name: 'TenderAI',
    tag: 'Procurement',
    description: 'Tender compliance scanning, vendor analysis, automated bid evaluation against legal frameworks.',
    longDescription: 'Scans every tender against the Government Procurement Act, ICV thresholds, and sustainability criteria before bid opening. Flags systemic template gaps. Estimated cycle-time reduction in pilot data: ~40%.',
    route: '/portal/tender',
    color: '#D97706',
    wefRef: 'Functions 6, 7, 41 (Procurement)',
  },
  {
    name: 'FiscalAI',
    tag: 'Finance',
    description: 'Budget anomaly detection, fiscal forecasting, KPI tracking, cost-effectiveness benchmarking.',
    longDescription: 'Continuously monitors ministry-level spend against rolling baselines. Detects variance anomalies in real time, runs root-cause attribution, and pushes alerts to Permanent Secretary briefings.',
    route: '/portal/fiscal',
    color: '#2563EB',
    wefRef: 'Functions 9, 44, 53 (Fiscal)',
  },
  {
    name: 'ReadinessMap',
    tag: 'Strategy',
    description: 'Live readiness scoring across the 70 WEF government functions, ministerial scorecards, dependency mapping.',
    longDescription: 'The WEF report becomes a live dashboard. Every one of the 70 functions has a readiness score that updates as you deploy capability. Dependency arrows show which functions unlock others.',
    route: '/portal/readiness',
    color: '#7C3AED',
    wefRef: 'Section 7 (Implementation, p.62)',
  },
  {
    name: 'GovBench',
    tag: 'Benchmarking',
    description: 'Continuous monitoring of OECD, World Bank, and WEF indices with peer-country policy transferability scoring.',
    longDescription: 'Watches global indices (WEF GCI, UN EGDI, World Bank Governance) and pushes ranking changes into ReadinessMap automatically. Identifies high-transferability policies from peer jurisdictions.',
    route: '/portal/bench',
    color: '#0891B2',
    wefRef: 'Functions 8, 21, 35 (Benchmarking)',
  },
  {
    name: 'TransparencyAI',
    tag: 'Disclosure',
    description: 'Auto-drafted disclosure reports, deadline monitoring, evidence-quality scoring against international benchmarks.',
    longDescription: 'Auto-generates ~80% of quarterly disclosure reports from existing data. Scores evidence quality against the WEF transparency benchmark and routes the remaining gaps to ministry teams with templates.',
    route: '/portal/transparency',
    color: '#DC2626',
    wefRef: 'Functions 8, 20, 47 (Transparency)',
  },
];

const FLOW_HIGHLIGHTS = [
  {
    from: 'FiscalAI',
    to: 'TransparencyAI',
    label: 'Anomaly → forced disclosure',
    detail: 'When FiscalAI detects a material variance, TransparencyAI is automatically required to surface it in the next quarterly report — no manual handoff.',
  },
  {
    from: 'GovBench',
    to: 'ReadinessMap',
    label: 'New WEF data → recalibrated scores',
    detail: 'The moment the WEF GCI 2026 publishes, GovBench ingests it and ReadinessMap recomputes every affected function score within 5 minutes.',
  },
  {
    from: 'TenderAI',
    to: 'FiscalAI',
    label: 'Procurement cost → budget reconciliation',
    detail: 'Every awarded tender pushes its actual cost into FiscalAI for budget vs. outcome tracking. Overrun patterns surface as anomalies.',
  },
  {
    from: 'ReadinessMap',
    to: 'TenderAI',
    label: 'Function ownership → tender routing',
    detail: 'When a function changes ownership, ReadinessMap re-routes related tenders to the new responsible ministry without human re-tagging.',
  },
  {
    from: 'TransparencyAI',
    to: 'PMO',
    label: 'Quality < threshold → escalation',
    detail: 'If a draft disclosure scores below the WEF benchmark (typically 80/100), it auto-escalates to the PMO with a list of specific gaps and template suggestions.',
  },
];

export function LandingPage() {
  const [count, setCount] = useState<number | null>(null);
  const [, setSearchParams] = useSearchParams();
  const scanRef = useRef<HTMLElement>(null);

  const startTour = () => {
    setSearchParams((p) => {
      const np = new URLSearchParams(p);
      np.set('tour', '1');
      return np;
    });
  };

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch('/api/visit', { method: 'POST' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === 'number') setCount(data.count);
      } catch {
        // soft-fail
      }
    }
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <GuidedTour />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B8860B] blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <HoverInsight
            title="Visual companion to the WEF report"
            description="This site is a working visualisation of the World Economic Forum's April 2026 Readiness Framework. Every screen, KPI, and flow corresponds to a section in the report."
            wefRef="Section 1 (Introduction)"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-6 cursor-help">
              <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse" />
              Visual companion to the WEF Readiness Framework (Apr 2026)
            </div>
          </HoverInsight>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
            <span className="text-[#B8860B]">AgenticGov</span>
            <span className="block mt-2 text-white/90">Making Agentic AI Work for Government</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-3xl leading-relaxed">
            A live, no-login visualisation of how the WEF's <em className="text-white/90 not-italic font-medium">Making Agentic AI Work for Government — A Readiness Framework</em> looks
            in production. Six interconnected agentic apps, 70 government functions, one orchestration portal.
          </p>

          {/* Audience strip — seven jurisdictions, equal billing */}
          <div data-tour="audience" className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span>Built for government teams across</span>
            {JURISDICTION_ORDER.map((code) => {
              const j = JURISDICTIONS[code];
              return (
                <HoverInsight
                  key={code}
                  title={j.name}
                  description={`The architecture maps onto ${j.name}'s government structure across all five WEF readiness pillars. Foresight: ${j.pillars.foresight}. Service delivery: ${j.pillars.serviceDelivery}. Click any pillar tile or app card below — every popup names the equivalents in your jurisdiction.`}
                  meta={[
                    { label: 'Digital identity', value: j.platforms.digitalIdentity },
                    { label: 'Citizen portal', value: j.platforms.citizenPortal },
                    { label: 'AI strategy', value: j.platforms.aiStrategy },
                  ]}
                  wefRef="Annex B (Reference jurisdictions, p.79)"
                >
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 cursor-help">
                    {j.flag} {j.name}
                  </span>
                </HoverInsight>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-white/40 max-w-3xl">
            All seven jurisdictions sit at the same level. The demo data uses Singapore agencies as one
            worked example — the architecture itself is jurisdiction-neutral, and every popup names the
            equivalents for the other six.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B8860B] hover:bg-[#9a7209] text-white font-semibold shadow-lg shadow-[#B8860B]/30 transition"
            >
              Launch Mission Control
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              data-tour="run-scan"
              onClick={() => scanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Watch a Live Agent Run
            </button>
            <button
              onClick={startTour}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.5M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.5h.01" />
              </svg>
              Take a guided tour
            </button>
            <a
              href="/wef-readiness-framework.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Read the WEF Report
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/60 border-t border-white/10 pt-6">
            <VisitorCounter count={count} variant="dark" />
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live demo · no login required
            </span>
            <span>23 simulated agents · 70 WEF functions · 11 ministries</span>
          </div>
        </div>
      </section>

      {/* What is this */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">What this is</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
              The framework, made tangible.
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-4 text-slate-700 leading-relaxed">
            <p>
              The WEF's <em>Readiness Framework</em> identifies <strong>70 distinct government functions</strong> where
              agentic AI can shift from advisory to autonomous action — scored across potential, complexity, risk, and
              jurisdictional readiness. The report is rigorous, but it is a <strong>document</strong>.
            </p>
            <p>
              AgenticGov is what those 70 functions look like when they are <strong>running</strong>. Each of the six
              apps below is a live, clickable surface that an officer in a ministry would actually use — anomaly alerts,
              tender compliance scans, readiness scorecards, decision queues, morning briefings — wired into a single
              orchestration portal with cross-app event chains.
            </p>
            <p className="text-slate-500 text-sm">
              All data shown is illustrative. The architecture, agent topology, and bi-directional intelligence flows
              are real reference implementations of the framework's recommended deployment patterns.
              <br className="hidden sm:block" />
              <span className="text-slate-400">Tip: hover or click any element on this page to see what it represents and where it sits in the WEF report.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Live scan demo */}
      <section ref={scanRef} className="glass-strong border-y border-white/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">Watch a live scan</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            Press the button. See the agents work.
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            A simulated FiscalAI overnight scan. Six agent steps, real timing, real outputs — exactly as it would run
            against a live ministry budget feed.
          </p>
          <div className="mt-8">
            <LiveScanDemo />
          </div>
        </div>
      </section>

      {/* Five Readiness Pillars */}
      <section data-tour="pillars" className="glass border-y border-white/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">The Framework</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
                70 functions, five readiness pillars.
              </h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Every government function maps to one of five stages of the policy lifecycle. Each carries its own
                readiness profile, deployment risk, and data dependency. <span className="text-slate-400">Hover or click any tile.</span>
              </p>
            </div>
            <HoverInsight
              title="70 functions, total"
              description="The WEF Readiness Framework enumerates 70 specific government functions where agentic AI is technically feasible today. They cluster across 5 lifecycle stages."
              wefRef="Annex A (Function index, p.71)"
            >
              <div className="text-right cursor-help">
                <p className="text-4xl font-bold text-slate-900">70</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Functions covered</p>
              </div>
            </HoverInsight>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {READINESS_PILLARS.map((p) => {
              const tier = TIER_STYLES[p.tier];
              return (
                <HoverInsight
                  key={p.n}
                  title={`${p.n} — ${p.title}`}
                  description={p.description}
                  meta={[
                    { label: 'Functions', value: String(p.functions) },
                    { label: 'Readiness tier', value: p.tier },
                  ]}
                  jurisdiction={p.jurisdiction}
                  wefRef={p.wefRef}
                >
                  <div className="relative rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-help">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-mono text-slate-400">{p.n}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1 ${tier.bg} ${tier.text} ${tier.ring}`}>
                        {p.tier}
                      </span>
                    </div>
                    <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: p.color }} />
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{p.title}</h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{p.description}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-slate-900">{p.functions}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">functions</span>
                    </div>
                  </div>
                </HoverInsight>
              );
            })}
          </div>
        </div>
      </section>

      {/* Six demo apps */}
      <section data-tour="apps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">The Demo Suite</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
              Six agentic apps, one orchestration portal.
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Click any tile to enter a live, fully-interactive surface. No login, no setup. Hover for details before
              you go in.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_APPS.map((app) => (
            <HoverInsight
              key={app.name}
              title={app.name}
              description={app.longDescription}
              meta={[{ label: 'Domain', value: app.tag }]}
              wefRef={app.wefRef}
            >
              <Link
                to={app.route}
                className={`group relative block rounded-xl border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all ${
                  app.primary ? 'border-[#B8860B]/30 ring-1 ring-[#B8860B]/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${app.color}15`, color: app.color }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{app.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{app.description}</p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 group-hover:text-[#B8860B] transition">Open demo</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-[#B8860B] group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {app.primary && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded-full">
                    Start here
                  </span>
                )}
              </Link>
            </HoverInsight>
          ))}
        </div>
      </section>

      {/* Cross-app intelligence flow */}
      <section data-tour="flows" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">Cross-app intelligence</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Agentic ≠ a chatbot per ministry. It's a network.
          </h2>
          <p className="mt-3 text-white/70 max-w-3xl">
            The framework's central insight: most government value comes from <em>bi-directional intelligence flows</em> between
            agencies, not from siloed assistants. Below are five live event chains that flow through AgenticGov daily.
            <span className="text-white/50"> Click any row.</span>
          </p>

          <div className="mt-10 grid gap-3">
            {FLOW_HIGHLIGHTS.map((flow, idx) => (
              <HoverInsight
                key={idx}
                title={`${flow.from} → ${flow.to}`}
                description={flow.detail}
                meta={[{ label: 'Flow type', value: flow.label }]}
                wefRef="Section 6 (Whole-of-Government, p.51)"
              >
                <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-5 py-4 transition cursor-help">
                  <span className="text-xs font-mono text-white/40 w-6">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium text-white/90 w-32 sm:w-40">{flow.from}</span>
                  <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-sm font-medium text-white/90 w-32 sm:w-40">{flow.to}</span>
                  <span className="text-sm text-white/60 ml-auto hidden sm:inline">{flow.label}</span>
                </div>
              </HoverInsight>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-strong border-t border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
                  <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">AgenticGov</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              An open visualisation of the WEF <em>Making Agentic AI Work for Government</em> readiness framework.
              Built by On The Ground.
            </p>
            <VisitorCounter count={count} variant="light" className="mt-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Reference</p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="https://www.weforum.org/publications/making-agentic-ai-work-for-government-a-readiness-framework/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#B8860B]">
                  WEF Source Report (web) ↗
                </a>
              </li>
              <li>
                <a href="/wef-readiness-framework.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#B8860B]">
                  WEF Source Report (PDF)
                </a>
              </li>
              <li>
                <Link to="/portal" className="text-slate-600 hover:text-[#B8860B]">Mission Control</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Built by</p>
            <ul className="space-y-1.5 text-sm">
              <li className="text-slate-600">On The Ground · Singapore</li>
              <li><a href="mailto:haojun@ontheground.agency" className="text-slate-600 hover:text-[#B8860B]">haojun@ontheground.agency</a></li>
              <li><a href="https://wa.me/6598419481" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#B8860B]">WhatsApp +65 9841 9481</a></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-[#B8860B] text-xs">Privacy</Link> · <Link to="/terms" className="text-slate-600 hover:text-[#B8860B] text-xs">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} On The Ground · AgenticGov is a non-commercial visual demonstration. WEF report
          credits remain with the World Economic Forum.
        </div>
      </footer>
    </div>
  );
}
