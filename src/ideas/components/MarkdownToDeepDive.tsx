type Row = [string, string, string];

const kanbanExample = `---
markdownto: kanban@0.1
id: launch-markdown-to
title: Markdown To launch
columns: [Backlog, In progress, Done]
permissions:
  network: false
  scripts: false
---

## Backlog

- [ ] Define the format schema
  <!-- mdto id="T-001" priority="high" -->
- [ ] Publish conformance tests
  <!-- mdto id="T-002" depends-on="T-001" -->

## In progress

- [ ] Build drag-to-source patches
  <!-- mdto id="T-003" -->

## Done

- [x] Choose the portable envelope
  <!-- mdto id="T-004" completed="2026-07-28" -->`;

const irExample = `{
  "spec": "0.1",
  "format": "kanban@0.1",
  "document": {
    "id": "launch-markdown-to",
    "title": "Markdown To launch"
  },
  "state": {
    "columns": [
      {
        "id": "backlog",
        "title": "Backlog",
        "items": [
          {
            "id": "T-001",
            "title": "Define the format schema",
            "checked": false,
            "priority": "high",
            "source": { "line": 13, "column": 1 }
          }
        ]
      }
    ]
  },
  "diagnostics": []
}`;

const patchExample = `{
  "op": "replace",
  "entity": "task",
  "id": "T-001",
  "field": "column",
  "from": "backlog",
  "value": "in-progress",
  "expected_source_hash": "sha256:7fd3..."
}

// compiler returns a minimal source edit
{
  "file": "launch.kanban.md",
  "before": "## Backlog\\n\\n- [ ] Define…",
  "after":  "## In progress\\n\\n- [ ] Define…"
}`;

const cliExample = `$ mdto init --format kanban
$ mdto inspect launch.kanban.md
format    kanban@0.1
renderer  web-kanban@0.1

$ mdto validate launch.kanban.md --strict
✓ valid against core@0.1 + kanban@0.1

$ mdto open launch.kanban.md
→ http://localhost:4173

$ mdto render launch.kanban.md --out dist/
$ mdto publish launch.kanban.md --visibility private-link`;

const mcpExample = `inspect_document({ path: "launch.kanban.md" })
validate_document({ path: "launch.kanban.md", mode: "strict" })
list_renderers({ format: "kanban@0.1" })
render_document({
  path: "launch.kanban.md",
  output: "artifact"
})
apply_patch({
  path: "launch.kanban.md",
  entity: "task:T-001",
  changes: { status: "done" }
})
publish_document({
  path: "launch.kanban.md",
  visibility: "private-link"
})`;

const audioExample = `---
markdownto: audio@0.1
title: Field notes
voice:
  style: warm-documentary
  pace: 0.96
exports: [mp3, m4b, private-podcast]
---

# Northbound

The trail narrowed after the first ridge.

<!-- mdto pause="700ms" -->

Say **Kīlauea** with the supplied pronunciation.
<!-- mdto pronounce="kee-lah-WAY-ah" -->

::: mdto-exclude
Sources, image captions, and production notes stay readable
in the manuscript but are not sent to narration.
:::`;

const sdkExample = `import { defineFormat, defineRenderer } from "@markdownto/sdk";

export const kanban = defineFormat({
  id: "community.example/kanban",
  version: "1.0.0",
  core: "^1.0.0",
  schema: "./schema.json",
  grammar: "./grammar.ts",
  toIR: "./to-ir.ts",
  applyPatch: "./apply-patch.ts",
  fixtures: "./fixtures/",
  migrations: { "0.x": "./migrate-0-to-1.ts" }
});

export default defineRenderer({
  id: "community.example/focus-board",
  version: "2.3.0",
  accepts: ["community.example/kanban@^1"],
  mode: "round-trip",
  capabilities: ["drag", "edit", "filter", "offline"],
  permissions: { network: false, storage: "document" },
  entry: "./renderer.tsx"
});`;

const priorArt = [
  {
    name: 'Adaptive Markdown',
    href: 'https://github.com/SemiSimpleMath/Adaptive-Markdown',
    overlap: 'A single readable .md file becomes a living app and an agent-editable programmable surface.',
    opening:
      'It embeds document-specific HTML, CSS, and JavaScript. Markdown To can instead make constrained, code-free application formats interoperable across runtimes.',
  },
  {
    name: 'Kanbaruu',
    href: 'https://www.kanbaruu.com/',
    overlap: 'Repository-synced Markdown tasks, Kanban/Gantt/list/calendar views, and a native MCP surface for agents.',
    opening:
      'It is one project-management product, not a vendor-neutral family of application formats with competing renderers.',
  },
  {
    name: 'Obsidian Kanban',
    href: 'https://github.com/obsidian-community/obsidian-kanban',
    overlap: 'A mature Markdown-backed board proves that direct manipulation can write useful state back into text.',
    opening:
      'Its grammar and runtime are tied to an Obsidian plugin. It is prior art to support and import, not a universal compatibility contract.',
  },
  {
    name: 'Markwhen',
    href: 'https://markwhen.com/',
    overlap: 'A Markdown-like language parses into JSON and renders timelines, calendars, logs, and Gantt-shaped views.',
    opening:
      'It is an excellent specialized format rather than a registry and SDK for unrelated application families.',
  },
  {
    name: 'Pandoc + Quarto',
    href: 'https://quarto.org/',
    overlap: 'Markdown already publishes into books, EPUB, slides, websites, documents, dashboards, and many other outputs.',
    opening:
      'These are primarily publishing pipelines. Markdown To is strongest where a live UI mutates durable application state and writes it back.',
  },
  {
    name: 'MDX + Markdoc',
    href: 'https://markdoc.dev/docs/syntax',
    overlap: 'Component syntax, schemas, validation, tags, and attributes show how Markdown can carry richer semantics.',
    opening:
      'They are authoring frameworks, not a safe registry of shared application data models with renderer conformance.',
  },
  {
    name: 'AudioDoc',
    href: 'https://www.docstoaudio.com/',
    overlap: 'A Markdown upload can already become natural-voice narration with chapter-aware listening.',
    opening:
      'The deeper opportunity is a portable audio-production contract: pronunciation, exclusions, direction, receipts, caching, and reproducible exports.',
  },
];

