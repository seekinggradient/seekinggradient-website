import { Link, useParams } from 'react-router-dom';
import { ideaBySlug, ideas } from '../data/ideas';
import { StatusBadge } from '../components/StatusBadge';
import { Prose } from '../components/Prose';
import { MacOmnibarDeepDive } from '../components/MacOmnibarDeepDive';
import { HtmlArtifactsDeepDive } from '../components/HtmlArtifactsDeepDive';
import { PredictionMarketDeepDive } from '../components/PredictionMarketDeepDive';
import { AIWeeklyMagazineDeepDive } from '../components/AIWeeklyMagazineDeepDive';
import { AmbientKnowledgeDeepDive } from '../components/AmbientKnowledgeDeepDive';
import { PersonalKindlePublisherDeepDive } from '../components/PersonalKindlePublisherDeepDive';
import { NotFound } from './NotFound';

export function IdeaPage() {
  const { slug } = useParams();
  const idea = slug ? ideaBySlug(slug) : undefined;
  if (!idea) return <NotFound />;

  const index = ideas.findIndex((i) => i.slug === idea.slug);
  const prev = index > 0 ? ideas[index - 1] : undefined;
  const next = index < ideas.length - 1 ? ideas[index + 1] : undefined;

  const visualAssets = visualsBySlug[idea.slug] ?? [];
  const leadVisual =
    idea.slug === 'physical-weekly-ai-magazine' || idea.slug === 'personal-kindle-publishing-pipeline'
      ? visualAssets[0]
      : undefined;
  const galleryAssets = leadVisual ? visualAssets.slice(1) : visualAssets;

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

      {leadVisual && (
        <section className="border-b border-[color:var(--color-rule)] bg-[#fffaf0]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-12">
            <a href={leadVisual.src} target="_blank" rel="noreferrer" className="block">
              <img
                src={leadVisual.src}
                alt={leadVisual.alt}
                className="w-full rounded-sm border border-[color:var(--color-rule)] shadow-[0_24px_80px_rgba(26,26,26,0.10)]"
              />
            </a>
            <div className="mt-4 grid gap-2 sm:grid-cols-[0.32fr_0.68fr] text-sm text-[color:var(--color-ink-mute)]">
              <strong className="text-[color:var(--color-ink)]">{leadVisual.title}</strong>
              <span>{leadVisual.caption}</span>
            </div>
            {leadVisual.prompt && (
              <details className="mt-4 border-t border-[color:var(--color-rule)] pt-4">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                  Generation prompt
                </summary>
                <pre className="mt-3 whitespace-pre-wrap rounded-sm bg-[color:var(--color-paper)] p-4 text-[12px] leading-relaxed text-[color:var(--color-ink-soft)]">
                  {leadVisual.prompt}
                </pre>
              </details>
            )}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-14">
        <section className="mb-14">
          <SectionLabel>Overview</SectionLabel>
          <Prose text={idea.summary} />
        </section>

        {galleryAssets.length > 0 && (
          <section className="mb-14">
            <SectionLabel>Visual exploration</SectionLabel>
            <div className="grid gap-6">
              {galleryAssets.map((asset) => (
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
        {idea.slug === 'ambient-knowledge-agent-for-notes' && <AmbientKnowledgeDeepDive />}
        {idea.slug === 'personal-kindle-publishing-pipeline' && <PersonalKindlePublisherDeepDive />}
        {idea.slug === 'prediction-market-mispricing-engine' && <PredictionMarketDeepDive />}
        {idea.slug === 'physical-weekly-ai-magazine' && <AIWeeklyMagazineDeepDive />}
        {idea.slug === 'short-term-rental-demand-radar' && (
          <section className="mb-14">
            <SectionLabel>Implementation notes</SectionLabel>
            <Link
              to="/short-term-rental-demand-radar/technical-plan"
              className="group block border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 transition-colors hover:bg-[color:var(--color-paper-deep)]/50"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-2">
                Technical plan
              </div>
              <h3 className="display text-2xl leading-tight group-hover:text-[color:var(--color-accent)] transition-colors">
                Architecture, data sources, hotel-rate proxy, and cost model
              </h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)] max-w-prose">
                A deeper build note for turning the address-based idea into a working host assistant, including source choices and operating-cost ranges.
              </p>
            </Link>
          </section>
        )}

        {idea.references && idea.references.length > 0 && (
          <section className="mb-14">
            <SectionLabel>References</SectionLabel>
            <div className="grid gap-3">
              {idea.references.map((reference) => (
                <a
                  key={reference.href}
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block border border-[color:var(--color-rule)] bg-[#fffaf0] p-4 transition-colors hover:bg-[color:var(--color-paper-deep)]/50"
                >
                  <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <span>
                      <span className="display block text-2xl leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent)] transition-colors">
                        {reference.title}
                      </span>
                      {reference.note && (
                        <span className="mt-2 block text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                          {reference.note}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] sm:pt-1">
                      Open
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

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

const aiWeeklyCoverPrompt = `Use case: product-mockup
Asset type: Seeking Gradient Ideas notebook hero visual for a physical weekly AI magazine, landscape 16:9
Primary request: Create a gorgeous premium editorial render of a physical weekly magazine called "AI WEEKLY" that makes the viewer want to subscribe every week.
Scene/backdrop: Warm off-white studio surface with soft directional light, subtle paper texture, refined editorial styling.
Subject: A beautiful printed magazine issue shown at a slight angle, glossy but tactile cover, thick paper, crisp spine, with two additional issues partially fanned underneath. Cover design should feel like a high-end magazine about developments in AI: feature teasers, project spotlights, trends, editorials, and tasteful AI product ads. Include visible cover masthead text "AI WEEKLY" and short cover lines like "New Models", "Builder Index", "The Week in Agents", "Launches".
Style/medium: Photorealistic premium product photography mixed with high-end editorial magazine design. Sophisticated, contemporary, beautiful, not sci-fi cliché.
Composition/framing: Wide landscape image, magazine centered with generous whitespace, slight shadows, cover large enough to inspect, subtle depth.
Lighting/mood: Aspirational, smart, collectible, Sunday-morning reading ritual for the AI industry.
Color palette: Warm paper background, black ink, muted silver, electric cyan and restrained magenta accents, tasteful orange details.
Text constraints: Keep text short and magazine-like; do not include real company logos or trademarks. Avoid tiny unreadable paragraphs.
Constraints: No real logos, no people, no robot faces, no floating holograms, no watermark, no fake barcodes as main focus, no messy distorted hands.`;

const aiWeeklyFeatureSpreadPrompt = `Use case: product-mockup
Asset type: Seeking Gradient Ideas notebook visual, interior magazine spread, landscape 16:9
Primary request: Create a beautiful render of an open physical weekly AI magazine showing a feature spread about new AI projects and trends.
Scene/backdrop: Magazine lying open on a warm desk surface, photographed from overhead at a slight angle, crisp paper folds and shadows.
Subject: Two-page editorial spread of an AI industry weekly. Left page: a feature article layout with a large headline "The Week in Agents", short decks, pull quote, small charts, and a column of curated AI project launches. Right page: visual trend map with cards for model releases, open-source projects, startup launches, and research highlights. It should feel dense but elegant, like a premium magazine readers want to sit with.
Style/medium: Photorealistic print design mockup, high-end editorial typography, refined data/editorial design, tactile paper.
Composition/framing: Wide landscape, full open spread visible, pages occupy most of frame, readable hierarchy, generous margins, no clutter.
Lighting/mood: Smart, premium, collectible, intellectually exciting.
Color palette: Warm paper, black ink, muted gray, cyan/magenta signal colors, restrained burnt orange section markers.
Text constraints: Use short headings and labels only; avoid long fake paragraphs. Text can be stylized but should look like magazine layout.
Constraints: No real brand logos, no people, no robot faces, no watermark, no messy distorted hands, no generic sci-fi holograms.`;

const aiWeeklyMarketplacePrompt = `Use case: ads-marketing
Asset type: Seeking Gradient Ideas notebook visual, AI product advertising pages in a magazine, landscape 16:9
Primary request: Create a premium open-magazine render focused on the advertising section of a physical weekly AI magazine, showing how desirable the ad inventory could be for AI product builders.
Scene/backdrop: Open magazine on a warm neutral table, studio/editorial lighting, tactile printed pages.
Subject: A two-page spread called "Builder Marketplace" or "Launch Board" with tasteful ads from fictional AI products. Include a mix of full-page ad, smaller launch cards, QR-code-like blocks, and classified-style listings for AI tools. Ads should feel like beautiful print creative, not web banners. Categories: developer agents, evaluation tools, model infra, design copilots, memory tools, workflow automation, hiring.
Style/medium: Photorealistic print magazine mockup, high-end design annual, premium startup magazine, clean commercial/editorial design.
Composition/framing: Wide landscape, both pages visible, ad layouts crisp and varied, clear visual hierarchy, attractive enough that AI companies would want to buy placement.
Lighting/mood: Energetic but tasteful, polished, commercially valuable, the classified section everyone scans.
Color palette: Warm paper, black ink, silver gray, cyan, violet, magenta, orange accent.
Text constraints: Use only fictional product names and short phrases; no real logos or trademarks. Example short copy: "Ship agents faster", "Evaluate every run", "Memory for teams", "Launch this week".
Constraints: No real company names or logos, no people, no robot faces, no watermark, no distorted hands, no overly busy unreadable clutter.`;

const aiWeeklySubscriptionPrompt = `Use case: product-mockup
Asset type: Seeking Gradient Ideas notebook atmospheric product render, landscape 16:9
Primary request: Create an aspirational lifestyle/product render of the physical weekly AI magazine as a subscription ritual.
Scene/backdrop: A beautiful desk or coffee table with warm morning light, premium paper magazine, espresso/coffee cup, notebook, pencil, maybe a shipping mailer sleeve. No people.
Subject: A stack of weekly AI magazine issues and one open issue, showing cover and inside pages. It should feel like the essential weekly read for people building and buying AI products. Include subtle details like sticky tabs, a bookmark ribbon, a subscription card, and a tasteful ad insert peeking out.
Style/medium: Photorealistic editorial product photography, high-end magazine subscription campaign, tactile paper, luxurious but practical.
Composition/framing: Wide landscape, magazine stack prominent, open pages visible, shallow depth of field, clean negative space for website use.
Lighting/mood: Desirable, calm, premium, intellectually exciting; the feeling of receiving the most important AI briefing of the week.
Color palette: Warm neutrals, black ink, soft paper white, muted cyan/magenta/orange accents.
Text constraints: Short visible magazine text only: "AI WEEKLY", "Issue 011", "Launches", "Trends", "Ads", "Editorial". Avoid long fake text.
Constraints: No real logos, no people or hands, no robot faces, no watermark, no messy clutter, no overdone sci-fi neon.`;

const hyperlocalNewsPrompt = `Use case: ui-mockup
Asset type: Seeking Gradient Ideas notebook visual board, landscape product mockup, 16:9
Primary request: Create a 16:9 polished product mockup board for a hyperlocal news app.
Scene/backdrop: Warm off-white editorial canvas, thin charcoal dividers, restrained burnt-orange accent.
Subject: Three adjacent app screens: "Near Me" neighborhood feed, "Alert Radius" map, and "City Desk" verification queue. Include short labels like Verified, School Board, Permit Watch, Road Closure, Today.
Style/medium: Trustworthy civic product UI mockup, calm local news surface, useful rather than sensational.
Composition/framing: Wide 16:9 board with three adjacent mobile screens and supporting civic information modules.
Lighting/mood: Calm, useful, grounded, neighborhood-scale.
Color palette: Warm paper, black ink, muted gray, restrained orange accent, small civic status colors.
Text constraints: Use sparse, legible product labels only.
Constraints: No real addresses, no real logos, no people, no sensational crime imagery, no watermark.`;

const shortTermRentalDemandPrompt = `Use case: ui-mockup
Asset type: Seeking Gradient Ideas notebook visual board, landscape product mockup, 16:9
Primary request: Create a 16:9 polished product mockup board for an Airbnb host pricing intelligence product.
Scene/backdrop: Warm off-white editorial canvas, quiet SaaS design, thin charcoal dividers, restrained orange accent.
Subject: Three adjacent screens: 1. Address Insight with a typed rental address and neighborhood demand trend; 2. Event Demand Calendar showing upcoming conferences, concerts, sports matches, holidays, and hotel occupancy; 3. Pricing Action screen with suggested nightly rate lift, confidence, comp set hotel prices, and calendar sync.
Style/medium: Sophisticated SaaS/product UI mockup for short-term rental hosts, practical and data-backed.
Composition/framing: Wide 16:9 board with three clear screens and enough whitespace to read the product direction.
Lighting/mood: Calm, analytical, host-friendly, revenue-aware without hype.
Color palette: Warm off-white, black ink, muted gray, restrained orange, green only for demand/connection indicators.
Text constraints: Use short labels: Address Insight, Demand Spike, Event Radar, Hotel ADR, Occupancy, Raise Rate, Calendar Sync.
Constraints: No real addresses, no Airbnb logo, no real hotel logos, no people, no guaranteed earnings, no watermark.`;

const agentsfsPrompt = `Use case: infographic-diagram
Asset type: Seeking Gradient Ideas notebook concept board, landscape 16:9
Primary request: Create a 16:9 restrained product concept board for agentsfs.ai, a portable agent-era filesystem. Keep it light and conceptual, not a detailed implementation spec.
Scene/backdrop: Warm off-white editorial canvas, thin charcoal dividers, black ink, muted gray, restrained burnt-orange accent.
Subject: A quiet central file tree named agentsfs.ai with simple folders like /projects, /memory, /artifacts, /scratch, /sources. Around it show three small compatible access surfaces: CLI, MCP, and Skills.
Style/medium: Technical notebook concept board, systems product seed, hand-drawn but polished.
Composition/framing: Wide 16:9 board with one central filesystem shape and small surrounding access surfaces.
Lighting/mood: Calm, first-principles, portable, intentionally unfinished.
Color palette: Warm paper, black ink, muted gray, restrained burnt orange.
Text constraints: Include small labels: Portable Filesystem, Cross-Harness, Agent Memory, Provenance, Works Anywhere.
Constraints: No logos for real companies, no detailed protocol diagrams, no people, no robots, no watermark.`;

const personalKindleProductPrompt = `Use case: ui-mockup
Asset type: Seeking Gradient Ideas notebook product concept board, landscape 16:9
Primary request: Create a polished, editorial product mockup board for a service that turns a person's learning goals and source materials into custom, source-cited EPUB books and delivers them to an e-reader on a schedule.
Scene/backdrop: Warm off-white editorial canvas with thin charcoal dividers and restrained cobalt, orange, pale yellow, mint, and lilac accents. No physical room scene.
Subject: Three adjacent product screens. Screen one is a learning-program setup called "NEW READING PLAN" with a topic field showing "Hinduism: foundations", cadence "Every morning", depth "20-minute chapter", and toggles for "Citations" and "Ask before sending". Screen two is an editorial production queue called "BOOK IN PROGRESS" with steps "Research", "Outline", "Draft", "Fact check", "EPUB", and a small source ledger. Screen three is a delivery/library screen called "YOUR SHELF" showing tasteful fictional book covers titled "Dharma & Daily Life", "Reading a Research Paper", and "The Upanishads: A Map", plus a status label "Delivered to e-reader".
Style/medium: High-fidelity SaaS UI mockup, expressive personal software, tactile editorial publishing studio rather than a generic dashboard. Crisp readable typography, restrained panels, slightly imperfect printed-paper texture.
Composition/framing: Wide 16:9 board, three clear screens with varied hierarchy, enough whitespace to understand setup, production, and delivery at a glance.
Lighting/mood: Thoughtful, calm, trustworthy, intellectually inviting.
Color palette: Warm paper #f7f1e7, deep violet ink #17152b, cobalt #3154d8, yellow #f8e45c, orange #ff7043, mint #8bd8bd, lilac #d8ccff.
Text (verbatim): "NEW READING PLAN", "Hinduism: foundations", "Every morning", "20-minute chapter", "Citations", "Ask before sending", "BOOK IN PROGRESS", "Research", "Outline", "Draft", "Fact check", "EPUB", "YOUR SHELF", "Dharma & Daily Life", "Reading a Research Paper", "The Upanishads: A Map", "Delivered to e-reader".
Constraints: Show no real person names, no real addresses, no Amazon or Kindle logo, no religious deity imagery, no robot faces, no fake testimonials, no pricing, no watermark. Keep every visible label listed above; use abstract lines for any other text.
Avoid: purple gradients, generic dark-mode analytics dashboard, excessive rounded cards, tiny unreadable paragraphs, distorted device frames, AI sparkle motifs.`;

const personalKindleReadingPrompt = `Use case: product-mockup
Asset type: Seeking Gradient Ideas notebook editorial lifestyle image, landscape 16:9
Primary request: Create a photorealistic editorial product photograph that makes a scheduled, custom learning book on an e-reader feel tangible and desirable.
Scene/backdrop: Quiet early-morning reading table beside a window, warm natural light, subtle paper grain and lived-in realism. A ceramic cup, one pencil, and a small paper source note may sit nearby, but keep the scene sparse.
Subject: A slim unbranded e-ink reader is the clear focal point. Its screen shows a beautifully typeset personal book chapter with the title "DHARMA & DAILY LIFE", subtitle "Chapter 4 — Duty, action, and context", a short readable pull quote "A tradition is not a single answer.", a small progress marker "18 min", and discreet footnote markers. Beside it is a single narrow printed source card titled "SOURCES" with three abstract citation lines. No person or hands.
Style/medium: Photorealistic high-end editorial product photography, tactile and calm, real e-ink texture, understated intellectual magazine aesthetic, not a tech advertisement.
Composition/framing: Wide landscape 16:9, slightly elevated three-quarter view, e-reader large enough for the title to be legible, modest negative space around the objects.
Lighting/mood: Warm morning light, contemplative, distraction-free, personal, inviting; the feeling that a thoughtful new chapter arrived before breakfast.
Color palette: Warm cream, soft graphite, deep cobalt book accent, muted yellow sunlight, tiny mint detail.
Materials/textures: Matte e-ink screen, lightly worn wood or linen table surface, unglazed ceramic, natural paper.
Text (verbatim): "DHARMA & DAILY LIFE", "Chapter 4 — Duty, action, and context", "A tradition is not a single answer.", "18 min", "SOURCES".
Constraints: Unbranded device; no Amazon or Kindle logo; no real person names; no religious deity imagery or sacred symbols; no visible copyrighted book text; no other readable prose; no people or hands; no watermark.
Avoid: glossy CGI, floating holograms, robot motifs, fake app chrome, excessive props, dark moody lighting, purple gradients, stock-photo perfection, distorted screen text.`;

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
  'physical-weekly-ai-magazine': [
    {
      src: '/mockups/specific/ai-weekly-cover-stack.jpg',
      title: 'Premium cover direction',
      caption: 'A collectible weekly issue with a serious AI industry masthead, launch teasers, and ad inventory treated as part of the product.',
      alt: 'Premium physical magazine cover stack for AI Weekly with launch, model, agent, and advertising teasers.',
      prompt: aiWeeklyCoverPrompt,
    },
    {
      src: '/mockups/specific/ai-weekly-feature-spread.jpg',
      title: 'Feature and trend spread',
      caption: 'An interior issue structure: one hero editorial, project rankings, trend map, model releases, startup launches, and research highlights.',
      alt: 'Open AI Weekly magazine feature spread with The Week in Agents article and AI landscape trend map.',
      prompt: aiWeeklyFeatureSpreadPrompt,
    },
    {
      src: '/mockups/specific/ai-weekly-builder-marketplace.jpg',
      title: 'Builder marketplace ads',
      caption: 'The ad section as a destination: launch cards, premium spots, classifieds, QR-style calls to action, and fictional AI product placements.',
      alt: 'Open AI Weekly magazine advertising spread called Builder Marketplace with fictional AI product ads and launch listings.',
      prompt: aiWeeklyMarketplacePrompt,
    },
    {
      src: '/mockups/specific/ai-weekly-subscription-ritual.jpg',
      title: 'Weekly subscription ritual',
      caption: 'The magazine as a recurring object: a stack of issues, open reading copy, ad insert, desk notes, and the feeling of a weekly AI briefing worth keeping.',
      alt: 'Desk scene with stack of AI Weekly magazines, an open issue, coffee, notebook, subscription card, and ad insert.',
      prompt: aiWeeklySubscriptionPrompt,
    },
  ],
  'hyperlocal-news': [
    {
      src: '/mockups/specific/hyperlocal-news.png',
      title: 'Neighborhood-scale news surface',
      caption: 'A near-me feed, alert radius map, and verification queue for civic updates that matter within a few blocks.',
      alt: 'Three-screen product mockup for a hyperlocal news app with neighborhood feed, radius map, and verification desk.',
      prompt: hyperlocalNewsPrompt,
    },
  ],
  'short-term-rental-demand-radar': [
    {
      src: '/mockups/specific/short-term-rental-pricing.png',
      title: 'Address-based demand radar',
      caption: 'Rental-address demand trend, event calendar, hotel-rate context, and pricing actions for short-term rental hosts.',
      alt: 'Three-screen product mockup for a short-term rental demand radar with address insight, event calendar, and pricing action screens.',
      prompt: shortTermRentalDemandPrompt,
    },
  ],
  'agentsfs': [
    {
      src: '/mockups/specific/agentsfs.png',
      title: 'One filesystem, many surfaces',
      caption: 'A deliberately light concept board for a portable agent filesystem exposed through CLI, MCP, and skills.',
      alt: 'Concept board for agentsfs.ai showing a central portable filesystem tree connected to CLI, MCP, and skills surfaces.',
      prompt: agentsfsPrompt,
    },
  ],
  'personal-kindle-publishing-pipeline': [
    {
      src: '/mockups/specific/personal-kindle-publisher-reading.png',
      title: 'A chapter waiting before breakfast',
      caption: 'The product promise made physical: a short, cited, personal chapter on a quiet reading device rather than another browser tab.',
      alt: 'Unbranded e-reader on a warm morning table displaying a custom chapter titled Dharma and Daily Life beside a source card.',
      prompt: personalKindleReadingPrompt,
    },
    {
      src: '/mockups/specific/personal-kindle-publisher-product.png',
      title: 'Reading plan to personal shelf',
      caption: 'A topic and cadence become an editorial production run, a checked EPUB, and a durable shelf of personal learning books.',
      alt: 'Three-screen product board showing a new reading plan, book production pipeline, and personal e-reader shelf.',
      prompt: personalKindleProductPrompt,
    },
  ],
};
