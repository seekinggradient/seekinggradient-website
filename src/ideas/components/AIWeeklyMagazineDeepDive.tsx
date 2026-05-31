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

const thesisCards = [
  {
    label: 'Audience',
    title: 'AI adoption is broad, but the market is still confusing.',
    body:
      'McKinsey reports that 88 percent of surveyed organizations use AI in at least one business function, while most have not scaled it across the enterprise. That creates a reader who needs context, not just announcements.',
  },
  {
    label: 'Timing',
    title: 'Agents, tools, and launches create weekly entropy.',
    body:
      'Stack Overflow says 51 percent of professional developers use AI tools daily, and McKinsey says 62 percent of respondents are experimenting with AI agents. A weekly print cadence matches the speed of the category without becoming a feed.',
  },
  {
    label: 'Medium',
    title: 'Print can be a premium attention surface again.',
    body:
      'Publishers are bringing back or expanding print because it can support subscription packages, advertiser upsells, and a more engaged reader moment than crowded digital inventory.',
  },
];

const issueSections = [
  ['Front Desk', 'A one-page editor note plus the issue thesis: what mattered this week and what to ignore.'],
  ['The Week in AI', 'A tight news digest: model releases, policy, funding, major product launches, platform shifts.'],
  ['Signal Board', 'Ranked developments with why-it-matters notes, confidence, second-order effects, and watch-next links.'],
  ['Project Radar', 'Five to ten new AI projects worth trying, with target user, workflow fit, pricing, and adoption signals.'],
  ['Model Watch', 'A sober comparison of new models, evals, capabilities, pricing changes, and developer impact.'],
  ['Research to Product', 'One paper or technical idea translated into a builder-facing product opportunity.'],
  ['Operator Playbook', 'Practical pieces for teams buying or deploying AI: evals, security, workflow design, cost control.'],
  ['Builder Marketplace', 'Tasteful ads, launch cards, hiring notes, API announcements, and tool classifieds.'],
  ['Opinion & Editorial', 'A sharp essay about where the industry is overreacting, underreacting, or lying to itself.'],
  ['Back Page', 'A memorable chart, quote, prompt artifact, teardown, crossword-style puzzle, or mini index.'],
];

const flatplan = [
  ['Cover', '1', 'Hero thesis, four cover lines, premium ad cue'],
  ['Briefing', '2-5', 'Front Desk, table of contents, The Week in AI'],
  ['Radar', '6-11', 'Project Radar, Model Watch, launch scoreboard'],
  ['Feature', '12-21', 'Main editorial feature plus charts and sidebars'],
  ['Marketplace', '22-29', 'Launch cards, full-page ads, classifieds, sponsored demos'],
  ['Playbook', '30-35', 'Buyer guide, implementation note, research-to-product explainer'],
  ['Community', '36-39', 'Jobs, events, grants, open-source maintainers, office drops'],
  ['Back Page', '40', 'One keepable artifact: map, index, teardown, or provocation'],
];

const weeklyCadence = [
  ['Friday', 'Issue thesis lock', 'Pick the week angle, reserve the cover, close most ad inventory.'],
  ['Saturday', 'Research sprint', 'Pull launches, papers, funding, social signals, demos, policy, and reader tips.'],
  ['Sunday', 'Editorial meeting', 'Rank what matters, assign pieces, kill duplicates, choose the one big feature.'],
  ['Monday', 'Draft and ad ops', 'Write briefs, collect advertiser assets, produce launch cards, verify claims.'],
  ['Tuesday', 'Design and fact-check', 'Lay out pages, tighten headlines, check links, prices, screenshots, and claims.'],
  ['Wednesday', 'Proof and print handoff', 'Export PDF/X, preflight, approve proof, publish digital edition.'],
  ['Thursday', 'Ship and market', 'Mail paid copies, office drops, newsletter recap, social thread, advertiser reporting.'],
];

const pipeline = [
  ['Inputs', 'Launch posts, GitHub, arXiv, papers, newsletters, demos, funding news, tips, ad submissions'],
  ['Triage', 'Deduplicate, score novelty, verify claims, identify reader segment, classify paid vs editorial'],
  ['Editorial', 'Assign section, write short-form pages, edit feature, mark confidence and open questions'],
  ['Production', 'Flatplan, design templates, asset checks, preflight, digital links, print proof'],
  ['Distribution', 'Paid subscribers, office bundles, conferences, coworking drops, digital archive'],
  ['Learning loop', 'Renewals, QR scans, ad leads, reader saves, replies, inbound tips, issue retrospectives'],
];

