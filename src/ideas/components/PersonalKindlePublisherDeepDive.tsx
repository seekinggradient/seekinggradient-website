function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-3 mt-10">
      {children}
    </h3>
  );
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-underline text-[color:var(--color-accent)]">
      {children}
    </a>
  );
}

const decisionCards = [
  {
    label: 'Product',
    title: 'A personal press, not a chatbot.',
    body:
      'The user defines a subject, reading level, source policy, chapter length, and cadence. The product owns the continuing curriculum and produces durable, cited editions instead of one disposable answer.',
  },
  {
    label: 'Artifact',
    title: 'EPUB is the canonical output.',
    body:
      'Every run creates a portable EPUB, a source ledger, and a machine-readable manifest. Kindle delivery is one adapter; download, local libraries, and other e-readers remain first-class exits.',
  },
  {
    label: 'Trust',
    title: 'Automatic only after earned trust.',
    body:
      'The first three editions require review. A program can graduate to automatic delivery only after citation, quality, and safety gates pass consistently—and the user can return it to review mode at any time.',
  },
];

const marketSignals = [
  [
    '31% of U.S. adults',
    'reported reading an e-book in the prior year in Pew Research Center’s October 2025 survey, up from 17% in 2011.',
  ],
  [
    '42% of college graduates',
    'reported reading an e-book, a useful signal for the research, professional-learning, and self-directed-study wedge.',
  ],
  [
    'A decade-high Kindle cycle',
    'Amazon said 2023 device sales were the highest in a decade and that most purchases came from first-time Kindle owners.',
  ],
  [
    '$4–$13 per month',
    'is already an observed price band for tools that organize reading and send articles, newsletters, PDFs, and EPUBs to Kindle.',
  ],
];

const marketModel = [
  [
    'Upper funnel',
    '≈83M U.S. annual e-book readers',
    'Directional only: 341.8M people × 78.5% adults × 31% e-book readers. This is not a Kindle installed-base estimate.',
  ],
  [
    'Serviceable wedge',
    '≈0.8M–2.5M people',
    'Planning assumption that 1–3% of the upper funnel wants recurring, structured, agent-created learning material.',
  ],
  [
    'Reachable niche',
    '4K–12K paid readers',
    'A three-year scenario that reaches 0.5% of the wedge through paper explainers, professional learning, and guided study.',
  ],
  [
    'Revenue shape',
    '$0.3M–$1.0M ARR',
    'The reachable niche at $79 per year before higher-priced scholar plans. A useful small software business; not proof of a venture-scale market.',
  ],
];

const strongestUseCases = [
  [
    'Paper → explainer',
    'Upload a paper or reading list and receive a careful long-form explanation with a glossary, diagrams, source-page references, and a “where the evidence is weak” section.',
  ],
  [
    'Personal course',
    'Choose a subject such as Hinduism, economic history, or distributed systems. The product builds prerequisites and sends a sequenced chapter at the chosen cadence.',
  ],
  [
    'Work briefing as a book',
    'Bundle a week of saved documents, meeting notes, and domain news into one quiet, coherent edition rather than another notification feed.',
  ],
  [
    'Living field guide',
    'Maintain a private manual for a long project—an insurance claim, a new role, a health-research question—with dated editions and a stable source ledger.',
  ],
];

