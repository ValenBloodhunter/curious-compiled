# Curious, Compiled.

Ghost Lynx is a fictional cybernetic snow lynx. Its pearl ceramic armor, blue-black fur shadows, and amber optic set the palette for Debashis Das’s portfolio. DM Sans carries the interface and Instrument Serif italic carries the second half of display headings. Both fonts are served locally.

The opening portrait fills the viewport. A WebGL grid lets the lynx breathe and turn at the neck. Moving a pointer or dragging a finger pulls the fur along the stroke, then it springs back. A tap sends a short ripple across the portrait. Vertical swipes scroll the page and ease the camera closer. Switching lenses sends a wave of false color out from the eye. Browsers without WebGL use a lighter camera movement on the photograph. Reduced motion keeps both lens views still.

The work index opens one project at a time. Diagrams illustrate routing, classification, voice, and mapping from the projects’ subject matter. Each entry links to the repository. A second view of the lynx on an alpine ridge leads into the biography and field notes. The final section provides email and social links.

Run `npm run build` and `npm run lint`. With Vite running, `python tests/portfolio.py` checks the scene, project index, menus, image fallback, and reduced motion. Set `PORTFOLIO_URL` to test a preview server and `CHROMIUM_PATH` to use a local Playwright Chromium executable.
