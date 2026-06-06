import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { PlatformProvider } from './contexts/PlatformContext';
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
// Phase 4

import TeamPage from './pages/TeamPage';
import BillingPage from './pages/BillingPage';
import AutomationsPage from './pages/AutomationsPage';
import AlertsPage from './pages/AlertsPage';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const handleNavigate = (page: string) => { setCurrentPage(page); window.scrollTo(0, 0); };

  useEffect(() => {
    if (user?.role === 'admin' && currentPage === 'dashboard') {
      setCurrentPage('admin-dashboard');
    }
  }, [user, currentPage]);

  if (!isAuthenticated) {
    switch (currentPage) {
      case 'login': return <AuthPages mode="login" onNavigate={handleNavigate} />;
      case 'signup': return <AuthPages mode="signup" onNavigate={handleNavigate} />;
      case 'onboarding': return <Onboarding onNavigate={handleNavigate} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  }
  if (currentPage === 'onboarding') return <Onboarding onNavigate={handleNavigate} />;

  const pages: Record<string, React.ReactNode> = {
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
      {pages[currentPage] || pages.dashboard}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <PlatformProvider>
            <AppContent />
          </PlatformProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
