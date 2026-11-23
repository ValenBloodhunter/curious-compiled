# Curious, Compiled

The portfolio opens on a charcoal field with one rotating, faceted obsidian sculpture. Its faces reflect the selected artwork. Hold the sculpture to reveal the scene and release to return. A short tap or keyboard activation toggles the reveal. Escape closes it.

Black Sun is an original landscape created for this site. Neural Ronin uses the existing character portrait. Reduced motion freezes the sculpture and removes the reveal transition. The project list and navigation are ordinary HTML links.

A full-screen index connects the work, about, experiments and contact sections. Paper-colored project rows use the descriptions, technology lists and GitHub links in `src/data/projects.ts`. The dark sections pair Manrope with an italic serif.

Run `npm run build` and `npm run lint`. With Vite running on port 5173, `python tests/portfolio.py` exercises the main interactions in Playwright Chromium.