const coreRules: Row[] = [
  ['Base language', 'UTF-8 CommonMark; the recommended authoring subset is GFM.', 'A conforming file remains useful in any ordinary Markdown viewer.'],
  ['Envelope', 'One YAML frontmatter block names the exact markdownto format, stable document id, title, and permissions.', 'The file declares which live application understands it before a renderer guesses.'],
  ['Semantics', 'Each format assigns meaning to familiar headings, task lists, tables, links, and fenced data blocks.', 'Critical state is explicit and schema-checked, not inferred from prose by an LLM.'],
  ['Identity', 'Every mutable entity carries a stable, unique id.', 'Kanban moves and calendar edits can produce small, safe source patches.'],
  ['Relations', 'References use ids or normal Markdown links; missing relations are validation errors.', 'Dependencies and cross-document graphs survive renames and rendering.'],
  ['Metadata', 'Format-owned HTML comments carry ids and sparse attributes that should not clutter the rendered prose.', 'The source remains valid Markdown while live controls retain durable identity.'],
  ['Escape hatch', 'A fenced mdto-data block may hold typed YAML when headings, lists, or tables become too limiting.', 'The core stays readable without pretending every application state fits a task list.'],
  ['Safety', 'Raw HTML, scripts, remote fetches, and executable code are off in the safe core.', 'A live renderer can display untrusted files without silently running them.'],
  ['Unknown data', 'Parsers preserve fields they do not understand and warn instead of deleting them.', 'Newer documents can pass through older tools without data loss.'],
];

const formatMatrix: Row[] = [
  ['kanban@0.1', 'column headings, task items, ids, owners, priority, labels', 'A draggable board that writes moves, edits, and completion back into the same file.'],
  ['gantt@0.1', 'tasks, dates, durations, dependencies, milestones, groups', 'A zoomable schedule with dependency editing and a portable Markdown download.'],
  ['audio@0.1', 'chapters, narration exclusions, pronunciation, voice direction, pauses', 'A paid TTS studio that emits chaptered audio, captions, timings, and a build receipt.'],
  ['trip@0.1', 'stops, dates, bookings, coordinates, notes, checklists', 'A live itinerary, route map, calendar, offline packet, and editable trip state.'],
  ['crm@0.1', 'people, organizations, interactions, reminders, relationship notes', 'A private personal CRM with timeline, follow-ups, search, and an exportable source file.'],
  ['form@0.1', 'fields, choices, validation, branching, destinations', 'A hosted form whose definition is Markdown and whose response data exports separately.'],
  ['course@0.1', 'lessons, objectives, exercises, answers, sources', 'A course player with progress, quizzes, flashcards, and a learner-state sidecar.'],
  ['story-map@0.1', 'scenes, choices, conditions, destinations, endings', 'A playable branching story and graph editor backed by readable text.'],
];

const formatFamilies = [
  {
    label: 'Plan and operate',
    accent: 'var(--color-yellow)',
    items: ['Kanban', 'Gantt', 'Calendar', 'Roadmap', 'OKRs', 'Decision matrix', 'Runbook', 'Incident room', 'Release train'],
  },
  {
    label: 'Publish and perform',
    accent: 'var(--color-mint)',
    items: ['Website', 'Documentation', 'EPUB', 'Print book', 'Slides', 'Teleprompter', 'Newsletter', 'Interactive essay'],
  },
  {
    label: 'Listen and watch',
    accent: 'var(--color-lilac)',
    items: ['Premium audio', 'Audiobook', 'Private podcast', 'Voice briefing', 'Narrated slides', 'Captioned video', 'Audio walking tour'],
  },
  {
    label: 'Personal software',
    accent: 'var(--color-orange)',
    items: ['Personal CRM', 'Habit tracker', 'Budget', 'Pantry', 'Cook mode', 'Meal plan', 'Workout log', 'Reading queue', 'Wishlist'],
  },
  {
    label: 'Explore and understand',
    accent: 'var(--color-accent-soft)',
    items: ['Dashboard', 'Chart lab', 'Map', 'Timeline', 'Knowledge graph', 'Family tree', 'Comparison tool', 'Calculator', 'Directory'],
  },
  {
    label: 'Collect and coordinate',
    accent: '#f4c9dc',
    items: ['Form', 'Survey', 'Poll', 'RSVP', 'Event schedule', 'Tournament bracket', 'Seating plan', 'Inventory', 'Product catalog'],
  },
  {
    label: 'Play and imagine',
    accent: '#d7e8e1',
    items: ['Choose-your-path story', 'Tabletop campaign', 'Quest log', 'Character sheet', 'Museum guide', 'Garden planner', 'Playlist', 'Scavenger hunt'],
  },
];

