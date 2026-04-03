import { useLayout } from '../../context/LayoutContext';
import { Header } from './Header';

export function AppLayout({ children }) {
  const { theme } = useLayout();

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
