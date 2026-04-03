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

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className="min-w-40 rounded-xl border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2.5 shadow-lg"
    >
      <p className="theme-muted text-[11px] font-semibold uppercase tracking-[0.12em]">
        {label}
      </p>
      <p className="theme-text-strong mt-1 text-sm font-semibold">
        Balance: {formatCurrencyValue(payload[0].value, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function BalanceTrendChart({ data = [] }) {
  const { theme } = useDashboard();

  const rootStyles = getComputedStyle(document.documentElement);
  const axisColor = rootStyles.getPropertyValue('--chart-axis').trim() || '#475569';
  const gridColor = rootStyles.getPropertyValue('--chart-grid').trim() || '#cbd5e1';
  const borderColor = rootStyles.getPropertyValue('--chart-border').trim() || '#cbd5e1';
  const lineColor = theme === 'dark' ? '#ffffff' : '#0f172a';

  if (data.length === 0) {
    return (
      <div className="theme-surface-soft motion-fade-up flex h-56 items-center justify-center rounded-2xl border border-dashed sm:h-64">
        <p className="theme-muted text-sm">
          Not enough transaction data to plot trend.
        </p>
      </div>
    );
  }

  return (
    <div className="motion-chart h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 10, left: 2, bottom: 24 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 5"
            stroke={gridColor}
            strokeOpacity={0.75}
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
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: axisColor, strokeDasharray: '4 4' }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={lineColor}
            strokeWidth={3.5}
            dot={{ r: 2.8, fill: lineColor, strokeWidth: 0 }}
            activeDot={{ r: 5.5, fill: lineColor, stroke: lineColor, strokeWidth: 2 }}
            isAnimationActive
            animationDuration={850}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
