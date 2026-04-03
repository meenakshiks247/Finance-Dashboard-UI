export function InsightCard({ title, description, badge, label, icon = '•', tone = 'slate' }) {
  const toneStyles = {
    slate: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40',
    rose: 'border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20',
    amber: 'border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20',
    emerald: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20',
  };

  const iconStyles = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  };

  const cardTone = toneStyles[tone] ?? toneStyles.slate;
  const iconTone = iconStyles[tone] ?? iconStyles.slate;

  return (
    <article
      className={`group rounded-3xl border p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${cardTone}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label || 'Insight'}
        </span>
        {badge ? (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover:shadow dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-start gap-3.5">
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${iconTone}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </article>
  );
}
