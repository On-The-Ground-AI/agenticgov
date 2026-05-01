import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';

const PortalPage = lazy(() => import('./pages/AgenticGovPortalPage').then(m => ({ default: m.AgenticGovPortalPage })));
const TenderAIPage = lazy(() => import('./pages/TenderAIPage').then(m => ({ default: m.TenderAIPage })));
const FiscalAIPage = lazy(() => import('./pages/FiscalAIPage').then(m => ({ default: m.FiscalAIPage })));
const ReadinessMapPage = lazy(() => import('./pages/ReadinessMapPage').then(m => ({ default: m.ReadinessMapPage })));
const GovBenchPage = lazy(() => import('./pages/GovBenchPage').then(m => ({ default: m.GovBenchPage })));
const TransparencyAIPage = lazy(() => import('./pages/TransparencyAIPage').then(m => ({ default: m.TransparencyAIPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-1 h-8 bg-slate-600 rounded-full animate-pulse"></div>
          <div className="w-1 h-8 bg-[#B8860B] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-8 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="text-neutral-500">Loading...</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/portal" element={<PortalPage />} />
              <Route path="/portal/tender" element={<TenderAIPage />} />
              <Route path="/portal/fiscal" element={<FiscalAIPage />} />
              <Route path="/portal/readiness" element={<ReadinessMapPage />} />
              <Route path="/portal/bench" element={<GovBenchPage />} />
              <Route path="/portal/transparency" element={<TransparencyAIPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
