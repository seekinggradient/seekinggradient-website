export function About() {
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-6">
        Why this exists
      </p>
      <h1 className="display text-4xl sm:text-6xl leading-[1.02]">
        About this <span className="display-italic">notebook</span>.
      </h1>

      <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          This notebook exists to make product thinking inspectable. Each entry names a friction,
          proposes a mechanism, and records the questions that could change or kill it.
        </p>
        <p>
          Some entries remain seeds. Others accumulate mockups, sources, technical plans, and
          prototypes. The status changes when the evidence changes.
        </p>
        <p>
          The work is published as <em className="font-serif">Seeking Gradient</em>. There are no
          analytics or comments; specific responses are welcome by email.
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
