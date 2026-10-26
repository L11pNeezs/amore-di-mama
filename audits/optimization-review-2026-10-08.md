# Optimization Review — 2026-10-08

## Outcome

Removed unused query infrastructure, reduced Tailwind scanning to active sources, and deferred the two About images with lazy loading/asynchronous decoding. Production build and built SSR home/not-found checks pass. Under the same deterministic resource-size procedure, combined JS/CSS fell by 70081 decoded bytes and 13783 local gzip-9 bytes (about 8.4% compressed reduction). This is a payload reduction, not a measured loading-time or Core Web Vitals improvement.

## Scope and baseline

- Stack: React 19 / TanStack Start / Tailwind CSS 4 / Vite 7.3.6, npm. No Git repository or AGENTS.md found. Preserve prior accessibility/design fixes and current red logo. Original photographs are awaiting delivery.
- Source: router, root route, home, CSS, sheet, server/error setup. Runtime: dev http://localhost:8080; existing preview http://localhost:4173 for response headers and asset evidence; fresh static production output on http://127.0.0.1:4175 for reproducible resource comparison.
- Existing preview HTML references older bundles and lacks the new catering label. Do not use it for an end-to-end current-build baseline. Production output from the design-review build is the baseline.
- Exact baseline command: `python3 /tmp/opencode/measure-amore-optimization.py`. It starts `python3 -m http.server 4175 --bind 127.0.0.1 --directory dist/client`, fetches HTML/assets, calculates decoded bytes and Python gzip level 9 with mtime 0, then stops its process. Baseline PID 655625 stopped. One run; deterministic resource-byte comparison, no browser, viewport, throttling or browser cache involved.
- Existing preview assets use gzip and `Cache-Control: no-cache`; HTML uses identity encoding. These local headers do not establish deployed caching/compression behavior.
- Existing project blockers: missing image manifests and error-component type mismatch for TypeScript; ESLint default config discovery fails because config is named `estling.config.js`. Refer to prior accessibility audit for actual failing commands.

### Baseline resource bytes

| File | Decoded bytes | Locally calculated gzip-9 bytes |
| --- | ---: | ---: |
| `index-mH47DhLA.js` | 375810 | 120697 |
| `index-nNgbndMW.js` | 90562 | 28475 |
| `styles-DgKs-LUI.css` | 84584 | 14557 |
| Total | 550956 | 163729 |

Local gzip calculations are not identical to preview-server gzip response sizes previously recorded (120678/28360/14639 bytes). All before/after comparisons below use the same local gzip procedure; no mixed compression baselines.

## Findings

| ID | Priority | Classification | Finding | Impact / reach | Effort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| OPT-001 | P2 | verified | Unused QueryClient/provider shipped in main bundle | Every hydrated page | Small | fixed |
| OPT-002 | P2 | verified | Unused component-library CSS emitted | Every page stylesheet | Small | fixed; visual interaction verification pending |
| OPT-003 | P2 | recommendation | Two About images eagerly loaded | Initial image scheduling when photos arrive | Small | fixed attributes; runtime impact unmeasured |
| OPT-004 | P3 | recommendation | Hero has no explicit priority hint | Possible LCP image | Small | deferred: actual LCP unmeasured |
| OPT-005 | P3 | verified locally; deployment-dependent | Local hashed assets revalidate on every use | Repeat requests under preview configuration | Host-dependent | deferred: deployment headers unknown |

### OPT-001: Unused query infrastructure

- **Evidence:** `src/router.tsx` creates QueryClient; root imports QueryClientProvider/context. Source search finds no query/mutation consumers. Main bundle has `getQueryCache` (2), `getMutationCache` (1), `mutationCache` (3) markers.
- **Root cause:** template scaffolding remains active on a static restaurant page.
- **Fix:** remove query client initialization, router context and provider; use native `createRootRoute` with Outlet. Keep installed package/lockfiles.
- **Verification:** production build, byte comparison, no query-cache markers, home/not-found output. Hydration and interaction checks require browser tools.
- **Status:** fixed. All three query-cache marker counts are zero in built JS. Combined JavaScript decoded size reduced from 466372 to 441346 bytes; home and not-found built SSR checks pass.

### OPT-002: CSS from unused components

- **Evidence:** `src/styles.css` scans all src, including the unused UI library. App imports only sheet; built CSS contains 30 `recharts` and 34 `collapsible` occurrences.
- **Root cause:** Tailwind source scanning is independent of JS tree-shaking.
- **Fix:** scan routes, lib fallback markup and the used sheet source explicitly. Document registration of additional components (including their imported UI dependencies) when introduced; retain unused component source for future use.
- **Verification:** size comparison and disappearance of unused selectors; verify sheet animation/state, focus, skip-link and menu-price CSS remain. Actual mobile dialog styling not tested without browser rendering.
- **Status:** fixed. Chart/sidebar marker counts are zero; CSS reduced from 84584 to 39529 decoded bytes (about 53.3%). Sheet slide animation, important reduced-motion overrides, focus selectors, skip-link clipping reset, green text token and widened price columns remain in emitted CSS. Browser interaction/visual confirmation still unavailable.

