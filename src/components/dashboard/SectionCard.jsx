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
      className={`theme-surface motion-card rounded-[2rem] border p-4 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex flex-col gap-3 border-b theme-border pb-3.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className={`theme-muted text-xs font-medium uppercase tracking-[0.18em] ${subtitleClassName}`}
          >
            {subtitle}
          </p>
          <h3
            className={`theme-text-strong mt-1 inline-flex items-center gap-2 text-2xl font-semibold ${titleClassName}`}
          >
            <span className="theme-surface-soft theme-muted inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
              ◦
            </span>
            {title}
          </h3>
        </div>
        {action ? action : null}
      </div>

      <div>{children}</div>
    </section>
  );
}
