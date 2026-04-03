import { formatCurrency } from '../../utils/formatters';

export function TransactionRow({ name, category, amount, date, type }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {category} • {date}
        </p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          type === 'credit'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300'
            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
        }`}
      >
        {amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(amount))}
      </span>
    </div>
  );
}
