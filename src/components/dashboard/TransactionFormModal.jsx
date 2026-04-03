import { useEffect, useMemo, useState } from 'react';

const initialFormState = {
  date: '',
  amount: '',
  category: 'Salary',
  type: 'income',
  description: '',
};

const categoryOptions = ['Salary', 'Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment'];

export function TransactionFormModal({ isOpen, onClose, onSubmit, mode = 'add', transaction = null }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors({});
      return;
    }

    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: String(Math.abs(transaction.amount)),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [isOpen, transaction]);

  const canSubmit = useMemo(
    () => formData.date && formData.amount && formData.category && formData.type && formData.description,
    [formData],
  );

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.date) nextErrors.date = 'Date is required.';
    if (!formData.amount) nextErrors.amount = 'Amount is required.';
    if (formData.amount && Number(formData.amount) <= 0) nextErrors.amount = 'Amount must be greater than zero.';
    if (!formData.category) nextErrors.category = 'Category is required.';
    if (!formData.type) nextErrors.type = 'Type is required.';
    if (!formData.description.trim()) nextErrors.description = 'Description is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      id: transaction?.id ?? `txn-${crypto.randomUUID()}`,
      date: formData.date,
      amount: formData.type === 'income' ? Number(formData.amount) : -Number(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description.trim(),
    });

    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] px-4 py-6 backdrop-blur-sm">
      <div className="theme-surface w-full max-w-2xl rounded-3xl border p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="theme-muted text-xs font-semibold uppercase tracking-[0.18em]">
              Admin Action
            </p>
            <h2 className="theme-text-strong mt-1 text-2xl font-semibold">
              {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="theme-muted mt-2 text-sm">
              {mode === 'edit'
                ? 'Update the selected income or expense entry.'
                : 'Create a new income or expense entry for the dashboard.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <label className="space-y-2">
            <span className="theme-label">Date</span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="theme-input"
            />
            {errors.date ? <p className="text-xs font-medium text-rose-600">{errors.date}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="theme-label">Amount</span>
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="theme-input"
            />
            {errors.amount ? <p className="text-xs font-medium text-rose-600">{errors.amount}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="theme-label">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="theme-input"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.category ? <p className="text-xs font-medium text-rose-600">{errors.category}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="theme-label">Type</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="theme-input"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type ? <p className="text-xs font-medium text-rose-600">{errors.type}</p> : null}
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="theme-label">Description</span>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short note about this transaction"
              className="theme-input"
            />
            {errors.description ? (
              <p className="text-xs font-medium text-rose-600">{errors.description}</p>
            ) : null}
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
            >
                {mode === 'edit' ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
