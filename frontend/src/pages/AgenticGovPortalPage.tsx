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
import { HUKUMA_APPS, AGENT_ACTIVITY_LOG, PORTAL_STATS } from '../data/hukumaDemo';

type PortalTab = 'briefing' | 'operations' | 'intelligence' | 'governance';

const TABS: { id: PortalTab; label: string; description: string }[] = [
  { id: 'briefing', label: 'Morning Briefing', description: 'Daily executive summary' },
  { id: 'operations', label: 'Operations Center', description: 'Live agent monitoring' },
  { id: 'intelligence', label: 'Intelligence Hub', description: 'Cross-app analysis' },
  { id: 'governance', label: 'Governance Flows', description: 'Bi-directional agent intel' },
];

const TAB_INSIGHTS: Record<PortalTab, { title: string; description: string; meta: { label: string; value: string }[] }> = {
  briefing: {
    title: 'Morning Briefing',
    description: 'Executive summary prepared overnight by agents across all domains. Highlights critical anomalies, pending decisions, and trend shifts that require attention before 10:00 AM.',
    meta: [{ label: 'Generated', value: '6:00 AM daily' }, { label: 'Sources', value: '7 agent domains' }],
  },
  operations: {
    title: 'Operations Center',
    description: 'Real-time monitoring of all agent activity, health status, and cross-app data flows. See what every agent is doing right now and how data moves between systems.',
    meta: [{ label: 'Refresh Rate', value: 'Live (5-8s)' }, { label: 'Monitoring', value: '23 agents' }],
  },
  intelligence: {
    title: 'Intelligence Hub',
    description: 'Cross-app event chain analysis showing how a single detection cascades through the platform — from anomaly detection to policy recommendation to cabinet briefing.',
    meta: [{ label: 'Active Chains', value: '3' }, { label: 'Avg Resolution', value: '4.2 hours' }],
  },
  governance: {
    title: 'Governance Flows',
    description: 'Bi-directional intelligence routing between division, ministry, and cabinet tiers. Shows how agents pull data top-down, push alerts bottom-up, and sync laterally.',
    meta: [{ label: 'Pull/Push/Sync', value: '34 / 12 / 28 today' }, { label: 'Auto-resolved', value: '71' }],
  },
};

export function AgenticGovPortalPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>('briefing');

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppNavbar />
      <AgenticGovSubNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              <span className="text-[#B8860B]">AGENTICGOV</span>
              <span className="text-slate-400 font-normal ml-2 text-lg">Mission Control</span>
            </h1>
            <HoverInsight
              title="Platform Scope"
              description="AgenticGov covers 7 specialized agent domains mapping to 70 functions from the WEF's 'Making Agentic AI Work for Government' framework, deployed across 10 federal ministries."
              meta={[{ label: 'WEF Framework', value: 'April 2026' }, { label: 'Coverage', value: '70/70 functions' }, { label: 'Ministries', value: '10 federal' }]}
            >
              <p className="text-xs text-slate-500 mt-1">
                7 Agent Domains &bull; 70 WEF Functions &bull; 10 Ministries &bull; Always-On Intelligence
              </p>
            </HoverInsight>
          </div>
          <div className="flex items-center gap-4 text-right">
            <HoverInsight
              title="Tasks Completed Today"
              description="Total agent tasks across all 7 AgenticGov domains since midnight time. Includes automated scans, report generations, anomaly detections, and compliance checks."
              meta={[{ label: 'Avg/Day', value: '812' }, { label: 'Peak Hour', value: '10:00-11:00 AM' }, { label: 'Auto-resolved', value: '94%' }]}
            >
              <div>
                <p className="text-2xl font-bold text-slate-800">{PORTAL_STATS.tasksToday.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">tasks today</p>
              </div>
            </HoverInsight>
            <div className="w-px h-8 bg-slate-200" />
            <HoverInsight
              title="Active Agents"
              description="AI agents currently monitoring, analyzing, or generating outputs across all connected government systems. Agents run 24/7 with human escalation for critical decisions."
              meta={[{ label: 'Total Deployed', value: '23' }, { label: 'Domains', value: '7' }, { label: 'Uptime', value: '99.97%' }]}
            >
              <div>
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
              <MorningBriefing />
              <ImpactTracker />
            </div>
            <div className="space-y-6">
              <DecisionQueue />
              <AgentHealthPanel />
            </div>
          </div>
        )}

        {/* OPERATIONS TAB */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CrossAppFlowDiagram />
              <ScheduledIntelligence />
              <AgentHealthPanel />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <AgentActivityFeed
                entries={AGENT_ACTIVITY_LOG}
                simulateNew={true}
                maxHeight="500px"
              />
              {/* App Cards */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">Agent Domains</h3>
                {HUKUMA_APPS.map((app) => (
                  <HoverInsight
                    key={app.id}
                    title={app.name}
                    description={`${app.description} This domain connects to other AgenticGov agents via automated data flows.`}
                    meta={[{ label: 'Agents', value: `${app.agentCount}` }, { label: 'Type', value: app.isExternal ? 'External Integration' : 'Native AgenticGov App' }]}
                  >
                    <Link
                      to={app.route}
                      className="flex items-center gap-3 bg-white rounded-lg border border-neutral-200 shadow-sm p-3 hover:shadow-md transition-shadow"
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
              <EventChainPanel />
              <CrossAppFlowDiagram />
            </div>
            <div className="space-y-6">
              <AgentActivityFeed
                entries={AGENT_ACTIVITY_LOG}
                simulateNew={true}
                maxHeight="400px"
              />
              <ImpactTracker />
            </div>
          </div>
        )}

        {/* GOVERNANCE TAB */}
        {activeTab === 'governance' && (
          <GovernanceOrchestration />
        )}
      </main>

    </div>
  );
}
