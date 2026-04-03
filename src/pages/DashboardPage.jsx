import {
  dashboardStats,
  insights,
  monthlyTrend,
  recentTransactions,
} from '../data/dashboardData';
import { formatCurrency } from '../utils/formatters';
import { StatCard } from '../components/dashboard/StatCard';
import { SectionCard } from '../components/dashboard/SectionCard';
import { InsightCard } from '../components/dashboard/InsightCard';
import { TransactionRow } from '../components/dashboard/TransactionRow';

const chartBars = monthlyTrend.map((item) => ({
  ...item,
  height: `${item.value}%`,
}));

export function DashboardPage() {
  return (
    <div className="space-y-6" id="overview">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Dashboard Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A clean, responsive finance dashboard starter.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              This layout includes a top navigation bar, summary cards, a chart area, insights,
              and recent transactions in a modern minimal interface that is easy to extend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Monthly Goal</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">$6,000</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Saved So Far</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">$2,180</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <SectionCard
          id="charts"
          subtitle="Chart Section"
          title="Monthly performance"
          action={<span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Last 6 months</span>}
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div className="flex h-72 items-end gap-3">
              {chartBars.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-full w-full items-end rounded-2xl bg-slate-100 p-2">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-slate-900 to-slate-500 transition-all"
                      style={{ height: item.height }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">{item.month}</p>
                    <p className="text-xs text-slate-500">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Average Cash Flow</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">$8,940</p>
                <p className="mt-2 text-sm text-emerald-600">+11.2% from previous period</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Spending Efficiency</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">86%</p>
                <p className="mt-2 text-sm text-slate-600">Within target budget range</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard id="insights" subtitle="Insights Section" title="What stands out">
          <div className="space-y-4">
            {insights.map((item) => (
              <InsightCard key={item.title} {...item} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        id="transactions"
        subtitle="Transactions Section"
        title="Recent activity"
        action={<span className="text-sm text-slate-500">Updated today</span>}
      >
        <div className="divide-y divide-slate-100">
          {recentTransactions.map((transaction) => (
            <TransactionRow key={`${transaction.name}-${transaction.date}`} {...transaction} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
