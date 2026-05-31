const mockups = [
  {
    title: 'Printable photo album + agent omnibar',
    src: '/mockups/photo-omnibar.jpg',
    note: 'Mobile-first photo curation, plus a Mac-style omnibar with screen context and streaming agent replies.',
  },
  {
    title: 'Portable memory + service business kit',
    src: '/mockups/memory-service-kit.jpg',
    note: 'A memory dashboard/workspace surface, paired with the cleaner/handyman business-in-a-box admin and booking flow.',
  },
  {
    title: 'Stock thesis pipeline + compilation video maker',
    src: '/mockups/stock-video.jpg',
    note: 'A research thesis dashboard with daily brief/audio + simulated portfolio, and a milestone video collection/editing workflow.',
  },
  {
    title: 'Visual note transcription pipeline',
    src: '/mockups/specific/visual-note-transcription.jpg',
    note: 'Patch detection, ambiguous handwriting review, and faithful Markdown output for handwritten PDFs and scans.',
  },
  {
    title: 'Again binary review network',
    src: '/mockups/specific/do-it-again-reviews.jpg',
    note: 'Experience page, cross-category search, and personal taste graph for reviews based on repeat intent.',
  },
  {
    title: 'Agent-native HTML artifacts',
    src: '/mockups/specific/agent-native-artifact-feed.png',
    note: 'A profile timeline of deployed HTML pages, cards, widgets, and private-link artifacts as one personal web surface.',
  },
  {
    title: 'Prediction-market mispricing engine',
    src: '/mockups/specific/prediction-market-mispricing.png',
    note: 'A live edge watchlist, disciplined trade-decision surface, and post-trade journal for sports event-contract research.',
  },
  {
    title: 'AI Weekly cover direction',
    src: '/mockups/specific/ai-weekly-cover-stack.jpg',
    note: 'A premium physical magazine stack that frames AI news, launches, editorials, and ads as a collectible weekly object.',
  },
  {
    title: 'AI Weekly feature spread',
    src: '/mockups/specific/ai-weekly-feature-spread.jpg',
    note: 'An interior issue structure with project rankings, trend maps, model releases, startup launches, and research highlights.',
  },
  {
    title: 'AI Weekly builder marketplace',
    src: '/mockups/specific/ai-weekly-builder-marketplace.jpg',
    note: 'A print-native ad section where AI companies would actually want launch cards, premium placements, and classifieds.',
  },
  {
    title: 'AI Weekly subscription ritual',
    src: '/mockups/specific/ai-weekly-subscription-ritual.jpg',
    note: 'A tactile desk scene that makes the magazine feel like the essential weekly briefing for AI builders and buyers.',
  },
];

const diagrams = [
  {
    title: 'Portable memory plugin architecture',
    src: '/diagrams/portable-memory-plugin-architecture.svg',
    note: 'Harness-specific plugins stay thin; the durable product is the shared memory service.',
  },
  {
    title: 'Memory read/write loop',
    src: '/diagrams/portable-memory-recall-flow.svg',
    note: 'The plugin retrieves context before work and proposes scoped writebacks after work.',
  },
  {
    title: 'Visual transcription architecture',
    src: '/diagrams/visual-note-transcription-architecture.svg',
    note: 'A patch-first document pipeline that uses OCR cheaply and escalates only the hard visual regions.',
  },
  {
    title: 'Review and escalation loop',
    src: '/diagrams/visual-note-review-loop.svg',
    note: 'Confidence scoring routes patches through OCR, small vision models, stronger models, or human correction.',
  },
  {
    title: 'Repeat-intent review loop',
    src: '/diagrams/do-it-again-review-loop.svg',
    note: 'A category-neutral yes/no vote becomes an again rate, a personal taste graph, and a recommendation signal.',
  },
  {
    title: 'Prediction-market mispricing architecture',
    src: '/mockups/specific/prediction-market-architecture.png',
    note: 'Sportsbook odds, game state, Kalshi-style order books, fair probability, edge/risk logic, execution, and backtesting.',
  },
];

export function Mockups() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--color-accent)] mb-6">
        Design Lab · First pass
      </p>
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-end border-b border-[color:var(--color-rule)] pb-12 mb-14">
        <h1 className="display text-6xl sm:text-7xl lg:text-8xl">
          Mockups and system sketches.
        </h1>
        <p className="text-lg sm:text-xl leading-8 text-[color:var(--color-ink-soft)] max-w-2xl">
          Initial visual boards for the ideas, plus architecture diagrams for the more systems-heavy concepts. These are exploratory artifacts: useful for taste, framing, and product direction — not final UI specs.
        </p>
      </div>

      <section className="mb-20">
        <div className="flex items-baseline justify-between gap-6 mb-8">
          <h2 className="display text-4xl sm:text-5xl">Product mockup boards</h2>
          <span className="font-mono text-xs text-[color:var(--color-ink-mute)]">11 boards · 11 ideas</span>
        </div>
        <div className="grid gap-10">
          {mockups.map((item) => (
            <figure key={item.src} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
              <img src={item.src} alt={item.title} className="w-full rounded-sm border border-[color:var(--color-rule)]" />
              <figcaption className="grid sm:grid-cols-[0.4fr_0.6fr] gap-3 pt-4 text-sm">
                <strong className="text-[color:var(--color-ink)]">{item.title}</strong>
                <span className="text-[color:var(--color-ink-mute)]">{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-6 mb-8">
          <h2 className="display text-4xl sm:text-5xl">System diagrams</h2>
          <span className="font-mono text-xs text-[color:var(--color-ink-mute)]">architecture sketches</span>
        </div>
        <div className="grid gap-10">
          {diagrams.map((item) => (
            <figure key={item.src} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
              <img src={item.src} alt={item.title} className="w-full rounded-sm border border-[color:var(--color-rule)]" />
              <figcaption className="grid sm:grid-cols-[0.4fr_0.6fr] gap-3 pt-4 text-sm">
                <strong className="text-[color:var(--color-ink)]">{item.title}</strong>
                <span className="text-[color:var(--color-ink-mute)]">{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
