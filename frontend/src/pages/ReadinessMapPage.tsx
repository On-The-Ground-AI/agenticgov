import { useState, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis, Cell } from 'recharts';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { AgentStepSimulator } from '../components/AgentStepSimulator';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { AGENT_ACTIVITY_LOG, HUKUMA_APPS } from '../data/hukumaDemo';
import type { WEFFunction } from '../data/hukumaDemo';
import {
  WEF_FUNCTIONS,
  TIER_COUNTS,
  MINISTERIAL_SCORECARDS,
  READINESS_AGENT_STEPS,
  TIER_COLORS,
  TIER_BG_CLASSES,
  DEPENDENCY_CHAINS,
  READINESS_PULSE,
  NEXT_BEST_ACTIONS,
  DEPLOYMENT_WAVES,
  MINISTERIAL_TRENDS,
} from '../data/readinessMapDemo';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = ['Readiness Map', 'Ministerial Scorecard', 'Deployment Waves'] as const;
type Tab = (typeof TABS)[number];

const STAT_ITEMS = [
  { label: 'HIGH readiness', count: TIER_COUNTS.HIGH, color: 'text-emerald-600', dot: 'bg-emerald-500' },
  { label: 'MEDIUM', count: TIER_COUNTS.MEDIUM, color: 'text-amber-600', dot: 'bg-amber-500' },
  { label: 'EMERGING', count: TIER_COUNTS.EMERGING, color: 'text-blue-600', dot: 'bg-blue-500' },
  { label: 'CAUTION', count: TIER_COUNTS.CAUTION, color: 'text-red-600', dot: 'bg-red-500' },
];

// ---------------------------------------------------------------------------
// Mini Sparkline (SVG)
// ---------------------------------------------------------------------------

