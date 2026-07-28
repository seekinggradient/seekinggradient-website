---
description: Durable working context for the Seeking Gradient website repository.
sources:
  - AGENTS.md
  - README.md
  - package.json
  - src/ideas/data/ideas.ts
---

# Seeking Gradient Website

This repository is the public Seeking Gradient website. It is an Astro site with a React-powered [[Ideas Notebook]] mounted under `/ideas`.

Important repo facts:

- Public-facing content must never include the site owner's real personal name. Use generic placeholders or the public brand only. Source: `AGENTS.md`.
- Generated images committed to or referenced by the repo must preserve the generation prompt in a durable public/local place. For idea visuals, the prompt belongs on the relevant `VisualAsset.prompt` in `src/ideas/pages/IdeaPage.tsx`. Source: `AGENTS.md`.
- The ideas archive is data-driven from `src/ideas/data/ideas.ts`; adding an idea there updates the index and static route generation. Source: `README.md` and `src/pages/ideas/[...path].astro`.
- `dist/` is intentionally tracked because the static site deploys from committed build output. Source: `.gitignore` and recent commits.
- Normal verification for content changes is `npx astro build` or `npm run build` when the prebuild TTS step is desired. Source: `package.json` and `README.md`.

Recent state:

- The newest idea is [[Ambient Knowledge Agent for Notes]], added as `N° 015` with slug `ambient-knowledge-agent-for-notes`.
- A shared in-repo agentsfs was initialized at `agentsfs/` and connected through the root `AGENTS.md` connection block.
- The Writing archive now includes “The Loop Is the Easy Part” dated July 15, 2026 and “Fly Machines, Sprites, and Session Sandboxes” dated July 25, 2026. Their 16 embedded editorial diagrams live under `public/images/blog/` with reproducible prompt sidecars.
- Blog publication dates render in the `UTC` timezone on archive and article pages so date-only content values do not shift backward for visitors in negative UTC offsets.

Current visual system:

- The main Astro site and React [[Ideas Notebook]] share an expressive personal color system: warm paper `#f7f1e7`, deep violet ink `#17152b`, cobalt `#3154d8`, yellow `#f8e45c`, orange `#ff7043`, pink `#ef67a7`, mint `#8bd8bd`, and lilac `#d8ccff`.
- `src/layouts/Layout.astro` supports a `fullBleed` prop for poster-like pages while retaining the constrained reading layout for essays, tracking, and utility pages.
- Seeking Gradient is the owner's online pseudonym. The site should feel like a personal homepage, not a publication, research studio, product, or branded editorial system.
- The homepage keeps a simple first-person information architecture but now uses a bright yellow poster hero, a code-native gradient path, highlighted words, a cobalt interest ribbon, colorful project workbench tiles, and a dark personal About section. The visual idea is “warm paper plus saturated marker ink.”
- `/essays` is the complete Writing archive. Article pages use plain “Post” and “All writing” vocabulary.
- `/ideas` remains a straightforward repository, but an orange hero, yellow word highlight, pink orbit, cobalt local nav, and colored row hovers connect it to the homepage personality.
- Main navigation is Writing, Projects, About, and Email. The Projects area adds a small local Repository, Mockups, and About subnav. Tracking remains accessible from the footer.
- Keep the personality concentrated in color planes, expressive typography, a few code-native shapes, arrow movement, and tactile hover shifts. Avoid dashboard chrome, conceptual taxonomies, generated hero imagery, complicated diagrams, and ornamental effects that obscure the personal writing-and-projects hierarchy.
- Generated visual work remains available on project detail pages and the secondary Visual notes page, with prompt provenance stored beside assets or in `src/ideas/pages/IdeaPage.tsx`.
- Responsive browser verification covers the homepage, ideas index, essay layout, tracking page, and mobile navigation from 320px through 1440px. `npx astro build` is the safe verification command because it avoids the network-sensitive TTS prebuild workflow.
