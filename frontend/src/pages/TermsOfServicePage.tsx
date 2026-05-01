import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="flex-shrink-0">
              <defs>
                <linearGradient id="lightning-gradient-tos" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6"/>
                  <stop offset="50%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
              <path fill="url(#lightning-gradient-tos)" d="M18.5 2L6 18h8l-2 12 12.5-16H16.5l2-12z"/>
            </svg>
            <div>
              <h1 className="text-lg font-semibold text-neutral-800 tracking-tight">Policy AI Advisor</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Policy Advisory Platform</p>
            </div>
          </Link>
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-700 font-medium">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-semibold text-neutral-900">Terms of Service</h2>
          <p className="mt-2 text-sm text-neutral-500">Last updated: February 19, 2026</p>

          <div className="mt-8 prose prose-neutral max-w-none space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-neutral-800">1. Acceptance of Terms</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">
                By accessing or using Policy AI Advisor by OTG ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform. The Platform is designed for government officials, researchers, and program managers involved in impact evaluation.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">2. Description of Service</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  Policy AI Advisor by OTG is an AI-powered policy advisory platform that helps government officials design, analyse, implement, and evaluate public policies. The Platform's tools include:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Conversational evaluation assistant</li>
                  <li>Evaluation design wizard (ex-post and ex-ante)</li>
                  <li>Method recommendation engine</li>
                  <li>Quality scoring system</li>
                  <li>Document analysis</li>
                  <li>Knowledge base and case study library</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">3. AI-Generated Content Disclosure</h3>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-semibold text-amber-900">Important: AI Model Information</h4>
                <div className="mt-2 text-amber-800 leading-relaxed space-y-3">
                  <p>
                    The Platform uses AI models developed by <strong>Anthropic</strong> to generate evaluation designs, recommendations, quality assessments, and other analytical outputs. The specific models used are:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Claude Opus 4.6</strong> (model ID: claude-opus-4-6) — used for evaluation design generation, ex-ante cost-benefit and cost-effectiveness analysis, quality scoring against rubrics, and report verification</li>
                    <li><strong>Claude Sonnet 4.6</strong> (model ID: claude-sonnet-4-6) — used for the conversational assistant, method recommendation, and document analysis</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  <strong className="text-neutral-700">Knowledge grounding:</strong> All AI-generated outputs are grounded in a curated knowledge base of 120,000+ words of evaluation methodology. The Platform uses Retrieval-Augmented Generation (RAG) to ensure AI responses reference established evaluation standards from OECD, J-PAL, and published academic literature, adapted for governance frameworks.
                </p>
                <p>
                  <strong className="text-neutral-700">Not a substitute for professional judgment:</strong> AI-generated evaluation designs, scores, and recommendations are intended as decision-support tools. They should be reviewed by qualified professionals before implementation. The Platform does not replace the need for methodological expertise in final evaluation decisions.
                </p>
                <p>
                  <strong className="text-neutral-700">Accuracy limitations:</strong> While grounded in established methodology, AI outputs may contain errors or may not account for all context-specific factors. Users should verify AI-generated content against their specific program context and institutional requirements.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">4. User Responsibilities</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-2">
                <p>As a user of the Platform, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate information about your programs and evaluation contexts</li>
                  <li>Not submit classified or restricted government information through the Platform</li>
                  <li>Review and verify AI-generated outputs before using them in official processes</li>
                  <li>Not use the Platform for purposes other than legitimate evaluation and program assessment</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">5. Data Processing by Third Parties</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>To provide the Platform's services, your data is processed by the following third-party providers:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-neutral-700">Anthropic (Claude AI)</strong> — Processes text inputs submitted through AI-powered features. Content submitted via the API is not used to train Anthropic's models per their API terms.</li>
                  <li><strong className="text-neutral-700">Supabase</strong> — Hosts the Platform's database and handles authentication.</li>
                  <li><strong className="text-neutral-700">Vercel</strong> — Hosts the Platform application and executes serverless API functions.</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">6. Intellectual Property</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  The Platform's knowledge base content is derived from publicly available academic research, published evaluation standards, and open-source methodology guides. Source attribution is maintained throughout.
                </p>
                <p>
                  Evaluation designs and outputs generated through the Platform using your inputs belong to you. However, the underlying AI models, platform code, and knowledge base remain the property of their respective owners.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">7. Limitation of Liability</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">
                The Platform is provided "as is" without warranties of any kind. We are not liable for any decisions made based on AI-generated evaluation designs, scores, or recommendations. Users are solely responsible for verifying the appropriateness of any methodology or design suggested by the Platform for their specific context.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">8. Beta Program</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">
                The Platform is currently in beta. Features, AI model versions, and capabilities may change. We may update the AI models used (including upgrading to newer versions of Claude) to improve quality and performance. Material changes to AI model usage will be reflected in updated Terms of Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">9. Changes to Terms</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">
                We may update these Terms of Service from time to time. Continued use of the Platform after changes constitutes acceptance of the updated terms. We will notify registered users of material changes via email or in-app notification.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-neutral-800">10. Contact</h3>
              <div className="mt-2 text-neutral-600 leading-relaxed space-y-3">
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-neutral-700">General inquiries:</strong> Haojun See — <a href="mailto:haojun@ontheground.agency" className="text-slate-600 hover:text-slate-700 underline">haojun@ontheground.agency</a></li>
                  <li><strong className="text-neutral-700">Legal:</strong> <a href="mailto:legal@ontheground.agency" className="text-slate-600 hover:text-slate-700 underline">legal@ontheground.agency</a></li>
                  <li><strong className="text-neutral-700">Privacy:</strong> <a href="mailto:privacy@ontheground.agency" className="text-slate-600 hover:text-slate-700 underline">privacy@ontheground.agency</a></li>
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
            <Link to="/privacy" className="text-neutral-500 hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
