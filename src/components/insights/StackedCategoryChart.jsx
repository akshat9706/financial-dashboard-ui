import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import { useApp } from '../../context/AppContext';
import { monthKey, monthLabel, getChartDefaults } from '../../utils/helpers';
import { CAT_COLORS } from '../../data/transactions';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StackedCategoryChart() {
  const { state } = useApp();
  const { transactions } = state;

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort().slice(-6);

  const allExpCats = [...new Set(transactions.filter((t) => t.type === 'expense').map((t) => t.category))];
  const topCats = allExpCats
    .sort((a, b) => {
      const ta = transactions.filter((t) => t.category === a && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const tb = transactions.filter((t) => t.category === b && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return tb - ta;
    })
    .slice(0, 5);

  const defaults = getChartDefaults();

  const data = {
    labels: months.map(monthLabel),
    datasets: topCats.map((cat) => ({
      label: cat,
      data: months.map((m) =>
        transactions
          .filter((t) => t.category === cat && monthKey(t.date) === m && t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0)
      ),
      backgroundColor: (CAT_COLORS[cat] || '#636880') + 'bb',
      borderRadius: 4,
      borderSkipped: false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#636880',
          font: { family: 'DM Mono', size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          padding: 16,
        },
      },
      tooltip: {
        ...defaults.tooltip,
        callbacks: { label: (c) => ` ${c.dataset.label}: ₹${c.raw.toLocaleString('en-IN')}` },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#636880', font: { family: 'DM Mono', size: 11 } },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#636880',
          font: { family: 'DM Mono', size: 11 },
          callback: (v) => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
        },
      },
    },
  };

  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="mb-5">
        <h3 className="font-head text-[17px] text-ink">Month-over-Month Spending</h3>
        <p className="text-[12px] text-muted mt-0.5">Top 5 category breakdown per month</p>
      </div>
      {months.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted font-mono text-xs tracking-widest">
          NO DATA
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
