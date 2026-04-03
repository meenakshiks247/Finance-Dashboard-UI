export function SummaryCard({ title, value, subtitle, icon, tone = 'slate' }) {
  const toneStyles = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  };

  const cardTone = toneStyles[tone] ?? toneStyles.slate;

  return (
    <article className={`rounded-3xl border p-5 shadow-sm transition ${cardTone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
          <p className="mt-2 text-sm font-medium text-slate-600">{subtitle}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm">
          <span aria-hidden="true">{icon}</span>
        </div>
      </div>
    </article>
  );
}
