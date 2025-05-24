// src/api/transactions.ts
import axios from 'axios';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

// --- Mock Data and Functions (Fallback) ---
let mockTransactionsData: Transaction[] = [
  { id: '1', type: 'income', amount: 2000, category: 'Salary', date: '2024-05-01', description: 'Monthly paycheck' },
  { id: '2', type: 'expense', amount: 75.50, category: 'Groceries', date: '2024-05-03', description: 'Weekly grocery shopping at Trader Joes' },
  { id: '3', type: 'expense', amount: 1200, category: 'Rent', date: '2024-05-05', description: 'Monthly rent payment' },
  { id: '4', type: 'expense', amount: 45.00, category: 'Entertainment', date: '2024-05-07', description: 'Movie tickets and popcorn' },
  { id: '5', type: 'income', amount: 300, category: 'Freelance', date: '2024-05-10', description: 'Payment for freelance design work' },
  { id: '6', type: 'expense', amount: 22.99, category: 'Utilities', date: '2024-05-12', description: 'Internet bill' },
  { id: '7', type: 'expense', amount: 55.00, category: 'Transport', date: '2024-05-15', description: 'Monthly public transport pass' },
  { id: '8', type: 'expense', amount: 150.75, category: 'Healthcare', date: '2024-05-20', description: 'Dentist check-up' },
];

const getMockTransactions = (): Transaction[] => {
  console.warn('API unavailable, using mock data for getTransactions.');
  return [...mockTransactionsData];
};

const getMockTransactionById = (id: string): Transaction | undefined => {
  console.warn(`API unavailable, using mock data for getTransactionById (id: ${id}).`);
  return mockTransactionsData.find(transaction => transaction.id === id);
};

const addMockTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
  console.warn('API unavailable, using mock data for addTransaction.');
  const newTransaction: Transaction = {
    ...transactionData,
    id: (Math.random() * 1000000).toFixed(0).toString(),
  };
  mockTransactionsData.push(newTransaction);
  return newTransaction;
};

const updateMockTransaction = (updatedTransaction: Transaction): Transaction | undefined => {
  console.warn(`API unavailable, using mock data for updateTransaction (id: ${updatedTransaction.id}).`);
  const index = mockTransactionsData.findIndex(t => t.id === updatedTransaction.id);
  if (index !== -1) {
    mockTransactionsData[index] = updatedTransaction;
    return updatedTransaction;
  }
  return undefined;
};

const deleteMockTransaction = (id: string): boolean => {
  console.warn(`API unavailable, using mock data for deleteTransaction (id: ${id}).`);
  const initialLength = mockTransactionsData.length;
  mockTransactionsData = mockTransactionsData.filter(transaction => transaction.id !== id);
  return mockTransactionsData.length < initialLength;
};

// --- API Service Functions ---

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions from API:', error);
    return getMockTransactions();
  }
};

export const getTransactionById = async (id: string): Promise<Transaction | undefined> => {
  try {
    const response = await axios.get<Transaction>(`${API_BASE_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id} from API:`, error);
    return getMockTransactionById(id);
  }
};

export const addTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction via API:', error);
    return addMockTransaction(transactionData);
  }
};

export const updateTransaction = async (id: string, transactionUpdateData: Partial<Omit<Transaction, 'id'>>): Promise<Transaction | undefined> => {
  try {
    const response = await axios.put<Transaction>(`${API_BASE_URL}/transactions/${id}`, transactionUpdateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction with id ${id} via API:`, error);
    const currentMock = getMockTransactionById(id);
    if (currentMock) {
      return updateMockTransaction({ ...currentMock, ...transactionUpdateData, id: currentMock.id });
    }
    return undefined;
  }
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/transactions/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting transaction with id ${id} via API:`, error);
    return deleteMockTransaction(id);
  }
};
