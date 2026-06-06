import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import { Moon, Sun, Menu, X, ArrowRight, Check, Star, Zap, Shield, BarChart3, Brain, Target, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: <Brain className="w-6 h-6" />, title: 'AI Business Analysis', desc: 'Deep analysis of revenue, expenses, margins, operations, staffing, products, and business health.' },
    { icon: <Target className="w-6 h-6" />, title: 'Profit Leak Detector', desc: 'Automatically find and rank unnecessary expenses, underperforming products, and low ROI channels.' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'AI Profit Advisor', desc: 'Conversational AI consultant that learns your business and provides personalized recommendations.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Growth Simulator', desc: 'Simulate decisions before making them — see projected revenue, profit, and risk analysis.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'KPI Dashboard', desc: 'Track all critical metrics with interactive charts, forecasting, and real-time insights.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Action Plans', desc: 'Auto-generated 7-day, 30-day, and 90-day plans tailored to your business goals.' },
  ];

  const plans = [
    { name: 'Free', price: '$0', period: '/forever', desc: 'For solo entrepreneurs starting out', features: ['Basic profit analysis', 'Profit Score', '5 AI advisor chats/mo', 'Basic KPI dashboard', '1 user'], cta: 'Start Free', popular: false },
    { name: 'Pro', price: '$49', period: '/month', desc: 'For growing businesses', features: ['Full AI analysis engine', 'Profit Leak Detector', 'Unlimited AI advisor', 'Growth Simulator', 'Action plans', 'PDF reports', '5 users'], cta: 'Start Pro Trial', popular: true },
    { name: 'Business', price: '$149', period: '/month', desc: 'For established companies', features: ['Everything in Pro', 'Industry intelligence', 'Custom dashboards', 'Investor reports', 'API access', 'Priority support', '25 users'], cta: 'Start Business Trial', popular: false },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations', features: ['Everything in Business', 'Dedicated AI model', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager', 'Unlimited users', 'On-premise option'], cta: 'Contact Sales', popular: false },
  ];

  const stats = [
    { value: '12,400+', label: 'Businesses Optimized' },
    { value: '$2.4B', label: 'Profit Recovered' },
    { value: '94%', label: 'Customer Retention' },
    { value: '3.2x', label: 'Average ROI' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'CEO, TechFlow', quote: 'Nexora found $180K in annual savings we never knew existed. The AI advisor is like having a CFO on call 24/7.', rating: 5 },
    { name: 'Marcus Rivera', role: 'Founder, GrowthLab', quote: 'Our profit margins increased 34% in the first quarter. The Growth Simulator alone paid for the subscription 100x over.', rating: 5 },
    { name: 'Emily Watson', role: 'COO, ScaleUp Inc.', quote: 'The Focus Engine transformed how we prioritize. We stopped wasting time on low-impact activities and doubled our growth rate.', rating: 5 },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-display)]">Nexora</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => onNavigate('login')} className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Log in</button>
              <Button size="sm" onClick={() => onNavigate('signup')} className="hidden md:flex">Get Started</Button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-200/30 dark:border-gray-700/30 p-4 space-y-3">
            <a href="#features" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#testimonials" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="block py-2 text-sm font-medium w-full text-left">Log in</button>
            <Button size="sm" onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }} className="w-full">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-nexora-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nexora-100 dark:bg-nexora-900/40 text-nexora-700 dark:text-nexora-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Intelligence
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-[family-name:var(--font-display)] leading-tight mb-6">
            Your AI CFO for{' '}
            <span className="gradient-text">Maximum Profit</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            Nexora analyzes your entire business in real-time, finds hidden profit leaks, 
            and gives you an actionable roadmap to increase revenue and cut waste — 
            whether you're a solo founder or a Fortune 500.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('signup')}>
              Sign Up Free
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-nexora-500/10 border border-gray-200/50 dark:border-gray-700/40">
            <div className="bg-gray-900 p-1.5 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-gray-400">app.nexora.ai/dashboard</span>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-nexora-950 p-6 sm:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Monthly Revenue', value: '$84,000', change: '+12.5%', color: 'text-green-400' },
                  { label: 'Net Profit', value: '$43,000', change: '+18.2%', color: 'text-green-400' },
                  { label: 'Profit Score', value: '74/100', change: '+5 pts', color: 'text-green-400' },
                  { label: 'Leaks Found', value: '$31,300', change: '6 issues', color: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800/80 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                    <div className="text-xl font-bold text-white">{item.value}</div>
                    <div className={`text-xs mt-1 ${item.color}`}>{item.change}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gray-800/80 rounded-xl p-4 border border-gray-700/50 h-48 flex items-end gap-1">
                  {[40, 55, 48, 62, 58, 75, 68, 82, 78, 90, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gradient-to-t from-nexora-600 to-nexora-400 rounded-t" style={{ height: `${h}%` }} />
                      <div className="text-[9px] text-gray-500">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700/50">
                  <div className="text-sm font-semibold text-white mb-3">🎯 Focus Engine</div>
                  {['Stop: Low ROI Facebook ads', 'Scale: Google Ads (3.2x ROAS)', 'Improve: Onboarding flow', 'Automate: Invoice follow-ups'].map((item, i) => (
                    <div key={i} className="text-xs text-gray-300 py-1.5 border-b border-gray-700/30 last:border-0 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${['bg-red-400', 'bg-green-400', 'bg-amber-400', 'bg-blue-400'][i]}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
              Everything you need to <span className="gradient-text">maximize profit</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Six powerful AI engines working together to analyze, optimize, and grow your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60 hover:border-nexora-300 dark:hover:border-nexora-700 hover:shadow-lg hover:shadow-nexora-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 gradient-bg-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
              Profit optimization in <span className="gradient-text">3 simple steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect Your Business', desc: 'Enter your business details or connect your existing tools. Nexora works with any business size — from $100/mo to $1B+/mo revenue.', icon: '🔗' },
              { step: '02', title: 'AI Analyzes Everything', desc: 'Our AI engine scans revenue, expenses, pricing, marketing, operations, and customer data to find every optimization opportunity.', icon: '🧠' },
              { step: '03', title: 'Execute & Grow', desc: 'Follow personalized action plans, track progress in real-time, and watch your profits grow with AI guidance every step of the way.', icon: '🚀' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="text-6xl mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-nexora-500 mb-2">STEP {s.step}</div>
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-12 -right-4 w-8 h-8 text-nexora-300 dark:text-nexora-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
              Loved by <span className="gradient-text">12,400+ businesses</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 gradient-bg-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
              Plans for every <span className="gradient-text">business size</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">From solo founders to enterprises. Start free, scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-nexora-500 shadow-2xl shadow-nexora-500/15 bg-white dark:bg-gray-800 ring-2 ring-nexora-500/20 -my-2 z-10' : 'border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <Button variant={plan.popular ? 'primary' : 'secondary'} size="sm" className="w-full mb-6" onClick={() => onNavigate('signup')}>
                  {plan.cta}
                </Button>
                <ul className="space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 text-nexora-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
              Built for <span className="gradient-text">every industry</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Nexora adapts its analysis and recommendations for your specific industry.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['💻 SaaS', '🛒 E-commerce', '🏢 Agencies', '🏪 Retail', '🍽️ Restaurants', '🏭 Manufacturing', '👤 Freelancers', '🔧 Services', '🚀 Startups', '🏛️ Enterprise'].map((ind, i) => (
              <div key={i} className="px-5 py-3 rounded-xl border border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60 text-sm font-medium hover:border-nexora-300 dark:hover:border-nexora-700 transition-all cursor-default">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center gradient-bg rounded-3xl p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-nexora-600/20 via-transparent to-violet-600/20" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
              Ready to unlock hidden profits?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join 12,400+ businesses already using Nexora to make smarter decisions and increase profits.
            </p>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('signup')}>
              Get Started Free <ArrowRight className="w-5 h-5 inline ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 dark:border-gray-700/40 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold font-[family-name:var(--font-display)]">Nexora</span>
              </div>
              <p className="text-xs text-gray-500">AI-powered business profit optimization for every business size.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2">
                {['Features', 'Pricing', 'Integrations', 'API'].map(l => (
                  <div key={l} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                  <div key={l} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'GDPR'].map(l => (
                  <div key={l} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200/60 dark:border-gray-700/40">
            <div className="text-xs text-gray-500">© 2026 Nexora. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">SOC 2 Compliant • GDPR Ready • 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
