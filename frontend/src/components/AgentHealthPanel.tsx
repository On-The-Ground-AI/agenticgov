import { AGENT_HEALTH, getAppName } from '../data/agenticDemo';
import { HoverInsight } from './HoverInsight';

const STATUS_STYLES = {
  healthy: { dot: 'bg-emerald-500', label: 'Healthy', bg: '' },
  degraded: { dot: 'bg-amber-500 animate-pulse', label: 'Degraded', bg: 'bg-amber-50' },
  error: { dot: 'bg-red-500 animate-pulse', label: 'Error', bg: 'bg-red-50' },
} as const;

export function AgentHealthPanel() {
  return (
    <div className="glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100">
        <HoverInsight
          title="Agent Health Monitor"
          description="Real-time health status of all deployed AI agents. Agents self-report uptime, task counts, and latency. Degraded or error states trigger automatic alerts to the operations team."
          meta={[{label: 'Check interval', value: 'Every 30s'}, {label: 'Alert threshold', value: '> 3s latency or < 99% uptime'}]}
        >
          <h3 className="text-sm font-semibold text-slate-800">Agent Health</h3>
        </HoverInsight>
        <HoverInsight
          title="Health Summary"
          description="Ratio of agents reporting normal operation. An agent is 'healthy' when uptime is above 99%, average latency is under 3 seconds, and no error flags are active."
        >
          <p className="text-[10px] text-slate-500 mt-0.5">
            {AGENT_HEALTH.filter(a => a.status === 'healthy').length}/{AGENT_HEALTH.length} agents healthy
          </p>
        </HoverInsight>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y divide-neutral-100">
        {AGENT_HEALTH.map(agent => {
          const s = STATUS_STYLES[agent.status];
          return (
            <HoverInsight
              title={getAppName(agent.app)}
              description={`${getAppName(agent.app)} agent monitoring ${agent.status === 'healthy' ? 'operating normally' : agent.status === 'degraded' ? 'experiencing slower response times' : 'reporting errors'}. This agent runs continuously and reports health metrics every 30 seconds.`}
              meta={[{label: 'Uptime', value: agent.uptime}, {label: 'Tasks today', value: String(agent.tasksToday)}, {label: 'Avg latency', value: `${(agent.avgLatencyMs / 1000).toFixed(1)}s`}]}
            >
              <div key={agent.app} className={`px-3 py-2.5 ${s.bg}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-xs font-medium text-slate-800">{getAppName(agent.app)}</span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Uptime</span>
                    <HoverInsight
                      title="Uptime"
                      description="Percentage of time this agent has been operational and responsive since deployment. Calculated from heartbeat monitoring."
                    >
                      <span className="text-slate-700 font-medium">{agent.uptime}</span>
                    </HoverInsight>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Tasks today</span>
                    <HoverInsight
                      title="Tasks Today"
                      description="Number of discrete operations this agent has completed since midnight. Includes scans, analyses, report generations, and data syncs."
                    >
                      <span className="text-slate-700 font-medium">{agent.tasksToday}</span>
                    </HoverInsight>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Avg latency</span>
                    <HoverInsight
                      title="Average Latency"
                      description="Mean time for this agent to complete a single task. Lower latency indicates faster processing. Threshold for 'degraded' status is 3 seconds."
                    >
                      <span className="text-slate-700 font-medium">{(agent.avgLatencyMs / 1000).toFixed(1)}s</span>
                    </HoverInsight>
                  </div>
                </div>
                {agent.note && (
                  <p className="text-[9px] text-amber-600 font-medium mt-1.5">{agent.note}</p>
                )}
              </div>
            </HoverInsight>
          );
        })}
      </div>
    </div>
  );
}
