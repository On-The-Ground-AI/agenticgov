import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/AppNavbar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function TermsOfServicePage() {
  useDocumentMeta({
    title: 'Terms of Use · AgenticGov',
    description: 'Terms of use for the AgenticGov visual demonstration. Non-commercial, illustrative data, governed by Singapore law.',
    canonicalPath: '/terms',
  });

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-xl p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">AgenticGov</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">Terms of Use</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: 2 May 2026</p>

          <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
            <p>
              AgenticGov (<a href="https://agenticgov.vercel.app" className="text-[#B8860B] hover:underline">agenticgov.vercel.app</a>) is a non-commercial visual demonstration of the
              World Economic Forum's <em>Making Agentic AI Work for Government — A Readiness Framework</em> (April 2026).
              By visiting the site you agree to the following.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">1. The site is a demonstration, not a product</h2>
            <p>
              All data shown — agent activity, KPIs, anomaly alerts, tender records, ministerial scorecards,
              ranking changes, disclosure reports — is illustrative and synthetic. It does not represent any
              real ministry, agency, programme, person, or fiscal position. Do not rely on any number, name,
              or output for decision-making, citation, or operational use.
            </p>
            <p>
              The architecture, agent topology, and bi-directional intelligence flows are real reference
              implementations of the WEF framework's recommended deployment patterns, but the site itself is a
              visualisation, not production software.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">2. No professional advice</h2>
            <p>
              Nothing on AgenticGov constitutes legal, financial, fiscal, regulatory, procurement, or policy
              advice. Anything that resembles a recommendation is a demo artefact. Engage qualified counsel,
              auditors, and policy advisors for real-world decisions.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">3. WEF report attribution</h2>
            <p>
              The source report — <em>Making Agentic AI Work for Government — A Readiness Framework</em> (April 2026)
              — is © World Economic Forum. The PDF is mirrored on this site for convenience only. All credit
              for the framework's analysis, structure, and conclusions rests with its authors. AgenticGov is
              independently produced and is not endorsed by, affiliated with, or commissioned by the World
              Economic Forum.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">4. Acceptable use</h2>
            <p>
              You may view, share, screenshot, embed, and discuss the site freely. You may link to it from
              government, academic, journalistic, and educational contexts. Please do not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Misrepresent the demo data as real government activity from any jurisdiction.</li>
              <li>Scrape the site at volume sufficient to disrupt service for other users.</li>
              <li>Attempt to penetrate, deface, exploit, or otherwise interfere with the underlying infrastructure.</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">5. Source code</h2>
            <p>
              The source code is published at{' '}
              <a href="https://github.com/On-The-Ground-AI/agenticgov" target="_blank" rel="noopener noreferrer" className="text-[#B8860B] hover:underline">
                github.com/On-The-Ground-AI/agenticgov
              </a>{' '}
              for transparency and study. You may inspect, fork, and adapt it for your own non-commercial
              educational purposes. If you intend to deploy a production version for a government client,
              please reach out — we are happy to help and would prefer to know.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">6. No warranty</h2>
            <p>
              AgenticGov is provided "as is", without warranty of any kind. We make no guarantees about
              uptime, accuracy, completeness, fitness for any purpose, or freedom from defect. Use it as a
              visual reference and pull the WEF report directly for anything authoritative.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">7. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by Singapore law, On The Ground and its operators are not liable
              for any indirect, incidental, special, consequential, or punitive damages arising from your use of
              or inability to use AgenticGov.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">8. Privacy</h2>
            <p>
              See the <Link to="/privacy" className="text-[#B8860B] hover:underline">Privacy Policy</Link>. Short version:
              the site has no auth, no PII collection, and a single anonymous visit counter.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">9. Governing law</h2>
            <p>
              These terms are governed by the laws of Singapore. Any disputes will be settled in the Singapore
              International Commercial Court.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">10. Contact</h2>
            <p>
              <a href="mailto:haojun@ontheground.agency" className="text-[#B8860B] hover:underline">haojun@ontheground.agency</a>{' '}
              ·{' '}
              <a href="https://wa.me/6598419481" target="_blank" rel="noopener noreferrer" className="text-[#B8860B] hover:underline">+65 9841 9481</a>
            </p>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <Link to="/" className="text-sm text-[#B8860B] hover:underline">← Back to AgenticGov</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
