# Buburtech — Precision Credential

International recruiter-facing portfolio for Rifqi Rofian Tanamas. Astro generates static HTML for the homepage, three case studies, project index, and a dedicated resume. Runtime assets are self-hosted; React is not shipped because the current interactions use small native modules.

## Local preview

Use Node.js 22.23.4 or newer (Node 24 recommended), npm and Python 3 for the contract checks.

```sh
npm ci
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4321
```

For live editing use `npm run dev`. The publishable directory is `dist/`, not the repository root. There is no backend or external font/analytics service.

## Content and architecture

- `src/layouts/SiteLayout.astro`: metadata, schema, navigation, theme and global page shell.
- `src/pages/index.astro`: recruiter summary, studio badge and outcome links.
- `src/components/{Experience,Projects,Qualifications,Education,Contact}.astro`: original authored resume facts shared between homepage and `/resume/`.
- `src/pages/projects/`: existing case-study narratives and URLs.
- `src/data/profile-schema.json`: structured profile; update it when the corresponding visible identity/credentials change.
- `src/styles/portfolio.css`: design tokens, responsive layouts, reduced-motion and print rules.
- `public/assets/site.js`: theme, native dialog, print action and opt-in 3D loading.
- `public/assets/id-card-3d.js`: retained original procedural Three.js scene; imported only after Inspect in 3D.
- `public/assets/id-card/credential-portrait*.webp`: generated studio artwork, responsive alpha WebP; source PNG lives in `docs/design-assets/`. The 3D texture uses the owner-supplied photograph in `portrait-rifqi.webp`.
- `public/`: deployed static files, including CNAME, robots, sitemap and the exported resume PDF.

All three project summaries are visible. Navigation uses native URLs/anchors; there are no curtain transitions, autoplay, scroll hijacking or carousel. JavaScript is optional for reading content and following links. Without JS, mobile navigation remains exposed, while enhancement-only controls remain hidden.

The studio artwork is a designed physical credential, not a photograph of an employer-issued ID. The interactive 3D view reuses the original procedural model and has a different strap pose. Reduced motion, Save-Data, unavailable WebGL or loading/context errors retain the studio image. Core resume information stays in HTML.

## Resume export

The resume HTML shares source components with the homepage. Export the PDF again whenever facts or print styles change. The website build itself does not require a PDF engine; the checked-in PDF is a generated deliverable.

Install Pango and the optional Python packages in `tools/requirements-print.txt`. On macOS, `brew install pango`; use a project virtual environment for Python dependencies. Some macOS environments need `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib` when running the renderer.

```sh
npm run build
python3 scripts/export-resume.py
python3 scripts/export-resume.py --size Letter --output work/resume-Letter.pdf
python3 tests/check_print.py public/resume.pdf work/resume-Letter.pdf
npm run build
npm test
```

The exporter uses the built HTML, local assets and the same print stylesheet; it makes no external asset requests. A4 and US Letter were rendered and text-checked in two pages. This does not guarantee compatibility with every ATS or every browser's print engine.

## Checks

`npm test` checks preserved source facts in both HTML views, route/anchor/asset integrity, canonical metadata and JSON-LD parsing, plus the reduced-motion/Save-Data/WebGL policy. `tests/fixtures/content-baseline.json` is a migration snapshot, not the content authoring source; update it deliberately when the owner changes facts. Visual and interaction evidence is recorded in `design-qa.md` and `verification.md`.

## Publishing

The Astro migration is published through **GitHub Actions**, using the built `dist/` directory rather than branch-root files. Review and merge the redesign first, then manually dispatch `.github/workflows/pages.yml` on `main` when release is authorized. Pull requests only build/test; the workflow does not publish on push. Custom domain remains `buburtech.com` via `public/CNAME`.

Rollback: deploy the prior zero-build revision using its previous Pages source configuration. Do not deploy the Astro source directory as static output.

Font and Three.js licenses remain alongside their assets. Tabler icon SVGs are vendored with their MIT license in `public/assets/icons/`.
