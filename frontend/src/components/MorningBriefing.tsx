import { useState } from 'react';
import { MORNING_BRIEFING, getAppColor, getAppName, type BriefingAction } from '../data/agenticDemo';
import { HoverInsight } from './HoverInsight';

const SEVERITY_STYLES = {
  critical: { border: 'border-l-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', icon: '🔴' },
  attention: { border: 'border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: '🟡' },
  info: { border: 'border-l-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: '🟢' },
} as const;

function DeepDetailModal({
  action,
  onClose,
}: {
  action: BriefingAction;
  onClose: () => void;
}) {
  const d = action.deepDetail;
  const appColor = getAppColor(action.app);

  return (
    <div
      className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 text-white px-6 py-4 flex items-start justify-between flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${appColor}30`, color: appColor }}
              >
                {getAppName(action.app)}
              </span>
              <span className="text-[10px] text-slate-400">{action.ministry}</span>
            </div>
            <h2 className="text-base font-bold leading-tight">{action.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition ml-4 flex-shrink-0 mt-0.5"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Summary</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{d.summary}</p>
          </section>

          {/* Agent Timeline */}
          {d.timeline.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Agent Timeline</h3>
              <div className="space-y-0">
                {d.timeline.map((step, i) => (
                  <div key={i} className="flex gap-3 relative">
                    {/* Vertical line */}
                    {i < d.timeline.length - 1 && (
                      <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200" />
                    )}
                    <div className="w-[15px] flex-shrink-0 flex justify-center pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white ring-1 ring-slate-200" />
                    </div>
                    <div className="pb-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {step.agent}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mt-0.5">{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Evidence */}
          {d.evidence.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Evidence</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Metric</th>
                      <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Value</th>
                      <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.evidence.map((ev, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-3 py-2 text-slate-700 font-medium">{ev.label}</td>
                        <td className="px-3 py-2 text-slate-800 font-semibold">{ev.value}</td>
                        <td className="px-3 py-2 text-slate-500 text-xs">{ev.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Affected Programs */}
          {d.affectedPrograms.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Affected Programs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {d.affectedPrograms.map((prog, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{prog.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-500">Budget: {prog.budget}</span>
                      <span className="text-[10px] text-slate-500">Impact: {prog.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Agent Recommendation */}
          {d.agentRecommendation && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent Recommendation</h3>
              <div className="bg-amber-50 border border-[#B8860B]/20 rounded-lg px-4 py-3">
                <p className="text-sm text-slate-800 leading-relaxed" style={{ borderLeft: '3px solid #B8860B', paddingLeft: '12px' }}>
                  {d.agentRecommendation}
                </p>
              </div>
            </section>
          )}

          {/* Related Flows */}
          {d.relatedFlows.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Related Flows</h3>
              <div className="flex flex-wrap gap-1.5">
                {d.relatedFlows.map((flow, i) => (
                  <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {flow}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Risk If Ignored */}
          {d.riskIfIgnored && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk If Ignored</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-800 leading-relaxed">{d.riskIfIgnored}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action, index }: { action: BriefingAction; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const style = SEVERITY_STYLES[action.severity];

  return (
    <>
      <div
        className={`border-l-4 ${style.border} ${style.bg} rounded-r-lg p-3 transition-all duration-300 cursor-pointer select-none`}
        style={{ animationDelay: `${index * 200}ms` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-2">
          <span className="text-sm flex-shrink-0 mt-0.5">{style.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <HoverInsight title={getAppName(action.app)} description={`This alert was generated by the ${getAppName(action.app)} agent domain, which monitors ${action.ministry} activities.`} meta={[{ label: 'Severity', value: action.severity }, { label: 'Ministry', value: action.ministry }]}>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${getAppColor(action.app)}15`, color: getAppColor(action.app) }}
                >
                  {getAppName(action.app)}
                </span>
              </HoverInsight>
              <span className="text-[10px] text-slate-500">{action.ministry}</span>
              {action.deadline && (
                <span className="text-[10px] font-medium text-red-600 ml-auto">Due: {action.deadline}</span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 mt-1">{action.title}</p>
            {action.metric && (
              <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 ${style.badge}`}>
                {action.metric}
              </span>
            )}

            {/* Expand chevron hint */}
            <div className="flex items-center gap-1 mt-1.5">
              <svg
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[10px] text-slate-400">{expanded ? 'Collapse' : 'Expand'}</span>
            </div>

            {expanded && (
              <div className="mt-2 animate-fadeIn">
                <p className="text-xs text-slate-600 leading-relaxed">{action.detail}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {action.actions.map((a) => (
                    <button
                      key={a}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalOpen(true);
                      }}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <DeepDetailModal
          action={action}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export function MorningBriefing() {
  const b = MORNING_BRIEFING;
  const criticalCount = b.actions.filter(a => a.severity === 'critical').length;
  const attentionCount = b.actions.filter(a => a.severity === 'attention').length;

  return (
    <div className="glass rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#B8860B]">AGENTICGOV</span>
              <span className="text-slate-300 font-normal">— Morning Briefing</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{b.date}</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {criticalCount > 0 && (
              <HoverInsight title="Critical Alerts" description="Issues requiring immediate executive attention. Critical alerts involve budget thresholds exceeded, compliance deadlines at risk, or cross-ministry conflicts detected." meta={[{ label: 'Response SLA', value: '< 2 hours' }]}>
                <span className="text-red-400 font-medium">{criticalCount} critical</span>
              </HoverInsight>
            )}
            {attentionCount > 0 && (
              <HoverInsight title="Attention Items" description="Issues flagged for review but not requiring immediate action. Typically involve emerging trends, minor variances, or upcoming deadlines." meta={[{ label: 'Response SLA', value: '< 24 hours' }]}>
                <span className="text-amber-400 font-medium">{attentionCount} attention</span>
              </HoverInsight>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-3">
          {([
            { label: 'Agents', value: b.overnightSummary.agents, hover: { title: 'Overnight Agents', description: 'Number of distinct AI agents that executed at least one task between 10 PM and 6 AM. Agents run autonomously on scheduled scans, monitoring loops, and triggered responses.', meta: [{ label: 'Always-on', value: 'Yes' }, { label: 'Human escalations', value: '2 overnight' }] } },
            { label: 'Tasks', value: b.overnightSummary.tasks, hover: { title: 'Overnight Tasks', description: 'Individual agent operations completed overnight — includes compliance scans, data pulls, anomaly checks, report drafts, and cross-ministry data syncs.', meta: [{ label: 'Success rate', value: '98.7%' }, { label: 'Avg latency', value: '1.2s' }] } },
            { label: 'Anomalies', value: b.overnightSummary.anomalies, hover: { title: 'Anomalies Detected', description: 'Statistically significant deviations from expected patterns identified by monitoring agents. Each anomaly is triaged by severity (critical/attention/info) and routed to the appropriate decision-maker.', meta: [{ label: 'Critical', value: '1' }, { label: 'Auto-resolved', value: '4 of 7' }] } },
            { label: 'Reports', value: b.overnightSummary.reports, hover: { title: 'Reports Generated', description: 'Automated reports produced overnight — includes transparency disclosures, budget variance analyses, benchmark updates, and compliance gap assessments.', meta: [{ label: 'Types', value: 'Transparency, Budget, Benchmark' }, { label: 'Distribution', value: 'Auto-sent to stakeholders' }] } },
            { label: 'Escalations', value: b.overnightSummary.escalations, hover: { title: 'Escalations to Human', description: 'Cases where agents determined that human judgment is required before proceeding. Escalation triggers include conflicting data, policy ambiguity, budget thresholds, and cross-ministry coordination.', meta: [{ label: 'Avg response time', value: '47 min' }, { label: 'Pending', value: '2' }] } },
          ] as const).map(s => (
            <HoverInsight key={s.label} title={s.hover.title} description={s.hover.description} meta={[...s.hover.meta]}>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-400">{s.label}</p>
              </div>
            </HoverInsight>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Actions</h3>
        {b.actions.map((action, i) => (
          <ActionCard key={action.id} action={action} index={i} />
        ))}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trends This Week</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {b.trends.map(t => {
            const trendDescriptions: Record<string, string> = {
              'Agent Efficiency': 'Percentage of agent tasks completed without errors or retries. Improving efficiency means agents are learning from feedback and reducing redundant operations.',
              'Avg Response Time': 'Mean time from anomaly detection to first agent response. Faster response times indicate better-tuned monitoring thresholds.',
              'Cross-App Flows': 'Number of automated data exchanges between different AgenticGov domains. Higher flow counts indicate deeper integration and more connected intelligence.',
              'Human Overrides': 'Cases where a human decision-maker changed the agent\'s recommendation. Lower override rates indicate better agent alignment with policy priorities.',
              'Compliance Score': 'Aggregate compliance rate across all monitored programs. Calculated from disclosure completeness, deadline adherence, and regulatory alignment.',
              'Cost Savings': 'Estimated cost reduction from agent automation versus manual processes. Calculated from time saved on report generation, data collection, and compliance monitoring.',
            };
            const trendDesc = trendDescriptions[t.label] || 'Weekly trend metric tracked across all AgenticGov agent domains.';
            return (
              <HoverInsight
                key={t.label}
                title={t.label}
                description={trendDesc}
                meta={[
                  { label: 'Trend', value: t.direction === 'up' ? 'Improving' : t.direction === 'down' ? 'Declining' : 'Stable' },
                  { label: 'Period', value: 'Last 7 days' },
                ]}
              >
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-slate-500">{t.label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-slate-800">{t.value}</span>
                    <span className={`text-[10px] font-medium ${t.good ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.direction === 'up' ? '↑' : t.direction === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              </HoverInsight>
            );
          })}
        </div>
      </div>
    </div>
  );
}
