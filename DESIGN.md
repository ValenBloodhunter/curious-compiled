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

The portrait responds subtly to mouse position. A bounded canvas of 90 neural particles drifts around it. Drawing stops offscreen and when the tab is hidden. Reduced motion uses a still field and no pointer displacement. No repeated section reveals or autoplay sound. Content and links remain visible independently of the canvas.

## Responsive behavior

Desktop headlines flank the portrait; mobile stacks them above and below the face. Project rows become a single reading column. Navigation stays in flow. Minimum reviewed width: 375px.

## Checks

Build: `npm run build`. Lint: `npm run lint`.
Browser smoke check: run the app, then `python tests/neural-interface.py` with Python Playwright and Chromium installed. `CHROMIUM_PATH` may point to an existing Chromium executable.
