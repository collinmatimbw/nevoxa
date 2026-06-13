import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AnalysisPage from './pages/AnalysisPage';
import AdvisorPageV2 from './pages/AdvisorPageV2';
import KPIDashboardV2 from './pages/KPIDashboardV2';
import FocusEngineV2 from './pages/FocusEngineV2';
import GrowthSimulatorV3 from './pages/GrowthSimulatorV3';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPanel from './pages/AdminPanel';
import ProfitLeakDetector from './pages/ProfitLeakDetector';
import InsightsPage from './pages/InsightsPage';
import OpportunityEngine from './pages/OpportunityEngine';
import GoalsPage from './pages/GoalsPage';
import ActionPlanPage from './pages/ActionPlanPage';
import ProfitScorePage from './pages/ProfitScorePage';
import DataEntry from './pages/DataEntry';
import AdminDashboard from './pages/AdminDashboard';
import UpgradePage from './pages/UpgradePage';
import TeamPage from './pages/TeamPage';
import BillingPage from './pages/BillingPage';
import AutomationsPage from './pages/AutomationsPage';
import AlertsPage from './pages/AlertsPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const handleNavigate = (page: string) => { setCurrentPage(page); window.scrollTo(0, 0); };

  useEffect(() => {
    if (user?.role === 'admin' && currentPage === 'dashboard') {
      setCurrentPage('admin-dashboard');
    }
  }, [user, currentPage]);

  const renderPage = (page: string) => {
    const key = `${page}-${Date.now()}`;
    switch (page) {
      case 'login': return <AnimatedPage key="login"><AuthPages mode="login" onNavigate={handleNavigate} /></AnimatedPage>;
      case 'signup': return <AnimatedPage key="signup"><AuthPages mode="signup" onNavigate={handleNavigate} /></AnimatedPage>;
      case 'onboarding': return <AnimatedPage key="onboarding"><Onboarding onNavigate={handleNavigate} /></AnimatedPage>;
      default: return <AnimatedPage key="landing"><LandingPage onNavigate={handleNavigate} /></AnimatedPage>;
    }
  };

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        {renderPage(currentPage)}
      </AnimatePresence>
    );
  }
  if (currentPage === 'onboarding') return <AnimatedPage key="onboarding"><Onboarding onNavigate={handleNavigate} /></AnimatedPage>;

  const pageComponents: Record<string, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={handleNavigate} />,
    score: <ProfitScorePage />,
    data: <DataEntry onNavigate={handleNavigate} />,
    insights: <InsightsPage onNavigate={handleNavigate} />,
    leaks: <ProfitLeakDetector />,
    opportunities: <OpportunityEngine onNavigate={handleNavigate} />,
    focus: <FocusEngineV2 />,
    plans: <ActionPlanPage />,
    goals: <GoalsPage />,
    simulator: <GrowthSimulatorV3 />,
    advisor: <AdvisorPageV2 onNavigate={handleNavigate} />,
    alerts: <AlertsPage onNavigate={handleNavigate} />,
    kpi: <KPIDashboardV2 />,
    analysis: <AnalysisPage />,
    automations: <AutomationsPage />,
    team: <TeamPage />,
    reports: <ReportsPage />,
    billing: <BillingPage />,
    settings: <SettingsPage />,
    admin: <AdminPanel />,
    'admin-dashboard': <AdminDashboard />,
    upgrade: <UpgradePage />,
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <AnimatePresence mode="wait">
        <motion.div key={currentPage} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {pageComponents[currentPage] || pageComponents.dashboard}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <PlatformProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </PlatformProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
