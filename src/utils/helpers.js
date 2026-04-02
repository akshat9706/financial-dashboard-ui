export const fmt = (n) =>
  '₹' + Math.abs(n).toLocaleString('en-IN');

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const monthKey = (d) => d.slice(0, 7);

export const monthLabel = (k) => {
  const [y, m] = k.split('-');
  return new Date(y, m - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
};

export const catClass = (cat) => {
  const map = {
    Food: 'bg-warn/10 text-warn',
    Transport: 'bg-accent2/10 text-accent2',
    Housing: 'bg-purple-500/10 text-purple-400',
    Health: 'bg-success/10 text-success',
    Salary: 'bg-accent/10 text-accent',
    Shopping: 'bg-danger/10 text-danger',
    Entertainment: 'bg-pink-500/10 text-pink-400',
    Freelance: 'bg-teal-400/10 text-teal-400',
    Utilities: 'bg-yellow-700/10 text-yellow-600',
    Investment: 'bg-accent2/10 text-accent2',
    Bonus: 'bg-warn/10 text-warn',
    Other: 'bg-muted/10 text-muted',
  };
  return map[cat] || 'bg-muted/10 text-muted';
};

export const exportCSV = (transactions) => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [t.id, t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ledger_transactions.csv';
  a.click();
};

export const getChartDefaults = () => ({
  tooltip: {
    backgroundColor: '#1a1e2a',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    titleColor: '#e8eaf0',
    bodyColor: '#636880',
    padding: 10,
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#636880', font: { family: 'DM Mono', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: '#636880',
        font: { family: 'DM Mono', size: 11 },
        callback: (v) => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
      },
    },
  },
});
