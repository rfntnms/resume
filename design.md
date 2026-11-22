# Buburtech design system v2 — Precision Credential

Selected by the owner on 22 November 2026. Status: implemented and verified; publication is handled by the manual GitHub Pages workflow. The original specification is retained at `docs/superpowers/specs/design-v1.md`.

## Intent

Premium industrial editorial art direction for an international L2 SOC / detection engineering / incident response job search. Preserve the warm cream, petrol, apricot identity and physical badge. Quality comes from a single tactile object, deliberate scale, readable evidence and restrained interaction. Do not adopt Apple branding or hacker-dashboard clichés.

## Architecture decision and alternatives

Astro static is used for generated HTML and shared authored components. React islands remain an option, but are unnecessary for the current native interactions and are not installed. The original Three.js model is retained behind explicit activation. Next.js/React/R3F could support future application/server requirements but adds concepts not needed for this portfolio. Vanilla could deliver the same visual quality, but shared Astro components simplify keeping the resume and homepage synchronized. Framework migration is not a substitute for art direction.

## Tokens and type

Light: page #F4EFE4, ink #192820, secondary #4B5A50, rule #B6BFB1, wash #E9EDE1. Dark: page #17241E, ink #F4EFE4, secondary #BAC8B9, rule #63736A, wash #21332A. Hero/header/contact stay petrol #101C20 with cream #F4EFE4 and secondary #BAC8C4. Apricot #FFBC8B highlights the surname and interactive hover. Cream outcome band uses dark spruce #153529 for numbers. Visible focus uses a 3px currentColor outline with a 5px offset.

The selected mockup resolves to a condensed industrial display. Implementation therefore keeps self-hosted Barlow Condensed 800 (converted to WOFF2), with Arial/Helvetica/system sans for body/UI, rather than adding another display family. Display grows to 140px desktop and approximately 62px at 390px mobile. Body is 17px desktop; compact hero summary and supporting mobile content use 14–16px. Metadata is smaller and must remain readable under zoom. All identity/outcome text is HTML.

## Layout

1280px maximum content container; desktop gutters 72px, tablet 24–40px, mobile 20px (16px at 320px). Desktop hero is 1.2fr/1fr: role, name, specialties, source summary, CTA and relocation information on left; badge on right. Mobile places all professional context and CTA before the compact badge. Case studies use the same shell, palette, type and two-column fact/narrative grid, stacked on mobile.

A cream band exposes 90% fewer false positives, 70% increase in blocking accuracy, and 2,850 endpoints. Each label retains its source scope. The 70% link points to the experience entry that contains the Python automation claim. It is not relabeled threat hunting playbooks. All project summaries remain visible and link to their original URL. Experience is chronological, followed by skills, certifications, education and contact. The resume puts experience before project summaries.

## Materials and motion

Studio art: cream matte credential, dark green RRT monogram, woven apricot lanyard, brushed metal clip, soft contact shadow. Generated artwork is not represented as a real employer-issued badge. Responsive transparent WebP is the default image and fallback, with dimensions reserved before load. The optional procedural 3D model is preserved from v1 and intentionally has a different pose; it is not claimed to be a live rendering of the raster artwork.

3D code loads on user request, never before core content. Reduced motion/Save-Data keeps the poster; load failure/context loss preserves it. Rendering is demand-based in the retained scene, and offscreen/hidden/preference changes return to the poster. Flip has a native button and status announcement. No scroll parallax, curtain, custom cursor, autoplay or carousel. Hover color changes are 160ms and disabled under reduced motion.

## Content, SEO and print

Original roles/employers/dates/tools/metrics/credentials/education/location/visa/languages and case-study copy are preserved. Claims are sourced from the original repository and are not independently authenticated by the redesign. No reconstructed incident details or client dashboards were added. Existing URLs and anchor IDs remain. Main navigation stays visible without JS. Canonicals, title/description, OG metadata, profile schema, breadcrumbs, robots and sitemap are retained; `/resume/` is added.

Print uses a single column and selectable text, strips navigation/badge/actions, preserves source facts, keeps jobs/projects together and orders experience before projects. PDF export uses the same built HTML/print CSS. A4 and Letter exports are verified separately; ATS compatibility is not universally guaranteed.

## Verification contract

Build, contract checks, source fact parity, links/assets/schema, browser interactions, desktop/mobile visual comparison, multiple viewport widths and print extraction are required. Target mobile lab performance >=90, LCP <=2.5s, CLS <=0.1; field INP/p75 require deployment and sufficient real traffic. Budget: initial non-3D JS <=60KB gzip, initial route transfer <=500KB, optional 3D <=1.2MB compressed, poster <=150KB. Latest measurements and untested conditions are in `verification.md`; visual comparison is in `design-qa.md`. No general WCAG/ATS/field-CWV compliance claim follows from automated scores alone.
