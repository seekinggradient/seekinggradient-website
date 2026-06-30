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

