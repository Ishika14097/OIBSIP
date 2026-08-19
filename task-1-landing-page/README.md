# Lumière — Photography & Visual Stories

> A luxury photography studio landing page built with pure HTML & CSS — no frameworks, no dependencies.


## Project Overview

**Lumière** is a premium, single-page landing page for a fictional photography studio. It was created as part of the **Oasis Infobyte Web Development Internship (Level 1, Task 1 — Landing Page)**.

The design follows a luxury Platinum & Titanium Noir aesthetic, featuring a rich obsidian dark theme with metallic silver accents, cinematic typography, and smooth animations — all achieved without any CSS framework or JavaScript library.

---

## Features

### Design & Aesthetics
- **Luxury Dark Theme** — Deep obsidian (`#0A0A0C`) background with platinum/titanium silver accents
- **Glassmorphism Elements** — Frosted-glass sticky navigation bar using `backdrop-filter: blur()`
- **Premium Typography** — Three curated Google Fonts:
  - `Fraunces` — Serif display font for headings and quotes
  - `Inter` — Clean sans-serif for body text
  - `IBM Plex Mono` — Monospace for labels and metadata
- **Conic Gradient Brand Mark** — Animated metallic logo badge
- **Silver Gradient Buttons** — Polished platinum CTA buttons with glow hover effects

### Sections
| Section | Description |
|---|---|
| **Navigation** | Sticky glassmorphic nav with smooth scroll links |
| **Hero** | Full-viewport hero with 6-image auto-cycling slideshow background |
| **Process Bar** | 4-step "Consult → Shoot → Edit → Deliver" signature process strip |
| **Features / Why Us** | 3-column feature grid with SVG icon cards |
| **About / Studio Story** | Two-column layout with video background and studio statistics |
| **Client Stories** | Testimonials carousel (3 cards) |
| **Footer** | Multi-column footer with brand, links, and contact info |

### Animations & Interactivity
- **Hero Slideshow** — CSS-only 6-image crossfade slideshow using `@keyframes`
- **Scroll Reveal** — CSS `animation-timeline: view()` scroll-driven entry animations (with fallback)
- **Hover Micro-animations** — Subtle `translateY` lifts and glow pulses on cards and buttons
- **Smooth Scrolling** — Native `scroll-behavior: smooth` via CSS



## File Structure

```
OIBSIPWebDev-L1-LandingPage/
├── index.html        # Main HTML page (single-page structure)
├── styles.css        # Complete stylesheet (design tokens + all components)
├── README.md         # Project documentation
└── images/           # Image assets
    ├── hero-01.jpg   # Hero background slides (1–6)
    ├── hero-02.jpg
    ├── hero-03.jpg
    ├── hero-04.jpg
    ├── hero-05.jpg
    └── hero-06.jpg
```

---

## Getting Started

Since this is a pure static HTML/CSS page with no build tools or dependencies, getting it running is instant:

### Option 1 — Open Directly
```
Double-click index.html → opens in your default browser
```

### Option 2 — Via Terminal
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 3 — Live Server (Recommended for Development)
If you have the VS Code **Live Server** extension:
1. Right-click `index.html` in the Explorer
2. Select **"Open with Live Server"**

Or with Node.js:
```bash
npx serve .
```

---

## Design System

All design tokens are defined as CSS custom properties in `:root` for easy theming:

```css
/* Color Palette */
--bg: #0A0A0C;          /* Rich obsidian black */
--bg-alt: #121216;      /* Slightly lifted dark */
--card: #17171C;        /* Card surface */
--ink: #F8FAFC;         /* Primary text */
--ink-soft: #CBD5E1;    /* Secondary text */
--ink-faint: #64748B;   /* Muted labels */

/* Platinum Spectrum */
--amber-1: #F8FAFC;     /* Pure platinum white */
--amber-2: #E2E8F0;     /* Polished metallic silver */
--amber-3: #94A3B8;     /* Brushed titanium gray */
--amber-4: #475569;     /* Deep gunmetal steel */

/* Silver Gradient */
--silver-gradient: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%);
```

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 900px` | Full desktop layout, 3-column grids, side-by-side about section |
| `≤ 900px` | 2-column grids, stacked about section, adjusted hero padding |
| `≤ 640px` | Single-column layout, centered nav, stacked buttons, smaller typography |

---

## Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure (`<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`) |
| **Vanilla CSS3** | All styling, animations, and responsive layout |
| **CSS Custom Properties** | Design tokens and theming |
| **CSS Grid & Flexbox** | Page layout and component alignment |
| **CSS Animations & Keyframes** | Hero slideshow, scroll reveals, hover effects |
| **Google Fonts** | Fraunces, Inter, IBM Plex Mono |

>  Zero JavaScript. Zero frameworks. Zero build tools.

---

## Accessibility

- Semantic HTML5 elements used throughout
- `aria-label` and `aria-hidden` attributes on decorative elements
- `role` and `aria-selected` on navigation elements
- Focus-visible styles on all interactive elements
- `prefers-reduced-motion` media query disables animations for users who prefer reduced motion
- Sufficient color contrast ratios on all text elements

---

## SEO

- Descriptive `<title>` tag
- Semantic heading hierarchy (`h1` → `h2` → `h3`)
- Meaningful `alt` text on all images
- Landmark regions (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Smooth scroll anchor navigation

---

## Author

Built for the **Oasis Infobyte Web Development Internship**
- **Level:** 1
- **Task:** Landing Page

---

## Credits

### Images & Videos

All photography and video assets used in this project were sourced from free stock platforms and are used under their respective free licenses:

- **[Unsplash](https://unsplash.com)** — Free high-resolution photos  
  License: [Unsplash License](https://unsplash.com/license) *(free to use, no attribution required but appreciated)*

- **[Pexels](https://www.pexels.com)** — Free stock photos and videos  
  License: [Pexels License](https://www.pexels.com/license/) *(free to use, no attribution required but appreciated)*

> All images and videos are used strictly for educational/non-commercial demonstration purposes as part of an internship project.


## License

This project is for educational/internship purposes. All content (copy, brand name "Lumière") is fictional and created for demonstration only.
