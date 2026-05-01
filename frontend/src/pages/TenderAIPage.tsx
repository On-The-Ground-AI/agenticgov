import { useState, useCallback } from 'react';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { AgentStepSimulator } from '../components/AgentStepSimulator';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { AGENT_ACTIVITY_LOG, SECTORS } from '../data/hukumaDemo';
import {
  TENDERS,
  TENDER_AGENT_STEPS,
  TENDER_TYPES,
  TENDER_PIPELINE,
  PIPELINE_STAGES,
  CROSS_APP_OUTPUTS,
  REASONING_TRACE,
  formatAED,
  type TenderType,
} from '../data/tenderAIDemo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Sector = (typeof SECTORS)[number];

const BRAND_GOLD = '#B8860B';
const BRAND_NAVY = '#334155';

const TABS = ['Workspace', 'Pipeline Monitor', 'Cross-App Intel'] as const;
type Tab = (typeof TABS)[number];

const RISK_CONFIG: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  low: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Low Risk', dot: 'bg-emerald-500' },
  medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Medium Risk', dot: 'bg-amber-500' },
  high: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'High Risk', dot: 'bg-red-500' },
};

const WEF_BADGES = [
  { id: '#06', label: 'Procurement' },
  { id: '#07', label: 'Contract Mgmt' },
  { id: '#41', label: 'Public Spending' },
];

const CROSS_APP_STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
  acknowledged: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Acknowledged' },
  'acted-on': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Acted On' },
};

// Pipeline summary stats
const pipelineTotalValue = TENDER_PIPELINE.reduce((s, t) => s + t.valueAED, 0);
const pipelineFlagged = TENDER_PIPELINE.filter(t => t.stage === 'flagged').length;
const pipelineProcessedToday = TENDER_PIPELINE.filter(t => t.detectedAt.startsWith('2026-04-28')).length;

