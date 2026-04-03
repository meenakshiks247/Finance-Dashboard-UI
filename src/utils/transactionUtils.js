const DEFAULT_LOCALE = 'en-IN';
const DEFAULT_CURRENCY = 'INR';

export function formatCurrencyValue(value, options = {}) {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    compact = false,
    maximumFractionDigits = 0,
    minimumFractionDigits,
  } = options;

  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  const formatterOptions = {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits,
  };

  if (typeof minimumFractionDigits === 'number') {
    formatterOptions.minimumFractionDigits = minimumFractionDigits;
  }

  return new Intl.NumberFormat(locale, formatterOptions).format(safeAmount);
}

export function formatDateValue(input, options = {}) {
  if (!input) {
    return '';
  }

  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const {
    locale = DEFAULT_LOCALE,
    dateStyle,
    day = '2-digit',
    month = 'short',
    year = 'numeric',
  } = options;

  if (dateStyle) {
    return date.toLocaleDateString(locale, { dateStyle });
  }

  const dateOptions = {};

  if (day) {
    dateOptions.day = day;
  }

  if (month) {
    dateOptions.month = month;
  }

  if (year) {
    dateOptions.year = year;
  }

  return date.toLocaleDateString(locale, dateOptions);
}

export function groupTransactionsByCategory(transactions = [], options = {}) {
  const { type, useAbsolute = true } = options;

  return transactions.reduce((grouped, transaction) => {
    if (type && transaction.type !== type) {
      return grouped;
    }

    const category = transaction.category || 'Uncategorized';
    const rawAmount = Number(transaction.amount);
    const amount = Number.isFinite(rawAmount) ? rawAmount : 0;
    const normalizedAmount = useAbsolute ? Math.abs(amount) : amount;

    grouped[category] = (grouped[category] ?? 0) + normalizedAmount;
    return grouped;
  }, {});
}

export function calculateTransactionTotals(transactions = []) {
  return transactions.reduce(
    (totals, transaction) => {
      const rawAmount = Number(transaction.amount);
      const amount = Number.isFinite(rawAmount) ? rawAmount : 0;
      const isIncome = transaction.type === 'income' || amount >= 0;
      const isExpense = transaction.type === 'expense' || amount < 0;

      if (isIncome) {
        totals.totalIncome += Math.abs(amount);
      }

      if (isExpense) {
        totals.totalExpenses += Math.abs(amount);
      }

      totals.totalBalance += amount;
      return totals;
    },
    {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
    },
  );
}