const architecture = [
  [
    'Intent and curriculum',
    'A program stores the learning goal, current level, desired voice, reading time, cadence, source rules, previous chapters, open questions, and completion criteria.',
  ],
  [
    'Source intake',
    'Uploads, URLs, feeds, and connectors become normalized source records with ownership, access, publication date, extracted text, checksum, and citation anchors.',
  ],
  [
    'Research and planning',
    'The planner proposes the next chapter from the persistent curriculum. Retrieval assembles a bounded evidence pack; no model gets an unconstrained instruction to “research everything.”',
  ],
  [
    'Evidence-bound drafting',
    'The writer produces prose and a claim ledger together. Each factual claim points to one or more source spans, and uncertainty is represented in the manuscript rather than hidden.',
  ],
  [
    'Editorial gates',
    'A separate pass checks claim support, source diversity, contradictions, sensitive-topic framing, continuity with earlier chapters, quotation limits, and reading-level fit.',
  ],
  [
    'Publication',
    'The renderer creates semantic HTML, footnotes, navigation, cover metadata, an EPUB 3 package, and a manifest. EPUBCheck or equivalent validation blocks malformed editions.',
  ],
  [
    'Delivery adapters',
    'The same artifact can be downloaded, handed to a local relay, sent through a user-authorized mailbox, or routed to a future partner API. Kindle is an adapter, not the database.',
  ],
  [
    'Feedback and state',
    'Delivery results, explicit ratings, corrections, topic requests, and completion choices update the curriculum. The system does not claim to know reading position or highlights it cannot observe.',
  ],
];

const editorialGates = [
  ['Citation coverage', 'Every externally verifiable claim has a source anchor; unsupported claims block automatic delivery.'],
  ['Source quality', 'Primary sources and supplied papers outrank summaries; mixed-quality research stays visibly labeled.'],
  ['Plurality', 'Religious, historical, political, and cultural subjects identify traditions and disagreements instead of presenting one synthetic consensus.'],
  ['Continuity', 'Names, definitions, terminology, and chapter promises remain consistent across the program.'],
  ['Rights', 'No redistribution of paywalled or copyrighted source text; quotations are limited and traceable; user uploads require a rights attestation.'],
  ['Reader fit', 'Vocabulary, assumed knowledge, chapter length, and examples match the program’s declared level.'],
  ['Format', 'Navigation, footnotes, images, headings, and metadata pass EPUB validation and a rendered-device smoke test.'],
  ['Safety', 'Medical, legal, and financial topics require stronger sourcing, conservative language, and review rather than unattended delivery.'],
];

const editionModel = [
  [
    'Daily chapter',
    'One short, immutable document. Best for habit formation, but it creates shelf clutter and should be opt-in.',
  ],
  [
    'Weekly volume',
    'The recommended default: chapters accumulate in the service and one compiled edition arrives each week with a table of contents.',
  ],
  [
    'Final book',
    'When the curriculum ends, the product emits a clean omnibus with revised transitions, consolidated notes, glossary, bibliography, and index.',
  ],
  [
    'Revision',
    'A corrected edition receives a new version and clear date. The system never assumes it can append to or silently replace a document already in the Kindle library.',
  ],
];

const deliveryReality = [
  [
    'There is no broad public Kindle ingestion API',
    'The practical path is Amazon’s personal-document workflow: an approved sender emails a supported attachment to a user’s Send-to-Kindle address, or the user uploads the file. That dependency should be treated as provisional.',
  ],
  [
    'The service is personal and rate-limited',
    'Amazon’s troubleshooting guide warns about recipient limits, email throttling, continuous bulk sending, and a personal/non-commercial-use restriction. A shared bulk sender is not a sound production architecture.',
  ],
  [
    'User-controlled delivery is the safer MVP',
    'Prefer a local companion or user-authorized mailbox that sends from the reader’s own approved address. Keep manual download and one-click Send to Kindle instructions available at every step.',
  ],
  [
    '“Accepted” is not “read”',
    'SMTP acceptance proves only that a message reached the next hop. The system can record requested, rendered, sent, accepted, failed, and user-confirmed—not device-visible or read without explicit evidence.',
  ],
  [
    'Deletion is split across two libraries',
    'Deleting an artifact in this product does not delete it from an Amazon account or device. The interface must explain that boundary and link to the correct library-management action.',
  ],
  [
    'KDP is a separate product mode',
    'Publishing to the public Kindle Store brings rights, quality, title-creation, and AI-content-disclosure obligations. It should require an explicit human publishing workflow, never run as the private pipeline’s default.',
  ],
];

