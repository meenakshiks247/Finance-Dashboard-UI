import { Fragment } from 'react';
import { formatCurrencyValue, formatDateValue } from '../../utils/transactionUtils';
import { useDashboard } from '../../context/DashboardContext';

function getTypeStyles(type) {
  if (type === 'income') {
    return 'badge-income ring-1';
  }

  return 'badge-expense ring-1';
}

function formatSignedAmount(amount) {
  const isPositive = amount >= 0;

  return {
    label: `${isPositive ? '+' : '-'}${formatCurrencyValue(Math.abs(amount))}`,
    className: isPositive ? 'badge-income-strong' : 'badge-expense-strong',
  };
}

export function TransactionsTable({
  transactions = [],
  hasTransactions = true,
  onResetFilters,
  groupBy = 'none',
  groupedTransactions = [],
}) {
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
      <div className="theme-surface rounded-[1.75rem] border border-dashed px-6 py-10 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="theme-surface-soft flex h-14 w-14 items-center justify-center rounded-full border text-2xl shadow-sm">
            {emptyStateIsFiltered ? '🔎' : '🧾'}
          </div>
          <p className="theme-muted mt-4 text-xs font-semibold uppercase tracking-[0.16em]">
            {emptyStateIsFiltered ? 'No transactions found' : 'No transactions yet'}
          </p>
          <h4 className="theme-text-strong mt-2 text-2xl font-semibold tracking-tight">
            {emptyStateIsFiltered
              ? 'Nothing matches your current filters.'
              : 'Your transaction list is empty.'}
          </h4>
          <p className="theme-muted mt-2 text-sm font-normal leading-6">
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

  const hasGroups = groupBy !== 'none' && groupedTransactions.length > 0;
  const columnCount = role === 'Admin' ? 6 : 5;

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {(hasGroups ? groupedTransactions : [{ id: 'all', label: 'All Transactions', total: 0, items: transactions }]).map((group) => (
          <section key={`mobile-group-${group.id}`} className="space-y-3">
            {hasGroups ? (
              <div className="theme-surface-strong flex items-center justify-between rounded-2xl border px-3.5 py-2.5 shadow-sm">
                <p className="theme-text-strong text-base font-semibold">{group.label}</p>
                <p className={`text-base font-semibold ${formatSignedAmount(group.total).className}`}>
                  {formatSignedAmount(group.total).label}
                </p>
              </div>
            ) : null}

            {group.items.map((transaction) => (
              <article
                key={`mobile-${group.id}-${transaction.id}`}
                className="motion-card motion-row group theme-surface-soft rounded-[1.5rem] border p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="theme-text-strong text-base font-semibold">{transaction.category}</p>
                    <p className="theme-muted mt-1 text-xs">{formatDateValue(transaction.date)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-base font-bold transition duration-200 group-hover:scale-[1.02] ${transaction.amount >= 0 ? 'badge-income' : 'badge-expense'}`}>
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
          </section>
        ))}
      </div>

      <div className="hidden max-h-[34rem] overflow-auto rounded-[1.75rem] border theme-border bg-[var(--color-surface)] md:block">
        <table
          className={`w-full border-separate border-spacing-y-3 bg-[var(--color-surface-soft)] ${
            role === 'Admin' ? 'min-w-[1040px]' : 'min-w-[900px]'
          }`}
        >
          <thead>
            <tr className="theme-muted text-left text-xs font-medium uppercase tracking-[0.16em]">
              <th className="theme-surface-strong sticky top-0 z-10 rounded-l-2xl px-4 py-3 backdrop-blur">
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
                <th className="theme-surface-strong sticky top-0 z-10 rounded-r-2xl px-4 py-3 text-right backdrop-blur">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {(hasGroups
              ? groupedTransactions
              : [{ id: 'all', label: 'All Transactions', total: 0, items: transactions }]).map((group) => (
              <Fragment key={`desktop-group-${group.id}`}>
                {hasGroups ? (
                  <tr key={`group-header-${group.id}`}>
                    <td colSpan={columnCount} className="px-0 pt-3">
                      <div className="theme-surface-strong flex items-center justify-between rounded-[1.5rem] border px-4 py-3 shadow-sm">
                        <p className="theme-text-strong text-base font-semibold uppercase tracking-[0.08em]">
                          {group.label}
                        </p>
                        <p className={`text-base font-semibold ${formatSignedAmount(group.total).className}`}>
                          {formatSignedAmount(group.total).label}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : null}

                {group.items.map((transaction) => (
                  <tr
                    key={`${group.id}-${transaction.id}`}
                    className="motion-row group theme-surface theme-text rounded-[1.5rem] border shadow-sm transition-shadow duration-200 hover:bg-[color-mix(in_srgb,var(--color-surface-soft)_72%,var(--color-surface))] hover:shadow-md"
                  >
                    <td className="theme-text-strong rounded-l-2xl px-4 py-4 text-sm font-semibold">
                      {formatDateValue(transaction.date)}
                    </td>
                    <td className="theme-text-strong px-4 py-4 text-right text-base font-bold">
                      <span className={transaction.amount >= 0 ? 'badge-income-strong' : 'badge-expense-strong'}>
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition duration-200 group-hover:scale-[1.02] ${getTypeStyles(
                          transaction.type,
                        )}`}
                      >
                        {transaction.type === 'income' ? 'Income +' : 'Expense -'}
                      </span>
                    </td>
                    <td
                      className={`theme-muted px-4 py-4 text-sm font-normal ${
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
