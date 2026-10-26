# Design Review — 2026-10-08

## Outcome

Implemented the catering enquiry action, larger menu labels, consistent Portuguese currency formatting and matching hero action sizing. Verified source output in both served development HTML and the fresh production static build. Photography is deferred while the user awaits delivery. Narrow-header changes are deferred until crowding can be reproduced. Actual visual rendering and interactions were unavailable; no visual pass is claimed.

## Scope and baseline

- Stack: React 19, TanStack Start, Tailwind CSS 4, Vite, npm. No Git repository or project AGENTS.md found. Current source includes prior accessibility fixes and the user's restored tomato-red header logo; preserve those choices.
- Reviewed `/` at http://localhost:8080 (HTTP 200) through returned HTML and source. Sample: hero, navigation, menu, catering, gallery, visit and fallback-page source. No browser rendering, screenshots or viewport measurements available. No packages installed or processes started for this review.
- Existing visual intent inferred from recurring source: warm cream/tomato/basil palette, Playfair Display headings, Dancing Script accents, rounded photography, pill actions and spacious section rhythm. No supplied brand reference or separate design brief.
- Baseline: nine served images are SVG placeholders. Source `vite.config.ts:30` generates solid-color placeholders; no original assets found. User confirms real photos will be supplied later.
- Existing validation limitations from accessibility audit: TypeScript fails on missing image manifests and the error-component signature; default lint fails because ESLint config is named `estling.config.js`.

## Findings

| ID | Priority | Classification | Finding | Impact / reach | Effort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DESIGN-001 | P1 | verified | Photography replaced with solid-color placeholders | Hero, food imagery, catering, gallery | Asset-dependent | deferred: awaiting photos |
| DESIGN-002 | P2 | verified absence; recommendation | Catering has no direct contact action | Catering enquiry journey | Small | fixed |
| DESIGN-003 | P2 | suspected | Narrow header may crowd at 320–375px | Mobile navigation | Small | deferred: rendered check needed |
| DESIGN-004 | P2 | verified source; recommendation | Dietary and price labels use 10px type | Menu readability | Small | fixed in source; visual check pending |
| DESIGN-005 | P3 | verified source; recommendation | Currency precision/presentation inconsistent | All menu prices | Small | fixed |
| DESIGN-006 | P3 | verified source; recommendation | Hero actions have different sizing/alignment rules | Main entry actions | Small | fixed in source; visual check pending |

### DESIGN-001: Photography

- **Evidence:** baseline dev HTML contains nine SVG image placeholders; `vite.config.ts:12–33` generates them for seven missing manifests.
- **Root cause:** original photo assets were not included in the project export.
- **Rationale:** placeholder blocks cannot communicate food quality or restaurant atmosphere. Visual impact inferred from asset content, not a screenshot.
- **Fix:** restore manifests/photos once delivered; then validate image crops and overlay readability.
- **Verification:** inspect real rendered crops at matching widths after delivery.
- **Status:** deferred at user's request; no substitute photography required.

### DESIGN-002: Catering enquiry

- **Evidence:** baseline `src/routes/index.tsx:252–285` contains offer copy but no link/button; dev HTML contains no catering contact action.
- **Root cause:** contact destination only exists in header/mobile navigation and visit section.
- **Rationale:** contextual action reduces the effort to enquire after reading the offer; design recommendation, not a standards violation.
- **Fix:** add “Falar sobre catering” linking to the existing WhatsApp number, styled with existing tomato/cream pill conventions and explicit focus outline.
- **Verification:** assert link text, destination, focus classes and safe external-link attributes in dev and built HTML; do not initiate an enquiry.
- **Status:** fixed. Dev and fresh static HTML contain exactly one catering link with the expected label, destination, external-link attributes and explicit focus classes. No message sent.

### DESIGN-003: Narrow header

- **Evidence:** baseline `src/routes/index.tsx:69–87`: logo and button both `shrink-0`, 24px horizontal padding, 16px gap and 24px logo type.
- **Root cause:** potential lack of horizontal space at narrow widths; actual crowding is not verified.
- **Rationale:** usability risk, not a demonstrated defect.
- **Fix:** only if rendered overflow is confirmed, reduce narrow-screen logo size/padding while retaining the button target area.
- **Verification:** widths 320, 375, 768, 1023, 1024 and 1440 CSS px; test font loading and text resizing.
- **Status:** deferred; no speculative header change.

### DESIGN-004: Menu label size

