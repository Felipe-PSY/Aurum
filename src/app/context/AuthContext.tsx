import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'Super administrador' | 'Vendedor' | 'Editor';
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { user: string; pass: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('aurum_admin_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (credentials: { user: string; pass: string }) => {
    // Simulated credentials for demo purposes
    if (credentials.user === 'admin' && credentials.pass === 'admin') {
      const loggedUser: User = { id: '1', name: 'Administrador', role: 'Super administrador' };
      setUser(loggedUser);
      localStorage.setItem('aurum_admin_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurum_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
