import { useLayout } from '../../context/LayoutContext';
import { navigationItems } from '../../data/dashboardData';

export function Header() {
  const { role, setRole, theme, toggleTheme } = useLayout();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Finance Dashboard
                </p>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
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
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    item.active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="font-medium text-slate-500 dark:text-slate-300">Role</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="min-w-28 bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-slate-100"
                  aria-label="Select dashboard role"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Responsive finance dashboard</span>
            <span className="hidden sm:inline">Role: {role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