const adProducts = [
  ['Launch Card', '$750-$1.5K pilot', 'Quarter-page listing with product, buyer, pricing, QR, and launch claim.'],
  ['Builder Classified', '$250-$500 pilot', 'Tiny high-signal classified for open-source tools, hiring, grants, demos.'],
  ['Full-page Print Ad', '$3K-$7.5K pilot', 'Premium placement for model infra, agent platforms, devtools, evals, or security.'],
  ['Sponsored Demo Tear-down', '$5K-$12K pilot', 'Clearly marked walkthrough with screenshots, use case, limits, and CTA.'],
  ['Conference Bundle', '$10K+ pilot', 'Sponsor an issue drop at an AI event, coworking space, or founder dinner.'],
  ['Category Ownership', 'Custom', 'Own a recurring page like Evals, Agents, Memory, Design, or AI Ops for a quarter.'],
];

const launchPlan = [
  ['0. Smoke test', 'Publish a gorgeous 12-page PDF and waitlist landing page. Sell founding subscriptions and founding advertiser slots before printing.'],
  ['1. Pilot issue', 'Print 250-500 copies through print-on-demand or a short-run printer. Mail to paid readers and hand-place copies in AI offices, labs, VC firms, and events.'],
  ['2. Three-issue season', 'Run three weekly or biweekly issues to test the cadence, renewal desire, advertiser lead quality, and production load.'],
  ['3. Bundle the product', 'Offer print plus digital archive, email briefing, subscriber office packs, and advertiser performance reports.'],
  ['4. Scale deliberately', 'Move to offset or negotiated short-run print only when paid demand, ad fill, and production repeatability are proven.'],
];

const metrics = [
  ['Reader pull', 'Paid conversions, renewals, waitlist-to-paid rate, office bundle requests, replies with tips.'],
  ['Advertiser value', 'Booked pages, QR scans, qualified leads, repeat buys, category ownership interest.'],
  ['Editorial trust', 'Corrections, cited-by mentions, inbound submissions, expert contributor acceptance.'],
  ['Operational health', 'Pages closed on time, proof errors, print cost per copy, fulfillment time, gross margin.'],
];

