import { Wallet, ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSummary } from '../../hooks/useToast';
import { fmt } from '../../utils/helpers';

function SummaryCard({ icon: Icon, label, value, change, changeDir, accent, delay }) {
  const accentMap = {
    accent:  { icon: 'bg-accent/10  text-accent',   glow: 'before:bg-accent' },
    success: { icon: 'bg-success/10 text-success',   glow: 'before:bg-success' },
    danger:  { icon: 'bg-danger/10  text-danger',    glow: 'before:bg-danger' },
    accent2: { icon: 'bg-accent2/10 text-accent2',   glow: 'before:bg-accent2' },
  };
  const { icon: iconCls } = accentMap[accent] || accentMap.accent;

  return (
    <div
      className="card p-6 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-card
                 transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow blob */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.08]
                       -translate-y-5 translate-x-5
                       ${accent === 'accent' ? 'bg-accent' : accent === 'success' ? 'bg-success' :
                         accent === 'danger' ? 'bg-danger' : 'bg-accent2'}`} />

      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 ${iconCls}`}>
        <Icon size={18} />
      </div>
      <p className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-1.5">{label}</p>
      <p className="font-mono text-[26px] font-medium text-ink tracking-tight leading-none">{value}</p>
      <p className={`font-mono text-[11px] mt-1.5 ${changeDir === 'up' ? 'text-success' : 'text-danger'}`}>
        {change}
      </p>
    </div>
  );
}

export default function SummaryCards() {
  const { state } = useApp();
  const s = useSummary(state.transactions);

  const cards = [
    {
      icon: Wallet, label: 'Total Balance', accent: 'accent',
      value: fmt(s.balance),
      change: s.balance >= 0 ? '↑ Net positive' : '↓ Net negative',
      changeDir: s.balance >= 0 ? 'up' : 'down',
    },
    {
      icon: ArrowUp, label: 'Total Income', accent: 'success',
      value: fmt(s.income),
      change: 'Across all time', changeDir: 'up',
    },
    {
      icon: ArrowDown, label: 'Total Expenses', accent: 'danger',
      value: fmt(s.expenses),
      change: `${s.expChange > 0 ? '↑' : '↓'} ${Math.abs(s.expChange)}% vs last month`,
      changeDir: s.expChange > 0 ? 'down' : 'up',
    },
    {
      icon: PiggyBank, label: 'Savings Rate', accent: 'accent2',
      value: `${s.savingsRate}%`,
      change: s.savingsRate >= 20 ? '↑ On track' : '↓ Below 20% target',
      changeDir: s.savingsRate >= 20 ? 'up' : 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <SummaryCard key={c.label} {...c} delay={i * 70} />
      ))}
    </div>
  );
}
