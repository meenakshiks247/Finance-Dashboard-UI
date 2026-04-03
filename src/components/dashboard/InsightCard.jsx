import { useDashboard } from '../../context/DashboardContext';

export function InsightCard({
  title,
  description,
  badge,
  label,
  icon = '•',
  tone = 'blue',
  className = '',
}) {
  const { theme } = useDashboard();
  const isDark = theme === 'dark';

  const toneStylesLight = {
    green: 'border-[#A7F3D0] bg-[#ECFDF5]',
    peach: 'border-[#FDBA74] bg-[#FFF1F2]',
    blue: 'border-[#BFDBFE] bg-[#EFF6FF]',
    slate: 'border-slate-200 bg-white',
  };

  const toneStylesDark = {
    green: 'border-slate-700 bg-slate-900',
    peach: 'border-slate-700 bg-slate-900',
    blue: 'border-slate-700 bg-slate-900',
    slate: 'border-slate-700 bg-slate-900',
  };

  const iconStylesLight = {
    green: 'border border-[#A7F3D0] bg-white/90 text-emerald-700 shadow-sm',
    peach: 'border border-[#FBCFE8] bg-white/90 text-rose-700 shadow-sm',
    blue: 'border border-[#BFDBFE] bg-white/90 text-sky-700 shadow-sm',
    slate: 'bg-slate-100 text-slate-700',
  };

  const iconStylesDark = {
    green: 'border border-slate-700 bg-slate-800 text-emerald-300',
    peach: 'border border-slate-700 bg-slate-800 text-rose-300',
    blue: 'border border-slate-700 bg-slate-800 text-sky-300',
    slate: 'border border-slate-700 bg-slate-800 text-slate-100',
  };

  const toneStyles = isDark ? toneStylesDark : toneStylesLight;
  const iconStyles = isDark ? iconStylesDark : iconStylesLight;

  const cardTone = toneStyles[tone] ?? toneStyles.slate;
  const iconTone = iconStyles[tone] ?? iconStyles.slate;
  const headingClass = isDark ? 'text-white' : 'theme-text-strong';
  const mutedClass = isDark ? 'text-slate-400' : 'theme-muted';
  const labelClass = isDark ? 'text-white' : 'theme-text-strong';
  const badgeClass = isDark
    ? 'rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 shadow-sm transition duration-300 group-hover:shadow'
    : 'theme-surface-soft theme-text rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition duration-300 group-hover:shadow';

  return (
    <article
      className={`group motion-card motion-fade-up rounded-2xl border p-4 shadow-sm shadow-slate-900/5 sm:p-5 ${cardTone} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[11px] font-medium uppercase tracking-[0.14em] ${labelClass}`}>
          {label || 'Insight'}
        </span>
        {badge ? (
          <span className={badgeClass}>
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-start gap-3.5">
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${iconTone}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h4 className={`text-lg font-semibold leading-6 ${headingClass}`}>{title}</h4>
          <p className={`mt-1.5 text-sm font-normal leading-6 ${mutedClass}`}>{description}</p>
        </div>
      </div>
    </article>
  );
}
