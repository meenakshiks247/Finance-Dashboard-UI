import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { transactions as initialTransactions } from '../data/transactionsData';

const DashboardContext = createContext(null);
const STORAGE_KEY = 'finance-dashboard-state';

function getDefaultState() {
  return {
    transactions: initialTransactions,
    role: 'Viewer',
    theme: 'light',
    searchTerm: '',
    transactionFilter: 'all',
    sortOption: 'date-desc',
  };
}

function readStoredState() {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return getDefaultState();
    }

    const parsed = JSON.parse(rawValue);
    const fallback = getDefaultState();

    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : fallback.transactions,
      role: parsed.role === 'Admin' ? 'Admin' : fallback.role,
      theme: parsed.theme === 'dark' ? 'dark' : fallback.theme,
      searchTerm: typeof parsed.searchTerm === 'string' ? parsed.searchTerm : fallback.searchTerm,
      transactionFilter:
        ['all', 'income', 'expense'].includes(parsed.transactionFilter)
          ? parsed.transactionFilter
          : fallback.transactionFilter,
      sortOption:
        ['date-desc', 'date-asc', 'amount-desc', 'amount-asc'].includes(parsed.sortOption)
          ? parsed.sortOption
          : fallback.sortOption,
    };
  } catch {
    return getDefaultState();
  }
}

function saveStoredState(nextState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Ignore storage failures and keep the app working.
  }
}

export function DashboardProvider({ children }) {
  const storedState = useMemo(() => readStoredState(), []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(storedState.role);
  const [theme, setTheme] = useState(storedState.theme);
  const [transactions, setTransactions] = useState(storedState.transactions);
  const [searchTerm, setSearchTerm] = useState(storedState.searchTerm);
  const [transactionFilter, setTransactionFilter] = useState(storedState.transactionFilter);
  const [sortOption, setSortOption] = useState(storedState.sortOption);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    saveStoredState({
      transactions,
      role,
      theme,
      searchTerm,
      transactionFilter,
      sortOption,
    });
  }, [transactions, role, theme, searchTerm, transactionFilter, sortOption]);

  useEffect(() => {
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
      transactions,
      setTransactions,
      searchTerm,
      setSearchTerm,
      transactionFilter,
      setTransactionFilter,
      sortOption,
      setSortOption,
      isAddModalOpen,
      setIsAddModalOpen,
      isEditModalOpen,
      setIsEditModalOpen,
      selectedTransaction,
      setSelectedTransaction,
    }),
    [
      isSidebarOpen,
      role,
      theme,
      transactions,
      searchTerm,
      transactionFilter,
      sortOption,
      isAddModalOpen,
      isEditModalOpen,
      selectedTransaction,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used inside a DashboardProvider.');
  }

  return context;
}
