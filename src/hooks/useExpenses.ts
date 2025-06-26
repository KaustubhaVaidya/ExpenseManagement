import { useState, useEffect } from 'react';
import { Expense } from '../types/expense';
import { mockExpenses } from '../services/mockData';
import { apiService } from '../services/api';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      // For demo purposes, use mock data
      // In production, this would be: const data = await apiService.getExpenses();
      setExpenses(mockExpenses);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: Omit<Expense, 'id' | 'submittedAt'>) => {
    try {
      const newExpense = {
        ...expenseData,
        id: `exp_${Date.now()}`,
        submittedAt: new Date().toISOString()
      };
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
      throw err;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = { ...expenses.find(e => e.id === id)!, ...updates };
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      throw err;
    }
  };

  const approveExpense = async (id: string, approverId: string) => {
    return updateExpense(id, {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date().toISOString()
    });
  };

  const rejectExpense = async (id: string, rejectedBy: string, reason: string) => {
    return updateExpense(id, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    approveExpense,
    rejectExpense,
    refreshExpenses: loadExpenses
  };
};