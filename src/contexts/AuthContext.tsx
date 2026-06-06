import { createContext, useContext, useState, ReactNode } from 'react';

export const PLAN_LIMITS: Record<string, number> = { free: 2, pro: 999, business: 999, enterprise: 999 };
export const PLAN_PRICES: Record<string, number> = { free: 0, pro: 29, business: 149, enterprise: 399 };

export interface TrackedUser {
  id: string;
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
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  trackedUsers: TrackedUser[];
  requestUpgrade: (email: string, plan: 'pro' | 'business' | 'enterprise') => void;
  approvePayment: (email: string) => void;
  rejectPayment: (email: string) => void;
  changeUserPlan: (email: string, plan: 'free' | 'pro' | 'business' | 'enterprise') => void;
}

const loadUsers = (): TrackedUser[] => {
  try { const s = localStorage.getItem('nexora-tracked-users'); return s ? JSON.parse(s) : []; } catch { return []; }
};

const saveUsers = (users: TrackedUser[]) => localStorage.setItem('nexora-tracked-users', JSON.stringify(users));

const AuthContext = createContext<AuthContextType>({
  user: null, isAuthenticated: false,
  login: () => false, signup: () => {}, logout: () => {},
  trackedUsers: [],
  requestUpgrade: () => {}, approvePayment: () => {}, rejectPayment: () => {}, changeUserPlan: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [trackedUsers, setTrackedUsers] = useState<TrackedUser[]>(loadUsers);

  const syncUser = (email: string) => {
    const found = trackedUsers.find(u => u.email === email);
    if (found && user && user.email === email) {
      setUser(prev => prev ? { ...prev, plan: found.plan } : prev);
    }
  };

  const login = (email: string, password: string): boolean => {
    const isAdmin = email.trim().toLowerCase() === 'kelly@gmail.com' && password === 'kelly';
    if (isAdmin) {
      setUser({ id: 'admin-1', name: 'Kelly (Admin)', email, company: 'Nexora Admin', role: 'admin', plan: 'enterprise' });
      return true;
    }
    const existing = trackedUsers.find(u => u.email === email);
    if (!existing || existing.password !== password) return false;
    const now = new Date().toISOString();
    setTrackedUsers(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, lastLogin: now, loginCount: u.loginCount + 1 } : u);
      saveUsers(updated);
      return updated;
    });
    setUser({ id: existing.id, name: existing.name, email, company: existing.company, role: 'user', plan: existing.plan });
    return true;
  };

  const signup = (name: string, email: string, password: string) => {
    const id = `u${Date.now()}`;
    const company = `${name.split(' ')[0]}'s Company`;
    const now = new Date().toISOString();
    const newUser: TrackedUser = { id, name, email, password, company, plan: 'free', paymentStatus: 'none', selectedPlan: 'free', registeredAt: now, lastLogin: now, loginCount: 1 };
    setTrackedUsers(prev => { const u = [...prev, newUser]; saveUsers(u); return u; });
    setUser({ id, name, email, company, role: 'user', plan: 'free' });
  };

  const requestUpgrade = (email: string, plan: 'pro' | 'business' | 'enterprise') => {
    setTrackedUsers(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, selectedPlan: plan, paymentStatus: 'pending' as const } : u);
      saveUsers(updated);
      return updated;
    });
  };

  const approvePayment = (email: string) => {
    setTrackedUsers(prev => {
      const updated = prev.map(u => {
        if (u.email !== email) return u;
        return { ...u, plan: u.selectedPlan, paymentStatus: 'approved' as const, selectedPlan: 'free' as const };
      });
      saveUsers(updated);
      return updated;
    });
    syncUser(email);
  };

  const rejectPayment = (email: string) => {
    setTrackedUsers(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, paymentStatus: 'rejected' as const, selectedPlan: 'free' as const } : u);
      saveUsers(updated);
      return updated;
    });
  };

  const changeUserPlan = (email: string, plan: 'free' | 'pro' | 'business' | 'enterprise') => {
    setTrackedUsers(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, plan, paymentStatus: plan === 'free' ? 'none' as const : 'approved' as const, selectedPlan: 'free' as const } : u);
      saveUsers(updated);
      return updated;
    });
    if (user?.email === email) setUser(prev => prev ? { ...prev, plan } : prev);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, trackedUsers, requestUpgrade, approvePayment, rejectPayment, changeUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