const mcpTools: Row[] = [
  ['get_spec', 'version or format', 'Return the normative grammar, schema, examples, and conformance fixtures an agent needs.'],
  ['inspect_document', 'path', 'Detect format, state, references, renderer capabilities, permissions, and diagnostics.'],
  ['validate_document', 'path, strict | compatible', 'Validate core plus format and renderer constraints with line-addressed repair hints.'],
  ['list_formats', 'optional capability query', 'Discover official and namespaced formats without asking an agent to memorize the ecosystem.'],
  ['list_renderers', 'format, version, required capabilities', 'Resolve compatible read-only or round-trip renderers and expose permissions, provenance, and conformance.'],
  ['scaffold_document', 'format, title', 'Create the smallest valid, commented source file and local asset structure.'],
  ['render_document', 'path, options', 'Compile to IR, select the format renderer, and return a live artifact plus a deterministic build receipt.'],
  ['apply_patch', 'entity id, typed changes', 'Translate a safe semantic UI edit back into the smallest source diff.'],
  ['publish_document', 'path, visibility', 'Publish a versioned live app while keeping the Markdown file canonical and downloadable.'],
];

const packages: Row[] = [
  ['@markdownto/core', 'Parse the safe Markdown subset, preserve source positions, and emit the canonical IR.', 'No browser, network, renderer, or hosted-service dependency.'],
  ['@markdownto/formats', 'Versioned schemas, fixtures, migrations, and semantic extraction for official application formats.', 'Formats version independently from the core grammar.'],
  ['@markdownto/sdk', 'Author, test, package, sign, and publish third-party formats and renderers with one typed contract.', 'The SDK exposes extension points; it does not let packages redefine the core or bypass permissions.'],
  ['@markdownto/renderers', 'Official reference live apps for Kanban, Gantt, audio, trips, forms, courses, and other formats.', 'Reference renderers prove the contract without becoming the only allowed user experience.'],
  ['@markdownto/registry', 'Resolve namespaced formats, compatible renderers, immutable versions, signatures, and conformance reports.', 'The public registry is an index; packages remain installable without the hosted marketplace.'],
  ['@markdownto/cli', 'init, inspect, validate, preview, render, publish, migrate, doctor.', 'Thin wrapper around the exact same compiler used by MCP.'],
  ['@markdownto/mcp', 'Local stdio first; remote Streamable HTTP after OAuth and upload semantics exist.', 'Local MCP can read files; remote MCP receives content or an upload handle.'],
  ['@markdownto/conformance', 'Golden files, invalid fixtures, IR snapshots, renderer assertions, and a badge program.', '“Compatible” means passing tests, not merely using the name.'],
];

const marketplaceContracts: Row[] = [
  ['Format package', 'Namespaced id, semantic version, core range, grammar, JSON Schema, Markdown-to-IR extractor, patch serializer, migrations, docs, and fixtures.', 'Defines what a file means; no UI code and no implicit network or execution.'],
  ['Renderer package', 'Accepted format ranges, read/write mode, capabilities, runtime target, permission manifest, entrypoint, screenshots, license, and optional price.', 'Defines one way to experience a format without changing its meaning.'],
  ['Registry record', 'Owner, signature, immutable digest, dependencies, release channel, deprecation state, security advisories, and conformance reports.', 'Makes discovery auditable for people, agents, CLIs, and private enterprise mirrors.'],
  ['Compatibility report', 'Exact core, format, renderer, and fixture-suite versions plus read, render, export, and round-trip results.', 'Turns “works with Kanban” into a reproducible claim rather than marketing copy.'],
  ['Marketplace listing', 'Live demo, source link, install command, permissions, output examples, support policy, pricing, and verified badges.', 'Monetizes discovery and hosting while keeping format meaning outside the marketplace.'],
  ['Promotion path', 'Experimental namespace → community stable → candidate standard → official, with public RFC review and required migrations.', 'Lets invention move quickly without allowing popularity or payment to silently redefine a format.'],
];

const conformanceLevels: Row[] = [
  ['Core reader', 'Parses the envelope and safe CommonMark subset, preserves unknown fields, emits source-addressed IR.', 'Required for every implementation.'],
  ['Format reader', 'Passes all valid/invalid fixtures for a named application-format version.', 'Badge names the exact format, such as kanban@0.1.'],
  ['Live renderer', 'Declares its accepted format and mutations; produces a valid app plus a build receipt.', 'Partial support is legal only when capabilities are explicit.'],
  ['Round-trip editor', 'Applies semantic patches without reformatting unrelated source or losing unknown data.', 'The highest bar because it can mutate the source of truth.'],
];

const securityRules: Row[] = [
  ['No implicit execution', 'Fenced code is data. JavaScript, shell, notebook cells, and macros never run merely because a file renders.', 'Prevents a document from becoming a disguised program.'],
  ['No implicit network', 'Remote images, includes, fonts, and data fetches require a declared capability and user approval.', 'Makes local preview deterministic and private by default.'],
  ['Sanitized output', 'Reference web renderers remove dangerous HTML, enforce CSP, isolate embeds, and block javascript: URLs.', 'Treat every uploaded file as hostile input.'],
  ['Bounded resources', 'File count, bytes, nesting depth, table size, image pixels, render time, and audio duration have explicit limits.', 'Defends hosted workers and local harnesses from resource exhaustion.'],
  ['Content-addressed builds', 'A receipt records source hash, assets, format/schema versions, renderer version, theme, and diagnostics.', 'The same declared inputs can be audited or rebuilt.'],
  ['Scoped publishing', 'Private, private-link, unlisted, and public are separate states; tokens carry narrow read/write scopes.', 'Render access and publish authority are never conflated.'],
];

