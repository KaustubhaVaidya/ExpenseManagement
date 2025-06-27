/*
  # Insert Demo Data for ExpenseFlow Application

  1. Demo Users
    - John Smith (Employee) - john@company.com
    - Sarah Johnson (Manager) - sarah@company.com
    - Mike Davis (Employee) - mike@company.com
    - Admin User (Admin) - admin@company.com

  2. Sample Expenses
    - Various expense categories and statuses
    - Attachments and extracted data examples
    - Different approval states

  3. Sample Attachments
    - Mock file attachments for expenses
    - ABBYY processing status examples

  4. Sample Extracted Data
    - AI-extracted information from receipts
    - Confidence scores and vendor information
*/

-- Insert demo users (these will be linked to auth.users when they sign up)
INSERT INTO users (id, name, email, role, department, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Smith', 'john@company.com', 'employee', 'Sales', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', 'sarah@company.com', 'manager', 'Management', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Mike Davis', 'mike@company.com', 'employee', 'Marketing', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Admin User', 'admin@company.com', 'admin', 'IT', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample expenses
INSERT INTO expenses (id, title, amount, currency, category, date, description, status, submitted_by, submitted_at, approved_by, approved_at, rejected_by, rejected_at, rejection_reason, processing_status, created_at, updated_at) VALUES
  (
    'exp-001',
    'Client Dinner Meeting',
    127.50,
    'USD',
    'Meals & Entertainment',
    '2024-01-15',
    'Dinner with potential client to discuss new project opportunities',
    'approved',
    '11111111-1111-1111-1111-111111111111',
    '2024-01-16T09:00:00Z',
    '22222222-2222-2222-2222-222222222222',
    '2024-01-17T14:30:00Z',
    NULL,
    NULL,
    NULL,
    'completed',
    '2024-01-16T09:00:00Z',
    '2024-01-17T14:30:00Z'
  ),
  (
    'exp-002',
    'Office Supplies Purchase',
    89.99,
    'USD',
    'Office Supplies',
    '2024-01-18',
    'Notebooks, pens, and other office materials for the team',
    'submitted',
    '33333333-3333-3333-3333-333333333333',
    '2024-01-18T11:15:00Z',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'extracting',
    '2024-01-18T11:15:00Z',
    '2024-01-18T11:15:00Z'
  ),
  (
    'exp-003',
    'Business Conference Hotel',
    342.00,
    'USD',
    'Travel & Lodging',
    '2024-01-20',
    '2-night stay for annual business conference in Chicago',
    'processing',
    '11111111-1111-1111-1111-111111111111',
    '2024-01-21T08:30:00Z',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pending',
    '2024-01-21T08:30:00Z',
    '2024-01-21T08:30:00Z'
  ),
  (
    'exp-004',
    'Design Software License',
    199.00,
    'USD',
    'Software & Technology',
    '2024-01-22',
    'Annual license for Adobe Creative Suite',
    'rejected',
    '33333333-3333-3333-3333-333333333333',
    '2024-01-22T16:45:00Z',
    NULL,
    NULL,
    '22222222-2222-2222-2222-222222222222',
    '2024-01-23T10:20:00Z',
    'Please provide business justification for this software purchase and get approval from department head first.',
    'completed',
    '2024-01-22T16:45:00Z',
    '2024-01-23T10:20:00Z'
  ),
  (
    'exp-005',
    'Transportation - Uber to Airport',
    45.75,
    'USD',
    'Transportation',
    '2024-01-25',
    'Uber ride to airport for business trip',
    'approved',
    '11111111-1111-1111-1111-111111111111',
    '2024-01-25T14:20:00Z',
    '22222222-2222-2222-2222-222222222222',
    '2024-01-26T09:15:00Z',
    NULL,
    NULL,
    NULL,
    'completed',
    '2024-01-25T14:20:00Z',
    '2024-01-26T09:15:00Z'
  ),
  (
    'exp-006',
    'Team Lunch Meeting',
    156.80,
    'USD',
    'Meals & Entertainment',
    '2024-01-28',
    'Lunch meeting with development team to discuss Q1 goals',
    'submitted',
    '22222222-2222-2222-2222-222222222222',
    '2024-01-28T15:30:00Z',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'completed',
    '2024-01-28T15:30:00Z',
    '2024-01-28T15:30:00Z'
  ),
  (
    'exp-007',
    'Professional Training Course',
    450.00,
    'USD',
    'Training & Education',
    '2024-01-30',
    'Online certification course for project management',
    'draft',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'pending',
    '2024-01-30T10:00:00Z',
    '2024-01-30T10:00:00Z'
  ),
  (
    'exp-008',
    'Marketing Conference Registration',
    750.00,
    'USD',
    'Professional Services',
    '2024-02-01',
    'Registration fee for Digital Marketing Summit 2024',
    'paid',
    '33333333-3333-3333-3333-333333333333',
    '2024-02-01T09:00:00Z',
    '22222222-2222-2222-2222-222222222222',
    '2024-02-02T11:30:00Z',
    NULL,
    NULL,
    NULL,
    'completed',
    '2024-02-01T09:00:00Z',
    '2024-02-02T11:30:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample attachments
INSERT INTO attachments (id, expense_id, name, size, type, url, uploaded_at, abbyy_sent_at, abbyy_processed_at, created_at) VALUES
  (
    'att-001',
    'exp-001',
    'restaurant_receipt.pdf',
    245760,
    'application/pdf',
    'https://example.com/receipts/restaurant_receipt.pdf',
    '2024-01-16T09:00:00Z',
    '2024-01-16T09:01:00Z',
    '2024-01-16T09:03:00Z',
    '2024-01-16T09:00:00Z'
  ),
  (
    'att-002',
    'exp-002',
    'office_depot_receipt.jpg',
    186420,
    'image/jpeg',
    'https://example.com/receipts/office_depot_receipt.jpg',
    '2024-01-18T11:15:00Z',
    '2024-01-18T11:16:00Z',
    NULL,
    '2024-01-18T11:15:00Z'
  ),
  (
    'att-003',
    'exp-003',
    'hotel_invoice.pdf',
    512000,
    'application/pdf',
    'https://example.com/receipts/hotel_invoice.pdf',
    '2024-01-21T08:30:00Z',
    NULL,
    NULL,
    '2024-01-21T08:30:00Z'
  ),
  (
    'att-004',
    'exp-004',
    'adobe_license_receipt.pdf',
    98304,
    'application/pdf',
    'https://example.com/receipts/adobe_license_receipt.pdf',
    '2024-01-22T16:45:00Z',
    '2024-01-22T16:46:00Z',
    '2024-01-22T16:48:00Z',
    '2024-01-22T16:45:00Z'
  ),
  (
    'att-005',
    'exp-005',
    'uber_receipt.png',
    67890,
    'image/png',
    'https://example.com/receipts/uber_receipt.png',
    '2024-01-25T14:20:00Z',
    '2024-01-25T14:21:00Z',
    '2024-01-25T14:23:00Z',
    '2024-01-25T14:20:00Z'
  ),
  (
    'att-006',
    'exp-006',
    'restaurant_bill.jpg',
    234567,
    'image/jpeg',
    'https://example.com/receipts/restaurant_bill.jpg',
    '2024-01-28T15:30:00Z',
    '2024-01-28T15:31:00Z',
    '2024-01-28T15:33:00Z',
    '2024-01-28T15:30:00Z'
  ),
  (
    'att-007',
    'exp-008',
    'conference_registration.pdf',
    145678,
    'application/pdf',
    'https://example.com/receipts/conference_registration.pdf',
    '2024-02-01T09:00:00Z',
    '2024-02-01T09:01:00Z',
    '2024-02-01T09:03:00Z',
    '2024-02-01T09:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample extracted data
INSERT INTO extracted_data (id, expense_id, vendor, amount, currency, date, invoice_number, category, confidence, extracted_at, created_at) VALUES
  (
    'ext-001',
    'exp-001',
    'The Steakhouse Downtown',
    127.50,
    'USD',
    '2024-01-15',
    'TSH-2024-001234',
    'Restaurant',
    0.95,
    '2024-01-16T09:03:00Z',
    '2024-01-16T09:03:00Z'
  ),
  (
    'ext-004',
    'exp-004',
    'Adobe Systems Inc.',
    199.00,
    'USD',
    '2024-01-22',
    'ADO-2024-001234',
    'Software',
    0.98,
    '2024-01-22T16:48:00Z',
    '2024-01-22T16:48:00Z'
  ),
  (
    'ext-005',
    'exp-005',
    'Uber Technologies',
    45.75,
    'USD',
    '2024-01-25',
    'UBER-789456123',
    'Transportation',
    0.92,
    '2024-01-25T14:23:00Z',
    '2024-01-25T14:23:00Z'
  ),
  (
    'ext-006',
    'exp-006',
    'Bistro Milano',
    156.80,
    'USD',
    '2024-01-28',
    'BM-2024-5678',
    'Restaurant',
    0.89,
    '2024-01-28T15:33:00Z',
    '2024-01-28T15:33:00Z'
  ),
  (
    'ext-008',
    'exp-008',
    'Digital Marketing Summit LLC',
    750.00,
    'USD',
    '2024-02-01',
    'DMS-2024-REG-9876',
    'Conference',
    0.97,
    '2024-02-01T09:03:00Z',
    '2024-02-01T09:03:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- Add some additional recent expenses for better analytics
INSERT INTO expenses (id, title, amount, currency, category, date, description, status, submitted_by, submitted_at, approved_by, approved_at, processing_status, created_at, updated_at) VALUES
  (
    'exp-009',
    'Monthly Parking Pass',
    85.00,
    'USD',
    'Transportation',
    '2024-02-05',
    'Monthly parking pass for downtown office',
    'approved',
    '11111111-1111-1111-1111-111111111111',
    '2024-02-05T08:00:00Z',
    '22222222-2222-2222-2222-222222222222',
    '2024-02-05T16:30:00Z',
    'completed',
    '2024-02-05T08:00:00Z',
    '2024-02-05T16:30:00Z'
  ),
  (
    'exp-010',
    'Client Gift Cards',
    200.00,
    'USD',
    'Marketing & Advertising',
    '2024-02-08',
    'Gift cards for client appreciation event',
    'submitted',
    '33333333-3333-3333-3333-333333333333',
    '2024-02-08T14:15:00Z',
    NULL,
    NULL,
    'pending',
    '2024-02-08T14:15:00Z',
    '2024-02-08T14:15:00Z'
  ),
  (
    'exp-011',
    'Office Internet Upgrade',
    120.00,
    'USD',
    'Utilities',
    '2024-02-10',
    'Monthly fee for upgraded internet service',
    'approved',
    '22222222-2222-2222-2222-222222222222',
    '2024-02-10T10:30:00Z',
    '44444444-4444-4444-4444-444444444444',
    '2024-02-10T15:45:00Z',
    'completed',
    '2024-02-10T10:30:00Z',
    '2024-02-10T15:45:00Z'
  ),
  (
    'exp-012',
    'Business Cards Printing',
    75.50,
    'USD',
    'Marketing & Advertising',
    '2024-02-12',
    'New business cards for sales team',
    'processing',
    '11111111-1111-1111-1111-111111111111',
    '2024-02-12T11:20:00Z',
    NULL,
    NULL,
    'extracting',
    '2024-02-12T11:20:00Z',
    '2024-02-12T11:20:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- Add attachments for the additional expenses
INSERT INTO attachments (id, expense_id, name, size, type, url, uploaded_at, abbyy_sent_at, abbyy_processed_at, created_at) VALUES
  (
    'att-009',
    'exp-009',
    'parking_receipt.pdf',
    89456,
    'application/pdf',
    'https://example.com/receipts/parking_receipt.pdf',
    '2024-02-05T08:00:00Z',
    '2024-02-05T08:01:00Z',
    '2024-02-05T08:03:00Z',
    '2024-02-05T08:00:00Z'
  ),
  (
    'att-010',
    'exp-010',
    'gift_cards_receipt.jpg',
    156789,
    'image/jpeg',
    'https://example.com/receipts/gift_cards_receipt.jpg',
    '2024-02-08T14:15:00Z',
    NULL,
    NULL,
    '2024-02-08T14:15:00Z'
  ),
  (
    'att-011',
    'exp-011',
    'internet_bill.pdf',
    234567,
    'application/pdf',
    'https://example.com/receipts/internet_bill.pdf',
    '2024-02-10T10:30:00Z',
    '2024-02-10T10:31:00Z',
    '2024-02-10T10:33:00Z',
    '2024-02-10T10:30:00Z'
  ),
  (
    'att-012',
    'exp-012',
    'business_cards_invoice.png',
    98765,
    'image/png',
    'https://example.com/receipts/business_cards_invoice.png',
    '2024-02-12T11:20:00Z',
    '2024-02-12T11:21:00Z',
    NULL,
    '2024-02-12T11:20:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- Add extracted data for the additional expenses
INSERT INTO extracted_data (id, expense_id, vendor, amount, currency, date, invoice_number, category, confidence, extracted_at, created_at) VALUES
  (
    'ext-009',
    'exp-009',
    'Downtown Parking Authority',
    85.00,
    'USD',
    '2024-02-05',
    'DPA-2024-FEB-001',
    'Parking',
    0.94,
    '2024-02-05T08:03:00Z',
    '2024-02-05T08:03:00Z'
  ),
  (
    'ext-011',
    'exp-011',
    'Metro Internet Services',
    120.00,
    'USD',
    '2024-02-10',
    'MIS-2024-0210',
    'Internet Service',
    0.96,
    '2024-02-10T10:33:00Z',
    '2024-02-10T10:33:00Z'
  )
ON CONFLICT (id) DO NOTHING;