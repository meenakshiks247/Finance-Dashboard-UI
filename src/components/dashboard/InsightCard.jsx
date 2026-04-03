export function InsightCard({
  title,
  description,
  badge,
  label,
  icon = '•',
  tone = 'slate',
  className = '',
}) {
  const toneStyles = {
    slate: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40',
    rose: 'border-rose-200 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/20',
    amber: 'border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20',
    emerald: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/20',
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
      className={`group motion-card motion-fade-up rounded-3xl border p-4 shadow-sm sm:p-5 ${cardTone} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="theme-muted text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label || 'Insight'}
        </span>
        {badge ? (
          <span className="theme-surface-soft theme-text rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition duration-300 group-hover:shadow">
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
          <h4 className="theme-text-strong text-base font-semibold">{title}</h4>
          <p className="theme-muted mt-1.5 text-sm leading-6">{description}</p>
        </div>
      </div>
    </article>
  );
}
