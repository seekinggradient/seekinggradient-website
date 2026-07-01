import { Link } from 'react-router-dom';

type DiagramProps = {
  src: string;
  title: string;
  caption: string;
  alt: string;
};

function Diagram({ src, title, caption, alt }: DiagramProps) {
  return (
    <figure className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
      <a href={src} target="_blank" rel="noreferrer" className="block">
        <img src={src} alt={alt} className="w-full rounded-sm border border-[color:var(--color-rule)]" />
      </a>
      <figcaption className="pt-4 text-sm text-[color:var(--color-ink-mute)]">
        <strong className="text-[color:var(--color-ink)]">{title}</strong>
        <span className="mx-2 text-[color:var(--color-rule)]">/</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-3 mt-10">
      {children}
    </h3>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4 border border-[color:var(--color-rule)] bg-[#1a1a1a] text-[#f6f2ea] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#bdb8a8] border-b border-[#3b3a36] font-mono">
        <span>{language}</span>
        <span aria-hidden>·</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.65] font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[color:var(--color-accent)] link-underline"
    >
      {children}
    </a>
  );
}

const captureEventSchema = `{
  "schema": "capev/1",
  "id": "<uuidv7, time-ordered>",
  "ts": "2026-06-30T14:03:11.482Z",
  "kind": "focus | selection | navigation | screen_ocr | highlight",
  "sensor": "browser_dom | macos_ax | macos_ocr | hotkey",
  "fidelity": "dom | ax | ocr",
  "intent": "ambient | highlight",
  "source": {
    "app_bundle_id": "com.google.Chrome",
    "window_title": "How BM25 works",
    "url": "https://example.com/bm25",
    "url_source": "dom | axurl | applescript | null",
    "surface": "web | native | electron | canvas | pdf | unknown"
  },
  "content": { "text": "...", "text_role": "main | selection | ocr_block" },
  "anchor": {
    "kind": "textquote | ax_range | bbox",
    "exact": "...", "prefix": "~32 chars", "suffix": "~32 chars",
    "bbox_norm": [0.11, 0.42, 0.30, 0.04], "scroll_ratio": 0.42
  },
  "note": "<optional one-line user note>",
  "hashes": { "frame_phash": "<ocr only>", "text_simhash": "<64-bit>" },
  "privacy": { "secure_input_active": false, "redactions": [] }
}`;

const noteFormat = `---
description: BM25 — lexical ranking, term frequency saturation, why it is not semantic
sources:
  - "Read 2026-06-30 — highlighted \\"BM25 is a bag-of-words ranking function\\"
     from How BM25 works (https://example.com/bm25) · DOM selection"
  - "Read 2026-06-30 — Notes.app draft \\"retrieval\\" · AX selection"
---

# BM25

Lexical ranking function over term frequency and inverse document
frequency, with a saturation term (k1) and length normalization (b)...

## Highlights
> BM25 is a bag-of-words ranking function        [[how-bm25-works]]
Your note: contrast with embedding retrieval when I write the RAG section.`;

const phases = [
  {
    phase: 'Phase 0 — foundations',
    effort: '1–1.5 wk',
    body:
      'A Developer ID-signed macOS app running as a LaunchAgent (never a headless daemon), TCC permission onboarding, an encrypted SQLite + FTS5 store, and a menu-bar indicator with one-click pause.',
  },
  {
    phase: 'Phase 1 — browser extension',
    effort: '3–4 wk',
    body:
      'The DOM rung: a Manifest V3 extension that saves readable page text, anchors highlights with three selectors, renders them with the Custom Highlight API, and posts events to the local host. "Save every page + attach a note" lands about a week in.',
  },
  {
    phase: 'Phase 2 — hotkey + AX sensor',
    effort: '1.5–2 wk',
    body:
      'A global highlight hotkey resolved across DOM and accessibility text, native-app capture via AXObserver, plus secure-field skip and a Secure-Input pause. Still no screen recording.',
  },
  {
    phase: 'Phase 3 — distiller → notes',
    effort: '2–3 wk',
    body:
      'The compounding memory: an agentic LLM job clusters events into cited, atomic notes committed to the store, with data-loss prevention at ingest and a retention/decay job. This closes the loop to the read side.',
  },
  {
    phase: 'Phase 4 — screen OCR fallback',
    effort: '2–2.5 wk',
    body:
      'ScreenCaptureKit + Vision for everything accessibility cannot see. Event-driven capture, perceptual-hash dedup, and delete-frame-after-extract. The heaviest, most performance-sensitive phase.',
  },
  {
    phase: 'Phase 5 — hardening + passive',
    effort: '2–3 wk',
    body:
      'The full denylist wired into every sensor, granular delete and one-click wipe, and per-app continuous capture as an earned opt-in. Optional audio meeting-mode is a deliberate last step.',
  },
];