- **Evidence:** baseline `src/routes/index.tsx:211,218,222`: tags and size labels use `text-[10px]`, while other section labels consistently use `text-xs`.
- **Root cause:** hard-coded smaller text in the menu.
- **Rationale:** use the established 12px supporting-label scale for important dietary and size information; readability recommendation.
- **Fix:** change tags and price labels to `text-xs`, preserving color roles and hierarchy.
- **Verification:** assert rendered classes, inspect wrapping at representative widths when browser tools are available.
- **Status:** fixed in source. Dev/static output confirms all fourteen size labels and four dietary tags use `text-xs` (12px at default root size). Visual wrapping remains untested.

### DESIGN-005: Price format

- **Evidence:** baseline data/rendering mixes `€26`, `€14,5` and `€29,6` in `src/routes/index.tsx:28–43,219,223,242`.
- **Root cause:** price strings interpolated directly without a shared currency formatter.
- **Rationale:** consistent precision and currency placement improves scanning; not a standards violation.
- **Fix:** store the same amounts as numeric values, format them using `Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" })`; allow space for two-decimal values in price columns.
- **Verification:** compare all seventeen displayed amounts against the original numeric values in dev and built HTML; validate long dish name/price pairing visually later.
- **Status:** fixed. All seventeen displayed prices in dev/static HTML match the original numeric values with two decimal places and Portuguese currency placement (e.g. `26,00 €`, `14,50 €`, `29,60 €`). Price columns widened from 4.5rem to 5rem and values kept on one line.

### DESIGN-006: Hero actions

- **Evidence:** baseline `src/routes/index.tsx:129–142`: “Ver menu” has inline-flex/min-height/alignment; “Como chegar” lacks those and uses different padding.
- **Root cause:** separately authored action classes diverge.
- **Rationale:** consistent height and alignment reinforces the paired primary/secondary actions, retaining their different color emphasis.
- **Fix:** align both with inline-flex, 48px minimum height, matching padding and explicit cream focus outline.
- **Verification:** inspect both rendered class sets; actual before/after visual alignment remains untested.
- **Status:** fixed in source. Both served hero links have matching inline-flex/alignment, `min-h-12`, `px-8 py-3` and explicit cream focus classes. Actual rendered equality and interaction states remain untested.

## Changes and validation

Baseline saved before application changes.

### Changes

- `src/routes/index.tsx`: numeric price data with a shared `Intl.NumberFormat` instance; `text-xs` menu labels; 5rem price columns and unbroken currency values; hero secondary action aligned with the existing primary action; contextual catering WhatsApp link using the existing phone number and color tokens.
- `audits/design-review-2026-10-08.md`: baseline, source evidence, implementation status, validation and pending checks.
- Production output regenerated in `dist/client/` and `dist/server/`. No dependencies or lockfiles changed.

### Verification

- `npm run build` — **passed**, Vite v7.3.6, both client/server builds and home-page prerender. Known warnings for missing image manifests and dependency unused imports remain.
- Fresh output served temporarily using `python3 -m http.server 4174 --bind 127.0.0.1 --directory dist/client`, launched by Python subprocess (PID 646835) and stopped with `kill 646835`. Existing dev/preview processes were not restarted by this review.
- `python3 /tmp/opencode/verify-amore-design.py` — **passed** against `http://localhost:8080` and `http://localhost:4174`: catering link destination/text/attributes/focus classes, both hero action sizing/focus classes, all seventeen prices and their order, fourteen size labels and four dietary tags, existing `pt-PT` language and main skip-link target.
- Same script fetched generated `/assets/styles-DgKs-LUI.css` and verified the widened `grid-template-columns:5rem 5rem` rule.
- Existing failing TypeScript/lint checks were not rerun for this presentation-only change; their blockers and actual previous commands/results are documented in `accessibility-audit-2026-10-08.md`. Production build and affected served-output checks completed.
- No screenshot comparison, computed contrast measurement, active browser viewport or hover/focus interaction test performed. Brand tokens retained; new catering action follows the existing tomato/cream primary action and has an explicit cream focus outline.

## Remaining work and limitations

Visual checks at 375/768/1440 CSS px and around real breakpoints, open mobile-menu state, hover/focus, font rendering, price wrapping and actual image crops remain not tested. Dark theme is not exposed by the current site; no theme redesign proposed. Existing accessibility findings are tracked separately in `accessibility-audit-2026-10-08.md`, including the restored red logo's visibility. No visual measurements or screenshots are claimed.
