export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupee(amount, options = {}) {
  const { maximumFractionDigits = 0, compact = false } = options;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits,
  }).format(amount);
}

export function formatCompactCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatPercentage(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}
