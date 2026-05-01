# Wiring a Custom Domain to AgenticGov

## Recommended domain

**`agenticgov.io`** is available as of 2026-05-02. `.io` has tech-credible signal, premium feel, and is well-recognised by government audiences. Cost is ~USD 30–60/year depending on registrar (Cloudflare wholesale, no markup; Porkbun ~$30; Namecheap ~$50).

Alternatives if `.io` is gone by registration time: `agenticgov.net` (also free), `agenticgov.gov.sg` (gov.sg is restricted to Singapore Government bodies — **not available to On The Ground**).

## Step 1 — Register the domain

Pick a registrar:

| Registrar | Approx price | Notes |
|---|---|---|
| **Cloudflare Registrar** | wholesale (~$30/yr `.io`) | No markup, free WHOIS privacy, but no second-mailbox/aliasing. Requires using Cloudflare DNS. |
| **Porkbun** | ~$30/yr `.io` | Clean UI, free WHOIS privacy, free email forwarding. Recommended if not already using Cloudflare. |
| **Namecheap** | ~$50/yr `.io` | Popular, decent UI, charges extra for WHOIS privacy after year 1. |

Register `agenticgov.io`. Enable WHOIS privacy.

## Step 2 — Add the domain in Vercel

1. Go to https://vercel.com/haojun-sees-projects/agenticgov/settings/domains
2. Click **Add Domain** → enter `agenticgov.io` → **Add**
3. Vercel will show the DNS records you need to add at your registrar.
4. Repeat for `www.agenticgov.io` (Vercel will auto-redirect www → apex or vice versa based on which you mark "primary").

## Step 3 — Add DNS records at your registrar

For most registrars, add these records:

```
Type    Name          Value                       TTL
----    ----          -----                       ---
A       @             76.76.21.21                 Auto / 3600
CNAME   www           cname.vercel-dns.com        Auto / 3600
```

**If using Cloudflare DNS:** keep both records on **DNS-only** (grey cloud), not proxied (orange cloud). Vercel handles SSL/TLS and HTTPS redirects natively; Cloudflare proxy mode interferes.

**Alternative — full nameserver delegation:** Vercel can manage DNS for you. In the Vercel "Add Domain" flow, pick "Use Vercel nameservers". You'd then change the nameservers at your registrar to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
Faster propagation, less to manage, but you give up DNS control to Vercel.

## Step 4 — Wait for propagation + SSL

DNS propagation takes anywhere from 1 minute (Cloudflare) to a few hours (rare). Vercel auto-provisions a Let's Encrypt certificate the moment DNS resolves. You'll see a green check next to the domain in the Vercel domains panel.

## Step 5 — Update site references

Once `agenticgov.io` resolves, update these places:

```bash
cd /Users/seehaojun/Desktop/OTG/Apps/agenticgov
grep -rln "agenticgov.vercel.app" frontend/ docs/ outreach/ 2>/dev/null
```

Files that hardcode the URL:
- `frontend/index.html` (canonical link, og:url, og:image absolute URLs)
- `frontend/public/sitemap.xml` (every `<loc>`)
- `frontend/public/robots.txt` (Sitemap: line)
- `frontend/public/llms.txt` and `llms-full.txt` (every link)
- `vercel.json` (CORS allowed-origin if set)
- `api/visit.ts` (CORS allow logic — currently auto-allows `*.vercel.app`; tighten to `agenticgov.io`)
- `CLAUDE.md`, `README.md`

A find-and-replace `agenticgov.vercel.app` → `agenticgov.io` covers most of it. Then rebuild and redeploy.

## Step 6 — Set Vercel env var for CORS lock-down

In Vercel project settings, set:
```
ALLOWED_ORIGIN = https://agenticgov.io
```

This ensures the `/api/visit` endpoint only accepts requests from the canonical domain (preventing other sites from spoofing visitor counts via embedded iframes).

## Step 7 — Verify

```bash
curl -sI https://agenticgov.io | head -3
# Expect: HTTP/2 200, Server: Vercel

curl -sI https://www.agenticgov.io | head -3
# Expect: HTTP/2 308 (redirect to apex) or 200 if you set www as primary

curl -s https://agenticgov.io/llms.txt | head -1
# Expect: # AgenticGov

dig +short agenticgov.io
# Expect: 76.76.21.21 (or Vercel-managed IP)

# Final social-card check:
curl -sI https://agenticgov.io/og-image.png
# Expect: HTTP/2 200, content-type: image/png
```

## After this is live

- Re-test sharing the link on WhatsApp / LinkedIn / Slack / X — should show the new domain in the preview card.
- Add `https://agenticgov.io` to Google Search Console for indexing.
- The OG meta tags currently use absolute `https://agenticgov.vercel.app/...` URLs in `index.html` — Step 5 will update these.
- Consider adding a 301 redirect from `agenticgov.vercel.app` → `agenticgov.io` for any links you've already shared. Vercel doesn't do this automatically; you'd configure it via a separate Vercel project that redirects.
