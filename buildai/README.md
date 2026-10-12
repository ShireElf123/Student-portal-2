# BuildAI Reviews

Static website-builder review and comparison site published from the `buildai/` directory. Public canonical URLs currently use:

`https://classy-pie-a922b2.netlify.app/`

## Editorial standards

- Publisher identity: The Tech GUY.
- Durable: includes first-hand experience from a client website project. The observed traffic is not attributed to Durable without analytics evidence.
- Dorik, Framer, Wix and 10Web: research-based assessments unless a page explicitly documents first-hand evidence.
- Scores are provisional editorial judgments, not controlled benchmark results. Do not describe them as measured or reproducible unless the underlying category scores and evidence are published.
- Product prices, feature availability, affiliate relationships, form delivery and performance claims must be verified before they are described as current or confirmed.
- Do not publish a personal email address unless the publisher explicitly approves it. The current site does not publish one.

## Main routes

- `/` — comparison hub
- `/reviews/durable/`, `/reviews/dorik/`, `/reviews/framer/`, `/reviews/wix/`, `/reviews/10web/` — product reviews
- `/compare/durable-vs-dorik-vs-framer/`, `/compare/durable-vs-dorik/`, `/compare/durable-vs-framer/`, `/compare/dorik-vs-framer/` — comparison articles
- `/about/`, `/methodology/` — publisher and evaluation approach
- `/affiliate-disclosure/`, `/privacy/`, `/terms/` — disclosure and policy pages
- `/thanks.html` — form success page
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` — crawl and machine-readable resources

## Outbound links and tracking

The `_redirects` file currently routes `/go/{durable,dorik,framer,wix,10web}` directly to provider websites. No placeholder affiliate IDs are used. Do not describe these as affiliate links or add `rel="sponsored"` unless an actual approved affiliate destination is confirmed and the disclosure is updated.

`tracker.js` records outbound provider-link clicks in browser local storage and attempts to submit click details to Netlify Forms. It can forward events to Plausible or GA4 if those functions are present. Verify the deployed configuration, data access and retention before promising analytics or privacy outcomes.

## Before production release

1. Review this branch's draft pull request and merge only after code review.
2. Confirm Netlify's publish directory is `buildai/`.
3. Deploy a preview and verify all routes, images, CSS, mobile layout and internal links.
4. Confirm Netlify Forms receives only the expected submissions for `lead`, `review-lead`, `compare-lead`, `click-tracking` and `privacy-request`; test success and error states.
5. Check the `/go/*` redirects go to the intended official provider URLs and do not contain placeholder affiliate parameters.
6. Validate JSON-LD, sitemap URLs, canonical URLs, robots rules, page titles, meta descriptions and the deployed `llms.txt`.
7. Test with Google Search Console URL Inspection and Bing Webmaster Tools after deployment; request indexing only for live, final URLs.
8. Measure mobile Core Web Vitals on the deployed site. Do not claim a performance score without recorded measurements.
9. Verify current vendor prices/features from official sources before adding a date-stamped claim.
10. Recheck the privacy notice against the live form and click-tracking configuration before collecting user data.

## Search and AI discovery principles

- Prioritise useful, original, well-supported content and clear authorship over attempts to game GEO/AEO.
- E-E-A-T is a quality framework, not a single published ranking factor.
- `llms.txt` is supplementary and does not guarantee AI citations.
- `OAI-SearchBot` and `GPTBot` serve different purposes; review crawler policies deliberately.
- Structured data must accurately reflect visible content. Do not add rating/review markup for unverified scores or imply that research-based assessments were hands-on tests.
- Keep the sitemap limited to canonical, indexable URLs. Update `lastmod` only when a page materially changes.

## Maintenance

- On every material update: run link and JSON-LD checks, update visible copy and structured dates, and refresh sitemap `lastmod` only for the pages changed.
- Regularly: verify pricing, plan restrictions, affiliate relationships, form handling and crawler access.
- For each genuinely hands-on review, keep a dated record of the brief, plan, region, steps, screenshots, edits and measurements. If that evidence does not exist, label the assessment as research-based.