const apiOperations = [
  ['POST', '/v1/programs', 'Create a durable curriculum and cadence.'],
  ['POST', '/v1/programs/:id/sources', 'Attach uploads, URLs, feeds, or source policies.'],
  ['POST', '/v1/programs/:id/runs', 'Queue the next chapter, weekly volume, or final book.'],
  ['GET', '/v1/runs/:id', 'Read planning, drafting, review, rendering, and delivery state.'],
  ['POST', '/v1/destinations', 'Register a masked download, local relay, or mailbox destination.'],
  ['POST', '/v1/deliveries/:id/retry', 'Retry an idempotent failed delivery.'],
  ['GET', '/v1/editions/:id/download', 'Download the canonical EPUB through a short-lived URL.'],
  ['POST', '/v1/editions/:id/feedback', 'Record a rating, correction, difficulty, or next-topic request.'],
];

const programRequest = `POST /v1/programs
Idempotency-Key: 8d4ee8f7-...

{
  "title": "Hinduism: foundations",
  "goal": "A plural, historically grounded introduction",
  "reader": {
    "level": "curious_beginner",
    "target_minutes": 20
  },
  "cadence": {
    "rrule": "FREQ=DAILY;BYHOUR=6",
    "timezone": "Pacific/Honolulu",
    "edition_mode": "weekly_volume"
  },
  "editorial": {
    "citations": "footnotes",
    "source_diversity_min": 3,
    "approval": "first_3_editions"
  },
  "delivery": {
    "destination_id": "dst_01J...",
    "fallback": "download"
  }
}`;

const runResponse = `{
  "id": "run_01J...",
  "program_id": "prg_01J...",
  "edition": {
    "sequence": 4,
    "kind": "chapter",
    "version": 1
  },
  "state": "awaiting_review",
  "quality": {
    "citation_coverage": 0.98,
    "source_count": 7,
    "blocking_findings": []
  },
  "artifact": {
    "media_type": "application/epub+zip",
    "checksum": "sha256:...",
    "download_url_expires_at": "2026-07-28T22:00:00Z"
  },
  "delivery": {
    "state": "not_requested",
    "destination": "a••••@kindle.com"
  }
}`;

const pricing = [
  [
    'Preview',
    '$0',
    'One manual sample, source ledger, EPUB download, no scheduled delivery.',
    'Prove the artifact before asking for a subscription.',
  ],
  [
    'Reader',
    '$9/mo · $79/yr',
    'One active program, up to 30 short chapter builds or four compiled volumes per month, standard research.',
    'The likely default for a single recurring course or paper-reading habit.',
  ],
  [
    'Scholar',
    '$19/mo · $169/yr',
    'Five programs, deeper source packs, longer paper explainers, glossary/index passes, priority rendering.',
    'For research-heavy readers who routinely turn PDFs and reading lists into books.',
  ],
  [
    'Local companion',
    '$59 one-time',
    'Local scheduling and delivery, bring-your-own model keys, EPUB archive stays on the user’s machine.',
    'A privacy and platform-risk hedge, not a crippled offline tier.',
  ],
];

const unitCosts = [
  ['Short daily chapter', '1.5K–2.5K words', '$0.03–$0.20', 'Bounded source pack, lightweight draft and verification.'],
  ['Paper explainer', '4K–8K words', '$0.15–$1.20', 'Extraction, figure handling, multiple editorial passes, richer citations.'],
  ['Deep custom volume', '15K–30K words', '$0.80–$5.00', 'Many sources, chapter continuity, index, glossary, and expensive review path.'],
  ['Render + store + deliver', 'Per edition', '<$0.03', 'EPUB build, object storage, queueing, and ordinary transactional delivery.'],
];

