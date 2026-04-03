import { useMemo, useState } from 'react';
import { transactions } from '../data/dashboardData';
import { formatRupee } from '../utils/formatters';
import { SectionCard } from '../components/dashboard/SectionCard';
import { InsightCard } from '../components/dashboard/InsightCard';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TransactionsTable } from '../components/dashboard/TransactionsTable';
import { useLayout } from '../context/LayoutContext';
import { TransactionFormModal } from '../components/dashboard/TransactionFormModal';
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart';
import { ExpenseBreakdownChart } from '../components/dashboard/ExpenseBreakdownChart';

export function DashboardPage() {
  const { role } = useLayout();
  const [transactionList, setTransactionList] = useState(transactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [sortOption, setSortOption] = useState('date-desc');

  const totals = useMemo(
    () =>
      transactionList.reduce(
        (accumulator, transaction) => {
          if (transaction.amount >= 0) {
            accumulator.totalIncome += transaction.amount;
          } else {
            accumulator.totalExpenses += Math.abs(transaction.amount);
          }

          accumulator.totalBalance += transaction.amount;
          return accumulator;
        },
        {
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
        },
      ),
    [transactionList],
  );

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Balance',
        value: formatRupee(totals.totalBalance),
        subtitle: 'Net amount after income and expenses',
        icon: '₹',
        tone: 'emerald',
      },
      {
        title: 'Total Income',
        value: formatRupee(totals.totalIncome),
        subtitle: 'All incoming money from salary and extras',
        icon: '⬆',
        tone: 'blue',
      },
      {
        title: 'Total Expenses',
        value: formatRupee(totals.totalExpenses),
        subtitle: 'All spending across categories',
        icon: '⬇',
        tone: 'amber',
      },
    ],
    [totals],
  );

  const balanceTrendData = useMemo(() => {
    const dailyTotals = transactionList.reduce((accumulator, transaction) => {
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
          label: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          balance: Number(runningBalance.toFixed(2)),
        };
      });
  }, [transactionList]);

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
    const grouped = transactionList.reduce((accumulator, transaction) => {
      if (transaction.amount >= 0 || transaction.type !== 'expense') {
        return accumulator;
      }

      const currentValue = accumulator[transaction.category] ?? 0;
      accumulator[transaction.category] = currentValue + Math.abs(transaction.amount);
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount);
  }, [transactionList]);

  const dynamicInsights = useMemo(() => {
    const expenseTotals = transactionList.reduce((accumulator, transaction) => {
      if (transaction.type !== 'expense') {
        return accumulator;
      }

      accumulator[transaction.category] =
        (accumulator[transaction.category] ?? 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {});

    const incomeTotals = transactionList.reduce((accumulator, transaction) => {
      if (transaction.type !== 'income') {
        return accumulator;
      }

      accumulator[transaction.category] =
        (accumulator[transaction.category] ?? 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {});

    const currentMonthKey = transactionList
      .map((transaction) => transaction.date.slice(0, 7))
      .sort()
      .at(-1);

    const currentMonthExpense = transactionList
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          transaction.date.startsWith(currentMonthKey ?? ''),
      )
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const topExpense = Object.entries(expenseTotals).sort((a, b) => b[1] - a[1])[0];
    const topIncome = Object.entries(incomeTotals).sort((a, b) => b[1] - a[1])[0];

    const categoryFrequency = transactionList.reduce((accumulator, transaction) => {
      accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + 1;
      return accumulator;
    }, {});

    const mostFrequentCategory = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0];

    return [
      {
        title: 'Highest Spending Category',
        description: topExpense
          ? `${topExpense[0]} leads your expenses with ${formatRupee(topExpense[1], { maximumFractionDigits: 0 })}.`
          : 'No expense transactions available yet.',
        badge: topExpense ? formatRupee(topExpense[1], { compact: true, maximumFractionDigits: 1 }) : '-',
        accent: 'bg-rose-500',
      },
      {
        title: 'Total Monthly Expense',
        description: currentMonthKey
          ? `Expenses for ${new Date(`${currentMonthKey}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} total ${formatRupee(currentMonthExpense, { maximumFractionDigits: 0 })}.`
          : 'No monthly expense data available.',
        badge: formatRupee(currentMonthExpense, { compact: true, maximumFractionDigits: 1 }),
        accent: 'bg-amber-500',
      },
      {
        title: 'Top Income Source',
        description: topIncome
          ? `${topIncome[0]} is your strongest income source at ${formatRupee(topIncome[1], { maximumFractionDigits: 0 })}. Most frequent category overall: ${mostFrequentCategory?.[0] ?? 'N/A'}.`
          : 'No income transactions available yet.',
        badge: topIncome ? formatRupee(topIncome[1], { compact: true, maximumFractionDigits: 1 }) : '-',
        accent: 'bg-emerald-500',
      },
    ];
  }, [transactionList]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedFilter = transactionFilter.toLowerCase();

    const filtered = transactionList.filter((transaction) => {
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
  }, [searchTerm, transactionFilter, sortOption, transactionList]);

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

  const activeFilterLabel = filterButtons.find((button) => button.value === transactionFilter)?.label;
  const activeSortLabel = sortOptions.find((option) => option.value === sortOption)?.label;

  const handleOpenAddModal = () => {
    setSelectedTransaction(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsAddModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = (savedTransaction) => {
    setTransactionList((current) => {
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

  const handleDeleteTransaction = (transaction) => {
    if (role !== 'Admin') {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete this transaction?\n\n${transaction.category}: ${transaction.description}`,
    );

    if (!shouldDelete) {
      return;
    }

    setTransactionList((current) => current.filter((item) => item.id !== transaction.id));

    if (selectedTransaction?.id === transaction.id) {
      setSelectedTransaction(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-6" id="overview">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Dashboard Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A clean, responsive finance dashboard starter.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              This layout includes a top navigation bar, summary cards, a chart area, insights,
              and recent transactions in a modern minimal interface that is easy to extend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Monthly Goal</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">$6,000</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Saved So Far</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">$2,180</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <SectionCard
          id="charts"
          subtitle="Chart Section"
          title="Monthly performance"
          action={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              Last 6 months
            </span>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div className="flex h-72 items-end gap-3">
              <BalanceTrendChart data={balanceTrendData} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Average Monthly Net</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {formatRupee(averageMonthlyNet, { maximumFractionDigits: 0 })}
                </p>
                <p className={`mt-2 text-sm ${averageMonthlyNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {averageMonthlyNet >= 0 ? 'Positive trend' : 'Needs attention'}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Spending Efficiency</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {spendingEfficiency.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Based on current income versus expenses
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Expense Breakdown</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">By category</p>
                <div className="mt-4">
                  <ExpenseBreakdownChart data={expenseBreakdownData} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard id="insights" subtitle="Insights Section" title="What stands out">
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
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Updated from state</span>
            {role === 'Admin' ? (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Add Transaction
              </button>
            ) : null}
          </div>
        }
      >
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔎
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by category or description"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              aria-label="Search transactions by category or description"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="font-medium text-slate-500">Sort</span>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none"
                aria-label="Sort transactions"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              {filterButtons.map((button) => {
                const isActive = transactionFilter === button.value;

                return (
                  <button
                    key={button.value}
                    type="button"
                    onClick={() => setTransactionFilter(button.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
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

        <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-900">{filteredTransactions.length}</span>{' '}
            matching transaction{filteredTransactions.length === 1 ? '' : 's'}
          </span>
          <span className="hidden sm:inline">
            Filter: <span className="font-semibold text-slate-700">{activeFilterLabel}</span> • Sort:{' '}
            <span className="font-semibold text-slate-700">{activeSortLabel}</span>
          </span>
        </div>

        <TransactionsTable
          transactions={filteredTransactions}
          role={role}
          onEditTransaction={handleOpenEditModal}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </SectionCard>

      <TransactionFormModal
        isOpen={(isAddModalOpen || isEditModalOpen) && role === 'Admin'}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        mode={isEditModalOpen ? 'edit' : 'add'}
        transaction={selectedTransaction}
      />
    </div>
  );
}
