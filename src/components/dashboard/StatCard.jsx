import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';

const toneClasses = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-indigo-600',
  amber: 'from-amber-500 to-orange-600',
  violet: 'from-violet-500 to-fuchsia-600',
};

export function StatCard({ label, value, change, format, tone }) {
  const displayValue = format === 'percentage' ? `${value}%` : formatCurrency(value);
  const changeLabel = formatPercentage(change);
  const colorClass = toneClasses[tone] ?? toneClasses.blue;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${colorClass}`} />
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
          {format === 'currency' ? formatCompactCurrency(value) : displayValue}
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            change >= 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {changeLabel}
        </span>
      </div>
    </article>
  );
}
