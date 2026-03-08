# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static HTML prototype** for Medlock Square, a Manchester City development project. No build step, no framework, no package manager commands needed — open HTML files directly in a browser or serve locally.

## Running Locally

Serve with any static file server, e.g.:
```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

There are no tests, no linting, and no build process.

## Site Structure

Each page is a standalone HTML file that includes its own CSS and JS:

| File | Page |
|------|------|
| `index.html` | Homepage |
| `hotel.html` | Hotel page |
| `attractions.html` | Things To Do |
| `food-and-drink.html` | Food & Drink |
| `conferences-and-events.html` | Conferences & Events |
| `experiments.html` | Experiments / Stay Informed |
| `styleguide.html` | Design styleguide reference |
| `index-archive.html` | Archived homepage version |

## CSS Architecture

All styles live in `css/`. There is no preprocessor — plain CSS with custom properties.

- **`variables.css`** — All design tokens (colors, spacing, typography). This is loaded first on every page. Edit tokens here to change the whole site.
- **`fonts.css`** — Declares Kippax Modern font faces (local `.otf` files in `fonts/`) plus Google Fonts imports.
- **`styles.css`** — Global reset and base styles (body, img, a, button).
- **`nav.css`** — Navigation component, including mobile menu overlay.
- **`hero.css`** — Hero section for all pages; homepage variant uses `.hero--homepage`.
- **`home-figma.css`** — Homepage-specific layout overrides matching Figma design.
- **`hotel.css`**, **`attraction.css`**, **`food-attractions.css`**, **`conferences-events.css`** — Page-specific component styles.
- **`sticky-left.css`** — Sticky left-column layout used on hotel and other detail pages.
- **`footer.css`**, **`ticker.css`**, **`intro-text.css`**, `intro-text-secondary.css`, `video-text.css` — Shared section components.
- **`styleguide.css`** — Only used by `styleguide.html`.
- **`*-experiments.css`** — Work-in-progress/experimental variants, not production.

### Key Design Tokens (variables.css)

- Primary font: `"Kippax Modern"` (custom), fallback `sans-serif`
- Headings use `"Kippax Modern Condensed Bold"` for uppercase display text
- Primary accent: `#9D78FE` (purple) — used for buttons
- Dark background: `#1e1e28` — used for nav and dark sections
- Site margin: `56px` desktop / `24px` mobile
- Section spacing: `--section-space-main: 112px` desktop / `72px` mobile

## JavaScript Architecture

All JS lives in `js/`. No module bundler — scripts loaded with `<script defer>` tags.

- **`nav.js`** — Mobile hamburger menu toggle. Loaded on every page.
- **`animations.js`** — GSAP-based animations: homepage hero zipwire image cycling, scroll-triggered fade-ins. Loaded on most pages.
- **`animations-experiments.js`** — Experimental animations for homepage only.
- **`hotel.js`** — Hotel page–specific JS (room gallery, tabs, etc.).
- **`feature-band.js`** — Feature band component animations.
- **`image-debug.js`** — Debug utility, not for production.

GSAP and ScrollTrigger are loaded from CDN (`cdn.jsdelivr.net/npm/gsap@3`). The `node_modules/gsap` directory is present but **not used** — GSAP is loaded via CDN only.

## CSS Cache Busting

CSS and JS files use query-string version numbers (e.g. `href="css/nav.css?v=2"`). When making changes to a CSS or JS file that should be reflected immediately in browsers, increment the version number on the `<link>` or `<script>` tag in the relevant HTML file(s).

## Nav Variants

The homepage uses `<nav class="nav-component nav-component--figma">` for the Figma-matched dark nav styling. Other pages use `<nav class="nav-component">` (same underlying dark style via `nav.css`).

## BEM Naming Convention

CSS classes follow BEM: `block__element--modifier`. Examples:
- `.nav__mobile-menu--open`
- `.hero--homepage`
- `.attraction__title`
