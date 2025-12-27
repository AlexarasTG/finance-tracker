// src/pages/Dashboard.tsx
import React from 'react';
import MockChart from '../components/MockChart.tsx';
import AiAdvicePanel from '../components/AiAdvicePanel.tsx';
import { useTransactions } from '../context/TransactionContext.tsx';
import type { Transaction } from '../api/transactions.ts';

const Dashboard: React.FC = () => {
  const [isAdvicePanelOpen, setIsAdvicePanelOpen] = React.useState(false);
  const { transactions, loading, error } = useTransactions();

  const calculateSummary = (currentTransactions: Transaction[]) => {
    const income = currentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = currentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  };

  const summary = React.useMemo(() => calculateSummary(transactions), [transactions]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-danger">Error loading data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">Dashboard</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-lg shadow-black/40">
          <h2 className="text-sm font-medium text-success">Total Income</h2>
          <p className="mt-2 text-3xl font-semibold text-ink">${summary.income.toFixed(2)}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-lg shadow-black/40">
          <h2 className="text-sm font-medium text-accent-magenta">Total Expenses</h2>
          <p className="mt-2 text-3xl font-semibold text-ink">${summary.expenses.toFixed(2)}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-lg shadow-black/40">
          <h2 className="text-sm font-medium text-accent-cyan">Current Balance</h2>
          <p className="mt-2 text-3xl font-semibold text-ink">${summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-lg shadow-black/40">
        <h2 className="text-lg font-semibold text-ink mb-4">Expense Breakdown (Mock Chart)</h2>
        {/* Pass transaction data to MockChart if it can accept it, or update MockChart to use context */}
        <MockChart /> 
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={() => setIsAdvicePanelOpen(!isAdvicePanelOpen)}
          className="bg-primary-purple hover:bg-primary-purple-deep text-ink font-semibold py-2.5 px-5 rounded-lg shadow-sm shadow-black/40 transition-colors duration-150 ease-in-out"
        >
          {isAdvicePanelOpen ? 'Hide' : 'Show'} AI Financial Advice
        </button>
      </div>
      
      <AiAdvicePanel isOpen={isAdvicePanelOpen} onClose={() => setIsAdvicePanelOpen(false)} />

    </div>
  );
};

export default Dashboard;