### OPT-003: About image loading

- **Evidence:** baseline returned HTML has nine images; hero and two About images default to eager; other six use lazy loading. About images have aspect-ratio/fixed-size CSS reservation.
- **Rationale:** defer below-hero photography and decorative mobile-hidden image; present placeholders have negligible real-image transfer costs. Resource/LCP gains are unmeasured.
- **Fix:** add `loading="lazy"` and `decoding="async"` to the two About images. Preserve hero eager loading, image layout and alternatives.
- **Verification:** served/build attributes; later browser check for short viewports and actual photo loads.
- **Status:** fixed attributes. Built HTML confirms both About images are lazy/async; hero remains eager and existing image count/content/layout classes preserved. Photo-transfer and short-viewport outcomes await actual images/browser validation.

### OPT-004: Hero priority

- **Evidence:** hero image is already eager, with no fetchpriority attribute; no actual LCP trace available.
- **Fix:** after photographs and trace are available, add high fetch priority only if the hero is the relevant LCP image; do not preload multiple competing images.
- **Status:** deferred; no speculative priority change.

### OPT-005: Deployment cache policy

- **Evidence:** existing Vite preview returns gzip hashed assets with `no-cache` and ETag; headers are local, not deployed.
- **Fix:** configure long-lived immutable caching for hashed public assets and suitable HTML revalidation on the actual host; verify real compression/cache headers after deployment.
- **Status:** deferred; host/configuration unspecified.

## Changes and validation

Baseline above saved before source edits.

### Changed files

- `src/router.tsx`: removed unused QueryClient initialization and router context.
- `src/routes/__root.tsx`: changed to `createRootRoute` and rendered Outlet without the unused query provider; head, shell, fallbacks and error reporting retained.
- `src/styles.css`: scans `./routes`, `./lib` and `./components/ui/sheet.tsx`; comment documents adding new UI components and imported UI dependencies. Unused UI source remains available.
- `src/routes/index.tsx`: lazy/async attributes on the two About images. No hero priority change or changes to photo assets, typography, prices, contact destination, navigation or layout.
- Regenerated `dist/client/` and `dist/server/`; no package or lockfile changes.

### After resource bytes

Exact same command and gzip procedure as baseline: `python3 /tmp/opencode/measure-amore-optimization.py`. One run on fresh built output via temporary static server; PID 656640 stopped automatically by script. Existing servers unaffected.

| Resource | Before decoded | After decoded | Before gzip-9 | After gzip-9 |
| --- | ---: | ---: | ---: | ---: |
| Main JS (`index-CcVPv2Po.js`) | 375810 | 350720 | 120697 | 113541 |
| Home JS (`index-Cu96ctuv.js`) | 90562 | 90626 | 28475 | 28488 |
| CSS (`styles-BQxQovt4.css`) | 84584 | 39529 | 14557 | 7917 |
| Total | 550956 | 480875 | 163729 | 149946 |

Route JS grew by 64 decoded bytes for the image attributes; total savings account for that. Gzip-9 numbers are locally calculated compressed resource bodies; not actual browser transfer overhead or server compression guarantees.

### Verification outcomes

- `npm run build` — **passed** client/server compilation and home prerender (Vite v7.3.6). Known missing-photo placeholder and dependency unused-import warnings remain.
- `./node_modules/.bin/tsc --noEmit` — **failed only on previously recorded conditions**: seven missing manifest imports and unchanged error-component `Error` vs `unknown` signature. No query-context/type failures introduced.
- Measurement script — **passed** built-home assertions: `pt-PT`, main skip-link target, catering action, decimal menu values, nine images and eager hero. Printed before/after image loading attributes and generated CSS/query markers described above.
- Built SSR checked with `node --input-type=module` importing `./dist/server/server.js`, calling `server.fetch(new Request(...))` for `/` and `/optimization-audit-missing-page`: **passed**, HTTP 200 home with catering action and HTTP 404 with Portuguese not-found content, both with Portuguese document language and main landmark.
- Default lint was not repeated: config discovery blocker already documented in the accessibility audit. No dependencies installed or downloaded.
- Open-sheet interaction, hydration and visual rendering are **not tested**. Presence of CSS rules is supporting evidence, not proof of browser behavior.

## Remaining work and limitations

- Real images: compression, responsive variants, formats and srcset/sizes pending delivery. Placeholder sizes cannot predict image-transfer performance.
- No browser profiler, Lighthouse, Playwright, screenshots, field analytics, actual LCP/INP/CLS, network waterfall or hydration/interaction timing available. Resource byte reduction is measurable; runtime speed/Core Web Vitals outcomes are not.
- Actual fonts/fallback shifts, short-viewport image behavior, open mobile-sheet styling and keyboard interactions require browser validation. CSS layout already reserves image/embed space; no measured CLS defect asserted.
- Field good thresholds are LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile segmented by device; this sampled review does not establish a field pass.
