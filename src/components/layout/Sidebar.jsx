import { useLayout } from '../../context/LayoutContext';
import { navigationItems } from '../../data/dashboardData';

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <aside
      className={`theme-surface fixed inset-y-0 left-0 z-40 w-72 transform border-r px-5 py-6 transition-transform duration-300 lg:static lg:z-auto lg:h-auto lg:translate-x-0 lg:rounded-3xl lg:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <p className="theme-muted text-sm font-semibold uppercase tracking-[0.2em]">
          Menu
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={closeSidebar}
        >
          Close
        </button>
      </div>

      <div className="theme-on-accent rounded-3xl bg-[var(--accent)] p-5">
        <p className="text-sm opacity-75">Current Balance</p>
        <h2 className="mt-2 text-3xl font-semibold">$128,430</h2>
        <p className="mt-3 text-sm text-emerald-200 dark:text-emerald-500">+12.4% from last month</p>
      </div>

      <nav className="mt-8 space-y-2">
        <p className="theme-muted px-3 text-xs font-semibold uppercase tracking-[0.18em]">
          Navigation
        </p>
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition ${
              item.active
                ? 'btn-primary'
                : 'theme-surface-soft theme-text border hover:brightness-95'
            }`}
            onClick={closeSidebar}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
