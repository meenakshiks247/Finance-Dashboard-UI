import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrencyValue } from '../../utils/transactionUtils';
import { useDashboard } from '../../context/DashboardContext';

function TrendTooltip({ active, payload, label, theme }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={`min-w-40 rounded-xl border px-3 py-2.5 shadow-lg ${
        theme === 'dark' ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white/95'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        Balance: {formatCurrencyValue(payload[0].value, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function BalanceTrendChart({ data = [] }) {
  const { theme } = useDashboard();

  const axisColor = theme === 'dark' ? '#94a3b8' : '#475569';
  const gridColor = theme === 'dark' ? '#334155' : '#cbd5e1';
  const borderColor = theme === 'dark' ? '#475569' : '#cbd5e1';

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 sm:h-64">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Not enough transaction data to plot trend.
        </p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 10, left: 2, bottom: 24 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 5"
            stroke={gridColor}
            strokeOpacity={theme === 'dark' ? 0.45 : 0.4}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: axisColor, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: borderColor }}
          >
            <Label value="Date" offset={-14} position="insideBottom" fill={axisColor} fontSize={12} />
          </XAxis>
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: borderColor }}
            tickFormatter={(value) =>
              formatCurrencyValue(value, { compact: true, maximumFractionDigits: 1 })
            }
          >
            <Label
              value="Balance"
              angle={-90}
              position="insideLeft"
              fill={axisColor}
              fontSize={12}
              offset={8}
            />
          </YAxis>
          <Tooltip content={<TrendTooltip theme={theme} />} cursor={{ stroke: axisColor, strokeDasharray: '4 4' }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={theme === 'dark' ? '#f8fafc' : '#0f172a'}
            strokeWidth={3.5}
            dot={{ r: 2.8, fill: theme === 'dark' ? '#f8fafc' : '#0f172a', strokeWidth: 0 }}
            activeDot={{ r: 5.5, stroke: theme === 'dark' ? '#0f172a' : '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
