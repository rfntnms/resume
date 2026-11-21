# Rifqi Rofian Tanamas — L2 Security Analyst Portfolio

High-performance, editorial cybersecurity portfolio and case studies site. Built with vanilla HTML, modern modular CSS, and vanilla ES modules — zero build step, zero framework, zero external runtime dependencies.

**Live:** [buburtech.com](https://buburtech.com)

---

## Technical Highlights

- **Zero Build Pipeline:** 100% standard ES modules, CSS variables, and HTML. No Node.js build step, bundler, or compilation needed.
- **Self-Hosted & Private:** Zero third-party requests at runtime (no external CDNs, Google Fonts, or third-party trackers). All fonts and Three.js vendor scripts are self-hosted.
- **Interactive 3D ID Badge:** Realistic, interactive security pass rendered in WebGL2 with Three.js (procedural canvas textures, woven lanyard ribbon, physics-damped tilt, drag, and flip), with an automated CSS container-query fallback for low-power or non-WebGL devices.
- **Kinetic Motion & Micro-Interactions:** Custom Web Animations API (WAAPI) transitions, chapter curtain page wipes, interactive project deck slider with swipe gestures, and scroll-linked hero parallax.
- **Resilient Progressive Enhancement:** Fully functional and readable with JavaScript disabled, reduced motion enabled, or low network conditions (`Save-Data`).
- **Comprehensive SEO & Structured Data:** Semantic HTML5, Schema.org JSON-LD graph (`Person`, `ProfilePage`, `WebSite`, `BreadcrumbList`, `Credential`), OpenGraph/Twitter cards, `sitemap.xml`, and `robots.txt`.
- **Print Optimized:** Complete `@media print` stylesheet transforming the interactive web page into an elegant, ATS-friendly black-and-white resume document.

---

## Project Structure

```
resume/
├── index.html                                 # Main single-page portfolio & resume
├── design.md                                  # In-depth design system & architecture documentation
├── README.md                                  # Project documentation
├── CNAME                                      # Custom domain routing (buburtech.com)
├── robots.txt                                 # Search crawler directives
├── sitemap.xml                                # Search engine index sitemap
├── assets/
│   ├── portfolio.css                          # Core design system tokens, typography & layout
│   ├── portfolio.js                           # Core module: theme switching & 3D badge coordinator
│   ├── portfolio-motion.css                   # Styles for motion transitions, curtain & project deck
│   ├── portfolio-motion.js                    # WAAPI animations, curtain navigation & project slider
│   ├── id-card-3d.js                          # WebGL2 / Three.js 3D ID badge scene & interaction
│   ├── case-studies.css                       # Dedicated stylesheet for case studies & breadcrumbs
│   ├── favicon.png                            # 96x96 site icon
│   ├── og-image.jpg                           # 1200x630 social preview card
│   ├── badges/
│   │   ├── comptia-cysa-plus.png              # Self-hosted CompTIA CySA+ badge art
│   │   └── htb-cdsa.png                       # Self-hosted Hack The Box CDSA badge art
│   ├── fonts/
│   │   ├── barlow-condensed-extrabold.ttf     # Self-hosted Barlow Condensed 800
│   │   ├── barlow-OFL.txt                     # Barlow Open Font License
│   │   └── jetbrains-mono-latin.woff2         # Self-hosted JetBrains Mono (latin subset)
│   ├── id-card/
│   │   └── portrait.webp                      # Optimized portrait photo for the 3D ID card
│   └── vendor/three/
│       ├── LICENSE                            # Three.js MIT License
│       └── build/
│           ├── three.core.min.js              # Self-hosted Three.js core
│           └── three.module.min.js            # Self-hosted Three.js ES module
└── projects/
    ├── index.html                             # Case studies index & overview
    ├── bitdefender-endpoint-deployment/
    │   └── index.html                         # Case study: 2,850 Endpoint Rollout at BPS
    ├── multi-client-siem-operations/
    │   └── index.html                         # Case study: Multi-Client SIEM & SOC Operations
    └── splunk-detection-engineering/
        └── index.html                         # Case study: Splunk Detection Engineering at DJBC
```

---

## Design System & Architecture

For complete architectural details, color palettes, typography scales, 3D graphics pipeline specs, and accessibility audits, see [design.md](file:///Users/bxdc8/project/resume/design.md).

---

## Local Development & Testing

Since this project uses ES modules (`import`/`export`), it should be served via any local HTTP static server:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js npx serve
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## Deployment

The site deploys automatically via **GitHub Pages** from the `main` branch. The `CNAME` file points to `buburtech.com` with `.nojekyll` enabled to prevent GitHub Pages from ignoring asset directories.
