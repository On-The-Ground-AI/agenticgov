import { useState } from 'react';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { AgentStepSimulator } from '../components/AgentStepSimulator';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { HoverInsight } from '../components/HoverInsight';
import { jurisdictionsForApp } from '../data/jurisdictions';
import { AGENT_ACTIVITY_LOG } from '../data/agenticDemo';
import {
  MINISTRY_PROGRAMS,
  SPENDING_ANOMALY,
  IMPACT_FORECAST,
  FISCAL_AGENT_STEPS,
  DAILY_SCAN,
  ANOMALY_REASONING,
  CROSS_APP_INTEL,
  CONFIDENCE_ACTIONS,
  SPENDING_TRENDS,
} from '../data/fiscalAIDemo';
import {
  Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, ComposedChart, Area,
} from 'recharts';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = ['Budget Monitor', 'Anomaly Detector', 'Impact Forecaster'] as const;
type Tab = (typeof TABS)[number];

const MINISTRIES = ['Education', 'Health', 'Finance'] as const;
type MinistryFilter = (typeof MINISTRIES)[number];

const FLAG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  green: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  yellow: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  red: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const LIKELIHOOD_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const TREND_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  accelerating: { label: 'Accelerating', icon: '↑', color: 'text-red-500' },
  decelerating: { label: 'Decelerating', icon: '↓', color: 'text-green-500' },
  steady: { label: 'Steady', icon: '→', color: 'text-slate-400' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function barColor(pct: number) {
  if (pct > 100) return '#ef4444';
  if (pct >= 90) return '#22c55e';
  if (pct >= 70) return '#eab308';
  return '#3b82f6';
}

function formatM(n: number) {
  return `$${n.toLocaleString()}M`;
}

function formatAED(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FiscalAIPage() {
  const [tab, setTab] = useState<Tab>('Budget Monitor');
  const [ministry, setMinistry] = useState<MinistryFilter>('Education');
  const [agentRunning, setAgentRunning] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  const programs = MINISTRY_PROGRAMS.filter((p) => p.ministryShort === ministry);
  const a = SPENDING_ANOMALY;
  const f = IMPACT_FORECAST;
  const scan = DAILY_SCAN;

  const forecastChartData = f.years.map((y) => ({
    year: y.year.toString(),
    cost: y.costM,
    beneficiaries: y.beneficiaries / 1000,
    cumulative: y.cumulativeCostM,
  }));

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              <span className="text-blue-600">FiscalAI</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Budget Monitoring, Anomaly Detection & Fiscal Forecasting</p>
          </div>
          <HoverInsight
            title="Run a live agent scan"
            description="Trigger FiscalAI's morning scan across every ministry programme: pulls latest expenditure, recomputes burn-rate, runs anomaly detection, and refreshes the impact forecast. Watch the right-hand sidebar for the step-by-step trace."
            wefRef="Section 4 (Operational Functions, p.34)"
            jurisdiction={jurisdictionsForApp('fiscal')}
          >
            <button
              onClick={() => setAgentRunning(true)}
              disabled={agentRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              {agentRunning ? 'Scanning…' : '▶ Run scan'}
            </button>
          </HoverInsight>
        </div>

        {/* ================================================================= */}
        {/* Daily Scan Summary Bar                                             */}
        {/* ================================================================= */}
        <div className="glass rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Morning Scan Complete</span>
            <span className="text-[10px] text-slate-400 ml-auto">{scan.scanTime}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <HoverInsight
              title="Ministries scanned"
              description="How many ministries the agent ingested fiscal data from this morning. Each ministry exposes its programme registry; the agent walks every programme to refresh burn-rate and anomaly state."
              wefRef="Functions 9, 44, 53 (Fiscal)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-slate-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Ministries</p>
                <p className="text-sm font-bold text-slate-800">{scan.ministriesScanned}</p>
              </div>
            </HoverInsight>
            <HoverInsight
              title="Programs reviewed"
              description="Total individual programmes (e.g. KidSTART, Eldercare top-ups) inspected in this scan. Each programme gets fresh budget-vs-actual, KPI, and efficiency-ratio computations."
              wefRef="Functions 9, 44, 53 (Fiscal)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-slate-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Programs</p>
                <p className="text-sm font-bold text-slate-800">{scan.programsReviewed}</p>
              </div>
            </HoverInsight>
            <HoverInsight
              title="Programs on track"
              description="Programmes whose burn-rate, KPI delivery and efficiency ratio are all within tolerance bands set by FiscalAI's policy. No human action required."
              wefRef="Section 5 (Oversight Layer, p.42)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-green-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-green-600 uppercase tracking-wide">On Track</p>
                <p className="text-sm font-bold text-green-700">{scan.onTrack}</p>
              </div>
            </HoverInsight>
            <HoverInsight
              title="Elevated programs"
              description="Programmes flagged for elevated risk — typically because spend is running >10% above plan or KPI delivery is lagging. Surfaces in the daily fiscal digest for officer review."
              wefRef="Section 5 (Oversight Layer, p.42)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-amber-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-amber-600 uppercase tracking-wide">Elevated</p>
                <p className="text-sm font-bold text-amber-700">{scan.elevated}</p>
              </div>
            </HoverInsight>
            <HoverInsight
              title="Anomalies detected"
              description="Programmes where the agent's variance model flagged a statistically significant deviation. These trigger the Anomaly Detector tab and route to the human-in-the-loop confidence-gated workflow."
              wefRef="Functions 9, 44, 53 (Fiscal)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-red-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-red-600 uppercase tracking-wide">Anomalies</p>
                <p className="text-sm font-bold text-red-700">{scan.anomalies}</p>
              </div>
            </HoverInsight>
            <HoverInsight
              title="Total fiscal value monitored"
              description="Sum of all programme allocations under FiscalAI's surveillance for the current fiscal year. Drawn from each ministry's published estimates of expenditure."
              wefRef="Functions 9, 44, 53 (Fiscal)"
              jurisdiction={jurisdictionsForApp('fiscal')}
            >
              <div className="bg-blue-50 rounded-md px-3 py-2 text-center cursor-help">
                <p className="text-[10px] text-blue-600 uppercase tracking-wide">Monitored</p>
                <p className="text-sm font-bold text-blue-700">{formatAED(scan.totalSpendAED)}</p>
              </div>
            </HoverInsight>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg border border-neutral-200 p-1 mb-6 w-fit">
          {TABS.map((t) => {
            const tabMeta: Record<Tab, { desc: string; wef: string }> = {
              'Budget Monitor': {
                desc: 'Per-ministry programme cards: budget bar, KPI delivery bar, efficiency ratio versus benchmark, and a 6-month burn-rate trend. Shows whether each programme is on track, elevated or red-flagged.',
                wef: 'Functions 9, 44, 53 (Fiscal)',
              },
              'Anomaly Detector': {
                desc: 'Live anomaly view: a high-variance programme, the agent\'s reasoning chain explaining how it concluded the spend is unusual, the cross-app intel that informed it, and the human-in-the-loop confidence thresholds.',
                wef: 'Section 5 (Oversight Layer, p.42)',
              },
              'Impact Forecaster': {
                desc: '5-year fiscal impact projection for a candidate programme — total cost, NPV, benefit-cost ratio, breakeven year, and a sensitivity range. Auto-triggered when PolicyAI submits a new policy proposal.',
                wef: 'Section 4 (Operational Functions, p.34)',
              },
            };
            return (
              <HoverInsight
                key={t}
                title={t}
                description={tabMeta[t].desc}
                wefRef={tabMeta[t].wef}
                jurisdiction={jurisdictionsForApp('fiscal')}
              >
                <button
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    tab === t ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              </HoverInsight>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---- LEFT: Main content ---- */}
          <div className="lg:col-span-2 space-y-5">
            {/* ============================================================= */}
            {/* Budget Monitor Tab                                             */}
            {/* ============================================================= */}
            {tab === 'Budget Monitor' && (
              <>
                {/* Last scanned header */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white rounded-lg border border-neutral-200 px-4 py-2">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last automated scan: <span className="font-medium text-slate-700">Today {scan.scanTime}</span></span>
                  <span className="text-slate-300">|</span>
                  <span>Next scan: <span className="font-medium text-slate-700">Tomorrow 7:00 AM GST</span></span>
                </div>

                {/* Ministry selector */}
                <div className="flex gap-2">
                  {MINISTRIES.map((m) => (
                    <HoverInsight
                      key={m}
                      title={`Ministry — ${m}`}
                      description={`Filter the budget monitor to programmes owned by the Ministry of ${m}. Each ministry exposes its programme registry; FiscalAI walks every programme to refresh burn-rate, KPI and efficiency metrics.`}
                      wefRef="Functions 9, 44, 53 (Fiscal)"
                      jurisdiction={jurisdictionsForApp('fiscal')}
                    >
                      <button
                        onClick={() => setMinistry(m)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          ministry === m
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-neutral-200 hover:bg-slate-50'
                        }`}
                      >
                        {m}
                      </button>
                    </HoverInsight>
                  ))}
                </div>

                {/* Program cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {programs.map((p) => {
                    const fc = FLAG_COLORS[p.riskFlag];
                    const trend = SPENDING_TRENDS[p.id] || 'steady';
                    const tc = TREND_CONFIG[trend];
                    return (
                      <HoverInsight
                        key={p.id}
                        title={p.program}
                        description={`Programme card for ${p.program} (${p.ministryShort}). Shows: budget allocated vs spent (with 6-month trend), KPI actual vs target, and an efficiency ratio benchmarked against ${p.benchmarkRatio}x. Risk flag: ${p.riskFlag.toUpperCase()}. Insight: ${p.insight}`}
                        wefRef="Functions 9, 44, 53 (Fiscal)"
                        jurisdiction={jurisdictionsForApp('fiscal')}
                      >
                      <div className="glass rounded-xl p-4 space-y-3 cursor-help">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-800 leading-tight">{p.program}</h3>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${fc.bg} ${fc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${fc.dot}`} />
                            {p.riskFlag.toUpperCase()}
                          </span>
                        </div>

                        {/* Budget bar */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Budget: {formatM(p.allocatedBudgetM)}</span>
                            <span className="flex items-center gap-1">
                              {p.spentPct}% spent
                              <span className={`text-[10px] font-medium ${tc.color}`} title={tc.label}>
                                {tc.icon}
                              </span>
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${Math.min(p.spentPct, 100)}%`, backgroundColor: barColor(p.spentPct) }}
                            />
                          </div>
                        </div>

                        {/* KPI progress */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>{p.kpiName}</span>
                            <span>
                              {p.kpiActual.toLocaleString()}/{p.kpiTarget.toLocaleString()} {p.kpiUnit}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${Math.min((p.kpiActual / p.kpiTarget) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Efficiency + trend + insight */}
                        <div className="text-[11px] text-slate-500 border-t border-neutral-100 pt-2 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-slate-700">Efficiency: </span>
                            <span className={p.efficiencyRatio > 1.05 ? 'text-red-600' : p.efficiencyRatio < 0.95 ? 'text-green-600' : 'text-slate-600'}>
                              {p.efficiencyRatio.toFixed(2)}x
                            </span>
                            <span className="text-slate-400"> (benchmark {p.benchmarkRatio}x)</span>
                          </div>
                          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${tc.color}`}>
                            {tc.icon} {tc.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">{p.insight}</p>
                      </div>
                      </HoverInsight>
                    );
                  })}
                </div>
              </>
            )}

            {/* ============================================================= */}
            {/* Anomaly Detector Tab                                           */}
            {/* ============================================================= */}
            {tab === 'Anomaly Detector' && (
              <>
                {/* Alert card */}
                <HoverInsight
                  title="Spending anomaly card"
                  description={`Live anomaly detected by FiscalAI: ${a.ministry} / ${a.category} is +${a.variancePct}% over budget. The card lists likely causes ranked by probability and the agent's recommended next action.`}
                  wefRef="Section 5 (Oversight Layer, p.42)"
                  jurisdiction={jurisdictionsForApp('fiscal')}
                >
                <div className="bg-white rounded-lg border-2 border-red-300 shadow-sm overflow-hidden cursor-help">
                  <div className="bg-red-50 px-5 py-3 border-b border-red-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-semibold text-red-800">Spending Anomaly Detected</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Ministry', value: a.ministry },
                        { label: 'Category', value: a.category },
                        { label: 'Budgeted', value: formatM(a.budgetedM) },
                        { label: 'Actual', value: formatM(a.actualM) },
                      ].map((s) => (
                        <div key={s.label}>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-600">+{formatM(a.variance)}</span>
                      <span className="text-sm text-red-500 font-medium">(+{a.variancePct}%)</span>
                    </div>

                    {/* Possible causes */}
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">Possible Causes</p>
                      <ul className="space-y-1.5">
                        {a.possibleCauses.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${LIKELIHOOD_COLORS[c.likelihood]}`}>
                              {c.likelihood}
                            </span>
                            <span>{c.cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Agent recommendation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Agent Recommendation</p>
                      <p className="text-xs text-blue-700 leading-relaxed">{a.agentRecommendation}</p>
                    </div>

                  </div>
                </div>
                </HoverInsight>

                {/* ========================================================= */}
                {/* Agent Reasoning Chain                                       */}
                {/* ========================================================= */}
                <HoverInsight
                  title="Agent reasoning chain"
                  description="Step-by-step trace of how FiscalAI reached its anomaly verdict — every step lists the data source and a confidence score. Click the row to expand. This is the agent's audit trail."
                  wefRef="Section 5 (Oversight Layer, p.42)"
                  jurisdiction={jurisdictionsForApp('fiscal')}
                >
                <div className="glass rounded-xl overflow-hidden cursor-help">
                  <button
                    onClick={() => setReasoningExpanded(!reasoningExpanded)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.065l.993.497a2.25 2.25 0 002.4-.244l.262-.2M14.25 3.104c.251.023.501.05.75.082M19.5 12.5l-3.451-3.451" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-800">Agent Reasoning Chain</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{ANOMALY_REASONING.length} steps</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${reasoningExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {reasoningExpanded && (
                    <div className="px-5 pb-5 space-y-3">
                      {ANOMALY_REASONING.map((r) => {
                        const confPct = Math.round(r.confidence * 100);
                        const confColor = confPct >= 90 ? '#22c55e' : confPct >= 80 ? '#eab308' : '#ef4444';
                        return (
                          <div key={r.step} className="flex gap-3">
                            {/* Step number */}
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
                              {r.step}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-slate-700">{r.action}</span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{r.dataSource}</span>
                              </div>
                              <p className="text-xs text-slate-600 mb-1.5">{r.finding}</p>
                              {/* Confidence bar */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${confPct}%`, backgroundColor: confColor }}
                                  />
                                </div>
                                <span className="text-[10px] font-medium" style={{ color: confColor }}>{confPct}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                </HoverInsight>

                {/* ========================================================= */}
                {/* Cross-App Intelligence                                      */}
                {/* ========================================================= */}
                <HoverInsight
                  title="Cross-app intelligence (inbound)"
                  description="Signals other AgenticGov apps have pushed to FiscalAI in the last 24 hours — e.g. TenderAI flagging cost overruns, PolicyAI submitting fiscal-impact requests, GovBench surfacing OECD comparators. This is how FiscalAI stays bi-directionally informed."
                  wefRef="Annex A (Function index)"
                  jurisdiction={jurisdictionsForApp('fiscal')}
                >
                <div className="glass rounded-xl overflow-hidden cursor-help">
                  <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-800">Cross-App Intelligence</span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {CROSS_APP_INTEL.map((intel, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700">
                          {intel.sourceApp.replace('AI', '').slice(0, 3)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-700">{intel.sourceApp}</span>
                            <span className="text-[10px] text-slate-400">{intel.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{intel.dataReceived}</p>
                          <p className="text-[11px] text-blue-600 font-medium mt-0.5">{intel.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </HoverInsight>

                {/* ========================================================= */}
                {/* Confidence Threshold Card                                   */}
                {/* ========================================================= */}
                <HoverInsight
                  title="Human-in-the-loop confidence thresholds"
                  description="FiscalAI's autonomy policy: each anomaly is gated by a confidence score. ≥95% logs automatically; 80–95% surfaces in the daily digest; <80% routes to a human reviewer. Aligns with the WEF framework's oversight layer recommendations."
                  wefRef="Section 5 (Oversight Layer, p.42)"
                  jurisdiction={jurisdictionsForApp('fiscal')}
                >
                <div className="glass rounded-xl overflow-hidden cursor-help">
                  <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-800">Human-in-the-Loop: Confidence Thresholds</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {CONFIDENCE_ACTIONS.map((ca) => (
                      <div key={ca.label} className="flex items-start gap-3">
                        <div
                          className="flex-shrink-0 w-3 h-3 rounded-full mt-0.5"
                          style={{ backgroundColor: ca.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-700">{ca.label}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{ca.threshold}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            <span className="font-medium">{ca.action}</span> &mdash; {ca.example}
                          </p>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400 pt-2 border-t border-neutral-100">
                      FiscalAI uses confidence-gated autonomy: high-confidence findings are logged automatically,
                      medium-confidence items surface in daily digests, and low-confidence anomalies require human review before action.
                    </p>
                  </div>
                </div>
                </HoverInsight>
              </>
            )}

            {/* ============================================================= */}
            {/* Impact Forecaster Tab                                          */}
            {/* ============================================================= */}
            {tab === 'Impact Forecaster' && (
              <>
                {/* Trigger note */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-indigo-800">Auto-triggered by PolicyAI</p>
                    <p className="text-[11px] text-indigo-600 mt-0.5">
                      This forecast was automatically generated when PolicyAI submitted the KidSTART policy proposal.
                      FiscalAI ingested the proposal metadata and ran a 5-year fiscal impact projection within 4 seconds.
                    </p>
                  </div>
                </div>

                <HoverInsight
                  title="Fiscal impact forecast"
                  description={`5-year projection for ${f.title}. Summary tiles below show total cost, NPV, benefit-cost ratio (BCR), cost per beneficiary, and breakeven year. The chart breaks down annual cost, cumulative cost, and beneficiaries. The sensitivity range shows how the forecast changes under optimistic vs pessimistic assumptions.`}
                  wefRef="Section 4 (Operational Functions, p.34)"
                  jurisdiction={jurisdictionsForApp('fiscal')}
                >
                <div className="glass rounded-xl overflow-hidden cursor-help">
                  <div className="bg-blue-600 px-5 py-3">
                    <h2 className="text-sm font-semibold text-white">{f.title}</h2>
                    <p className="text-[11px] text-blue-200 mt-0.5">5-Year Fiscal Impact Projection</p>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Summary stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { label: 'Total Cost', value: formatM(f.totalCostM), desc: 'Sum of projected annual cost over the 5-year horizon, in nominal terms.' },
                        { label: 'NPV', value: formatM(f.npvM), desc: 'Net Present Value: total discounted cash flows over the 5-year horizon, using a standard government discount rate.' },
                        { label: 'BCR', value: `${f.bcr}x`, desc: 'Benefit-Cost Ratio: estimated benefits divided by costs. Above 1.0 means the programme returns more than it spends.' },
                        { label: 'Cost/Beneficiary', value: `$${f.costPerBeneficiary.toLocaleString()}`, desc: 'Average lifetime cost per individual beneficiary served by the programme.' },
                        { label: 'Breakeven', value: `Year ${f.breakEvenYear}`, desc: 'The year cumulative benefits equal cumulative costs. Earlier breakeven = stronger fiscal case.' },
                      ].map((s) => (
                        <HoverInsight
                          key={s.label}
                          title={s.label}
                          description={s.desc}
                          wefRef="Section 4 (Operational Functions, p.34)"
                          jurisdiction={jurisdictionsForApp('fiscal')}
                        >
                          <div className="bg-slate-50 rounded-lg p-3 text-center cursor-help">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{s.value}</p>
                          </div>
                        </HoverInsight>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastChartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: '$M', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'Beneficiaries (K)', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
                          <Tooltip contentStyle={{ fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Area yAxisId="left" type="monotone" dataKey="cumulative" fill="#dbeafe" stroke="#93c5fd" name="Cumulative Cost (M)" />
                          <Bar yAxisId="left" dataKey="cost" fill="#2563eb" name="Annual Cost (M)" barSize={28} />
                          <Line yAxisId="right" type="monotone" dataKey="beneficiaries" stroke="#059669" strokeWidth={2} name="Beneficiaries (K)" dot={{ r: 4 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sensitivity note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide mb-1">Sensitivity Range</p>
                      <p className="text-xs text-amber-700">
                        Under optimistic assumptions (faster enrollment, lower unit costs), BCR reaches 2.6x with breakeven in Year 2.
                        Under pessimistic assumptions (30% cost overrun, slower uptake), BCR falls to 1.5x with breakeven in Year 4.
                        Central estimate remains robust at 2.1x.
                      </p>
                    </div>

                    {/* Data Sources footer */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-2">Data Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { app: 'PolicyAI', data: 'KidSTART policy proposal + enrollment targets' },
                          { app: 'FiscalAI', data: 'Historical cost models + inflation forecasts' },
                          { app: 'GovBench', data: 'OECD early childhood program benchmarks' },
                        ].map((src) => (
                          <HoverInsight
                            key={src.app}
                            title={`Data source — ${src.app}`}
                            description={`This forecast pulls from ${src.app}: ${src.data}.`}
                            wefRef="Annex A (Function index)"
                            jurisdiction={jurisdictionsForApp('fiscal')}
                          >
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-1 cursor-help">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span className="text-[10px] font-medium text-slate-700">{src.app}</span>
                              <span className="text-[10px] text-slate-400">{src.data}</span>
                            </div>
                          </HoverInsight>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </HoverInsight>
              </>
            )}
          </div>

          {/* ---- RIGHT: Sidebar ---- */}
          <div className="space-y-5">
            {/* Agent Status Card */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">FiscalAI Agent Status</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">3</p>
                  <p className="text-[10px] text-slate-400">Agents Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">203</p>
                  <p className="text-[10px] text-slate-400">Tasks Today</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">2.1s</p>
                  <p className="text-[10px] text-slate-400">Avg Latency</p>
                </div>
              </div>
            </div>

            <AgentStepSimulator
              steps={FISCAL_AGENT_STEPS}
              running={agentRunning}
              onComplete={() => setAgentRunning(false)}
              title="FiscalAI Agent"
            />
            <AgentActivityFeed entries={AGENT_ACTIVITY_LOG} filterApp="fiscal-ai" maxHeight="320px" compact />
            <CrossAppFlowDiagram activeApp="fiscal-ai" compact />
          </div>
        </div>
      </main>

    </div>
  );
}
