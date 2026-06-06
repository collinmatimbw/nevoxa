import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import { Zap, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Building } from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'signup';
  onNavigate: (page: string) => void;
}

export default function AuthPages({ mode, onNavigate }: AuthPagesProps) {
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [step, setStep] = useState(1);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (mode === 'login') {
      const success = login(email, password);
      if (!success) {
        setLoginError('Invalid email or password. Please sign up first.');
        return;
      }
      onNavigate('dashboard');
    } else {
      if (step === 1) {
        setStep(2);
      } else {
        signup(name, email, password);
        onNavigate('onboarding');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-display)]">Nexora</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {mode === 'login' ? 'Welcome back' : step === 1 ? 'Create your account' : 'Set up your business'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {mode === 'login' ? 'Log in to your Nexora dashboard' : step === 1 ? 'Start optimizing your business profits today' : 'Tell us about your business'}
          </p>

          {mode === 'login' || (mode === 'signup' && step === 1) ? (
            <>
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6L11.4 0H24v11.4L11.4 24zM1.2 22.8h9.7L22.8 10.9V1.2H13L1.2 13v9.8z" fill={theme === 'dark' ? '#fff' : '#333'}/></svg>
                  Microsoft
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400">or continue with email</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
            </>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && step === 1 && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            )}

            {mode === 'signup' && step === 2 ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your Company" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Industry</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all">
                    <option>Select your industry</option>
                    {['SaaS', 'E-commerce', 'Agency', 'Retail', 'Restaurant', 'Manufacturing', 'Freelancer', 'Service Business', 'Startup', 'Enterprise'].map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Monthly Revenue Range</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all">
                    <option>Select range</option>
                    {['$0 - $1K', '$1K - $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K - $1M', '$1M - $10M', '$10M+'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 focus:border-transparent outline-none transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300 text-nexora-500 focus:ring-nexora-500" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-nexora-600 hover:text-nexora-700 font-medium">Forgot password?</button>
              </div>
            )}

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-sm text-red-600 dark:text-red-400">
                {loginError}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg">
              {mode === 'login' ? 'Log in' : step === 1 ? 'Continue' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => onNavigate(mode === 'login' ? 'signup' : 'login')} className="text-nexora-600 font-semibold hover:text-nexora-700">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        <img src="/images/auth-bg.jpg" alt="Nexora" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}
