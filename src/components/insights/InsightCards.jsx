import { useApp } from '../../context/AppContext';
import { useSummary } from '../../hooks/useToast';
import { fmt, monthLabel, monthKey } from '../../utils/helpers';

function InsightCard({ dot, label, value, valueColor, desc, delay }) {
  return (
    <div
      className="card p-6 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
        <span className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase">{label}</span>
      </div>
      <p className="font-head text-[34px] leading-none mb-2" style={{ color: valueColor || '#e8eaf0' }}>
        {value}
      </p>
      <p
        className="text-[13px] text-muted leading-relaxed"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  );
}

export default function InsightCards() {
  const { state } = useApp();
  const { transactions } = state;
  const s = useSummary(transactions);

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort();
  const lastM  = months[months.length - 1] || '';

  const catTotals = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0] || ['—', 0];

  const avgMonthlyExp = months.length
    ? Math.round(transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / months.length)
    : 0;

  const incThisM = transactions.filter((t) => monthKey(t.date) === lastM && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expThisM = transactions.filter((t) => monthKey(t.date) === lastM && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savRate  = incThisM > 0 ? ((incThisM - expThisM) / incThisM * 100).toFixed(1) : 0;

  const pct = Number(s.expChange);

  const cards = [
    {
      dot: '#c8f04d', label: 'Top Spending Category',
      value: topCat[0],
      valueColor: '#e8eaf0',
      desc: `You've spent <span style="color:#c8f04d;font-weight:600">${fmt(topCat[1])}</span> on ${topCat[0]} overall — your biggest expense category.`,
    },
    {
      dot: '#4d9ff0', label: 'Month-over-Month',
      value: `${pct > 0 ? '↑' : '↓'}${Math.abs(pct)}%`,
      valueColor: pct > 0 ? '#f0604d' : '#4df0a0',
      desc: `Expenses ${pct > 0 ? 'increased' : 'decreased'} vs last month. <span style="color:#c8f04d;font-weight:600">${monthLabel(s.lastM)}: ${fmt(s.expThisM)}</span> vs ${monthLabel(s.prevM)}: ${fmt(s.expPrevM)}`,
    },
    {
      dot: '#4df0a0', label: 'Savings Rate (This Month)',
      value: `${savRate}%`,
      valueColor: savRate >= 20 ? '#4df0a0' : '#f0c44d',
      desc: savRate >= 20
        ? `Great! You're saving above the 20% benchmark. Keep it up!`
        : `Aim for 20%+ savings. You saved <span style="color:#c8f04d;font-weight:600">${fmt(incThisM - expThisM)}</span> this month.`,
    },
    {
      dot: '#f0c44d', label: 'Avg Monthly Expenses',
      value: fmt(avgMonthlyExp),
      valueColor: '#e8eaf0',
      desc: `Average monthly spending across <span style="color:#c8f04d;font-weight:600">${months.length} months</span> of tracked data.`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <InsightCard key={c.label} {...c} delay={i * 70} />
      ))}
    </div>
  );
}
