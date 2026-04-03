import { formatCurrencyValue, formatDateValue } from '../../utils/transactionUtils';
import { useDashboard } from '../../context/DashboardContext';

function getTypeStyles(type) {
  if (type === 'income') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/60';
  }

  return 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/60';
}

export function TransactionsTable({ transactions = [], hasTransactions = true, onResetFilters }) {
  const {
    role,
    setSelectedTransaction,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setTransactions,
  } = useDashboard();

  if (transactions.length === 0) {
    const emptyStateIsFiltered = hasTransactions;

    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-10 text-center dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            {emptyStateIsFiltered ? '🔎' : '🧾'}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {emptyStateIsFiltered ? 'No transactions found' : 'No transactions yet'}
          </p>
          <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {emptyStateIsFiltered
              ? 'Nothing matches your current filters.'
              : 'Your transaction list is empty.'}
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {emptyStateIsFiltered
              ? 'Try a different search term or clear the current filters to see all transactions again.'
              : 'Add a new transaction or load sample data to explore the dashboard with instant insights.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {emptyStateIsFiltered ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Reset Filters
              </button>
            ) : null}

            {role === 'Admin' && !emptyStateIsFiltered ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedTransaction(null);
                  setIsAddModalOpen(true);
                  setIsEditModalOpen(false);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Add Transaction
              </button>
            ) : null}

            {role === 'Admin' && emptyStateIsFiltered ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedTransaction(null);
                  setIsAddModalOpen(true);
                  setIsEditModalOpen(false);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Add Transaction
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {transactions.map((transaction) => (
          <article
            key={`mobile-${transaction.id}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {transaction.category}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDateValue(transaction.date)}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-sm font-semibold ${transaction.amount >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'}`}>
                {transaction.amount >= 0 ? '+' : '-'}
                {formatCurrencyValue(Math.abs(transaction.amount))}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTypeStyles(
                  transaction.type,
                )}`}
              >
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </span>
              {role === 'Admin' ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shouldDelete = window.confirm(
                        `Delete this transaction?\n\n${transaction.category}: ${transaction.description}`,
                      );

                      if (!shouldDelete) {
                        return;
                      }

                      setTransactions((current) =>
                        current.filter((item) => item.id !== transaction.id),
                      );
                    }}
                    className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60 dark:hover:bg-rose-950/60"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{transaction.description}</p>
          </article>
        ))}
      </div>

      <div className="hidden max-h-[34rem] overflow-auto rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-800 md:block">
        <table
          className={`w-full border-separate border-spacing-y-2.5 bg-slate-50/30 dark:bg-slate-950/20 ${
            role === 'Admin' ? 'min-w-[1040px]' : 'min-w-[900px]'
          }`}
        >
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 backdrop-blur dark:bg-slate-900/95">
                Date
              </th>
              <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 text-right backdrop-blur dark:bg-slate-900/95">
                Amount
              </th>
              <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 backdrop-blur dark:bg-slate-900/95">
                Category
              </th>
              <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 backdrop-blur dark:bg-slate-900/95">
                Type
              </th>
              <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 backdrop-blur dark:bg-slate-900/95">
                Description
              </th>
              {role === 'Admin' ? (
                <th className="sticky top-0 z-10 bg-slate-100/95 px-4 py-3 text-right backdrop-blur dark:bg-slate-900/95">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="rounded-2xl bg-white text-sm text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:bg-slate-950/70 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-900"
              >
              <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                {formatDateValue(transaction.date)}
              </td>
              <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                <span className={transaction.amount >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                  {transaction.amount >= 0 ? '+' : '-'}
                  {formatCurrencyValue(Math.abs(transaction.amount))}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                  {transaction.category}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTypeStyles(
                    transaction.type,
                  )}`}
                >
                  {transaction.type === 'income' ? 'Income ↑' : 'Expense ↓'}
                </span>
              </td>
                <td
                  className={`px-4 py-4 text-slate-600 dark:text-slate-400 ${
                    role === 'Admin' ? '' : 'rounded-r-2xl'
                  }`}
                >
                  {transaction.description}
                </td>
                {role === 'Admin' ? (
                  <td className="rounded-r-2xl px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsAddModalOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const shouldDelete = window.confirm(
                            `Delete this transaction?\n\n${transaction.category}: ${transaction.description}`,
                          );

                          if (!shouldDelete) {
                            return;
                          }

                          setTransactions((current) =>
                            current.filter((item) => item.id !== transaction.id),
                          );
                        }}
                        className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60 dark:hover:bg-rose-950/60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
