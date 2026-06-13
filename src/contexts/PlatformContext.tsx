import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

export interface MemoryEntry { id: string; type: 'analysis' | 'recommendation' | 'goal' | 'milestone' | 'conversation' | 'preference'; content: string; metadata: Record<string, any>; createdAt: string; }

export interface SmartAlert { id: string; severity: 'critical' | 'high' | 'medium' | 'info'; category: 'profit' | 'revenue' | 'expenses' | 'cashflow' | 'growth' | 'goal' | 'opportunity'; title: string; message: string; action?: string; actionRoute?: string; read: boolean; createdAt: string; }

export interface TeamMember { id: string; name: string; email: string; role: 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer'; status: 'active' | 'invited' | 'disabled'; joinedAt: string; lastActive: string; avatar?: string; }
export interface ActivityLog { id: string; userId: string; userName: string; action: string; detail: string; timestamp: string; }

export interface Business { id: string; name: string; industry: string; revenue: number; status: 'active' | 'paused'; createdAt: string; }

export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise';
export interface Subscription { plan: PlanTier; status: 'active' | 'trial' | 'cancelled' | 'past_due'; billingCycle: 'monthly' | 'annual'; currentPeriodEnd: string; seats: number; usedSeats: number; }

export interface AutomationRule { id: string; name: string; trigger: string; action: string; enabled: boolean; lastRun?: string; nextRun?: string; frequency: 'daily' | 'weekly' | 'monthly'; }

interface PlatformContextType {
  memories: MemoryEntry[]; addMemory: (m: Omit<MemoryEntry, 'id' | 'createdAt'>) => void; getMemoriesByType: (type: MemoryEntry['type']) => MemoryEntry[];
  alerts: SmartAlert[]; unreadCount: number; markAlertRead: (id: string) => void; markAllRead: () => void; dismissAlert: (id: string) => void;
  team: TeamMember[]; addTeamMember: (m: Omit<TeamMember, 'id' | 'joinedAt' | 'lastActive' | 'status'>) => void; removeTeamMember: (id: string) => void; updateMemberRole: (id: string, role: TeamMember['role']) => void; activityLog: ActivityLog[];
  businesses: Business[]; activeBusiness: Business | null; switchBusiness: (id: string) => void; addBusiness: (b: Omit<Business, 'id' | 'createdAt' | 'status'>) => void;
  subscription: Subscription; upgradePlan: (plan: PlanTier) => void; toggleBillingCycle: () => void;
  automations: AutomationRule[]; toggleAutomation: (id: string) => void; addAutomation: (a: Omit<AutomationRule, 'id'>) => void;
}

const PlatformContext = createContext<PlatformContextType>({
  memories: [], addMemory: () => {}, getMemoriesByType: () => [],
  alerts: [], unreadCount: 0, markAlertRead: () => {}, markAllRead: () => {}, dismissAlert: () => {},
  team: [], addTeamMember: () => {}, removeTeamMember: () => {}, updateMemberRole: () => {}, activityLog: [],
  businesses: [], activeBusiness: null, switchBusiness: () => {}, addBusiness: () => {},
  subscription: { plan: 'business', status: 'active', billingCycle: 'monthly', currentPeriodEnd: '', seats: 1, usedSeats: 0 }, upgradePlan: () => {}, toggleBillingCycle: () => {},
  automations: [], toggleAutomation: () => {}, addAutomation: () => {},
});

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<any>({
    memories: [], alerts: [], team: [], activityLog: [], businesses: [], activeBusinessId: '',
    subscription: { plan: 'business', status: 'active', billingCycle: 'monthly', currentPeriodEnd: '', seats: 1, usedSeats: 0 },
    automations: [],
  });

  useEffect(() => {
    api.get('/platform').then(data => {
      if (data) setState(data);
    }).catch(() => {});
  }, []);

  const persist = (updated: any) => {
    setState(updated);
    api.put('/platform', updated).catch(() => {});
  };

  const memories = state.memories || [];
  const alerts = state.alerts || [];
  const team = state.team || [];
  const activityLog = state.activityLog || [];
  const businesses = state.businesses || [];
  const activeBusinessId = state.activeBusinessId || '';
  const subscription = state.subscription || { plan: 'business', status: 'active', billingCycle: 'monthly', currentPeriodEnd: '', seats: 1, usedSeats: 0 };
  const automations = state.automations || [];

  const addMemory = (m: Omit<MemoryEntry, 'id' | 'createdAt'>) => persist({ ...state, memories: [...memories, { ...m, id: `mem${Date.now()}`, createdAt: new Date().toISOString() }] });
  const getMemoriesByType = (type: MemoryEntry['type']) => memories.filter((m: MemoryEntry) => m.type === type);

  const unreadCount = alerts.filter((a: SmartAlert) => !a.read).length;
  const markAlertRead = (id: string) => persist({ ...state, alerts: alerts.map((a: SmartAlert) => a.id === id ? { ...a, read: true } : a) });
  const markAllRead = () => persist({ ...state, alerts: alerts.map((a: SmartAlert) => ({ ...a, read: true })) });
  const dismissAlert = (id: string) => persist({ ...state, alerts: alerts.filter((a: SmartAlert) => a.id !== id) });

  const addTeamMember = (m: Omit<TeamMember, 'id' | 'joinedAt' | 'lastActive' | 'status'>) => persist({ ...state, team: [...team, { ...m, id: `tm${Date.now()}`, joinedAt: new Date().toISOString(), lastActive: '', status: 'invited' }] });
  const removeTeamMember = (id: string) => persist({ ...state, team: team.filter((t: TeamMember) => t.id !== id) });
  const updateMemberRole = (id: string, role: TeamMember['role']) => persist({ ...state, team: team.map((t: TeamMember) => t.id === id ? { ...t, role } : t) });

  const activeBusiness = businesses.find((b: Business) => b.id === activeBusinessId) || businesses[0] || null;
  const switchBusiness = (id: string) => persist({ ...state, activeBusinessId: id });
  const addBusiness = (b: Omit<Business, 'id' | 'createdAt' | 'status'>) => persist({ ...state, businesses: [...businesses, { ...b, id: `b${Date.now()}`, createdAt: new Date().toISOString(), status: 'active' }] });

  const upgradePlan = (plan: PlanTier) => persist({ ...state, subscription: { ...subscription, plan, status: 'active' } });
  const toggleBillingCycle = () => persist({ ...state, subscription: { ...subscription, billingCycle: subscription.billingCycle === 'monthly' ? 'annual' : 'monthly' } });

  const toggleAutomation = (id: string) => persist({ ...state, automations: automations.map((a: AutomationRule) => a.id === id ? { ...a, enabled: !a.enabled } : a) });
  const addAutomation = (a: Omit<AutomationRule, 'id'>) => persist({ ...state, automations: [...automations, { ...a, id: `auto${Date.now()}` }] });

  return (
    <PlatformContext.Provider value={{ memories, addMemory, getMemoriesByType, alerts, unreadCount, markAlertRead, markAllRead, dismissAlert, team, addTeamMember, removeTeamMember, updateMemberRole, activityLog, businesses, activeBusiness, switchBusiness, addBusiness, subscription, upgradePlan, toggleBillingCycle, automations, toggleAutomation, addAutomation }}>
      {children}
    </PlatformContext.Provider>
  );
}

export const usePlatform = () => useContext(PlatformContext);
