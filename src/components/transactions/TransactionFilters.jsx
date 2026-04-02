import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { monthKey, monthLabel } from '../../utils/helpers';

export default function TransactionFilters() {
  const { state, actions } = useApp();
  const { filters, transactions } = state;

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort().reverse();
  const cats   = [...new Set(transactions.map((t) => t.category))].sort();

  const set = (k, v) => actions.setFilters({ [k]: v });

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Search */}
      <div className="flex-1 min-w-[180px] flex items-center gap-2.5 bg-surface border border-white/[0.07]
                      rounded-field px-3.5 py-2.5 transition-colors focus-within:border-accent/30">
        <Search size={14} className="text-muted flex-shrink-0" />
        <input
          className="bg-transparent border-none outline-none text-ink font-body text-sm w-full placeholder:text-muted"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      {/* Type filter */}
      <select
        className="form-field w-auto cursor-pointer"
        value={filters.type}
        onChange={(e) => set('type', e.target.value)}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category filter */}
      <select
        className="form-field w-auto cursor-pointer"
        value={filters.category}
        onChange={(e) => set('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {cats.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Month filter */}
      <select
        className="form-field w-auto cursor-pointer"
        value={filters.month}
        onChange={(e) => set('month', e.target.value)}
      >
        <option value="">All Months</option>
        {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
      </select>
    </div>
  );
}
