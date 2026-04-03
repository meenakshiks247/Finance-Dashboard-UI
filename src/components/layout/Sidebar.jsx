import { useLayout } from '../../context/LayoutContext';
import { navigationItems } from '../../data/dashboardData';

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white px-5 py-6 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:h-auto lg:translate-x-0 lg:rounded-3xl lg:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Menu
        </p>
        <button
          type="button"
          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
          onClick={closeSidebar}
        >
          Close
        </button>
      </div>

      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm text-slate-300">Current Balance</p>
        <h2 className="mt-2 text-3xl font-semibold">$128,430</h2>
        <p className="mt-3 text-sm text-emerald-300">+12.4% from last month</p>
      </div>

      <nav className="mt-8 space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Navigation
        </p>
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition hover:bg-slate-100 ${
              item.active
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
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
