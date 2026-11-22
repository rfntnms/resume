# Precision Credential — design QA

Date: 22 November 2026. Source visual truth: `docs/design-assets/selected-reference.png`, displayed concept 1 selected by the owner. Implementation: http://127.0.0.1:4321/ in the in-app browser.

## Evidence and normalization

Source pixels: 1487 × 1058. Implementation screenshot: 1487 × 1058 at the same CSS viewport, 1:1 captured density. Same homepage/top-of-page state, studio image visible, petrol hero and cream outcome band. No scaling was used for the side-by-side comparisons.

- Full view: `docs/verification/comparison-final.jpg`.
- Focused hero typography/material comparison: `docs/verification/comparison-hero-detail.jpg`.
- Focused outcome/copy comparison: `docs/verification/comparison-outcomes.jpg`.
- Final implementation: `docs/verification/desktop-final.jpg`.
- Mobile: `docs/verification/mobile-final.jpg`, 390 × 844. No mobile reference was selected; the approved brief governs responsive adaptation.
- Case-study and resume evidence: the corresponding desktop/mobile JPGs in `docs/verification/`.

## Comparison history

1. Initial screenshot `comparison-v1.jpg`: [P2] badge was undersized, headline too small and outcome evidence lacked the intended scale. Fixed by enlarging the studio image and display type, matching the hero/band boundary, and placing outcome context under the number/label row.
2. Final combined capture: earlier scale issues resolved. Hero ends at approximately the same vertical position as the reference. Mobile places the summary, CTA and relocation details before the credential, removing the old badge-first reading delay.
3. A 2px overflow at 900px came from the transformed poster; tablet image scaling is now disabled. A transient narrow index-page overflow prompted long-word wrapping protection. Final loaded measurements show no horizontal overflow for homepage widths 320/390/768/900/1024/1440/1920; project index, three detail routes and resume were checked at 320/1440.

## Required fidelity surfaces

- **Fonts/typography:** Barlow Condensed 800 matches the selected industrial display direction, clean sans body/UI, large cream/apricot name hierarchy. WOFF2 is self-hosted and preloaded. Actual HTML remains selectable; wrapping and small metadata reviewed in desktop/mobile captures.
- **Spacing/layout:** asymmetric split hero, single dominant badge, immediate cream evidence band and exposed desktop navigation retained. Original professional summary and accessible 3D controls intentionally add copy absent from the mockup. All project summaries are open editorial rows. Full-page capture reviewed for spacing, clipping and hierarchy.
- **Colors/tokens:** petrol #101C20, cream #F4EFE4, apricot #FFBC8B and spruce metrics preserve the selected palette. Hero is fixed dark; body supports light/dark. Contrast/visibility reviewed and automated Lighthouse accessibility passed in the default lab state; this is not universal accessibility certification.
- **Image quality:** real generated raster asset was used, not a CSS/SVG imitation. Fabric and clip material are visible, all artwork fits, alpha WebP has reserved dimensions. Pose and scale differ slightly from the concept image; this is accepted illustration variation. The opt-in legacy procedural 3D model is explicitly a separate inspection view, not claimed to reproduce the studio raster.
- **Copy/content:** source facts prevail over mockup text. The 70% outcome is correctly labeled Python automation. No invented incident details, endorsements, skills or credentials. Homepage/resume/case narrative contract tests compare source facts.

## Interactions checked

Menu open/Close/Escape and return focus; Tab sequence through dialog links, a browser focus sentinel, then Close; theme toggle and persisted preference; primary project anchor and return-to-top; project detail navigation and browser Back; resume navigation and download target; opt-in 3D loading, flip state/announcement, return to studio image. Fresh-build 3D activation confirmed after the reviewer found a hidden lazy-image decode risk; the texture image is now set eager only on activation. Slow import completion rechecks visibility/preferences. Browser console errors: none observed in the tested flows.

## Findings and limits

No actionable P0/P1/P2 visual mismatch remains in the reviewed states. Accepted deviations: corrected factual labels, added source summary, theme control, smaller functional metadata, separate original procedural inspection model, and a different generated strap pose. P3 polish: the inspection model could later be rebuilt to match the studio artwork more closely; it is optional and does not gate reading or navigation.

No screen-reader session, real-device matrix or actual browser zoom 200%/400% test was performed. 320px reflow and native keyboard checks do not replace those tests. Reduced-motion/Save-Data/WebGL branching is covered by policy tests and source review, but OS-level preference emulation, context-loss injection and blocked-network activation were not exercised through the available browser controls. Print was verified separately with the paged-media renderer.

## Implementation checklist

- [x] Selected reference and rendered implementation compared together at equal dimensions.
- [x] Focused typography, badge and outcome regions inspected.
- [x] Earlier P2 scale/overflow findings resolved and rechecked.
- [x] Mobile reading order and all existing routes retained.
- [x] Primary interactions and browser console checked.
- [x] Remaining test gaps and P3 differences stated.

## Portrait update — 22 November 2026

The owner supplied Foto ID Card_Original.JPG and requested the real portrait in place of RRT. Default desktop/mobile posters now use credential-portrait WebP assets; the existing cream badge, typography, lanyard and composition remain. The 3D texture is the original photograph resized/encoded to portrait-rifqi.webp, with upper-biased cover cropping so hair and chin remain visible. Both views were rendered locally; the photo loaded, 3D activation completed, and no console errors were observed. No unrelated layout/content changes. Source JPEG in Downloads was not modified.

final result: passed
