export function SummaryCard({ title, value, subtitle, icon, tone = 'slate' }) {
  const toneStyles = {
    emerald:
      'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/25',
    rose:
      'border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/25',
    slate:
      'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70',
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
      className={`group rounded-3xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${cardTone}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            <span className={`h-1.5 w-1.5 rounded-full ${accentTone}`} aria-hidden="true" />
            {title}
          </p>
          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[2.45rem]">
            {value}
          </h3>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:scale-105 dark:bg-slate-900 dark:ring-white/10 sm:h-12 sm:w-12 sm:text-xl">
          <span aria-hidden="true">{icon}</span>
        </div>
      </div>
    </article>
  );
}
