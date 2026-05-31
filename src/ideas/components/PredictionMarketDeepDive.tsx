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

const providers = [
  {
    name: 'The Odds API',
    cost: 'Free 500 credits/mo; $30 for 20K; $59 for 100K; $119 for 5M; $249 for 15M',
    strength: 'Cheapest clean MVP path; broad moneyline/spread/total coverage; simple REST integration.',
    caveat: 'Polling and credit limits may be too slow for late-game live trading.',
  },
  {
    name: 'Odds-API.io',
    cost: 'Free; £99/mo Starter; £179/mo Growth; £229/mo Pro; WebSocket add-on doubles plan price',
    strength: 'Transparent pricing, live odds, scores, player props, and WebSocket option for faster updates.',
    caveat: 'Useful bookmaker count depends on plan; paid WebSocket likely required for serious live signals.',
  },
  {
    name: 'OpticOdds',
    cost: 'Quote/demo pricing',
    strength: '100+ sportsbooks, SSE streaming, historical odds, injuries, lineups, limits, bet grading.',
    caveat: 'Probably the best product shape, but less hobbyist-friendly because pricing is not public.',
  },
  {
    name: 'OddsJam API',
    cost: 'Contact sales',
    strength: 'Trader-oriented real-time odds, historical data, injuries, scores, game clock, and broad market coverage.',
    caveat: 'API pricing is not public; likely more expensive than a simple prototype needs.',
  },
  {
    name: 'SportsDataIO',
    cost: 'Discovery Lab / commercial tiers; production betting feeds are sales-led',
    strength: 'Strong sports-data ecosystem: scores, stats, odds, historical feeds, and commercial support.',
    caveat: 'May be better as the game-state provider than the first live-odds provider.',
  },
  {
    name: 'Sportradar / Betradar',
    cost: 'Enterprise',
    strength: 'Unified Odds Feed includes sport-event probabilities, closer to buying pro probabilities directly.',
    caveat: 'Likely too expensive for MVP, but useful as a north-star data source.',
  },
];

const architecture = [
  ['Sportsbook adapter', 'Pull live moneylines, book timestamps, suspended state, and bookmaker identity.'],
  ['Game-state adapter', 'Normalize score, clock, period, possession, timeout, injury, and review state.'],
  ['Kalshi adapter', 'Read market metadata, yes/no order books, trades, fills, and account positions.'],
  ['Fair-probability engine', 'Remove vig per book, drop stale books, aggregate consensus, and optionally blend a model.'],
  ['Edge + risk engine', 'Subtract fees, spread, slippage, latency buffer, and uncertainty before sizing anything.'],
  ['Execution + journal', 'Place limit orders only, cancel on state changes, and record every signal and non-signal.'],
];

const signals = [
  ['Early-game overreaction', 'A team falls behind by a few possessions; Kalshi sells off harder than sportsbook consensus.'],
  ['Run overreaction', 'A scoring burst moves the event market too far relative to live moneyline.'],
  ['Stale order book', 'Sportsbook consensus updates first while prediction-market depth still reflects old state.'],
  ['Thin-book dislocation', 'Small panic liquidity appears at a bad executable price.'],
  ['Exit convergence', 'The original edge has closed; sell instead of holding to settlement for pride.'],
];

const phases = [
  ['Phase 1', 'Read-only dashboard', 'Odds API, game-state feed, Kalshi order-book polling, no-vig consensus, edge table.'],
  ['Phase 2', 'Paper trading', 'Realistic fills, fee/slippage model, replayable journal, signal-class scorecards.'],
  ['Phase 3', 'Tiny live orders', 'Manual approval, strict risk caps, limit orders only, automatic cancel conditions.'],
  ['Phase 4', 'Selective automation', 'Only automate signal classes that survive real fills, drawdowns, and stale-data tests.'],
];

