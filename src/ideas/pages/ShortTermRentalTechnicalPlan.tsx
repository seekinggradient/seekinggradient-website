import { Link } from 'react-router-dom';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
      {children}
    </h2>
  );
}

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

function NoteCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-2">
        {title}
      </div>
      <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
    </div>
  );
}

const principles = [
  {
    title: 'Address first',
    body: 'The address is the durable primitive. It unlocks geocoding, nearby venues, hotel clusters, market seasonality, and event catchment before asking the host to connect any channel.',
  },
  {
    title: 'Explain before automate',
    body: 'The product should say why a date matters, what signal changed, and how confident it is. Manual copy/apply beats brittle automation in the first version.',
  },
  {
    title: 'Signals, not certainties',
    body: 'Hotel rates, event calendars, and local calendars are proxies. The system should produce a confidence-weighted recommendation, not pretend to know the one true nightly rate.',
  },
];

const architecture = [
  ['Identity + property setup', 'Email login, property address, timezone, property type, bedrooms, max guests, listing URL as a reference, and optional manual listing text/photo intake.'],
  ['Geocoding + place graph', 'Normalize the address, store coordinates, find nearby hotels, venues, campuses, stadiums, convention centers, transit points, beaches, and tourism corridors.'],
  ['Demand-source ingestion', 'Scheduled jobs pull Ticketmaster events, venue calendars, sports schedules, university dates, public tourism calendars, weather, and hotel-rate samples.'],
  ['Signal normalization', 'Convert raw events and hotel prices into comparable per-date signals: proximity, attendance, category, hotel pressure, confidence, and explanation text.'],
  ['Recommendation engine', 'Score each date for the next 90 days, then propose rate posture, minimum-night rules, gap discounts, and listing-copy opportunities.'],
  ['Host surfaces', 'Dashboard, calendar overlay, weekly email briefing, listing optimizer, source drill-down, and a change log of what the host actually applied.'],
];

const dataSources = [
  {
    source: 'Google Maps Platform',
    use: 'Address validation, geocoding, nearby hotels, venues, landmarks, and map display.',
    cost: 'Low at MVP scale; watch Places and map-load usage as onboarding grows.',
    caveat: 'Use field masks and cache stable place IDs/details where terms allow.',
  },
  {
    source: 'Ticketmaster Discovery API',
    use: 'Concerts, sports, venue events, and other ticketed demand drivers near the property.',
    cost: 'Public API access with default quota; good cheap first event source.',
    caveat: 'Not complete coverage. Festivals, conferences, school events, and local calendars need other sources.',
  },
  {
    source: 'Amadeus Hotels APIs',
    use: 'Hotel list by geocode and future hotel offers as a hotel-rate pressure proxy.',
    cost: 'Self-service test quota, production pay-as-you-go after free thresholds.',
    caveat: 'Coverage and availability vary by market; this should be a signal, not the only price source.',
  },
  {
    source: 'Booking.com Demand API',
    use: 'Richer accommodations inventory, availability, and rates if affiliate access is approved.',
    cost: 'Partner/affiliate access rather than simple public self-serve pricing.',
    caveat: 'Better as a second provider after proving the MVP.',
  },
  {
    source: 'Expedia Rapid API',
    use: 'Hotel content, rates, and availability through an established travel affiliate API.',
    cost: 'Partner-led access and commercial terms.',
    caveat: 'Strong hotel coverage, but probably not the fastest way to prototype.',
  },
  {
    source: 'PredictHQ',
    use: 'Enriched global events, demand intelligence, predicted attendance, impact areas, and forecasting features.',
    cost: 'Free trial/demo path; commercial pricing is sales-led.',
    caveat: 'Likely the premium data layer once revenue justifies it.',
  },
];

const hotelStrategy = [
  ['Discover comps', 'For each property, find 10-25 nearby hotels within one to three miles. Keep distance, star/category, chain, and whether the hotel is in the same demand corridor.'],
  ['Sample future dates', 'Query one-night and two-night stays across the next 90 days. Start with weekly refreshes, then recheck high-signal dates daily as they approach.'],
  ['Build baselines', 'Compare each hotel/date against that hotel\'s rolling future baseline and the market baseline for the same weekday/season.'],
  ['Create pressure index', 'Aggregate median rate lift, sellout/empty responses, number of hotels available, and distance-weighted relevance into a hotel pressure score.'],
  ['Explain simply', 'Surface the reason as: nearby hotels are pricing 42% above their normal future baseline, with two overlapping events inside 1.6 miles.'],
];

