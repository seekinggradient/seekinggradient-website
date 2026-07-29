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
  - https://github.com/SemiSimpleMath/Adaptive-Markdown
  - https://www.kanbaruu.com/
  - https://github.com/obsidian-community/obsidian-kanban
  - https://markwhen.com/
  - https://www.docstoaudio.com/
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
- Extensibility has two independently versioned axes:
  - Format packages define meaning through a namespace, grammar, schema, IR extraction, semantic mutations, serializer, migrations, fixtures, and documentation.
  - Renderer packages define one experience through accepted format ranges, read/write mode, capabilities, runtime target, permissions, entrypoint, exports, license, and optional pricing.
- One canonical format should support multiple competing renderers. Renderers consume the shared IR and mutation vocabulary; they may change presentation but not reinterpret the file.
- The open registry stores immutable signed package metadata, compatibility ranges, deprecations, security advisories, and conformance evidence. It should be mirrorable and usable without the hosted marketplace.
- The marketplace is a separate discovery and commercial layer for demos, hosted installation, verified badges, support, pricing, and analytics. Marketplace rank or payment must never redefine format semantics.
- Community formats begin in namespaced experimental channels. Promotion toward an official standard requires real files, migrations, multiple implementations, public RFC review, and conformance evidence.

Reference products:

- `kanban@0.1` proves bidirectional live state and safe drag-to-source patches.
- `audio@0.1` proves a paid high-quality TTS workflow with voice preview, transparent estimates, chapter generation, section regeneration, and MP3/M4B/private-podcast delivery.

Prior art and positioning:

- Adaptive Markdown is the closest philosophical precedent: a `.md` file becomes a programmable living app and agent surface. It allows document-specific HTML/CSS/JavaScript; Markdown To should distinguish itself through constrained, code-free, shared application formats.
- Kanbaruu is the closest agent-native project product: Markdown task files, repository sync, Kanban/Gantt/list/calendar views, and MCP. It is one project manager rather than a general standard and renderer ecosystem.
- Obsidian Kanban is direct prior art for Markdown-backed Kanban and should be treated as an import/compatibility target, not a novelty gap.
- Markwhen is strong prior art for a specialized Markdown-like time language that parses to JSON and several views.
- Pandoc, Quarto, MDX, Markdoc, and AudioDoc cover publishing, richer syntax, components, schemas, and narration.
- The credible novelty claim is the combination of a public versioned format registry, safe shared IR and mutation protocol, deterministic round-tripping, conformance fixtures, interchangeable renderers, and agent-native discovery. Kanban is the reference implementation, not the invention.

Naming:

- The intended public identity is **Markdown To**, not “Markdown 2.”
- `markdown2.com` is already an active unrelated rich-document product.
- `markdownto.ai` is the recommended primary domain.
- `markdownto.io` is the recommended defensive redirect and non-AI developer-infrastructure fallback.
- `mdto.ai` is useful as a compact CLI, API, or short-link surface.
- `mdto.io` is optional defensive coverage.
