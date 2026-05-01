import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/portal', label: 'Mission Control', shortLabel: 'Portal' },
  { path: '/portal/tender', label: 'TenderAI', shortLabel: 'Tender' },
  { path: '/portal/fiscal', label: 'FiscalAI', shortLabel: 'Fiscal' },
  { path: '/portal/readiness', label: 'ReadinessMap', shortLabel: 'Readiness' },
  { path: '/portal/bench', label: 'GovBench', shortLabel: 'Bench' },
  { path: '/portal/transparency', label: 'TransparencyAI', shortLabel: 'Transparency' },
];

export function AgenticGovSubNav() {
  const location = useLocation();

  return (
    <div className="glass-strong border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-3 flex-shrink-0">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#B8860B] to-[#8B6914] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">A</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">AgenticGov Suite</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#B8860B]/10 text-[#B8860B]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
