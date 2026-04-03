import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrencyValue } from '../../utils/transactionUtils';
import { useDashboard } from '../../context/DashboardContext';

const COLORS = ['#0f766e', '#2563eb', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#334155'];

function BreakdownTooltip({ active, payload, theme }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div
      className={`min-w-36 rounded-xl border px-3 py-2 shadow-lg ${
        theme === 'dark' ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white/95'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {point.category}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {formatCurrencyValue(point.amount, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function ExpenseBreakdownChart({ data = [] }) {
  const { theme } = useDashboard();

  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 sm:h-60">
        <p className="text-sm text-slate-500 dark:text-slate-400">No expense data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_0.95fr] xl:items-center">
      <div className="h-52 w-full sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
              <Tooltip content={<BreakdownTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1.5 rounded-2xl bg-slate-50/75 p-2.5 dark:bg-slate-950/40 xl:max-h-60 xl:overflow-y-auto xl:pr-1">
        {data.map((item, index) => (
          <div
            key={item.category}
            className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-300 hover:bg-white dark:hover:bg-slate-900/60"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                aria-hidden="true"
              />
              <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.category}
              </span>
            </div>
            <span className="text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrencyValue(item.amount, { compact: true, maximumFractionDigits: 1 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
