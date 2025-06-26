export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'employee' | 'manager' | 'admin'
          department: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          title: string
          amount: number
          currency: string
          category: string
          date: string
          description: string
          status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by: string
          submitted_at: string | null
          approved_by: string | null
          approved_at: string | null
          rejected_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          processing_status: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          amount: number
          currency?: string
          category: string
          date: string
          description?: string
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by: string
          submitted_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          rejected_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          processing_status?: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          currency?: string
          category?: string
          date?: string
          description?: string
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
          submitted_by?: string
          submitted_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          rejected_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          processing_status?: 'pending' | 'extracting' | 'completed' | 'failed' | null
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          expense_id: string
          name: string
          size: number
          type: string
          url: string
          uploaded_at: string
          abbyy_sent_at: string | null
          abbyy_processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          name: string
          size: number
          type: string
          url: string
          uploaded_at?: string
          abbyy_sent_at?: string | null
          abbyy_processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          name?: string
          size?: number
          type?: string
          url?: string
          uploaded_at?: string
          abbyy_sent_at?: string | null
          abbyy_processed_at?: string | null
          created_at?: string
        }
      }
      extracted_data: {
        Row: {
          id: string
          expense_id: string
          vendor: string | null
          amount: number | null
          currency: string | null
          date: string | null
          invoice_number: string | null
          category: string | null
          confidence: number | null
          extracted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          vendor?: string | null
          amount?: number | null
          currency?: string | null
          date?: string | null
          invoice_number?: string | null
          category?: string | null
          confidence?: number | null
          extracted_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          vendor?: string | null
          amount?: number | null
          currency?: string | null
          date?: string | null
          invoice_number?: string | null
          category?: string | null
          confidence?: number | null
          extracted_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'employee' | 'manager' | 'admin'
      expense_status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
      processing_status: 'pending' | 'extracting' | 'completed' | 'failed'
    }
  }
}