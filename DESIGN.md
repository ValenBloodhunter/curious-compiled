# Curious, Compiled — Neural interface

## Direction

The requested reference is https://motionsites.ai/?prompt=neural-interface. Its black stage, central organic neural portrait, asymmetric headlines, and sparse interface are the governing composition. The user explicitly requested this look across the entire portfolio. This replaces the previous glass theme.

## Surface

Mode: Experience. Recruiters and collaborators encounter the work through an atmospheric character study, then a readable project index. Black gives the emerald portrait its full contrast; the rest of the page carries the same restrained palette.

- Ground: `#000000`; text: `#edf1e9`; secondary: `#a1aaa0`; accent: `#b5ed85`.
- Manrope for display and body; DM Mono only for small system annotations and technology lists.
- Full viewport opening: Human instinct / Machine precision, arranged around a central portrait.
- Open, ruled project rows; no glass containers. Original project data and destinations remain in `src/data/projects.ts`.
- Original generated character: `src/assets/neural-ronin.jpg`. An imagined cybernetic ronin, not a portrait of Debashis.

## Motion and access

Motion reference: https://youtube.com/shorts/sYGsqFtojDc — a central transforming form carries a scroll sequence while typography changes around it.

The character is sampled directly from the existing image into a WebGL point cloud (300 by 400 sampling grid, near-black pixels omitted). A 270svh native scroll chapter pins the stage while the face turns, unfolds into an emerald neural bloom, and disperses toward the work. Scrolling backward reconstructs the portrait. The original headlines move aside for the second chapter; a bottom track communicates scroll progress. Subtle idle and pointer depth keep the form alive at rest. No scrolling is intercepted. Drawing stops offscreen and when the tab is hidden. Reduced motion and unavailable WebGL use the original still image with no extended pinned scroll. Context loss returns to that fallback. No new runtime dependency or replacement image is required.

## Responsive behavior

Desktop headlines flank the portrait; mobile stacks them above and below the face. Project rows become a single reading column. Navigation stays in flow. Minimum reviewed width: 375px.

## Checks

Build: `npm run build`. Lint: `npm run lint`.
Browser smoke check: run the app, then `python tests/neural-interface.py` with Python Playwright and Chromium installed. `CHROMIUM_PATH` may point to an existing Chromium executable.