const costScenarios = [
  {
    stage: 'Prototype',
    scale: '1 city, 25-100 test properties',
    monthly: '$75-$300/mo',
    includes: 'Vercel/Supabase or similar, transactional email, Google Maps/Places inside free or low paid usage, light LLM usage, Ticketmaster, and Amadeus test/low production usage.',
  },
  {
    stage: 'Private beta',
    scale: '250-1,000 properties',
    monthly: '$500-$2,500/mo',
    includes: 'Production database, queues/workers, monitoring, email, more Places calls, hotel-rate sampling, OpenAI listing analysis, retries, and a small cache/data warehouse.',
  },
  {
    stage: 'Paid launch',
    scale: '2,000-10,000 properties',
    monthly: '$3,000-$15,000+/mo',
    includes: 'Higher hotel-rate sampling, paid event intelligence, observability, support tools, backups, data QA, and likely one premium event or hotel data contract.',
  },
  {
    stage: 'Data-rich product',
    scale: 'Multi-market, serious revenue intelligence',
    monthly: '$15,000-$75,000+/mo',
    includes: 'PredictHQ or similar, Booking/Expedia or other hotel-rate partnerships, richer STR comps, SLA-backed infrastructure, and human data QA for important markets.',
  },
];

const buildCosts = [
  ['Solo MVP', '$15k-$40k equivalent effort', '4-8 weeks if one strong full-stack builder uses managed services and keeps integrations narrow.'],
  ['Small team MVP', '$50k-$120k', '8-12 weeks for product, backend, frontend, scheduled ingestion, source QA, and first useful recommendation engine.'],
  ['Production beta', '$150k-$350k', '3-6 months with integrations, billing, support, monitoring, data quality tools, auth, permissions, and host-facing polish.'],
  ['Ongoing maintenance', '$5k-$30k+/mo in labor', 'Depends on whether this is founder-maintained, contractor-assisted, or run by a small product/data team. Data QA is the sneaky recurring cost.'],
];

const phases = [
  ['Phase 1', 'Address radar', 'Login, address onboarding, geocoding, place graph, static demand drivers, and a mocked 90-day calendar.'],
  ['Phase 2', 'Live signals', 'Ticketmaster events, local venue calendar ingestion, hotel list discovery, Amadeus hotel-rate sampling, and confidence scoring.'],
  ['Phase 3', 'Host briefing', 'Weekly email, top recommended date changes, minimum-night suggestions, source links, and manual apply/copy workflow.'],
  ['Phase 4', 'Listing optimizer', 'Host-pasted listing text, amenity checklist, photo-order guidance, event-aware copy suggestions, and before/after review.'],
  ['Phase 5', 'Integrations', 'Calendar import, PMS/channel-manager integrations, richer hotel providers, paid event intelligence, and applied-change tracking.'],
];

const risks = [
  ['Airbnb ingestion', 'Do not build the MVP around scraping Airbnb pages. Ask hosts to paste listing text or connect approved PMS/channel-manager data.'],
  ['False confidence', 'Every recommendation needs source visibility, a confidence level, and conservative language around revenue impact.'],
  ['API cost creep', 'Hotel-rate sampling can explode if every property checks every hotel every date every day. Batch by market and cache shared hotel/date observations.'],
  ['Coverage holes', 'Ticketed events are easy; conferences, graduations, tournaments, festivals, and local calendars require market-specific ingestion and QA.'],
  ['Regulatory context', 'Hosts also need reminders about permits, taxes, occupancy limits, and local rules, but the app should avoid presenting legal advice.'],
];

