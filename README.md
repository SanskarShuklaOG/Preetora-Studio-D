# Preetora Studio — Frontend v3

Static site (plain HTML/CSS/JS, zero dependencies). Upload the folder to any static host (Render, Netlify, GitHub Pages).

## What changed in v3
- **Motion system** (no GSAP/Lenis needed — keeps the site ~25 KB of JS+CSS): page-load curtain, word-by-word masked headline reveal, hero choreography with clip-path portrait reveal, scroll + pointer parallax, cursor glow, card spotlight borders, magnetic buttons, animated counters, internal page transitions, animated three-dot→X menu with staggered links, video frame reveals, animated Journey thread whose nodes light up as you reach them, and a live "now building" state.
- **Services**: 8 interactive cards (icon motion, border sweep, hover/tap description reveal).
- **Portfolio**: orientation-safe 4:5 frames (vertical or landscape clips both work), Cloudinary width-limited delivery + auto poster frames, max 3 videos playing at once, visible play/pause + sound controls, pauses when tab hidden, no autoplay for reduced-motion or Data Saver users, graceful error state.
- **Fixes**: malformed Google Fonts URL; hero hidden until scroll-observer fired (LCP) and invisible without JS; admin override destroying headline markup; always-on full-screen noise animation; wrong video poster; mislabeled `.png` (really JPEG) and wrong image dimensions (images 422 KB → 135 KB); menu focus trap/inert background; text/targets too small; admin page now `noindex`.
- **SEO**: Open Graph/Twitter tags, JSON-LD (ProfessionalService), favicon, descriptive alt text.
- **Conversion**: WhatsApp CTA + Instagram in contact section.

## Before launch (owner action)
1. **Replace the placeholder reviews and the "5.0/5" rating** in `index.html` (marked with a TODO comment) with real, attributable client feedback.
2. Add a 1200×630 `og:image` and a `canonical` URL once the domain is known.
3. The admin page is a localStorage preview only — it is not secure authentication.

## Files
`index.html` · `journey.html` · `admin.html` · `css/styles.css` · `js/main.js` (shared engine) · `js/journey.js` · `js/admin.js` · `assets/`
