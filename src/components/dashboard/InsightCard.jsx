export function InsightCard({ title, description, badge, accent = 'bg-slate-900' }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className={`h-1.5 w-16 rounded-full ${accent}`} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {badge}
          </span>
        ) : null}
      </div>
    </article>
  );
}
