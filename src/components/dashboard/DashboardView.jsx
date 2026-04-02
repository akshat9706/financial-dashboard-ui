import SummaryCards from './SummaryCards';
import BalanceTrendChart from './BalanceTrendChart';
import SpendingDonutChart from './SpendingDonutChart';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';

export default function DashboardView() {
  return (
    <div>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mb-4">
        <BalanceTrendChart />
        <SpendingDonutChart />
      </div>
      <IncomeExpenseBarChart />
    </div>
  );
}
