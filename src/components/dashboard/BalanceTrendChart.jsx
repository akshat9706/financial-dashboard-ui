import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale,
  Filler, Tooltip, Legend,
} from 'chart.js';
import { useApp } from '../../context/AppContext';
import { monthKey, monthLabel, getChartDefaults } from '../../utils/helpers';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const PERIODS = ['3m', '6m', '1y'];

export default function BalanceTrendChart() {
  const { state, actions } = useApp();
  const { transactions, period } = state;

  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort();
  const count  = period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const shown  = months.slice(-count);

  let running = 0;
  const balanceData = shown.map((m) => {
    const inc = transactions.filter((t) => monthKey(t.date) === m && t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => monthKey(t.date) === m && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    running += inc - exp;
    return running;
  });

  const defaults = getChartDefaults();

  const data = {
    labels: shown.map(monthLabel),
    datasets: [{
      label: 'Balance',
      data: balanceData,
      fill: true,
      borderColor: '#c8f04d',
      backgroundColor: (ctx) => {
        if (!ctx.chart.chartArea) return 'transparent';
        const { top, bottom } = ctx.chart.chartArea;
        const g = ctx.chart.ctx.createLinearGradient(0, top, 0, bottom);
        g.addColorStop(0, 'rgba(200,240,77,0.18)');
        g.addColorStop(1, 'rgba(200,240,77,0)');
        return g;
      },
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#c8f04d',
      pointBorderColor: '#0d0f14',
      pointBorderWidth: 2,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...defaults.tooltip,
        callbacks: { label: (c) => ` ₹${Math.abs(c.raw).toLocaleString('en-IN')}` },
      },
    },
    scales: defaults.scales,
  };

  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-head text-[17px] text-ink">Balance Trend</h3>
          <p className="text-[12px] text-muted mt-0.5">Running balance over time</p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => actions.setPeriod(p)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer
                          ${period === p
                            ? 'bg-accent/10 text-accent border-accent/20'
                            : 'text-muted border-transparent hover:text-ink hover:bg-white/5'}`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
