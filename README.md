# Ledger — Finance Dashboard

A production-grade finance dashboard built with **React 19**, **Tailwind CSS v3**, **Chart.js**, and **Vite**.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

---

## Folder Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardView.jsx          # Overview page container
│   │   ├── SummaryCards.jsx           # 4 KPI cards
│   │   ├── BalanceTrendChart.jsx      # Line chart with 3M/6M/1Y toggle
│   │   ├── SpendingDonutChart.jsx     # Donut chart with legend
│   │   └── IncomeExpenseBarChart.jsx  # Grouped bar chart
│   ├── transactions/
│   │   ├── TransactionsView.jsx       # Transactions page container
│   │   ├── TransactionFilters.jsx     # Search + filter toolbar
│   │   ├── TransactionTable.jsx       # Sortable, filterable table
│   │   └── TransactionModal.jsx       # Add / Edit modal
│   ├── insights/
│   │   ├── InsightsView.jsx           # Insights page container
│   │   ├── InsightCards.jsx           # 4 metric cards
│   │   └── StackedCategoryChart.jsx   # Stacked bar by category
│   └── layout/
│       ├── Sidebar.jsx                # Nav + role switcher
│       └── Topbar.jsx                 # Header bar
├── context/
│   ├── AppContext.jsx                 # Global state (useReducer)
│   └── ToastContext.jsx               # Toast notifications
├── data/
│   └── transactions.js               # Seed data + constants
├── hooks/
│   └── useToast.js                   # Toast + summary hooks
├── utils/
│   └── helpers.js                    # Formatting + CSV export
├── App.jsx
├── main.jsx
└── index.css                         # Tailwind + fonts + custom layers
```

---

## Features

### Dashboard
- 4 KPI Summary Cards (Balance, Income, Expenses, Savings Rate)
- Balance Trend line chart — 3M / 6M / 1Y toggle
- Spending Donut chart — category breakdown for latest month
- Income vs Expenses grouped bar chart — 6-month view

### Transactions
- Sortable table (click column headers)
- Live search + multi-filter (type, category, month)
- Net total of filtered set
- Add / Edit / Delete (Admin only)
- CSV export of filtered view

### Role-Based UI
| Feature | Admin | Viewer |
|---|---|---|
| View all data | YES | YES |
| Add / Edit / Delete | YES | NO |
| Export CSV | YES | YES |

Switch roles via sidebar footer dropdown.

### Insights
- Top spending category (all-time)
- Month-over-month expense % change
- Savings rate vs 20% benchmark
- Average monthly expenses
- Stacked category chart (6 months)

### Extra
- localStorage persistence
- 40 seed transactions across 6 months
- Responsive + mobile sidebar drawer
- Staggered animations + toast notifications
- Empty state handling

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS v3 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Icons | lucide-react |
| State | useReducer + Context API |
| Persistence | localStorage |
| Fonts | DM Serif Display, Syne, DM Mono |

---

## State Architecture

Single AppContext with useReducer:

```js
state = {
  role, view, period,
  transactions, filters, sort,
  modal, nextId
}
```

getFiltered() is a derived selector — components call it directly. Role is enforced at render time only (admin-only actions hidden via conditional JSX).
#   f i n a n c i a l - d a s h b o a r d - u i


# financial-dashboard-ui