const phases: Row[] = [
  ['0 · Prove the grammar', 'Publish core@0.1 and kanban@0.1 with fixtures, a browser playground, and lossless drag-to-source editing.', 'A hand-written file and a downloaded file round-trip to identical Kanban state.'],
  ['1 · Prove a second shape', 'Ship audio@0.1 with narration directives, previews, transparent estimates, section regeneration, and chaptered exports.', 'The format family proves it can support both a stateful app and a paid production workflow.'],
  ['2 · Win the agent path', 'Ship the TypeScript core, CLI, local MCP, llms.txt, SKILL.md, and harness-specific plugin bundles.', 'An agent can discover, scaffold, validate, repair, open, and publish without reading the whole website.'],
  ['3 · Host the result', 'Add signed uploads, private links, version history, themes, custom domains, and build receipts.', 'The hosted product monetizes convenience while the file formats stay open.'],
  ['4 · Open the format market', 'Stabilize the SDK, conformance service, registry, and third-party live-renderer sandbox.', 'Independent teams can add little apps without forking the core language.'],
  ['5 · Standardize carefully', 'Move governance to a public RFC process after real files and multiple implementations exist.', 'The standard follows demonstrated portability instead of committee imagination.'],
];

const domainRanking: Row[] = [
  ['markdownto.ai', 'Winner · primary brand', 'Immediately explains the verb, matches the agent-native wedge, and reads naturally in prose: “render it with Markdown To.”'],
  ['markdownto.io', 'Buy · defensive redirect', 'The clearest non-AI fallback and valuable if the project grows into general developer infrastructure.'],
  ['mdto.ai', 'Buy · short surface', 'Excellent for the CLI package, short links, or an API host, but too opaque to introduce the category alone.'],
  ['mdto.io', 'Optional · defensive', 'Neat and compact, but offers the least incremental brand value if the other three are secured.'],
];

