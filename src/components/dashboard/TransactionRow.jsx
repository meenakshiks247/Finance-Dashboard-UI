import { formatCurrency } from '../../utils/formatters';

export function TransactionRow({ name, category, amount, date, type }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">
          {category} • {date}
        </p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          type === 'credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}
      >
        {amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(amount))}
      </span>
    </div>
  );
}
