import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface InsightMeta {
  label: string;
  value: string;
}

interface HoverInsightProps {
  title: string;
  description: string;
  meta?: InsightMeta[];
  /** Optional WEF report section / page reference shown as a footer link. */
  wefRef?: string;
  /** Optional "How this maps to your jurisdiction" hints (SG / IN / AE / PK). */
  jurisdiction?: { label: string; value: string }[];
  children: ReactNode;
  /** Delay before the hover popup appears (ms). Default 1000ms. */
  delayMs?: number;
  maxWidth?: number;
}

interface Position {
  top: number;
  left: number;
  arrowLeft: number;
  placement: 'above' | 'below';
}

const WEF_REPORT_URL =
  'https://www.weforum.org/publications/making-agentic-ai-work-for-government-a-readiness-framework/';

function TooltipContent({
  title,
  description,
  meta,
  wefRef,
  jurisdiction,
  position,
  maxWidth,
  pinned,
  onClose,
}: {
  title: string;
  description: string;
  meta?: InsightMeta[];
  wefRef?: string;
  jurisdiction?: { label: string; value: string }[];
  position: Position;
  maxWidth: number;
  pinned: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        maxWidth,
        animation: 'hoverInsightFadeIn 0.18s ease-out',
        pointerEvents: pinned ? 'auto' : 'none',
      }}
    >
      <div
        className={`glass-tooltip text-white rounded-xl px-3.5 py-2.5 ${
          position.placement === 'above' ? 'mb-2' : 'mt-2'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold text-[#D4A843] leading-tight">{title}</p>
          {pinned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-slate-400 hover:text-white text-base leading-none -mt-0.5"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{description}</p>

        {meta && meta.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-600/50 space-y-1">
            {meta.map((m) => (
              <div key={m.label} className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400">{m.label}</span>
                <span className="text-[10px] font-medium text-slate-200">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {jurisdiction && jurisdiction.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-600/50">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 mb-1">
              In your jurisdiction
            </p>
            <div className="space-y-0.5">
              {jurisdiction.map((j) => (
                <div key={j.label} className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-slate-300">{j.label}</span>
                  <span className="text-[10px] text-slate-400 text-right">{j.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {wefRef && (
          <div className="mt-2 pt-2 border-t border-slate-600/50">
            <a
              href={WEF_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] text-[#D4A843] hover:text-[#F0C266] inline-flex items-center gap-1"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
              </svg>
              {wefRef} · WEF Readiness Framework
            </a>
          </div>
        )}
      </div>
      <div
        className="absolute w-0 h-0"
        style={{
          left: position.arrowLeft,
          ...(position.placement === 'above'
            ? {
                bottom: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #1e293b',
              }
            : {
                top: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #1e293b',
              }),
        }}
      />
    </div>
  );
}

export function HoverInsight({
  title,
  description,
  meta,
  wefRef,
  jurisdiction,
  children,
  delayMs = 1000,
  maxWidth = 340,
}: HoverInsightProps) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const placement = spaceAbove > 200 ? 'above' : 'below';

    let left = centerX - maxWidth / 2;
    if (left < 8) left = 8;
    if (left + maxWidth > window.innerWidth - 8) left = window.innerWidth - maxWidth - 8;

    const arrowLeft = Math.max(12, Math.min(centerX - left - 6, maxWidth - 24));

    setPosition({
      top: placement === 'above' ? rect.top - 8 : rect.bottom + 8,
      left,
      arrowLeft,
      placement,
    });
  }, [maxWidth]);

  const show = useCallback(() => {
    computePosition();
    setVisible(true);
  }, [computePosition]);

  const handleEnter = useCallback(() => {
    if (pinned) return;
    timerRef.current = setTimeout(show, delayMs);
  }, [show, delayMs, pinned]);

  const handleLeave = useCallback(() => {
    if (pinned) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, [pinned]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      e.preventDefault();
      e.stopPropagation();
      computePosition();
      setPinned((p) => !p);
      setVisible(true);
    },
    [computePosition],
  );

  const close = useCallback(() => {
    setPinned(false);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-hoverinsight-popup]')
      ) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pinned, close]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        className="contents"
      >
        {children}
      </span>
      {visible &&
        position &&
        createPortal(
          <div data-hoverinsight-popup>
            <TooltipContent
              title={title}
              description={description}
              meta={meta}
              wefRef={wefRef}
              jurisdiction={jurisdiction}
              position={position}
              maxWidth={maxWidth}
              pinned={pinned}
              onClose={close}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
