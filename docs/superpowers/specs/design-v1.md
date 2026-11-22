# Design System & Technical Architecture Specification
**buburtech.com — Portfolio of Rifqi Rofian Tanamas (L2 Cybersecurity Analyst)**

---

## 1. Executive Summary & Design Philosophy

The website at [buburtech.com](https://buburtech.com) serves as an international recruiter-facing portfolio and verifiable resume for **Rifqi Rofian Tanamas**, an L2 SOC & Cybersecurity Analyst specializing in threat hunting (IBM QRadar), detection engineering (Splunk), and incident response.

### 1.1 Aesthetic Identity: "Industrial Editorial Cyber-Analyst"
Rather than resorting to generic dark-mode hacker clichés (matrix green terminals or generic neon glow), the design language establishes an **industrial, tactile, and editorial** cyber-analyst identity:
- **Physical Security Credential as the Centerpiece**: The primary visual anchor is a hyper-realistic, interactive 3D ID security badge hung on a woven lanyard, reflecting real-world SOC physical-and-logical security badge culture.
- **Editorial Typography**: Pairing an assertive, high-impact condensed industrial display typeface (**Barlow Condensed**) with a disciplined monospaced font (**JetBrains Mono**) and clean system UI typography for effortless readability.
- **Tokyo-Night Industrial Palette**: Deep slate greens (`#101c20`, `#17241e`), muted sage rules (`#bec6ba`, `#63736a`), warm paper creams (`#f5f5ed`, `#f4efe4`), and high-visibility safety-apricot accents (`#ffbc8b`).

### 1.2 Core Architectural Principles
1. **Zero-Build, Zero-Framework**: 100% vanilla HTML5, modern modular CSS custom properties, and standard ES modules. No Node.js bundling step, no Webpack, Vite, Tailwind CLI, or transpilation required.
2. **Zero Third-Party Runtime Dependencies**: Zero external CDNs, zero third-party font hosts (Google Fonts), zero external analytics, and zero tracking cookies. All typography, scripts (including Three.js), and badge artwork are self-hosted.
3. **Resilient Progressive Enhancement**: Built on an ironclad 5-tier enhancement ladder. The website remains fully functional, legible, and aesthetically pleasing even if JavaScript is disabled, WebGL2 is unsupported, network speed is degraded (`Save-Data`), or the user requests reduced motion (`prefers-reduced-motion`).
4. **Performance & Core Web Vitals**: Critical fonts and portraits preloaded, zero layout shift (CLS = 0), and instant initial paint.

---

## 2. Directory & Component Architecture

```
resume/
├── index.html                                 # Primary portfolio & resume document
├── design.md                                  # Design system & architecture specification
├── README.md                                  # Repository overview & quick start
├── CNAME                                      # Production domain (buburtech.com)
├── robots.txt                                 # Search engine robot directives
├── sitemap.xml                                # XML sitemap with canonical URLs & timestamps
├── assets/
│   ├── portfolio.css                          # Base design tokens, typography, layout & components
│   ├── portfolio.js                           # Core controller: theme manager & 3D card lifecycle
│   ├── portfolio-motion.css                   # Motion styling: curtain overlay, project deck, drawer
│   ├── portfolio-motion.js                    # Motion engine: WAAPI transitions, gestures & deck
│   ├── id-card-3d.js                          # Three.js WebGL2 3D badge scene, textures & physics
│   ├── case-studies.css                       # Specialized stylesheet for deep-dive case studies
│   ├── favicon.png                            # 96x96 site favicon
│   ├── og-image.jpg                           # 1200x630 OpenGraph / Twitter preview card
│   ├── badges/                                # Credly verifiable certification badge artwork
│   │   ├── comptia-cysa-plus.png              # CompTIA CySA+ badge
│   │   └── htb-cdsa.png                       # Hack The Box CDSA badge
│   ├── fonts/                                 # Self-hosted webfonts
│   │   ├── barlow-condensed-extrabold.ttf     # Barlow Condensed 800 (Display headlines)
│   │   ├── barlow-OFL.txt                     # Barlow font license
│   │   └── jetbrains-mono-latin.woff2         # JetBrains Mono (Latin subset woff2)
│   ├── id-card/
│   │   └── portrait.webp                      # Optimized 640x432 portrait texture for ID card
│   └── vendor/three/                          # Vendored Three.js library
│       ├── LICENSE                            # MIT License
│       └── build/
│           ├── three.core.min.js              # Standalone core bundle
│           └── three.module.min.js            # Standard ES module bundle
└── projects/                                  # Project Case Studies subsystem
    ├── index.html                             # Case studies index & project catalog
    ├── bitdefender-endpoint-deployment/       # Case study: 2,850 Endpoint Rollout at BPS
    │   └── index.html
    ├── multi-client-siem-operations/          # Case study: Multi-Client SIEM & SOC Operations
    │   └── index.html
    └── splunk-detection-engineering/          # Case study: Splunk Detection Engineering at DJBC
        └── index.html
```

---

## 3. The 5-Tier Progressive Enhancement Ladder

The portfolio is engineered with a strict tiered enhancement model:

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 4: Hardware-Accelerated 3D WebGL2 ID Badge             │  assets/id-card-3d.js
│         • Three.js scene, extruded mesh, woven lanyard      │  (WebGL2, IdleCallback,
│         • Dynamic canvas textures, drag/flip/parallax       │   Pointer events)
├─────────────────────────────────────────────────────────────┤
│ Tier 3: Kinetic Motion & Web Animations API                 │  assets/portfolio-motion.js
│         • Full-screen chapter curtain navigation wipes     │  (WAAPI, touch swipe,
│         • Touch-gesture project deck slider with inertia    │   IntersectionObserver)
├─────────────────────────────────────────────────────────────┤
│ Tier 2: Theme Switching & State Persistence                 │  assets/portfolio.js
│         • Head blocking theme script (Zero FOUC)            │  (localStorage,
│         • Dark/Light toggle synchronized with system media  │   data-theme attribute)
├─────────────────────────────────────────────────────────────┤
│ Tier 1: Responsive Layout & CSS Container Queries           │  assets/portfolio.css
│         • Modern fluid clamp() typography & CSS grid        │  assets/case-studies.css
│         • CSS container-query ID badge fallback with strap  │  (Media & Container queries)
├─────────────────────────────────────────────────────────────┤
│ Tier 0: Semantic HTML5 & ATS-Ready Document Structure       │  index.html, projects/
│         • Fully readable without CSS, JS or WebGL           │  (W3C HTML5, JSON-LD,
│         • Standard print styling for physical resumes       │   WCAG 2.1 AA accessible)
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Design Tokens & Color System

The color system is organized into semantically scoped CSS Custom Properties defined in `assets/portfolio.css`. It provides native support for both Light and Dark themes, respecting `prefers-color-scheme` automatically while persisting explicit user selections via `localStorage` and `data-theme`.

### 4.1 Color Tokens Specification

| Token Name | Light Theme Value | Dark Theme Value | Semantic Role / Context |
| :--- | :--- | :--- | :--- |
| `--page` | `#f5f5ed` (Light Paper) | `#17241e` (Deep Forest) | Primary background canvas |
| `--ink` | `#192820` (Dark Spruce) | `#f1f4e8` (Cream Tint) | High-contrast body & heading text |
| `--muted` | `#4b5a50` (Olive Grey) | `#bac8b9` (Pale Sage) | Secondary copy, metadata, timestamps |
| `--rule` | `#bec6ba` (Light Rule) | `#63736a` (Subtle Rule) | Horizontal borders, dividers, card lines |
| `--wash` | `#e9ede1` (Subtle Tint) | `#21332a` (Deep Slate) | Background fill for featured sections |
| `--accent` | `#ffbc8b` (Warm Apricot) | `#ffbc8b` (Warm Apricot) | Brand accent, active state, CTA button |
| `--accent-ink` | `#321e17` (Dark Mahogany) | `#321e17` (Dark Mahogany) | High-contrast text on accent backgrounds |
| `--panel` | `#152a22` (Deep Forest) | `#102018` (Obsidian Pine) | Featured card and contact panel fill |
| `--panel-ink` | `#f3f5e9` (Cream) | `#f3f5e9` (Cream) | Text color inside dark panels |
| `--panel-muted`| `#b7c8b9` (Sage Grey) | `#b7c8b9` (Sage Grey) | Secondary text inside dark panels |
| `--panel-rule` | `#536b5c` (Moss Rule) | `#536b5c` (Moss Rule) | Borders inside dark panels |
| `--intro` | `#101c20` (Deep Petrol) | `#101c20` (Deep Petrol) | Hero section & header shell background |
| `--intro-ink` | `#f4efe4` (Soft Cream) | `#f4efe4` (Soft Cream) | Primary text in hero & header shell |
| `--intro-muted`| `#b8c8c7` (Cool Cyan Slate)| `#b8c8c7` (Cool Cyan Slate)| Secondary text in hero & header shell |
| `--intro-rule` | `#52666a` (Steel Slate) | `#52666a` (Steel Slate) | Dividers in hero & header shell |

### 4.2 Contrast & Accessibility Audit
- **Normal Text Contrast**: All body text nodes achieve a contrast ratio $> 4.5:1$ against their respective backgrounds in both Dark and Light modes.
- **Large Text & Headings**: Display headlines exceed $7.0:1$ contrast against `--intro` and `--page`.
- **Button & Interactive Controls**: Accent button (`--accent` on `--accent-ink`) provides an exceptional $10.4:1$ contrast ratio, satisfying WCAG 2.1 AAA requirements.
- **Zero-FOUC Blocking Script**: Located synchronously in `<head>`:
  ```javascript
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch {}
  ```

---

## 5. Typography System

The typography hierarchy balances industrial strength with technical precision:

```
Primary Display:   "Barlow Condensed", "Arial Narrow", sans-serif   (Weight: 800)
Monospace/Code:    "JetBrains Mono", ui-monospace, monospace        (Weights: 400, 700)
Body / UI Sans:    "Segoe UI", system-ui, sans-serif                (Weights: 400, 600, 650, 700)
```

### 5.1 Fluid Scale Rules (`clamp`)

| Element | CSS Property & Formula | Mobile (<600px) | Desktop (>1280px) |
| :--- | :--- | :--- | :--- |
| **Hero H1** | `clamp(3.7rem, 8.15vw, 8.05rem)` | ~59px | ~128px |
| **Section H2** | `clamp(2.65rem, 4.7vw, 4.9rem)` | ~42px | ~78px |
| **Case Study H1** | `clamp(2.75rem, 7vw, 6.6rem)` | ~44px | ~105px |
| **Featured Project H3** | `clamp(2.6rem, 4.65vw, 4.5rem)` | ~41px | ~72px |
| **Impact Metric (dt)** | `clamp(2.9rem, 4.8vw, 4.85rem)` | ~46px | ~77px |
| **Body Paragraph** | `1rem / 1.65` | 16px | 16px |
| **Metadata / Stack** | `0.78rem / 1.6` | 12.5px | 12.5px |
| **Hero Summary** | `clamp(1.06rem, 1.6vw, 1.32rem)` | 17px | 21px |

---

## 6. Layout & Spatial Architecture

### 6.1 Container Constraint (`.wrap`)
All major sections are bound by the responsive `.wrap` container:
```css
.wrap {
  width: min(100% - 112px, 1280px);
  margin-inline: auto;
}
```
As viewport narrows, outer margins adapt seamlessly:
- Desktop: `100% - 112px` (56px gutters each side, capped at 1280px)
- Tablet (`<=1050px`): `100% - 72px` (36px gutters)
- Phablet (`<=800px`): `100% - 48px` (24px gutters)
- Mobile (`<=600px`): `100% - 36px` (18px gutters)

### 6.2 Key Section Layouts

#### Hero Section Grid
The hero incorporates an asymmetrical CSS Grid combining the profile heading, 3D card stage, and introductory details:
```
+-----------------------------------+-----------------------------------+
|  .hero-heading                    |  .id-card (Three.js Stage)        |
|  - Role: L2 Security Analyst      |  - Aspect Ratio: 1.22             |
|  - Title: RIFQI ROFIAN TANAMAS    |  - 3D Interactive Card            |
+-----------------------------------+  - Lanyard + Clip                 |
|  .hero-details                    |  - Orbit / Tilt Controls          |
|  - Summary & Mission              |                                   |
|  - CTA Button & Direct Email      |                                   |
|  - Location & Visa Status         |                                   |
+-----------------------------------+-----------------------------------+
```
On screens $\le 800\text{px}$, the grid gracefully reorganizes into a linear stacked flow: `heading` $\rightarrow$ `card` $\rightarrow$ `details`.

#### Career Impact Metrics Banner (`.impact`)
A high-visibility 3-column data grid situated directly under the hero stage:
- **90%**: Fewer false positives (Splunk detection tuning)
- **70%**: Increase in blocking accuracy (Python automation)
- **2,850**: Endpoints deployed (Bitdefender rollout for BPS)

#### Experience Timeline Dual-Column Grid
On viewports $\ge 1051\text{px}$, `#experience` utilizes a sticky asymmetrical dual-column layout (`.8fr 1.7fr`):
- **Left Column**: Sticky section introduction header (`position: sticky; top: calc(var(--header-height) + 25px);`) that remains pinned while reading through work history.
- **Right Column**: Chronological `<ol class="jobs">` list detailing roles at ITSEC Asia, Focus Solusi Infotama, CIMB Niaga Finance, Alpha Citra Siber Indonesia, and Universitas Multimedia Nusantara.

---

## 7. Interactive 3D ID Badge System (`assets/id-card-3d.js`)

The 3D ID badge is the signature visual feature of the portfolio, engineered with custom Three.js geometry, procedural canvas texturing, physical ribbon kinematics, and pointer physics.

### 7.1 Procedural 2D/3D Texture Engine
To avoid downloading large, non-responsive static image textures for the card faces, the card surfaces are rendered procedurally onto offscreen `<canvas>` elements at $768 \times 1044\text{px}$:
- **Front Face Texture**:
  - Background fill with paper tint (`#edeedf`) and dark slate ink (`#172c21`).
  - Company branding (`buburtech.`) and category tag (`PORTFOLIO ID`).
  - Cropped recruiter portrait WebP image drawn dynamically to canvas.
  - Analyst full name and official role.
  - Security footer: `ITSEC Asia` | `Indonesia`.
- **Back Face Texture**:
  - Dark security card background (`#20382b`) with warm apricot title (`#ffbc8b`).
  - Core competency checklist: *Threat hunting*, *Detection engineering*, *Incident response*.
  - Footer identifier: `buburtech.com`.
- Both canvas maps use `map.colorSpace = SRGBColorSpace` and `map.anisotropy = 4` for crisp legibility at oblique 3D viewing angles.

### 7.2 Geometric Construction
- **Card Body**: Created via `ExtrudeGeometry` with rounded corners (`Shape.quadraticCurveTo`), bevel thickness $0.025$, and bevel size $0.024$. The card slab material uses `MeshStandardMaterial` (`roughness: 0.3, metalness: 0.23`).
- **Lanyard Ribbon**: Built along a 3D spline curve (`CatmullRomCurve3`) parameterized with 5 control points to create natural physical slack. The geometry constructs 38 longitudinal segments with surface normals calculated from spline tangents. It is mapped to a procedural woven herringbone fabric texture ($128 \times 1024\text{px}$).
- **Hardware Clip**: Constructed from a metal loop (`TorusGeometry`), rubber crimp bracket (`BoxGeometry`), and dual metal rivets (`TorusGeometry` with metallic roughness $0.27$, metalness $0.48$).

### 7.3 Physics, Pointer & Parallax Dynamics
1. **Interactive Drag Orbit**: Users can drag the badge with mouse or touch. Pointer movements capture yaw and pitch with natural limits (yaw clamped between $\pm 0.9\text{rad}$, pitch between $\pm 0.55\text{rad}$).
2. **Mouse Hover Damping**: When hovering without dragging, the card follows cursor position with exponential damping:
   $$\text{tilt}_{\text{next}} = \text{tilt} + (\text{aim} - \text{tilt}) \times (1 - e^{-\Delta t / 85})$$
3. **Card Flip Animation**: Triggered by the "Flip card" button or accessibility controls. Rotates $180^\circ$ around the Y-axis over 610ms with physical vertical lift:
   $$\text{lift} = \sin(\text{progress} \times \pi) \times 0.15$$
4. **Scroll-Linked Parallax**: The `trackHero()` loop tracks window scroll position and drives the `--hero-progress` CSS property. The 3D rig rotates in an orbital arc as the user scrolls down into the experience section:
   $$\text{rig.rotation.y} = \sin(\text{progress} \cdot 2\pi) \times 1.07 + \text{tilt.x} \times 0.21$$

### 7.4 Fail-Safe & WebGL Resilience
- **`Save-Data` Network Optimization**: If `navigator.connection?.saveData` is detected, 3D WebGL scene loading is bypassed entirely to conserve user bandwidth and battery.
- **Context Loss Handling**: Full event listeners for `webglcontextlost` and `webglcontextrestored`. If WebGL context is lost, the stage falls back instantly to the static CSS card.
- **Idle Callback Scheduling**: Scene initialization is deferred via `requestIdleCallback` (timeout: 900ms) or `setTimeout(120ms)` to ensure initial page render and First Contentful Paint are never blocked.
- **CSS Container-Query Static Fallback**: If WebGL is unavailable or JavaScript is disabled, `.badge-fallback` renders a pure CSS card using Container Query Units (`cqw`, `cqh`), complete with gradient lanyard strap and CSS flip functionality.

---

## 8. Motion & Micro-Interaction Choreography (`assets/portfolio-motion.js`)

All kinetic animations leverage the native **Web Animations API (WAAPI)**, bypassing heavy third-party animation libraries (e.g. GSAP, Framer Motion) for optimal 60fps/120fps performance.

### 8.1 Motion Timing Curves
- **Standard Kinetic Ease**: `cubic-bezier(0.22, 0.8, 0.2, 1)` (used for menus, reveals, and card drift).
- **Curtain Wipe Ease**: `cubic-bezier(0.66, 0.02, 0.18, 1)` (used for dramatic, punchy editorial full-screen wipes).

### 8.2 Full-Screen Chapter Curtain Navigation
Clicking any navigation link triggers a theatrical full-screen diagonal curtain wipe:
1. `curtain` wipes up from bottom (`translateY(122%) skewY(-7deg)` $\rightarrow$ `translateY(0) skewY(0)`).
2. The destination section title is displayed in oversized condensed type (`span`).
3. Viewport scrolls instantly to the target section while obscured.
4. `curtain` wipes off toward the top (`translateY(0)` $\rightarrow$ `translateY(-122%) skewY(-7deg)`).

### 8.3 Interactive Project Deck Slider
The projects section features a dynamic deck slider (`.projects.is-deck`):
- **DOM State Management**: Unselected slides carry `hidden = true` and `inert = true`, ensuring screen readers and keyboard tab navigation interact only with the active slide.
- **Gesture Swipe Engine**: Pointer event tracking calculates touch displacement. A horizontal gesture threshold ($\Delta x > 48\text{px}$) with a $1.5\times$ horizontal-over-vertical bias check distinguishes intentional swipes from vertical page scrolling.
- **Chromium Tap Deduplication**: Custom timestamp tracking (`touchActivation.time`) prevents double-firing on Chromium mobile touch events where synthetic clicks follow pointerup events.
- **Keyboard Navigation**: Full `ArrowLeft` / `ArrowRight` arrow key support when controls are focused.

### 8.4 Section Reveal on Scroll
Using `IntersectionObserver`, content elements (`[data-reveal]`, `.job`, `.credentials > li`, `.education > article`) trigger an upward clip-path reveal when scrolled into view:
```javascript
{ clipPath: 'inset(0 0 42% 0)', transform: 'translateY(32px)', opacity: 0.4 }
  --> { clipPath: 'inset(0 0 0 0)', transform: 'none', opacity: 1 }
```

### 8.5 Reduced Motion Compliance (`prefers-reduced-motion`)
If a user has enabled reduced motion preferences:
- All WAAPI animations immediately resolve to final states (duration = 0).
- Chapter curtain transitions are disabled; navigation jumps directly to targets.
- 3D card disables hover tilt and executes instant non-interpolated card flips.
- All CSS transitions and keyframes are stripped or neutralized.

---

## 9. Case Studies Subsystem (`projects/`)

The repository features dedicated case study pages providing deep technical context for recruiters auditing major cybersecurity achievements:

### 9.1 Case Studies Index (`projects/index.html`)
Presents a catalog of case studies with clean two-column grid items linking to individual dossiers:
1. **Bitdefender Endpoint Deployment**: Rollout to 2,850 endpoints at Badan Pusat Statistik (Statistics Indonesia).
2. **Splunk Detection Engineering**: 90% reduction in false positives for Indonesia's Customs and Excise (DJBC).
3. **Multi-Client SIEM Operations**: 24/7 SOC triage across QRadar, Splunk, and Wazuh for 3 enterprise environments.

### 9.2 Case Study Article Template (`assets/case-studies.css`)
Each case study is structured with:
- **Breadcrumb Navigation**: Semantically marked up `<nav class="breadcrumbs">` linked to Schema.org `BreadcrumbList`.
- **Hero Intro Block**: Styled with `--intro` background containing large editorial headline and introductory summary.
- **Structured Facts Grid (`.case-facts`)**: Key project metrics presented in a responsive definition list (`<dl>`): Client, Role, Period/Year, and Core Outcome / Scope.
- **Narrative Copy Sections (`.case-copy`)**: Clean editorial typography for technical problem statements, engineering methodologies, and outcomes.

---

## 10. SEO, OpenGraph & Structured Data (JSON-LD)

The portfolio includes comprehensive metadata and schema integration for search engines and professional aggregators:

### 10.1 Structured Data Architecture (Schema.org)
Defined via `<script type="application/ld+json">` in both `index.html` and project pages:
- `@type: "ProfilePage"`: Identifies the document as an official professional profile.
- `@type: "Person"`:
  - Name: *Rifqi Rofian Tanamas*
  - Job Title: *L2 Security Analyst*
  - Works For: *ITSEC Asia*
  - Education: *Nusa Mandiri University*, *Bina Sarana Informatika University*
  - Skills (`knowsAbout`): *Cybersecurity, SOC, SIEM, IBM QRadar, Splunk, Python, Incident Response, Threat Hunting, Detection Engineering, EDR, Security Automation*
  - Verifiable Credentials (`hasCredential`): Links directly to public Credly records for HTB CDSA and CompTIA CySA+.
- `@type: "BreadcrumbList"`: Provides hierarchical search result breadcrumbs across case studies.

### 10.2 Social & Crawler Metadata
- Canonical URL: `https://buburtech.com/`
- OpenGraph: `og:type` (profile / article), `og:image` (`1200x630`), `og:site_name`
- Twitter: `twitter:card` (`summary_large_image`)
- Robots & Crawlers: `robots.txt` granting full crawl permission, with `sitemap.xml` pointing to all canonical URLs and update timestamps.

---

## 11. Print Optimization (`@media print`)

A comprehensive `@media print` stylesheet in `assets/portfolio.css` and `assets/portfolio-motion.css` ensures the live website transforms into a clean, physical 1-to-2 page ATS-compliant resume when printed or exported to PDF:
- **Forced High-Contrast Palette**: Overrides all custom properties to pure white background, jet-black text, and subtle grayscale rules.
- **Interactive Chrome Hidden**: Automatically suppresses navigation headers, footers, 3D card stage, theme toggles, skip links, and button controls (`display: none !important;`).
- **Unrolled Linear Layout**: Converts the interactive project deck slider into stacked linear resume articles.
- **Page Break Hygiene**: Applies `break-inside: avoid` on jobs, projects, and impact statistics to prevent awkward page splits across headings and bullet points.

---

## 12. Maintenance & Extension Guide

### 12.1 Adding a New Work Experience Entry
To add a new position in `index.html`, add a `<li class="job">` element inside `<ol class="jobs">`:
```html
<li class="job">
  <div class="job-meta">
    <p><time datetime="YYYY-MM">Mon YYYY</time> – Present</p>
    <p>Location, Country</p>
  </div>
  <div class="job-content">
    <h3>Role Title</h3>
    <p class="organization">Company Name</p>
    <ul class="achievements">
      <li>Key metric achievement with action verb.</li>
      <li>Specific technical accomplishment.</li>
    </ul>
    <p class="stack">Tool · Tool · Language</p>
  </div>
</li>
```

### 12.2 Adding a New Verifiable Certification
In `<section id="certifications">`, add a credential item to `<ul class="credentials">`:
```html
<li>
  <img src="assets/badges/your-badge.png" alt="" width="48" height="48" loading="lazy" decoding="async">
  <div>
    <h3><a href="https://www.credly.com/badges/.../public_url">Certification Name <span aria-hidden="true">↗</span></a></h3>
    <p>Issuer Organization · Month Year</p>
  </div>
</li>
```
Ensure the badge image is placed inside `assets/badges/` and added to the JSON-LD `hasCredential` block.

### 12.3 Adding a New Case Study
1. Create a new directory under `projects/<case-study-slug>/index.html`.
2. Follow the structure of `projects/bitdefender-endpoint-deployment/index.html`.
3. Add the new URL and modification date to `sitemap.xml`.
4. Add a summary item to `projects/index.html` and the project deck in `index.html`.
