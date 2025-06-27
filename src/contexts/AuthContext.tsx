import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/expense';
import { supabaseService } from '../services/supabase';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'employee' | 'manager') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = await supabaseService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Add a small delay to ensure database operations are complete
            await new Promise(resolve => setTimeout(resolve, 500));
            const userData = await supabaseService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('Error getting user data after sign in:', error);
            // If we can't get the profile, create a basic user object
            if (session.user) {
              const basicUser: User = {
                id: session.user.id,
                name: session.user.user_metadata?.name || 'User',
                email: session.user.email || '',
                role: session.user.user_metadata?.role || 'employee',
                department: 'General'
              };
              setUser(basicUser);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await supabaseService.signIn(email, password);
      // User will be set via the auth state change listener
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'employee' | 'manager') => {
    try {
      setLoading(true);
      const { user: userData } = await supabaseService.signUp(email, password, { name, role });
      setUser(userData);
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else if (error.message.includes('Password')) {
          throw new Error('Password must be at least 6 characters long.');
        }
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};