export function ShortTermRentalTechnicalPlan() {
  return (
    <article>
      <header className="border-b border-[color:var(--color-rule)]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-12 sm:pt-16 pb-12">
          <Link
            to="/short-term-rental-demand-radar"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span aria-hidden>←</span> Back to the idea
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            <span className="font-mono normal-case tracking-normal text-[13px]">N° 013</span>
            <span aria-hidden>·</span>
            <span>Technical plan</span>
            <span aria-hidden>·</span>
            <span className="font-mono normal-case tracking-normal text-[13px]">2026</span>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] mt-6">
            Building the short-term rental demand radar
          </h1>
          <p className="mt-5 text-lg text-[color:var(--color-ink-soft)] max-w-prose">
            A practical architecture, data-source plan, and cost model for an address-based host assistant that explains local demand and turns it into pricing and listing actions.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-14">
        <section className="mb-14">
          <SectionLabel>Starting stance</SectionLabel>
          <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
            <p>
              The best entry point is the property address, not the Airbnb listing link. The address is stable across Airbnb, Vrbo, direct booking sites, PMS tools, and future channels. It gives the system the local context that pricing tools often flatten: which venues are close, which hotel cluster competes for the same guests, which campus weekends matter, and which dates deserve attention.
            </p>
            <p>
              The listing link can still be useful as a human reference, but the first version should not depend on automatically extracting Airbnb data. Airbnb's current terms prohibit bots, crawlers, and scrapers from accessing or collecting platform content, so the clean path is host-provided listing text, uploaded screenshots/photos, or approved channel-manager/PMS integrations later.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Product principles</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-3">
            {principles.map((item) => (
              <NoteCard key={item.title} title={item.title} body={item.body} />
            ))}
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>System architecture</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {architecture.map(([title, body]) => (
              <NoteCard key={title} title={title} body={body} />
            ))}
          </div>

          <SubLabel>Reference stack</SubLabel>
          <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <pre className="overflow-x-auto whitespace-pre text-[12px] leading-[1.7] font-mono text-[color:var(--color-ink)]">
{`Next.js / React app
  -> Supabase or Postgres for users, properties, events, hotel samples
  -> Redis/queue for ingestion jobs and retries
  -> scheduled workers for event + hotel-rate refreshes
  -> OpenAI for listing analysis and host-facing explanations
  -> Resend or similar for weekly briefings
  -> Stripe when paid plans begin`}
            </pre>
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Data sources</SectionLabel>
          <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
            <table className="min-w-[900px] w-full border-collapse text-left text-sm">
              <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
                <tr>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Source</th>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Use</th>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Cost posture</th>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Caveat</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((row) => (
                  <tr key={row.source} className="align-top">
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{row.source}</td>
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{row.use}</td>
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{row.cost}</td>
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{row.caveat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Hotel-rate proxy</SectionLabel>
          <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
            <p>
              Nearby hotel prices are probably the best first proxy for real demand tightening. They are not perfect comps for a short-term rental, but they reveal whether professional revenue systems in the same area are already pricing up for a date.
            </p>
          </div>
          <div className="grid gap-4 mt-6">
            {hotelStrategy.map(([title, body]) => (
              <div key={title} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.28fr_0.72fr]">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{title}</div>
                <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Cost model</SectionLabel>
          <SubLabel>Build cost</SubLabel>
          <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-[color:var(--color-paper-deep)]">
                <tr>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Path</th>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Likely cost</th>
                  <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">What it buys</th>
                </tr>
              </thead>
              <tbody>
                {buildCosts.map(([path, cost, detail]) => (
                  <tr key={path} className="align-top">
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{path}</td>
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{cost}</td>
                    <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubLabel>Monthly run cost</SubLabel>
          <div className="grid gap-4">
            {costScenarios.map((scenario) => (
              <div key={scenario.stage} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.22fr_0.24fr_0.18fr_0.36fr]">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{scenario.stage}</div>
                <div className="text-[15px] text-[color:var(--color-ink-soft)]">{scenario.scale}</div>
                <div className="font-medium text-[color:var(--color-ink)]">{scenario.monthly}</div>
                <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{scenario.includes}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-mute)]">
            Cost ranges are planning estimates as of June 2026. The biggest variable is not hosting; it is how often the system samples hotel prices and whether premium event data is needed.
          </p>
        </section>

        <section className="mb-14">
          <SectionLabel>Build sequence</SectionLabel>
          <div className="grid gap-4">
            {phases.map(([phase, title, body]) => (
              <div key={phase} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.2fr_0.28fr_0.52fr]">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{phase}</div>
                <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
                <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Risks and controls</SectionLabel>
          <div className="grid gap-4">
            {risks.map(([title, body]) => (
              <div key={title} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.28fr_0.72fr]">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{title}</div>
                <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <SectionLabel>Source notes</SectionLabel>
          <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
            Source checks used for this planning page include{' '}
            <SourceLink href="https://www.airbnb.com/help/article/2908">Airbnb Terms of Service</SourceLink>,{' '}
            <SourceLink href="https://developers.google.com/maps/documentation/places/web-service/nearby-search">Google Places Nearby Search</SourceLink>,{' '}
            <SourceLink href="https://mapsplatform.google.com/pricing/">Google Maps Platform pricing</SourceLink>,{' '}
            <SourceLink href="https://developer.ticketmaster.com/products-and-docs/apis/getting-started/">Ticketmaster developer docs</SourceLink>,{' '}
            <SourceLink href="https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/resources/hotels/">Amadeus hotel API docs</SourceLink>,{' '}
            <SourceLink href="https://developers.booking.com/demand/docs/open-api/demand-api/accommodations/accommodations/availability">Booking.com Demand API docs</SourceLink>,{' '}
            <SourceLink href="https://developers.expediagroup.com/rapid/lodging/shopping/about-shopping-api">Expedia Rapid Shopping API docs</SourceLink>,{' '}
            <SourceLink href="https://www.predicthq.com/pricing">PredictHQ pricing/product page</SourceLink>,{' '}
            <SourceLink href="https://openai.com/api/pricing/">OpenAI API pricing</SourceLink>,{' '}
            <SourceLink href="https://vercel.com/pricing">Vercel pricing</SourceLink>,{' '}
            <SourceLink href="https://supabase.com/pricing">Supabase pricing</SourceLink>, and{' '}
            <SourceLink href="https://resend.com/pricing">Resend pricing</SourceLink>.
          </p>
        </section>
      </div>
    </article>
  );
}
