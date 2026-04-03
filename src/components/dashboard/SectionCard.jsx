export function SectionCard({
  title,
  subtitle,
  action,
  children,
  id,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) {
  return (
    <section
      id={id}
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 ${subtitleClassName}`}
          >
            {subtitle}
          </p>
          <h3
            className={`mt-1 inline-flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100 ${titleClassName}`}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              ◦
            </span>
            {title}
          </h3>
        </div>
        {action ? action : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
