import { useState } from 'react';
import { DECISION_QUEUE, getAppColor, getAppName, formatTimestamp, type DecisionItem } from '../data/hukumaDemo';
import { HoverInsight } from './HoverInsight';

const SEVERITY_DOT = {
  critical: 'bg-red-500 animate-pulse',
  attention: 'bg-amber-500',
  info: 'bg-blue-400',
} as const;

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 85 ? 'text-emerald-600 bg-emerald-50' : pct >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const label = pct >= 85 ? 'High' : pct >= 50 ? 'Medium' : 'Low';
  return (
    <HoverInsight
      title="Agent Confidence"
      description="How certain the investigating agent is about its finding. Based on evidence completeness, data source reliability, and cross-validation with other agents. Higher confidence means the agent found strong, corroborated evidence."
      meta={[{ label: 'High', value: '≥85% — Strong evidence' }, { label: 'Medium', value: '50-84% — Partial evidence' }, { label: 'Low', value: '<50% — Uncertain' }]}
    >
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${color}`}>
        {label} ({pct}%)
      </span>
    </HoverInsight>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const barColor = pct >= 85 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-500 font-medium tabular-nums w-8 text-right">{pct}%</span>
    </div>
  );
}

function InvestigationModal({
  item,
  onClose,
  onResolve,
}: {
  item: DecisionItem;
  onClose: () => void;
  onResolve: () => void;
}) {
  const deep = item.deepDetail;

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
        <div className="sticky top-0 bg-slate-800 text-white p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${getAppColor(item.app)}30`, color: getAppColor(item.app) }}
              >
                {getAppName(item.app)}
              </span>
              <ConfidenceBadge confidence={item.confidence} />
            </div>
            <h2 className="text-sm font-semibold leading-snug">{item.title}</h2>
            <p className="text-[10px] text-slate-300 mt-1">{formatTimestamp(item.detectedAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 -mt-1 -mr-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* 1. Investigation Chain */}
          <section>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Investigation Chain</h3>
            <div className="relative pl-5">
              {/* Vertical connector line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
              <div className="space-y-3">
                {deep.investigationChain.map((step, i) => (
                  <div key={i} className="relative">
                    {/* Step dot */}
                    <div className="absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                      <span className="text-[7px] font-bold text-slate-500">{step.step}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-[#B8860B] bg-[#B8860B]/10 px-1.5 py-0.5 rounded">
                          {step.agent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{step.finding}</p>
                      <div className="mt-2">
                        <ConfidenceBar confidence={step.confidence} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Decision Options */}
          <section>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Decision Options</h3>
            <div className="grid gap-2">
              {deep.options.map((opt, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${
                    opt.recommendation
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-800">{opt.label}</span>
                    {opt.recommendation && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Risk:</span>
                    <span className={`text-[10px] font-medium ${
                      opt.risk.toLowerCase() === 'low' ? 'text-emerald-600' :
                      opt.risk.toLowerCase() === 'medium' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {opt.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Affected Stakeholders */}
          <section>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Affected Stakeholders</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Role</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {deep.affectedStakeholders.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-3 py-2 text-slate-800 font-medium">{s.role}</td>
                      <td className="px-3 py-2 text-slate-600">{s.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Evidence Sources */}
          <section>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Evidence Sources</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Source</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Data Points</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {deep.evidenceSources.map((src, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-3 py-2 text-slate-800 font-medium">{src.source}</td>
                      <td className="px-3 py-2 text-slate-600 tabular-nums">{src.dataPoints.toLocaleString()}</td>
                      <td className="px-3 py-2 text-slate-500">{src.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Precedents */}
          <section>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Historical Precedents</h3>
            <ul className="space-y-1.5">
              {deep.precedents.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="text-[#B8860B] mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onResolve();
                onClose();
              }}
              className="text-xs font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Approve
            </button>
            <button
              onClick={onClose}
              className="text-xs font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
            >
              Defer
            </button>
            <button
              onClick={onClose}
              className="text-xs font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
            >
              Request More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionCard({ item }: { item: DecisionItem }) {
  const [expanded, setExpanded] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (resolved) {
    return (
      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="text-xs text-emerald-700 font-medium">Resolved: {item.title}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Clickable card body */}
        <div
          className="p-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-2">
            <HoverInsight
              title={item.severity === 'critical' ? 'Critical Severity' : item.severity === 'attention' ? 'Attention Required' : 'Informational'}
              description={item.severity === 'critical' ? 'Requires immediate executive attention. Involves budget thresholds, compliance deadlines, or systemic risks that could affect multiple programs.' : item.severity === 'attention' ? 'Flagged for review within 24 hours. Involves emerging patterns, moderate variances, or upcoming deadlines.' : 'No action required — provided for awareness. Agent has auto-resolved or the issue is within acceptable parameters.'}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${SEVERITY_DOT[item.severity]}`} />
            </HoverInsight>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${getAppColor(item.app)}15`, color: getAppColor(item.app) }}
                >
                  {getAppName(item.app)}
                </span>
                <ConfidenceBadge confidence={item.confidence} />
                <span className="text-[10px] text-slate-400 ml-auto">{formatTimestamp(item.detectedAt)}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 mt-1">{item.title}</p>

              {/* Layer 1: Expanded inline detail */}
              {expanded && (
                <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                  <div className="bg-slate-50 rounded-md px-3 py-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Agent Recommendation</p>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">{item.suggestedAction}</p>
                  </div>
                  {item.deadline && (
                    <p className="text-[10px] text-red-600 font-medium">Deadline: {item.deadline}</p>
                  )}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-[10px] font-medium text-[#B8860B] hover:text-[#9A7209] transition flex items-center gap-1 mt-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    View Full Investigation
                  </button>
                </div>
              )}

              {/* Collapse/expand hint */}
              <div className="flex items-center gap-1 mt-1.5">
                <svg
                  className={`w-3 h-3 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span className="text-[10px] text-slate-400">{expanded ? 'Collapse' : 'Expand details'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons — separate from clickable body */}
        <div
          className="flex items-center gap-2 px-3 pb-3 pt-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setModalOpen(true)}
            className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Approve
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
          >
            Defer
          </button>
        </div>
      </div>

      {/* Layer 2: Full investigation modal */}
      {modalOpen && (
        <InvestigationModal
          item={item}
          onClose={() => setModalOpen(false)}
          onResolve={() => setResolved(true)}
        />
      )}
    </>
  );
}

export function DecisionQueue() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <HoverInsight
            title="Human Decision Queue"
            description="Items where AI agents have completed their analysis but determined that human judgment is required before proceeding. Each item includes the agent's investigation chain, confidence score, and recommended action."
            meta={[{ label: 'Avg resolution', value: '2.3 hours' }, { label: 'Auto-resolved rate', value: '94%' }]}
          >
            <h3 className="text-sm font-semibold text-slate-800">Decision Queue</h3>
          </HoverInsight>
          <p className="text-[10px] text-slate-500">Items requiring human judgment</p>
        </div>
        <HoverInsight
          title="Pending Decisions"
          description="Number of items currently awaiting human review. Items are prioritized by severity (critical → attention → info) and sorted by detection time."
          meta={[{ label: 'Critical', value: '1' }, { label: 'Oldest', value: '6h ago' }]}
        >
          <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            {DECISION_QUEUE.length} pending
          </span>
        </HoverInsight>
      </div>
      {DECISION_QUEUE.map(item => (
        <DecisionCard key={item.id} item={item} />
      ))}
    </div>
  );
}
