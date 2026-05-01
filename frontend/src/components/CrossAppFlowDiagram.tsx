import { useNavigate } from 'react-router-dom';
import { HoverInsight } from './HoverInsight';
import { HUKUMA_APPS, DATA_FLOWS, getAppName, type AppId } from '../data/hukumaDemo';

interface CrossAppFlowDiagramProps {
  activeApp?: AppId;
  highlightedFlows?: string[];
  compact?: boolean;
}

const APP_POSITIONS: Record<AppId, { x: number; y: number }> = {
  'policy-ai': { x: 80, y: 60 },
  'causalis': { x: 80, y: 160 },
  'tender-ai': { x: 280, y: 40 },
  'fiscal-ai': { x: 280, y: 120 },
  'transparency-ai': { x: 280, y: 200 },
  'readiness-map': { x: 480, y: 60 },
  'gov-bench': { x: 480, y: 160 },
};

export function CrossAppFlowDiagram({ activeApp, highlightedFlows = [], compact = false }: CrossAppFlowDiagramProps) {
  const navigate = useNavigate();
  const width = compact ? 400 : 580;
  const height = compact ? 180 : 260;
  const scale = compact ? 0.68 : 1;

  const relevantFlows = activeApp
    ? DATA_FLOWS.filter(f => f.from === activeApp || f.to === activeApp)
    : DATA_FLOWS;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      {!compact && (
        <HoverInsight
          title="Cross-App Data Flow Map"
          description="Interactive visualization of how data flows between all 7 AgenticGov agent domains. Lines show automated data exchanges — click any app node to navigate to that domain. Gold highlighted lines show active flows."
          meta={[{ label: 'Apps connected', value: '7' }, { label: 'Active flows', value: 'Real-time' }]}
        >
          <div className="px-3 py-2 bg-slate-800 border-b border-slate-700">
            <span className="text-xs font-medium text-slate-300">Cross-App Data Flow</span>
          </div>
        </HoverInsight>
      )}
      <svg viewBox={`0 0 ${width / scale} ${height / scale}`} className="w-full" style={{ maxHeight: height }}>
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#475569" />
          </marker>
          <marker id="arrowhead-active" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#B8860B" />
          </marker>
        </defs>

        {relevantFlows.map((flow, i) => {
          const from = APP_POSITIONS[flow.from];
          const to = APP_POSITIONS[flow.to];
          if (!from || !to) return null;
          const isHighlighted = highlightedFlows.includes(`${flow.from}-${flow.to}`) || activeApp === flow.from;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx / len) * 30;
          const offsetY = (dy / len) * 30;

          return (
            <g key={i}>
              <title>{flow.label}: Data flow from {getAppName(flow.from)} to {getAppName(flow.to)}</title>
              <line
                x1={from.x + offsetX}
                y1={from.y + offsetY}
                x2={to.x - offsetX}
                y2={to.y - offsetY}
                stroke={isHighlighted ? '#B8860B' : '#334155'}
                strokeWidth={isHighlighted ? 1.5 : 0.75}
                strokeDasharray={isHighlighted ? '' : '4 3'}
                markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                opacity={isHighlighted ? 0.9 : 0.3}
              >
                {isHighlighted && (
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
                )}
              </line>
              {isHighlighted && !compact && (
                <text x={midX} y={midY - 6} textAnchor="middle" className="text-[7px] fill-slate-500">{flow.label}</text>
              )}
            </g>
          );
        })}

        {HUKUMA_APPS.map((app) => {
          const pos = APP_POSITIONS[app.id];
          if (!pos) return null;
          const isActive = activeApp === app.id;
          return (
            <g
              key={app.id}
              onClick={() => navigate(app.route)}
              className="cursor-pointer"
            >
              <title>{app.name} — {app.description} ({app.agentCount} agents)</title>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 26 : 22}
                fill={isActive ? app.color : '#1E293B'}
                stroke={isActive ? '#B8860B' : app.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                opacity={isActive ? 1 : 0.85}
              />
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={30} fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" from="28" to="34" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[9px] font-semibold ${isActive ? 'fill-white' : 'fill-slate-300'}`}
              >
                {app.name.length > 10 ? app.name.slice(0, 9) + '…' : app.name}
              </text>
              {!compact && (
                <text
                  x={pos.x}
                  y={pos.y + 38}
                  textAnchor="middle"
                  className="text-[7px] fill-slate-600"
                >
                  {app.agentCount} agents
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
