import { formatRupee } from '../../utils/formatters';

function getTypeStyles(type) {
  if (type === 'income') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  }

  return 'bg-rose-50 text-rose-700 ring-rose-200';
}

export function TransactionsTable({
  transactions = [],
  role = 'Viewer',
  onEditTransaction,
  onDeleteTransaction,
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          No transactions found
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Try a different category or description keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-separate border-spacing-y-3 ${
          role === 'Admin' ? 'min-w-[1040px]' : 'min-w-[900px]'
        }`}
      >
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Description</th>
            {role === 'Admin' ? <th className="px-4 py-2 text-right">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="rounded-2xl bg-slate-50/80 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50"
            >
              <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900">
                {new Date(transaction.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-4 text-right font-semibold text-slate-900">
                <span className={transaction.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                  {transaction.amount >= 0 ? '+' : '-'}
                  {formatRupee(Math.abs(transaction.amount))}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  {transaction.category}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTypeStyles(
                    transaction.type,
                  )}`}
                >
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </span>
              </td>
              <td className={`px-4 py-4 text-slate-600 ${role === 'Admin' ? '' : 'rounded-r-2xl'}`}>
                {transaction.description}
              </td>
              {role === 'Admin' ? (
                <td className="rounded-r-2xl px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTransaction?.(transaction)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTransaction?.(transaction)}
                      className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
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
  );
}
