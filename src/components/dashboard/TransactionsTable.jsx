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
      <div className="theme-surface rounded-3xl border border-dashed px-6 py-10 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="theme-surface-soft flex h-14 w-14 items-center justify-center rounded-full border text-2xl shadow-sm">
            {emptyStateIsFiltered ? '🔎' : '🧾'}
          </div>
          <p className="theme-muted mt-4 text-xs font-semibold uppercase tracking-[0.16em]">
            {emptyStateIsFiltered ? 'No transactions found' : 'No transactions yet'}
          </p>
          <h4 className="theme-text-strong mt-2 text-xl font-semibold">
            {emptyStateIsFiltered
              ? 'Nothing matches your current filters.'
              : 'Your transaction list is empty.'}
          </h4>
          <p className="theme-muted mt-2 text-sm leading-6">
            {emptyStateIsFiltered
              ? 'Try a different search term or clear the current filters to see all transactions again.'
              : 'Add a new transaction or load sample data to explore the dashboard with instant insights.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {emptyStateIsFiltered ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="btn btn-primary"
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
                className="btn btn-secondary"
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
                className="btn btn-secondary"
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
            className="motion-card motion-row group theme-surface-soft rounded-2xl border p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="theme-text-strong text-sm font-semibold">
                  {transaction.category}
                </p>
                <p className="theme-muted mt-1 text-xs">
                  {formatDateValue(transaction.date)}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-sm font-semibold transition duration-200 group-hover:scale-[1.02] ${transaction.amount >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'}`}>
                {transaction.amount >= 0 ? '+' : '-'}
                {formatCurrencyValue(Math.abs(transaction.amount))}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 transition duration-200 group-hover:scale-[1.02] ${getTypeStyles(
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
                    className="btn btn-secondary btn-sm"
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
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>

            <p className="theme-muted mt-3 text-sm">{transaction.description}</p>
          </article>
        ))}
      </div>

      <div className="hidden max-h-[34rem] overflow-auto rounded-2xl border theme-border md:block">
        <table
          className={`w-full border-separate border-spacing-y-2.5 theme-surface-soft ${
            role === 'Admin' ? 'min-w-[1040px]' : 'min-w-[900px]'
          }`}
        >
          <thead>
            <tr className="theme-muted text-left text-xs font-semibold uppercase tracking-[0.16em]">
              <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 backdrop-blur">
                Date
              </th>
              <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 text-right backdrop-blur">
                Amount
              </th>
              <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 backdrop-blur">
                Category
              </th>
              <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 backdrop-blur">
                Type
              </th>
              <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 backdrop-blur">
                Description
              </th>
              {role === 'Admin' ? (
                <th className="theme-surface-strong sticky top-0 z-10 px-4 py-3 text-right backdrop-blur">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="motion-row group theme-surface theme-text rounded-2xl border shadow-sm"
              >
              <td className="theme-text-strong rounded-l-2xl px-4 py-4 font-medium">
                {formatDateValue(transaction.date)}
              </td>
              <td className="theme-text-strong px-4 py-4 text-right font-semibold">
                <span className={transaction.amount >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                  {transaction.amount >= 0 ? '+' : '-'}
                  {formatCurrencyValue(Math.abs(transaction.amount))}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="theme-surface-soft theme-text rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 group-hover:scale-[1.02]">
                  {transaction.category}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 transition duration-200 group-hover:scale-[1.02] ${getTypeStyles(
                    transaction.type,
                  )}`}
                >
                  {transaction.type === 'income' ? 'Income ↑' : 'Expense ↓'}
                </span>
              </td>
                <td
                  className={`theme-muted px-4 py-4 ${
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
                        className="btn btn-secondary btn-sm"
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
                        className="btn btn-danger btn-sm"
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
