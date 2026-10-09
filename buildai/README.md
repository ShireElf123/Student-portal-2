# BuildAI Reviews — AI Website Builder Review & Affiliate Site

Agency-level SEO / AI-SEO (GEO) ready affiliate review site, built to the
state-of-the-art 2026 playbook:

- **E-E-A-T layer**: named editorial author, About page, public testing Methodology, dated "last verified" stamps, hands-on experience claims per review
- **GEO / AI-search layer**: quick-answer extract boxes, question-style H2s, comparison tables, stat density with sources, `FAQPage` / `Review` / `Article` / `ItemList` / `BreadcrumbList` / `Organization` JSON-LD on every page, `llms.txt`, robots.txt that allows AI *retrieval* bots and blocks training-only scrapers
- **FTC / legal layer**: disclosure banner above the first commercial CTA on every monetised page, `rel="sponsored"` on all affiliate links, dedicated Affiliate Disclosure / Privacy / Terms pages
- **Conversion layer**: cloaked `/go/*` 302 redirects (noindexed), Netlify Forms lead capture + click tracking, per-tool CTAs

## Site map

| URL | Purpose |
| --- | --- |
| `/` | Pillar page: "Best AI Website Builders 2026" ranking + ItemList + FAQ schema |
| `/reviews/durable/` … `/reviews/10web/` | 5 deep reviews (Review + FAQ + Breadcrumb schema) |
| `/compare/durable-vs-dorik-vs-framer/` | 3-way comparison hub (Article + FAQ schema) |
| `/compare/durable-vs-dorik/`, `/compare/durable-vs-framer/`, `/compare/dorik-vs-framer/` | Long-tail head-to-head pages |
| `/methodology/`, `/about/` | E-E-A-T trust pages |
| `/affiliate-disclosure/`, `/privacy/`, `/terms/` | Compliance pages (FTC, GDPR/POPIA) |
| `/go/{durable,dorik,framer,wix,10web}` | Cloaked affiliate redirects (see `_redirects`) |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Crawl / AI-readiness layer |

## Before you deploy — 4 things to configure

1. **Affiliate codes.** In `_redirects`, replace every `YOURCODE` with your real
   affiliate/`ref` parameter for each program. Until you do, `/go/` links will
   send users to vendors without tracking.
2. **Domain.** All canonical/OG/schema URLs currently point at your live Netlify
   deploy: `https://lively-platypus-41e843.netlify.app` (taken from your old
   sitemap). When you buy a custom domain: add it in Netlify (Domain settings),
   search & replace the netlify.app URL with your domain in the 15 HTML files +
   `sitemap.xml` + `llms.txt` + `robots.txt`, and add a 301 from the old host in
   `_redirects`. Then submit the sitemap in Google Search Console.
3. **Author identity (important for E-E-A-T).** Pages currently credit the
   "BuildAI Reviews Editorial Team". Research strongly shows named human
   authors with bios + real names out-rank team bylines in 2026. When ready,
   add a real name to each byline and the `author` field in each page's schema
   (Person type), and link author pages.
4. **Email address.** Replace `hello@buildaireviews.com` with your real inbox.

## Deploy to Netlify

1. Create a new Netlify site. Set **publish directory** to this `buildai/` folder
   (or drag the folder onto Netlify Drop).
2. `_redirects`, `_headers`, and Netlify Forms (`lead`, `review-lead`,
   `compare-lead`, `click-tracking`) are detected automatically — no extra setup.
3. After deploy: verify in Netlify Forms that `click-tracking` submissions appear
   when you click any `/go/` link (that's your analytics — privacy-friendly, no
   third-party scripts).

## Run locally / preview

```bash
node dev-server.mjs        # emulates _redirects + _headers locally
```

## Analytics dashboard (no third-party scripts)

`tracker.js` records every affiliate click (cloaked `/go/*` **and** any direct
vendor link) three ways: browser console, a `localStorage` log you can inspect
with `showClicks()` in DevTools, and the Netlify `click-tracking` form — so
conversion data lives in Netlify Forms, GDPR-friendly, with zero cookies.

## The 2026 SEO playbook baked into this build (researched Oct 2026)

- **E-E-A-T is the #1 ranking factor** — Dec 2025 core update; anonymous/faceless
  affiliate content gets buried. Handled by: About + Methodology + bylines +
  dated verifications + "we paid for our own subscriptions" experience claims.
- **Product Reviews / review guidelines** — Google bans undisclosed incentivised
  & non-experiential review markup; manual actions possible. Handled by: visible
  disclosures near every CTA, pros/cons on all tools including the #1 pick,
  methodology with scoring weights.
- **GEO (Generative Engine Optimization)** — 97% of AI Overview citations come
  from top-20 organic results; LLMs then prefer extractable content: direct
  40–60-word answers up top (`.quick-answer`), question-form H2s, stats with
  sources, clean semantic HTML (no heavy JS framework — pages are static HTML).
- **AI crawlers** — retrieval bots allowed (OAI-SearchBot, ChatGPT-User,
  Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User); training-only
  scrapers blocked (GPTBot, Google-Extended, CCBot, Meta-ExternalAgent,
  Bytespider, Amazonbot). `/go/*` is `noindex, nofollow` via `X-Robots-Tag`.
- **Schema for citation + rich results** — Review + SoftwareApplication per
  review, ItemList on the pillar, Article + FAQPage on comparisons,
  BreadcrumbList site-wide, Organization + WebSite entity on home.
- **Affiliate hygiene** — `rel="sponsored noopener"`, cloaked 302 `/go/`
  redirects (never cached, never indexed), quarterly link/price re-verification.
- **Core Web Vitals by construction** — static HTML, no frameworks, one CSS file,
  one tiny tracker script, cached images. The brand fonts (DM Serif Display +
  DM Sans) load via a single Google Fonts request with swap — the only external
  request on the page. LCP/INP/CLS stay in the green.

## Maintenance cadence (this is what keeps rankings)

- Quarterly: re-verify all prices/claims, update `dateModified` + visible
  "verified" stamps, refresh `sitemap.xml` lastmod.
- Monthly: check Netlify click-tracking + form conversions; scan server logs for
  AI-crawler activity; manual citation checks ("best AI website builder" in
  ChatGPT/Perplexity/AI Overviews — are we cited?).
- Every new tool: new review + add to ItemList, sitemap, llms.txt, and internal
  links (topic clusters).

## Content growth queue (next pages to publish)

1. `/guides/how-to-build-a-website-with-ai/` (informational funnel)
2. `/compare/wix-vs-durable/`, `/compare/10web-vs-durable/`
3. `/guides/ai-websites-seo/` (owns the "are AI builders good for SEO" query)
