import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

interface User {
  id: string;
  name: string;
  phone: string;
  roles: string[];
  ownerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  sendOtp: (phone: string) => Promise<{ devOtp?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await apiRequest<User>('/auth/me');
        setUser(currentUser);
      } catch (err) {
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const sendOtp = async (phone: string) => {
    const res = await apiRequest<{ devOtp?: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose: 'REGISTRATION' }),
    });
    return res;
  };

  const verifyOtp = async (phone: string, code: string) => {
    const res = await apiRequest<{ verificationToken: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    return res.verificationToken;
  };

  const login = async (phone: string, password: string) => {
    const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    setAuthToken(res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'OWNER' }),
    });
    setAuthToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
