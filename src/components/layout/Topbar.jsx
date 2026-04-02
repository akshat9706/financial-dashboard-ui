import { Menu, Plus, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToastCtx } from '../../context/ToastContext';
import { exportCSV } from '../../utils/helpers';

const VIEW_TITLES = {
  dashboard:    'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
};

export default function Topbar({ onMenuClick }) {
  const { state, actions, getFiltered } = useApp();
  const toast = useToastCtx();

  const handleExport = () => {
    exportCSV(getFiltered());
    toast('Exported as CSV', 'success');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/[0.07] h-16
                       flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3.5">
        <button onClick={onMenuClick} className="lg:hidden btn-icon">
          <Menu size={18} />
        </button>
        <h1 className="font-head text-xl text-ink">{VIEW_TITLES[state.view]}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button onClick={handleExport} className="btn-ghost hidden sm:flex">
          <Download size={14} />
          Export
        </button>
        {state.role === 'admin' && (
          <button onClick={() => actions.openModal(null)} className="btn-primary">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}
