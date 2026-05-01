import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { AgentStepSimulator } from '../components/AgentStepSimulator';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { HoverInsight } from '../components/HoverInsight';
import { AGENT_ACTIVITY_LOG } from '../data/agenticDemo';
import {
  PROGRAMS_DISCLOSURE,
  GENERATED_REPORT,
  TRANSPARENCY_AGENT_STEPS,
  DEADLINE_TRACKER,
  REPORT_DATA_SOURCES,
  QUALITY_RECOMMENDATIONS,
  FISCAL_ANOMALY,
} from '../data/transparencyAIDemo';

const WEF_BENCHMARK = 85;

type Tab = 'tracker' | 'generator' | 'scorer';

const TAB_META: Record<Tab, { label: string; desc: string; wef: string }> = {
  tracker: {
    label: 'Compliance Tracker',
    desc: 'Live deadline view of every disclosure obligation across ministries — due date, days remaining, completion percentage and the agent action currently in flight on each. Plus a per-programme card showing the 8-dimension disclosure checklist.',
    wef: 'Functions 8, 20, 47 (Transparency)',
  },
  generator: {
    label: 'Disclosure Generator',
    desc: 'Auto-drafted transparency report for a chosen programme. Shows which AgenticGov apps populated which fields, the auto-populated %, the agent\'s recommendations, and an editable preview of the generated report.',
    wef: 'Section 5.3 (Disclosure quality, p.46)',
  },
  scorer: {
    label: 'Report Scorer',
    desc: 'Quality-improvement view: agent suggests dimension-level uplifts to push the lowest-scoring programme toward the 85% WEF benchmark, and ranks every programme on a single bar chart vs the benchmark threshold.',
    wef: 'Section 5.3 (Disclosure quality, p.46)',
  },
};

