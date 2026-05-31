import { Link } from 'react-router-dom';
import { ideas } from '../data/ideas';
import { StatusBadge } from '../components/StatusBadge';

export function Home() {
  return (
    <>
      <Hero />
      <IndexList />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-[color:var(--color-rule)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-6">
              Volume One · An open notebook
            </p>
            <h1 className="display text-5xl sm:text-7xl md:text-[88px] leading-[0.95]">
              Ideas, kept{' '}
              <span className="display-italic text-[color:var(--color-accent)]">in the open</span>
              <span className="text-[color:var(--color-ink-mute)]">.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:pb-3">
            <p className="text-base leading-relaxed text-[color:var(--color-ink-soft)] max-w-prose">
              A small archive of things I might build, written down so they can be examined and
              argued with. None of these are launched products — they are sketches, in different
              stages of confidence.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
          <span>{ideas.length} entries</span>
          <span aria-hidden>·</span>
          <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <span aria-hidden>·</span>
          <span>By Seeking Gradient</span>
        </div>
      </div>
    </section>
  );
}

function IndexList() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="display text-2xl sm:text-3xl">The Index</h2>
        <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
          Listed by entry
        </span>
      </div>

      <ol className="divide-y divide-[color:var(--color-rule)] border-y border-[color:var(--color-rule)]">
        {ideas.map((idea) => (
          <li key={idea.slug}>
            <Link
              to={`/${idea.slug}`}
              className="group block py-7 sm:py-9 -mx-3 sm:-mx-5 px-3 sm:px-5 rounded-lg hover:bg-[color:var(--color-paper-deep)]/50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 sm:gap-6 items-baseline">
                <div className="col-span-12 sm:col-span-2">
                  <span className="font-mono text-xs text-[color:var(--color-ink-mute)]">
                    {idea.number}
                  </span>
                </div>
                <div className="col-span-12 sm:col-span-7">
                  <h3 className="display text-2xl sm:text-3xl md:text-[34px] leading-tight group-hover:text-[color:var(--color-accent)] transition-colors">
                    {idea.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-[color:var(--color-ink-soft)] max-w-prose">
                    {idea.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
                    <span>{idea.domain}</span>
                    {idea.tags.slice(0, 3).map((t) => (
                      <span key={t} className="font-mono normal-case tracking-normal text-[12px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-3 sm:text-right">
                  <div className="inline-flex flex-col sm:items-end gap-2">
                    <StatusBadge status={idea.status} />
                    <span className="text-xs text-[color:var(--color-ink-mute)] font-mono">
                      {idea.year}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
