import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/AppNavbar';
import { AgenticGovSubNav } from '../components/AgenticGovSubNav';
import { HoverInsight } from '../components/HoverInsight';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import { CrossAppFlowDiagram } from '../components/CrossAppFlowDiagram';
import { MorningBriefing } from '../components/MorningBriefing';
import { EventChainPanel } from '../components/EventChain';
import { DecisionQueue } from '../components/DecisionQueue';
import { ImpactTracker } from '../components/ImpactTracker';
import { ScheduledIntelligence } from '../components/ScheduledIntelligence';
import { AgentHealthPanel } from '../components/AgentHealthPanel';
import { GovernanceOrchestration } from '../components/GovernanceOrchestration';
import { AGENTIC_APPS, AGENT_ACTIVITY_LOG, PORTAL_STATS } from '../data/agenticDemo';
import { jurisdictionsForApp } from '../data/jurisdictions';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// Map demo-data app ids to the keys exposed by jurisdictionsForApp().
// policy-ai and causalis don't have direct app equivalents, so they share the
// readiness lens (foresight / horizon-scanning is the closest fit).
const APP_ID_TO_JURISDICTION_KEY: Record<string, 'tender' | 'fiscal' | 'readiness' | 'bench' | 'transparency'> = {
  'tender-ai': 'tender',
  'fiscal-ai': 'fiscal',
  'readiness-map': 'readiness',
  'gov-bench': 'bench',
  'transparency-ai': 'transparency',
  'policy-ai': 'readiness',
  'causalis': 'readiness',
};

type PortalTab = 'briefing' | 'operations' | 'intelligence' | 'governance';

const TABS: { id: PortalTab; label: string; description: string }[] = [
  { id: 'briefing', label: 'Morning Briefing', description: 'Daily executive summary' },
  { id: 'operations', label: 'Operations Center', description: 'Live agent monitoring' },
  { id: 'intelligence', label: 'Intelligence Hub', description: 'Cross-app analysis' },
  { id: 'governance', label: 'Governance Flows', description: 'Bi-directional agent intel' },
];

const TAB_INSIGHTS: Record<PortalTab, { title: string; description: string; meta: { label: string; value: string }[]; wefRef: string }> = {
  briefing: {
    title: 'Morning Briefing',
    description: 'Executive summary prepared overnight by agents across all domains. Highlights critical anomalies, pending decisions, and trend shifts that require attention before 10:00 AM.',
    meta: [{ label: 'Generated', value: '6:00 AM daily' }, { label: 'Sources', value: '7 agent domains' }],
    wefRef: 'Section 6.1 (Executive Briefing, p.52)',
  },
  operations: {
    title: 'Operations Center',
    description: 'Real-time monitoring of all agent activity, health status, and cross-app data flows. See what every agent is doing right now and how data moves between systems.',
    meta: [{ label: 'Refresh Rate', value: 'Live (5-8s)' }, { label: 'Monitoring', value: '23 agents' }],
    wefRef: 'Section 4 (Operational Functions, p.34)',
  },
  intelligence: {
    title: 'Intelligence Hub',
    description: 'Cross-app event chain analysis showing how a single detection cascades through the platform — from anomaly detection to policy recommendation to cabinet briefing.',
    meta: [{ label: 'Active Chains', value: '3' }, { label: 'Avg Resolution', value: '4.2 hours' }],
    wefRef: 'Section 6.2 (Cross-app intel, p.54)',
  },
  governance: {
    title: 'Governance Flows',
    description: 'Bi-directional intelligence routing between division, ministry, and cabinet tiers. Shows how agents pull data top-down, push alerts bottom-up, and sync laterally.',
    meta: [{ label: 'Pull/Push/Sync', value: '34 / 12 / 28 today' }, { label: 'Auto-resolved', value: '71' }],
    wefRef: 'Section 6.3 (Governance flows, p.57)',
  },
};

