# SEO Review — 2026-10-08

## Outcome

Implemented domain-independent SEO fixes: removed placeholder social-image metadata, switched to summary cards, added Portuguese Open Graph locale and factual Restaurant JSON-LD, and added route-state-aware fallback metadata/noindex. Verified development responses, built SSR and freshly prerendered static home HTML. Production domain-dependent canonicals/social URLs, crawl files and final social image remain deferred. No deployment or Google indexing/rich-result claim.

## Scope and baseline

- React 19 / TanStack Start / Tailwind CSS 4 / Vite 7.3.6; npm; no Git repository or AGENTS.md found. Preserve previous review changes and the current red logo. User has not supplied a production domain; original photographs are pending.
- Source: root/home metadata, visible restaurant facts, server/fallback rendering, prerender configuration and README static-host workflow.
- Runtime baseline: urllib/HTMLParser on http://localhost:8080 `/`, `/seo-audit-missing-page`, `/robots.txt`, `/sitemap.xml`. Home HTTP 200; other samples genuine HTTP 404. No X-Robots-Tag on these local responses. No robots/sitemap files in source/static export. Latest built `dist/client/index.html` inspected; root document content available without JavaScript.
- Baseline home head: one descriptive title, one meta description, `pt-PT`, canonical `/`, og:url `/`, og:image SVG data placeholder, twitter:card `summary_large_image`, no JSON-LD. Missing-page head uses the same restaurant title/promotional description as home, with visible Portuguese 404 content.
- Browser DOM/hydration, live production headers/domain redirects, Search Console, Google indexing/canonical selection, social-platform previews and Google structured-data validation unavailable. No crawler run beyond the four authorized local paths, packages installed or deployments performed.
- Known TypeScript and lint blockers are recorded in the accessibility/optimization reports: missing image manifests, unchanged error-component type signature, default ESLint config filename discovery.

## Findings

| ID | Priority | Classification | Finding | Impact / reach | Effort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| SEO-001 | P2 | verified; recommendation | Relative canonical/social URL do not identify production origin | Home URL identity | Small | deferred: domain unknown |
| SEO-002 | P2 | verified | Social image points to placeholder SVG data URL | Social sharing preview | Small | fixed; actual photo deferred |
| SEO-003 | P2 | recommendation | No Restaurant JSON-LD | Machine-readable local business facts | Small | implemented and locally validated |
| SEO-004 | P3 | verified; recommendation | Missing-page head inherits promotional homepage metadata | Fallback title/description accuracy | Small | fixed for verified 404/standalone renderer |
| SEO-005 | P3 | verified absence; recommendation | No robots.txt or sitemap.xml | Production crawl configuration/discovery | Small | deferred: domain/indexing intent unknown |

### SEO-001: Production URL identity

- **Evidence:** `src/routes/index.tsx:21,23`, dev and prerendered HTML: og:url and canonical both `/`.
- **Rationale:** relative canonical can resolve correctly, but an explicit production origin avoids preview-host ambiguity. Not an assertion of invalid canonical syntax or indexing failure.
- **Fix:** once confirmed, use intended absolute production home URL consistently. Do not infer a domain, use localhost or canonicalize errors to home.
- **Verification:** deployed canonical is accessible/correct; confirm HTTPS/domain redirects and page variants.
- **Status:** deferred, production URL not supplied.

### SEO-002: Placeholder social image

- **Evidence:** home head emits `og:image` from `slices.url`, currently a solid-color SVG data URL; root declares large-image Twitter card.
- **Root cause:** preview image manifest placeholder used as social metadata.
- **Fix:** omit placeholder image metadata until a real, absolute public image URL exists; use summary card in the interim and add `og:locale=pt_PT` for locale consistency.
- **Verification:** no data-image Open Graph tag in dev/prerendered/SSR HTML, one summary-card tag; image gallery/content remain intact.
- **Status:** fixed placeholder defect. Dev, built SSR and fresh static home HTML omit og:image, contain one summary card and pt_PT locale. Real social image still requires photographs/domain; external social-platform rendering not tested.

### SEO-003: Restaurant structured data

- **Evidence:** no JSON-LD in baseline source or served HTML. Visible facts: Amore di Mamma, Italian pizza restaurant, phone +351963454344, Av. Humberto Delgado 47 Loja D, 2825-337 Costa de Caparica, Portugal.
- **Rationale:** optional machine-readable representation; absence is not a search-indexing blocker. Schema.org validity does not guarantee Google rich-result eligibility.
- **Fix:** home-route Restaurant JSON-LD with name, telephone, cuisine and PostalAddress. Do not invent geo coordinates, URL, review count, aggregate rating, photos or price range. Do not encode temporary prices/experimental hours as stable business facts.
- **Verification:** parse emitted JSON, verify schema type/properties against visible text, absent on 404; keep serialization safe against HTML script termination.
- **Status:** implemented and locally validated. Each home representation has exactly one parseable Restaurant script with the intended factual properties; missing-page responses have none. Google rich-result eligibility/validation not tested and may require further properties/photos.

