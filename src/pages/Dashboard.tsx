import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { usePlatform } from '../contexts/PlatformContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Target, AlertTriangle, ArrowRight, Sparkles, Brain, Rocket, CheckCircle2, Clock, Database, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { getCurrency } from '../data/currencies';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { entries, currentEntry, currentAnalysis, getGrowthRates } = useBusiness();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mb-6">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-2">Welcome to Nexora</h2>
        <p className="text-gray-500 mb-2">Start by adding your first month of business data. The AI engine will analyze your revenue, expenses, and operations to detect profit leaks and growth opportunities.</p>
        <p className="text-sm text-gray-400 mb-6">Add at least 2-3 months for the best analysis — including trends, benchmarks, and forecasts.</p>
        <Button size="lg" onClick={() => onNavigate('data')} icon={<Plus className="w-5 h-5" />}>
          Add Your First Data
        </Button>
      </div>
    );
  }

  const growth = getGrowthRates();
  const entry = currentEntry;
  const chartData = useBusiness().getTrends();
  const margin = entry ? ((entry.profit / entry.revenue) * 100).toFixed(1) : '0';
  const leaks = currentAnalysis?.leaks || [];
  const totalLeakLoss = leaks.reduce((s, l) => s + l.estimatedLoss, 0);
  const scoreBreakdown = currentAnalysis?.profitScoreBreakdown;
  const scoreCategories = scoreBreakdown ? [
    { name: 'Pricing', score: scoreBreakdown.pricing.score, icon: '💰' },
    { name: 'Marketing', score: scoreBreakdown.marketing.score, icon: '📢' },
    { name: 'Operations', score: scoreBreakdown.operations.score, icon: '⚙️' },
    { name: 'Retention', score: scoreBreakdown.retention.score, icon: '🔄' },
    { name: 'Cash Flow', score: scoreBreakdown.cashFlow.score, icon: '💵' },
    { name: 'Growth', score: scoreBreakdown.growth.score, icon: '📈' },
    { name: 'Profitability', score: scoreBreakdown.profitability.score, icon: '⚡' },
  ] : [];

  const currSym = entry ? getCurrency(entry.currency).symbol : '$';
  const metrics = [
    { label: 'Monthly Revenue', value: `${currSym}${entry ? (entry.revenue / 1000).toFixed(0) : '0'}K`, change: growth.revenueGrowth, icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Net Profit', value: `${currSym}${entry ? (entry.profit / 1000).toFixed(0) : '0'}K`, change: growth.profitGrowth, icon: <TrendingUp className="w-5 h-5" />, color: 'from-nexora-500 to-emerald-600' },
    { label: 'Profit Margin', value: `${margin}%`, change: growth.marginDelta, icon: <BarChart3 className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600' },
    { label: 'Growth Rate', value: `${growth.revenueGrowth.toFixed(1)}%`, change: growth.revenueGrowth, icon: <Users className="w-5 h-5" />, color: 'from-amber-500 to-orange-600' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('reports')}>View Reports</Button>
          <Button size="sm" onClick={() => onNavigate('advisor')}>
            <Sparkles className="w-4 h-4" /> Ask AI Advisor
          </Button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-emerald-500/10 to-teal-500/10 dark:from-nexora-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-nexora-700 dark:text-nexora-300 mb-1">🧠 AI Intelligence Brief</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {currentAnalysis?.summary || 'Analyzing your business data...'}{' '}
              {leaks.length > 0 && <>The top leak — <strong>"{leaks[0].problem.substring(0, 60)}..."</strong> — costs an estimated <strong className="text-red-500">{currSym}{leaks[0].estimatedLoss.toLocaleString()}/mo</strong>.</>}
            </p>
            <button onClick={() => onNavigate('insights')} className="text-sm font-semibold text-nexora-600 dark:text-nexora-400 mt-2 hover:underline inline-flex items-center gap-1">
              View Full Insights <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Phase 4: Executive Quick Access */}
      {(() => {
        const p4 = usePlatform();
        const critAlerts = p4.alerts.filter(a => !a.read && (a.severity === 'critical' || a.severity === 'high'));
        return critAlerts.length > 0 ? (
          <Card className="!border-amber-200 dark:!border-amber-900/30 !bg-amber-50/50 dark:!bg-amber-950/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Priority Alerts ({critAlerts.length})</h3>
              <button onClick={() => onNavigate('alerts')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">All Alerts →</button>
            </div>
            <div className="space-y-2">
              {critAlerts.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80" onClick={() => { p4.markAlertRead(a.id); a.actionRoute && onNavigate(a.actionRoute); }}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <span className="font-medium flex-1 truncate">{a.title}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        ) : null;
      })()}



      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">{m.label}</div>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {m.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {m.change >= 0 ? '+' : ''}{m.change}% vs last month
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white`}>
                {m.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenue & Profit Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">12-month overview</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-nexora-500" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `${currSym}${v / 1000}K`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`${currSym}${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#colorRevenue)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#colorProfit)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Profit Score */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Profit Score</h3>
            <button onClick={() => onNavigate('analysis')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">Details →</button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(currentAnalysis?.profitScore || 0) * 2.64} 264`} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#86efac" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{currentAnalysis?.profitScore || 0}</span>
                <span className="text-xs text-gray-500">out of 100</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {scoreCategories.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm">{cat.icon}</span>
                <span className="text-xs font-medium flex-1">{cat.name}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${getScoreBg(cat.score)}`} style={{ width: `${cat.score}%` }} />
                </div>
                <span className={`text-xs font-bold ${getScoreColor(cat.score)}`}>{cat.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit Leaks */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold">Profit Leaks Detected</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">{leaks.length} issues</span>
            </div>
            <button onClick={() => onNavigate('leaks')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {leaks.slice(0, 4).map((leak) => (
              <div key={leak.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 hover:border-nexora-200 dark:hover:border-nexora-800 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        leak.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        leak.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>{leak.impact.toUpperCase()}</span>
                      <span className="text-xs text-gray-500 capitalize">{leak.category}</span>
                    </div>
                    <p className="text-sm font-medium">{leak.problem}</p>
                    <p className="text-xs text-gray-500 mt-1">💡 {leak.recommendation}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-red-500">-{currSym}{leak.estimatedLoss.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">per month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center">
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">
              Total Recoverable: {currSym}{totalLeakLoss.toLocaleString()}/month
            </span>
          </div>
        </Card>

        {/* Business Snapshot */}
        <Card>
          <h3 className="font-semibold mb-4">Business Snapshot</h3>
          {entry ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Industry</span><span className="font-medium">{entry.industry}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Employees</span><span className="font-medium">{entry.employeeCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Customers</span><span className="font-medium">{entry.customerCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Ad Spend</span><span className="font-medium">{currSym}{entry.adSpend.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Products</span><span className="font-medium">{entry.productCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Top Product</span><span className="font-medium">{entry.topProduct}</span></div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          )}
        </Card>
      </div>

      {/* Focus Engine Quick View — Phase 2 Intelligence */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-nexora-500" />
            <h3 className="font-semibold">Focus Engine — AI Recommendations</h3>
          </div>
          <button onClick={() => onNavigate('focus')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">Full Engine →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'stop', label: '🛑 Stop Doing', color: 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10', desc: 'Activities wasting money or resources' },
            { key: 'keep', label: '✅ Keep Doing', color: 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10', desc: 'Activities performing well' },
            { key: 'improve', label: '🔧 Improve', color: 'border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10', desc: 'Activities that need optimization' },
          ].map((cat) => {
            const items = currentAnalysis?.focusItems.filter(f => f.type === cat.key) || [];
            return (
              <div key={cat.key} className={`p-4 rounded-xl border ${cat.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold">{cat.label}</div>
                  <span className="text-xs font-bold text-gray-400">{items.length}</span>
                </div>
                <div className="text-[10px] text-gray-400 mb-3">{cat.desc}</div>
                <div className="space-y-2">
                  {items.slice(0, 3).map((rec: any, idx: number) => (
                    <div key={rec.id || idx} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      • {(rec.action || '').substring(0, 70)}{(rec.action || '').length > 70 ? '...' : ''}
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-xs text-gray-400 italic">No items</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Phase 3: Goals Progress */}
      {(() => {
        const { goals, getForecast, currentAnalysis: ca } = useBusiness();
        const activeGoals = goals.filter(g => g.status === 'active');
        const forecast = getForecast(6);
        const opportunities = ca?.opportunities || [];
        const topOps = opportunities.slice(0, 3);

        return (<>
          {activeGoals.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Goals Progress</h3>
                <button onClick={() => onNavigate('goals')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">All Goals →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeGoals.slice(0, 4).map(g => {
                  const pct = g.type === 'expenses' ? Math.min(100, ((g.currentValue - g.targetValue) / g.currentValue) * 100) : Math.min(100, (g.currentValue / g.targetValue) * 100);
                  const days = Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000));
                  return (
                    <div key={g.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold truncate">{g.title}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" />{days}d</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                        <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-green-500' : pct >= 60 ? 'bg-nexora-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">{pct.toFixed(0)}% complete</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Growth Forecast */}
          {forecast.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Rocket className="w-5 h-5 text-nexora-500" /> Revenue Forecast</h3>
                <button onClick={() => onNavigate('kpi')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">KPI Dashboard →</button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `${currSym}${v / 1000}K`} />
                  <Tooltip formatter={(v: any) => `${currSym}${Number(v).toLocaleString()}`} contentStyle={{ borderRadius:'12px', border:'none' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 3 }} name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Projected Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Projected Profit</span>
              </div>
            </Card>
          )}

          {/* Top Opportunities */}
          {topOps.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-nexora-500" /> Top Opportunities</h3>
                <button onClick={() => onNavigate('opportunities')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">All Opportunities →</button>
              </div>
              <div className="space-y-2">
                {topOps.map(op => (
                  <div key={op.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30">
                    <span className="text-lg">{op.category === 'revenue' ? '💰' : op.category === 'pricing' ? '🏷️' : op.category === 'marketing' ? '📢' : op.category === 'retention' ? '🔄' : '✂️'}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{op.title}</span>
                      <div className="text-[10px] text-gray-400">{op.timeToResults}</div>
                    </div>
                    <span className="text-sm font-bold text-green-500 shrink-0">+{currSym}{op.potentialImpact.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>);
      })()}
    </div>
  );
}