export function AgenticGovPortalPage() {
  useDocumentMeta({
    title: 'Mission Control — AgenticGov',
    description: 'Orchestration portal for the AgenticGov demo: morning briefing, decision queue, agent health, cross-app event chains, and governance flows. The cabinet- or PS-level surface for everything happening across the suite.',
    canonicalPath: '/portal',
  });

  const [activeTab, setActiveTab] = useState<PortalTab>('briefing');

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <HoverInsight
              title="AgenticGov Mission Control"
              description="The single orchestration cockpit for every AgenticGov agent domain. Mission Control unifies the morning briefing, real-time operations, cross-app intelligence chains, and bi-directional governance flows in one always-on portal."
              meta={[{ label: 'WEF Framework', value: 'April 2026' }, { label: 'Domains', value: '7' }, { label: 'Coverage', value: '70/70 functions' }]}
              wefRef="Section 6 (Orchestration portal, p.51)"
              jurisdiction={jurisdictionsForApp('missionControl')}
            >
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight cursor-help">
                <span className="text-[#B8860B]">AGENTICGOV</span>
                <span className="text-slate-400 font-normal ml-2 text-lg">Mission Control</span>
              </h1>
            </HoverInsight>
            <HoverInsight
              title="Platform Scope"
              description="AgenticGov covers 7 specialized agent domains mapping to 70 functions from the WEF's 'Making Agentic AI Work for Government' framework, deployed across 11 ministries."
              meta={[{ label: 'WEF Framework', value: 'April 2026' }, { label: 'Coverage', value: '70/70 functions' }, { label: 'Ministries', value: '11' }]}
              wefRef="Annex A (Function index)"
              jurisdiction={jurisdictionsForApp('missionControl')}
            >
              <p className="text-xs text-slate-500 mt-1 cursor-help">
                7 Agent Domains &bull; 70 WEF Functions &bull; 10 Ministries &bull; Always-On Intelligence
              </p>
            </HoverInsight>
          </div>
          <div className="flex items-center gap-4 text-right">
            <HoverInsight
              title="Tasks Completed Today"
              description="Total agent tasks across all 7 AgenticGov domains since midnight time. Includes automated scans, report generations, anomaly detections, and compliance checks."
              meta={[{ label: 'Avg/Day', value: '812' }, { label: 'Peak Hour', value: '10:00-11:00 AM' }, { label: 'Auto-resolved', value: '94%' }]}
              wefRef="Section 4 (Operational Functions, p.34)"
              jurisdiction={jurisdictionsForApp('missionControl')}
            >
              <div className="cursor-help">
                <p className="text-2xl font-bold text-slate-800">{PORTAL_STATS.tasksToday.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">tasks today</p>
              </div>
            </HoverInsight>
            <div className="w-px h-8 bg-slate-200" />
            <HoverInsight
              title="Active Agents"
              description="AI agents currently monitoring, analyzing, or generating outputs across all connected government systems. Agents run 24/7 with human escalation for critical decisions."
              meta={[{ label: 'Total Deployed', value: '23' }, { label: 'Domains', value: '7' }, { label: 'Uptime', value: '99.97%' }]}
              wefRef="Section 4 (Operational Functions, p.34)"
              jurisdiction={jurisdictionsForApp('missionControl')}
            >
              <div className="cursor-help">
                <p className="text-2xl font-bold text-slate-800">{PORTAL_STATS.activeAgents}</p>
                <p className="text-[10px] text-slate-500">agents active</p>
              </div>
            </HoverInsight>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <HoverInsight
              key={tab.id}
              title={TAB_INSIGHTS[tab.id].title}
              description={TAB_INSIGHTS[tab.id].description}
              meta={TAB_INSIGHTS[tab.id].meta}
              wefRef={TAB_INSIGHTS[tab.id].wefRef}
              jurisdiction={jurisdictionsForApp('missionControl')}
            >
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-neutral-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span className={`block text-[10px] font-normal mt-0.5 ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {tab.description}
                </span>
              </button>
            </HoverInsight>
          ))}
        </div>

        {/* BRIEFING TAB */}
        {activeTab === 'briefing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HoverInsight
                title="Morning Briefing Panel"
                description="Overnight executive digest synthesised across all 7 agent domains. Surfaces top-priority anomalies, decisions needing sign-off, and trend shifts your principals should see before 10:00 AM."
                meta={[{ label: 'Refreshed', value: '6:00 AM daily' }, { label: 'Reading time', value: '~3 minutes' }]}
                wefRef="Section 6.1 (Executive Briefing, p.52)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <MorningBriefing />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Impact Tracker"
                description="Quantified outcomes attributable to AgenticGov agents — flagged compliance issues averted, fiscal leakage recovered, citizen-service hours saved, and policy briefs delivered. Updated as agents close cases."
                meta={[{ label: 'Window', value: 'Rolling 90 days' }, { label: 'Tracked metrics', value: '12' }]}
                wefRef="Section 6.1 (Executive Briefing, p.52)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <ImpactTracker />
                </div>
              </HoverInsight>
            </div>
            <div className="space-y-6">
              <HoverInsight
                title="Decision Queue"
                description="Items routed to a human decision-maker because they exceed an agent's autonomy threshold. Each card shows the agent's recommendation, supporting evidence, and an audit-trail-backed approve/reject action."
                meta={[{ label: 'Pending', value: '7 items' }, { label: 'Median age', value: '42 minutes' }]}
                wefRef="Section 6.1 (Executive Briefing, p.52)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <DecisionQueue />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Agent Health Panel"
                description="Live operational health for every deployed agent: heartbeat, error rate, queue depth, and last-successful-run timestamp. Red/amber/green status mirrors the WEF readiness telemetry pattern."
                meta={[{ label: 'Agents monitored', value: '23' }, { label: 'Uptime', value: '99.97%' }]}
                wefRef="Section 4 (Operational Functions, p.34)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <AgentHealthPanel />
                </div>
              </HoverInsight>
            </div>
          </div>
        )}

        {/* OPERATIONS TAB */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HoverInsight
                title="Cross-App Flow Diagram"
                description="Animated topology of the data pipes connecting every AgenticGov domain. Shows live message flow between TenderAI, FiscalAI, TransparencyAI, GovBench, ReadinessMap, and the orchestration portal."
                meta={[{ label: 'Active flows', value: '14' }, { label: 'Latency', value: '~120ms p95' }]}
                wefRef="Section 6.2 (Cross-app intel, p.54)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <CrossAppFlowDiagram />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Scheduled Intelligence"
                description="Recurring agent jobs that run on cron-style schedules — daily fiscal scans, weekly tender audits, monthly readiness reports. Visualises what's queued, running, and recently completed."
                meta={[{ label: 'Scheduled jobs', value: '38' }, { label: 'Next run', value: '~14 minutes' }]}
                wefRef="Section 4 (Operational Functions, p.34)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <ScheduledIntelligence />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Agent Health Panel"
                description="Live operational health for every deployed agent: heartbeat, error rate, queue depth, and last-successful-run timestamp. Red/amber/green status mirrors the WEF readiness telemetry pattern."
                meta={[{ label: 'Agents monitored', value: '23' }, { label: 'Uptime', value: '99.97%' }]}
                wefRef="Section 4 (Operational Functions, p.34)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <AgentHealthPanel />
                </div>
              </HoverInsight>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <HoverInsight
                title="Agent Activity Feed"
                description="Live tail of every agent action across the platform — decisions, escalations, and completions stream in as they happen. Each entry links back to the originating agent and ministry."
                meta={[{ label: 'Stream rate', value: 'Live (5-8s)' }, { label: 'Retention', value: '30 days' }]}
                wefRef="Section 4 (Operational Functions, p.34)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <AgentActivityFeed
                    entries={AGENT_ACTIVITY_LOG}
                    simulateNew={true}
                    maxHeight="500px"
                  />
                </div>
              </HoverInsight>
              {/* App Cards */}
              <div className="space-y-2">
                <HoverInsight
                  title="Agent Domains"
                  description="The 7 specialized agent domains that make up AgenticGov. Each domain is a standalone app with its own agents, but all share intelligence via the orchestration portal."
                  meta={[{ label: 'Total domains', value: '7' }, { label: 'Total agents', value: '23' }]}
                  wefRef="Annex A (Function index)"
                  jurisdiction={jurisdictionsForApp('missionControl')}
                >
                  <h3 className="text-sm font-semibold text-slate-800 cursor-help">Agent Domains</h3>
                </HoverInsight>
                {AGENTIC_APPS.map((app) => (
                  <HoverInsight
                    key={app.id}
                    title={app.name}
                    description={`${app.description} This domain connects to other AgenticGov agents via automated data flows.`}
                    meta={[{ label: 'Agents', value: `${app.agentCount}` }, { label: 'Type', value: app.isExternal ? 'External Integration' : 'Native AgenticGov App' }]}
                    wefRef="Annex A (Function index)"
                    jurisdiction={jurisdictionsForApp(APP_ID_TO_JURISDICTION_KEY[app.id] ?? 'missionControl')}
                  >
                    <Link
                      to={app.route}
                      className="flex items-center gap-3 glass rounded-xl p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: app.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800">{app.name}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${app.isExternal ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{app.description}</p>
                      </div>
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {app.agentCount} agents
                      </span>
                    </Link>
                  </HoverInsight>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INTELLIGENCE TAB */}
        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HoverInsight
                title="Event Chain"
                description="Trace a single trigger as it cascades across the platform — anomaly detection in TenderAI escalates to FiscalAI verification, generates a TransparencyAI public-disclosure draft, and ends with a cabinet briefing memo. Demonstrates the end-to-end agent chain pattern."
                meta={[{ label: 'Active chains', value: '3' }, { label: 'Median resolution', value: '4.2 hours' }]}
                wefRef="Section 6.2 (Cross-app intel, p.54)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <EventChainPanel />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Cross-App Flow Diagram"
                description="Animated topology of the data pipes connecting every AgenticGov domain. Shows live message flow between TenderAI, FiscalAI, TransparencyAI, GovBench, ReadinessMap, and the orchestration portal."
                meta={[{ label: 'Active flows', value: '14' }, { label: 'Latency', value: '~120ms p95' }]}
                wefRef="Section 6.2 (Cross-app intel, p.54)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <CrossAppFlowDiagram />
                </div>
              </HoverInsight>
            </div>
            <div className="space-y-6">
              <HoverInsight
                title="Agent Activity Feed"
                description="Live tail of every agent action across the platform — decisions, escalations, and completions stream in as they happen. Each entry links back to the originating agent and ministry."
                meta={[{ label: 'Stream rate', value: 'Live (5-8s)' }, { label: 'Retention', value: '30 days' }]}
                wefRef="Section 4 (Operational Functions, p.34)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <AgentActivityFeed
                    entries={AGENT_ACTIVITY_LOG}
                    simulateNew={true}
                    maxHeight="400px"
                  />
                </div>
              </HoverInsight>
              <HoverInsight
                title="Impact Tracker"
                description="Quantified outcomes attributable to AgenticGov agents — flagged compliance issues averted, fiscal leakage recovered, citizen-service hours saved, and policy briefs delivered. Updated as agents close cases."
                meta={[{ label: 'Window', value: 'Rolling 90 days' }, { label: 'Tracked metrics', value: '12' }]}
                wefRef="Section 6.1 (Executive Briefing, p.52)"
                jurisdiction={jurisdictionsForApp('missionControl')}
              >
                <div className="cursor-help">
                  <ImpactTracker />
                </div>
              </HoverInsight>
            </div>
          </div>
        )}

        {/* GOVERNANCE TAB */}
        {activeTab === 'governance' && (
          <HoverInsight
            title="Governance Orchestration"
            description="Bi-directional intelligence routing between division, ministry, and cabinet tiers. Shows how agents pull data top-down, push alerts bottom-up, and sync laterally — the framework's recommended governance pattern."
            meta={[{ label: 'Pull / Push / Sync', value: '34 / 12 / 28 today' }, { label: 'Auto-resolved', value: '71' }]}
            wefRef="Section 6.3 (Governance flows, p.57)"
            jurisdiction={jurisdictionsForApp('missionControl')}
          >
            <div className="cursor-help">
              <GovernanceOrchestration />
            </div>
          </HoverInsight>
        )}
      </main>

    </div>
  );
}
