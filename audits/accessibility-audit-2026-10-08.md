# Accessibility Audit — 2026-10-08

## Outcome

Implemented scoped source fixes for all six findings. Served development HTML and fresh production static HTML verify language, landmarks and skip-link relationships; generated CSS verifies motion overrides and the darker green token. Browser interaction and computed contrast remain untested. No whole-site conformance claim.

## Scope and baseline

- React 19 / TanStack Start / Tailwind CSS 4, npm; no Git repository or AGENTS.md found in the project.
- Sample: home route `/`, desktop/mobile navigation source, fallback pages and sheet component source. Existing dev server at http://localhost:8080 and production preview at http://localhost:4173 both returned HTTP 200. No processes started by this audit.
- Read-only baseline: Python urllib + HTMLParser confirmed `lang="en"` and header/footer nested in main. Production preview was older than current source and contained solid-color image placeholders.
- Declared-color calculations (OKLCH converted to clipped linear sRGB): tomato/brown 2.07:1; basil/menu 4.12:1; basil/cream 4.27:1; cream/tomato 4.87:1. These are source calculations, not computed browser measurements.
- Browser automation, axe, Lighthouse and browser-control tools unavailable. No packages installed. Keyboard, screen reader, accessibility tree, actual viewports, zoom/reflow and computed contrast not tested.

## Findings

| ID | Priority | Classification | Finding | Impact / reach | Effort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A11Y-001 | P1 | verified | Portuguese page declares English | Screen-reader pronunciation across home page | Small | fixed |
| A11Y-002 | P1 | recommendation | Red linked logo has low contrast on brown | Header navigation visibility | Small | fixed in source; visual verification pending |
| A11Y-003 | P2 | suspected | Small green labels below 4.5:1 using declared palette | Section labels / dietary tags | Small | source mitigation implemented; computed contrast not tested |
| A11Y-004 | P2 | verified structure; recommendation | Header/footer nested in main | Missing native page-level banner/contentinfo landmarks | Small | fixed |
| A11Y-005 | P2 | recommendation | No skip link | Keyboard access to primary content | Small | fixed in source; keyboard verification pending |
| A11Y-006 | P3 | recommendation | Sheet motion has no explicit reduced-motion override | Motion-sensitive mobile users | Small | fixed in source/CSS; interaction verification pending |

### A11Y-001: Language

- **Evidence:** baseline `src/routes/__root.tsx:103` and both served home documents declared English; home prose is Portuguese. Sheet close and fallback messages were English.
- **Requirement:** WCAG 3.1.1 (A), language of page: the declared default does not match the predominant language. Localizing fallback text also avoids a language mismatch after changing the default.
- **Fix:** set `pt-PT`, translate fallback pages and sheet close label.
- **Verification:** inspect served home/not-found HTML; inspect standalone error renderer and sheet label source.

### A11Y-002: Header logo visibility

- **Evidence:** baseline `src/routes/index.tsx:70–72`, tomato logo; scrolled header uses warm-brown. Declared-color ratio 2.07:1.
- **Rationale:** usability recommendation; logotypes are exempt from WCAG 1.4.3 text contrast. Not claimed as a normative text-contrast failure.
- **Fix:** use cream text for the linked header logo and provide explicit keyboard focus styling.
- **Verification:** source and rendered classes, plus future visual/computed contrast check over the hero and scrolled header.

### A11Y-003: Small green text

- **Evidence:** baseline `src/styles.css:47,93–97`; divider labels and dietary tags in `src/routes/index.tsx`. Declared basil/menu ratio 4.12:1.
- **Requirement:** potential WCAG 1.4.3 (AA) failure for normal text; browser-computed measurement still needed, including tinted dietary-tag backgrounds and body gradients.
- **Fix:** introduce darker basil text token while preserving the existing background palette.
- **Verification:** repeat declared-color calculation; future browser measurement on each affected context.

### A11Y-004: Landmarks

- **Evidence:** baseline `src/routes/index.tsx:378–389` and dev HTML: main contains header and footer. These native elements do not expose page-level banner/contentinfo in this context.
- **Rationale:** semantic navigation improvement, not a standalone asserted WCAG failure.
- **Fix:** make header, main and footer siblings; give fallback pages main landmarks.
- **Verification:** parse served HTML and assert sibling structure.

### A11Y-005: Bypass navigation

- **Evidence:** baseline home has no skip link; desktop header contains repeated navigation links.
- **Rationale:** explicit bypass mechanism supporting WCAG 2.4.1 (A); absence of a skip link alone does not establish failure when other bypass mechanisms exist.
- **Fix:** add a visible-on-focus Portuguese skip link targeting focusable main, with fixed-header clearance.
- **Verification:** confirm target relationship in served HTML; future keyboard test for activation, focus and visibility.

