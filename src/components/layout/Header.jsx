import { useDashboard } from '../../context/DashboardContext';
import { navigationItems } from '../../data/dashboardData';

export function Header() {
  const { role, setRole, theme, toggleTheme } = useDashboard();

  return (
    <header className="theme-surface sticky top-0 z-20 border-b theme-border backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="theme-surface flex flex-col gap-3 rounded-3xl border px-4 py-3 transition-colors md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="theme-muted text-xs font-semibold uppercase tracking-[0.22em]">
                  Finance Dashboard
                </p>
                <h1 className="theme-text-strong text-base font-semibold sm:text-lg">
                  Minimal finance overview
                </h1>
              </div>

              <div className="theme-surface-soft theme-text hidden rounded-full border px-3 py-1 text-xs font-medium sm:block lg:hidden">
                Sticky navbar
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-1 lg:justify-center lg:pb-0">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`motion-tab inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-medium ${
                    item.active
                      ? 'bg-[var(--accent)] text-[var(--color-on-accent)] scale-[1.02] shadow-sm ring-1 ring-black/10 dark:ring-white/20'
                      : 'theme-surface-soft theme-text border hover:brightness-95 hover:shadow-sm'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:items-center lg:flex lg:flex-wrap lg:justify-end">
              <label className="motion-control theme-surface-soft flex h-10 items-center gap-3 rounded-2xl border px-3.5 text-sm shadow-sm">
                <span className="theme-muted font-medium">Role</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="theme-text min-w-0 flex-1 rounded-md bg-transparent text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
                  aria-label="Select dashboard role"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>

              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary motion-control h-10 px-3.5"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          <div className="theme-muted flex items-center justify-between gap-3 border-t theme-border pt-2.5 text-sm">
            <span>Responsive finance dashboard</span>
            <span className="hidden sm:inline">Role: {role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
