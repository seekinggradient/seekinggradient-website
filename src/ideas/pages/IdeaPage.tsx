import { Link, useParams } from 'react-router-dom';
import { ideaBySlug, ideas } from '../data/ideas';
import { StatusBadge } from '../components/StatusBadge';
import { Prose } from '../components/Prose';
import { MacOmnibarDeepDive } from '../components/MacOmnibarDeepDive';
import { HtmlArtifactsDeepDive } from '../components/HtmlArtifactsDeepDive';
import { PredictionMarketDeepDive } from '../components/PredictionMarketDeepDive';
import { NotFound } from './NotFound';

export function IdeaPage() {
  const { slug } = useParams();
  const idea = slug ? ideaBySlug(slug) : undefined;
  if (!idea) return <NotFound />;

  const index = ideas.findIndex((i) => i.slug === idea.slug);
  const prev = index > 0 ? ideas[index - 1] : undefined;
  const next = index < ideas.length - 1 ? ideas[index + 1] : undefined;

  const visualAssets = visualsBySlug[idea.slug] ?? [];

  return (
    <article>
      <header className="border-b border-[color:var(--color-rule)]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-12 sm:pt-16 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span aria-hidden>←</span> Back to the index
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            <span className="font-mono normal-case tracking-normal text-[13px]">{idea.number}</span>
            <span aria-hidden>·</span>
            <span>{idea.domain}</span>
            <span aria-hidden>·</span>
            <span className="font-mono normal-case tracking-normal text-[13px]">{idea.year}</span>
            <span className="ml-1"><StatusBadge status={idea.status} /></span>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] mt-6">
            {idea.title}
          </h1>
          <p className="mt-5 text-lg text-[color:var(--color-ink-soft)] max-w-prose">
            {idea.tagline}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-14">
        <section className="mb-14">
          <SectionLabel>Overview</SectionLabel>
          <Prose text={idea.summary} />
        </section>

        {visualAssets.length > 0 && (
          <section className="mb-14">
            <SectionLabel>Visual exploration</SectionLabel>
            <div className="grid gap-6">
              {visualAssets.map((asset) => (
                <figure key={asset.src} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
                  <a href={asset.src} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={asset.src}
                      alt={asset.alt}
                      className="w-full rounded-sm border border-[color:var(--color-rule)]"
                    />
                  </a>
                  <figcaption className="pt-4 text-sm text-[color:var(--color-ink-mute)]">
                    <strong className="text-[color:var(--color-ink)]">{asset.title}</strong>
                    <span className="mx-2 text-[color:var(--color-rule)]">/</span>
                    {asset.caption}
                  </figcaption>
                  {asset.prompt && (
                    <details className="mt-4 border-t border-[color:var(--color-rule)] pt-4">
                      <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                        Generation prompt
                      </summary>
                      <pre className="mt-3 whitespace-pre-wrap rounded-sm bg-[color:var(--color-paper)] p-4 text-[12px] leading-relaxed text-[color:var(--color-ink-soft)]">
                        {asset.prompt}
                      </pre>
                    </details>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {idea.sections.map((s, i) => (
          <section key={i} className="mb-14">
            <SectionLabel>{`§ ${String(i + 1).padStart(2, '0')} — ${s.heading}`}</SectionLabel>
            <Prose text={s.body} />
          </section>
        ))}

        {idea.slug === 'mac-omnibar-for-agents' && <MacOmnibarDeepDive />}
        {idea.slug === 'agent-native-html-artifacts' && <HtmlArtifactsDeepDive />}
        {idea.slug === 'prediction-market-mispricing-engine' && <PredictionMarketDeepDive />}

        <section className="mt-12">
          <SectionLabel>Tags</SectionLabel>
          <ul className="flex flex-wrap gap-2">
            {idea.tags.map((t) => (
              <li
                key={t}
                className="font-mono text-xs px-2.5 py-1 rounded-full border border-[color:var(--color-rule)] text-[color:var(--color-ink-soft)]"
              >
                #{t}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <nav className="border-t border-[color:var(--color-rule)]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {prev ? (
            <Link to={`/${prev.slug}`} className="group">
              <span className="block text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                ← Previous
              </span>
              <span className="display text-xl mt-2 group-hover:text-[color:var(--color-accent)] transition-colors block">
                {prev.title}
              </span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/${next.slug}`} className="group sm:text-right">
              <span className="block text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                Next →
              </span>
              <span className="display text-xl mt-2 group-hover:text-[color:var(--color-accent)] transition-colors block">
                {next.title}
              </span>
            </Link>
          ) : <span />}
        </div>
      </nav>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
      {children}
    </h2>
  );
}

type VisualAsset = {
  src: string;
  title: string;
  caption: string;
  alt: string;
  prompt?: string;
};

const predictionMarketProductPrompt = `Use case: ui-mockup
Asset type: Seeking Gradient Ideas notebook visual board, landscape product mockup, 16:9
Primary request: Create a polished three-screen product direction board for a live sports prediction-market mispricing engine for Kalshi-style event contracts.
Scene/backdrop: Warm off-white editorial canvas with subtle paper grain, thin charcoal dividers, restrained burnt-orange accent, similar to a refined product strategy mockup board.
Subject: Three adjacent high-fidelity app screens on one board:
1. Live game watchlist showing SAS vs OKC, score/time, Kalshi price, sportsbook consensus probability, and detected edge.
2. Trade decision screen with an edge breakdown: fair probability, executable price, fees/spread buffer, recommended limit order, risk cap.
3. Post-trade journal screen with entry/exit, PnL, calibration notes, and backtest tags.
Style/medium: Sophisticated SaaS/product UI mockup, crisp realistic app screenshots, editorial presentation board, quiet utility, not flashy gambling advertising.
Composition/framing: Wide 2752x1536-style board, three screens evenly spaced, slight shadows, generous margins, no nested decorative cards beyond the UI screens.
Lighting/mood: Calm analytical research desk energy; serious, professional, understated.
Color palette: warm paper (#f6f2ea), ink black, muted gray, subtle orange accent, small green/red probability indicators only where useful.
Text constraints: Use only short clear labels; exact visible labels may include "Live Edge", "Fair Price", "Kalshi Ask", "No-Vig Consensus", "Risk Cap", "Exit Plan", "Trade Journal". Keep text sparse and legible.
Constraints: Must look like a product exploration board for a responsible analytics/trading tool, not a casino or sportsbook ad. No logos, no real brand marks, no misleading profit guarantees, no people, no photos, no watermark.`;

const predictionMarketArchitecturePrompt = `Use case: infographic-diagram
Asset type: Seeking Gradient Ideas notebook architecture board, landscape raster diagram, 16:9
Primary request: Create a polished system architecture board for a live sports prediction-market mispricing engine.
Scene/backdrop: Warm off-white paper canvas, thin editorial rules, restrained product-strategy diagram aesthetic matching a quiet technical notebook.
Subject: A left-to-right architecture diagram with six labeled modules: "Sportsbook Odds", "Game State", "Kalshi Order Book", "Fair Probability Engine", "Edge + Risk Engine", "Execution + Journal". Show arrows flowing through normalization, no-vig consensus, cost-adjusted edge, limit-order execution, and backtesting feedback. Include small mini-panels for "fees", "spread", "slippage", "uncertainty buffer", and "paper trade first".
Style/medium: Clean high-end SaaS architecture visualization, crisp UI/infographic hybrid, subtle shadows, accurate looking data-flow blocks, no 3D excess.
Composition/framing: Wide 2752x1536-style board; title area top left, flow diagram across middle, small metrics strip at bottom. Plenty of whitespace and legible hierarchy.
Lighting/mood: Analytical, calm, responsible, research-system feel.
Color palette: warm paper (#f6f2ea), black ink, soft gray rules, muted burnt orange for active signal, green only for positive edge, red only for risk/cost.
Text constraints: Keep labels short and legible. Use exact short labels: "No-Vig Consensus", "Executable Price", "Net Edge", "Risk Cap", "Limit Orders", "Trade Journal", "Backtest Loop".
Constraints: No real logos, no casino imagery, no promises of guaranteed profit, no people, no photographic backgrounds, no watermark.`;

const visualsBySlug: Record<string, VisualAsset[]> = {
  'icloud-album-printer': [
    {
      src: '/mockups/specific/photo-album.jpg',
      title: 'Three-screen product direction',
      caption: 'Permission, curation, and print-order flows for the photo album app — no shared concepts on this board.',
      alt: 'Three-panel mockup board for a printable photo album app with permission, album proposal, and checkout screens.',
    },
  ],
  'mac-omnibar-for-agents': [
    {
      src: '/mockups/specific/agent-omnibar.jpg',
      title: 'Three-screen product direction',
      caption: 'Omnibar prompt, streaming agent response, and harness/settings flows for the Mac agent bar.',
      alt: 'Three-panel mockup board for a Mac agent omnibar with prompt, response, and settings screens.',
    },
  ],
  'portable-memory-layer': [
    {
      src: '/mockups/specific/portable-memory.jpg',
      title: 'Three-screen product direction',
      caption: 'Workspace dashboard, plugin install surface, and recall/writeback flow for portable agent memory.',
      alt: 'Three-panel mockup board for portable agent memory with dashboard, plugin, and recall screens.',
    },
    {
      src: '/diagrams/portable-memory-plugin-architecture.svg',
      title: 'Plugin-first architecture',
      caption: 'Thin harness-specific plugins connect Claude Code, Codex, OpenClaw, and other clients to one shared memory service.',
      alt: 'Architecture diagram showing agent harnesses connecting through memory plugins to a portable memory service and external sources.',
    },
    {
      src: '/diagrams/portable-memory-recall-flow.svg',
      title: 'Memory read/write loop',
      caption: 'A user prompt triggers scoped recall, evidence filtering, context injection, and optional writeback.',
      alt: 'Flow diagram showing prompt, scope detection, memory query, evidence filtering, context injection, agent action, candidate memories, and writeback.',
    },
  ],
  'solo-service-business-kit': [
    {
      src: '/mockups/specific/service-business-kit.jpg',
      title: 'Three-screen product direction',
      caption: 'Website generator, flyer/referral asset, and booking dashboard for solo cleaners and service workers.',
      alt: 'Three-panel mockup board for a solo service business kit with website, flyer, referral, and booking screens.',
    },
  ],
  'stock-thesis-research-pipeline': [
    {
      src: '/mockups/specific/stock-thesis.jpg',
      title: 'Three-screen product direction',
      caption: 'Market thesis dashboard, simulated portfolio, and daily written/audio brief surfaces.',
      alt: 'Three-panel mockup board for a stock thesis research pipeline with thesis, portfolio, and brief screens.',
    },
  ],
  'friend-compilation-video-maker': [
    {
      src: '/mockups/specific/compilation-video.jpg',
      title: 'Three-screen product direction',
      caption: 'Invite tracking, mobile upload, transcript/storyboard, and final export for milestone compilation videos.',
      alt: 'Three-panel mockup board for a friend compilation video maker with invite, upload, editing, and export screens.',
    },
  ],
  'visual-note-transcription-pipeline': [
    {
      src: '/mockups/specific/visual-note-transcription.jpg',
      title: 'Three-screen product direction',
      caption: 'Upload and patch detection, ambiguous-region review, and faithful Markdown output for handwritten notes.',
      alt: 'Three-panel mockup board for a visual note transcription product showing upload detection, patch review, and Markdown output.',
    },
    {
      src: '/diagrams/visual-note-transcription-architecture.svg',
      title: 'Patch-first architecture',
      caption: 'Rendered page images become layout-aware patches, then move through OCR hints, vision models, reconstruction, and source-linked outputs.',
      alt: 'Architecture diagram for a visual transcription pipeline from PDF inputs through page processing, transcription engine, and Markdown outputs.',
    },
    {
      src: '/diagrams/visual-note-review-loop.svg',
      title: 'Review and escalation loop',
      caption: 'Easy text stays cheap; hard handwriting escalates; user corrections improve a personal handwriting profile.',
      alt: 'Flow diagram showing patch difficulty scoring, OCR-only routing, small vision model routing, strong model routing, human review, and handwriting profile learning.',
    },
  ],
  'do-it-again-reviews': [
    {
      src: '/mockups/specific/do-it-again-reviews.jpg',
      title: 'Three-screen product direction',
      caption: 'Experience page, cross-category search, and personal taste graph for a binary repeat-intent review network.',
      alt: 'Three-panel mockup board for Again showing an experience page, cross-category search results, and a personal again list.',
    },
    {
      src: '/diagrams/do-it-again-review-loop.svg',
      title: 'Repeat-intent review loop',
      caption: 'A category-neutral yes/no vote becomes an again rate, a personal taste graph, and a recommendation signal.',
      alt: 'Flow diagram showing experiences becoming adapted binary prompts, yes or no votes, optional context, again rates, taste graphs, and recommendations.',
    },
  ],
  'agent-native-html-artifacts': [
    {
      src: '/mockups/specific/agent-native-artifact-feed.png',
      title: 'Artifact feed direction',
      caption: 'A profile surface where deployed HTML pages, cards, widgets, and private-link artifacts appear as one stream of live software objects.',
      alt: 'Product mockup of a personal profile feed containing live HTML artifacts, including trip, explainer, home-search, widget, and private-link cards.',
    },
  ],
  'prediction-market-mispricing-engine': [
    {
      src: '/mockups/specific/prediction-market-mispricing.png',
      title: 'Three-screen product direction',
      caption: 'Live edge watchlist, trade-decision breakdown, and post-trade journal for a disciplined prediction-market research system.',
      alt: 'Three-panel product mockup for a live prediction-market mispricing engine with watchlist, trade decision, and trade journal screens.',
      prompt: predictionMarketProductPrompt,
    },
    {
      src: '/mockups/specific/prediction-market-architecture.png',
      title: 'Mispricing engine architecture',
      caption: 'Sportsbook odds, game state, Kalshi order books, fair probability, edge and risk logic, execution, and a backtest loop.',
      alt: 'Architecture board showing sportsbook odds, game state, Kalshi order books, fair probability engine, risk engine, execution, journal, and backtest feedback.',
      prompt: predictionMarketArchitecturePrompt,
    },
  ],
};
