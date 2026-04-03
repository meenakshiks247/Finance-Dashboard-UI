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
import { formatRupee } from '../../utils/formatters';

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        Balance: {formatRupee(payload[0].value, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function BalanceTrendChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Not enough transaction data to plot trend.</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 28 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          >
            <Label value="Date" offset={-14} position="insideBottom" fill="#64748b" fontSize={12} />
          </XAxis>
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            tickFormatter={(value) => formatRupee(value, { compact: true, maximumFractionDigits: 1 })}
          >
            <Label
              value="Balance"
              angle={-90}
              position="insideLeft"
              fill="#64748b"
              fontSize={12}
              offset={8}
            />
          </YAxis>
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#0f172a"
            strokeWidth={3}
            dot={{ r: 3, fill: '#0f172a' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
