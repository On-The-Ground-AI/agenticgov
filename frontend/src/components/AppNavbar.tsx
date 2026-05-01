import { Link, useLocation } from 'react-router-dom';

export function AppNavbar() {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path || (path === '/portal' && location.pathname.startsWith('/portal'));

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/portal', label: 'Demo Suite' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B8860B] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="sm:w-5 sm:h-5">
                  <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
                  <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight hidden sm:block">
                AgenticGov
                <span className="text-xs font-normal text-slate-400 ml-2">WEF Readiness Demo</span>
              </span>
              <span className="text-base font-semibold text-slate-800 sm:hidden">AgenticGov</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#B8860B]/10 text-[#B8860B]'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex md:hidden items-center gap-0.5 ml-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-[#B8860B]/10 text-[#B8860B]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.weforum.org/publications/making-agentic-ai-work-for-government-a-readiness-framework/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14L21 3m0 0h-7m7 0v7M5 3h4M3 5v14a2 2 0 002 2h14a2 2 0 002-2v-4" />
              </svg>
              WEF Source Report
            </a>
          </div>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#B8860B]/0 via-[#B8860B]/40 to-[#B8860B]/0" />
    </nav>
  );
}
