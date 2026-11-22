# Precision Credential Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
**Goal:** Implement selected redesign in isolated checkout with verified facts and resilience.
**Architecture:** Astro static keeps route paths; shared ResumeContent for homepage/print. Poster is default; optional Three.js progressive enhancement.
**Tech Stack:** Astro, TypeScript config, CSS, native JS, existing Three.js.
**Spec:** ../specs/2026-11-22-precision-credential-design.md
## Global Constraints
Preserve facts, routes, anchors, credential links; self-host all assets; no deployment/push. Reduced motion/Save-Data keeps poster; content never depends on canvas.
## Review Focus
- Non-homepage assets resolve using absolute paths.
- No-JS exposes navigation/content.
- 3D failure/preference changes preserve poster and coherent controls.
- Print preserves complete text and reading order.
- Narrow widths/zoom retain CTA/nav.
### Task 1: Static architecture
Files: package.json, astro.config.mjs, src/layouts/SiteLayout.astro, src/components/ResumeContent.astro, src/pages/, public/, tests/test_site.py.
Interfaces: ResumeContent renders source facts; SiteLayout accepts title/description/canonical/schema.
- [x] Capture content fixture; run legacy tests: resume route and new CTA should fail.
- [x] Migrate assets/pages to Astro with shared layout/content.
- [x] Build and verify content, routes, links, schema, resume parity.
### Task 2: Visual design and resilience
Files: src/styles/portfolio.css, public/assets/site.js, public/assets/badge-policy.mjs, tests/badge-policy.test.mjs.
Interfaces: badgePolicy({reducedMotion,saveData,webglAvailable}) returns boolean; #id-card provides poster/canvas/controls.
- [x] Policy tests RED before implementation.
- [x] Faithful hero/outcome band, project rows, complete content; menu/theme/optional 3D.
- [x] Build/test and browser desktop/mobile/keyboard; compare and fix drift.
### Task 3: Print and verification
Files: src/pages/resume.astro, public/resume.pdf, README.md, design.md, design-qa.md.
- [x] Export print A4/Letter, check extraction and completeness.
- [x] Check routes, no-JS markup, console, widths/preferences/SEO/payload/performance.
- [x] Compare screenshot with selected concept; record limitations.
- [x] Full build/tests, local preview/screenshots; no publishing.
## Rulings
Execute inline under user's instruction to implement after selection; no additional execution-method approval. Existing production repo and approved Astro scope supersede fresh generic prototype template. Worktree created using native tool. Keep change uncommitted for user review, no unsolicited commits.
