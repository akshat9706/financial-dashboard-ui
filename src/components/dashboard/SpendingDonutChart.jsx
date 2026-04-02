import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { monthKey, monthLabel, fmt } from '../../utils/helpers';
import { CAT_COLORS } from '../../data/transactions';

ChartJS.register(ArcElement, Tooltip);

export default function SpendingDonutChart() {
  const { state } = useApp();
  const { transactions } = state;

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort();
  const lastM  = months[months.length - 1] || '';

  const expenses = transactions.filter((t) => monthKey(t.date) === lastM && t.type === 'expense');
  const catTotals = {};
  expenses.forEach((t) => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const total  = sorted.reduce((s, [, v]) => s + v, 0);

  const data = {
    labels: sorted.map(([k]) => k),
    datasets: [{
      data: sorted.map(([, v]) => v),
      backgroundColor: sorted.map(([k]) => CAT_COLORS[k] || '#636880'),
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const options = {
    cutout: '72%',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1e2a',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        titleColor: '#e8eaf0',
        bodyColor: '#636880',
        callbacks: {
          label: (c) => ` ${fmt(c.raw)} (${(c.raw / total * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
      <div className="mb-5">
        <h3 className="font-head text-[17px] text-ink">Spending by Category</h3>
        <p className="text-[12px] text-muted mt-0.5">
          {lastM ? monthLabel(lastM) : 'This month'}'s breakdown
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted font-mono text-xs tracking-widest">
          NO DATA
        </div>
      ) : (
        <>
          <div className="max-w-[180px] mx-auto">
            <Doughnut data={data} options={options} />
          </div>
          <div className="mt-5 space-y-2.5">
            {sorted.map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: CAT_COLORS[cat] || '#636880' }}
                />
                <span className="flex-1 text-[13px] text-ink">{cat}</span>
                <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(val / total) * 100}%`,
                      background: CAT_COLORS[cat] || '#636880',
                    }}
                  />
                </div>
                <span className="font-mono text-[11px] text-muted w-8 text-right">
                  {(val / total * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
