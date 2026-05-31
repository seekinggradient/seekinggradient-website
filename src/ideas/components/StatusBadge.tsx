import type { IdeaStatus } from '../data/ideas';

const labels: Record<IdeaStatus, string> = {
  seed: 'Seed',
  sketch: 'Sketch',
  exploring: 'Exploring',
  shelved: 'Shelved',
};

const styles: Record<IdeaStatus, string> = {
  seed: 'bg-[color:var(--color-paper-deep)] text-[color:var(--color-ink-soft)]',
  sketch: 'bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]',
  exploring: 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)]',
  shelved: 'bg-transparent text-[color:var(--color-ink-mute)] ring-1 ring-[color:var(--color-rule)]',
};

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium ${styles[status]}`}
    >
      <span className="inline-block size-1 rounded-full bg-current opacity-70" />
      {labels[status]}
    </span>
  );
}
