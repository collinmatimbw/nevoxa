import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ── AI MEMORY ──────────────────────────────────────────────────────────
export interface MemoryEntry { id: string; type: 'analysis' | 'recommendation' | 'goal' | 'milestone' | 'conversation' | 'preference'; content: string; metadata: Record<string, any>; createdAt: string; }

// ── SMART ALERTS ───────────────────────────────────────────────────────
export interface SmartAlert { id: string; severity: 'critical' | 'high' | 'medium' | 'info'; category: 'profit' | 'revenue' | 'expenses' | 'cashflow' | 'growth' | 'goal' | 'opportunity'; title: string; message: string; action?: string; actionRoute?: string; read: boolean; createdAt: string; }

// ── TEAM ───────────────────────────────────────────────────────────────
export interface TeamMember { id: string; name: string; email: string; role: 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer'; status: 'active' | 'invited' | 'disabled'; joinedAt: string; lastActive: string; avatar?: string; }
export interface ActivityLog { id: string; userId: string; userName: string; action: string; detail: string; timestamp: string; }

// ── MULTI-BUSINESS ─────────────────────────────────────────────────────
export interface Business { id: string; name: string; industry: string; revenue: number; status: 'active' | 'paused'; createdAt: string; }

// ── BILLING ────────────────────────────────────────────────────────────
export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise';
export interface Subscription { plan: PlanTier; status: 'active' | 'trial' | 'cancelled' | 'past_due'; billingCycle: 'monthly' | 'annual'; currentPeriodEnd: string; seats: number; usedSeats: number; }

// ── AUTOMATION ─────────────────────────────────────────────────────────
export interface AutomationRule { id: string; name: string; trigger: string; action: string; enabled: boolean; lastRun?: string; nextRun?: string; frequency: 'daily' | 'weekly' | 'monthly'; }

// ── CONTEXT ────────────────────────────────────────────────────────────
interface PlatformContextType {
  // AI Memory
  memories: MemoryEntry[]; addMemory: (m: Omit<MemoryEntry, 'id' | 'createdAt'>) => void; getMemoriesByType: (type: MemoryEntry['type']) => MemoryEntry[];
  // Smart Alerts
  alerts: SmartAlert[]; unreadCount: number; markAlertRead: (id: string) => void; markAllRead: () => void; dismissAlert: (id: string) => void;
  // Team
  team: TeamMember[]; addTeamMember: (m: Omit<TeamMember, 'id' | 'joinedAt' | 'lastActive' | 'status'>) => void; removeTeamMember: (id: string) => void; updateMemberRole: (id: string, role: TeamMember['role']) => void; activityLog: ActivityLog[];
  // Multi-Business
  businesses: Business[]; activeBusiness: Business | null; switchBusiness: (id: string) => void; addBusiness: (b: Omit<Business, 'id' | 'createdAt' | 'status'>) => void;
  // Billing
  subscription: Subscription; upgradePlan: (plan: PlanTier) => void; toggleBillingCycle: () => void;
  // Automation
  automations: AutomationRule[]; toggleAutomation: (id: string) => void; addAutomation: (a: Omit<AutomationRule, 'id'>) => void;
}

const seedAlerts: SmartAlert[] = [];

const seedTeam: TeamMember[] = [];

const seedActivity: ActivityLog[] = [];

const seedBusinesses: Business[] = [];

const seedAutomations: AutomationRule[] = [];

const seedMemories: MemoryEntry[] = [];

const PlatformContext = createContext<PlatformContextType>({
  memories: [], addMemory: () => {}, getMemoriesByType: () => [],
  alerts: [], unreadCount: 0, markAlertRead: () => {}, markAllRead: () => {}, dismissAlert: () => {},
  team: [], addTeamMember: () => {}, removeTeamMember: () => {}, updateMemberRole: () => {}, activityLog: [],
  businesses: [], activeBusiness: null, switchBusiness: () => {}, addBusiness: () => {},
  subscription: { plan: 'business', status: 'active', billingCycle: 'monthly', currentPeriodEnd: '', seats: 1, usedSeats: 0 }, upgradePlan: () => {}, toggleBillingCycle: () => {},
  automations: [], toggleAutomation: () => {}, addAutomation: () => {},
});

export function PlatformProvider({ children }: { children: ReactNode }) {
  const load = <T,>(key: string, fallback: T): T => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; } };

  const [memories, setMemories] = useState<MemoryEntry[]>(() => load('nx-memories', seedMemories));
  const [alerts, setAlerts] = useState<SmartAlert[]>(() => load('nx-alerts', seedAlerts));
  const [team, setTeam] = useState<TeamMember[]>(() => load('nx-team', seedTeam));
  const [activityLog] = useState<ActivityLog[]>(seedActivity);
  const [businesses, setBusinesses] = useState<Business[]>(() => load('nx-businesses', seedBusinesses));
  const [activeBusinessId, setActiveBusinessId] = useState<string>(() => load('nx-active-biz', ''));
  const [subscription, setSubscription] = useState<Subscription>(() => load('nx-subscription', { plan: 'business' as PlanTier, status: 'active' as const, billingCycle: 'monthly' as const, currentPeriodEnd: '', seats: 1, usedSeats: team.filter(t => t.status === 'active').length }));
  const [automations, setAutomations] = useState<AutomationRule[]>(() => load('nx-automations', seedAutomations));

  const persist = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
  useEffect(() => { persist('nx-memories', memories); }, [memories]);
  useEffect(() => { persist('nx-alerts', alerts); }, [alerts]);
  useEffect(() => { persist('nx-team', team); }, [team]);
  useEffect(() => { persist('nx-businesses', businesses); }, [businesses]);
  useEffect(() => { persist('nx-active-biz', activeBusinessId); }, [activeBusinessId]);
  useEffect(() => { persist('nx-subscription', subscription); }, [subscription]);
  useEffect(() => { persist('nx-automations', automations); }, [automations]);

  const addMemory = (m: Omit<MemoryEntry, 'id' | 'createdAt'>) => setMemories(p => [...p, { ...m, id: `mem${Date.now()}`, createdAt: new Date().toISOString() }]);
  const getMemoriesByType = (type: MemoryEntry['type']) => memories.filter(m => m.type === type);

  const unreadCount = alerts.filter(a => !a.read).length;
  const markAlertRead = (id: string) => setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts(p => p.map(a => ({ ...a, read: true })));
  const dismissAlert = (id: string) => setAlerts(p => p.filter(a => a.id !== id));

  const addTeamMember = (m: Omit<TeamMember, 'id' | 'joinedAt' | 'lastActive' | 'status'>) => setTeam(p => [...p, { ...m, id: `tm${Date.now()}`, joinedAt: new Date().toISOString(), lastActive: '', status: 'invited' }]);
  const removeTeamMember = (id: string) => setTeam(p => p.filter(t => t.id !== id));
  const updateMemberRole = (id: string, role: TeamMember['role']) => setTeam(p => p.map(t => t.id === id ? { ...t, role } : t));

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0] || null;
  const switchBusiness = (id: string) => setActiveBusinessId(id);
  const addBusiness = (b: Omit<Business, 'id' | 'createdAt' | 'status'>) => { const nb = { ...b, id: `b${Date.now()}`, createdAt: new Date().toISOString(), status: 'active' as const }; setBusinesses(p => [...p, nb]); };

  const upgradePlan = (plan: PlanTier) => setSubscription(p => ({ ...p, plan, status: 'active' }));
  const toggleBillingCycle = () => setSubscription(p => ({ ...p, billingCycle: p.billingCycle === 'monthly' ? 'annual' : 'monthly' }));

  const toggleAutomation = (id: string) => setAutomations(p => p.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  const addAutomation = (a: Omit<AutomationRule, 'id'>) => setAutomations(p => [...p, { ...a, id: `auto${Date.now()}` }]);

  return (
    <PlatformContext.Provider value={{ memories, addMemory, getMemoriesByType, alerts, unreadCount, markAlertRead, markAllRead, dismissAlert, team, addTeamMember, removeTeamMember, updateMemberRole, activityLog, businesses, activeBusiness, switchBusiness, addBusiness, subscription, upgradePlan, toggleBillingCycle, automations, toggleAutomation, addAutomation }}>
      {children}
    </PlatformContext.Provider>
  );
}

export const usePlatform = () => useContext(PlatformContext);
