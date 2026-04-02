import { Pencil, Trash2, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToastCtx } from '../../context/ToastContext';
import { fmt, fmtDate, catClass } from '../../utils/helpers';

const COLS = [
  { key: 'date',        label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'category',    label: 'Category' },
  { key: 'amount',      label: 'Amount' },
  { key: 'type',        label: 'Type' },
];

function SortIcon({ col, sort }) {
  if (sort.key !== col) return <ChevronsUpDown size={12} className="opacity-30 ml-1" />;
  return sort.dir === 1
    ? <ChevronUp size={12} className="text-accent ml-1" />
    : <ChevronDown size={12} className="text-accent ml-1" />;
}

export default function TransactionTable() {
  const { state, actions, getFiltered } = useApp();
  const toast = useToastCtx();
  const { role, sort } = state;

  const filtered = getFiltered();
  const net = filtered.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    actions.deleteTx(id);
    toast('Transaction deleted', 'success');
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {COLS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => actions.setSort(key)}
                    className="px-5 py-3.5 text-left font-mono text-[10px] text-muted tracking-[1.5px]
                               uppercase border-b border-white/[0.07] cursor-pointer select-none
                               hover:text-ink transition-colors whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">
                      {label}
                      <SortIcon col={key} sort={sort} />
                    </span>
                  </th>
                ))}
                {role === 'admin' && (
                  <th className="px-5 py-3.5 text-right font-mono text-[10px] text-muted tracking-[1.5px]
                                 uppercase border-b border-white/[0.07]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="text-4xl mb-3 opacity-40">🔍</span>
                      <h3 className="font-head text-xl text-ink mb-1">No transactions found</h3>
                      <p className="text-muted text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors
                               animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
                  >
                    <td className="px-5 py-4 font-mono text-[12px] text-muted whitespace-nowrap">
                      {fmtDate(t.date)}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-ink">
                      {t.description}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-[11px] px-2.5 py-1 rounded-full font-medium ${catClass(t.category)}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-5 py-4 font-mono text-[14px] font-medium text-right whitespace-nowrap
                                    ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => actions.openModal(t.id)}
                            className="btn-icon"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="btn-icon-danger"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <p className="font-mono text-[11px] text-muted mt-3">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} ·{' '}
          Net:{' '}
          <span className={net >= 0 ? 'text-success' : 'text-danger'}>
            {net >= 0 ? '+' : ''}{fmt(net)}
          </span>
        </p>
      )}
    </>
  );
}
