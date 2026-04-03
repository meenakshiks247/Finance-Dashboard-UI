import { lazy, Suspense, useMemo } from 'react';
import {
  calculateTransactionTotals,
  formatCurrencyValue,
  formatDateValue,
  groupTransactionsByCategory,
} from '../utils/transactionUtils';
import { SectionCard } from '../components/dashboard/SectionCard';
import { InsightCard } from '../components/dashboard/InsightCard';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TransactionsTable } from '../components/dashboard/TransactionsTable';
import { useDashboard } from '../context/DashboardContext';
import { transactions as sampleTransactions } from '../data/transactionsData';

const TransactionFormModal = lazy(() =>
  import('../components/dashboard/TransactionFormModal').then((module) => ({
    default: module.TransactionFormModal,
  })),
);

const BalanceTrendChart = lazy(() =>
  import('../components/dashboard/BalanceTrendChart').then((module) => ({
    default: module.BalanceTrendChart,
  })),
);

const ExpenseBreakdownChart = lazy(() =>
  import('../components/dashboard/ExpenseBreakdownChart').then((module) => ({
    default: module.ExpenseBreakdownChart,
  })),
);

export function DashboardPage() {
  const {
    role,
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
  } = useDashboard();

  const totals = useMemo(() => calculateTransactionTotals(transactions), [transactions]);

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Balance',
        value: formatCurrencyValue(totals.totalBalance),
        subtitle: 'Net amount after income and expenses',
        icon: '₹',
        tone: 'slate',
      },
      {
        title: 'Total Income',
        value: formatCurrencyValue(totals.totalIncome),
        subtitle: 'All incoming money from salary and extras',
        icon: '⬆',
        tone: 'emerald',
      },
      {
        title: 'Total Expenses',
        value: formatCurrencyValue(totals.totalExpenses),
        subtitle: 'All spending across categories',
        icon: '⬇',
        tone: 'rose',
      },
    ],
    [totals],
  );

  const balanceTrendData = useMemo(() => {
    const dailyTotals = transactions.reduce((accumulator, transaction) => {
      accumulator[transaction.date] = (accumulator[transaction.date] ?? 0) + transaction.amount;
      return accumulator;
    }, {});

    let runningBalance = 0;

    return Object.keys(dailyTotals)
      .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())
      .map((date) => {
        runningBalance += dailyTotals[date];

        return {
          date,
          label: formatDateValue(date, { locale: 'en-US', month: 'short', day: 'numeric', year: null }),
          balance: Number(runningBalance.toFixed(2)),
        };
      });
  }, [transactions]);

  const averageMonthlyNet = useMemo(() => {
    if (balanceTrendData.length === 0) {
      return 0;
    }

    const totalNet = balanceTrendData.reduce((sum, item) => sum + item.balance, 0);
    return totalNet / balanceTrendData.length;
  }, [balanceTrendData]);

  const spendingEfficiency = useMemo(() => {
    if (totals.totalIncome === 0) {
      return 0;
    }

    return Math.max(0, ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100);
  }, [totals]);

  const expenseBreakdownData = useMemo(() => {
    const grouped = groupTransactionsByCategory(transactions, { type: 'expense' });

    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount);
  }, [transactions]);

  const dynamicInsights = useMemo(() => {
    const expenseTotals = groupTransactionsByCategory(transactions, { type: 'expense' });
    const incomeTotals = groupTransactionsByCategory(transactions, { type: 'income' });

    const currentMonthKey = transactions
      .map((transaction) => transaction.date.slice(0, 7))
      .sort()
      .at(-1);

    const currentMonthExpense = transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' && transaction.date.startsWith(currentMonthKey ?? ''),
      )
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const topExpense = Object.entries(expenseTotals).sort((a, b) => b[1] - a[1])[0];
    const topIncome = Object.entries(incomeTotals).sort((a, b) => b[1] - a[1])[0];

    const categoryFrequency = transactions.reduce((accumulator, transaction) => {
      accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + 1;
      return accumulator;
    }, {});

    const mostFrequentCategory = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0];

    return [
      {
        title: 'Highest Spending Category',
        label: 'Cost Driver',
        icon: '↓',
        description: topExpense
          ? `${topExpense[0]} leads your expenses with ${formatCurrencyValue(topExpense[1], {
              maximumFractionDigits: 0,
            })}.`
          : 'No expense transactions available yet.',
        badge: topExpense
          ? formatCurrencyValue(topExpense[1], { compact: true, maximumFractionDigits: 1 })
          : '-',
        tone: 'rose',
      },
      {
        title: 'Total Monthly Expense',
        label: 'This Month',
        icon: '◔',
        description: currentMonthKey
          ? `Expenses for ${formatDateValue(`${currentMonthKey}-01`, {
              locale: 'en-US',
              month: 'long',
              year: 'numeric',
              day: null,
            })} total ${formatCurrencyValue(currentMonthExpense, { maximumFractionDigits: 0 })}.`
          : 'No monthly expense data available.',
        badge: formatCurrencyValue(currentMonthExpense, { compact: true, maximumFractionDigits: 1 }),
        tone: 'amber',
      },
      {
        title: 'Top Income Source',
        label: 'Growth Signal',
        icon: '↑',
        description: topIncome
          ? `${topIncome[0]} is your strongest income source at ${formatCurrencyValue(topIncome[1], {
              maximumFractionDigits: 0,
            })}. Most frequent category overall: ${mostFrequentCategory?.[0] ?? 'N/A'}.`
          : 'No income transactions available yet.',
        badge: topIncome
          ? formatCurrencyValue(topIncome[1], { compact: true, maximumFractionDigits: 1 })
          : '-',
        tone: 'emerald',
      },
    ];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedFilter = transactionFilter.toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const categoryMatch =
        !normalizedSearch || transaction.category.toLowerCase().includes(normalizedSearch);
      const descriptionMatch =
        !normalizedSearch || transaction.description.toLowerCase().includes(normalizedSearch);
      const typeMatch = normalizedFilter === 'all' || transaction.type === normalizedFilter;

      return typeMatch && (categoryMatch || descriptionMatch);
    });

    return [...filtered].sort((left, right) => {
      if (sortOption.startsWith('date')) {
        const dateDifference = new Date(left.date).getTime() - new Date(right.date).getTime();
        return sortOption === 'date-asc' ? dateDifference : -dateDifference;
      }

      const amountDifference = left.amount - right.amount;
      return sortOption === 'amount-asc' ? amountDifference : -amountDifference;
    });
  }, [searchTerm, transactionFilter, sortOption, transactions]);

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expenses', value: 'expense' },
  ];

  const sortOptions = [
    { label: 'Date: Newest first', value: 'date-desc' },
    { label: 'Date: Oldest first', value: 'date-asc' },
    { label: 'Amount: High to low', value: 'amount-desc' },
    { label: 'Amount: Low to high', value: 'amount-asc' },
  ];

  const activeFilterLabel =
    filterButtons.find((button) => button.value === transactionFilter)?.label;
  const activeSortLabel = sortOptions.find((option) => option.value === sortOption)?.label;

  const handleOpenAddModal = () => {
    setSelectedTransaction(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (savedTransaction) => {
    setTransactions((current) => {
      const exists = current.some((item) => item.id === savedTransaction.id);

      if (exists) {
        return current.map((item) => (item.id === savedTransaction.id ? savedTransaction : item));
      }

      return [savedTransaction, ...current];
    });

    setSelectedTransaction(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTransactionFilter('all');
    setSortOption('date-desc');
  };

  const handleLoadSampleData = () => {
    setTransactions(sampleTransactions);
    handleResetFilters();
  };

  return (
    <div className="space-y-7 sm:space-y-8" id="overview">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-stretch">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] tracking-normal text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                Live
              </span>
              Dashboard Overview
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              A clean, responsive finance dashboard starter.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              This layout includes a top navigation bar, summary cards, a chart area, insights,
              and recent transactions in a modern minimal interface that is easy to extend.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:h-full">
            <div className="rounded-2xl bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/70">
              <p className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">🎯</span>
                Monthly Goal
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">$6,000</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/70">
              <p className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">📌</span>
                Saved So Far
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">$2,180</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 sm:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Current Net Position
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {formatCurrencyValue(totals.totalBalance, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {spendingEfficiency.toFixed(1)}% efficient
                </span>
              </div>

              <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300 dark:bg-white"
                  style={{ width: `${Math.min(100, Math.max(0, spendingEfficiency))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {transactions.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Empty dashboard
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                No transactions yet.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Add your first transaction to unlock charts, summaries, and insights. If you want
                a quick start, load the sample dataset and explore the dashboard right away.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {role === 'Admin' ? (
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 sm:w-auto"
                >
                  Add Transaction
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <div className="grid gap-5 2xl:grid-cols-[1.4fr_0.9fr]">
        <SectionCard
          id="charts"
          subtitle="Chart Section"
          title="Monthly performance"
          className="border-slate-200/90 bg-white shadow-md dark:border-slate-800/90 dark:bg-slate-900"
          action={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 transition-colors duration-300 dark:bg-slate-800 dark:text-slate-300">
              Last 6 months
            </span>
          }
        >
          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr] xl:items-end">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                  <p className="text-sm text-slate-500">Loading chart...</p>
                </div>
              }
            >
              <BalanceTrendChart data={balanceTrendData} />
            </Suspense>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-950/50 sm:p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Average Monthly Net</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrencyValue(averageMonthlyNet, { maximumFractionDigits: 0 })}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    averageMonthlyNet >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {averageMonthlyNet >= 0 ? 'Positive trend' : 'Needs attention'}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-950/50 sm:p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Spending Efficiency</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {spendingEfficiency.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Based on current income versus expenses
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-950/50 sm:p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Expense Breakdown</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">By category</p>
                <div className="mt-4">
                  <Suspense
                    fallback={
                      <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Loading chart...</p>
                      </div>
                    }
                  >
                    <ExpenseBreakdownChart data={expenseBreakdownData} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="insights"
          subtitle="Insights Section"
          title="What stands out"
          className="border-slate-200/80 bg-slate-50/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/75"
        >
          <div className="space-y-4">
            {dynamicInsights.map((item) => (
              <InsightCard key={item.title} {...item} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        id="transactions"
        subtitle="Transactions Section"
        title="All transactions"
        className="border-slate-200/80 bg-slate-50/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
        titleClassName="text-lg"
        subtitleClassName="text-slate-500"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Updated from state</span>
            {role === 'Admin' ? (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Add Transaction
              </button>
            ) : null}
          </div>
        }
      >
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full lg:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔎
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by category or description"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              aria-label="Search transactions by category or description"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
            <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 sm:w-auto">
              <span className="font-medium text-slate-500 dark:text-slate-400">Sort</span>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-slate-100 sm:w-auto"
                aria-label="Sort transactions"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {filterButtons.map((button) => {
                const isActive = transactionFilter === button.value;

                return (
                  <button
                    key={button.value}
                    type="button"
                    onClick={() => setTransactionFilter(button.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-900 hover:shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                    }`}
                    aria-pressed={isActive}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 transition-colors duration-300 dark:bg-slate-950/50 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredTransactions.length}</span>{' '}
            matching transaction{filteredTransactions.length === 1 ? '' : 's'}
          </span>
          <span className="hidden sm:inline">
            Filter: <span className="font-semibold text-slate-700 dark:text-slate-200">{activeFilterLabel}</span> • Sort:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{activeSortLabel}</span>
          </span>
        </div>

        <TransactionsTable
          transactions={filteredTransactions}
          hasTransactions={transactions.length > 0}
          onResetFilters={handleResetFilters}
        />
      </SectionCard>

      <Suspense fallback={null}>
        <TransactionFormModal
          isOpen={(isAddModalOpen || isEditModalOpen) && role === 'Admin'}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={(savedTransaction) => {
            setTransactions((current) => {
              const exists = current.some((item) => item.id === savedTransaction.id);

              if (exists) {
                return current.map((item) =>
                  item.id === savedTransaction.id ? savedTransaction : item,
                );
              }

              return [savedTransaction, ...current];
            });
            setSelectedTransaction(null);
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          mode={isEditModalOpen ? 'edit' : 'add'}
          transaction={selectedTransaction}
        />
      </Suspense>
    </div>
  );
}