export function AmbientKnowledgeDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        Deep dive — the capture side and the knowledge loop
      </h2>

      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          This deep dive works through the half of the idea the original sketch left implicit. A
          companion that surfaces context while you write is only useful if the substrate it reads
          from is already rich. Usually it is not. The deeper move is to close a loop: let the same
          attention that produces notes also feed the knowledge base, so the agent grows the same
          context its owner has and never loses the thread of what they were doing.
        </p>
        <p>
          The raw material is what you read and, above all, what you highlight. A highlight is you
          telling the system, in one gesture, "this mattered". Framed this way the capture surface
          is not one app — it is a small layer of sensors that feed a personal, portable knowledge
          store, which a distilling agent turns into cited notes. That store is the same shape as a{' '}
          <Link to="/agentsfs" className="text-[color:var(--color-accent)] link-underline">
            portable agent filesystem
          </Link>
          , and the writing companion is simply its read end.
        </p>
      </div>

      <SubLabel>The loop</SubLabel>
      <div className="grid gap-6 mb-2">
        <Diagram
          src="/diagrams/ambient-knowledge-loop.svg"
          title="Read in, surface out"
          caption="A capture write-path feeds one store; a distilling agent turns events into cited notes; a read-path surfaces them while you write."
          alt="Loop diagram with a capture write-path on the left, a personal knowledge store in the middle, a surfacing read-path on the right, and a dashed return arrow closing the loop."
        />
      </div>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Highlights and notes are the salience layer; captured page content is the substrate. The
          distiller weights them accordingly, and because it emits small cited notes rather than
          page dumps, the read side stays quiet and source-backed — exactly the affordance the
          original idea asked for.
        </p>
      </div>

      <SubLabel>Capture is a multi-sensor layer</SubLabel>
      <div className="grid gap-6 mb-2">
        <Diagram
          src="/diagrams/ambient-knowledge-capture-ladder.svg"
          title="A fidelity ladder"
          caption="For each frontmost window an arbiter takes the highest available text source and suppresses the rest, so nothing is captured twice."
          alt="Ladder diagram: a frontmost window feeds an arbiter that chooses between DOM, accessibility text, and screen OCR, all normalized into one event."
        />
      </div>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Reading is not confined to the browser, so capture should not be either. Think of every
          on-screen surface as able to give up text at some rung, and always take the highest one
          available: the DOM when you are in a browser, accessibility text for native apps, and OCR
          for everything that exposes neither. A small arbiter picks the best rung for the frontmost
          window and suppresses the others. This is what lets the browser extension and a
          whole-screen observer coexist rather than compete.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-2 mb-2">
        {[
          {
            title: 'Browser extension · DOM',
            body: 'Highest fidelity: clean article text, the real canonical URL, byte-precise re-anchoring, near-zero CPU. Wins whenever you are in a supported browser.',
          },
          {
            title: 'Accessibility · AX',
            body: 'Real text straight from native apps — Notes, Mail, editors, native PDFs — with no OCR. The arbiter uses it when there is no DOM.',
          },
          {
            title: 'Screen OCR · ScreenCaptureKit + Vision',
            body: 'The universal safety net for AX-blind surfaces: Electron apps, canvas tools, image-only PDFs, screen-shared decks. Lossy, so it is the last resort.',
          },
          {
            title: 'Highlight hotkey',
            body: 'The deliberate "remember this" gesture. It resolves the same ladder (DOM, then AX, then an OCR crop) and attaches an optional one-line note.',
          },
        ].map((item) => (
          <div key={item.title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {item.title}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{item.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Two constraints that shape everything</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          First, a browser extension cannot touch the filesystem. A Manifest V3 service worker is
          sandboxed to <code>chrome.storage</code>, IndexedDB, and the network — it physically
          cannot write files. So there must be exactly one bridge: a small local host process that
          owns all disk writes, reached over Native Messaging or an authenticated{' '}
          <code>127.0.0.1</code> socket. Once you are also running a whole-screen observer, that
          observer <em>is</em> the host, and the extension simply posts to it.
        </p>
        <p>
          Second, you cannot silently turn on screen capture. ScreenCaptureKit and the Accessibility
          API are per-user permissions keyed to your code-signing identity, they need an interactive
          login session, and ad-hoc signing resets the grants on every rebuild. The practical
          consequence is to ship a signed app from day one and treat permission onboarding as a real
          feature. This is also why privacy is the substrate, not a later hardening pass — a capable
          capture tool dies on trust, not on capability.
        </p>
      </div>

      <SubLabel>Highlights that survive, sources that stay attached</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The hardest correctness problem on the browser side is anchoring a highlight so it survives
          reloads and DOM changes. Do not trust a single selector. Persist each highlight as a{' '}
          <Ext href="https://www.w3.org/TR/annotation-model/">W3C Web Annotation</Ext> with all
          three selectors — an XPath range, a text-position offset, and a fuzzy text-quote with about
          32 characters of prefix and suffix — and resolve them with a maintained library like{' '}
          <Ext href="https://annotator.apache.org/">Apache Annotator</Ext> rather than hand-rolling
          fuzzy matching (the approach{' '}
          <Ext href="https://github.com/hypothesis/client">Hypothesis</Ext> proved at scale). Render
          the result with the{' '}
          <Ext href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API">
            CSS Custom Highlight API
          </Ext>
          , which paints highlights with zero DOM mutation, so it never breaks a single-page app.
          When all three selectors fail, keep the orphan anyway — the quote, note, and URL retain
          full value even when they cannot be re-placed on the page.
        </p>
        <p>
          The screen observer has no DOM and no canonical URL, so provenance is recovered by a ladder
          of its own: a front-tab URL via scripting, then an accessibility URL, then the application
          identity plus window title, and finally an on-screen bounding box. Every field records
          where it came from, so the distiller trusts exact DOM text more than a scraped OCR block —
          and never launders OCR into a clean-looking fact. Page bodies come from{' '}
          <Ext href="https://github.com/mozilla/readability">Readability</Ext> plus{' '}
          <Ext href="https://github.com/mixmark-io/turndown">Turndown</Ext>, with a{' '}
          <Ext href="https://github.com/gildas-lormeau/SingleFile">SingleFile</Ext> snapshot as an
          optional high-fidelity tier.
        </p>
      </div>

      <SubLabel>One event the whole system speaks</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Every sensor normalizes to one capture event. Four fields carry the weight:{' '}
          <code>anchor</code> makes each note re-openable at its exact source, <code>fidelity</code>{' '}
          records whether the text is exact or OCR-dirty, <code>intent</code> flags the curated
          highlights the distiller prioritizes, and the two hashes are the dedup keys.
        </p>
      </div>
      <CodeBlock language="JSON — capev/1" code={captureEventSchema} />

      <SubLabel>The store: a self-describing knowledge filesystem</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The durable store is plain Markdown with frontmatter — small, cited, atomic notes that a
          human can read and an agent can search. Provenance is rendered from the event stream into a{' '}
          <code>sources</code> list; version control supplies timestamps; raw event ids live in a
          machine-only sidecar so the notes stay clean. Because it is just files, the read side — a
          search command, a chat over the corpus, or the writing companion itself — consumes it
          unchanged.
        </p>
      </div>
      <CodeBlock language="Markdown — a distilled note" code={noteFormat} />

      <SubLabel>Privacy is the substrate</SubLabel>
      <div className="grid gap-6 mb-2">
        <Diagram
          src="/diagrams/ambient-knowledge-privacy.svg"
          title="Deny before disk"
          caption="Sensitive content is excluded before it can be written; processing is on-device and encrypted; capture escalates only by consent."
          alt="Privacy diagram: on-screen content passes a privacy gate, is processed on-device into an encrypted store, and is captured in three escalating consent modes."
        />
      </div>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The default is semi-passive, not a firehose. The base state captures only a cheap focus
          timeline — which app and window, no body text. Body capture requires a highlight or a
          dwell; fully-passive whole-screen OCR is a per-app opt-in, never the default. You get most
          of the value from the extension, the hotkey, and accessibility text at a fraction of the
          cost and trust surface. The lessons from{' '}
          <Ext href="https://en.wikipedia.org/wiki/Windows_Recall">Windows Recall</Ext> ship as
          day-one defaults, not a later version:
        </p>
      </div>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)] list-disc pl-5 marker:text-[color:var(--color-ink-mute)]">
        <li>
          <strong className="text-[color:var(--color-ink)]">Visible and pausable.</strong> A
          menu-bar indicator and one-click pause mean the user always knows when it is recording.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Secure-field and secure-input skip.</strong>{' '}
          Password fields are never read, and system-wide secure input suspends all capture.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Deny-list whole apps.</strong> Password
          managers, banking, messaging, and health apps are excluded at every sensor — denying a
          whole app beats best-effort field filtering.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Text-only, encrypted, expiring.</strong>{' '}
          Raw frames are deleted after extraction, the store is encrypted at rest, and a retention
          job prunes old events.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Local and auditable.</strong> No cloud
          dependency, output is files the user owns, and an open-source capture core makes the
          "it is all local" claim checkable.
        </li>
      </ul>

      <SubLabel>Build plan</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Build inward-out, highest fidelity and lowest trust-cost first. Phases 0–3 are a genuinely
          useful product on their own — high-fidelity web and native capture plus the memory loop,
          with no screen recording at all. A bare "save every page and attach a note" MVP is a couple
          of weeks; the full multi-sensor system including passive OCR is roughly three to four
          months of focused solo work.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 mt-2">
        {phases.map((p) => (
          <div key={p.phase} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                {p.phase}
              </div>
              <div className="font-mono text-[11px] text-[color:var(--color-accent)] whitespace-nowrap">
                {p.effort}
              </div>
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{p.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Risks</SubLabel>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)] list-disc pl-5 marker:text-[color:var(--color-ink-mute)]">
        <li>
          <strong className="text-[color:var(--color-ink)]">Battery, not disk, gets you uninstalled.</strong>{' '}
          Continuous OCR is the CPU killer. The structural mitigation is a DOM/AX-first arbiter so OCR
          is the exception, plus event-driven capture and frame dedup.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Accessibility coverage is uneven.</strong>{' '}
          Electron and canvas surfaces expose little; the surface classifier needs real per-app
          tuning, and misdetection causes silent text loss.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">The distiller is the make-or-break.</strong>{' '}
          Turning noisy capture into correct, well-linked, non-hallucinated notes is the open-ended
          part. Every claim must carry a source traceable to an event, and version control makes each
          ingest reversible.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">The firehose dilutes signal.</strong>{' '}
          "Capture everything" adds noise and cost. Dwell thresholds, deny-lists, and canonical dedup
          keep the corpus dense, and highlights carry the real signal.
        </li>
      </ul>

      <SubLabel>References and further reading</SubLabel>
      <div className="grid gap-6 sm:grid-cols-3 mt-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-3">
            Standards and web libraries
          </div>
          <ul className="space-y-2 text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
            <li><Ext href="https://www.w3.org/TR/annotation-model/">W3C Web Annotation Data Model</Ext></li>
            <li><Ext href="https://annotator.apache.org/">Apache Annotator</Ext></li>
            <li><Ext href="https://github.com/hypothesis/client">Hypothesis client (anchoring)</Ext></li>
            <li><Ext href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API">CSS Custom Highlight API</Ext></li>
            <li><Ext href="https://github.com/mozilla/readability">Mozilla Readability</Ext></li>
            <li><Ext href="https://github.com/mixmark-io/turndown">Turndown</Ext></li>
            <li><Ext href="https://github.com/gildas-lormeau/SingleFile">SingleFile</Ext></li>
            <li><Ext href="https://wxt.dev/">WXT extension framework</Ext></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-3">
            macOS capture APIs
          </div>
          <ul className="space-y-2 text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
            <li><Ext href="https://developer.apple.com/documentation/screencapturekit">ScreenCaptureKit</Ext></li>
            <li><Ext href="https://developer.apple.com/documentation/vision/recognizing-text-in-images">Vision — recognizing text</Ext></li>
            <li><Ext href="https://developer.apple.com/documentation/applicationservices/axuielement_h">Accessibility (AXUIElement)</Ext></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-3">
            Prior art
          </div>
          <ul className="space-y-2 text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
            <li><Ext href="https://github.com/mediar-ai/screenpipe">screenpipe</Ext></li>
            <li><Ext href="https://github.com/jasonjmcghee/rem">Rem</Ext></li>
            <li><Ext href="https://en.wikipedia.org/wiki/Windows_Recall">Windows Recall (cautionary tale)</Ext></li>
            <li>
              <Link to="/agentsfs" className="text-[color:var(--color-accent)] link-underline">
                agentsfs — the portable store
              </Link>
            </li>
            <li>
              <Link to="/portable-memory-layer" className="text-[color:var(--color-accent)] link-underline">
                Portable memory layer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
