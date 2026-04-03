export function SummaryCard({ title, value, subtitle, icon, tone = 'slate', className = '' }) {
  const toneStyles = {
    emerald:
      'border-emerald-200 bg-emerald-50/95 dark:border-emerald-900/60 dark:bg-emerald-950/25',
    rose:
      'border-rose-200 bg-rose-50/95 dark:border-rose-900/60 dark:bg-rose-950/25',
    slate:
      'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/70',
  };

  const accentStyles = {
    emerald: 'bg-emerald-500/80',
    rose: 'bg-rose-500/80',
    slate: 'bg-slate-500/80',
  };

  const cardTone = toneStyles[tone] ?? toneStyles.slate;
  const accentTone = accentStyles[tone] ?? accentStyles.slate;

  return (
    <article
      className={`group motion-card motion-fade-up rounded-3xl border p-5 shadow-sm sm:p-6 ${cardTone} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="theme-muted inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
            <span className={`h-1.5 w-1.5 rounded-full ${accentTone}`} aria-hidden="true" />
            {title}
          </p>
          <h3 className="theme-text-strong mt-3 text-4xl font-bold tracking-tight sm:text-[2.45rem]">
            {value}
          </h3>
          <p className="theme-muted mt-2 text-xs font-medium uppercase tracking-[0.1em]">
            {subtitle}
          </p>
        </div>

        <div className="theme-surface-soft theme-text flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-xl">
          <span aria-hidden="true">{icon}</span>
        </div>
      </div>
    </article>
  );
}
