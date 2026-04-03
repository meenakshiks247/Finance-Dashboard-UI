export function SectionCard({ title, subtitle, action, children, id }) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            {subtitle}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        {action ? action : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
