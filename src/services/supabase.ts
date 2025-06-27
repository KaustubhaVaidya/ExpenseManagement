import { supabase } from '../lib/supabase';
import { Expense, Attachment, ExtractedData, User } from '../types/expense';
import { Database } from '../types/database';

type ExpenseRow = Database['public']['Tables']['expenses']['Row'];
type AttachmentRow = Database['public']['Tables']['attachments']['Row'];
type ExtractedDataRow = Database['public']['Tables']['extracted_data']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

class SupabaseService {
  // User management
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!profile) return null;

      return this.mapUserRowToUser(profile);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  async createUserProfile(user: any, additionalData: { name: string; role: 'employee' | 'manager' }): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: additionalData.name,
          email: user.email,
          role: additionalData.role,
          department: additionalData.role === 'manager' ? 'Management' : 'General'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
      
      return this.mapUserRowToUser(data);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      throw error;
    }
  }

  // Expense management
  async getExpenses(): Promise<Expense[]> {
    try {
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          *,
          attachments(*),
          extracted_data(*),
          submitted_by_user:users!expenses_submitted_by_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        throw expensesError;
      }

      return Promise.all(expensesData.map(async (expense: any) => {
        return this.mapExpenseRowToExpense(expense);
      }));
    } catch (error) {
      console.error('Error in getExpenses:', error);
      throw error;
    }
  }

  async createExpense(expenseData: Omit<Expense, 'id' | 'submittedAt'>): Promise<Expense> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: expenseRow, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          title: expenseData.title,
          amount: expenseData.amount,
          currency: expenseData.currency,
          category: expenseData.category,
          date: expenseData.date,
          description: expenseData.description,
          status: expenseData.status,
          submitted_by: user.id,
          submitted_at: expenseData.status === 'submitted' ? new Date().toISOString() : null,
          processing_status: expenseData.processingStatus || 'pending'
        })
        .select()
        .single();

      if (expenseError) {
        console.error('Error creating expense:', expenseError);
        throw expenseError;
      }

      // Create attachments
      if (expenseData.attachments.length > 0) {
        const attachmentInserts = expenseData.attachments.map(att => ({
          expense_id: expenseRow.id,
          name: att.name,
          size: att.size,
          type: att.type,
          url: att.url,
          uploaded_at: att.uploadedAt,
          abbyy_sent_at: att.abbyySentAt || null,
          abbyy_processed_at: att.abbyyProcessedAt || null
        }));

        const { error: attachmentError } = await supabase
          .from('attachments')
          .insert(attachmentInserts);

        if (attachmentError) {
          console.error('Error creating attachments:', attachmentError);
          throw attachmentError;
        }
      }

      // Create extracted data if available
      if (expenseData.extractedData) {
        const { error: extractedError } = await supabase
          .from('extracted_data')
          .insert({
            expense_id: expenseRow.id,
            vendor: expenseData.extractedData.vendor,
            amount: expenseData.extractedData.amount,
            currency: expenseData.extractedData.currency,
            date: expenseData.extractedData.date,
            invoice_number: expenseData.extractedData.invoiceNumber,
            category: expenseData.extractedData.category,
            confidence: expenseData.extractedData.confidence,
            extracted_at: expenseData.extractedData.extractedAt
          });

        if (extractedError) {
          console.error('Error creating extracted data:', extractedError);
          throw extractedError;
        }
      }

      // Fetch the complete expense with relations
      return this.getExpenseById(expenseRow.id);
    } catch (error) {
      console.error('Error in createExpense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.currency !== undefined) updateData.currency = updates.currency;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy;
      if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt;
      if (updates.rejectedBy !== undefined) updateData.rejected_by = updates.rejectedBy;
      if (updates.rejectedAt !== undefined) updateData.rejected_at = updates.rejectedAt;
      if (updates.rejectionReason !== undefined) updateData.rejection_reason = updates.rejectionReason;
      if (updates.processingStatus !== undefined) updateData.processing_status = updates.processingStatus;

      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }

      return this.getExpenseById(id);
    } catch (error) {
      console.error('Error in updateExpense:', error);
      throw error;
    }
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

  private async getExpenseById(id: string): Promise<Expense> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          attachments(*),
          extracted_data(*),
          submitted_by_user:users!expenses_submitted_by_fkey(name),
          approved_by_user:users!expenses_approved_by_fkey(name),
          rejected_by_user:users!expenses_rejected_by_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expense by ID:', error);
        throw error;
      }
      
      return this.mapExpenseRowToExpense(data);
    } catch (error) {
      console.error('Error in getExpenseById:', error);
      throw error;
    }
  }

  // File upload
  async uploadFile(file: File, expenseId: string): Promise<{ url: string; attachmentId: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${expenseId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('expense-attachments')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('expense-attachments')
        .getPublicUrl(fileName);

      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .insert({
          expense_id: expenseId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl
        })
        .select()
        .single();

      if (attachmentError) {
        console.error('Error creating attachment record:', attachmentError);
        throw attachmentError;
      }

      return {
        url: publicUrl,
        attachmentId: attachmentData.id
      };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  // Authentication - Optimized signup process
  async signUp(email: string, password: string, userData: { name: string; role: 'employee' | 'manager' }) {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase.auth.getUser();
      if (existingUser?.user?.email === email) {
        throw new Error('User already registered with this email');
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile immediately after successful signup
      let user: User;
      try {
        user = await this.createUserProfile(data.user, userData);
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // If profile creation fails, we should still return the auth user
        // The profile will be created on next login attempt
        user = {
          id: data.user.id,
          name: userData.name,
          email: data.user.email || email,
          role: userData.role,
          department: userData.role === 'manager' ? 'Management' : 'General'
        };
      }
      
      return { user, session: data.session };
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  // Helper methods
  private mapUserRowToUser(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      department: row.department || 'General'
    };
  }

  private mapExpenseRowToExpense(row: any): Expense {
    const attachments: Attachment[] = (row.attachments || []).map((att: AttachmentRow) => ({
      id: att.id,
      name: att.name,
      size: att.size,
      type: att.type,
      url: att.url,
      uploadedAt: att.uploaded_at || att.created_at,
      abbyySentAt: att.abbyy_sent_at || undefined,
      abbyyProcessedAt: att.abbyy_processed_at || undefined
    }));

    let extractedData: ExtractedData | undefined;
    if (row.extracted_data && row.extracted_data.length > 0) {
      const ed = row.extracted_data[0];
      extractedData = {
        vendor: ed.vendor || undefined,
        amount: ed.amount || undefined,
        currency: ed.currency || undefined,
        date: ed.date || undefined,
        invoiceNumber: ed.invoice_number || undefined,
        category: ed.category || undefined,
        confidence: ed.confidence || undefined,
        extractedAt: ed.extracted_at || ed.created_at
      };
    }

    return {
      id: row.id,
      title: row.title,
      amount: row.amount,
      currency: row.currency,
      category: row.category,
      date: row.date,
      description: row.description || '',
      status: row.status,
      submittedBy: row.submitted_by_user?.name || 'Unknown',
      submittedAt: row.submitted_at || undefined,
      approvedBy: row.approved_by_user?.name || undefined,
      approvedAt: row.approved_at || undefined,
      rejectedBy: row.rejected_by_user?.name || undefined,
      rejectedAt: row.rejected_at || undefined,
      rejectionReason: row.rejection_reason || undefined,
      attachments,
      extractedData,
      processingStatus: row.processing_status || undefined
    };
  }
}

export const supabaseService = new SupabaseService();