### SEO-004: Fallback metadata

- **Evidence:** `/seo-audit-missing-page` HTTP 404 displays “Página não encontrada” but head title is restaurant home title and description promotes the restaurant.
- **Root cause:** root head does not distinguish route error/not-found states.
- **Fix:** use existing TanStack head mechanism for descriptive Portuguese fallback titles/descriptions; noindex/follow for fallback states. Retain true 404 and recovery links. Add noindex/follow to standalone server-error document, which already has a descriptive title.
- **Verification:** built SSR missing page status/title/description; one head title and no home canonical/business schema; inspect standalone error renderer without inducing application failures.
- **Status:** fixed for verified states. Dev and built SSR 404s contain one descriptive title, fallback description and noindex/follow, with no home canonical/schema. Standalone server-error renderer retains its descriptive title and now has noindex/follow. Genuine HTTP 404 is already sufficient to avoid a soft-404 claim; noindex is supplemental. Root error-state branch added but not exercised by intentionally failing the app.

### SEO-005: Crawl files

- **Evidence:** local `/robots.txt` and `/sitemap.xml` return HTTP 404 and static export contains only index/assets.
- **Rationale:** small production setup improvement; missing files are not a crawl blocker for a single page. robots.txt controls crawling, not reliable indexing exclusion/privacy.
- **Fix:** after domain/indexing intent confirmed, add absolute production home URL sitemap with no fabricated lastmod, link it from robots. Configure previews deliberately if needed, not automatically.
- **Status:** deferred.

## Changes and validation

Baseline saved before source edits.

### Changed files

- `src/routes/index.tsx`: removed placeholder og:image; added home-only Restaurant JSON-LD via TanStack head scripts. Script serialization escapes `<` as `\u003c`. Existing photo gallery/metadata titles, visible business facts and relative canonical/social URL retained pending domain confirmation.
- `src/routes/__root.tsx`: head derives fallback title/description from TanStack match state (`notFound` / `_notFound` and error); fallback noindex/follow, common pt_PT social locale and summary card. Retained styling, SSR shell and recovery content.
- `src/lib/error-page.ts`: standalone server-error document noindex/follow.
- Regenerated `dist/client/` and `dist/server/`; no package, lockfile, URL migration or external changes.

### Verification and actual results

1. `npm run build` — **passed** (Vite v7.3.6), client/server builds and `/` prerender. Existing missing-photo placeholder and dependency unused-import warnings remain. CSS remains the optimization build's `styles-BQxQovt4.css` (39.53 kB).
2. `./node_modules/.bin/tsc --noEmit` — **failed on the same pre-existing eight conditions**: seven missing photo manifests and unchanged error-component `Error` vs `unknown` signature. No metadata/script/type errors added.
3. `python3 /tmp/opencode/verify-amore-seo.py` — **passed**:
   - Development `/` HTTP 200 and `/seo-audit-missing-page` HTTP 404.
   - Built server imported with Node and called through `server.fetch`: `/` HTTP 200; missing page, `/robots.txt` and `/sitemap.xml` HTTP 404. Crawl files remain deliberately deferred, not fabricated.
   - Exactly one title/description in each sampled document, Portuguese language, summary card, pt_PT locale and no placeholder social-image tag.
   - Home has exactly one JSON-LD script; parsed values and property whitelist match name, phone, cuisine and PostalAddress. No URL/image/rating/reviews/hours/temporary prices fabricated. Existing visible catering action and decimal prices retained.
   - Home has no new robots noindex directive; 404 has noindex/follow, accurate title/description, matching og:title, no home canonical and no Restaurant schema.
   - Built standalone error-renderer string has descriptive title, pt-PT and noindex/follow. No failure induced in the live application.
   - Fresh `dist/client/index.html` served with `python3 -m http.server 4176 --bind 127.0.0.1 --directory dist/client` passes the same home checks. Temporary PID 661902 stopped automatically; existing dev/preview processes unaffected.
4. Default lint not repeated; the known config-discovery blocker is documented in previous audits. Browser rendered DOM, runtime error branch, external schema validators and social platform preview checks remain **not tested**.

The new minimal Restaurant schema intentionally does not establish eligibility for a Google Local Business rich result. Confirm the full production business profile/photos and required feature-specific properties before claiming eligibility.

## Remaining work and limitations

Confirm production URL/indexing intent; supply real social photo; validate deployed status/redirect/caching/crawl files and static-host true-404 behavior. Browser rendered DOM/mobile parity not tested; initial HTML has business/menu content and section links. No claim of ranking changes, Google recrawling, index inclusion or rich-result eligibility. Prior accessibility/design/optimization results are tracked in their own reports.
