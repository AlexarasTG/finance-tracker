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
    return <div className="container mx-auto p-4 text-center text-red-500">Error loading transactions: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Link 
          to="/transaction/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Add New Transaction
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
        <div>
          <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">Filter by Date (YYYY-MM-DD):</label>
          <input 
            type="text" 
            id="dateFilter" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">Filter by Category:</label>
          <input 
            type="text" 
            id="categoryFilter" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            list="categories"
            placeholder="Type or select category"
          />
          <datalist id="categories">
            {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link to={`/transaction/${transaction.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsView;
