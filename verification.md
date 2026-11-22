# Verification — Precision Credential

22 November 2026. Local worktree: `/Users/bxdc8/.codex/worktrees/precision-credential/resume`, branch `redesign/precision-credential`. This is the verification snapshot before release authorization: no commit, push, merge or publication had been performed at that point. Subsequent release status is recorded by GitHub Actions and Git history.

## Build and content

`npm run build` generates six routes. `npm test` contains one Node policy contract and five Python contract tests (six checks total), covering original resume facts in both homepage/resume, case-study narratives, route/anchor preservation, local asset/link resolution, canonical/description/H1 metadata and JSON-LD parsing. Original experience, metrics, education, credential links and visa/language details remain. Missing resume route/new CTA and missing enhancement policy were first observed failing before implementation. The print test also failed at four pages before spacing fixes.

## Desktop and mobile

See `design-qa.md` for the visual comparison. Homepage loaded measurements: widths 320, 390, 768, 900, 1024, 1440 and 1920, no horizontal overflow. Existing project index, three case studies and resume checked at 320/1440 with one H1 each. Screenshot evidence covers hero, full homepage, menu, projects, a case study and resume. Native keyboard/dialog/anchor/theme/3D flows were checked. Browser console showed no errors in those flows.

## Performance

Three local Lighthouse mobile runs, simulated throttling, 412 × 823 emulation at DPR 1.75, CPU slowdown 4×, RTT 150ms, nominal throughput 1638.4 Kbps. Median scores: Performance 99, Accessibility 100, Best Practices 100, SEO 100. LCP runs 2.261s / 2.257s / 2.106s, median 2.257s. TBT 0ms and CLS 0 in all three lab runs. This is lab evidence, not field p75 or INP validation.

Measured initial route transfer in run 3: 196,078 bytes; no third-party requests. Gzip initial native JS approximately 2,005 bytes; optional retained 3D modules approximately 190,527 bytes gzip. Default desktop studio WebP is 137,896 bytes and mobile WebP 60,576 bytes. These are below the proposed budgets. Gzip figures are computed payload sizes; actual deployed compression depends on hosting.

Lighthouse raw reports and configuration: `docs/verification/lighthouse-{1,2,3}.json` and `performance-summary.json`. The final changes after these runs were print-only spacing, a narrow case-title wrap guard, the PDF link on the resume route, and opt-in loading/error guards. No additional initial-load framework or assets were introduced.

## Print and ATS

`public/resume.pdf` and the Letter export were rendered from the built shared-content resume and its print stylesheet with WeasyPrint 70.0. Both are two pages; the text extraction check confirms all baseline resume facts and experience-before-projects order. Rendered A4 pages were visually inspected for clipped content, page margins and reading order. PDF export is offline and maps resources to `dist/`. Full two-page exports remain selectable text; every ATS and browser print engine is not guaranteed.

Commands: `python3 scripts/export-resume.py`, `python3 scripts/export-resume.py --size Letter --output work/resume-Letter.pdf`, and `python3 tests/check_print.py public/resume.pdf work/resume-Letter.pdf`, with the optional print dependencies installed.

## Accessibility and resilience limits

Semantic content is in generated HTML; scripts are not required to read the resume or follow links. Mobile nav is hidden only after successful JS enhancement. Poster is the default and remains on policy/load errors. Pure policy checks cover reduced-motion, Save-Data and unavailable WebGL. The available browser controls did not expose JS-disable, media emulation or WebGL-context-loss injection; those environment paths were code-reviewed and policy-tested, not claimed as real browser simulations. Actual 200%/400% zoom, screen readers, physical low-end devices, and deployment-specific field CWV remain further checks. Automated score 100 is not a full WCAG compliance claim.

## Release preparation

A manual-only Pages workflow is prepared but was not run. Before release, change the repository Pages source from branch-root publishing to GitHub Actions, review the diff, merge only when desired, and dispatch on main after publication is authorized. CNAME and all original public routes are retained. The workflow tests pull requests and does not deploy on push. Rollback instructions are in README.
