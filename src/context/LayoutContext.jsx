import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem('finance-dashboard-role') ?? 'Viewer');
  const [theme, setTheme] = useState(() => localStorage.getItem('finance-dashboard-theme') ?? 'light');

  useEffect(() => {
    localStorage.setItem('finance-dashboard-role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance-dashboard-theme', theme);

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false),
      toggleSidebar: () => setIsSidebarOpen((current) => !current),
      role,
      setRole,
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [isSidebarOpen, role, theme],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('useLayout must be used inside a LayoutProvider.');
  }

  return context;
}
