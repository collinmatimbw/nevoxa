import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

export const PLAN_LIMITS: Record<string, number> = { free: 2, pro: 999, business: 999, enterprise: 999 };
export const PLAN_PRICES: Record<string, number> = { free: 0, pro: 29, business: 149, enterprise: 399 };

export interface TrackedUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  company: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  paymentStatus: 'none' | 'pending' | 'approved' | 'rejected';
  selectedPlan: 'free' | 'pro' | 'business' | 'enterprise';
  registeredAt: string;
  lastLogin: string;
  loginCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro' | 'business' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  trackedUsers: TrackedUser[];
  requestUpgrade: (email: string, plan: 'pro' | 'business' | 'enterprise') => Promise<void>;
  approvePayment: (email: string) => Promise<void>;
  rejectPayment: (email: string) => Promise<void>;
  changeUserPlan: (email: string, plan: 'free' | 'pro' | 'business' | 'enterprise') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, isAuthenticated: false,
  login: async () => false, signup: async () => {}, logout: () => {},
  trackedUsers: [],
  requestUpgrade: async () => {}, approvePayment: async () => {}, rejectPayment: async () => {}, changeUserPlan: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [trackedUsers, setTrackedUsers] = useState<TrackedUser[]>([]);

  useEffect(() => {
    api.get('/auth/tracked-users').then(setTrackedUsers).catch(() => {});
    const token = localStorage.getItem('nexora-token');
    if (token) {
      api.get('/auth/tracked-users').then(users => {
        const u = users.find((u: any) => u._id === token);
        if (u) setUser({ id: u._id, name: u.name, email: u.email, company: u.company, role: u.role || 'user', plan: u.plan });
      }).catch(() => {});
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('nexora-token', data.token);
      setUser(data.user);
      api.get('/auth/tracked-users').then(setTrackedUsers).catch(() => {});
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('nexora-token', data.token);
    setUser(data.user);
    api.get('/auth/tracked-users').then(setTrackedUsers).catch(() => {});
  };

  const requestUpgrade = async (email: string, plan: 'pro' | 'business' | 'enterprise') => {
    await api.post('/auth/upgrade-request', { email, plan });
    api.get('/auth/tracked-users').then(setTrackedUsers).catch(() => {});
  };

  const approvePayment = async (email: string) => {
    await api.post('/auth/approve-payment', { email });
    const users = await api.get('/auth/tracked-users');
    setTrackedUsers(users);
    if (user?.email === email) {
      const found = users.find((u: TrackedUser) => u.email === email);
      if (found) setUser(prev => prev ? { ...prev, plan: found.plan } : prev);
    }
  };

  const rejectPayment = async (email: string) => {
    await api.post('/auth/reject-payment', { email });
    api.get('/auth/tracked-users').then(setTrackedUsers).catch(() => {});
  };

  const changeUserPlan = async (email: string, plan: 'free' | 'pro' | 'business' | 'enterprise') => {
    await api.post('/auth/change-plan', { email, plan });
    const users = await api.get('/auth/tracked-users');
    setTrackedUsers(users);
    if (user?.email === email) setUser(prev => prev ? { ...prev, plan } : prev);
  };

  const logout = () => {
    localStorage.removeItem('nexora-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, trackedUsers, requestUpgrade, approvePayment, rejectPayment, changeUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
