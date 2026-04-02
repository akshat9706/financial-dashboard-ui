import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import { useApp } from '../../context/AppContext';
import { monthKey, monthLabel, getChartDefaults } from '../../utils/helpers';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function IncomeExpenseBarChart() {
  const { state } = useApp();
  const { transactions } = state;

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort().slice(-6);

  const incomeData = months.map((m) =>
    transactions.filter((t) => monthKey(t.date) === m && t.type === 'income').reduce((s, t) => s + t.amount, 0)
  );
  const expData = months.map((m) =>
    transactions.filter((t) => monthKey(t.date) === m && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  );

  const defaults = getChartDefaults();

  const data = {
    labels: months.map(monthLabel),
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(200,240,77,0.7)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: expData,
        backgroundColor: 'rgba(240,96,77,0.5)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
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
    scales: defaults.scales,
  };

  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
      <div className="mb-5">
        <h3 className="font-head text-[17px] text-ink">Monthly Income vs Expenses</h3>
        <p className="text-[12px] text-muted mt-0.5">Last 6 months comparison</p>
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
