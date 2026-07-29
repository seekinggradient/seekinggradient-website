---
description: How the ideas archive is structured, edited, and kept publish-safe.
sources:
  - README.md
  - AGENTS.md
  - src/ideas/data/ideas.ts
  - src/ideas/pages/IdeaPage.tsx
  - src/pages/ideas/[...path].astro
---

# Ideas Notebook

The ideas notebook is the public archive under `/ideas`. Core idea content lives in `src/ideas/data/ideas.ts` as an ordered typed array. Each entry provides slug, number, title, tagline, domain, status, year, tags, summary, and sections.

Idea entries may also include an optional `references` array with `title`, `href`, and optional `note`. `src/ideas/pages/IdeaPage.tsx` renders those as external-link reference cards near the bottom of the idea page.

Rendering behavior:

- `src/pages/ideas/[...path].astro` statically generates routes from the ideas array.
- `src/ideas/pages/IdeaPage.tsx` renders the standard page, optional visual exploration assets, special deep-dive components for selected slugs, tags, and previous/next navigation.
- Order in the `ideas` array controls the public index order and previous/next links.

Publishing rules:

- Avoid real personal names in public content.
- Generated raster visuals need prompt provenance. Idea visuals should store the prompt in the matching `VisualAsset.prompt`.
- Text-only idea entries do not need visual prompt metadata.

Current newest entry:

- [[Agent Fantasy Football Competition]] is `N° 017`.
