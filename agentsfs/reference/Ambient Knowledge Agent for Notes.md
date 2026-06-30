---
description: Product context for the ambient knowledge-agent idea recently added to the ideas archive.
sources:
  - src/ideas/data/ideas.ts
---

# Ambient Knowledge Agent for Notes

This is an idea entry in the [[Ideas Notebook]] with slug `ambient-knowledge-agent-for-notes`.

Core concept:

- A writing surface or companion app quietly surfaces relevant knowledge while the user writes notes.
- It should not behave like autocomplete. The distinction is important: the product should expand context around a thought, not take over the sentence.
- Example use case: writing about BM25 and getting nearby definitions, formula context, source links, comparisons to semantic retrieval, questions, and related notes.

Product-shape branches:

- Obsidian plugin: gets clean vault structure, backlinks, local note indexing, and an obvious note-taking context.
- Mac companion app: watches the active writing surface through screen monitoring and accessibility context, potentially working across Obsidian, Apple Notes, Google Docs, browser editors, PDF margin notes, and Markdown files.

Open tradeoff:

- Obsidian-first gives deeper semantics inside one app.
- Mac-level monitoring gives broader ambient awareness but creates harder privacy, permission, OCR/accessibility, and context-detection problems.

