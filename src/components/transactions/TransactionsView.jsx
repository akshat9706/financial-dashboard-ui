import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionModal from './TransactionModal';

export default function TransactionsView() {
  return (
    <div>
      <TransactionFilters />
      <TransactionTable />
      <TransactionModal />
    </div>
  );
}
