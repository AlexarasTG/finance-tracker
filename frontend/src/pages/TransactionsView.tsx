// src/pages/TransactionsView.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.tsx';
import type { Transaction } from '../api/transactions.ts';

const TransactionsView: React.FC = () => {
  const { transactions: contextTransactions, loading, error, deleteTransaction } = useTransactions();
  
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    let tempTransactions = contextTransactions;
    if (dateFilter) {
      tempTransactions = tempTransactions.filter(t => t.date.includes(dateFilter));
    }
    if (categoryFilter) {
      tempTransactions = tempTransactions.filter(t => t.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }
    return tempTransactions;
  }, [contextTransactions, dateFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      // Data will be refetched by context
    }
  };

  const uniqueCategories = useMemo(() => 
    Array.from(new Set(contextTransactions.map(t => t.category)))
  , [contextTransactions]);

  if (loading && contextTransactions.length === 0) { // Show loading only if no data is present yet
    return <div className="container mx-auto p-4 text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-danger">Error loading transactions: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-ink">Transactions</h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-border-subtle shadow-lg shadow-black/40 flex flex-col md:flex-row gap-4">
        <div>
          <label htmlFor="dateFilter" className="block text-sm font-medium text-ink-soft">Filter by Date:</label>
          <input 
            type="date" 
            id="dateFilter" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
            onDoubleClick={(e) => {
              const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
              if (input.showPicker) {
                input.showPicker();
              }
            }}
            className="mt-1 block w-full p-2 rounded-md bg-app border border-border-subtle text-ink shadow-sm focus:ring-accent-cyan focus:border-accent-cyan sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-ink-soft">Filter by Category:</label>
          <input 
            type="text" 
            id="categoryFilter" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="mt-1 block w-full p-2 rounded-md bg-app border border-border-subtle text-ink placeholder-ink-muted shadow-sm focus:ring-accent-cyan focus:border-accent-cyan sm:text-sm"
            list="categories"
            placeholder="Type or select category"
          />
          <datalist id="categories">
            {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface rounded-xl border border-border-subtle shadow-lg shadow-black/40 overflow-x-auto">
        <table className="min-w-full divide-y divide-border-subtle">
          <thead className="bg-app-soft">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border-subtle">
            {filteredTransactions.map((transaction: Transaction) => (
              <tr
                key={transaction.id}
                className="transition-colors duration-150 hover:bg-surface-elevated"
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-soft">{transaction.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-soft">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-soft">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    to={`/transaction/${transaction.id}/edit`}
                    className="text-accent-cyan hover:text-accent-cyan-soft transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-accent-magenta hover:text-accent-magenta-glow transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-ink-muted">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsView;
