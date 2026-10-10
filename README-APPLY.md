# CURIOUS, COMPILED. — Midnight Lab theme

A dark, immersive redesign of the portfolio you have already built. Keeps the existing project data, LinkedIn/profile configuration, About, Explorations, Contact, Footer and App structure.

## Installation

1. Make a git commit of your current working portfolio first, so you can undo the theme.
2. Extract this ZIP into the root of your existing `curious-compiled` React/Vite repository.
3. Allow it to replace files with the **same paths**. Do **not** remove existing files.
4. Run `npm run dev`, then `npm run build`.
5. Check the homepage on desktop and a phone-sized browser window.

## Files replaced

- `src/styles/globals.css` — all dark-mode tokens, gradients, glow, motion and glass surfaces
- `src/components/Navbar.tsx` — glass navigation and subtle scroll progress
- `src/components/Hero.tsx` — cinematic typographic hero and CTA treatments
- `src/components/CoordinateMotif.tsx` — kinetic coordinate instrument
- `src/components/ProjectRow.tsx` — four individual project showcase graphics
- `index.html` — dark browser theme, metadata and font setup
- `public/favicon.svg` — custom gradient V/ mark

## Files intentionally not touched

`src/App.tsx`, `src/data/projects.ts`, `src/data/profile.ts`, `src/components/About.tsx`, `src/components/Explorations.tsx`, `src/components/Contact.tsx`, `src/components/Footer.tsx`, `src/components/SectionHeading.tsx` and `src/index.css`.

If `src/index.css` already has both `@import "tailwindcss";` and `@import "./styles/globals.css";`, you don't need to change it.

This redesign uses the Tailwind v4 Vite plugin, Motion, and Lucide libraries you installed earlier. It requires no additional packages. All project preview graphics are illustrations, not live outputs or performance claims.
