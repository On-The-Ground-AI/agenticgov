import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface TourStep {
  /** CSS selector of the element to highlight. The element must exist when the step activates. */
  target: string;
  title: string;
  body: string;
  /** Where to anchor the popover relative to the target. */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Optional: scroll into view smoothly before showing. */
  scroll?: boolean;
}

const STEPS: TourStep[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome to AgenticGov',
    body: 'A 30-second guided tour of the demo. You\'ll see what the WEF Readiness Framework looks like running. Press → to continue, ✕ to skip.',
  },
  {
    target: '[data-tour="audience"]',
    placement: 'bottom',
    title: 'Built for four jurisdictions',
    body: 'Singapore is the primary reference (real agencies and programmes used throughout the data). India, UAE, and Pakistan are secondary audiences — every popup includes equivalents for your jurisdiction.',
  },
  {
    target: '[data-tour="run-scan"]',
    placement: 'bottom',
    title: 'Press the button. See the agents.',
    body: 'Click "Watch a Live Agent Run" to see a 6-step FiscalAI overnight scan animate. Real timing, real outputs, real downstream alerts.',
    scroll: true,
  },
  {
    target: '[data-tour="pillars"]',
    placement: 'top',
    title: '70 functions, five pillars',
    body: 'The WEF report enumerates 70 government functions. They cluster into 5 lifecycle stages. Hover any tile for the function count, readiness tier, and your jurisdiction\'s equivalent agencies.',
    scroll: true,
  },
  {
    target: '[data-tour="apps"]',
    placement: 'top',
    title: 'Six interconnected apps',
    body: 'Each tile is a live, fully-interactive surface. Mission Control is the orchestration layer; the other five are the specialised agents. Click any to enter — no login.',
    scroll: true,
  },
  {
    target: '[data-tour="flows"]',
    placement: 'top',
    title: 'Cross-app intelligence',
    body: 'The framework\'s central insight: most government value comes from bi-directional flows between agencies, not siloed assistants. These five flows run live in the demo.',
    scroll: true,
  },
  {
    target: 'body',
    placement: 'center',
    title: 'You\'re ready',
    body: 'Click "Launch Mission Control" to enter the orchestration portal. Or hover anything on the page — every element has a popup linking back to the WEF report section.',
  },
];

interface PopoverPosition {
  top: number;
  left: number;
  highlightTop: number;
  highlightLeft: number;
  highlightWidth: number;
  highlightHeight: number;
}

export function GuidedTour() {
  const [params, setParams] = useSearchParams();
  const tourActive = params.get('tour') === '1';
  const [stepIdx, setStepIdx] = useState(0);
  const [pos, setPos] = useState<PopoverPosition | null>(null);
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[stepIdx];

  // Position the popover + highlight rect relative to the target element
  useEffect(() => {
    if (!tourActive || !currentStep) return;

    let cancelled = false;

    function compute() {
      if (cancelled) return;
      const target =
        currentStep.target === 'body'
          ? null
          : (document.querySelector(currentStep.target) as HTMLElement | null);

      if (currentStep.scroll && target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Allow scroll to settle before measuring
      setTimeout(() => {
        if (cancelled) return;

        if (currentStep.placement === 'center' || !target) {
          setPos({
            top: window.innerHeight / 2 - 100,
            left: window.innerWidth / 2 - 200,
            highlightTop: 0,
            highlightLeft: 0,
            highlightWidth: 0,
            highlightHeight: 0,
          });
          setVisible(true);
          return;
        }

        const r = target.getBoundingClientRect();
        const popoverWidth = 380;
        const popoverHeight = 180;
        const margin = 20;

        let top = 0;
        let left = 0;

        switch (currentStep.placement ?? 'bottom') {
          case 'top':
            top = r.top - popoverHeight - margin;
            left = r.left + r.width / 2 - popoverWidth / 2;
            break;
          case 'bottom':
            top = r.bottom + margin;
            left = r.left + r.width / 2 - popoverWidth / 2;
            break;
          case 'left':
            top = r.top + r.height / 2 - popoverHeight / 2;
            left = r.left - popoverWidth - margin;
            break;
          case 'right':
            top = r.top + r.height / 2 - popoverHeight / 2;
            left = r.right + margin;
            break;
        }

        // Clamp to viewport
        if (left < 16) left = 16;
        if (left + popoverWidth > window.innerWidth - 16) left = window.innerWidth - popoverWidth - 16;
        if (top < 16) top = 16;
        if (top + popoverHeight > window.innerHeight - 16) top = window.innerHeight - popoverHeight - 16;

        setPos({
          top,
          left,
          highlightTop: r.top - 8,
          highlightLeft: r.left - 8,
          highlightWidth: r.width + 16,
          highlightHeight: r.height + 16,
        });
        setVisible(true);
      }, currentStep.scroll ? 500 : 50);
    }

    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [stepIdx, tourActive, currentStep]);

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
    else end();
  };
  const prev = () => stepIdx > 0 && setStepIdx(stepIdx - 1);
  const end = () => {
    setVisible(false);
    setStepIdx(0);
    const newParams = new URLSearchParams(params);
    newParams.delete('tour');
    setParams(newParams, { replace: true });
  };

  // Keyboard nav
  useEffect(() => {
    if (!tourActive) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') end();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!tourActive || !visible || !pos) return null;

  const isCenter = currentStep.placement === 'center';
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;

  return (
    <>
      {/* Backdrop with cutout for the highlighted element */}
      <div
        className="fixed inset-0 z-[9990] pointer-events-auto"
        style={{ background: 'rgba(15, 23, 42, 0.55)' }}
        onClick={end}
      />

      {/* Highlight ring around target */}
      {!isCenter && pos.highlightWidth > 0 && (
        <div
          className="fixed z-[9991] pointer-events-none rounded-2xl"
          style={{
            top: pos.highlightTop,
            left: pos.highlightLeft,
            width: pos.highlightWidth,
            height: pos.highlightHeight,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55), 0 0 0 2px rgba(212, 168, 67, 0.9), 0 0 24px 4px rgba(212, 168, 67, 0.45)',
            background: 'transparent',
            transition: 'all 0.25s ease',
          }}
        />
      )}

      {/* Popover */}
      <div
        ref={popoverRef}
        className="fixed z-[9999] glass-strong rounded-xl p-5 text-slate-900"
        style={{
          top: pos.top,
          left: pos.left,
          width: 380,
          animation: 'hoverInsightFadeIn 0.25s ease-out',
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[10px] font-mono text-slate-400">
            {String(stepIdx + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
          <button onClick={end} className="text-slate-400 hover:text-slate-700 text-base leading-none" aria-label="Skip tour">
            ✕
          </button>
        </div>
        <h3 className="text-base font-semibold text-slate-900 leading-snug">{currentStep.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{currentStep.body}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === stepIdx ? 'w-6 bg-[#B8860B]' : i < stepIdx ? 'w-2 bg-[#B8860B]/50' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={prev}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#B8860B] hover:bg-[#9a7209] text-white text-xs font-semibold transition"
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