export function AIWeeklyMagazineDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        Deep dive - making AI Weekly real
      </h2>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {thesisCards.map((card) => (
          <div key={card.label} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-3">
              {card.label}
            </div>
            <h3 className="display text-2xl leading-tight text-[color:var(--color-ink)]">{card.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{card.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>The magazine has to become a map</SubLabel>
      <p className="text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        The core editorial promise should be simple: every week, AI Weekly tells a serious reader what changed, what is noise,
        what is worth trying, and who is selling something relevant. The strongest version is not a general tech magazine.
        It is a trade publication for the people building, buying, funding, regulating, and deploying AI products.
      </p>

      <SubLabel>Recurring sections</SubLabel>
      <div className="grid gap-3">
        {issueSections.map(([name, body], index) => (
          <div
            key={name}
            className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-4 sm:grid-cols-[0.12fr_0.28fr_0.6fr]"
          >
            <div className="font-mono text-[12px] text-[color:var(--color-accent)]">{String(index + 1).padStart(2, '0')}</div>
            <div className="font-medium text-[color:var(--color-ink)]">{name}</div>
            <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>40-page issue flatplan</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Block</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Pages</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {flatplan.map(([block, pages, purpose]) => (
              <tr key={block} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{block}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-accent)]">{pages}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border border-[color:var(--color-rule)] bg-[#fffaf0] p-4 sm:p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-4">
          Page mix sketch
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {flatplan.flatMap(([block, pages]) => {
            const count = pages === '1' ? 1 : Number(pages.split('-')[1]) - Number(pages.split('-')[0]) + 1;
            return Array.from({ length: count }, (_, i) => ({ block, index: i }));
          }).map((item, index) => (
            <div
              key={`${item.block}-${index}`}
              className={`min-h-14 border border-[color:var(--color-rule)] p-2 text-[10px] uppercase tracking-[0.12em] [overflow-wrap:anywhere] ${
                item.block === 'Marketplace'
                  ? 'bg-[#191919] text-[#fffaf0]'
                  : item.block === 'Feature'
                    ? 'bg-[#efe2d1] text-[color:var(--color-ink)]'
                    : 'bg-[color:var(--color-paper)] text-[color:var(--color-ink-mute)]'
              }`}
            >
              <div className="font-mono">{String(index + 1).padStart(2, '0')}</div>
              <div className="mt-2">{item.index === 0 ? item.block : ''}</div>
            </div>
          ))}
        </div>
      </div>

      <SubLabel>Weekly operating cadence</SubLabel>
      <div className="grid gap-4">
        {weeklyCadence.map(([day, title, body]) => (
          <div key={day} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.18fr_0.28fr_0.54fr]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{day}</div>
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <div className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>Production system</SubLabel>
      <div className="grid gap-3 md:grid-cols-6">
        {pipeline.map(([title, body], index) => (
          <div key={title} className="relative border border-[color:var(--color-rule)] bg-[#fffaf0] p-4">
            <div className="font-mono text-[11px] text-[color:var(--color-accent)]">{String(index + 1).padStart(2, '0')}</div>
            <div className="mt-3 font-medium text-[color:var(--color-ink)]">{title}</div>
            <p className="mt-2 text-[13px] leading-[1.55] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Publishing model</SubLabel>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          [
            'Digital first, print proof second',
            'Make the canonical issue in a print-ready layout, export a web/PDF edition with deep links, then proof the physical edition. The PDF is not a consolation prize; it is the searchable archive and sales sample.',
          ],
          [
            'Short-run before periodicals mail',
            'Start with print-on-demand or short-run printing so every copy is paid for or strategically placed. USPS Periodicals privileges can matter later, but they come with regularity, circulation, record-keeping, and ad-percentage requirements.',
          ],
          [
            'Office bundles as distribution',
            'Sell 5-copy and 20-copy team packs for startups, VC firms, AI labs, coworking spaces, and university centers. The best copy is the one that sits on a shared table and gets picked up by three more people.',
          ],
          [
            'Archive every ad',
            'The ad archive can become a market dataset: what AI companies launched, how they positioned, what categories became crowded, and what language disappeared. That history is valuable to readers and sponsors.',
          ],
        ].map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <h3 className="display text-2xl leading-tight text-[color:var(--color-ink)]">{title}</h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Ad products</SubLabel>
      <div className="overflow-x-auto border border-[color:var(--color-rule)] bg-[#fffaf0]">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink)]">
            <tr>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Product</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">Pilot price signal</th>
              <th className="border-b border-[color:var(--color-rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">What the buyer gets</th>
            </tr>
          </thead>
          <tbody>
            {adProducts.map(([product, price, body]) => (
              <tr key={product} className="align-top">
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-medium text-[color:var(--color-ink)]">{product}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 font-mono text-[13px] text-[color:var(--color-accent)]">{price}</td>
                <td className="border-t border-[color:var(--color-rule)] px-4 py-4 text-[color:var(--color-ink-soft)]">{body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-ink-mute)]">
        These are intentionally pilot ranges, not a final media kit. Real pricing should follow audience quality, circulation, category exclusivity, and advertiser lead reporting.
      </p>

      <SubLabel>Launch and marketing plan</SubLabel>
      <div className="grid gap-4">
        {launchPlan.map(([phase, body]) => (
          <div key={phase} className="grid gap-3 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:grid-cols-[0.25fr_0.75fr]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]">{phase}</div>
            <div className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">{body}</div>
          </div>
        ))}
      </div>

      <SubLabel>What to measure</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map(([title, body]) => (
          <div key={title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-medium text-[color:var(--color-ink)]">{title}</div>
            <p className="mt-2 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Source notes</SubLabel>
      <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        Research inputs included McKinsey's{' '}
        <SourceLink href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai">
          2025 State of AI survey
        </SourceLink>
        , Stack Overflow's{' '}
        <SourceLink href="https://survey.stackoverflow.co/2025/ai">
          2025 AI developer survey
        </SourceLink>
        , Stanford HAI's{' '}
        <SourceLink href="https://hai.stanford.edu/ai-index/2025-ai-index-report/economy%C2%A0">
          2025 AI Index economy chapter
        </SourceLink>
        , Axios on{' '}
        <SourceLink href="https://www.axios.com/2025/08/19/the-spectator-us-edition-print">
          renewed print expansion
        </SourceLink>
        , FIPP on{' '}
        <SourceLink href="https://www.fipp.com/news/paper-trail-media-voices-launches-new-report-looking-at-prints-revival/">
          the print revival
        </SourceLink>
        , eMagazines on{' '}
        <SourceLink href="https://emagazines.com/blog/magazine-production-steps-to-produce-print-digital-magazines/">
          magazine production workflow
        </SourceLink>
        , MagCloud on{' '}
        <SourceLink href="https://www.magcloud.com/products/formats/standard">
          print-on-demand magazine pricing
        </SourceLink>
        , and USPS PostalPro on{' '}
        <SourceLink href="https://postalpro.usps.com/periodicals">
          Periodicals mailing rules
        </SourceLink>
        .
      </p>
    </section>
  );
}
