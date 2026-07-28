const mockups = [
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
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <div className="border-b border-[color:var(--color-rule)] pb-12 mb-14">
        <h1 className="display text-6xl sm:text-7xl">Visual notes</h1>
        <p className="mt-6 text-lg leading-8 text-[color:var(--color-ink-soft)] max-w-2xl">
          Rough interface directions and system diagrams attached to projects in the repository.
        </p>
      </div>

      <section className="mb-20">
        <div className="flex items-baseline justify-between gap-6 mb-8">
          <h2 className="display text-4xl sm:text-5xl">Interface explorations</h2>
          <span className="text-xs text-[color:var(--color-ink-mute)]">{mockups.length} visual notes</span>
        </div>
        <div className="grid gap-10">
          {mockups.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.title} loading="lazy" decoding="async" className="w-full border border-[color:var(--color-rule)]" />
              <figcaption className="grid sm:grid-cols-[0.4fr_0.6fr] gap-3 mt-4 border-t border-[color:var(--color-rule)] pt-4 text-sm">
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
          <span className="text-xs text-[color:var(--color-ink-mute)]">Architecture sketches</span>
        </div>
        <div className="grid gap-10">
          {diagrams.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.title} loading="lazy" decoding="async" className="w-full border border-[color:var(--color-rule)]" />
              <figcaption className="grid sm:grid-cols-[0.4fr_0.6fr] gap-3 mt-4 border-t border-[color:var(--color-rule)] pt-4 text-sm">
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