### A11Y-006: Reduced motion

- **Evidence:** baseline `src/components/ui/sheet.tsx:24,34–43` uses slide/fade animations without explicit reduction. Existing smooth scrolling already has a reduced-motion alternative.
- **Rationale:** inclusive interaction recommendation, not a WCAG AA violation by itself.
- **Fix:** disable sheet overlay/content animation and transitions under reduced motion.
- **Verification:** inspect generated CSS for reduced-motion rules; future browser open/close test.

## Changes and validation

Baseline above was saved before application edits.

### Changed files

- `src/routes/__root.tsx`: `pt-PT` document language; translated not-found/error messages; fallback main landmarks.
- `src/lib/error-page.ts`: standalone error document language, Portuguese messages and main landmark.
- `src/routes/index.tsx`: cream header logo with explicit focus outline; darker green dietary-tag text; first-focusable skip link targeting `main#conteudo[tabindex="-1"]`; header/main/footer siblings.
- `src/styles.css`: `--basil-text: oklch(0.46 0.1 145)` token for labels; main-target scroll margin of 7rem. Existing basil backgrounds preserved.
- `src/components/ui/sheet.tsx`: Portuguese close label, decorative close icon, important reduced-motion animation/transition overrides so data-state animation specificity cannot override them.
- Build regenerated `dist/client/` and `dist/server/`. No dependency or lockfile changes.

### Checks and results

Environment: Node v22.23.1, npm 10.9.8, Vite v7.3.6, ESLint v9.39.5. No browser viewport was exercised.

1. `npm run build` — **passed**, including home-page prerender. Warnings for already-missing seven image manifests and dependency unused imports. Images remain placeholders.
2. `./node_modules/.bin/tsc --noEmit` — **failed on existing source conditions**: seven missing image manifest imports; error component accepts `Error` where TanStack expects `unknown`. The failing imports/signature were unchanged by this audit.
3. `npm run lint` — **blocked by existing configuration**: ESLint cannot discover a default `eslint.config.js` file; project configuration is named `estling.config.js`.
4. Existing preview on port 4173 continued serving old HTML after rebuilding (in-memory SSR state). Fresh output verified via temporary static server: `python3 -m http.server 4174 --bind 127.0.0.1 --directory dist/client`. Started with Python subprocess (PID 623129); stopped with `kill 623129`. Original servers left running.
5. `python3 /tmp/opencode/verify-amore-accessibility.py` — **passed** on dev port 8080 and fresh static port 4174: Portuguese language; exactly one each of sibling header/main/footer; skip link and focusable target; unique IDs; image alt attribute presence; iframe title. This checks attributes, not correctness of placeholder image descriptions.
6. Same script — **passed** on development missing-page route `/accessibility-audit-missing-page`: HTTP 404, Portuguese not-found messages and main landmark. Production static fallback handling not tested.
7. Same script fetched `/assets/styles-BNuToF0P.css`: **passed** assertions for reduced-motion media rule, `animation:none!important`, `transition-property:none!important`, darker-green fallback token `#2f6633`, skip-link clipping reset and main scroll margin. These checks inspect CSS content, not interactive browser behavior.
8. Built standalone renderer checked via `node --input-type=module` importing `r as renderErrorPage` from `./dist/server/server.js`: **passed** assertions for Portuguese document language, main landmark and translated retry/home controls. No error induced in the application.

### Before/after source-color evidence

Same OKLCH-to-clipped-linear-sRGB calculation and WCAG luminance formula as baseline:

| Context | Before | After |
| --- | --- | --- |
| Header logo / warm brown | 2.07:1 | 10.10:1 |
| Green section text / menu | 4.12:1 | 6.06:1 |
| Green text / cream | 4.27:1 | 6.29:1 |

These ratios use declared opaque colors only. Dietary-tag tinted backgrounds, body gradients and the header over the hero require computed browser validation; no measured WCAG contrast pass is claimed. Sheet close translation was confirmed in source, not in an opened dialog.

## Remaining work and limitations

Complete manual keyboard checks (Tab/Shift+Tab, Enter, Escape, focus containment/restoration and section-link activation), screen-reader tests, computed contrast, 320 CSS px reflow, 200% text resize, text spacing, target sizes and Google Maps interaction. Error state reviewed in source only; do not induce production errors. This sampled audit does not establish whole-site WCAG conformance.

Restart the user's existing production preview process to pick up the fresh SSR build. Separate follow-up work: restore missing image manifests; correct existing TypeScript signature and ESLint config discovery so the project-wide checks can run cleanly. No such unrelated configuration/asset changes were made in this scoped implementation.
