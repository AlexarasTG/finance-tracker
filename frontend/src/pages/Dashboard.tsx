// src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
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
    return <div className="container mx-auto p-4 text-center text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-green-600">Total Income</h2>
          <p className="text-2xl">${summary.income.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-600">Total Expenses</h2>
          <p className="text-2xl">${summary.expenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-blue-600">Current Balance</h2>
          <p className="text-2xl">${summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown (Mock Chart)</h2>
        {/* Pass transaction data to MockChart if it can accept it, or update MockChart to use context */}
        <MockChart /> 
      </div>

      {/* Actions */}
      <div className="flex space-x-4 mb-6">
        <Link 
          to="/transaction/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Add New Transaction
        </Link>
        <button 
          onClick={() => setIsAdvicePanelOpen(!isAdvicePanelOpen)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          {isAdvicePanelOpen ? 'Hide' : 'Show'} AI Financial Advice
        </button>
      </div>
      
      <AiAdvicePanel isOpen={isAdvicePanelOpen} onClose={() => setIsAdvicePanelOpen(false)} />

    </div>
  );
};

export default Dashboard;
