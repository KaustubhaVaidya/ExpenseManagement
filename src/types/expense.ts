export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  description: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid';
  submittedBy: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  attachments: Attachment[];
  extractedData?: ExtractedData;
  processingStatus?: 'pending' | 'extracting' | 'completed' | 'failed';
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  abbyySentAt?: string;
  abbyyProcessedAt?: string;
}

export interface ExtractedData {
  vendor?: string;
  amount?: number;
  currency?: string;
  date?: string;
  invoiceNumber?: string;
  category?: string;
  confidence?: number;
  extractedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  department: string;
}

export interface AbbyyRequest {
  expenseId: string;
  attachmentId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export interface AbbyyResponse {
  expenseId: string;
  attachmentId: string;
  extractedData: ExtractedData;
  success: boolean;
  error?: string;
}