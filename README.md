# Schlager Solutions Group — Homepage

Astro + React homepage, evolved from the original single-file `index.html` concept
into an "executive boardroom" design: **Libre Franklin** (bold display/UI grotesk)
paired with **Manrope** (body text) — both sans-serif, self-hosted via Fontsource —
warm paper palette, a dark plum "Meet Michael" chapter, arched imagery, marquee
industry ribbons, and a five-color scroll-progress line in the header. Brand
palette (purple/green/blue/gold/orange) is unchanged throughout.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the production build
```

## Structure

```
src/
├── pages/index.astro          # assembles the page from sections
├── layouts/BaseLayout.astro   # <head>, global CSS, reveal-on-scroll script
├── styles/global.css          # full design system (ported 1:1 from the concept)
└── components/
    ├── *.astro                # static sections (Hero, PathPanel, Footer, …)
    └── react/                 # interactive islands (hydrated with client:visible)
        ├── Diagram.tsx        # Advisory System hub diagram (hover to highlight)
        ├── Timeline.tsx       # scroll-driven Connected Challenges timeline
        ├── CountUp.tsx        # animated hero stats
        └── NewsletterForm.tsx # email validation + success state
```

Everything else (reveal animations, topbar shadow, NJ map drawing) is CSS +
small vanilla scripts, so the page ships almost no JS beyond the four islands.

## To do before launch

- **Portrait**: drop the real photo at `public/michael.jpg`. Until then the
  "MS" monogram fallback shows.
- **Newsletter**: `NewsletterForm.tsx` is a front-end demo — wire
  `handleSubmit` to your email provider (Mailchimp, ConvertKit, etc.).
- **Hero / story images**: currently hotlinked from Unsplash; replace with
  real photography in `public/` for production.
- **Links**: several CTAs and footer links still point to `#` placeholders.
