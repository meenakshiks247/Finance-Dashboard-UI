import { transactions } from './transactionsData';

export const navigationItems = [
  { label: 'Overview', href: '#overview', active: true },
  { label: 'Charts', href: '#charts' },
  { label: 'Insights', href: '#insights' },
  { label: 'Transactions', href: '#transactions' },
];

export const dashboardStats = [
  {
    label: 'Total Balance',
    value: 128430,
    change: 12.4,
    format: 'currency',
    tone: 'emerald',
  },
  {
    label: 'Monthly Income',
    value: 18420,
    change: 8.1,
    format: 'currency',
    tone: 'blue',
  },
  {
    label: 'Monthly Expenses',
    value: 9640,
    change: -3.7,
    format: 'currency',
    tone: 'amber',
  },
  {
    label: 'Savings Rate',
    value: 36,
    change: 4.2,
    format: 'percentage',
    tone: 'violet',
  },
];

export const monthlyTrend = [
  { month: 'Jan', value: 72 },
  { month: 'Feb', value: 64 },
  { month: 'Mar', value: 86 },
  { month: 'Apr', value: 78 },
  { month: 'May', value: 92 },
  { month: 'Jun', value: 84 },
];

export const insights = [
  {
    title: 'Savings are improving',
    description: 'Your savings rate is trending upward, which indicates strong month-over-month control.',
    badge: '+4.2%',
    accent: 'bg-emerald-500',
  },
  {
    title: 'Spending is balanced',
    description: 'Core categories remain within budget, with only small overspending risk in food and transport.',
    badge: 'Low risk',
    accent: 'bg-blue-500',
  },
  {
    title: 'Income stability is strong',
    description: 'Recurring income is consistent, making it easier to forecast the next month with confidence.',
    badge: 'Stable',
    accent: 'bg-violet-500',
  },
];

export const recentTransactions = transactions.slice(0, 8).map((transaction) => ({
  name: transaction.description,
  category: transaction.category,
  amount: transaction.amount,
  date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  type: transaction.type === 'income' ? 'credit' : 'debit',
}));

export { transactions };
