import { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useBusiness } from '../../contexts/BusinessContext';
import { usePlatform } from '../../contexts/PlatformContext';
import getInitials from '../../utils/getInitials';
import {
  LayoutDashboard, Brain, MessageCircle, TrendingUp,
  Settings, LogOut, Menu, X, Zap, Sun, Moon, Bell,
  ChevronDown, Search, Target, Shield, AlertTriangle,
  Sparkles, Rocket, Database
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentAnalysis } = useBusiness();
  const platform = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profitScoreVal = currentAnalysis?.profitScore || 0;

  const isAdmin = user?.role === 'admin';

  const userNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'data', label: 'Data Entry', icon: <Database className="w-5 h-5" /> },
    { id: 'score', label: 'Profit Score', icon: <Brain className="w-5 h-5" /> },
    { id: 'leaks', label: 'Profit Leaks', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus Engine', icon: <Target className="w-5 h-5" /> },
    { id: 'plans', label: 'Action Plans', icon: <Rocket className="w-5 h-5" /> },
    { id: 'simulator', label: 'Growth Simulator', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'advisor', label: 'Nexora Advisor', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: <Shield className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const unreadAlerts = platform.unreadCount;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/40 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-display)]">Nexora</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 mb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-nexora-50 dark:bg-nexora-950/40 border border-nexora-100 dark:border-nexora-900/50">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.company)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.company || 'My Company'}</div>
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 dark:text-red-400 text-[10px] font-bold">ADMIN</span>
                ) : (
                  <div className="text-xs text-nexora-600 dark:text-nexora-400 font-medium">{user?.plan ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan` : ''}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-nexora-50 dark:bg-nexora-950/50 text-nexora-700 dark:text-nexora-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className={currentPage === item.id ? 'text-nexora-600 dark:text-nexora-400' : ''}>{item.icon}</span>
              {item.label}
              {item.id === 'advisor' && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-nexora-100 dark:bg-nexora-900/50 text-nexora-600 dark:text-nexora-400 text-[10px] font-bold">AI</span>
              )}
            </button>
          ))}
        </nav>

        {!isAdmin && (
          <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-nexora-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-80">Profit Score</span>
              <Brain className="w-4 h-4 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{profitScoreVal}<span className="text-lg opacity-60">/100</span></div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-white" style={{ width: `${profitScoreVal}%` }} />
            </div>
            <div className="text-[10px] opacity-60 mt-1">{currentAnalysis?.leaks.length || 0} active leaks detected</div>
          </div>
        )}

        <div className="p-3 border-t border-gray-200/60 dark:border-gray-700/40">
          <button
            onClick={() => { logout(); onNavigate('landing'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-gray-100/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/40 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input id="global-search" type="text" placeholder="Search anything..." className="bg-transparent text-sm outline-none w-full placeholder-gray-400" />
              <kbd className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-400 font-medium">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button onClick={() => { setShowAlerts(!showAlerts); setShowProfile(false); }} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadAlerts}
                  </span>
                )}
              </button>
              {showAlerts && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/40 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/40 flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Smart Alerts</h3>
                    {unreadAlerts > 0 && <button onClick={() => platform.markAllRead()} className="text-[10px] text-nexora-600 dark:text-nexora-400 font-medium hover:underline">Mark all read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {platform.alerts.slice(0, 6).map(al => (
                      <div key={al.id} className={`p-3 border-b border-gray-100 dark:border-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 cursor-pointer ${!al.read ? 'bg-nexora-50/50 dark:bg-nexora-950/20' : ''}`} onClick={() => { platform.markAlertRead(al.id); if (al.actionRoute) onNavigate(al.actionRoute); setShowAlerts(false); }}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${al.severity === 'critical' ? 'bg-red-500' : al.severity === 'high' ? 'bg-amber-500' : al.severity === 'medium' ? 'bg-blue-500' : 'bg-nexora-500'}`} />
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{al.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{al.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { onNavigate('alerts'); setShowAlerts(false); }} className="w-full p-3 text-xs text-center text-nexora-600 dark:text-nexora-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors border-t border-gray-200/60 dark:border-gray-700/40">View all alerts →</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowAlerts(false); }} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-[10px] text-gray-500">{user?.email || ''}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/40 overflow-hidden z-50">
                  <div className="p-3">
                    <button onClick={() => { onNavigate('settings'); setShowProfile(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Profile & Settings</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Billing</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Help & Support</button>
                  </div>
                  <div className="border-t border-gray-200/60 dark:border-gray-700/40 p-3">
                    <button onClick={() => { logout(); onNavigate('landing'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">Log out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
