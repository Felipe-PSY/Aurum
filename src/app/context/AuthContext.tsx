import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (credentials: { user: string; pass: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = React.useCallback(async (credentials: { user: string; pass: string }) => {
    const email = credentials.user.trim();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: credentials.pass,
      });
      return !error;
    } catch {
      return false;
    }
  }, []);

  const logout = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isAuthenticated = !!user;

  const contextValue = React.useMemo(() => ({
    user, login, logout, isAuthenticated, loading
  }), [user, login, logout, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
