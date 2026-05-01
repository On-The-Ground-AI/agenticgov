import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="flex-shrink-0">
              <defs>
                <linearGradient id="lightning-gradient-pp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6"/>
                  <stop offset="50%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
              <path fill="url(#lightning-gradient-pp)" d="M18.5 2L6 18h8l-2 12 12.5-16H16.5l2-12z"/>
            </svg>
            <div>
              <h1 className="text-lg font-semibold text-neutral-800 tracking-tight">Policy AI Advisor</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Policy Advisory Platform</p>
            </div>
          </Link>
          <Link to="/" className="text-sm text-[#B8860B] hover:text-[#9A7209] font-medium">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-semibold text-neutral-900">Privacy Policy</h2>
          <p className="mt-2 text-sm text-neutral-500">Last updated: February 19, 2026</p>

          <div className="mt-8 prose prose-neutral max-w-none space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-neutral-800">1. Introduction</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">
                Policy AI Advisor by OTG ("we", "our", "the Platform") is an AI-powered policy advisory platform that helps government officials design, analyse, implement, and evaluate public policies. This Privacy Policy describes how we collect, use, and protect your information when you use the Platform.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">2. Information We Collect</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p><strong className="text-neutral-700">Account Information:</strong> When you register, we collect your email address, name, and professional role (e.g., policy officer, researcher).</p>
                <p><strong className="text-neutral-700">Usage Data:</strong> We track feature usage, page views, and interaction patterns to improve the Platform. This data is collected via our activity tracking system and stored in our database.</p>
                <p><strong className="text-neutral-700">Evaluation Content:</strong> Program descriptions, evaluation designs, and other content you submit through the Platform's tools (chat assistant, evaluation wizard, quality scorer, etc.).</p>
                <p><strong className="text-neutral-700">Feedback:</strong> Any feedback or comments you submit through the in-app feedback widget.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">3. AI Model Usage and Data Processing</h3>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900">Important: AI-Powered Features</h4>
                <div className="mt-2 text-blue-800 leading-relaxed space-y-3">
                  <p>
                    Policy AI Advisor uses artificial intelligence models provided by <strong>Anthropic</strong> to power its core features. Specifically, the Platform uses:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Claude Opus 4.6</strong> — for evaluation design generation, ex-ante analysis (CBA/CEA/MCA), quality scoring, and report verification</li>
                    <li><strong>Claude Sonnet 4.6</strong> — for the conversational assistant, method recommendations, and document analysis</li>
                  </ul>
                  <p>
                    When you use AI-powered features, the content you submit (such as program descriptions, evaluation parameters, and documents) is sent to Anthropic's API for processing. This is necessary to generate evaluation designs, recommendations, and quality assessments.
                  </p>
                  <p>
                    All AI-generated outputs are grounded in our curated knowledge base of 120,000+ words of evaluation methodology sourced from OECD standards, J-PAL, policy frameworks, and published academic literature. This grounding is implemented via Retrieval-Augmented Generation (RAG) to ensure methodological accuracy.
                  </p>
                </div>
              </div>
              <div className="mt-3 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  <strong className="text-neutral-700">Anthropic's data handling:</strong> Content sent to Anthropic's API is processed in accordance with Anthropic's usage policies. We recommend reviewing <strong>Anthropic's Privacy Policy</strong> for details on how they handle API data.
                </p>
                <p>
                  <strong className="text-neutral-700">No AI training on your data:</strong> As an API customer, content submitted through Policy AI Advisor is not used by Anthropic to train their AI models, per Anthropic's API terms of service.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">4. How We Use Your Information</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide and operate the Platform's evaluation design, scoring, and analysis features</li>
                  <li>Process your inputs through AI models to generate evaluation guidance</li>
                  <li>Improve the Platform based on usage analytics and feedback</li>
                  <li>Communicate with you about your account and Platform updates</li>
                  <li>Maintain security and prevent abuse through audit logging</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">5. Data Storage and Security</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>Your data is stored securely using <strong className="text-neutral-700">Supabase</strong> (PostgreSQL database with row-level security policies). Authentication is handled through Supabase Auth with encrypted credentials.</p>
                <p>We implement row-level security (RLS) policies to ensure users can only access their own data. Admin access is restricted and all significant actions are logged in our audit system.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">6. Data Sharing</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>We do not sell your personal information. We share data only with:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-neutral-700">Anthropic</strong> — to process AI-powered features (evaluation design, scoring, chat, etc.)</li>
                  <li><strong className="text-neutral-700">Supabase</strong> — for database hosting and authentication</li>
                  <li><strong className="text-neutral-700">Vercel</strong> — for application hosting and serverless function execution</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">7. Your Rights</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Export your evaluation designs and saved content</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">8. Contact</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  If you have questions about this Privacy Policy or how your data is handled, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-neutral-700">Privacy inquiries:</strong> <a href="mailto:privacy@ontheground.agency" className="text-[#B8860B] hover:text-[#9A7209] underline">privacy@ontheground.agency</a></li>
                  <li><strong className="text-neutral-700">General inquiries:</strong> Haojun See — <a href="mailto:haojun@ontheground.agency" className="text-[#B8860B] hover:text-[#9A7209] underline">haojun@ontheground.agency</a></li>
                  <li><strong className="text-neutral-700">Legal:</strong> <a href="mailto:legal@ontheground.agency" className="text-[#B8860B] hover:text-[#9A7209] underline">legal@ontheground.agency</a></li>
                </ul>
                <p>
                  You can also reach us through the in-app feedback widget.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">Policy AI Advisor by OTG — Policy Advisory Platform</p>
          <p className="text-xs mt-2 text-neutral-600">AI features powered by Claude (Anthropic)</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span className="text-neutral-400">Privacy Policy</span>
            <span className="text-neutral-700">|</span>
            <Link to="/terms" className="text-neutral-500 hover:text-neutral-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
