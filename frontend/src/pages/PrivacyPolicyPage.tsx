import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/AppNavbar';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-xl p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">AgenticGov</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: 2 May 2026</p>

          <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
            <p>
              AgenticGov (<a href="https://agenticgov.vercel.app" className="text-[#B8860B] hover:underline">agenticgov.vercel.app</a>) is a non-commercial visual demonstration of the
              World Economic Forum's <em>Making Agentic AI Work for Government — A Readiness Framework</em> (April 2026).
              It is built and operated by On The Ground, a Singapore civic-tech and AI studio.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">What we collect</h2>
            <p>We deliberately collect as little as possible.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>An anonymous visit counter.</strong> Each time someone loads the home page, a single integer
                in our database increments. We do not store IP addresses, user agents, referrers, cookies, or any
                identifier tied to that increment.
              </li>
              <li>
                <strong>Standard server logs.</strong> Our hosting provider (Vercel) records request metadata
                (path, status code, timestamp, anonymised IP) for routine operations and abuse prevention.
                These logs roll over per Vercel's retention policy.
              </li>
              <li>
                <strong>No accounts, no auth, no PII.</strong> The site requires no login. There is no
                user profile, no settings, no message history. We have nothing to leak.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">What we don't collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No tracking cookies. No analytics scripts (no Google Analytics, no Mixpanel, no Hotjar, no Segment).</li>
              <li>No fingerprinting. No third-party advertising or remarketing pixels.</li>
              <li>No form submissions are stored — there are no forms on the site.</li>
              <li>No AI inference is performed on visitor data. The agent simulations you see are pre-canned demo data.</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">How we use the visit count</h2>
            <p>
              The visit count is shown on the landing page and footer for transparency about engagement. It is
              an aggregate integer; it does not allow us — or anyone — to identify any individual visitor. We do
              not export, sell, share, or analyse this number for any commercial purpose.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">Sub-processors</h2>
            <p>We rely on a small number of well-known infrastructure providers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Vercel</strong> — static site hosting and serverless functions (multi-region edge).</li>
              <li><strong>Neon</strong> — Postgres database in <code>ap-southeast-1</code> (Singapore) for the visit counter only.</li>
              <li><strong>GitHub</strong> — source code repository.</li>
              <li><strong>Google Fonts</strong> — Open Sans webfont served from Google's CDN; this exposes your IP to Google when fonts load.</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">Outbound links</h2>
            <p>
              The site links to the WEF report PDF (mirrored locally and externally), and to On The Ground's GitHub.
              We are not responsible for the privacy practices of those destinations.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">Children</h2>
            <p>
              The demo is intended for government professionals and researchers. We do not knowingly collect data
              from anyone under 13.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">Your rights</h2>
            <p>
              Because we don't collect personal data, there is nothing to access, correct, export, or delete.
              If you have a question or want us to clarify anything, email{' '}
              <a href="mailto:haojun@ontheground.agency" className="text-[#B8860B] hover:underline">haojun@ontheground.agency</a>{' '}
              or message{' '}
              <a href="https://wa.me/6598419481" target="_blank" rel="noopener noreferrer" className="text-[#B8860B] hover:underline">+65 9841 9481</a>{' '}
              on WhatsApp.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-2">Changes to this policy</h2>
            <p>
              If we change anything material — for example, adding analytics or changing a sub-processor — we
              will update this page and the "Last updated" date above. The history of changes is visible in the
              public Git repository.
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
