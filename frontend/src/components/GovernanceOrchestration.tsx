import { useState, useEffect, useRef } from 'react';
import { HoverInsight } from './HoverInsight';
import {
  LIVE_FLOWS,
  ROUTING_RULES,
  FLOW_STATS,
  NETWORK_NODES,
  CABINET_AGENDA,
  NATIONAL_KPIS,
  type AgenticFlow,
  type FlowDirection,
  type TierLevel,
  type RoutingRule,
  type CabinetAgendaItem,
  type NationalKPI,
} from '../data/orchestrationDemo';
import { getAppColor, getAppName } from '../data/hukumaDemo';

type GovView = 'live-flows' | 'routing-logic' | 'cabinet-intel';

const VIEWS: { id: GovView; label: string; desc: string }[] = [
  { id: 'live-flows', label: 'Live Agent Flows', desc: 'Real-time pull / push / sync' },
  { id: 'routing-logic', label: 'Routing Intelligence', desc: 'How agents decide what flows where' },
  { id: 'cabinet-intel', label: 'Cabinet Intelligence', desc: 'National KPIs & agenda' },
];

const DIRECTION_STYLE: Record<FlowDirection, { label: string; color: string; bg: string; border: string; arrow: string; bgSolid: string }> = {
  pull: { label: 'PULL', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', arrow: '↓', bgSolid: '#3b82f6' },
  push: { label: 'PUSH', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', arrow: '↑', bgSolid: '#f59e0b' },
  sync: { label: 'SYNC', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', arrow: '↔', bgSolid: '#8b5cf6' },
};

const STATUS_STYLE: Record<string, { label: string; dot: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500 animate-pulse' },
  completed: { label: 'Done', dot: 'bg-slate-400' },
  'waiting-human': { label: 'Awaiting Human', dot: 'bg-amber-500 animate-pulse' },
  queued: { label: 'Queued', dot: 'bg-blue-400' },
};

const TIER_LABEL: Record<TierLevel, string> = {
  division: 'Division',
  ministry: 'Ministry',
  cabinet: 'Cabinet',
};

// ---------------------------------------------------------------------------
// Shared Modal Shell
// ---------------------------------------------------------------------------

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-white border-b border-neutral-100">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`text-[10px] uppercase tracking-wider font-semibold mb-2 ${color ?? 'text-slate-500'}`}>{children}</p>
  );
}

// ---------------------------------------------------------------------------
// Flow Detail Modal
// ---------------------------------------------------------------------------

function FlowDetailModal({ flow, onClose }: { flow: AgenticFlow; onClose: () => void }) {
  const dir = DIRECTION_STYLE[flow.direction];
  const status = STATUS_STYLE[flow.status];

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className={`flex-shrink-0 w-14 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white`} style={{ backgroundColor: dir.bgSolid }}>
          {dir.arrow} {dir.label}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-slate-800">{flow.action}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className="text-xs text-slate-500">{status.label}</span>
            <span className="text-xs text-slate-400">{flow.timestamp}</span>
            {flow.durationMs > 0 && <span className="text-xs text-slate-400">({(flow.durationMs / 1000).toFixed(1)}s)</span>}
            {flow.confidence && (
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{Math.round(flow.confidence * 100)}% confidence</span>
            )}
            {flow.hukumaApp && (
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: `${getAppColor(flow.hukumaApp)}15`, color: getAppColor(flow.hukumaApp) }}>
                {getAppName(flow.hukumaApp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flow path */}
      <div className={`${dir.bg} border ${dir.border} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-800">{flow.initiator}</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-500">{TIER_LABEL[flow.initiatorTier]}</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="h-px flex-1 bg-slate-300" />
            <span className={`mx-3 text-lg font-bold ${dir.color}`}>{dir.arrow}</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-800">{flow.target}</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-500">{TIER_LABEL[flow.targetTier]}</span>
          </div>
        </div>
      </div>

      {/* Why triggered */}
      <div className="mb-4">
        <SectionLabel>Why This Flow Was Triggered</SectionLabel>
        <div className="bg-slate-50 rounded-lg p-3 border border-neutral-200">
          <p className="text-xs text-slate-700 leading-relaxed">{flow.reason}</p>
        </div>
      </div>

      {flow.triggeredBy && (
        <div className="mb-4">
          <SectionLabel color="text-amber-600">Trigger Condition</SectionLabel>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-slate-700 leading-relaxed">{flow.triggeredBy}</p>
          </div>
        </div>
      )}

      {/* Data exchange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {flow.dataRequested && (
          <div>
            <SectionLabel color="text-blue-600">Data Requested</SectionLabel>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 h-full">
              <p className="text-xs text-slate-700 leading-relaxed">{flow.dataRequested}</p>
            </div>
          </div>
        )}
        {flow.dataDelivered && (
          <div>
            <SectionLabel color="text-emerald-600">Data Delivered</SectionLabel>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 h-full">
              <p className="text-xs text-slate-700 leading-relaxed">{flow.dataDelivered}</p>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

// ---------------------------------------------------------------------------
// Routing Rule Modal
// ---------------------------------------------------------------------------

function RoutingRuleModal({ rule, onClose }: { rule: RoutingRule; onClose: () => void }) {
  const dir = DIRECTION_STYLE[rule.direction];

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0 w-14 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: dir.bgSolid }}>
          {dir.arrow} {dir.label}
        </div>
        <div>
          <p className="text-base font-bold text-slate-800">{rule.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {TIER_LABEL[rule.fromTier]} {dir.arrow} {TIER_LABEL[rule.toTier]} &middot; Fires {rule.frequency}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <SectionLabel color={dir.color}>Trigger Condition</SectionLabel>
          <div className={`${dir.bg} border ${dir.border} rounded-lg p-4`}>
            <p className="text-xs text-slate-700 leading-relaxed">{rule.trigger}</p>
          </div>
        </div>
        <div>
          <SectionLabel color={dir.color}>Agent Action</SectionLabel>
          <div className={`${dir.bg} border ${dir.border} rounded-lg p-4`}>
            <p className="text-xs text-slate-700 leading-relaxed">{rule.agentAction}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel color="text-amber-600">Intelligence Condition (What Makes This Smart)</SectionLabel>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-slate-700 leading-relaxed">{rule.condition}</p>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel color="text-emerald-600">Last Time This Rule Fired</SectionLabel>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-xs text-slate-700 leading-relaxed">{rule.exampleFired}</p>
        </div>
      </div>

      <div>
        <SectionLabel>Flow Visualization</SectionLabel>
        <div className="bg-slate-50 rounded-lg p-4 border border-neutral-200 flex items-center justify-center gap-4">
          <div className="bg-white rounded-lg border border-neutral-200 px-4 py-2 text-center">
            <p className="text-[10px] text-slate-400 uppercase">{TIER_LABEL[rule.fromTier]}</p>
            <p className="text-xs font-semibold text-slate-800">Source Agent</p>
          </div>
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${dir.color}`}>{dir.arrow}</span>
            <span className={`text-[9px] font-medium ${dir.color}`}>{dir.label}</span>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 px-4 py-2 text-center">
            <p className="text-[10px] text-slate-400 uppercase">{TIER_LABEL[rule.toTier]}</p>
            <p className="text-xs font-semibold text-slate-800">Target Agent</p>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

// ---------------------------------------------------------------------------
// Cabinet Agenda Modal
// ---------------------------------------------------------------------------

function CabinetAgendaModal({ item, onClose }: { item: CabinetAgendaItem; onClose: () => void }) {
  const priorityColor = { urgent: '#ef4444', high: '#f59e0b', standard: '#3b82f6' }[item.priority];

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-1.5 h-16 rounded-full flex-shrink-0" style={{ backgroundColor: priorityColor }} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              item.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              item.priority === 'high' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>{item.priority}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
              item.type === 'decision' ? 'bg-purple-100 text-purple-700' :
              item.type === 'discussion' ? 'bg-cyan-100 text-cyan-700' :
              'bg-slate-100 text-slate-600'
            }`}>{item.type}</span>
            <span className="text-xs text-slate-500">{item.sourceMinistry}</span>
            {item.relatedMinistries.length > 0 && (
              <span className="text-xs text-slate-400">+ {item.relatedMinistries.join(', ')}</span>
            )}
          </div>
          <p className="text-lg font-bold text-slate-800">{item.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{Math.round(item.confidenceScore * 100)}% confidence</span>
            <span className="text-xs text-slate-400">{item.dataPoints} data points aggregated</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel>AI Summary</SectionLabel>
        <div className="bg-slate-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-sm text-slate-700 leading-relaxed">{item.aiSummary}</p>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel color="text-[#B8860B]">Agent Recommendation</SectionLabel>
        <div className="bg-[#B8860B]/5 rounded-lg p-4 border border-[#B8860B]/20">
          <p className="text-sm text-slate-800 leading-relaxed font-medium">{item.recommendation}</p>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel>Source AgenticGov Apps</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {item.hukumaApps.map(app => (
            <div key={app} className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 px-3 py-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getAppColor(app) }} />
              <span className="text-xs font-medium text-slate-700">{getAppName(app)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-neutral-200">
        <button className="text-xs font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Approve</button>
        <button className="text-xs font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition">Defer</button>
        <button className="text-xs font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition">Request More Info</button>
      </div>
    </ModalShell>
  );
}

// ---------------------------------------------------------------------------
// KPI Detail Modal
// ---------------------------------------------------------------------------

function KPIDetailModal({ kpi, onClose }: { kpi: NationalKPI; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase">{kpi.category}</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{kpi.name}</p>
          <p className="text-xs text-slate-500">{kpi.ownerMinistry} + {kpi.contributingMinistries.join(', ')}</p>
        </div>
        <div className="text-right">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-slate-800">{kpi.current}</span>
            <span className="text-sm text-slate-400 mb-1">/ {kpi.target2031} {kpi.unit}</span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${kpi.onTrack ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {kpi.onTrack ? 'On Track' : 'At Risk'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel>Progress to 2031 Target</SectionLabel>
        <div className="bg-slate-50 rounded-lg p-4 border border-neutral-200">
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min((kpi.current / kpi.target2031) * 100, 100)}%`, backgroundColor: kpi.onTrack ? '#22c55e' : '#eab308' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Current: {kpi.current} {kpi.unit}</span>
            <span>Target 2031: {kpi.target2031} {kpi.unit}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SectionLabel>AI Assessment</SectionLabel>
        <div className="bg-slate-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-sm text-slate-700 leading-relaxed">{kpi.aiAssessment}</p>
        </div>
      </div>

      <div>
        <SectionLabel>Trend Direction</SectionLabel>
        <div className={`rounded-lg p-3 border ${kpi.trend === 'improving' ? 'bg-emerald-50 border-emerald-200' : kpi.trend === 'declining' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-neutral-200'}`}>
          <span className={`text-sm font-bold ${kpi.trend === 'improving' ? 'text-emerald-600' : kpi.trend === 'declining' ? 'text-red-600' : 'text-slate-500'}`}>
            {kpi.trend === 'improving' ? '↑ Improving' : kpi.trend === 'declining' ? '↓ Declining' : '→ Stable'}
          </span>
        </div>
      </div>
    </ModalShell>
  );
}

// ---------------------------------------------------------------------------
// Stats Bar
// ---------------------------------------------------------------------------

function FlowStatsBar() {
  const stats = FLOW_STATS;
  const items = [
    { label: 'Pulls Today', value: stats.pullsToday, color: 'text-blue-700', desc: 'Top-down queries' },
    { label: 'Pushes Today', value: stats.pushesToday, color: 'text-amber-700', desc: 'Bottom-up alerts' },
    { label: 'Syncs Today', value: stats.syncsToday, color: 'text-violet-700', desc: 'Lateral coordination' },
    { label: 'Auto-Resolved', value: stats.autoResolvedToday, color: 'text-emerald-700', desc: 'No human needed' },
    { label: 'Human Pending', value: stats.humanDecisionsPending, color: 'text-red-600', desc: 'Awaiting decision' },
    { label: 'Data Points Routed', value: stats.dataPointsRouted.toLocaleString(), color: 'text-slate-700', desc: 'Across all tiers' },
  ];

  const insightData: Record<string, { title: string; description: string; meta: { label: string; value: string }[] }> = {
    'Pulls Today': {
      title: 'Pulls Today (Top-Down)',
      description: 'Number of times higher-tier agents (cabinet/ministry) proactively queried lower-tier agents for data. Pulls represent demand-driven intelligence — leadership asking agents for specific analysis.',
      meta: [{ label: 'Direction', value: '↓ Cabinet → Division' }, { label: 'Example', value: 'Cabinet requests education KPI update' }],
    },
    'Pushes Today': {
      title: 'Pushes Today (Bottom-Up)',
      description: 'Number of times division-level agents autonomously escalated findings to ministry or cabinet tiers. Pushes represent supply-driven intelligence — agents surfacing important discoveries without being asked.',
      meta: [{ label: 'Direction', value: '↑ Division → Cabinet' }, { label: 'Example', value: 'FiscalAI detects spending anomaly' }],
    },
    'Syncs Today': {
      title: 'Syncs Today (Lateral)',
      description: 'Number of peer-to-peer data exchanges between agents at the same tier. Syncs enable cross-ministry coordination — agents sharing relevant data without routing through cabinet.',
      meta: [{ label: 'Direction', value: '↔ Ministry ↔ Ministry' }, { label: 'Example', value: 'MoE and MoF sync budget data' }],
    },
    'Auto-Resolved': {
      title: 'Auto-Resolved',
      description: 'Issues that agents detected, analyzed, and resolved without requiring human intervention. High auto-resolution rates indicate well-calibrated agent autonomy boundaries.',
      meta: [{ label: 'Resolution types', value: 'Data corrections, routine updates, scheduled reports' }, { label: 'Target rate', value: '> 90%' }],
    },
    'Human Pending': {
      title: 'Human Decisions Pending',
      description: 'Active items where agents have completed analysis but require human judgment to proceed. These represent the critical human-in-the-loop touchpoints in the agentic system.',
      meta: [{ label: 'Avg wait time', value: '47 min' }, { label: 'Escalation threshold', value: '4 hours' }],
    },
    'Data Points Routed': {
      title: 'Data Points Routed',
      description: 'Total individual data elements (metrics, documents, alerts, scores) that have been automatically routed between agents across all tiers today. Represents the volume of intelligence flowing through the system.',
      meta: [{ label: 'Routing rules', value: '8 active' }, { label: 'Latency', value: '< 200ms avg' }],
    },
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {items.map(item => (
        <HoverInsight
          key={item.label}
          title={insightData[item.label].title}
          description={insightData[item.label].description}
          meta={insightData[item.label].meta}
        >
          <div className="bg-white rounded-lg border border-neutral-200 px-3 py-2 text-center">
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] font-medium text-slate-600">{item.label}</p>
            <p className="text-[9px] text-slate-400">{item.desc}</p>
          </div>
        </HoverInsight>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flow Network Diagram
// ---------------------------------------------------------------------------

function FlowNetworkDiagram({ highlightedFlow }: { highlightedFlow: AgenticFlow | null }) {
  const tiers: TierLevel[] = ['cabinet', 'ministry', 'division'];
  const tierY: Record<TierLevel, number> = { cabinet: 30, ministry: 110, division: 190 };
  const tierBg: Record<TierLevel, string> = { cabinet: '#fef3c7', ministry: '#dbeafe', division: '#f1f5f9' };

  const nodesByTier = (tier: TierLevel) => NETWORK_NODES.filter(n => n.tier === tier);

  const getNodeX = (nodeId: string): number => {
    for (const tier of tiers) {
      const nodes = nodesByTier(tier);
      const idx = nodes.findIndex(n => n.id === nodeId);
      if (idx >= 0) {
        const spacing = 700 / (nodes.length + 1);
        return spacing * (idx + 1);
      }
    }
    return 350;
  };

  const flowLines = LIVE_FLOWS.filter(f => f.status === 'active' || f.status === 'completed').slice(0, 6);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-3 overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-800">Agent Network — Bi-Directional Intelligence Flow</h4>
        <div className="flex gap-3">
          {(['pull', 'push', 'sync'] as FlowDirection[]).map(d => {
            const legendInsights: Record<FlowDirection, { title: string; description: string }> = {
              pull: {
                title: 'PULL — Top-Down Query',
                description: 'Higher-tier agent requests specific data or analysis from a lower-tier agent. Example: Cabinet Briefing Agent pulls latest education KPI data from MoE Strategy Agent.',
              },
              push: {
                title: 'PUSH — Bottom-Up Alert',
                description: 'Lower-tier agent autonomously escalates a finding to a higher tier. Example: FiscalAI Anomaly Detector pushes spending alert to MoF Fiscal Monitor.',
              },
              sync: {
                title: 'SYNC — Lateral Exchange',
                description: 'Agents at the same tier share data horizontally. Example: MoE Strategy Agent syncs education data with MoIAT AI Strategy Agent for cross-sector analysis.',
              },
            };
            return (
              <HoverInsight
                key={d}
                title={legendInsights[d].title}
                description={legendInsights[d].description}
              >
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${d === 'pull' ? 'bg-blue-500' : d === 'push' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                  <span className="text-[9px] text-slate-500">{DIRECTION_STYLE[d].arrow} {DIRECTION_STYLE[d].label}</span>
                </div>
              </HoverInsight>
            );
          })}
        </div>
      </div>
      <svg viewBox="0 0 700 240" className="w-full" style={{ minWidth: 500 }}>
        {tiers.map(tier => (
          <g key={tier}>
            <rect x={10} y={tierY[tier] - 15} width={680} height={60} rx={8} fill={tierBg[tier]} opacity={0.5} />
            <text x={20} y={tierY[tier] - 2} fontSize={9} fontWeight={600} fill="#64748b" textAnchor="start">{TIER_LABEL[tier].toUpperCase()}</text>
            {nodesByTier(tier).map((node, i) => {
              const nodes = nodesByTier(tier);
              const spacing = 680 / (nodes.length + 1);
              const cx = spacing * (i + 1);
              const cy = tierY[tier] + 22;
              const isHl = highlightedFlow && (highlightedFlow.initiator.includes(node.label.split(' ')[0]) || highlightedFlow.target.includes(node.label.split(' ')[0]));
              return (
                <g key={node.id} style={{ cursor: 'pointer' }}>
                  <title>{node.label} ({node.activeFlows} active flows)</title>
                  <circle cx={cx} cy={cy} r={14} fill={isHl ? '#B8860B' : node.type === 'human' ? '#475569' : '#fff'} stroke={isHl ? '#B8860B' : '#cbd5e1'} strokeWidth={1.5} />
                  {node.activeFlows > 0 && (
                    <circle cx={cx + 10} cy={cy - 10} r={6} fill="#22c55e"><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" /></circle>
                  )}
                  {node.activeFlows > 0 && <text x={cx + 10} y={cy - 7} fontSize={7} fill="#fff" textAnchor="middle" fontWeight={700}>{node.activeFlows}</text>}
                  <text x={cx} y={cy + 3} fontSize={7} fill={isHl ? '#fff' : node.type === 'human' ? '#fff' : '#334155'} textAnchor="middle" fontWeight={600}>
                    {node.label.length > 12 ? node.label.slice(0, 10) + '..' : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        {flowLines.map((flow, i) => {
          const fromNodes = NETWORK_NODES.filter(n => flow.initiator.toLowerCase().includes(n.label.split(' ')[0].toLowerCase()));
          const toNodes = NETWORK_NODES.filter(n => flow.target.toLowerCase().includes(n.label.split(' ')[0].toLowerCase()));
          if (fromNodes.length === 0 || toNodes.length === 0) return null;
          const from = fromNodes[0]; const to = toNodes[0];
          const x1 = getNodeX(from.id); const y1 = tierY[from.tier] + 22;
          const x2 = getNodeX(to.id); const y2 = tierY[to.tier] + 22;
          const color = flow.direction === 'pull' ? '#3b82f6' : flow.direction === 'push' ? '#f59e0b' : '#8b5cf6';
          const isActive = flow.status === 'active';
          const isHl = highlightedFlow?.id === flow.id;
          return (
            <g key={flow.id}>
              <defs><marker id={`arrow-${flow.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={color} /></marker></defs>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={isHl ? 2.5 : 1.5} strokeDasharray={isActive ? '4,3' : 'none'} opacity={isHl ? 1 : 0.5} markerEnd={`url(#arrow-${flow.id})`}>
                {isActive && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />}
              </line>
              <text x={(x1 + x2) / 2 + (i % 2 === 0 ? 8 : -8)} y={(y1 + y2) / 2} fontSize={7} fill={color} fontWeight={600} textAnchor="middle">{DIRECTION_STYLE[flow.direction].arrow}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flow Card — Entire card clickable, opens modal on second click
// ---------------------------------------------------------------------------

function FlowCard({ flow, isExpanded, onToggle, onOpenModal }: { flow: AgenticFlow; isExpanded: boolean; onToggle: () => void; onOpenModal: () => void }) {
  const dir = DIRECTION_STYLE[flow.direction];
  const status = STATUS_STYLE[flow.status];

  return (
    <div
      className={`rounded-lg border ${dir.border} ${dir.bg} p-3 transition-all cursor-pointer hover:shadow-md`}
      onClick={isExpanded ? onOpenModal : onToggle}
    >
      <div className="flex items-start gap-2">
        <div className={`flex-shrink-0 w-12 h-6 rounded flex items-center justify-center text-[10px] font-bold ${dir.color} bg-white border ${dir.border}`}>
          {dir.arrow} {dir.label}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
            <span className="text-[10px] text-slate-500">{status.label}</span>
            <span className="text-[10px] text-slate-400">{flow.timestamp}</span>
            {flow.durationMs > 0 && <span className="text-[10px] text-slate-400">({(flow.durationMs / 1000).toFixed(1)}s)</span>}
            {flow.hukumaApp && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: `${getAppColor(flow.hukumaApp)}15`, color: getAppColor(flow.hukumaApp) }}>
                {getAppName(flow.hukumaApp)}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">{flow.action}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
            <span className="font-medium">{flow.initiator}</span>
            <span className="text-slate-400">({TIER_LABEL[flow.initiatorTier]})</span>
            <span className={`mx-1 ${dir.color} font-bold`}>{dir.arrow}</span>
            <span className="font-medium">{flow.target}</span>
            <span className="text-slate-400">({TIER_LABEL[flow.targetTier]})</span>
          </div>
        </div>
        {flow.confidence && (
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold text-slate-800">{Math.round(flow.confidence * 100)}%</p>
            <p className="text-[9px] text-slate-400">confidence</p>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-2 text-[10px]">
          <div className="bg-white/70 rounded-md p-2.5 border border-neutral-200">
            <p className="text-slate-500 uppercase tracking-wider font-medium mb-0.5">Why this flow was triggered</p>
            <p className="text-slate-700 leading-relaxed">{flow.reason}</p>
          </div>
          {flow.dataDelivered && (
            <div className="bg-white/70 rounded-md p-2.5 border border-neutral-200">
              <p className="text-slate-500 uppercase tracking-wider font-medium mb-0.5">Data Delivered</p>
              <p className="text-slate-700 leading-relaxed">{flow.dataDelivered}</p>
            </div>
          )}
          <p className="text-[10px] text-slate-500 text-center mt-1">Click again for full detail view</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live Flows View
// ---------------------------------------------------------------------------

function LiveFlowsView() {
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);
  const [modalFlow, setModalFlow] = useState<AgenticFlow | null>(null);
  const [filterDir, setFilterDir] = useState<FlowDirection | 'all'>('all');
  const [highlightedFlow, setHighlightedFlow] = useState<AgenticFlow | null>(null);
  const [simulatedFlows, setSimulatedFlows] = useState<AgenticFlow[]>(LIVE_FLOWS);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1;
      const templates: AgenticFlow[] = [
        { id: `sim-${counterRef.current}`, direction: 'pull', status: 'active', initiator: 'Cabinet Briefing Agent', initiatorTier: 'cabinet', target: 'MoH Health Metrics Agent', targetTier: 'ministry', action: 'Pulling healthcare expenditure efficiency data', reason: 'PM Office flagged health sector for quarterly review — agent pre-fetching relevant KPIs', timestamp: 'Just now', durationMs: 0, hukumaApp: 'fiscal-ai' },
        { id: `sim-${counterRef.current}`, direction: 'push', status: 'completed', initiator: 'TenderAI Pipeline Monitor', initiatorTier: 'division', target: 'MoF Budget Agent', targetTier: 'ministry', action: 'Pushed new tender cost estimate for budget headroom check', reason: '$340M infrastructure tender entered pipeline — auto-forwarded to fiscal for budget impact', timestamp: 'Just now', durationMs: 1400, hukumaApp: 'tender-ai', confidence: 0.90 },
        { id: `sim-${counterRef.current}`, direction: 'sync', status: 'completed', initiator: 'GovBench Ranking Agent', initiatorTier: 'ministry', target: 'ReadinessMap Score Agent', targetTier: 'ministry', action: 'Synced latest ITU Cybersecurity Index update', reason: 'New ranking data published — auto-synced to update WEF function readiness scores', timestamp: 'Just now', durationMs: 2200, hukumaApp: 'gov-bench', confidence: 0.95 },
      ];
      const newFlow = templates[counterRef.current % templates.length];
      setSimulatedFlows(prev => [newFlow, ...prev.slice(0, 14)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filterDir === 'all' ? simulatedFlows : simulatedFlows.filter(f => f.direction === filterDir);

  return (
    <div className="space-y-4">
      <FlowStatsBar />
      <FlowNetworkDiagram highlightedFlow={highlightedFlow} />

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-medium">Filter:</span>
        {(['all', 'pull', 'push', 'sync'] as const).map(d => (
          <button
            key={d}
            onClick={() => setFilterDir(d)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition ${filterDir === d ? 'bg-slate-800 text-white' : 'bg-white border border-neutral-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {d === 'all' ? 'All Flows' : `${DIRECTION_STYLE[d].arrow} ${DIRECTION_STYLE[d].label}`}
          </button>
        ))}
        <span className="text-[10px] text-slate-400 ml-auto">{filtered.length} flows</span>
      </div>

      <div className="space-y-2">
        {filtered.map(flow => (
          <div key={flow.id} onMouseEnter={() => setHighlightedFlow(flow)} onMouseLeave={() => setHighlightedFlow(null)}>
            <FlowCard
              flow={flow}
              isExpanded={expandedFlow === flow.id}
              onToggle={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
              onOpenModal={() => setModalFlow(flow)}
            />
          </div>
        ))}
      </div>

      {modalFlow && <FlowDetailModal flow={modalFlow} onClose={() => setModalFlow(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Routing Rule Card — Full card clickable
// ---------------------------------------------------------------------------

function RoutingRuleCard({ rule, onOpenModal }: { rule: RoutingRule; onOpenModal: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const dir = DIRECTION_STYLE[rule.direction];

  return (
    <div
      className="bg-white rounded-lg border border-neutral-200 p-3 cursor-pointer hover:shadow-md transition-all"
      onClick={expanded ? onOpenModal : () => setExpanded(true)}
    >
      <div className="flex items-start gap-2">
        <div className={`flex-shrink-0 w-12 h-6 rounded flex items-center justify-center text-[10px] font-bold ${dir.color} ${dir.bg} border ${dir.border}`}>
          {dir.arrow} {dir.label}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800">{rule.name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{TIER_LABEL[rule.fromTier]} {dir.arrow} {TIER_LABEL[rule.toTier]} &middot; {rule.frequency}</p>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="flex-1 bg-slate-50 rounded-md p-2">
          <p className="text-[9px] text-slate-400 uppercase font-medium">Trigger</p>
          <p className="text-[10px] text-slate-700 mt-0.5">{rule.trigger}</p>
        </div>
        <div className="flex-1 bg-slate-50 rounded-md p-2">
          <p className="text-[9px] text-slate-400 uppercase font-medium">Agent Action</p>
          <p className="text-[10px] text-slate-700 mt-0.5">{rule.agentAction}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            <p className="text-[9px] text-amber-700 uppercase font-medium">Intelligence Condition</p>
            <p className="text-[10px] text-slate-700 mt-0.5">{rule.condition}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2">
            <p className="text-[9px] text-emerald-700 uppercase font-medium">Last Time This Fired</p>
            <p className="text-[10px] text-slate-700 mt-0.5">{rule.exampleFired}</p>
          </div>
          <p className="text-[10px] text-slate-500 text-center">Click again for full detail view</p>
        </div>
      )}
    </div>
  );
}

function RoutingLogicView() {
  const [modalRule, setModalRule] = useState<RoutingRule | null>(null);
  const pullRules = ROUTING_RULES.filter(r => r.direction === 'pull');
  const pushRules = ROUTING_RULES.filter(r => r.direction === 'push');
  const syncRules = ROUTING_RULES.filter(r => r.direction === 'sync');

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-[#B8860B] uppercase tracking-wider mb-2">What Makes This Agentic</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-700/50 rounded-md p-3">
            <p className="text-xs font-medium text-blue-400">↓ PULL — Top-Down Intelligence</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Higher tiers don't wait for reports. Cabinet and ministry agents proactively query divisions for specific data they need — skipping layers when urgency demands it.</p>
          </div>
          <div className="bg-slate-700/50 rounded-md p-3">
            <p className="text-xs font-medium text-amber-400">↑ PUSH — Bottom-Up Escalation</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Division agents autonomously detect anomalies and push alerts upward. Smart routing: single violations go to ministry, systemic patterns skip directly to cabinet.</p>
          </div>
          <div className="bg-slate-700/50 rounded-md p-3">
            <p className="text-xs font-medium text-violet-400">↔ SYNC — Lateral Coordination</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Peer agents share data automatically. When FiscalAI detects an anomaly, TransparencyAI already has the data to draft a disclosure — no human needs to coordinate.</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span className="text-sm">↓</span> Pull Rules — Higher Tiers Requesting Intel ({pullRules.length})
        </h4>
        <div className="space-y-2">{pullRules.map(r => <RoutingRuleCard key={r.id} rule={r} onOpenModal={() => setModalRule(r)} />)}</div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span className="text-sm">↑</span> Push Rules — Lower Tiers Escalating Autonomously ({pushRules.length})
        </h4>
        <div className="space-y-2">{pushRules.map(r => <RoutingRuleCard key={r.id} rule={r} onOpenModal={() => setModalRule(r)} />)}</div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span className="text-sm">↔</span> Sync Rules — Lateral Peer Coordination ({syncRules.length})
        </h4>
        <div className="space-y-2">{syncRules.map(r => <RoutingRuleCard key={r.id} rule={r} onOpenModal={() => setModalRule(r)} />)}</div>
      </div>

      {modalRule && <RoutingRuleModal rule={modalRule} onClose={() => setModalRule(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cabinet Intelligence View — Full card clickability + modals
// ---------------------------------------------------------------------------

function ProgressBar({ value, max = 100, color = '#B8860B' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function KPIBadge({ trend }: { trend: string }) {
  const conf = { improving: { icon: '↑', color: 'text-emerald-600' }, stable: { icon: '→', color: 'text-slate-400' }, declining: { icon: '↓', color: 'text-red-500' } };
  const c = conf[trend as keyof typeof conf] ?? conf.stable;
  return <span className={`text-[10px] font-bold ${c.color}`}>{c.icon}</span>;
}

function CabinetIntelView() {
  const [modalKPI, setModalKPI] = useState<NationalKPI | null>(null);
  const [modalAgenda, setModalAgenda] = useState<CabinetAgendaItem | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* National KPIs */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">National KPIs — National Vision 2031</h3>
        <p className="text-xs text-slate-500 mb-3">Click any KPI for detailed assessment</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NATIONAL_KPIS.map(kpi => (
            <div
              key={kpi.id}
              className={`rounded-lg border p-3 cursor-pointer hover:shadow-md transition-all ${kpi.onTrack ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300' : 'border-amber-200 bg-amber-50/50 hover:border-amber-300'}`}
              onClick={() => setModalKPI(kpi)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500 uppercase">{kpi.category}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${kpi.onTrack ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {kpi.onTrack ? 'On Track' : 'At Risk'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-1">{kpi.name}</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-lg font-bold text-slate-800">{kpi.current}</span>
                <span className="text-xs text-slate-400 mb-0.5">/ {kpi.target2031} {kpi.unit}</span>
                <KPIBadge trend={kpi.trend} />
              </div>
              <ProgressBar value={kpi.current} max={kpi.target2031} color={kpi.onTrack ? '#22c55e' : '#eab308'} />
              <p className="text-[9px] text-slate-500 mt-1.5">{kpi.ownerMinistry} · + {kpi.contributingMinistries.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cabinet Agenda */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Cabinet Agenda — Agent-Curated</h3>
        <p className="text-xs text-slate-500 mb-3">Click any item for full analysis</p>
        <div className="space-y-2">
          {CABINET_AGENDA.map(item => {
            const expanded = expandedItem === item.id;
            const priorityStyle = {
              urgent: 'border-l-red-500 bg-red-50/50 hover:bg-red-50',
              high: 'border-l-amber-500 bg-amber-50/50 hover:bg-amber-50',
              standard: 'border-l-blue-500 bg-blue-50/30 hover:bg-blue-50/50',
            }[item.priority];
            return (
              <div
                key={item.id}
                className={`border-l-4 ${priorityStyle} rounded-r-lg border border-neutral-200 p-3 cursor-pointer hover:shadow-md transition-all`}
                onClick={() => expanded ? setModalAgenda(item) : setExpandedItem(item.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        item.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>{item.priority}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        item.type === 'decision' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'discussion' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                      }`}>{item.type}</span>
                      <span className="text-[10px] text-slate-500">{item.sourceMinistry}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{item.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-medium text-slate-600">{Math.round(item.confidenceScore * 100)}%</p>
                    <p className="text-[9px] text-slate-400">{item.dataPoints} data pts</p>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-2 space-y-2">
                    <div className="bg-white rounded-md p-2.5 border border-neutral-200">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">AI Summary</p>
                      <p className="text-[10px] text-slate-600 leading-relaxed">{item.aiSummary}</p>
                    </div>
                    <div className="bg-[#B8860B]/5 rounded-md p-2.5 border border-[#B8860B]/20">
                      <p className="text-[10px] text-[#B8860B] uppercase tracking-wider font-medium mb-0.5">Recommendation</p>
                      <p className="text-[10px] text-slate-700 leading-relaxed">{item.recommendation}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-500">Source apps:</span>
                      {item.hukumaApps.map(app => (
                        <span key={app} className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: `${getAppColor(app)}15`, color: getAppColor(app) }}>
                          {getAppName(app)}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">Click again for full detail view</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalKPI && <KPIDetailModal kpi={modalKPI} onClose={() => setModalKPI(null)} />}
      {modalAgenda && <CabinetAgendaModal item={modalAgenda} onClose={() => setModalAgenda(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function GovernanceOrchestration() {
  const [view, setView] = useState<GovView>('live-flows');

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Agentic Governance Intelligence</h2>
          <p className="text-[10px] text-slate-500">Bi-directional agent flows: higher tiers pull intel, lower tiers push alerts, peers sync automatically</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-lg border border-neutral-200 p-1 w-fit">
        {VIEWS.map(v => {
          const viewInsights: Record<GovView, { title: string; description: string }> = {
            'live-flows': {
              title: 'Live Agent Flows',
              description: 'Real-time visualization of intelligence flowing between agents across cabinet, ministry, and division tiers. Each flow card shows direction (pull/push/sync), the agents involved, and what data is being exchanged.',
            },
            'routing-logic': {
              title: 'Routing Intelligence',
              description: 'The rules engine that determines how agents automatically route intelligence between tiers. Each rule defines trigger conditions, which agent responds, and what action is taken — without human intervention.',
            },
            'cabinet-intel': {
              title: 'Cabinet Intelligence',
              description: 'National-level KPIs and cabinet agenda items enriched by agent intelligence. Shows how agent analysis feeds directly into cabinet decision-making and national performance tracking.',
            },
          };
          return (
            <HoverInsight
              key={v.id}
              title={viewInsights[v.id].title}
              description={viewInsights[v.id].description}
            >
              <button
                onClick={() => setView(v.id)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${view === v.id ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="font-medium">{v.label}</span>
                <span className={`block text-[9px] font-normal mt-0.5 ${view === v.id ? 'text-slate-300' : 'text-slate-400'}`}>{v.desc}</span>
              </button>
            </HoverInsight>
          );
        })}
      </div>

      {view === 'live-flows' && <LiveFlowsView />}
      {view === 'routing-logic' && <RoutingLogicView />}
      {view === 'cabinet-intel' && <CabinetIntelView />}
    </div>
  );
}
