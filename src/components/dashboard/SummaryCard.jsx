import { useDashboard } from '../../context/DashboardContext';

export function SummaryCard({ title, value, subtitle, icon, tone = 'slate', className = '' }) {
  const { theme } = useDashboard();
  const isDark = theme === 'dark';

  const toneStylesLight = {
    blue: 'border-[#BFDBFE] bg-[#EFF6FF]',
    green: 'border-[#A7F3D0] bg-[#ECFDF5]',
    purple: 'border-[#FDBA74] bg-[#FFE5D9]',
    slate: 'border-slate-200 bg-white',
  };

  const toneStylesDark = {
    blue: 'border-slate-700 bg-slate-900',
    green: 'border-slate-700 bg-slate-900',
    purple: 'border-slate-700 bg-slate-900',
    slate: 'border-slate-700 bg-slate-900',
  };

  const accentStyles = {
    blue: 'bg-[#BFDBFE]',
    green: 'bg-[#A7F3D0]',
    purple: 'bg-[#FDBA74]',
    slate: 'bg-slate-500/80',
  };

  const iconStylesLight = {
    blue: 'bg-white/80 text-blue-700 border-[#BFDBFE]',
    green: 'bg-white/80 text-emerald-700 border-[#A7F3D0]',
    purple: 'bg-white/80 text-amber-700 border-[#FDBA74]',
    slate: 'bg-white/80 text-slate-700 border-slate-200',
  };

  const iconStylesDark = {
    blue: 'bg-slate-800 text-blue-300 border-slate-700',
    green: 'bg-slate-800 text-emerald-300 border-slate-700',
    purple: 'bg-slate-800 text-amber-300 border-slate-700',
    slate: 'bg-slate-800 text-slate-200 border-slate-700',
  };

  const toneStyles = isDark ? toneStylesDark : toneStylesLight;
  const iconStyles = isDark ? iconStylesDark : iconStylesLight;

  const cardTone = toneStyles[tone] ?? toneStyles.slate;
  const accentTone = accentStyles[tone] ?? accentStyles.slate;
  const iconTone = iconStyles[tone] ?? iconStyles.slate;
  const titleTextClass = isDark ? 'text-slate-300' : 'text-[#64748B]';
  const valueTextClass = isDark ? 'text-white' : 'text-[#0F172A]';
  const subtitleTextClass = isDark ? 'text-slate-400' : 'text-[#64748B]';

  return (
    <article
      className={`group motion-card motion-fade-up rounded-xl border p-6 shadow-sm transition duration-300 hover:shadow-md ${cardTone} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] ${titleTextClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accentTone}`} aria-hidden="true" />
            {title}
          </p>
          <h3 className={`mt-3 text-2xl font-bold tracking-tight ${valueTextClass}`}>
            {value}
          </h3>
          <p className={`mt-2 text-sm font-normal leading-5 ${subtitleTextClass}`}>
            {subtitle}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg shadow-sm transition duration-300 group-hover:scale-105 ${iconTone}`}>
          <span aria-hidden="true">{icon}</span>
        </div>
      </div>
    </article>
  );
}
