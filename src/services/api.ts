import { Expense, AbbyyRequest, AbbyyResponse, ExtractedData } from '../types/expense';

const API_BASE_URL = '/api';
const ABBYY_VANTAGE_URL = import.meta.env.VITE_ABBYY_VANTAGE_URL || 'https://api.abbyy.com/vantage';

class ApiService {
  // Expense management
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  }

  async createExpense(expense: Omit<Expense, 'id' | 'submittedAt'>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  }

  async approveExpense(id: string, approverId: string): Promise<Expense> {
    return this.updateExpense(id, {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date().toISOString()
    });
  }

  async rejectExpense(id: string, rejectedBy: string, reason: string): Promise<Expense> {
    return this.updateExpense(id, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  }

  // File upload
  async uploadFile(file: File, expenseId: string): Promise<{ url: string; attachmentId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expenseId', expenseId);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  }

  // ABBYY Vantage integration
  async sendToAbbyy(request: AbbyyRequest): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/abbyy/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending to ABBYY:', error);
      return false;
    }
  }

  // API Gateway endpoint for ABBYY callback
  async handleAbbyyCallback(data: AbbyyResponse): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/abbyy/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error handling ABBYY callback:', error);
    }
  }
}

export const apiService = new ApiService();