import { useEffect, useRef, useState } from 'react';
import { HoverInsight } from './HoverInsight';

interface ScanStep {
  agent: string;
  message: string;
  detail: string;
  durationMs: number;
  output?: string;
  status: 'pending' | 'running' | 'done' | 'alert';
}

const TEMPLATE: ScanStep[] = [
  {
    agent: 'Fiscal Scanner',
    message: 'Querying Q4 ledger for all 11 ministries…',
    detail: 'Reading 14,200 line items via the GIRO ledger feed.',
    durationMs: 1600,
    output: '14,234 line items indexed',
    status: 'pending',
  },
  {
    agent: 'Anomaly Detector',
    message: 'Comparing variance against 12-month rolling baseline…',
    detail: 'Z-score thresholds set at 2.5σ for warning, 3.4σ for critical.',
    durationMs: 1400,
    output: '3 anomalies detected (1 critical, 2 warnings)',
    status: 'pending',
  },
  {
    agent: 'Root Cause Analyzer',
    message: 'Investigating critical anomaly: MOF Q4 consultancy spike…',
    detail: '5 contracts awarded between 15–28 Oct via accelerated pathway.',
    durationMs: 1800,
    output: 'Pattern: end-of-year contract acceleration',
    status: 'pending',
  },
  {
    agent: 'GovBench Cross-Reference',
    message: 'Pulling OECD peer benchmarks for consultancy spend…',
    detail: 'Comparison set: Singapore, S. Korea, Denmark, Estonia, Finland.',
    durationMs: 1200,
    output: 'National 2.1× OECD average',
    status: 'pending',
  },
  {
    agent: 'Transparency Sync',
    message: 'Notifying TransparencyAI of material variance…',
    detail: 'Auto-flagged for inclusion in Q4 quarterly disclosure.',
    durationMs: 900,
    output: 'Disclosure section pre-drafted',
    status: 'pending',
  },
  {
    agent: 'Briefing Compiler',
    message: 'Pushing CRITICAL alert to Permanent Secretary briefing…',
    detail: 'Severity: CRITICAL · Deadline: 5 business days · Owner: MOF CFO.',
    durationMs: 700,
    output: 'Alert in Morning Briefing queue',
    status: 'alert',
  },
];

export function LiveScanDemo() {
  const [steps, setSteps] = useState<ScanStep[]>(TEMPLATE);
  const [running, setRunning] = useState(false);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => () => cleanup(), []);

  const start = () => {
    cleanup();
    setRunning(true);
    setCompletedAt(null);
    setSteps(TEMPLATE.map((s) => ({ ...s, status: 'pending' })));

    let cumulative = 0;
    TEMPLATE.forEach((step, idx) => {
      // Mark as running at start
      const startTimer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, status: 'running' } : s)),
        );
      }, cumulative);
      timersRef.current.push(startTimer);

      cumulative += step.durationMs;

      // Mark as done at end
      const doneTimer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) =>
            i === idx ? { ...s, status: step.status === 'alert' ? 'alert' : 'done' } : s,
          ),
        );
        if (idx === TEMPLATE.length - 1) {
          setRunning(false);
          setCompletedAt(new Date());
        }
      }, cumulative);
      timersRef.current.push(doneTimer);
    });
  };

  const reset = () => {
    cleanup();
    setRunning(false);
    setCompletedAt(null);
    setSteps(TEMPLATE.map((s) => ({ ...s, status: 'pending' })));
  };

  const totalMs = TEMPLATE.reduce((sum, s) => sum + s.durationMs, 0);
  const doneCount = steps.filter((s) => s.status === 'done' || s.status === 'alert').length;

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            FiscalAI · overnight scan · simulation
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!running && completedAt === null && (
            <HoverInsight
              title="Run an end-to-end agent scan"
              description="Triggers a 6-step simulated FiscalAI overnight run. Each step emits a real output that flows through to TransparencyAI, GovBench, and the Permanent Secretary briefing queue."
              wefRef="Section 4 (Operational Functions, p.34)"
            >
              <button
                onClick={start}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run scan
              </button>
            </HoverInsight>
          )}
          {running && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
              </span>
              Running… step {doneCount + 1} / {TEMPLATE.length}
            </span>
          )}
          {!running && completedAt && (
            <>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Scan complete · {(totalMs / 1000).toFixed(1)}s
              </span>
              <button
                onClick={reset}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 transition"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-800">
        {steps.map((step, idx) => {
          const isRunning = step.status === 'running';
          const isDone = step.status === 'done';
          const isAlert = step.status === 'alert';
          const isPending = step.status === 'pending';

          return (
            <HoverInsight
              key={idx}
              title={step.agent}
              description={step.detail}
              meta={[
                { label: 'Step', value: `${idx + 1} of ${TEMPLATE.length}` },
                { label: 'Duration', value: `${(step.durationMs / 1000).toFixed(1)}s` },
                ...(step.output ? [{ label: 'Output', value: step.output }] : []),
              ]}
              wefRef="Annex C (Agent topology, p.84)"
            >
              <div
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                  isPending ? 'opacity-50' : ''
                } ${isRunning ? 'bg-amber-500/5' : ''} ${isAlert ? 'bg-rose-500/5' : ''}`}
              >
                {/* Status icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isPending && (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                  )}
                  {isRunning && (
                    <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  )}
                  {isDone && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {isAlert && (
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Step body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-slate-500">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isPending ? 'text-slate-400' : 'text-white'
                      }`}
                    >
                      {step.agent}
                    </span>
                    <span className="text-xs text-slate-500 ml-auto">
                      {(step.durationMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-sm ${
                      isRunning ? 'text-amber-200' : isDone ? 'text-slate-300' : isAlert ? 'text-rose-200' : 'text-slate-500'
                    }`}
                  >
                    {step.message}
                  </p>
                  {(isDone || isAlert) && step.output && (
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-emerald-300">
                      <span className="text-slate-500">→</span>
                      <span>{step.output}</span>
                    </div>
                  )}
                </div>
              </div>
            </HoverInsight>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500">
        <span className="text-slate-400">Tip:</span> hover or click any agent step for the full WEF mapping. The
        critical alert that this scan emits is what the Mission Control "Morning Briefing" surfaces at 7 AM.
      </div>
    </div>
  );
}
