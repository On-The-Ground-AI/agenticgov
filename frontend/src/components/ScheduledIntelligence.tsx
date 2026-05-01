import { SCHEDULED_TASKS, getAppColor, getAppName } from '../data/agenticDemo';
import { HoverInsight } from './HoverInsight';

const STATUS_INDICATOR = {
  success: { dot: 'bg-emerald-500', label: 'OK', labelClass: 'text-emerald-600' },
  warning: { dot: 'bg-amber-500', label: 'Findings', labelClass: 'text-amber-600' },
  error: { dot: 'bg-red-500', label: 'Error', labelClass: 'text-red-600' },
} as const;

export function ScheduledIntelligence() {
  return (
    <div className="glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100">
        <HoverInsight
          title="Scheduled Intelligence Tasks"
          description="Autonomous agents running on fixed schedules -- daily scans, weekly audits, monthly benchmarks. These agents execute without human initiation and report findings automatically."
          meta={[{label: 'Total scheduled', value: '12 tasks'}, {label: 'Next run', value: 'Various'}]}
        >
          <h3 className="text-sm font-semibold text-slate-800">Scheduled Intelligence</h3>
        </HoverInsight>
        <p className="text-[10px] text-slate-500 mt-0.5">Autonomous agents running on schedule</p>
      </div>
      <div className="divide-y divide-neutral-100">
        {SCHEDULED_TASKS.map(task => {
          const status = STATUS_INDICATOR[task.lastStatus];
          return (
            <HoverInsight
              title={task.agent}
              description={`Scheduled agent task: ${task.summary}. Runs ${task.schedule.toLowerCase()} and reports to the ${getAppName(task.app)} domain.`}
              meta={[{label: 'Schedule', value: task.schedule}, {label: 'Last run', value: task.lastRun}, {label: 'Next run', value: task.nextRun}, {label: 'Findings', value: task.findingsCount > 0 ? `${task.findingsCount} findings` : 'None'}]}
            >
              <div key={task.id} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getAppColor(task.app) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-800">{task.agent}</span>
                      <span
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${getAppColor(task.app)}15`, color: getAppColor(task.app) }}
                      >
                        {getAppName(task.app)}
                      </span>
                      <HoverInsight
                        title={task.lastStatus === 'success' ? 'Last Run: Success' : task.lastStatus === 'warning' ? 'Last Run: Findings' : 'Last Run: Error'}
                        description={task.lastStatus === 'success' ? 'The most recent execution completed without errors and no significant findings were detected.' : task.lastStatus === 'warning' ? 'The most recent execution completed but detected findings that may require attention. Review the findings summary for details.' : 'The most recent execution encountered an error. The operations team has been automatically notified. Check Agent Health panel for details.'}
                      >
                        <div className="flex items-center gap-1 ml-auto">
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className={`text-[10px] font-medium ${status.labelClass}`}>{status.label}</span>
                        </div>
                      </HoverInsight>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500">
                      <span>{task.schedule}</span>
                      <span>Last: {task.lastRun}</span>
                      <span>Next: {task.nextRun}</span>
                      {task.findingsCount > 0 && (
                        <span className="font-medium text-amber-600">{task.findingsCount} findings</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{task.summary}</p>
                  </div>
                </div>
              </div>
            </HoverInsight>
          );
        })}
      </div>
    </div>
  );
}