const launchPlan = [
  [
    '0. Concierge proof',
    'Take ten papers or reading goals from five Kindle owners. Hand-review every edition, measure whether they actually finish more, and learn which formatting errors ruin trust.',
  ],
  [
    '1. Download-first builder',
    'Ship a web form that creates a cited EPUB and source ledger. Do not automate delivery yet. Validate artifact quality, reading-time fit, and willingness to pay.',
  ],
  [
    '2. Personal delivery beta',
    'Add a local relay or user-authorized mailbox for fifty invited readers. Require review for the first three editions and measure real delivery-failure modes.',
  ],
  [
    '3. Two wedges only',
    'Market paper-to-explainer and personal-course mode. Hinduism can be an excellent dogfood curriculum, but public templates need expert review and tradition-aware sourcing.',
  ],
  [
    '4. Partner or diversify',
    'Ask Amazon for a supported commercial path while adding other e-reader and library destinations. Do not scale a fragile shared-sender workaround.',
  ],
];

const risks = [
  ['Platform', 'Amazon can throttle, suspend, or change personal-document delivery.', 'User-controlled delivery, portable EPUBs, multiple destinations, partner outreach.'],
  ['Quality', 'A fluent chapter can contain subtle factual or interpretive errors.', 'Claim ledger, diverse sources, independent editorial pass, first-three review gate.'],
  ['Rights', 'Uploaded papers and generated summaries can cross licensing boundaries.', 'Private use, rights attestation, quotation limits, provenance, no public redistribution by default.'],
  ['Clutter', 'Daily documents can turn the Kindle library into an inbox.', 'Weekly volume default, final-book compilation, predictable titles, explicit retention controls.'],
  ['Retention', 'Readers may enjoy the first book and abandon the ritual.', 'Program goals, bounded seasons, reading-time targets, pause controls, explicit next-chapter feedback.'],
  ['Cost', 'Unbounded research and frontier-model use can destroy margin.', 'Source-pack caps, model routing, plan budgets, cached extraction, visible deep-research upgrade.'],
  ['Culture', 'A generated religion course can flatten living traditions.', 'Name traditions, surface disagreement, use primary and scholarly sources, invite expert review.'],
  ['Privacy', 'The system holds reading interests, uploads, and a private delivery address.', 'Minimize retention, encrypt destinations, mask logs, short-lived downloads, local tier.'],
];

const successMetrics = [
  ['Artifact pull', 'Percentage of previews downloaded; percentage of delivered editions opened or explicitly confirmed by the reader.'],
  ['Reading habit', 'Weekly active readers, completed programs, pauses rather than silent churn, and chapters rated “right depth.”'],
  ['Trust', 'Corrections per 10K words, blocked deliveries, citation clicks, and users who graduate a program to automatic mode.'],
  ['Economics', 'Gross margin per plan, research cost per completed reading hour, support minutes per delivery, annual conversion.'],
  ['Platform health', 'Delivery acceptance, failure reasons, throttle warnings, local-relay adoption, destination concentration.'],
  ['Learning outcome', 'Optional before/after questions, reader-written summaries, and whether the next requested topic builds on the curriculum.'],
];

