import { useState, useEffect } from 'react';
import { Expense } from '../types/expense';
import { supabaseService } from '../services/supabase';

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
      const data = await supabaseService.getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: Omit<Expense, 'id' | 'submittedAt'>) => {
    try {
      const newExpense = await supabaseService.createExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = await supabaseService.updateExpense(id, updates);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const approveExpense = async (id: string, approverId: string) => {
    try {
      const updatedExpense = await supabaseService.approveExpense(id, approverId);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const rejectExpense = async (id: string, rejectedBy: string, reason: string) => {
    try {
      const updatedExpense = await supabaseService.rejectExpense(id, rejectedBy, reason);
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
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