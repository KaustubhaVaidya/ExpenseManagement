import { Expense, User } from '../types/expense';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'employee',
    department: 'Sales'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    department: 'Sales'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'employee',
    department: 'Marketing'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Client Dinner Meeting',
    amount: 127.50,
    currency: 'USD',
    category: 'Meals & Entertainment',
    date: '2024-01-15',
    description: 'Dinner with potential client to discuss new project opportunities',
    status: 'approved',
    submittedBy: 'John Smith',
    submittedAt: '2024-01-16T09:00:00Z',
    approvedBy: 'Sarah Johnson',
    approvedAt: '2024-01-17T14:30:00Z',
    attachments: [
      {
        id: 'att1',
        name: 'restaurant_receipt.pdf',
        size: 245760,
        type: 'application/pdf',
        url: '/mock-files/receipt1.pdf',
        uploadedAt: '2024-01-16T09:00:00Z',
        abbyySentAt: '2024-01-16T09:01:00Z',
        abbyyProcessedAt: '2024-01-16T09:03:00Z'
      }
    ],
    extractedData: {
      vendor: 'The Steakhouse',
      amount: 127.50,
      currency: 'USD',
      date: '2024-01-15',
      category: 'Restaurant',
      confidence: 0.95,
      extractedAt: '2024-01-16T09:03:00Z'
    },
    processingStatus: 'completed'
  },
  {
    id: '2',
    title: 'Office Supplies',
    amount: 89.99,
    currency: 'USD',
    category: 'Office Supplies',
    date: '2024-01-18',
    description: 'Notebooks, pens, and other office materials',
    status: 'submitted',
    submittedBy: 'Mike Davis',
    submittedAt: '2024-01-18T11:15:00Z',
    attachments: [
      {
        id: 'att2',
        name: 'office_depot_receipt.jpg',
        size: 186420,
        type: 'image/jpeg',
        url: '/mock-files/receipt2.jpg',
        uploadedAt: '2024-01-18T11:15:00Z',
        abbyySentAt: '2024-01-18T11:16:00Z'
      }
    ],
    processingStatus: 'extracting'
  },
  {
    id: '3',
    title: 'Travel - Hotel Stay',
    amount: 342.00,
    currency: 'USD',
    category: 'Travel & Lodging',
    date: '2024-01-20',
    description: '2-night stay for business conference',
    status: 'processing',
    submittedBy: 'John Smith',
    submittedAt: '2024-01-21T08:30:00Z',
    attachments: [
      {
        id: 'att3',
        name: 'hotel_invoice.pdf',
        size: 512000,
        type: 'application/pdf',
        url: '/mock-files/hotel_invoice.pdf',
        uploadedAt: '2024-01-21T08:30:00Z'
      }
    ],
    processingStatus: 'pending'
  },
  {
    id: '4',
    title: 'Software License',
    amount: 199.00,
    currency: 'USD',
    category: 'Software & Technology',
    date: '2024-01-22',
    description: 'Annual license for design software',
    status: 'rejected',
    submittedBy: 'Mike Davis',
    submittedAt: '2024-01-22T16:45:00Z',
    rejectedBy: 'Sarah Johnson',
    rejectedAt: '2024-01-23T10:20:00Z',
    rejectionReason: 'Please provide business justification for this software purchase',
    attachments: [
      {
        id: 'att4',
        name: 'software_receipt.pdf',
        size: 98304,
        type: 'application/pdf',
        url: '/mock-files/software_receipt.pdf',
        uploadedAt: '2024-01-22T16:45:00Z',
        abbyySentAt: '2024-01-22T16:46:00Z',
        abbyyProcessedAt: '2024-01-22T16:48:00Z'
      }
    ],
    extractedData: {
      vendor: 'Adobe Systems',
      amount: 199.00,
      currency: 'USD',
      date: '2024-01-22',
      invoiceNumber: 'ADO-2024-001234',
      category: 'Software',
      confidence: 0.98,
      extractedAt: '2024-01-22T16:48:00Z'
    },
    processingStatus: 'completed'
  }
];

export const expenseCategories = [
  'Meals & Entertainment',
  'Travel & Lodging',
  'Transportation',
  'Office Supplies',
  'Software & Technology',
  'Professional Services',
  'Marketing & Advertising',
  'Training & Education',
  'Utilities',
  'Other'
];