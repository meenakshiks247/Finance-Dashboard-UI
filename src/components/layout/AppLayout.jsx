import { Header } from './Header';
import { useDashboard } from '../../context/DashboardContext';

export function AppLayout({ children }) {
  const { theme } = useDashboard();

  return (
    <div className="theme-page min-h-screen transition-colors duration-300">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
