import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
        404
      </p>
      <h1 className="display text-5xl sm:text-7xl mt-6">
        Not <span className="display-italic">filed</span>.
      </h1>
      <p className="mt-6 text-[color:var(--color-ink-soft)]">
        That entry isn&apos;t in the notebook — or it hasn&apos;t been written yet.
      </p>
      <Link
        to="/"
        className="inline-block mt-10 text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)] link-underline"
      >
        Return to the index
      </Link>
    </section>
  );
}
