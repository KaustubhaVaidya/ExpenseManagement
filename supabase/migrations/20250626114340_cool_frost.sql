/*
  # Initial ExpenseFlow Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text, check constraint)
      - `department` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `amount` (decimal)
      - `currency` (text)
      - `category` (text)
      - `date` (date)
      - `description` (text)
      - `status` (text, check constraint)
      - `submitted_by` (uuid, foreign key to users)
      - `submitted_at` (timestamp)
      - `approved_by` (uuid, foreign key to users)
      - `approved_at` (timestamp)
      - `rejected_by` (uuid, foreign key to users)
      - `rejected_at` (timestamp)
      - `rejection_reason` (text)
      - `processing_status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `attachments`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, foreign key to expenses)
      - `name` (text)
      - `size` (bigint)
      - `type` (text)
      - `url` (text)
      - `uploaded_at` (timestamp)
      - `abbyy_sent_at` (timestamp)
      - `abbyy_processed_at` (timestamp)
      - `created_at` (timestamp)
    
    - `extracted_data`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, foreign key to expenses)
      - `vendor` (text)
      - `amount` (decimal)
      - `currency` (text)
      - `date` (date)
      - `invoice_number` (text)
      - `category` (text)
      - `confidence` (decimal)
      - `extracted_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Users can read/write their own data
    - Managers can approve/reject expenses
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('employee', 'manager', 'admin');
CREATE TYPE expense_status AS ENUM ('draft', 'submitted', 'processing', 'approved', 'rejected', 'paid');
CREATE TYPE processing_status AS ENUM ('pending', 'extracting', 'completed', 'failed');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  department text DEFAULT 'General',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  category text NOT NULL,
  date date NOT NULL,
  description text DEFAULT '',
  status expense_status NOT NULL DEFAULT 'draft',
  submitted_by uuid REFERENCES users(id) ON DELETE CASCADE,
  submitted_at timestamptz,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  rejected_by uuid REFERENCES users(id),
  rejected_at timestamptz,
  rejection_reason text,
  processing_status processing_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  name text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  abbyy_sent_at timestamptz,
  abbyy_processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Extracted data table
CREATE TABLE IF NOT EXISTS extracted_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  vendor text,
  amount decimal(10,2),
  currency text,
  date date,
  invoice_number text,
  category text,
  confidence decimal(3,2),
  extracted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Managers can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
    )
  );

-- Expenses policies
CREATE POLICY "Users can read own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Managers can read all expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Users can create own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users can update own draft expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (submitted_by = auth.uid() AND status = 'draft');

CREATE POLICY "Managers can update expense status"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
    )
  );

-- Attachments policies
CREATE POLICY "Users can read attachments for accessible expenses"
  ON attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE id = expense_id 
      AND (
        submitted_by = auth.uid() 
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('manager', 'admin')
        )
      )
    )
  );

CREATE POLICY "Users can create attachments for own expenses"
  ON attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE id = expense_id 
      AND submitted_by = auth.uid()
    )
  );

-- Extracted data policies
CREATE POLICY "Users can read extracted data for accessible expenses"
  ON extracted_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE id = expense_id 
      AND (
        submitted_by = auth.uid() 
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role IN ('manager', 'admin')
        )
      )
    )
  );

CREATE POLICY "System can create extracted data"
  ON extracted_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_submitted_by ON expenses(submitted_by);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_attachments_expense_id ON attachments(expense_id);
CREATE INDEX IF NOT EXISTS idx_extracted_data_expense_id ON extracted_data(expense_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();