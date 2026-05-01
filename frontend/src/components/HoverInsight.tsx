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
  children: ReactNode;
  delayMs?: number;
  maxWidth?: number;
}

interface Position {
  top: number;
  left: number;
  arrowLeft: number;
  placement: 'above' | 'below';
}

function TooltipContent({
  title,
  description,
  meta,
  position,
  maxWidth,
}: {
  title: string;
  description: string;
  meta?: InsightMeta[];
  position: Position;
  maxWidth: number;
}) {
  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        maxWidth,
        animation: 'hoverInsightFadeIn 0.18s ease-out',
      }}
    >
      <div
        className={`bg-slate-800 text-white rounded-lg shadow-xl border border-slate-700 px-3.5 py-2.5 ${
          position.placement === 'above' ? 'mb-2' : 'mt-2'
        }`}
      >
        <p className="text-xs font-semibold text-[#D4A843] leading-tight">{title}</p>
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
      </div>
      {/* Arrow */}
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
  children,
  delayMs = 1000,
  maxWidth = 320,
}: HoverInsightProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const show = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const placement = spaceAbove > 160 ? 'above' : 'below';

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
    setVisible(true);
  }, [maxWidth]);

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(show, delayMs);
  }, [show, delayMs]);

  const handleLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

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
        className="contents"
      >
        {children}
      </span>
      {visible &&
        position &&
        createPortal(
          <TooltipContent
            title={title}
            description={description}
            meta={meta}
            position={position}
            maxWidth={maxWidth}
          />,
          document.body,
        )}
    </>
  );
}
