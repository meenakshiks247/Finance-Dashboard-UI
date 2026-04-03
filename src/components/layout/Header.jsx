import { useDashboard } from '../../context/DashboardContext';
import { navigationItems } from '../../data/dashboardData';

export function Header() {
  const { role, setRole, theme, toggleTheme } = useDashboard();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Finance Dashboard
                </p>
                <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                  Minimal finance overview
                </h1>
              </div>

              <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:block lg:hidden">
                Sticky navbar
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-1 lg:justify-center lg:pb-0">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition duration-200 ${
                    item.active
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/30 dark:bg-white dark:text-slate-950 dark:ring-white/30'
                      : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-900 hover:shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:items-center lg:flex lg:flex-wrap lg:justify-end">
              <label className="flex h-10 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-600 shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="font-medium text-slate-500 dark:text-slate-300">Role</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="min-w-0 flex-1 rounded-md bg-transparent text-sm font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:text-slate-100 dark:focus-visible:ring-slate-600"
                  aria-label="Select dashboard role"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Responsive finance dashboard</span>
            <span className="hidden sm:inline">Role: {role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
