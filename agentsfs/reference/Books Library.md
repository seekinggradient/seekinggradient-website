---
description: Publishing architecture, content model, and visual decisions for the public agent-created ebook library.
sources:
  - src/books/books.ts
  - src/components/books/BooksLanding.astro
  - src/pages/books/
  - src/content/books/
  - public/books/
---

# Books Library

The public Books library lives at `/books` and is a first-class site area alongside Writing and Projects. It publishes complete agent-created learning books rather than treating them as blog posts or idea entries.

## Foundation Models series

The first series is a four-book path, in this order:

1. *Inside a Transformer, slowly* — intuition from raw data through Transformer mechanics and inference.
2. *Inside nanoGPT, line by line* — a source-pinned implementation walkthrough.
3. *Practical Model Training for ML Practitioners* — evaluation, data, adaptation, compute, post-training, multimodality, and deployment.
4. *From GPT-2 to Kimi K3, from first principles* — the architecture and systems path from standard attention to a frontier model.

Each book has a detail page under `/books/foundation-models/<slug>`, a complete online reader under `/read`, a generated `.md` download route, and a static EPUB download. The Markdown copies in `src/content/books/foundation-models/` are publication snapshots of the canonical AgentsFS sources. `src/books/books.ts` owns public sequence, titles, descriptions, metadata, cover paths, and curated section links.

## Reader implementation

- The `books` Astro content collection validates the existing AgentsFS frontmatter without forcing publication metadata into the source manuscripts.
- `remark-math`, `rehype-katex`, and `katex` render inline and display equations.
- Local source illustrations live in `src/assets/books/media/` so Astro optimizes them during the static build.
- The raw Markdown endpoint restores the canonical `../../media/` paths before returning a download.
- A sticky chapter rail, top reading-progress line, previous/next path, and EPUB affordance make the long web editions navigable.

## Visual system

The design adapts the site's existing warm paper and marker colors into a tactile technical library. Real cover images stand on code-native cobalt shelves with long soft shadows. The library landing page is a full-bleed poster followed by a cardless numbered reading path. Detail pages foreground one physical cover and large editorial title; mobile pages bring the cover into the first viewport. The homepage includes a dedicated cobalt library feature.

Generated UI mockups were used only as design studies and were not added to the site. Live interface visuals are HTML/CSS plus the validated book covers and manuscript illustrations. Faithful normalized prompts for the two AI-generated conceptual illustrations are stored in `src/books/GENERATED-ASSET-PROMPTS.md`.

## Verification

Normal publication verification includes:

- `npx astro build` with tracked `dist/` output;
- desktop and mobile browser checks at 1440px and 390px;
- no horizontal overflow on library, detail, or reader pages;
- every curated detail-page section anchor resolves in the corresponding reader;
- EPUB ZIP integrity checks;
- a privacy scan for accidental owner-name publication.