function Sparkline({ data, color = '#7c3aed', width = 64, height = 20 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Scatter Tooltip
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const fn = payload[0].payload as WEFFunction;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-200 px-3 py-2 max-w-xs">
      <p className="text-sm font-semibold text-slate-800">#{fn.id} {fn.name}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{fn.category}</p>
      <div className="grid grid-cols-3 gap-2 mt-1.5 text-[11px]">
        <span>Potential: <b>{fn.potentialScore}</b></span>
        <span>Complexity: <b>{fn.complexityScore}</b></span>
        <span>Risk: <b>{fn.riskScore}</b></span>
      </div>
      <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${TIER_BG_CLASSES[fn.readinessTier]}`}>
        {fn.readinessTier}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readiness Pulse Banner
// ---------------------------------------------------------------------------

function ReadinessPulseBanner() {
  const pulse = READINESS_PULSE;
  const improvements = pulse.recentChanges.filter(c => c.from !== c.to && tierRank(c.to) > tierRank(c.from));
  const declines = pulse.recentChanges.filter(c => c.from !== c.to && tierRank(c.to) < tierRank(c.from));

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 mb-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-800">Weekly Readiness Pulse</span>
          <span className="text-xs text-slate-400">Last scan: {pulse.lastScan}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-600 font-semibold">{pulse.improved} improved</span>
          <span className="text-red-500 font-semibold">{pulse.declined} declined</span>
          <span className="text-slate-400">{pulse.stable} stable</span>
        </div>
      </div>

      {/* Recent changes */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {improvements.map(c => (
          <div key={c.functionId} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
            <span className="text-[10px] text-emerald-700 font-medium">#{c.functionId} {c.name}</span>
            <span className="text-[10px] text-slate-400">{c.from}</span>
            <span className="text-emerald-600 text-xs font-bold">&rarr;</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{c.to}</span>
          </div>
        ))}
        {declines.map(c => (
          <div key={c.functionId} className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-2 py-1">
            <span className="text-[10px] text-red-700 font-medium">#{c.functionId} {c.name}</span>
            <span className="text-[10px] text-slate-400">{c.from}</span>
            <span className="text-red-500 text-xs font-bold">&rarr;</span>
            <span className="text-[10px] text-red-700 font-semibold">{c.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function tierRank(tier: string): number {
  switch (tier) {
    case 'HIGH': return 4;
    case 'MEDIUM': return 3;
    case 'EMERGING': return 2;
    case 'CAUTION': return 1;
    default: return 0;
  }
}

// ---------------------------------------------------------------------------
// Function Detail Card (enhanced)
// ---------------------------------------------------------------------------

function FunctionDetailCard({ selected, onClose }: { selected: WEFFunction; onClose: () => void }) {
  const chain = DEPENDENCY_CHAINS.find(d => d.blockingFunction === selected.id);
  const blockedBy = DEPENDENCY_CHAINS.filter(d => d.blockedFunctions.includes(selected.id));
  const nba = NEXT_BEST_ACTIONS.find(a => a.functionId === selected.id);
  const coveringApps = HUKUMA_APPS.filter(app => app.wefFunctions.includes(selected.id));

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TIER_BG_CLASSES[selected.readinessTier]}`}>
            {selected.readinessTier}
          </span>
          <h3 className="text-base font-semibold text-slate-800 mt-1">
            #{selected.id} {selected.name}
          </h3>
          <p className="text-xs text-slate-500">{selected.category}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
      </div>
      <p className="text-sm text-slate-600 mt-2">{selected.description}</p>

      {/* Score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {[
          { label: 'Potential', value: selected.potentialScore },
          { label: 'Complexity', value: selected.complexityScore },
          { label: 'Risk', value: selected.riskScore },
          { label: 'National Score', value: selected.jurisdictionAdjustedScore },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded px-3 py-2">
            <p className="text-[10px] text-slate-500">{s.label}</p>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
        <span>Owner: <b className="text-slate-700">{selected.ownerMinistry}</b></span>
        <span>Timeline: <b className="text-slate-700">{selected.timeline}</b></span>
        <span>AgenticGov App: <b className="text-slate-700">{selected.hukumaApp ?? 'Not assigned'}</b></span>
      </div>

      {/* Dependency Chain section */}
      {(chain || blockedBy.length > 0) && (
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Dependency Chain</h4>
          {chain && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-2">
              <p className="text-[11px] text-amber-800 font-medium">This function blocks {chain.blockedFunctions.length} others:</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {chain.blockedFunctions.map(fid => {
                  const f = WEF_FUNCTIONS.find(fn => fn.id === fid);
                  return (
                    <span key={fid} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                      #{fid} {f?.name}
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-amber-700 mt-1.5">Intervention: {chain.suggestedIntervention}</p>
              <p className="text-[10px] text-amber-600">Timeline: {chain.estimatedTimeline}</p>
            </div>
          )}
          {blockedBy.map(dep => (
            <div key={dep.blockingFunction} className="bg-red-50 border border-red-200 rounded-md p-2 mb-1">
              <p className="text-[10px] text-red-700">
                Blocked by <b>#{dep.blockingFunction} ({WEF_FUNCTIONS.find(f => f.id === dep.blockingFunction)?.name})</b>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Next-Best-Action */}
      {nba && (
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Agent Recommendation</h4>
          <div className="bg-violet-50 border border-violet-200 rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TIER_BG_CLASSES[nba.currentTier]}`}>{nba.currentTier}</span>
              <span className="text-violet-500 text-xs font-bold">&rarr;</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TIER_BG_CLASSES[nba.targetTier]}`}>{nba.targetTier}</span>
            </div>
            <p className="text-[11px] text-violet-800">{nba.action}</p>
            <p className="text-[10px] text-violet-600 mt-1">Impact: {nba.estimatedImpact}</p>
            {nba.dependsOn && <p className="text-[10px] text-slate-500 mt-0.5">Depends on: {nba.dependsOn}</p>}
          </div>
        </div>
      )}

      {/* Cross-App Coverage */}
      {coveringApps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">AgenticGov App Coverage</h4>
          <div className="flex gap-2 flex-wrap">
            {coveringApps.map(app => (
              <div key={app.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: app.color }} />
                <span className="text-[11px] font-medium text-slate-700">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deployment Waves Tab
// ---------------------------------------------------------------------------

function DeploymentWavesTab() {
  const waveStatusColors = {
    complete: 'bg-emerald-100 text-emerald-700',
    'in-progress': 'bg-violet-100 text-violet-700',
    planned: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-4">
      {DEPLOYMENT_WAVES.map(wave => (
        <div key={wave.wave} className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-slate-800">Wave {wave.wave}</span>
              <span className="text-sm text-slate-600">{wave.label}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${waveStatusColors[wave.status]}`}>
                {wave.status === 'in-progress' ? 'In Progress' : wave.status === 'complete' ? 'Complete' : 'Planned'}
              </span>
            </div>
            <span className="text-xs text-slate-400">{wave.timeline}</span>
          </div>

          {/* Progress bar for in-progress waves */}
          {wave.status === 'in-progress' && wave.progress !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500">Deployment progress</span>
                <span className="font-semibold text-violet-700">{wave.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${wave.progress}%` }} />
              </div>
            </div>
          )}

          {/* Function pills */}
          <div className="flex gap-2 flex-wrap">
            {wave.functions.map(fn => (
              <span
                key={fn.id}
                className={`text-[10px] font-medium px-2 py-1 rounded ${TIER_BG_CLASSES[fn.tier]}`}
              >
                #{fn.id} {fn.name}
              </span>
            ))}
          </div>

          {/* Function count */}
          <p className="text-[10px] text-slate-400 mt-2">{wave.functions.length} functions in this wave</p>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Deployment Coverage</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {DEPLOYMENT_WAVES.map(w => (
            <div key={w.wave}>
              <p className="text-xl font-bold text-slate-800">{w.functions.length}</p>
              <p className="text-[10px] text-slate-500">Wave {w.wave} functions</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          {DEPLOYMENT_WAVES.reduce((sum, w) => sum + w.functions.length, 0)} of 70 functions scheduled across 3 waves
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enhanced Ministerial Scorecard Tab
// ---------------------------------------------------------------------------

function MinisterialScorecardTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {MINISTERIAL_SCORECARDS.map(m => {
        const readinessColor =
          m.overallReadiness >= 70 ? 'bg-emerald-500' :
          m.overallReadiness >= 50 ? 'bg-amber-500' : 'bg-red-500';
        const adoptColor =
          m.adoptionProgress >= 70 ? 'bg-violet-500' :
          m.adoptionProgress >= 50 ? 'bg-violet-400' : 'bg-violet-300';
        const trendData = MINISTERIAL_TRENDS[m.ministryId] || [];
        const nba = NEXT_BEST_ACTIONS.find(a => a.ministryId === m.ministryId);

        return (
          <div key={m.ministryId} className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{m.name}</h3>
                <p className="text-[10px] text-slate-400">{m.shortName} &bull; {m.functionsOwned.length} functions</p>
              </div>
              {trendData.length > 0 && (
                <div className="flex flex-col items-end">
                  <Sparkline data={trendData} color={m.overallReadiness >= 70 ? '#10b981' : m.overallReadiness >= 50 ? '#f59e0b' : '#ef4444'} />
                  <span className="text-[9px] text-slate-400 mt-0.5">6-month trend</span>
                </div>
              )}
            </div>

            {/* Readiness bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500">Overall Readiness</span>
                <span className="font-semibold text-slate-700">{m.overallReadiness}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${readinessColor}`} style={{ width: `${m.overallReadiness}%` }} />
              </div>
            </div>

            {/* Adoption bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500">Adoption Progress</span>
                <span className="font-semibold text-slate-700">{m.adoptionProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${adoptColor}`} style={{ width: `${m.adoptionProgress}%` }} />
              </div>
            </div>

            {/* Tier counts */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {m.highReadyCount > 0 && <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{m.highReadyCount} HIGH</span>}
              {m.mediumReadyCount > 0 && <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{m.mediumReadyCount} MEDIUM</span>}
              {m.emergingCount > 0 && <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{m.emergingCount} EMERGING</span>}
              {m.cautionCount > 0 && <span className="text-[10px] font-medium bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{m.cautionCount} CAUTION</span>}
            </div>

            {/* Next-Best-Action */}
            {nba && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-[10px] font-semibold text-violet-700 mb-1">Agent Recommendation</p>
                <p className="text-[11px] text-slate-600">{nba.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${TIER_BG_CLASSES[nba.currentTier]}`}>{nba.currentTier}</span>
                  <span className="text-violet-400 text-[10px]">&rarr;</span>
                  <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${TIER_BG_CLASSES[nba.targetTier]}`}>{nba.targetTier}</span>
                  <span className="text-[9px] text-slate-400 ml-auto">#{nba.functionId} {nba.functionName}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReadinessMapPage() {
  const [tab, setTab] = useState<Tab>('Readiness Map');
  const [selected, setSelected] = useState<WEFFunction | null>(null);
  const [agentRunning, setAgentRunning] = useState(false);

  const handleDotClick = useCallback((_: unknown, index: number) => {
    setSelected(WEF_FUNCTIONS[index]);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            <span className="text-violet-600">ReadinessMap</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">WEF 70-Function AI Readiness Tracker</p>
        </div>

        {/* Readiness Pulse Banner */}
        <ReadinessPulseBanner />

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          {STAT_ITEMS.map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              <span className={`text-sm font-semibold ${s.color}`}>{s.count}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
          <span className="text-xs text-slate-400 ml-auto">70 functions total</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === t
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-slate-600 border border-neutral-200 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content: 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {tab === 'Readiness Map' && (
              <>
                {/* Scatter chart */}
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">AI Readiness by Function</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Click a dot to view function details</p>
                    </div>
                    {/* Legend */}
                    <div className="flex gap-3">
                      {(['HIGH', 'MEDIUM', 'EMERGING', 'CAUTION'] as const).map(t => (
                        <div key={t} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TIER_COLORS[t] }} />
                          <span className="text-[10px] text-slate-500">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={360}>
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        dataKey="complexityScore"
                        name="Complexity"
                        domain={[0.8, 4.2]}
                        tick={{ fontSize: 11 }}
                        label={{ value: 'Implementation Complexity', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                      />
                      <YAxis
                        type="number"
                        dataKey="potentialScore"
                        name="Potential"
                        domain={[1.8, 4.2]}
                        tick={{ fontSize: 11 }}
                        label={{ value: 'AI Potential', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#64748b' }}
                      />
                      <ZAxis type="number" dataKey="jurisdictionAdjustedScore" range={[60, 260]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Scatter data={WEF_FUNCTIONS} onClick={handleDotClick} cursor="pointer">
                        {WEF_FUNCTIONS.map(fn => (
                          <Cell
                            key={fn.id}
                            fill={TIER_COLORS[fn.readinessTier]}
                            opacity={selected && selected.id !== fn.id ? 0.3 : 0.85}
                            stroke={selected?.id === fn.id ? '#1e293b' : 'none'}
                            strokeWidth={selected?.id === fn.id ? 2 : 0}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                {/* Selected function detail (enhanced) */}
                {selected && <FunctionDetailCard selected={selected} onClose={() => setSelected(null)} />}
              </>
            )}

            {tab === 'Ministerial Scorecard' && <MinisterialScorecardTab />}

            {tab === 'Deployment Waves' && <DeploymentWavesTab />}
          </div>

          {/* Right sidebar: 1 col */}
          <div className="space-y-4">
            {/* Agent Status Card */}
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-semibold text-slate-700">ReadinessMap Agent Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-violet-50 rounded px-3 py-2">
                  <p className="text-lg font-bold text-violet-700">2</p>
                  <p className="text-[10px] text-violet-500">Agents active</p>
                </div>
                <div className="bg-slate-50 rounded px-3 py-2">
                  <p className="text-lg font-bold text-slate-700">67</p>
                  <p className="text-[10px] text-slate-500">Tasks today</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Dependency scanner</span>
                  <span className="text-emerald-600 font-medium">Running</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Readiness pulse engine</span>
                  <span className="text-emerald-600 font-medium">Running</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Next full scan</span>
                  <span className="text-slate-600 font-medium">Mon 7:00 AM</span>
                </div>
              </div>
            </div>

            <AgentStepSimulator
              steps={READINESS_AGENT_STEPS}
              running={agentRunning}
              title="Readiness Assessment"
              onComplete={() => setAgentRunning(false)}
            />
            <button
              onClick={() => setAgentRunning(true)}
              disabled={agentRunning}
              className="w-full text-xs font-medium text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 disabled:opacity-50 rounded-md px-3 py-1.5 transition-colors"
            >
              {agentRunning ? 'Running assessment...' : 'Run Readiness Assessment'}
            </button>

            <AgentActivityFeed
              entries={AGENT_ACTIVITY_LOG}
              filterApp="readiness-map"
              simulateNew
              maxHeight="320px"
              compact
            />

            <CrossAppFlowDiagram activeApp="readiness-map" compact />
          </div>
        </div>
      </main>

    </div>
  );
}
