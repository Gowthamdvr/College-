import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Doctor, AuthState } from '../types';
import { db } from '../services/mockDatabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (user: Omit<User, 'id' | 'role' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (user: User | Doctor) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for persisted session (simple simulation)
    const storedUser = localStorage.getItem('session_user');
    if (storedUser) {
      setAuth({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay for mock
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        const user = await db.login(email, password);
        if (user) {
          localStorage.setItem('session_user', JSON.stringify(user));
          setAuth({ user, isAuthenticated: true });
          return { success: true };
        } else {
            return { success: false, error: 'Invalid email or password.' };
        }
    } catch (e: any) {
        console.error("Login failed", e);
        return { success: false, error: e.message || "Login failed due to a server error." };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        await db.addUser(newUser);
        // Auto login
        localStorage.setItem('session_user', JSON.stringify(newUser));
        setAuth({ user: newUser, isAuthenticated: true });
        return { success: true };
    } catch (e: any) {
        console.error("Registration failed", e);
        return { success: false, error: e.message || "Registration failed." };
    }
  };

  const logout = () => {
    localStorage.removeItem('session_user');
    setAuth({ user: null, isAuthenticated: false });
  };

  const updateProfile = (updatedUser: User | Doctor) => {
    localStorage.setItem('session_user', JSON.stringify(updatedUser));
    setAuth(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};