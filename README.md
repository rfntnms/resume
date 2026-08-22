# Rifqi Rofian Tanamas — L2 Security Analyst

Single-page portfolio, built for international job hunting. Static HTML, no build
step, no framework, no backend.

**Live:** [buburtech.com](https://buburtech.com)

## Tech

- One hand-written `index.html` — HTML + inline CSS + 1.3 KB (gzipped) of JavaScript
- JetBrains Mono, self-hosted latin subset (no Google Fonts request)
- SOC footage as the hero background, encoded to MP4 + WebM
- GitHub Pages from `main`, custom domain via `CNAME`

Zero third-party requests at runtime — no CDN, no font host, no analytics, no cookies.

## Structure

```
index.html              the whole page
robots.txt
sitemap.xml
CNAME                   buburtech.com
assets/hero.mp4         hero background, muted (948 KB)
assets/hero.webm        same clip, VP9 (691 KB)
assets/hero-poster.jpg  LCP image and no-JS / reduced-motion fallback
assets/og-image.jpg     1200×630 social card
assets/badges/          Credly badge art, self-hosted
assets/fonts/           JetBrains Mono woff2, latin subset
```

## Editing

Everything is in `index.html`, in document order: hero → about → experience →
projects → skills → certifications → education → contact. Adding a job means copying
a `<li class="job">` block; the active role carries `class="job is-current"`.

Certification tiles link to their Credly `public_url`. To make the remaining two
verifiable, copy the `<a class="cert">` pattern and paste the badge's share link.

## Behaviour worth knowing

- **Hero video** ships with no `src`. After `window.load`, JS attaches the sources and
  fades it in over the poster — and skips it entirely on `prefers-reduced-motion`,
  Save-Data or 2G. The poster is always the LCP element.
- **Theme** is dark by default, follows `prefers-color-scheme` on first visit, and a
  manual choice persists in `localStorage`. Applied by a blocking script in `<head>`
  so there is no flash of the wrong theme.
- **Contrast** was audited across every text node in both themes: nothing below 4.5:1.
- **Works with JavaScript off** — full content, poster instead of video, and the theme
  toggle hides itself.
