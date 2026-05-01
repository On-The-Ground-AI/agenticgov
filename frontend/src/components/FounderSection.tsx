const HIGHLIGHTS = [
  {
    label: 'Founder, On The Ground',
    detail: 'Singapore-based civic-tech and AI studio. 40+ active products across government, legal, education, and social-impact verticals.',
  },
  {
    label: 'Public-policy AI specialist',
    detail: 'Builds production agentic systems for ministries, MDAs, and policy think-tanks. Reference deployments include Causalis (impact evaluation, 352 MDB reports), Aperture (governance intelligence), and live government cabinet-level pilots.',
  },
  {
    label: 'Background',
    detail: 'Lawyer by training, technologist by practice. Deep operating experience in Singapore government and the regional public-sector AI landscape — combines policy fluency with hands-on shipping.',
  },
];

export function FounderSection() {
  return (
    <section id="founder" className="bg-gradient-to-b from-white to-neutral-50 py-20 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photo + contact card */}
          <div className="lg:col-span-4">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#B8860B]/30 via-amber-200/30 to-transparent blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="/seehaojun.jpeg"
                  alt="Hao Jun, founder of On The Ground"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>

            <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Get in touch</p>

              <a
                href="https://wa.me/6598419481"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-emerald-50 transition group"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">WhatsApp</p>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-700">+65 9841 9481</p>
                </div>
              </a>

              <a
                href="mailto:haojun@ontheground.agency"
                className="flex items-center gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-amber-50 transition group"
              >
                <span className="w-9 h-9 rounded-lg bg-[#B8860B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l9 6 9-6m-18 0v10a2 2 0 002 2h14a2 2 0 002-2V8m-18 0a2 2 0 012-2h14a2 2 0 012 2" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-[#B8860B] truncate">
                    haojun@ontheground.agency
                  </p>
                </div>
              </a>

              <a
                href="https://github.com/seehaojun"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-slate-100 transition group"
              >
                <span className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">GitHub</p>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">@seehaojun</p>
                </div>
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-widest">About the founder</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Hao Jun
            </h2>
            <p className="mt-1 text-base text-slate-500">
              Founder, On The Ground · Singapore
            </p>

            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
              <p>
                I build agentic AI for governments. AgenticGov is a working visualisation of what the WEF's
                <em> Readiness Framework</em> looks like once you stop talking about it and put it on a screen.
              </p>
              <p>
                On The Ground operates 40+ active products across the Singapore civic, legal, education, and
                public-sector AI landscape — including production deployments for ministries, statutory boards, and
                international policy teams. The architecture you'll see in this demo is taken directly from the
                patterns that have worked for us in real cabinet-level engagements.
              </p>
              <p className="text-slate-500 text-sm">
                If your government, ministry, or international body is exploring how to operationalise the WEF
                framework — or if you simply want to see how a specific function would behave in your jurisdiction —
                the fastest path is a 20-minute call. WhatsApp is the quickest way to reach me.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition">
                  <p className="text-xs font-semibold text-[#B8860B] uppercase tracking-wider">{h.label}</p>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/6598419481?text=Hi%20Hao%20Jun%2C%20I%20saw%20AgenticGov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Message on WhatsApp
              </a>
              <a
                href="mailto:haojun@ontheground.agency?subject=AgenticGov%20demo&body=Hi%20Hao%20Jun%2C"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
              >
                Email me
              </a>
              <a
                href="mailto:haojun@ontheground.agency?subject=Request%20full%20CV&body=Hi%20Hao%20Jun%2C%20could%20you%20share%20your%20full%20CV%3F"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold transition"
              >
                Request full CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
