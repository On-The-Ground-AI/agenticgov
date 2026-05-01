import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { AgentStepSimulator } from '../components/AgentStepSimulator';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { AGENT_ACTIVITY_LOG } from '../data/hukumaDemo';
import {
  GLOBAL_RANKINGS,
  PEER_BENCHMARKS,
  NATIONAL_INNOVATIONS,
  GOVBENCH_AGENT_STEPS,
  RANKING_ALERTS,
  GOVBENCH_MONITORING,
  CROSS_APP_OUTPUTS,
} from '../data/govBenchDemo';

const BRAND_NAVY = '#334155';
const BRAND_GOLD = '#B8860B';
const SECTORS = ['Education', 'Healthcare', 'Energy', 'Technology', 'Economy', 'Defense'] as const;

type Tab = 'dashboard' | 'peer' | 'practice';

export function GovBenchPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sector, setSector] = useState<string>('Education');
  const [agentRunning, setAgentRunning] = useState(false);

  const sectorBenchmarks = PEER_BENCHMARKS.filter(b => b.sector === sector);

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            <span style={{ color: '#0891B2' }}>GovBench</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">National Governance Benchmarking & Peer Intelligence</p>
        </div>

        {/* Monitoring Header */}
        <div className="mb-6 bg-white rounded-lg border border-neutral-200 shadow-sm px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">Tracking {GOVBENCH_MONITORING.indicesTracked} governance indices</span>
          </div>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-xs text-slate-500">Last scan: {GOVBENCH_MONITORING.lastFullScan}</span>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-xs font-medium text-blue-600">{GOVBENCH_MONITORING.newDataDetected} new data release</span>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-xs font-medium text-red-600">{GOVBENCH_MONITORING.rankingChanges} ranking change detected</span>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-xs text-slate-500">{GOVBENCH_MONITORING.practicesIdentified} practices identified</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-neutral-200 p-1 shadow-sm">
          {([
            { key: 'dashboard' as Tab, label: 'National Dashboard' },
            { key: 'peer' as Tab, label: 'Peer Benchmarking' },
            { key: 'practice' as Tab, label: 'Practice Assessor' },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key ? 'text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
              style={tab === t.key ? { backgroundColor: '#0891B2' } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="min-w-0">

            {/* ---- Dashboard ---- */}
            {tab === 'dashboard' && (
              <div className="space-y-6">
                {/* Ranking Change Alerts */}
                {RANKING_ALERTS.map(alert => (
                  <div
                    key={alert.index}
                    className="bg-white rounded-xl border-2 border-red-200 shadow-sm overflow-hidden"
                  >
                    {/* Alert header */}
                    <div className="bg-red-50 px-5 py-3 flex items-center justify-between gap-3 border-b border-red-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-red-800">Ranking Change Detected</p>
                          <p className="text-[10px] text-red-600">{alert.index}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-lg font-bold text-slate-500 line-through">#{alert.previousRank}</span>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                        <span className="text-lg font-bold text-red-600">#{alert.currentRank}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Overtaken by */}
                      {alert.countriesOvertakenBy.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Overtaken by</p>
                          <div className="flex flex-wrap gap-2">
                            {alert.countriesOvertakenBy.map(c => (
                              <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Analysis */}
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Agent Analysis</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{alert.analysis}</p>
                      </div>

                      {/* Transferable Policies */}
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Transferable Policy Recommendations</p>
                        <div className="space-y-2">
                          {alert.transferablePolicies.map((pol, i) => (
                            <div key={i} className="rounded-lg border border-neutral-200 p-3">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800">{pol.policy}</p>
                                  <p className="text-[10px] text-slate-400">{pol.country}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                  pol.transferability === 'HIGH'
                                    ? 'bg-green-100 text-green-700'
                                    : pol.transferability === 'MEDIUM'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {pol.transferability}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{pol.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                          Share with TDRA Minister
                        </button>
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-slate-700 hover:bg-neutral-50 transition-colors">
                          Route to Policy Team
                        </button>
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-slate-700 hover:bg-neutral-50 transition-colors">
                          Defer to Next Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rankings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GLOBAL_RANKINGS.map(r => {
                    const pct = r.maxScore <= 1
                      ? r.jurisdictionScore * 100
                      : (r.jurisdictionScore / r.maxScore) * 100;
                    const isTop10 = r.jurisdictionRank <= 10;
                    return (
                      <div
                        key={r.index}
                        className={`bg-white rounded-xl border shadow-sm p-5 ${
                          isTop10 ? 'border-amber-300 ring-1 ring-amber-200' : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-800 leading-tight">{r.index}</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{r.organization} ({r.yearUpdated})</p>
                          </div>
                          {isTop10 && (
                            <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: BRAND_GOLD }}>
                              Top 10
                            </span>
                          )}
                        </div>

                        <div className="flex items-end gap-3 mb-2">
                          <span className="text-2xl font-bold" style={{ color: isTop10 ? BRAND_GOLD : BRAND_NAVY }}>
                            #{r.jurisdictionRank}
                          </span>
                          <span className="text-sm text-slate-500 mb-0.5">
                            of {r.totalCountries} countries
                          </span>
                          <span className={`mb-0.5 text-xs font-medium ${
                            r.trend === 'up' ? 'text-green-600' : r.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                          }`}>
                            {r.trend === 'up' ? 'Improving' : r.trend === 'down' ? 'Declining' : 'Stable'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span>Score: {r.maxScore <= 1 ? (r.jurisdictionScore * 100).toFixed(1) + '%' : r.jurisdictionScore}</span>
                          <span className="text-slate-300">|</span>
                          <span>Max: {r.maxScore <= 1 ? '100%' : r.maxScore}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-200">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: isTop10 ? BRAND_GOLD : '#94A3B8' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- Peer Benchmarking ---- */}
            {tab === 'peer' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Sector</label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Agent Analysis Panel */}
                <div className="bg-cyan-50 rounded-xl border border-cyan-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <p className="text-xs font-bold text-cyan-800">Agent Analysis: {sector} Sector</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-cyan-600 mt-0.5 flex-shrink-0 font-bold">1.</span>
                      <p className="text-[10px] text-cyan-700 leading-relaxed">
                        Identified {sectorBenchmarks.length} comparable metrics across 5 peer nations (Singapore, South Korea, Estonia, Denmark, Finland)
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-cyan-600 mt-0.5 flex-shrink-0 font-bold">2.</span>
                      <p className="text-[10px] text-cyan-700 leading-relaxed">
                        leads in {sectorBenchmarks.filter(b => {
                          const maxPeer = Math.max(...b.peers.map(p => p.value));
                          return b.jurisdictionValue >= maxPeer;
                        }).length} of {sectorBenchmarks.length} metrics for this sector
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-cyan-600 mt-0.5 flex-shrink-0 font-bold">3.</span>
                      <p className="text-[10px] text-cyan-700 leading-relaxed">
                        Cross-referenced with PolicyAI impact data and ReadinessMap capability assessments for contextual scoring
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-cyan-600 mt-0.5 flex-shrink-0 font-bold">4.</span>
                      <p className="text-[10px] text-cyan-700 leading-relaxed">
                        Confidence: <span className="font-bold">87%</span> -- based on data recency and source reliability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs text-amber-800 italic">
                    <span className="font-semibold not-italic">Note:</span> Benchmarking is framed as learning opportunities from leading jurisdictions, not deficit reporting.
                  </p>
                </div>

                {sectorBenchmarks.map(b => {
                  const chartData = [
                    { name: 'Demo', value: b.jurisdictionValue },
                    ...b.peers.map(p => ({ name: p.country, value: p.value })),
                  ];
                  return (
                    <div key={b.metric} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-slate-800">{b.metric}</h3>
                        <span className="text-[10px] text-slate-400">{b.unit}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">Source: {b.source}</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 10 }} width={45} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, i) => (
                              <Cell key={i} fill={entry.name === 'Demo' ? BRAND_GOLD : '#94A3B8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---- Practice Assessor ---- */}
            {tab === 'practice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NATIONAL_INNOVATIONS.map(inn => (
                  <div key={inn.title} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3" style={{ backgroundColor: '#0891B2' }}>
                      <h3 className="text-sm font-bold text-white">{inn.title}</h3>
                      <p className="text-[10px] text-cyan-100 mt-0.5">{inn.ministry} | {inn.year}</p>
                    </div>
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">{inn.description}</p>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Impact</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{inn.impact}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Transferability</p>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                          inn.transferability.startsWith('HIGH')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inn.transferability.split(' - ')[0]}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {inn.transferability.includes(' - ') ? inn.transferability.split(' - ')[1] : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Agent Status Card */}
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-800">Agent Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-neutral-50 p-2">
                  <p className="text-lg font-bold text-slate-800">2</p>
                  <p className="text-[10px] text-slate-500">Agents Active</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-2">
                  <p className="text-lg font-bold text-slate-800">93</p>
                  <p className="text-[10px] text-slate-500">Tasks Today</p>
                </div>
              </div>
            </div>

            {/* Cross-App Outputs */}
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-xs font-bold text-slate-800">Cross-App Intelligence Sent</p>
                <p className="text-[10px] text-slate-400">{CROSS_APP_OUTPUTS.length} outputs today</p>
              </div>
              <div className="divide-y divide-neutral-100">
                {CROSS_APP_OUTPUTS.map((out, i) => (
                  <div key={i} className="px-4 py-2.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold" style={{ color: out.targetAppColor }}>{out.targetApp}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        out.status === 'acknowledged' ? 'bg-green-100 text-green-700' :
                        out.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {out.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">{out.description}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{out.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setAgentRunning(true)}
              disabled={agentRunning}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#0891B2' }}
            >
              {agentRunning ? 'Agent Running...' : 'Run GovBench Agent'}
            </button>
            <AgentStepSimulator
              steps={GOVBENCH_AGENT_STEPS}
              running={agentRunning}
              onComplete={() => setAgentRunning(false)}
              title="GovBench Agent"
            />
            <AgentActivityFeed
              entries={AGENT_ACTIVITY_LOG}
              filterApp="gov-bench"
              maxHeight="280px"
              compact
            />
            <CrossAppFlowDiagram activeApp="gov-bench" compact />
          </div>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-8 pb-4">
          This dashboard is advisory only. All data shown is for demonstration purposes.
        </p>
      </main>
    </div>
  );
}