export function MarkdownToDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="editorial-rule mb-4 pb-3 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
        RFC 0001 — the format, compiler, renderers, agent surface, and adoption path
      </h2>

      <div className="markdown-to-rfc overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-night)] text-[color:var(--color-paper)]">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-yellow)]">
              Working proposal · core 0.1
            </div>
            <h3 className="display mt-4 text-4xl leading-[0.98] sm:text-5xl">
              Markdown is already the source.
              <span className="block text-[color:var(--color-orange)]">Give it a stable runtime.</span>
            </h3>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-[#ddd6ea]">
              Markdown To should not be another clever Markdown dialect or a promise that one file becomes every
              artifact. It should be a family of small, strict application formats, a typed intermediate
              representation, and live renderers that always give the state back as readable Markdown.
            </p>
          </div>
          <div className="grid grid-cols-2 border border-white/20">
            {[
              ['1', 'canonical source'],
              ['8', 'starter formats'],
              ['50+', 'little app ideas'],
              ['0', 'implicit code runs'],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`p-5 ${index % 2 === 0 ? 'border-r border-white/20' : ''} ${
                  index < 2 ? 'border-b border-white/20' : ''
                }`}
              >
                <div className="display text-4xl text-[color:var(--color-yellow)]">{value}</div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#b9b2c7]">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="markdown-to-flow border-t border-white/20 bg-white/5 px-6 py-4 sm:px-8">
          {['Markdown source', 'Typed JSON IR', 'Format', 'Live app', 'Source patch'].map((step, index) => (
            <span key={step} className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.15em] text-[#c8c1d3]">
              <span className={index === 1 ? 'markdown-to-pulse text-[color:var(--color-mint)]' : ''}>{step}</span>
              {index < 4 && <span className="mx-3 text-[color:var(--color-orange)]">→</span>}
            </span>
          ))}
        </div>
      </div>

      <SubLabel>1 · The product boundary</SubLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ['The source', 'A portable .md file that remains readable, editable, diffable, ownable, and useful when Markdown To disappears.'],
          ['The formats', 'Kanban, audio, trip, form, and other versioned contracts turn familiar Markdown structures into typed app state.'],
          ['The product', 'A compiler, live-renderer registry, local tools, and optional hosted apps—not a proprietary editor or new file prison.'],
        ].map(([title, body], index) => (
          <div
            key={title}
            className={`markdown-to-reveal border-t-4 p-5 ${
              index === 0
                ? 'border-[color:var(--color-yellow)] bg-[color:var(--color-yellow)]/30'
                : index === 1
                  ? 'border-[color:var(--color-mint)] bg-[color:var(--color-mint)]/25'
                  : 'border-[color:var(--color-orange)] bg-[color:var(--color-orange)]/15'
            }`}
          >
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-l-4 border-[color:var(--color-accent)] bg-[#fffaf0] p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">Non-goal</div>
        <p className="mt-2 text-[15px] leading-[1.7] text-[color:var(--color-ink)]">
          Do not compete with Pandoc on the number of file extensions it can emit, with MDX on arbitrary component
          execution, or with Mermaid on diagram syntax. The opening is <strong>portable live software with a legible
          file underneath</strong>: a Kanban file opens as a board, changes as a board, and downloads as Markdown.
        </p>
      </div>

      <SubLabel>2 · What already exists—and the actual opening</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        This is a synthesis, not a claim that nobody has made Markdown interactive before. Nearly every individual
        move has precedent: Markdown-backed boards, text-defined timelines, component-aware Markdown, universal
        publishing, document narration, and agent-accessible file tools. Two projects come especially close.
        Adaptive Markdown treats the document as a programmable app; Kanbaruu treats Markdown project state as a
        shared surface for humans and agents.
      </p>
      <div className="mt-5 overflow-hidden border-y border-[color:var(--color-ink)]">
        {priorArt.map((product, index) => (
          <div
            key={product.name}
            className={`markdown-to-row grid gap-3 py-5 sm:grid-cols-[0.22fr_0.35fr_0.43fr] ${
              index ? 'border-t border-[color:var(--color-rule)]' : ''
            }`}
          >
            <a
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[color:var(--color-accent)] underline decoration-[color:var(--color-rule)] underline-offset-4 hover:decoration-[color:var(--color-accent)]"
            >
              {product.name} ↗
            </a>
            <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]">{product.overlap}</p>
            <p className="text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{product.opening}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-l-4 border-[color:var(--color-orange)] bg-[color:var(--color-lilac)]/30 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
          Honest novelty claim
        </div>
        <p className="mt-2 text-[15px] leading-[1.7] text-[color:var(--color-ink)]">
          “Markdown to Kanban” is not new. “Markdown becomes an app” is not entirely new either. The credible opening
          is a <strong>public registry of versioned, declarative application formats</strong>, a shared IR and mutation
          protocol, conformance tests, multiple interchangeable renderers per format, and agent-native discovery
          across the whole ecosystem. Kanban should be the reference implementation, not the novelty claim.
        </p>
      </div>

      <SubLabel>3 · The canonical file</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        The safest design is deliberately boring. Start with CommonMark/GFM, add a frontmatter envelope, and make a
        named application format responsible for semantics. A live renderer must never use an LLM to guess which
        heading is a Kanban column. Agents may help authors repair a file, but conforming compilation and
        serialization are deterministic.
      </p>
      <CodeBlock language="launch.kanban.md · kanban@0.1" code={kanbanExample} />
      <div className="mt-5 overflow-hidden border border-[color:var(--color-rule)] bg-[#fffaf0]">
        {coreRules.map(([label, rule, reason], index) => (
          <div
            key={label}
            className={`markdown-to-row grid gap-2 p-4 sm:grid-cols-[0.18fr_0.39fr_0.43fr] ${
              index ? 'border-t border-[color:var(--color-rule)]' : ''
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-accent)]">{label}</div>
            <div className="text-[14px] leading-[1.6] text-[color:var(--color-ink)]">{rule}</div>
            <div className="text-[14px] leading-[1.6] text-[color:var(--color-ink-soft)]">{reason}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-px overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] lg:grid-cols-3">
        <div className="bg-[color:var(--color-yellow)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">Markdown at rest</div>
          <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            Best for people and agents to author, review, diff, annotate, version, email, and keep after the service is
            gone. It is the portable source artifact and downloadable state snapshot.
          </p>
        </div>
        <div className="bg-[color:var(--color-mint)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">JSON in motion</div>
          <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            Best for unambiguous types, nested state, JSON Schema validation, renderer APIs, semantic patches, and
            conformance tests. It is the compiler IR, not the artifact users must love.
          </p>
        </div>
        <div className="bg-[color:var(--color-lilac)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">A log when necessary</div>
          <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            Concurrent edits, form submissions, analytics, and long histories should use an append-only log or
            database. The .md file stays the canonical definition or exportable snapshot—not a pretend high-write DB.
          </p>
        </div>
      </div>
      <p className="mt-4 text-[14px] leading-[1.65] text-[color:var(--color-ink-mute)]">
        So: JSON is technically better for the runtime, but worse as the product’s soul. The distinctive architecture
        is <strong>Markdown outside, typed JSON inside</strong>, with a strict, tested serializer in both directions.
      </p>

      <SubLabel>4 · The compiler contract</SubLabel>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-[color:var(--color-ink)] bg-[color:var(--color-night)] p-5 text-[color:var(--color-paper)]">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-yellow)]">
            Deterministic pipeline
          </div>
          <ol className="mt-5 grid gap-4">
            {[
              ['01', 'Parse', 'Read frontmatter and the Markdown AST while retaining byte offsets and source locations.'],
              ['02', 'Resolve', 'Load the named format, local assets, ids, and internal relations under declared permissions.'],
              ['03', 'Validate', 'Check core grammar, format schema, references, live-renderer capabilities, and safety constraints.'],
              ['04', 'Normalize', 'Emit typed JSON IR: exact application state, source positions, assets, diagnostics, and provenance.'],
              ['05', 'Open', 'Pass immutable IR to the one live app registered for that format; never let the UI reinterpret source.'],
              ['06', 'Write back', 'Translate typed UI mutations into minimal Markdown patches and issue a content-addressed receipt.'],
            ].map(([number, title, body]) => (
              <li key={number} className="grid grid-cols-[2.2rem_1fr] gap-3">
                <div className="font-mono text-[10px] text-[color:var(--color-orange)]">{number}</div>
                <div>
                  <div className="font-medium text-white">{title}</div>
                  <p className="mt-1 text-[14px] leading-[1.6] text-[#c9c2d2]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <CodeBlock language="canonical IR · abbreviated" code={irExample} />
      </div>

      <SubLabel>5 · Formats, not one universal schema</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        “Anything” cannot mean one giant schema, and one file does not need to become every app. The core knows
        documents, assets, ids, references, permissions, source locations, and provenance. A named format adds one
        domain model and one primary live-app contract. Extensions may add features, but never silently change the
        file’s fundamental application type.
      </p>
      <SpecTable headings={['Format', 'Canonical state', 'Live experience']} rows={formatMatrix} />

      <SubLabel>6 · Two extension axes: formats and renderers</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        The ecosystem becomes genuinely extensible only if it separates <strong>what a file means</strong> from
        <strong> how that meaning is presented</strong>. A format package owns grammar, schema, normalization,
        migrations, and semantic source patches. A renderer package consumes the format’s canonical IR and declares
        exactly which views and mutations it supports. They version independently.
      </p>
      <div className="mt-5 overflow-hidden border border-[color:var(--color-ink)] bg-[#fffaf0] p-5 sm:p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
          One contract, many experiences
        </div>
        <div className="mt-5 grid gap-3 text-center font-mono text-[10px] uppercase tracking-[0.13em] lg:grid-cols-[0.9fr_auto_1.1fr_auto_1.1fr] lg:items-center">
          <div className="border border-[color:var(--color-rule)] bg-[color:var(--color-yellow)]/45 p-4">
            launch.md
            <br />
            <span className="normal-case tracking-normal text-[color:var(--color-ink-mute)]">kanban@1 source</span>
          </div>
          <div className="text-[color:var(--color-orange)]">→</div>
          <div className="border border-[color:var(--color-rule)] bg-[color:var(--color-mint)]/30 p-4">
            Format package
            <br />
            <span className="normal-case tracking-normal text-[color:var(--color-ink-mute)]">
              parse · validate · IR · patch
            </span>
          </div>
          <div className="text-[color:var(--color-orange)]">→</div>
          <div className="grid gap-px border border-[color:var(--color-rule)] bg-[color:var(--color-rule)]">
            {['Reference board', 'Accessible list', 'Compact mobile', 'Premium team board'].map((renderer) => (
              <div key={renderer} className="bg-[color:var(--color-lilac)]/35 px-3 py-2">
                {renderer}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-[13px] leading-[1.65] text-[color:var(--color-ink-mute)]">
          Every renderer receives the same typed state and emits the same semantic mutation vocabulary. Visual
          invention is welcome; reinterpretation of the file is not.
        </p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-px overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-ink)]">
          {[
            ['Format SDK', 'Scaffold a namespaced format; define grammar, schema, IR mapping, mutations, migrations, fixtures, and machine-readable docs.'],
            ['Renderer SDK', 'Build against typed IR; declare accepted versions, read/write capabilities, runtime permissions, exports, and UI entrypoints.'],
            ['Test harness', 'Run golden documents, invalid fixtures, accessibility checks, unknown-field preservation, and round-trip source assertions locally.'],
            ['Registry client', 'Sign, publish, resolve, install, pin, audit, deprecate, and mirror immutable packages from CLI, MCP, or code.'],
          ].map(([title, body]) => (
            <div key={title} className="bg-[#fffaf0] p-4">
              <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
              <p className="mt-2 text-[14px] leading-[1.6] text-[color:var(--color-ink-soft)]">{body}</p>
            </div>
          ))}
        </div>
        <CodeBlock language="conceptual extension SDK" code={sdkExample} />
      </div>

      <SubLabel>7 · An open registry with a curated marketplace</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        A registry and a marketplace should be related but not identical. The registry is open infrastructure:
        immutable package metadata, namespaces, signatures, compatibility ranges, deprecations, and conformance
        evidence. The marketplace is the discovery and commercial layer: demos, screenshots, hosted installation,
        pricing, support, verified badges, and usage analytics. A package must remain installable without buying
        placement or using Markdown To’s cloud.
      </p>
      <SpecTable headings={['Artifact', 'Required contract', 'Ecosystem role']} rows={marketplaceContracts} />
      <div className="mt-5 grid gap-px overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] sm:grid-cols-3">
        {[
          [
            'Formats create interoperability',
            'A community format can become a shared public good. Stable formats need open specs, permissive reference code, fixtures, migrations, and governance that no renderer vendor controls.',
          ],
          [
            'Renderers create competition',
            'Several free or paid renderers can serve one format: mobile, accessible, enterprise, playful, offline, or domain-specific—without forcing users to migrate their files.',
          ],
          [
            'Services create revenue',
            'Developers can charge for hosted renderers, collaboration, premium themes, specialist exports, TTS, storage, support, or compute. The portable source remains free to leave.',
          ],
        ].map(([title, body], index) => (
          <div
            key={title}
            className={`p-5 ${
              index === 0
                ? 'bg-[color:var(--color-yellow)]'
                : index === 1
                  ? 'bg-[color:var(--color-mint)]'
                  : 'bg-[color:var(--color-lilac)]'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em]">{title}</div>
            <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border-l-4 border-[color:var(--color-accent)] bg-[#fffaf0] p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
          Marketplace rule
        </div>
        <p className="mt-2 text-[15px] leading-[1.7] text-[color:var(--color-ink)]">
          Paid popularity must never redefine a canonical format. Official semantics change through versioned RFCs
          and fixtures; marketplace ranking only helps users choose among implementations. Start curated for safety,
          keep the underlying registry mirrorable, and require sandboxing plus explicit permission review before any
          third-party renderer runs.
        </p>
      </div>

      <SubLabel>8 · The little-app universe</SubLabel>
      <div className="grid gap-px overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] sm:grid-cols-2">
        {formatFamilies.map((family) => (
          <div key={family.label} className="markdown-to-reveal bg-[#fffaf0] p-5 last:sm:col-span-2">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: family.accent }} />
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink)]">{family.label}</h4>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[14px] leading-6 text-[color:var(--color-ink-soft)]">
              {family.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] leading-[1.65] text-[color:var(--color-ink-mute)]">
        Not every idea deserves a formal format. A good candidate has meaningful structure, benefits from direct
        manipulation, serializes cleanly, and remains useful as raw text. Kanban, audio, trips, forms, flashcards,
        budgets, recipes, brackets, incidents, and branching stories clear that bar in very different ways.
      </p>

      <SubLabel>9 · Rich UI must round-trip safely</SubLabel>
      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-[color:var(--color-yellow)]/35 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            Source-of-truth rule
          </div>
          <h4 className="display mt-3 text-3xl leading-tight">The UI may edit the file. It may never replace it.</h4>
          <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            Dragging a task from Doing to Done emits a semantic patch against a stable id and expected source hash. The
            compiler maps it to the smallest Markdown edit. If the source changed, the patch conflicts visibly instead
            of overwriting the file. Renderers that cannot meet this bar are read-only.
          </p>
        </div>
        <CodeBlock language="semantic patch → minimal Markdown diff" code={patchExample} />
      </div>

      <SubLabel>10 · Markdown to audio is a real paid product</SubLabel>
      <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
        <div>
          <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
            Audio is more than an exporter because high-quality TTS has variable cost and a real production loop. An
            <code> audio@0.1</code> file should express the manuscript and the editorial direction: chapter boundaries,
            excluded notes, pronunciations, pauses, voice style, pace, and export preferences. The live app provides
            auditions, a transparent estimate, sentence previews, section-level regeneration, and a final quality
            check before charging.
          </p>
          <div className="mt-5 bg-[color:var(--color-mint)]/25 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Paid workflow
            </div>
            <ol className="mt-4 grid gap-3">
              {[
                'Validate manuscript and compute narratable characters.',
                'Preview several premium voices on representative passages.',
                'Show duration, model tier, regeneration allowance, and total fee.',
                'Generate chapter-by-chapter with word timings and resumable jobs.',
                'Review or regenerate only the sections that sound wrong.',
                'Deliver MP3, M4B, captions, private podcast RSS, and the source .md.',
              ].map((item, index) => (
                <li key={item} className="grid grid-cols-[1.8rem_1fr] gap-2 text-[14px] leading-[1.6] text-[color:var(--color-ink-soft)]">
                  <span className="font-mono text-[10px] text-[color:var(--color-orange)]">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <CodeBlock language="field-notes.audio.md · audio@0.1" code={audioExample} />
      </div>
      <p className="mt-4 text-[14px] leading-[1.65] text-[color:var(--color-ink-mute)]">
        The business model can be simple: charge the underlying generation cost plus a visible service margin, with
        separate fees for premium voices, long-form mastering, or hosted private feeds. Cache every approved section
        by source hash so a typo in chapter four never forces the customer to repay for the whole book.
      </p>

      <SubLabel>11 · Agent-native by construction</SubLabel>
      <p className="max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        The website is for human understanding; the spec package is for machines. Agents should be able to discover
        the current grammar, fetch only the selected format, scaffold a valid example, run deterministic validation,
        and receive line-level repair hints. The docs should publish versioned Markdown, JSON Schema, conformance
        fixtures, an <code>llms.txt</code>, and a small <code>SKILL.md</code> rather than expecting an agent to scrape a
        visual documentation site.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock language="CLI" code={cliExample} />
        <CodeBlock language="MCP · conceptual tools" code={mcpExample} />
      </div>
      <SpecTable headings={['MCP tool', 'Input', 'Contract']} rows={mcpTools} />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ['CLI', 'The deterministic local path for humans, scripts, CI, and agents that can run commands.'],
          ['MCP', 'The structured tool path for local and hosted harnesses; both surfaces call the same core.'],
          ['Plugins + skills', 'Thin harness adapters that teach when to inspect, scaffold, validate, repair, render, and publish.'],
        ].map(([title, body]) => (
          <div key={title} className="border-l-2 border-[color:var(--color-accent)] pl-4">
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <p className="mt-2 text-[14px] leading-[1.6] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>12 · Reference implementation</SubLabel>
      <SpecTable headings={['Package', 'Responsibility', 'Boundary']} rows={packages} />
      <div className="mt-5 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
          Hosted architecture
        </div>
        <div className="mt-5 grid gap-2 text-center font-mono text-[10px] uppercase tracking-[0.13em] sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="border border-[color:var(--color-rule)] p-4">Upload or git source<br /><span className="normal-case tracking-normal text-[color:var(--color-ink-mute)]">source + assets + policy</span></div>
          <div className="text-[color:var(--color-orange)]">→</div>
          <div className="border border-[color:var(--color-rule)] bg-[color:var(--color-lilac)]/35 p-4">Sandboxed build worker<br /><span className="normal-case tracking-normal text-[color:var(--color-ink-mute)]">core + format + renderer</span></div>
          <div className="text-[color:var(--color-orange)]">→</div>
          <div className="border border-[color:var(--color-rule)] p-4">Immutable artifact<br /><span className="normal-case tracking-normal text-[color:var(--color-ink-mute)]">output + receipt + version</span></div>
        </div>
      </div>

      <SubLabel>13 · Conformance and versioning</SubLabel>
      <SpecTable headings={['Level', 'Must prove', 'Meaning']} rows={conformanceLevels} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="bg-[color:var(--color-mint)]/25 p-5">
          <div className="font-medium">Version the layers separately</div>
          <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            Core syntax, application formats, and renderers have independent semantic versions. A file pins its core
            and format; a build receipt pins every implementation. Migrations are explicit source transforms with
            diffs.
          </p>
        </div>
        <div className="bg-[color:var(--color-lilac)]/35 p-5">
          <div className="font-medium">Make failure useful</div>
          <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            Diagnostics carry code, severity, line, column, format rule, suggested repair, and app impact.
            “Valid core, invalid for Kanban because T-003 has no stable id” is better than either a crash or a guess.
          </p>
        </div>
      </div>

      <SubLabel>14 · Security is part of the format</SubLabel>
      <SpecTable headings={['Rule', 'Required behavior', 'Why']} rows={securityRules} />

      <SubLabel>15 · Naming and domains</SubLabel>
      <div className="border-l-4 border-[color:var(--color-orange)] bg-[color:var(--color-yellow)]/45 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">Recommendation</div>
        <h4 className="display mt-3 text-3xl leading-tight sm:text-4xl">
          Brand it <span className="text-[color:var(--color-accent)]">Markdown To</span>. Lead with markdownto.ai.
        </h4>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          The working phrase “Markdown 2” captures the ambition, but markdown2.com is already an active, unrelated
          rich-document converter. “Markdown To” preserves the sound and turns the brand into a verb while avoiding
          a confusing collision. The spelled-out domain also teaches the product before the visitor clicks.
        </p>
      </div>
      <div className="mt-5">
        <SpecTable headings={['Domain', 'Call', 'Reason']} rows={domainRanking} />
      </div>
      <p className="mt-4 text-[14px] leading-[1.65] text-[color:var(--color-ink-mute)]">
        If all four are inexpensive, buying all four is reasonable. The meaningful bundle is
        <strong> markdownto.ai + markdownto.io + mdto.ai</strong>; the first is the brand, the second is durable
        developer-category insurance, and the third is the compact machine-facing alias.
      </p>

      <SubLabel>16 · Adoption and business model</SubLabel>
      <div className="grid gap-px overflow-hidden border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] lg:grid-cols-3">
        {[
          ['Open forever', 'Grammar, formats, IR, schemas, fixtures, core parser, CLI validation, renderer SDK, and conformance tests. Adoption dies if meaning requires an account.'],
          ['Paid convenience', 'Private apps, custom domains, version history, collaboration, themes, high-quality TTS, build minutes, API volume, and access controls.'],
          ['Ecosystem upside', 'Verified renderer marketplace, hosted enterprise registries, governance support, compatibility certification, and renderer analytics.'],
        ].map(([title, body], index) => (
          <div key={title} className={`p-5 ${index === 0 ? 'bg-[color:var(--color-yellow)]' : index === 1 ? 'bg-[color:var(--color-mint)]' : 'bg-[color:var(--color-lilac)]'}`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em]">{title}</div>
            <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 max-w-prose text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        The wedge is agents, because agents already prefer files and can adopt a convention faster than people learn a
        new editor. The long-term beneficiary is everyone: a human can inspect what an agent made, edit it in any text
        tool, render it elsewhere, and leave with the source.
      </p>

      <SubLabel>17 · A build sequence that earns the word “standard”</SubLabel>
      <div className="overflow-hidden border border-[color:var(--color-rule)] bg-[#fffaf0]">
        {phases.map(([phase, work, exit], index) => (
          <div
            key={phase}
            className={`markdown-to-row grid gap-2 p-4 sm:grid-cols-[0.23fr_0.39fr_0.38fr] ${
              index ? 'border-t border-[color:var(--color-rule)]' : ''
            }`}
          >
            <div className="font-medium text-[color:var(--color-ink)]">{phase}</div>
            <div className="text-[14px] leading-[1.6] text-[color:var(--color-ink-soft)]">{work}</div>
            <div className="text-[14px] leading-[1.6] text-[color:var(--color-accent)]">{exit}</div>
          </div>
        ))}
      </div>

      <SubLabel>18 · Decisions this RFC should force</SubLabel>
      <ol className="grid gap-3">
        {[
          'Is GFM the required portable subset, or does the core formally target CommonMark and describe GFM as a bundled extension?',
          'Should one file have exactly one application format, or can a controlled extension mechanism avoid ambiguous semantics?',
          'Which typed escape hatch is least damaging to readability: fenced YAML, fenced JSON, or format-specific Markdown structures only?',
          'After Kanban and audio, which format best proves the family without turning the roadmap into a novelty catalog?',
          'What is the minimum semantic-patch protocol that makes Kanban and calendar editing safe across concurrent source changes?',
          'Who can publish an official format, and when does an experimental format earn a stable namespace?',
          'Which format and renderer extension points belong in the SDK without allowing packages to bypass the core safety model?',
          'Should the open registry accept any signed package while the hosted marketplace remains curated, or must both apply the same admission rules?',
          'Can a renderer be conforming if it silently drops supported fields, or must every loss be surfaced in diagnostics and the build receipt?',
          'How much of the hosted product can be proprietary without making the standard feel like a funnel into one vendor?',
        ].map((question, index) => (
          <li key={question} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-[color:var(--color-rule)] py-4">
            <span className="font-mono text-[10px] text-[color:var(--color-orange)]">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-10 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
      {children}
    </h3>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-sm border border-[#34313d] bg-[#171717] text-[#f6f2ea]">
      <div className="flex items-center justify-between border-b border-[#3b3a36] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#bdb8a8]">
        <span>{language}</span>
        <span aria-hidden>·</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.65] sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SpecTable({ headings, rows }: { headings: string[]; rows: Row[] }) {
  return (
    <div className="mt-5 overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-[color:var(--color-paper-deep)]">
          <tr>
            {headings.map((heading) => (
              <th
                key={heading}
                className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, second, third]) => (
            <tr key={first} className="markdown-to-row align-top">
              <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{first}</td>
              <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-[1.6] text-[color:var(--color-ink-soft)]">{second}</td>
              <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-[1.6] text-[color:var(--color-ink-soft)]">{third}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