export function PredictionMarketDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        Research notes - data, edge, and execution
      </h2>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {[
          ['Reference price', 'De-vigged sportsbook consensus, not raw book odds.'],
          ['Trade trigger', 'Executable Kalshi price must be wrong after all costs.'],
          ['First product', 'Paper-trading journal before any automatic execution.'],
        ].map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-2">
              {title}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Provider landscape</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[900px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Provider</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Public cost signal</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Why it matters</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Caveat</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{p.name}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{p.cost}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{p.strength}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{p.caveat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-mute)]">
        Pricing notes are current as of May 2026 from public provider pages and docs. Treat them as planning estimates, not permanent facts.
      </p>

      <SubLabel>Core calculations</SubLabel>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-3">
            No-vig probability
          </div>
          <div className="space-y-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            <p>Team A +125 = 44.4% raw. Team B -150 = 60.0% raw. Total raw = 104.4%.</p>
            <pre className="overflow-x-auto rounded-sm bg-[color:var(--color-paper)] p-3 font-mono text-[12px] text-[color:var(--color-ink)]">
{`Team A fair = 44.4 / 104.4 = 42.6%
Team B fair = 60.0 / 104.4 = 57.4%`}
            </pre>
          </div>
        </div>
        <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-3">
            Net edge
          </div>
          <div className="space-y-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">
            <p>The system should trade only when fair value still clears all known costs and a safety buffer.</p>
            <pre className="overflow-x-auto rounded-sm bg-[color:var(--color-paper)] p-3 font-mono text-[12px] text-[color:var(--color-ink)]">
{`net_edge =
  fair_probability
- executable_price
- fees
- spread/slippage
- uncertainty_buffer`}
            </pre>
          </div>
        </div>
      </div>

      <SubLabel>Execution architecture</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {architecture.map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-2">
              {title}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Signal taxonomy</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Signal class</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">What it is testing</th>
            </tr>
          </thead>
          <tbody>
            {signals.map(([name, body]) => (
              <tr key={name}>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{name}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubLabel>Risk gates</SubLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          'No market orders.',
          'No averaging down by default.',
          'Max exposure per game, team, sport, and day.',
          'Skip wide spreads and thin books.',
          'Cancel on stale sportsbook or game-state data.',
          'Paper-trade every new signal class first.',
          'Size by expected value and drawdown, not win rate.',
          'Treat late-game 94-cent buys as tail-risk trades, not free money.',
        ].map((rule) => (
          <div key={rule} className="flex gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-4 text-[15px] text-[color:var(--color-ink-soft)]">
            <span className="mt-1 size-1.5 flex-none rounded-full bg-[color:var(--color-accent)]" />
            <span>{rule}</span>
          </div>
        ))}
      </div>

      <SubLabel>Build sequence</SubLabel>
      <div className="grid gap-4">
        {phases.map(([phase, title, body]) => (
          <div key={phase} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.22fr_0.28fr_0.5fr]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{phase}</div>
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>Source notes</SubLabel>
      <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        Provider and mechanics notes came from{' '}
        <SourceLink href="https://the-odds-api.com/">The Odds API</SourceLink>,{' '}
        <SourceLink href="https://odds-api.io/">Odds-API.io</SourceLink>,{' '}
        <SourceLink href="https://developer.opticodds.com/docs/odds-api-getting-started-guide">OpticOdds docs</SourceLink>,{' '}
        <SourceLink href="https://opticodds.com/pricing">OpticOdds pricing</SourceLink>,{' '}
        <SourceLink href="https://kalshi.com/docs/kalshi-fee-schedule.pdf">Kalshi fees</SourceLink>,{' '}
        <SourceLink href="https://docs.kalshi.com/api-reference/market/get-multiple-market-orderbooks">Kalshi order books</SourceLink>, and{' '}
        <SourceLink href="https://docs.sportradar.com/uof/api-and-structure/api/probabilities-api-and-cashout/sport-event-probabilities/endpoint">Sportradar probabilities</SourceLink>.
      </p>
    </section>
  );
}
