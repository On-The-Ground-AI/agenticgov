interface VisitorCounterProps {
  count: number | null;
  variant?: 'dark' | 'light';
  className?: string;
}

export function VisitorCounter({ count, variant = 'light', className = '' }: VisitorCounterProps) {
  const isDark = variant === 'dark';
  const display = count === null ? '—' : count.toLocaleString();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${
          isDark ? 'bg-emerald-400' : 'bg-emerald-500'
        } animate-pulse`}
      />
      <span className={`text-sm tabular-nums ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
        <span className="font-semibold">{display}</span>{' '}
        <span className={isDark ? 'text-white/50' : 'text-slate-400'}>visitors so far</span>
      </span>
    </div>
  );
}
