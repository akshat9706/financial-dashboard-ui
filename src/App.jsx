import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardView from './components/dashboard/DashboardView';
import TransactionsView from './components/transactions/TransactionsView';
import InsightsView from './components/insights/InsightsView';
import TransactionModal from './components/transactions/TransactionModal';

function AppContent() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-ink font-body">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-60 min-h-screen">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 lg:p-8">
          {state.view === 'dashboard'    && <DashboardView />}
          {state.view === 'transactions' && <TransactionsView />}
          {state.view === 'insights'     && <InsightsView />}
        </main>
      </div>
      {state.view !== 'transactions' && <TransactionModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}
