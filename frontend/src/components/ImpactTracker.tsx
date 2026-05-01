import { useState, useEffect, useRef, useCallback } from 'react';
import { IMPACT_METRICS, type ImpactMetric } from '../data/hukumaDemo';
import { HoverInsight } from './HoverInsight';

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return value;
}

function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatMetricValue(value: number, unit: string): string {
  if (unit === '$B') return `$${value.toFixed(1)}B`;
  if (unit === '%') return `${Math.round(value)}%`;
  if (unit === '/100') return `${Math.round(value)}/100`;
  return `${Math.round(value).toLocaleString()}`;
}

function BreakdownModal({
  metric,
  onClose,
}: {
  metric: ImpactMetric;
  onClose: () => void;
}) {
  const { breakdown } = metric;
  const formatted = formatMetricValue(metric.value, metric.unit);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-5 rounded-t-xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {metric.label}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-3xl font-bold text-slate-800">{formatted}</p>
                <Sparkline data={metric.sparkline} color="#B8860B" width={120} height={32} />
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-1">
                ↑ {metric.trendLabel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Overview */}
          <section>
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">Overview</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{breakdown.description}</p>
          </section>

          {/* Breakdown - horizontal bar chart */}
          <section>
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">Breakdown</h4>
            <div className="space-y-3">
              {breakdown.components.map((comp) => (
                <div key={comp.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-slate-700">{comp.label}</span>
                    <span className="text-[11px] text-slate-500">
                      {comp.value} ({comp.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${comp.percentage}%`,
                        backgroundColor: '#B8860B',
                        opacity: 0.6 + (comp.percentage / 100) * 0.4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Before & After */}
          {breakdown.comparison.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                Before & After
              </h4>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 bg-neutral-50 border-b border-neutral-200">
                  <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Metric
                  </div>
                  <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                    Before
                  </div>
                  <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                    After
                  </div>
                </div>
                {breakdown.comparison.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-3 ${
                      i < breakdown.comparison.length - 1 ? 'border-b border-neutral-100' : ''
                    }`}
                  >
                    <div className="px-3 py-2.5 text-[11px] font-medium text-slate-700">
                      {row.label}
                    </div>
                    <div className="px-3 py-2.5 text-[11px] text-slate-500 text-center">
                      {row.before}
                    </div>
                    <div className="px-3 py-2.5 text-[11px] font-medium text-emerald-700 text-center">
                      {row.after}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Top Contributors */}
          {breakdown.topContributors.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                Top Contributors
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {breakdown.topContributors.map((c) => (
                  <div
                    key={c.name}
                    className="border border-neutral-200 rounded-lg p-3 bg-neutral-50/50"
                  >
                    <p className="text-[11px] font-semibold text-slate-800">{c.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.contribution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Methodology */}
          <section className="border-t border-neutral-100 pt-4">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Methodology
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">{breakdown.methodology}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

const METRIC_TOOLTIPS: Record<string, { title: string; description: string; meta?: { label: string; value: string }[] }> = {
  'Analyst Hours Saved': {
    title: 'Analyst Hours Saved',
    description: 'Hours of manual government analyst work replaced by automated agent operations — including report generation, data compilation, compliance checking, and trend analysis.',
    meta: [{ label: 'Methodology', value: 'Task timing comparison' }, { label: 'Baseline', value: 'Pre-deployment manual processes' }],
  },
  'Compliance Rate': {
    title: 'Compliance Rate',
    description: 'Percentage of government programs meeting their regulatory disclosure and reporting requirements on time, as monitored by TransparencyAI agents.',
    meta: [{ label: 'Target', value: '95%' }, { label: 'Programs monitored', value: '47' }],
  },
  'Budget Optimized': {
    title: 'Budget Optimized',
    description: 'Total government spending where FiscalAI agents identified optimization opportunities — including duplicate spending, efficiency gaps, and better procurement alternatives.',
    meta: [{ label: 'Verified savings', value: 'Audited quarterly' }, { label: 'Ministries', value: '8' }],
  },
  'Governance Score': {
    title: 'Governance Score',
    description: 'Composite score from GovBench agents tracking performance across 12 international governance indices including WEF, IMD, and UN E-Government rankings.',
    meta: [{ label: 'Indices tracked', value: '12' }, { label: 'Peer group', value: 'Top 20 nations' }],
  },
};

function MetricCard({
  metric,
  index,
  onClick,
}: {
  metric: ImpactMetric;
  index: number;
  onClick: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const animated = useCountUp(metric.value, 1200, visible);
  const formatted = formatMetricValue(animated, metric.unit);

  const tooltip = METRIC_TOOLTIPS[metric.label] ?? {
    title: metric.label,
    description: 'Platform impact metric tracked across AgenticGov agent domains.',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm p-4 cursor-pointer hover:shadow-lg hover:border-[#B8860B]/30 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <HoverInsight title={tooltip.title} description={tooltip.description} meta={tooltip.meta}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{metric.label}</p>
          </HoverInsight>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatted}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
            ↑ {metric.trendLabel}
          </p>
        </div>
        <HoverInsight
          title="6-Month Trend"
          description="Sparkline showing this metric's trajectory over the past 6 months. Each point represents a monthly measurement."
          meta={[{ label: 'Period', value: '6 months' }, { label: 'Data points', value: '6' }]}
        >
          <Sparkline data={metric.sparkline} color="#B8860B" />
        </HoverInsight>
      </div>
    </div>
  );
}

export function ImpactTracker() {
  const [selectedMetric, setSelectedMetric] = useState<ImpactMetric | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <HoverInsight
            title="Platform Impact Metrics"
            description="Cumulative impact measurements since AgenticGov deployment 6 months ago. Each metric is independently calculated from agent activity logs, government data feeds, and user reports. Click any metric card for a full breakdown."
            meta={[{ label: 'Tracking since', value: 'Oct 2025' }, { label: 'Data sources', value: '7 agent domains' }, { label: 'Refresh', value: 'Real-time' }]}
          >
            <h3 className="text-sm font-semibold text-slate-800">Platform Impact</h3>
          </HoverInsight>
          <p className="text-[10px] text-slate-500">Cumulative since deployment (6 months)</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {IMPACT_METRICS.map((metric, i) => (
          <MetricCard
            key={metric.label}
            metric={metric}
            index={i}
            onClick={() => setSelectedMetric(metric)}
          />
        ))}
      </div>

      {selectedMetric && (
        <BreakdownModal
          metric={selectedMetric}
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </div>
  );
}
