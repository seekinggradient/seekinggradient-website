---
description: Product and technical context for the Markdown To portable live-app format idea.
sources:
  - src/ideas/data/ideas.ts
  - src/ideas/components/MarkdownToDeepDive.tsx
  - src/ideas/pages/IdeaPage.tsx
  - https://commonmark.org/
  - https://github.github.com/gfm/
  - https://pandoc.org/
  - https://markdown2.com/
---

# Markdown To

This is idea `N° 018` in the [[Ideas Notebook]], with slug `markdown-to`.

The product thesis is a family of strict, portable Markdown-backed application formats. A file declares one exact format, such as `kanban@0.1` or `audio@0.1`, and opens as the corresponding live app. The app can serialize supported state changes back into a downloadable Markdown file. It is not a one-source-to-every-output converter.

Architecture decisions:

- Markdown is the human- and agent-owned format at rest.
- The compiler emits typed JSON intermediate representation for validation, APIs, live renderers, semantic patches, and conformance tests.
- High-write or concurrent runtime data may use an append-only log, database, or sidecar; Markdown remains the canonical definition or exportable state snapshot.
- The base should remain safe CommonMark/GFM plus a small YAML envelope, format-specific semantics, stable ids, and a typed escape hatch.
- Compilation and serialization are deterministic; agents can repair files but do not infer critical runtime semantics.
- The open layer includes grammar, format schemas, IR, fixtures, parser, validator, SDK, and conformance suite.
- CLI, MCP, `llms.txt`, `SKILL.md`, and harness plugins form the agent-native distribution layer.

Reference products:

- `kanban@0.1` proves bidirectional live state and safe drag-to-source patches.
- `audio@0.1` proves a paid high-quality TTS workflow with voice preview, transparent estimates, chapter generation, section regeneration, and MP3/M4B/private-podcast delivery.

Naming:

- The intended public identity is **Markdown To**, not “Markdown 2.”
- `markdown2.com` is already an active unrelated rich-document product.
- `markdownto.ai` is the recommended primary domain.
- `markdownto.io` is the recommended defensive redirect and non-AI developer-infrastructure fallback.
- `mdto.ai` is useful as a compact CLI, API, or short-link surface.
- `mdto.io` is optional defensive coverage.
