// src/pages/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.tsx';
import type { Transaction } from '../api/transactions.ts';

const TransactionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { 
    addTransaction,
    updateTransaction,
    getTransactionById,
    // fetchTransactionById, // Alternative for fetching fresh data if needed
    loading,
    error 
  } = useTransactions();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Consider fetching categories from backend or a shared config
  const categories = ['Groceries', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Transport', 'Healthcare', 'Other'];

  useEffect(() => {
    if (isEditing && id) {
      // const existingTransaction = await fetchTransactionById(id); // For freshest data
      const existingTransaction = getTransactionById(id); // From local context state
      if (existingTransaction) {
        setType(existingTransaction.type);
        setAmount(existingTransaction.amount.toString());
        setDescription(existingTransaction.description);
        setDate(existingTransaction.date);
        setCategory(existingTransaction.category);
      } else if (!loading) { // Only show error if not loading and transaction not found
        setFormError(`Transaction with ID ${id} not found.`);
      }
    }
  }, [id, isEditing, getTransactionById, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear previous form errors
    if (!amount || !description || !date || !category) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }

    const transactionData: Omit<Transaction, 'id'> = {
      type,
      amount: parseFloat(amount),
      description,
      date,
      category,
    };

    try {
      if (isEditing && id) {
        await updateTransaction(id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      navigate('/transactions');
    } catch (apiError) {
      // Error is already handled and set in context, but you could add specific form error handling here
      setFormError('Failed to save transaction. Please try again.');
      console.error('Form submission error:', apiError);
    }
  };

  if (loading && isEditing && !amount) {
    // Show loading indicator if editing and data hasn't been populated yet
    return <div className="container mx-auto p-4 max-w-lg text-center">Loading transaction data...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">Context Error: {error}</div>}
      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{formError}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as 'income' | 'expense')} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
            required 
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input 
            type="text" 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Coffee with friends"
            required 
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required 
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={loading}
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Transaction' : 'Add Transaction')}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
