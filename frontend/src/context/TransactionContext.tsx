// src/context/TransactionContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  getTransactions as apiGetTransactions,
  addTransaction as apiAddTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getTransactionById as apiGetTransactionById, // Assuming you might want to fetch single fresh from API
} from '../api/transactions'; // .ts extension is optional in imports
import type { Transaction } from '../api/transactions';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transactionData: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined; // This will return from local state
  fetchTransactionById: (id: string) => Promise<Transaction | undefined>; // This will fetch from API
  loading: boolean;
  error: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
      // Potentially set transactions to empty array or keep stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      // Optimistic UI update (optional)
      // const tempId = Date.now().toString();
      // setTransactions(prev => [...prev, { ...transactionData, id: tempId }]);
      setLoading(true); 
      await apiAddTransaction(transactionData);
      await fetchTransactions(); // Refetch all transactions to ensure consistency
      setError(null);
    } catch (err) {
      setError('Failed to add transaction');
      console.error(err);
      // Optionally revert optimistic update if it was implemented
      // await fetchTransactions(); // Or refetch to get original state
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Omit<Transaction, 'id'>>) => {
    try {
      setLoading(true);
      await apiUpdateTransaction(id, transactionData);
      await fetchTransactions(); // Refetch all transactions
      setError(null);
    } catch (err) {
      setError('Failed to update transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      await apiDeleteTransaction(id);
      await fetchTransactions(); // Refetch all transactions
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Gets transaction from the current local state
  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === id);
  };

  // Fetches a single transaction from the API - useful if you need the freshest data for a specific item
  const fetchTransactionById = async (id: string): Promise<Transaction | undefined> => {
    try {
      setLoading(true);
      const data = await apiGetTransactionById(id);
      setError(null);
      // Optionally update the main transactions list if this item is part of it
      // setTransactions(prev => prev.map(t => t.id === id ? data || t : t));
      return data;
    } catch (err) {
      setError('Failed to fetch transaction by ID');
      console.error(err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionById,
      fetchTransactionById,
      loading,
      error
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
