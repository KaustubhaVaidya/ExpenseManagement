/*
  # Fix infinite recursion in users table RLS policy

  1. Problem
    - The "Managers can read all users" policy causes infinite recursion
    - It queries the users table from within a policy applied to the users table
    
  2. Solution
    - Drop the problematic policy
    - Create a new policy that avoids recursion by using a different approach
    - Use auth.jwt() to get user role information or restructure the logic
    
  3. Changes
    - Remove the recursive policy
    - Add a new policy that checks user role without causing recursion
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Managers can read all users" ON users;

-- Create a new policy that avoids recursion
-- This policy allows managers and admins to read all users by checking the current user's role
-- We'll use a function to get the current user's role to avoid recursion
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM auth.users au
  JOIN users u ON au.id = u.id
  WHERE au.id = auth.uid()
$$;

-- Create the new policy using the function
CREATE POLICY "Managers can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    get_current_user_role() IN ('manager', 'admin')
  );