export function PersonalKindlePublisherDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        RFC 0.1 — a personal press for the e-reader
      </h2>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {decisionCards.map((card) => (
          <div key={card.label} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-3">
              {card.label}
            </div>
            <h3 className="display text-2xl leading-tight text-[color:var(--color-ink)]">{card.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{card.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Decision summary</SubLabel>
      <p className="text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        Build the durable publishing engine first and the Kindle convenience second. The core product contract is:
        give the system a learning intention and a source policy; receive a coherent sequence of books that can be
        inspected, downloaded, and read anywhere. Kindle makes the habit unusually good because the artifact arrives on
        a quiet device, but the company should never confuse an Amazon delivery workaround with its own product.
      </p>
      <div className="mt-5 border-l-4 border-[#ff7043] bg-[#fffaf0] px-5 py-4 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
        <strong className="text-[color:var(--color-ink)]">Non-goals for v1:</strong> public Kindle Store publishing,
        unattended books on high-stakes advice, shared subscriptions to copyrighted source material, and a chat interface
        that generates arbitrary long text without a curriculum or evidence record.
      </div>

      <SubLabel>How large is the market, honestly?</SubLabel>
      <p className="text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        Amazon does not publish a current active-Kindle installed base, so any precise “regular Kindle users” number would
        be false precision. The defensible evidence is adjacent: e-book reading is mainstream, Kindle hardware is still
        attracting first-time buyers, and power readers already pay for services that move non-book material onto e-readers.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {marketSignals.map(([figure, body]) => (
          <div key={figure} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="display text-3xl leading-tight text-[color:var(--color-ink)]">{figure}</div>
            <p className="mt-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>A scenario, not a forecast</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Layer</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Size</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Assumption</th>
            </tr>
          </thead>
          <tbody>
            {marketModel.map(([layer, size, assumption]) => (
              <tr key={layer} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{layer}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-accent)]">{size}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{assumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-mute)]">
        The upper-funnel estimate combines the U.S. Census Bureau’s July 2025 population and under-18 share with Pew’s
        2025 e-book-reading rate. It includes phones and tablets, not only e-ink readers. The wedge and conversion figures
        are explicit product-planning assumptions.
      </p>

      <SubLabel>Where the product is genuinely more useful than “send article to Kindle”</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {strongestUseCases.map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <h3 className="display text-2xl leading-tight text-[color:var(--color-ink)]">{title}</h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>System architecture</SubLabel>
      <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
        <a href="/diagrams/personal-kindle-publishing-architecture.svg" target="_blank" rel="noreferrer" className="block">
          <img
            src="/diagrams/personal-kindle-publishing-architecture.svg"
            alt="Architecture diagram for a personal publishing pipeline from learning intent through sources, curriculum, drafting, editing, EPUB publication, and e-reader delivery."
            className="w-full"
          />
        </a>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {architecture.map(([title, body], index) => (
          <div
            key={title}
            className="grid grid-cols-[2.5rem_1fr] gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-4"
          >
            <div className="font-mono text-[12px] text-[color:var(--color-accent)]">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
              <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <SubLabel>The editorial quality gate</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Gate</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Ship condition</th>
            </tr>
          </thead>
          <tbody>
            {editorialGates.map(([gate, condition]) => (
              <tr key={gate} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{gate}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubLabel>Chapters cannot be appended in place</SubLabel>
      <p className="text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        A Kindle personal document behaves like an edition, not a remotely editable document. The publishing model should
        embrace that constraint instead of faking synchronization. Every artifact is immutable, titled predictably, and
        recoverable from the service’s own shelf.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {editionModel.map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{title}</div>
            <p className="mt-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>The Kindle delivery reality</SubLabel>
      <div className="grid gap-4">
        {deliveryReality.map(([title, body], index) => (
          <div key={title} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.08fr_0.32fr_0.6fr]">
            <div className="font-mono text-[12px] text-[color:var(--color-accent)]">{String(index + 1).padStart(2, '0')}</div>
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <div className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>API surface</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Method</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Endpoint</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Contract</th>
            </tr>
          </thead>
          <tbody>
            {apiOperations.map(([method, endpoint, contract]) => (
              <tr key={endpoint} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-accent)]">{method}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-ink)]">{endpoint}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{contract}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-3">Create a program</div>
          <pre className="max-w-full overflow-x-auto border border-[color:var(--color-rule)] bg-[#17152b] p-4 text-[12px] leading-relaxed text-[#fffaf0]">
            <code>{programRequest}</code>
          </pre>
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-3">Run state</div>
          <pre className="max-w-full overflow-x-auto border border-[color:var(--color-rule)] bg-[#17152b] p-4 text-[12px] leading-relaxed text-[#fffaf0]">
            <code>{runResponse}</code>
          </pre>
        </div>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)]">
        Every mutating request accepts an idempotency key. Delivery destinations are encrypted and returned only in masked
        form. Webhooks use states such as <code>edition.ready</code>, <code>delivery.accepted</code>,{' '}
        <code>delivery.failed</code>, and <code>edition.corrected</code>; there is deliberately no invented “read” event.
      </p>

      <SubLabel>Pricing and packaging</SubLabel>
      <div className="grid gap-4 md:grid-cols-2">
        {pricing.map(([name, price, includes, thesis]) => (
          <div key={name} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="display text-3xl leading-tight text-[color:var(--color-ink)]">{name}</h3>
              <span className="font-mono text-[13px] text-[color:var(--color-accent)]">{price}</span>
            </div>
            <p className="mt-4 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{includes}</p>
            <p className="mt-3 border-t border-[color:var(--color-rule)] pt-3 text-[13px] leading-[1.6] text-[color:var(--color-ink-mute)]">{thesis}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--color-ink-mute)]">
        KTool currently anchors Kindle-specific utility around $6.99–$10 per month, while Readwise Reader lists
        $12.99 monthly or $9.99 monthly when billed annually. A $9 entry plan is plausible, but only if deep research is
        bounded rather than quietly subsidized.
      </p>

      <SubLabel>Planning-level unit economics</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Artifact</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Output</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Variable cost</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Assumption</th>
            </tr>
          </thead>
          <tbody>
            {unitCosts.map(([artifact, output, cost, assumption]) => (
              <tr key={artifact} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{artifact}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{output}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-accent)]">{cost}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{assumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-mute)]">
        These are model-routing targets, not vendor quotes. They assume cached extraction, bounded evidence packs, and
        small-model passes for routine work. Payment fees, support, and human expert review are not included.
      </p>

      <SubLabel>Launch sequence</SubLabel>
      <div className="grid gap-4">
        {launchPlan.map(([phase, body]) => (
          <div key={phase} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.25fr_0.75fr]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{phase}</div>
            <div className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>Risk register</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[900px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Risk</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Failure</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(([risk, failure, mitigation]) => (
              <tr key={risk} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{risk}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{failure}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 leading-relaxed text-[color:var(--color-ink-soft)]">{mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubLabel>What would prove the idea</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {successMetrics.map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <p className="mt-2 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Research notes</SubLabel>
      <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        Market and platform inputs include Pew Research Center’s{' '}
        <SourceLink href="https://www.pewresearch.org/short-reads/2026/04/09/americans-still-opt-for-print-books-over-digital-or-audio-versions-few-are-in-book-clubs/">
          October 2025 U.S. reading survey
        </SourceLink>
        , the U.S. Census Bureau’s{' '}
        <SourceLink href="https://www.census.gov/quickfacts/fact/table/US/PST045217">
          2025 population estimate
        </SourceLink>
        , Amazon’s{' '}
        <SourceLink href="https://press.aboutamazon.com/2024/10/amazon-launches-entirely-new-kindle-lineup-including-reimagined-kindle-scribe-and-first-ever-color-kindle">
          Kindle sales signal
        </SourceLink>
        , Amazon’s official notes on{' '}
        <SourceLink href="https://digprjsurvey.amazon.com/csad/help/node/TCUBEdEkbIhK07ysFu">
          supported Send to Kindle files
        </SourceLink>
        {' '}and{' '}
        <SourceLink href="https://digprjsurvey.amazon.co.uk/csad/help/node/T48rsVm3gY7KeGkKUk">
          delivery errors and throttling
        </SourceLink>
        , KTool’s{' '}
        <SourceLink href="https://ktool.io/pricing">Kindle utility pricing</SourceLink>
        , Readwise Reader’s{' '}
        <SourceLink href="https://readwise.io/read/">pricing and Kindle delivery feature</SourceLink>
        , and Amazon KDP’s{' '}
        <SourceLink href="https://kdp.amazon.com/en_US/help/topic/G200672390">
          AI-content and rights guidance
        </SourceLink>
        .
      </p>
    </section>
  );
}
