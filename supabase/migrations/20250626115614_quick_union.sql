/*
  # Fix infinite recursion in users table RLS policy

  1. Problem
    - The existing "Managers can read all users" policy causes infinite recursion
    - It tries to query the users table from within a policy applied to the users table

  2. Solution
    - Drop the problematic policy
    - Create a helper function that safely gets the current user's role
    - Create a new policy using this function to avoid recursion

  3. Changes
    - Remove recursive policy
    - Add get_current_user_role() function
    - Add new non-recursive policy for managers/admins
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
  SELECT u.role FROM auth.users au
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