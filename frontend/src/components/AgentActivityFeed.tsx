import { useState, useEffect, useRef } from 'react';
import { type AgentActivity, type AppId, getAppColor, getAppName, formatTimestamp, SIMULATED_NEW_ACTIVITIES } from '../data/hukumaDemo';
import { HoverInsight } from './HoverInsight';

interface AgentActivityFeedProps {
  entries: AgentActivity[];
  simulateNew?: boolean;
  filterApp?: AppId;
  maxHeight?: string;
  compact?: boolean;
}

const STATUS_ICONS: Record<string, string> = {
  running: '⟳',
  complete: '✓',
  alert: '⚠',
  waiting: '◷',
};

export function AgentActivityFeed({ entries, simulateNew = false, filterApp, maxHeight = '600px', compact = false }: AgentActivityFeedProps) {
  const [allEntries, setAllEntries] = useState<AgentActivity[]>(entries);
  const [, setSimIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllEntries(entries);
  }, [entries]);

  useEffect(() => {
    if (!simulateNew) return;
    const interval = setInterval(() => {
      setSimIndex(prev => {
        const next = prev + 1;
        if (next > SIMULATED_NEW_ACTIVITIES.length) return prev;
        const newEntry = {
          ...SIMULATED_NEW_ACTIVITIES[prev % SIMULATED_NEW_ACTIVITIES.length],
          id: `live-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        setAllEntries(current => [newEntry, ...current]);
        return next;
      });
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [simulateNew]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [allEntries.length]);

  const filtered = filterApp ? allEntries.filter(e => e.app === filterApp) : allEntries;

  return (
    <div className={`bg-slate-900 rounded-lg overflow-hidden ${compact ? '' : 'border border-slate-700'}`}>
      <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <HoverInsight
          title="Live Agent Activity Feed"
          description="Real-time stream of agent actions across all AgenticGov domains. New entries appear every 5-8 seconds as agents complete tasks. Each entry shows which app generated it, what action was taken, and the current status."
          meta={[{label: 'Refresh', value: 'Live (5-8s)'}, {label: 'Sources', value: '7 agent domains'}]}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Agent Activity Feed</span>
          </div>
        </HoverInsight>
        <HoverInsight
          title="Total Events"
          description="Number of agent activity entries currently visible in the feed. Older entries scroll down as new ones arrive at the top."
        >
          <span className="text-[10px] text-slate-500">{filtered.length} events</span>
        </HoverInsight>
      </div>
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight }}>
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className={`px-3 py-2 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
              entry.status === 'alert' ? 'bg-red-900/10' : ''
            } ${entry.status === 'running' ? 'bg-blue-900/10' : ''}`}
          >
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: getAppColor(entry.app) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-medium" style={{ color: getAppColor(entry.app) }}>
                    {getAppName(entry.app)}
                  </span>
                  <HoverInsight
                    title={entry.status === 'running' ? 'In Progress' : entry.status === 'complete' ? 'Completed' : entry.status === 'alert' ? 'Alert' : 'Waiting'}
                    description={entry.status === 'running' ? "Agent is currently executing this task. It will update to 'complete' or 'alert' when finished." : entry.status === 'complete' ? 'Agent successfully finished this task. Results have been logged and any downstream flows have been triggered.' : entry.status === 'alert' ? 'Agent detected an anomaly or error during this task. The issue has been flagged for review or escalated based on routing rules.' : 'Agent is paused, waiting for external data, human input, or a dependent task to complete before proceeding.'}
                  >
                    <span className={`text-[10px] ${
                      entry.status === 'alert' ? 'text-red-400' :
                      entry.status === 'running' ? 'text-blue-400' :
                      'text-emerald-400'
                    }`}>
                      {STATUS_ICONS[entry.status]}
                    </span>
                  </HoverInsight>
                  <span className="text-[10px] text-slate-600 ml-auto flex-shrink-0">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{entry.message}</p>
                {entry.detail && !compact && (
                  <p className="text-[10px] text-slate-600 mt-0.5">{entry.detail}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
