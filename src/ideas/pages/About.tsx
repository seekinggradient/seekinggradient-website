export function About() {
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-6">
        Colophon
      </p>
      <h1 className="display text-4xl sm:text-6xl leading-[1.02]">
        About this <span className="display-italic">notebook</span>.
      </h1>

      <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          This is a small public archive of ideas I keep returning to, written down so I can
          actually look at them. Some are early enough that the right next step is a conversation;
          others have prototypes attached. None are finished products.
        </p>
        <p>
          I post under the name <em className="font-serif">Seeking Gradient</em> — the work matters
          more than the byline. If something on here resonates, I&apos;d love to hear about it.
        </p>
        <p>
          The site is intentionally quiet: no analytics, no comment box, no newsletter signup. It
          is closer to a printed pamphlet than a feed.
        </p>
      </div>

      <hr className="my-12 border-[color:var(--color-rule)]" />

      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-4">
        Colophon
      </p>
      <ul className="text-sm text-[color:var(--color-ink-soft)] space-y-1.5">
        <li>Typeset in <span className="font-serif italic">Fraunces</span> and Inter.</li>
        <li>Built with Astro, React, and Tailwind.</li>
        <li>Hosted from the main Seeking Gradient website repo.</li>
      </ul>
    </section>
  );
}
