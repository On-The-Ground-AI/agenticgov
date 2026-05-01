import { useState, useEffect, useCallback } from 'react';
import { type EventChain as EventChainType, EVENT_CHAINS, getAppColor, getAppName } from '../data/agenticDemo';
import { HoverInsight } from './HoverInsight';

const STATUS_STYLES = {
  trigger: 'bg-red-100 text-red-700 border-red-300',
  response: 'bg-blue-100 text-blue-700 border-blue-300',
  outcome: 'bg-emerald-100 text-emerald-700 border-emerald-300',
} as const;

function ChainVisualization({ chain, playing }: { chain: EventChainType; playing: boolean }) {
  const [visibleSteps, setVisibleSteps] = useState(0);

  const runAnimation = useCallback(async () => {
    setVisibleSteps(0);
    for (let i = 1; i <= chain.steps.length; i++) {
      await new Promise(r => setTimeout(r, 1500));
      setVisibleSteps(i);
    }
  }, [chain.steps.length]);

  useEffect(() => {
    if (playing) {
      runAnimation();
    } else {
      setVisibleSteps(chain.steps.length);
    }
  }, [playing, runAnimation, chain.steps.length]);

  return (
    <div className="space-y-0">
      {chain.steps.map((step, i) => {
        const visible = i < visibleSteps;
        const isLast = i === chain.steps.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-500 ${
                  visible ? '' : 'scale-0 opacity-0'
                }`}
                style={{ backgroundColor: visible ? getAppColor(step.app) : '#e2e8f0' }}
              />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[24px] transition-all duration-500 ${
                    visible ? 'bg-slate-300' : 'bg-transparent'
                  }`}
                />
              )}
            </div>
            <div
              className={`flex-1 pb-3 transition-all duration-500 ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <HoverInsight
                  title={getAppName(step.app)}
                  description={`${getAppName(step.app)} agent responding to the chain event. ${step.status === 'trigger' ? 'This is the originating detection.' : step.status === 'response' ? 'This agent is processing and forwarding intelligence.' : 'This is the resolution or outcome.'}`}
                  meta={[{label: 'Status', value: step.status}, {label: 'Timing', value: step.delayLabel}]}
                >
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${getAppColor(step.app)}15`, color: getAppColor(step.app) }}
                  >
                    {getAppName(step.app)}
                  </span>
                </HoverInsight>
                <span className="text-[10px] text-slate-400">{step.delayLabel}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${STATUS_STYLES[step.status]}`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{step.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EventChainPanel() {
  const [selectedChain, setSelectedChain] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), EVENT_CHAINS[selectedChain].steps.length * 1500 + 500);
  };

  return (
    <div className="glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <HoverInsight
            title="Cross-App Event Chains"
            description="Visualizes how a single detection by one agent cascades through multiple AgenticGov domains. Each chain shows the trigger event, which agents respond, what data flows between them, and the final outcome."
            meta={[{label: 'Active chains', value: '3 scenarios'}, {label: 'Avg chain length', value: '5 steps'}]}
          >
            <h3 className="text-sm font-semibold text-slate-800">Cross-App Event Chains</h3>
          </HoverInsight>
          <p className="text-[10px] text-slate-500 mt-0.5">How one detection cascades across the platform</p>
        </div>
        <HoverInsight
          title="Replay Chain"
          description="Animates the event chain step-by-step, showing each agent's response in sequence with realistic timing delays. Watch how intelligence flows across the platform in real time."
        >
          <button
            onClick={handlePlay}
            disabled={playing}
            className="text-[10px] font-medium px-3 py-1.5 rounded-md bg-[#B8860B] text-white hover:bg-[#996F0A] transition disabled:opacity-50"
          >
            {playing ? 'Playing...' : '▶ Replay'}
          </button>
        </HoverInsight>
      </div>

      <div className="flex gap-2 px-4 pt-3">
        {EVENT_CHAINS.map((chain, i) => (
          <HoverInsight
            key={chain.id}
            title={chain.title}
            description={`Scenario: ${chain.trigger}. This chain demonstrates how ${chain.steps.length} agents across multiple domains coordinate to detect, analyze, and respond to this event.`}
            meta={[{label: 'Steps', value: String(chain.steps.length)}, {label: 'Trigger type', value: chain.steps[0]?.status ?? 'trigger'}]}
          >
            <button
              onClick={() => { setSelectedChain(i); setPlaying(false); }}
              className={`text-[10px] font-medium px-2.5 py-1.5 rounded-md transition ${
                selectedChain === i
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chain.title}
            </button>
          </HoverInsight>
        ))}
      </div>

      <div className="p-4">
        <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Trigger</p>
          <p className="text-xs text-slate-700 font-medium mt-0.5">{EVENT_CHAINS[selectedChain].trigger}</p>
        </div>
        <ChainVisualization chain={EVENT_CHAINS[selectedChain]} playing={playing} />
      </div>
    </div>
  );
}