export function TenderAIPage() {
  const [tab, setTab] = useState<Tab>('Workspace');
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedType, setSelectedType] = useState<TenderType | null>(null);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentComplete, setAgentComplete] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const tender = selectedSector && selectedType
    ? TENDERS.find(t => t.sector === selectedSector && t.type === selectedType) ?? null
    : null;

  const handleRunAgent = useCallback(() => {
    if (!tender) return;
    setAgentComplete(false);
    setAgentRunning(true);
  }, [tender]);

  const handleAgentComplete = useCallback(() => {
    setAgentRunning(false);
    setAgentComplete(true);
  }, []);

  const handleSectorChange = (s: Sector) => {
    setSelectedSector(s);
    setAgentComplete(false);
    setAgentRunning(false);
  };

  const handleTypeChange = (t: TenderType) => {
    setSelectedType(t);
    setAgentComplete(false);
    setAgentRunning(false);
  };

  const passedCount = tender ? tender.compliance.filter(c => c.passed).length : 0;
  const totalCount = tender ? tender.compliance.length : 0;

  const budgetChartData = tender
    ? [
        { name: 'Budget', value: tender.budgetAED},
        { name: 'OECD Avg', value: tender.oecdBenchmarkAED},
      ]
    : [];

  const avgOverrun = tender
    ? tender.similarTenders.reduce((s, t) => s + t.overrunPct, 0) / tender.similarTenders.length
    : 0;

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with stats */}
        <div className="mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: BRAND_NAVY }}>
              Tender<span style={{ color: BRAND_GOLD }}>AI</span>
            </h1>
            <div className="flex gap-1.5">
              {WEF_BADGES.map(b => (
                <span key={b.id} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {b.id} {b.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Procurement Intelligence Agent</p>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Tenders Processed', value: '156', sub: 'this quarter' },
              { label: 'Compliance Flags', value: '4', sub: 'active alerts' },
              { label: 'Value Monitored', value: '$4.2B', sub: 'FY 2026' },
              { label: 'Avg Compliance', value: '6.8/8', sub: '85% pass rate' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-lg border border-neutral-200 shadow-sm p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{s.value}</p>
                <p className="text-[10px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg border border-neutral-200 shadow-sm p-1 mb-5 w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? 'text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
              style={tab === t ? { backgroundColor: BRAND_GOLD } : undefined}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================================================================ */}
          {/* LEFT COLUMN                                                       */}
          {/* ================================================================ */}
          <div className="lg:col-span-2 space-y-5">

            {/* ============================================================== */}
            {/* WORKSPACE TAB                                                   */}
            {/* ============================================================== */}
            {tab === 'Workspace' && (
              <>
                {/* Sector selector */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sector</p>
                  <div className="flex flex-wrap gap-2">
                    {SECTORS.map(s => (
                      <button
                        key={s}
                        onClick={() => handleSectorChange(s)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                          selectedSector === s
                            ? 'text-white border-transparent'
                            : 'bg-white text-slate-600 border-neutral-200 hover:border-slate-300'
                        }`}
                        style={selectedSector === s ? { backgroundColor: BRAND_GOLD } : undefined}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tender type selector */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tender Type</p>
                  <div className="flex flex-wrap gap-2">
                    {TENDER_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => handleTypeChange(t.value)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                          selectedType === t.value
                            ? 'text-white border-transparent'
                            : 'bg-white text-slate-600 border-neutral-200 hover:border-slate-300'
                        }`}
                        style={selectedType === t.value ? { backgroundColor: BRAND_NAVY } : undefined}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* No match hint */}
                {selectedSector && selectedType && !tender && (
                  <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                    <p className="text-sm text-slate-500">No demo tender for <strong>{selectedSector}</strong> / <strong>{selectedType}</strong>. Try another combination.</p>
                  </div>
                )}

                {/* Tender details */}
                {tender && (
                  <div className="space-y-4">
                    {/* Title card */}
                    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                      <h2 className="text-sm font-bold text-slate-800 leading-snug">{tender.title}</h2>
                      <p className="text-xs text-slate-500 mt-1">{tender.ministry} &bull; {tender.daysToComplete} days &bull; {formatAED(tender.budgetAED)}</p>
                    </div>

                    {/* Budget vs OECD + Risk side-by-side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Budget chart */}
                      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                        <p className="text-xs font-semibold text-slate-600 mb-3">Budget vs OECD Benchmark</p>
                        <ResponsiveContainer width="100%" height={140}>
                          <BarChart data={budgetChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <XAxis type="number" tickFormatter={(v: number) => formatAED(v)} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={65} />
                            <Tooltip formatter={(v) => formatAED(Number(v) || 0)} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                              <Cell fill={BRAND_GOLD} />
                              <Cell fill="#64748B" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        {tender.budgetAED> tender.oecdBenchmarkAED&& (
                          <p className="text-[10px] text-amber-600 mt-1">
                            Budget is {((tender.budgetAED/ tender.oecdBenchmarkAED- 1) * 100).toFixed(1)}% above OECD benchmark
                          </p>
                        )}
                      </div>

                      {/* Risk card */}
                      <div className={`rounded-lg border shadow-sm p-4 ${RISK_CONFIG[tender.riskLevel].bg}`}>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Risk Assessment</p>
                        <p className={`text-lg font-bold ${RISK_CONFIG[tender.riskLevel].text}`}>
                          {RISK_CONFIG[tender.riskLevel].label}
                        </p>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Compliance</span>
                            <span className="font-medium">{passedCount}/{totalCount} passed</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg historical overrun</span>
                            <span className={`font-medium ${avgOverrun > 10 ? 'text-red-600' : avgOverrun > 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {avgOverrun > 0 ? '+' : ''}{avgOverrun.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timeline</span>
                            <span className="font-medium">{tender.daysToComplete} days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compliance checklist with confidence */}
                    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-600">Compliance Checklist</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          passedCount === totalCount ? 'bg-emerald-100 text-emerald-700' :
                          passedCount >= totalCount - 2 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {passedCount}/{totalCount} ({Math.round(passedCount / totalCount * 100)}%) — {passedCount >= totalCount - 1 ? 'High' : passedCount >= totalCount - 3 ? 'Medium' : 'Low'} confidence
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {tender.compliance.map((c, i) => (
                          <div key={i} className="flex items-start gap-2">
                            {c.passed ? (
                              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                            )}
                            <span className={`text-xs leading-relaxed ${c.passed ? 'text-slate-600' : 'text-red-700 font-medium'}`}>{c.item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Similar tenders table */}
                    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 overflow-x-auto">
                      <p className="text-xs font-semibold text-slate-600 mb-3">Similar Historical Tenders</p>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-neutral-100">
                            <th className="pb-2 pr-3 font-medium">Tender</th>
                            <th className="pb-2 pr-3 font-medium text-right">Budget</th>
                            <th className="pb-2 pr-3 font-medium text-right">Actual</th>
                            <th className="pb-2 font-medium text-right">Overrun</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tender.similarTenders.map((st, i) => (
                            <tr key={i} className="border-b border-neutral-50">
                              <td className="py-1.5 pr-3 text-slate-700">{st.title}</td>
                              <td className="py-1.5 pr-3 text-right text-slate-600">{formatAED(st.budgetAED)}</td>
                              <td className="py-1.5 pr-3 text-right text-slate-600">{formatAED(st.actualAED)}</td>
                              <td className={`py-1.5 text-right font-medium ${st.overrunPct > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {st.overrunPct > 0 ? '+' : ''}{st.overrunPct.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Run Agent button */}
                    {!agentRunning && !agentComplete && (
                      <button
                        onClick={handleRunAgent}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: BRAND_GOLD }}
                      >
                        Run Procurement Intelligence Agent
                      </button>
                    )}

                    {agentComplete && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                        <p className="text-sm font-semibold text-emerald-700">Agent analysis complete</p>
                        <p className="text-xs text-emerald-600 mt-1">
                          Procurement intelligence report ready. {passedCount}/{totalCount} compliance items passed. Average historical overrun: {avgOverrun.toFixed(1)}%.
                        </p>
                      </div>
                    )}

                    {/* Reasoning Trace — expandable */}
                    {agentComplete && (
                      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
                        <button
                          onClick={() => setShowReasoning(!showReasoning)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-xs font-semibold text-slate-700">Agent Reasoning Trace</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">{REASONING_TRACE.length} steps</span>
                          </div>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform ${showReasoning ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showReasoning && (
                          <div className="px-4 pb-4 space-y-3">
                            {REASONING_TRACE.map((r) => (
                              <div key={r.step} className="relative pl-6 border-l-2 border-slate-200">
                                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: BRAND_GOLD }} />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400">STEP {r.step}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      r.confidence >= 0.95 ? 'bg-emerald-100 text-emerald-700' :
                                      r.confidence >= 0.90 ? 'bg-blue-100 text-blue-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                      {Math.round(r.confidence * 100)}% conf.
                                    </span>
                                  </div>
                                  <p className="text-xs font-semibold text-slate-700">{r.action}</p>
                                  <p className="text-xs text-slate-500 leading-relaxed">{r.finding}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {r.sources.map((src, i) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500">
                                        {src}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ============================================================== */}
            {/* PIPELINE MONITOR TAB                                            */}
            {/* ============================================================== */}
            {tab === 'Pipeline Monitor' && (
              <div className="space-y-5">
                {/* Pipeline summary bar */}
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-semibold text-slate-700">
                      {pipelineProcessedToday} tenders processed today
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-red-600 font-medium">{pipelineFlagged} flagged</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600">{formatAED(pipelineTotalValue)} total value</span>
                  </div>
                </div>

                {/* Stage columns header */}
                <div className="grid grid-cols-5 gap-2">
                  {PIPELINE_STAGES.map((stage) => {
                    const count = TENDER_PIPELINE.filter(t => t.stage === stage.key).length;
                    return (
                      <div key={stage.key} className="text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${stage.color}`}>
                          {stage.label} ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Kanban-style columns */}
                <div className="grid grid-cols-5 gap-2 items-start">
                  {PIPELINE_STAGES.map((stage) => {
                    const items = TENDER_PIPELINE.filter(t => t.stage === stage.key);
                    return (
                      <div key={stage.key} className="space-y-2 min-h-[120px]">
                        {items.map((item) => (
                          <PipelineCard key={item.id} item={item} />
                        ))}
                        {items.length === 0 && (
                          <div className="bg-neutral-50 rounded-lg border border-dashed border-neutral-200 p-3 text-center">
                            <p className="text-[10px] text-slate-400">No tenders</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detail table below kanban */}
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 overflow-x-auto">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Pipeline Detail</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-neutral-100">
                        <th className="pb-2 pr-3 font-medium">Tender</th>
                        <th className="pb-2 pr-3 font-medium">Ministry</th>
                        <th className="pb-2 pr-3 font-medium text-right">Value</th>
                        <th className="pb-2 pr-3 font-medium text-center">Compliance</th>
                        <th className="pb-2 pr-3 font-medium text-center">Risk</th>
                        <th className="pb-2 font-medium">Agent Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TENDER_PIPELINE.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-50">
                          <td className="py-2 pr-3 text-slate-700 font-medium max-w-[180px]">
                            <p className="truncate">{item.title}</p>
                          </td>
                          <td className="py-2 pr-3 text-slate-500 whitespace-nowrap">{item.ministry.replace('Ministry of ', '')}</td>
                          <td className="py-2 pr-3 text-right text-slate-600 whitespace-nowrap">{formatAED(item.valueAED)}</td>
                          <td className="py-2 pr-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    item.complianceScore >= 7 ? 'bg-emerald-500' :
                                    item.complianceScore >= 5 ? 'bg-amber-500' :
                                    item.complianceScore > 0 ? 'bg-red-500' : 'bg-neutral-300'
                                  }`}
                                  style={{ width: `${(item.complianceScore / 8) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">{item.complianceScore}/8</span>
                            </div>
                          </td>
                          <td className="py-2 pr-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              RISK_CONFIG[item.riskLevel].bg.split(' ')[0]
                            } ${RISK_CONFIG[item.riskLevel].text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${RISK_CONFIG[item.riskLevel].dot}`} />
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="py-2 text-slate-500 max-w-[220px]">
                            <p className="truncate text-[10px]">{item.agentNote}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* CROSS-APP INTEL TAB                                             */}
            {/* ============================================================== */}
            {tab === 'Cross-App Intel' && (
              <div className="space-y-5">
                {/* Summary */}
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Cross-Application Intelligence Sharing</p>
                  <p className="text-xs text-slate-500">
                    TenderAI autonomously shares procurement intelligence with other AgenticGov apps. Below is the data exchange log from the last 24 hours.
                  </p>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {CROSS_APP_OUTPUTS.map((output, i) => {
                    const status = CROSS_APP_STATUS_CONFIG[output.status];
                    const appColors: Record<string, string> = {
                      'fiscal-ai': '#2563eb',
                      'transparency-ai': '#7c3aed',
                      'gov-bench': '#0891b2',
                      'policy-ai': '#059669',
                    };
                    const appNames: Record<string, string> = {
                      'fiscal-ai': 'FiscalAI',
                      'transparency-ai': 'TransparencyAI',
                      'gov-bench': 'GovBench',
                      'policy-ai': 'PolicyAI',
                    };
                    const time = new Date(output.timestamp).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={i} className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                                style={{ backgroundColor: appColors[output.targetApp] || '#64748b' }}
                              >
                                {appNames[output.targetApp] || output.targetApp}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">{output.dataType}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${status.bg} ${status.text}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{output.summary}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cross-app flow diagram */}
                <CrossAppFlowDiagram activeApp="tender-ai" />
              </div>
            )}
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN — Agent Sidebar                                      */}
          {/* ================================================================ */}
          <div className="space-y-4">
            {/* Agent status card */}
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-700">TenderAI Agent Status</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">2</p>
                  <p className="text-[9px] text-slate-400">Agents Active</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">156</p>
                  <p className="text-[9px] text-slate-400">Tasks Today</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">1.8s</p>
                  <p className="text-[9px] text-slate-400">Avg Latency</p>
                </div>
              </div>
            </div>

            <AgentStepSimulator
              steps={TENDER_AGENT_STEPS}
              running={agentRunning}
              onComplete={handleAgentComplete}
              title="TenderAI Agent"
            />
            <AgentActivityFeed
              entries={AGENT_ACTIVITY_LOG}
              filterApp="tender-ai"
              maxHeight="360px"
              compact
            />
            {tab !== 'Cross-App Intel' && (
              <CrossAppFlowDiagram activeApp="tender-ai" compact />
            )}
          </div>
        </div>
      </main>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Card sub-component
// ---------------------------------------------------------------------------

function PipelineCard({ item }: { item: (typeof TENDER_PIPELINE)[number] }) {
  const risk = RISK_CONFIG[item.riskLevel];
  return (
    <div className={`bg-white rounded-lg border shadow-sm p-2.5 ${
      item.stage === 'flagged' ? 'border-red-200' : 'border-neutral-200'
    }`}>
      <p className="text-[10px] font-semibold text-slate-700 leading-tight line-clamp-2">{item.title}</p>
      <p className="text-[9px] text-slate-400 mt-0.5 truncate">{item.ministry.replace('Ministry of ', '')}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] font-bold text-slate-600">{formatAED(item.valueAED)}</span>
        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold ${risk.bg.split(' ')[0]} ${risk.text}`}>
          <span className={`w-1 h-1 rounded-full ${risk.dot}`} />
          {item.riskLevel}
        </span>
      </div>
      {/* Compliance progress bar */}
      <div className="mt-1.5 flex items-center gap-1">
        <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              item.complianceScore >= 7 ? 'bg-emerald-500' :
              item.complianceScore >= 5 ? 'bg-amber-500' :
              item.complianceScore > 0 ? 'bg-red-500' : 'bg-neutral-300'
            }`}
            style={{ width: `${(item.complianceScore / 8) * 100}%` }}
          />
        </div>
        <span className="text-[8px] text-slate-400">{item.complianceScore}/8</span>
      </div>
    </div>
  );
}
