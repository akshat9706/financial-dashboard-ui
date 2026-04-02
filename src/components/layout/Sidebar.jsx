import { LayoutDashboard, ArrowLeftRight, TrendingUp, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToastCtx } from '../../context/ToastContext';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Overview',     Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     Icon: TrendingUp },
];

export default function Sidebar({ open, onClose }) {
  const { state, actions } = useApp();
  const toast = useToastCtx();

  const handleRole = (role) => {
    actions.setRole(role);
    toast(
      role === 'admin'
        ? 'Switched to Admin — full access enabled'
        : 'Switched to Viewer — read-only mode',
      'success'
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[99] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 bg-surface border-r border-white/[0.07]
                    flex flex-col z-[100] transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.07] flex items-start justify-between">
          <div>
            <div className="font-head text-2xl text-accent tracking-tight">Ledger</div>
            <div className="font-mono text-[10px] text-muted tracking-[2px] uppercase mt-0.5">
              Finance Dashboard
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden btn-icon mt-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="py-4 flex-1">
          <p className="font-mono text-[10px] text-muted tracking-[2px] uppercase px-6 py-2">Menu</p>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <div
              key={id}
              className={`nav-item ${state.view === id ? 'nav-item-active' : ''}`}
              onClick={() => { actions.setView(id); onClose(); }}
            >
              <Icon size={17} className="flex-shrink-0 opacity-80" />
              {label}
            </div>
          ))}
        </nav>

        {/* Role Switcher */}
        <div className="p-4 border-t border-white/[0.07]">
          <div className="bg-surface2 border border-white/[0.07] rounded-field p-3.5">
            <p className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-2">
              Current Role
            </p>
            <select
              value={state.role}
              onChange={(e) => handleRole(e.target.value)}
              className="w-full bg-transparent border-none text-accent font-body text-sm
                         font-semibold cursor-pointer outline-none appearance-none"
            >
              <option value="admin">Administrator</option>
              <option value="viewer">Viewer</option>
            </select>
            <div
              className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-full
                          ${state.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-accent2/10 text-accent2'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {state.role === 'admin' ? 'Admin Access' : 'View Only'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
