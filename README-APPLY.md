# CURIOUS, COMPILED.

**A personal portfolio about hard problems, thoughtful software, and making things work.**

A dark, interactive portfolio built with React and TypeScript. Its visual direction, **Midnight Lab**, combines cinematic gradients, precise typography, technical illustrations, and restrained motion—without taking attention away from the projects themselves.

> I LIKE HARD PROBLEMS. AND MAKING THINGS WORK.

## What's inside

- **Interactive hero** — Oversized animated typography, ambient gradients, and a cursor-responsive coordinate instrument.
- **Selected work** — Four featured projects, each with its own custom-designed visual.
- **About** — A short introduction, engineering interests, and a Codevium 2026 achievement highlight.
- **In the Lab** — Current explorations in algorithms, intelligent systems, and hardware.
- **Contact** — GitHub, optional LinkedIn, and an email action when a public address is configured.
- **Responsive navigation** — Glass-style sticky header, scroll-progress indicator, mobile menu, and soft glowing hover states.

The site is a **front-end-only portfolio**. Its project graphics are illustrative UI, not live model outputs or functioning project demos.

## Featured projects

| Project | What it explores | Repository |
| --- | --- | --- |
| **WARRANTY** | Cost-aware LLM routing, calibrated quality-regression limits, and statistical decision-making. | [GitHub](https://github.com/ValenBloodhunter/Warranty) |
| **VEIL** | SMS/text spam classification with TF-IDF and Multinomial Naive Bayes. | [GitHub](https://github.com/ValenBloodhunter/Veil) |
| **SKILLSETU** | A voice-oriented hackathon prototype for discovering government schemes and livelihood opportunities. | [GitHub](https://github.com/ValenBloodhunter/SkillSetu) |
| **CAMPUSFLOW** | A campus-focused mapping and real-time web app prototype using Google Maps and Firebase. | [GitHub](https://github.com/ValenBloodhunter/CampusFlow) |

Project descriptions, links, and technology labels are managed in `src/data/projects.ts`.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | React + TypeScript |
| Tooling | Vite |
| Styling | Tailwind CSS v4 + custom CSS |
| Animation | Motion for React + CSS transitions |
| Icons | Lucide React |
| Hosting | Static hosting; Vercel-ready |

No backend or database is required for the portfolio itself.

## Run locally

**Requirements:** Node.js and npm installed.

```bash
git clone https://github.com/ValenBloodhunter/curious-compiled.git
cd curious-compiled
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project structure

```text
curious-compiled/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── CoordinateMotif.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── ProjectRow.tsx
│   │   ├── About.tsx
│   │   ├── Explorations.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── projects.ts
│   │   └── profile.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Customize

### Personal details

Edit `src/data/profile.ts` to configure:

- `displayName` — Name to show in the footer.
- `publicEmail` — Enables the email contact action.
- `linkedinUrl` — Displays the LinkedIn footer link when provided.
- `githubUrl` — GitHub profile destination.
- `monogram` and `tagline` — Branding values.

Leave optional contact fields empty until you're ready to publish them. The portfolio already handles missing email and LinkedIn links.

### Projects

Edit `src/data/projects.ts` to update featured work. The `ProjectRow` component selects a bespoke illustration using each project's `visual` value; adding a new visual type requires updating `ProjectRow.tsx` as well.

### Look and feel

The **Midnight Lab** theme lives mainly in `src/styles/globals.css`:

- Midnight-blue base and teal/violet accents.
- Atmospheric gradients and glass surfaces.
- Motion, hover, and typography treatments.

Global styles are loaded through `src/index.css`. Motion-sensitive users are considered through reduced-motion support.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Select **Vite** if the framework isn't detected automatically.
4. Use build command `npm run build` and output directory `dist`.
5. Deploy. Future pushes can trigger new deployments when Git integration is enabled.

Because the portfolio is a static single-page site, no application server or API secrets are needed for the current implementation.

## Design principles

**Distinctive, not distracting.** The experience should have personality while keeping the work easy to read and explore.

**Real work over invented metrics.** Project descriptions should reflect what was actually built; the visualizations are intentionally illustrative.

**Smooth, not sluggish.** Animation should support the interface, remain responsive, and respect reduced-motion preferences.

---

**CURIOUS, COMPILED.**

Built with intention. Always a work in progress.
