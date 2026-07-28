import { Link } from 'react-router-dom';
import { ideas } from '../data/ideas';
import { StatusBadge } from '../components/StatusBadge';

export function Home() {
  return (
    <>
      <Hero />
      <Repository />
    </>
  );
}

function Hero() {
  return (
    <section className="ideas-hero">
      <div className="ideas-hero-orbit" aria-hidden><span /></div>
      <div className="relative z-[1] mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em]">The workbench</p>
        <h1 className="display max-w-5xl text-6xl leading-[0.92] sm:text-7xl md:text-8xl">
          Projects <span className="ideas-highlight">and ideas.</span>
        </h1>
        <div className="mt-8 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-[17px] leading-8">
            Software, experiments, product ideas, and technical plans. Some are prototypes;
            some are rough sketches; all of them are here so I can keep pulling on the thread.
          </p>
          <p className="shrink-0 font-mono text-xs">{ideas.length} entries ↘</p>
        </div>
      </div>
    </section>
  );
}

function Repository() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="display text-4xl text-[color:var(--color-accent)] sm:text-5xl">The repository</h2>
        <p className="text-sm text-[color:var(--color-ink-mute)]">Newest entries appear at the bottom.</p>
      </div>

      <ol className="repository-list border-t border-[color:var(--color-rule)]">
        {ideas.map((idea) => (
          <li key={idea.slug} className="border-b border-[color:var(--color-rule)]">
            <Link to={`/${idea.slug}`} className="repository-link group grid gap-3 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-start sm:gap-6 sm:py-7">
              <span className="font-mono text-xs text-[color:var(--color-accent)]">{idea.number}</span>
              <div>
                <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-[color:var(--color-accent)] sm:text-[1.75rem]">
                  {idea.title}
                </h3>
                <p className="mt-2 max-w-3xl text-[14px] leading-6 text-[color:var(--color-ink-mute)]">
                  {idea.tagline}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <StatusBadge status={idea.status} />
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
