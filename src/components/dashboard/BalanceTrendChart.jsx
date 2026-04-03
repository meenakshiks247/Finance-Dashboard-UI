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

function TrendTooltip({ active, payload, label, accent }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="min-w-44 rounded-2xl border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <p className="theme-muted text-[11px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>
      <p className="theme-text-strong mt-2 text-sm font-semibold tabular-nums">
        {formatCurrencyValue(payload[0].value, { maximumFractionDigits: 0 })}
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
  const lineColor = rootStyles.getPropertyValue('--chart-line').trim() || (theme === 'dark' ? '#ffffff' : '#0f172a');
  const surfaceColor = rootStyles.getPropertyValue('--color-surface').trim() || '#ffffff';

  if (data.length === 0) {
    return (
      <div className="theme-surface-soft motion-fade-up flex h-52 items-center justify-center rounded-[1.5rem] border border-dashed sm:h-60">
        <p className="theme-muted text-sm">
          Not enough transaction data to plot trend.
        </p>
      </div>
    );
  }

  return (
    <div className="motion-chart h-52 w-full sm:h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 14, left: 0, bottom: 14 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 8"
            stroke={gridColor}
            strokeOpacity={0.35}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: borderColor }}
            tickMargin={8}
            minTickGap={18}
            interval="preserveStartEnd"
          >
            <Label value="Date" offset={-8} position="insideBottom" fill={axisColor} fontSize={11} />
          </XAxis>
          <YAxis
            width={72}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: borderColor }}
            tickMargin={8}
            tickFormatter={(value) =>
              formatCurrencyValue(value, { compact: true, maximumFractionDigits: 1 })
            }
          >
            <Label
              value="Balance"
              angle={-90}
              position="insideLeft"
              fill={axisColor}
              fontSize={11}
              offset={4}
            />
          </YAxis>
          <Tooltip content={<TrendTooltip accent={lineColor} />} cursor={{ stroke: borderColor, strokeDasharray: '3 6' }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={lineColor}
            strokeWidth={4}
            dot={{ r: 3.5, fill: lineColor, stroke: surfaceColor, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: lineColor, stroke: surfaceColor, strokeWidth: 2.5 }}
            isAnimationActive
            animationDuration={850}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
