---
description: Build and deploy facts for the public Seeking Gradient site.
sources:
  - README.md
  - package.json
  - .gitignore
  - Cloudflare Pages project list observed via afs setup session
---

# Deployment

The site is built as a static Astro site into `dist/`. Unlike many repos, `dist/` is intentionally tracked and should be committed when publishing changes.

Commands:

- `npm run dev` starts the local Astro dev server.
- `npx astro build` verifies and regenerates the static site without invoking the package `prebuild` script directly.
- `npm run build` runs the configured production build path, including the `prebuild` TTS step.

Live publishing:

- The GitHub remote is `git@github.com:seekinggradient/seekinggradient-website.git`.
- The Cloudflare Pages project is `seekinggradient-website`, with domains `seekinggradient.com`, `www.seekinggradient.com`, and `seekinggradient-website.pages.dev`.
- Pushing `main` triggers the Cloudflare Pages deployment.
- After a push, public routes may briefly return stale responses or 404 until the deployment finishes propagating.

