import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrencyValue } from '../../utils/transactionUtils';

function getChartColors() {
  const rootStyles = getComputedStyle(document.documentElement);

  return [
    rootStyles.getPropertyValue('--chart-slice-1').trim() || '#0f766e',
    rootStyles.getPropertyValue('--chart-slice-2').trim() || '#2563eb',
    rootStyles.getPropertyValue('--chart-slice-3').trim() || '#d97706',
    rootStyles.getPropertyValue('--chart-slice-4').trim() || '#7c3aed',
    rootStyles.getPropertyValue('--chart-slice-5').trim() || '#dc2626',
    rootStyles.getPropertyValue('--chart-slice-6').trim() || '#0891b2',
    rootStyles.getPropertyValue('--chart-slice-7').trim() || '#334155',
  ];
}

function BreakdownTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div
      className="min-w-36 rounded-xl border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2 shadow-lg"
    >
      <p className="theme-muted text-[11px] font-semibold uppercase tracking-[0.12em]">
        {point.category}
      </p>
      <p className="theme-text-strong mt-1 text-sm font-semibold">
        {formatCurrencyValue(point.amount, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function ExpenseBreakdownChart({ data = [] }) {
  const colors = getChartColors();

  if (data.length === 0) {
    return (
      <div className="theme-surface-soft motion-fade-up flex h-52 items-center justify-center rounded-2xl border border-dashed sm:h-60">
        <p className="theme-muted text-sm">No expense data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="motion-chart grid gap-3 xl:grid-cols-[1fr_0.95fr] xl:items-center">
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
              isAnimationActive
              animationDuration={850}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={colors[index % colors.length]} />
              ))}
            </Pie>
              <Tooltip content={<BreakdownTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="theme-surface-soft space-y-1.5 rounded-2xl border p-2.5 xl:max-h-60 xl:overflow-y-auto xl:pr-1">
        {data.map((item, index) => (
          <div
            key={item.category}
            className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-300 hover:bg-white/85 dark:hover:bg-slate-900/60"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
                aria-hidden="true"
              />
              <span className="theme-text truncate text-sm font-medium">
                {item.category}
              </span>
            </div>
            <span className="theme-text-strong text-right text-sm font-semibold tabular-nums">
              {formatCurrencyValue(item.amount, { compact: true, maximumFractionDigits: 1 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
