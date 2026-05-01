import React, { useState, useEffect, useCallback } from 'react';

export interface AgentStep {
  icon: 'search' | 'check' | 'compare' | 'generate' | 'send' | 'alert' | 'analyze';
  message: string;
  duration: number;
  detail?: string;
}

interface AgentStepSimulatorProps {
  steps: AgentStep[];
  onComplete?: () => void;
  running: boolean;
  title?: string;
}

const STEP_ICONS: Record<string, React.JSX.Element> = {
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth="2"/></svg>,
  check: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>,
  compare: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
  generate: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" strokeWidth="2"/></svg>,
  send: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
  alert: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
  analyze: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.219-8.56M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
};

export function AgentStepSimulator({ steps, onComplete, running, title = 'Agent Workflow' }: AgentStepSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const runSteps = useCallback(async () => {
    setCurrentStep(-1);
    setCompletedSteps([]);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setCompletedSteps(prev => [...prev, i]);
    }
    setCurrentStep(steps.length);
    onComplete?.();
  }, [steps, onComplete]);

  useEffect(() => {
    if (running) {
      runSteps();
    } else {
      setCurrentStep(-1);
      setCompletedSteps([]);
    }
  }, [running, runSteps]);

  const isComplete = currentStep >= steps.length;
  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {running && !isComplete && (
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          )}
          {isComplete && (
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
          {!running && !isComplete && (
            <div className="w-2 h-2 rounded-full bg-slate-600" />
          )}
          <span className="text-xs font-medium text-slate-300">{title}</span>
        </div>
        {running && (
          <span className="text-[10px] text-slate-500">{Math.round(progress)}%</span>
        )}
      </div>

      {running && !isComplete && (
        <div className="h-0.5 bg-slate-800">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-3 space-y-2">
        {steps.map((step, i) => {
          const isActive = currentStep === i && !completedSteps.includes(i);
          const isDone = completedSteps.includes(i);
          const isPending = !isActive && !isDone;

          return (
            <div
              key={i}
              className={`flex items-start gap-2.5 transition-opacity duration-300 ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${
                isActive ? 'text-blue-400 animate-spin-slow' :
                isDone ? 'text-emerald-400' :
                'text-slate-600'
              }`}>
                {STEP_ICONS[step.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${
                  isActive ? 'text-blue-300' :
                  isDone ? 'text-slate-400' :
                  'text-slate-600'
                }`}>
                  {step.message}
                  {isActive && <span className="inline-block ml-1 animate-pulse">...</span>}
                </p>
                {step.detail && isDone && (
                  <p className="text-[10px] text-slate-600 mt-0.5">{step.detail}</p>
                )}
              </div>
              {isDone && (
                <span className="text-emerald-400 text-[10px] mt-0.5 flex-shrink-0">Done</span>
              )}
            </div>
          );
        })}

        {isComplete && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/>
              </svg>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Agent workflow complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