function qualityBadge(q: 'strong' | 'moderate' | 'weak') {
  if (q === 'strong') return 'bg-green-100 text-green-700';
  if (q === 'moderate') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function completenessColor(pct: number) {
  if (pct >= 85) return '#22C55E';
  if (pct >= 70) return '#F59E0B';
  return '#EF4444';
}

function deadlineStatusBadge(status: 'on-track' | 'at-risk' | 'overdue') {
  if (status === 'on-track') return 'bg-green-100 text-green-700';
  if (status === 'at-risk') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

export function TransparencyAIPage() {
  const [tab, setTab] = useState<Tab>('tracker');
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS_DISCLOSURE[0].id);
  const [agentRunning, setAgentRunning] = useState(false);

  const sorted = [...PROGRAMS_DISCLOSURE].sort((a, b) => b.overallCompleteness - a.overallCompleteness);
  const selectedProg = PROGRAMS_DISCLOSURE.find(p => p.id === selectedProgram) ?? PROGRAMS_DISCLOSURE[0];

  const scorerData = sorted.map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
    fullName: p.name,
    score: p.overallCompleteness,
    benchmark: WEF_BENCHMARK,
  }));

  const onTrackCount = DEADLINE_TRACKER.filter(d => d.status === 'on-track').length;
  const atRiskCount = DEADLINE_TRACKER.filter(d => d.status === 'at-risk').length;
  const overdueCount = DEADLINE_TRACKER.filter(d => d.status === 'overdue').length;

  const totalAutoPopulated = REPORT_DATA_SOURCES.reduce((sum, s) => sum + s.fieldsPopulated, 0);
  const totalFields = REPORT_DATA_SOURCES.reduce((sum, s) => sum + s.totalFields, 0);
  const autoPopulatedPct = Math.round((totalAutoPopulated / totalFields) * 100);

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              <span className="text-red-600">TransparencyAI</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Disclosure Compliance & Transparency Reporting</p>
          </div>
          <HoverInsight
            title="Run a live agent scan"
            description="Trigger TransparencyAI's compliance scan: re-evaluates every ministry's disclosure deadlines, recomputes the 8-dimension completeness score for each programme, and refreshes the auto-populated report draft. Watch the right-hand sidebar for the step-by-step trace."
            wefRef="Section 5 (Oversight Layer, p.42)"
          >
            <button
              onClick={() => setAgentRunning(true)}
              disabled={agentRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              {agentRunning ? 'Scanning…' : '▶ Run scan'}
            </button>
          </HoverInsight>
        </div>

        {/* Monitoring Header */}
        <div className="mb-4 glass rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <HoverInsight
            title="Ministries monitored"
            description="Total number of ministries currently under TransparencyAI's automated disclosure-deadline surveillance. Each ministry exposes its reporting calendar; the agent checks completion daily."
            wefRef="Functions 8, 20, 47 (Transparency)"
          >
            <div className="flex items-center gap-2 cursor-help">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700">Monitoring {DEADLINE_TRACKER.length} ministries</span>
            </div>
          </HoverInsight>
          <div className="h-4 w-px bg-neutral-200" />
          <HoverInsight
            title="Reports on track"
            description="Disclosure reports whose progress matches their deadline pace. The agent expects no escalation needed; daily digests will continue."
            wefRef="Section 5 (Oversight Layer, p.42)"
          >
            <span className="text-xs font-medium text-green-600 cursor-help">{onTrackCount} on track</span>
          </HoverInsight>
          <div className="h-4 w-px bg-neutral-200" />
          <HoverInsight
            title="Reports at risk"
            description="Reports whose completion percentage is below pace for the days remaining. Surfaces in the daily digest and routes to a compliance officer for nudge."
            wefRef="Section 5 (Oversight Layer, p.42)"
          >
            <span className="text-xs font-medium text-amber-600 cursor-help">{atRiskCount} approaching deadline</span>
          </HoverInsight>
          <div className="h-4 w-px bg-neutral-200" />
          {overdueCount > 0 && (
            <>
              <HoverInsight
                title="Overdue reports"
                description="Reports whose statutory deadline has passed without submission. Triggers an immediate alert to the ministry compliance officer and is logged in the public transparency record."
                wefRef="Section 5.3 (Disclosure quality, p.46)"
              >
                <span className="text-xs font-bold text-red-600 cursor-help">{overdueCount} overdue</span>
              </HoverInsight>
              <div className="h-4 w-px bg-neutral-200" />
            </>
          )}
          <HoverInsight
            title="Next upcoming deadline"
            description="The earliest disclosure deadline still ahead of us — sets the priority for the next agent run."
            wefRef="Functions 8, 20, 47 (Transparency)"
          >
            <span className="text-xs text-slate-500 cursor-help">Next deadline: {DEADLINE_TRACKER.filter(d => d.daysRemaining > 0).sort((a, b) => a.daysRemaining - b.daysRemaining)[0]?.dueDate ?? 'N/A'}</span>
          </HoverInsight>
        </div>

        {/* Fiscal Anomaly Alert Banner */}
        <HoverInsight
          title="Inbound fiscal anomaly alert"
          description={`A live signal pushed to TransparencyAI by ${FISCAL_ANOMALY.source} (confidence ${FISCAL_ANOMALY.confidence}%). The card lets the user route the anomaly into the next quarterly report, escalate to legal review, or request more detail from FiscalAI.`}
          wefRef="Section 5 (Oversight Layer, p.42)"
        >
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg px-5 py-3 cursor-help">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-red-800">Fiscal Anomaly Alert</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-800">from {FISCAL_ANOMALY.source}</span>
                <span className="text-[10px] font-medium text-red-600">Confidence: {FISCAL_ANOMALY.confidence}%</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">{FISCAL_ANOMALY.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                  Add to Quarterly Report
                </button>
                <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-red-300 text-red-700 hover:bg-red-50 transition-colors">
                  Route to Legal Review
                </button>
                <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-slate-600 hover:bg-neutral-50 transition-colors">
                  Request Details from FiscalAI
                </button>
              </div>
            </div>
          </div>
        </div>
        </HoverInsight>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-neutral-200 p-1 shadow-sm">
          {(['tracker', 'generator', 'scorer'] as Tab[]).map(t => (
            <HoverInsight
              key={t}
              title={TAB_META[t].label}
              description={TAB_META[t].desc}
              wefRef={TAB_META[t].wef}
            >
              <button
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === t ? 'text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                style={tab === t ? { backgroundColor: '#DC2626' } : undefined}
              >
                {TAB_META[t].label}
              </button>
            </HoverInsight>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="min-w-0">

            {/* ---- Compliance Tracker ---- */}
            {tab === 'tracker' && (
              <div className="space-y-4">
                {/* Deadline Tracker Table */}
                <HoverInsight
                  title="Upcoming disclosure deadlines"
                  description="Live table of every ministry's pending disclosure obligations — due date, days remaining, completion percentage, and the agent action in flight. Use this to triage which ministries need a human nudge."
                  wefRef="Functions 8, 20, 47 (Transparency)"
                >
                <div className="glass rounded-xl shadow-sm overflow-hidden cursor-help">
                  <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Upcoming Deadlines</h3>
                      <p className="text-[10px] text-slate-400">Proactive monitoring across all ministries</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-slate-500">Auto-tracking</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-neutral-50 text-left">
                          <th className="px-4 py-2.5 font-semibold text-slate-600">Ministry</th>
                          <th className="px-4 py-2.5 font-semibold text-slate-600">Report</th>
                          <th className="px-4 py-2.5 font-semibold text-slate-600 text-center">Due</th>
                          <th className="px-4 py-2.5 font-semibold text-slate-600 text-center">Status</th>
                          <th className="px-4 py-2.5 font-semibold text-slate-600 text-center">Progress</th>
                          <th className="px-4 py-2.5 font-semibold text-slate-600">Agent Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {DEADLINE_TRACKER.sort((a, b) => a.daysRemaining - b.daysRemaining).map((d, i) => (
                          <tr key={i} className={`hover:bg-neutral-50 transition-colors ${d.status === 'overdue' ? 'bg-red-50/50' : ''}`}>
                            <td className="px-4 py-2.5">
                              <p className="font-medium text-slate-800 text-[11px]">{d.ministry}</p>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600 max-w-[160px] truncate">{d.reportType}</td>
                            <td className="px-4 py-2.5 text-center">
                              <p className="text-slate-700 font-medium">{d.dueDate}</p>
                              <p className={`text-[10px] font-bold ${d.daysRemaining < 0 ? 'text-red-600' : d.daysRemaining <= 14 ? 'text-amber-600' : 'text-slate-400'}`}>
                                {d.daysRemaining < 0 ? `${Math.abs(d.daysRemaining)}d overdue` : `${d.daysRemaining}d remaining`}
                              </p>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${deadlineStatusBadge(d.status)}`}>
                                {d.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <div className="flex items-center gap-2 justify-center">
                                <div className="w-16 h-1.5 rounded-full bg-neutral-200">
                                  <div
                                    className="h-1.5 rounded-full"
                                    style={{ width: `${d.completionPct}%`, backgroundColor: completenessColor(d.completionPct) }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">{d.completionPct}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-[10px] text-slate-500 max-w-[200px]">{d.agentAction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </HoverInsight>

                {/* Existing programme cards */}
                {sorted.map(p => (
                  <HoverInsight
                    key={p.id}
                    title={`${p.name} — disclosure card`}
                    description={`Disclosure-completeness card for ${p.name} (${p.ministry}). Shows the overall completeness score, evidence-quality rating (${p.evidenceQuality}) and the 8-dimension WEF disclosure checklist with per-dimension scores. Open gaps: ${p.evidenceGaps.length}.`}
                    wefRef="Section 5.3 (Disclosure quality, p.46)"
                  >
                  <div className="glass rounded-xl shadow-sm p-5 cursor-help">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{p.name}</h3>
                        <p className="text-[10px] text-slate-400">{p.ministry}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${qualityBadge(p.evidenceQuality)}`}>
                          {p.evidenceQuality}
                        </span>
                        <span className="text-xs text-slate-400">{p.evidenceGaps.length} gap{p.evidenceGaps.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Completeness bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-2.5 rounded-full bg-neutral-200">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{ width: `${p.overallCompleteness}%`, backgroundColor: completenessColor(p.overallCompleteness) }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ color: completenessColor(p.overallCompleteness) }}>
                        {p.overallCompleteness}%
                      </span>
                    </div>

                    {/* 8-dimension checklist */}
                    <div className="grid grid-cols-4 gap-2">
                      {p.dimensions.map(d => (
                        <div key={d.name} className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${d.complete ? 'bg-green-500' : 'bg-red-400'}`} />
                          <span className="text-[10px] text-slate-500 truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{d.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </HoverInsight>
                ))}
              </div>
            )}

            {/* ---- Disclosure Generator ---- */}
            {tab === 'generator' && (
              <div className="space-y-4">
                <HoverInsight
                  title="Programme selector"
                  description="Pick the programme TransparencyAI should auto-draft a transparency report for. Selection scopes the data-sources panel, the recommendation list, and the generated-report preview below."
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm p-4 cursor-help">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Programme</label>
                  <select
                    value={selectedProgram}
                    onChange={e => setSelectedProgram(e.target.value)}
                    className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    {PROGRAMS_DISCLOSURE.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                </HoverInsight>

                {/* Data Sources Panel */}
                <HoverInsight
                  title="Auto-population data sources"
                  description={`Breakdown of which sibling AgenticGov apps populated which fields of the auto-generated report. ${autoPopulatedPct}% of fields came from existing platform data; the remainder requires manual ministry input.`}
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm overflow-hidden cursor-help">
                  <div className="px-5 py-3 border-b border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Data Sources</h3>
                        <p className="text-[10px] text-slate-400">Where the auto-generated content came from</p>
                      </div>
                      <span className="text-xs font-bold text-green-600">{autoPopulatedPct}% auto-populated</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {REPORT_DATA_SOURCES.map((src, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2">
                        <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: src.appColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: src.appColor }}>{src.app}</span>
                            <span className="text-[10px] text-slate-400">{src.dataType}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-20 h-1.5 rounded-full bg-neutral-200">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${(src.fieldsPopulated / src.totalFields) * 100}%`,
                                  backgroundColor: src.appColor,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500">{src.fieldsPopulated}/{src.totalFields} fields</span>
                            <span className="text-[10px] text-slate-400">Updated {src.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-blue-50 border-t border-blue-100">
                    <p className="text-[10px] text-blue-700 font-medium">
                      {autoPopulatedPct}% of this report was auto-generated from data already in the AgenticGov platform. Remaining {100 - autoPopulatedPct}% requires manual ministry input.
                    </p>
                  </div>
                </div>
                </HoverInsight>

                {/* Selected programme summary */}
                <HoverInsight
                  title={`Programme summary — ${selectedProg.name}`}
                  description={`Headline metrics for the chosen programme: completeness ${selectedProg.overallCompleteness}% vs WEF benchmark ${WEF_BENCHMARK}%, evidence quality ${selectedProg.evidenceQuality}, and the agent's prioritised list of recommendations to lift the score.`}
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm p-5 cursor-help">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-slate-800">{selectedProg.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${qualityBadge(selectedProg.evidenceQuality)}`}>
                      {selectedProg.evidenceQuality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Completeness: {selectedProg.overallCompleteness}% | WEF Benchmark: {WEF_BENCHMARK}%</p>
                  {selectedProg.recommendations.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Recommendations</p>
                      <ul className="space-y-1">
                        {selectedProg.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                </HoverInsight>

                {/* Generated report */}
                <HoverInsight
                  title="Auto-generated transparency report"
                  description="Editable preview of the disclosure report TransparencyAI drafted for the selected programme. Reviewers can approve the draft, request edits or route it on for ministerial sign-off — the agent handles the heavy lifting of pulling fields from sibling apps."
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm overflow-hidden cursor-help">
                  <div className="px-5 py-3 bg-red-600 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Auto-Generated Transparency Report</h3>
                      <p className="text-[10px] text-red-100">KidSTART Programme Example</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="text-[10px] font-bold px-2 py-1 rounded bg-white/20 text-white hover:bg-white/30 transition-colors">
                        Approve Draft
                      </button>
                      <button className="text-[10px] font-bold px-2 py-1 rounded bg-white/20 text-white hover:bg-white/30 transition-colors">
                        Request Edits
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {GENERATED_REPORT}
                    </pre>
                  </div>
                </div>
                </HoverInsight>
              </div>
            )}

            {/* ---- Report Scorer ---- */}
            {tab === 'scorer' && (
              <div className="space-y-6">
                {/* Quality Improvement Recommendations */}
                <HoverInsight
                  title="Quality improvement recommendations"
                  description="Per-dimension uplift suggestions for the weakest-scoring programme. Each row shows current score, target score and whether the supporting data is already available in the platform (auto-populate) or requires manual ministry input."
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm overflow-hidden cursor-help">
                  <div className="px-5 py-3 border-b border-neutral-100">
                    <h3 className="text-sm font-bold text-slate-800">Quality Improvement Recommendations</h3>
                    <p className="text-[10px] text-slate-400">Agent-suggested improvements for weakest-scoring programme (National Telemedicine Hub)</p>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {QUALITY_RECOMMENDATIONS.map((rec, i) => (
                      <div key={i} className="px-5 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-bold text-slate-800">{rec.dimension}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-red-500 font-bold">{rec.currentScore}</span>
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="text-[10px] text-green-600 font-bold">{rec.targetScore}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed mb-1.5">{rec.recommendation}</p>
                        <div className="flex items-center gap-2">
                          {rec.dataAvailable ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Data available from {rec.sourceApp}
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                              Manual input required
                            </span>
                          )}
                          {rec.dataAvailable && (
                            <button className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                              Auto-populate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </HoverInsight>

                <HoverInsight
                  title="Programme disclosure vs WEF benchmark"
                  description={`Bar chart of every programme's disclosure-completeness score against the WEF transparency benchmark (${WEF_BENCHMARK}%). Bars are coloured by traffic-light: green ≥${WEF_BENCHMARK}%, amber ≥70%, red below 70%.`}
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm p-5 cursor-help">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Programme Disclosure vs WEF Benchmark</h3>
                  <p className="text-[10px] text-slate-400 mb-4">
                    WEF transparency benchmark threshold: {WEF_BENCHMARK}% (dashed line)
                  </p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={scorerData} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={35} />
                      <Tooltip
                        formatter={(value) => [`${Number(value) || 0}%`, 'Score'] as [string, string]}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                      />
                      <ReferenceLine y={WEF_BENCHMARK} stroke="#DC2626" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: `WEF ${WEF_BENCHMARK}%`, position: 'right', fontSize: 10, fill: '#DC2626' }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {scorerData.map((entry, i) => (
                          <Cell key={i} fill={entry.score >= WEF_BENCHMARK ? '#22C55E' : entry.score >= 70 ? '#F59E0B' : '#EF4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                </HoverInsight>

                {/* Programme ranking table */}
                <HoverInsight
                  title="Programme ranking table"
                  description="Sortable view of every programme: disclosure score, delta vs WEF benchmark, evidence-quality rating and number of open gaps. The single best place to triage which disclosures to invest reviewer time in."
                  wefRef="Section 5.3 (Disclosure quality, p.46)"
                >
                <div className="glass rounded-xl shadow-sm overflow-hidden cursor-help">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-red-600 text-white text-left">
                        <th className="px-5 py-3 font-semibold">Programme</th>
                        <th className="px-5 py-3 font-semibold text-center">Score</th>
                        <th className="px-5 py-3 font-semibold text-center">vs Benchmark</th>
                        <th className="px-5 py-3 font-semibold text-center">Evidence</th>
                        <th className="px-5 py-3 font-semibold text-center">Gaps</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sorted.map(p => {
                        const diff = p.overallCompleteness - WEF_BENCHMARK;
                        return (
                          <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-5 py-3">
                              <p className="font-medium text-slate-800">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.ministry}</p>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className="font-bold" style={{ color: completenessColor(p.overallCompleteness) }}>
                                {p.overallCompleteness}%
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={`text-xs font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {diff >= 0 ? '+' : ''}{diff}%
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${qualityBadge(p.evidenceQuality)}`}>
                                {p.evidenceQuality}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center text-sm text-slate-600">
                              {p.evidenceGaps.length}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </HoverInsight>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <AgentStepSimulator
              steps={TRANSPARENCY_AGENT_STEPS}
              running={agentRunning}
              onComplete={() => setAgentRunning(false)}
              title="TransparencyAI Agent"
            />
            <AgentActivityFeed
              entries={AGENT_ACTIVITY_LOG}
              filterApp="transparency-ai"
              maxHeight="280px"
              compact
            />
            <CrossAppFlowDiagram activeApp="transparency-ai" compact />
          </div>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-8 pb-4">
          This dashboard is advisory only. All data shown is for demonstration purposes.
        </p>
      </main>
    </div>
  );
}
