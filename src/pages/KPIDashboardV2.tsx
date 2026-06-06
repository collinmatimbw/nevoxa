import { useState } from 'react';
import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, ArrowUpRight, Brain, Info } from 'lucide-react';

export default function KPIDashboardV2() {
  const { entries, analyses, getGrowthRates, currentAnalysis } = useBusiness();
  const growth = getGrowthRates();
  const latestEntry = entries[entries.length - 1];

  const kpis = [
    { label: 'Monthly Revenue', value: `$${latestEntry ? (latestEntry.revenue / 1000).toFixed(0) : '0'}K`, change: growth.revenueGrowth, icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-emerald-600', explanation: 'Total income before expenses. Healthy SaaS grows 10-20%/mo.' },
    { label: 'Net Profit', value: `$${latestEntry ? (latestEntry.profit / 1000).toFixed(0) : '0'}K`, change: growth.profitGrowth, icon: <TrendingUp className="w-5 h-5" />, color: 'from-nexora-500 to-emerald-600', explanation: 'Revenue minus all expenses. The true bottom line.' },
    { label: 'Total Expenses', value: `$${latestEntry ? (latestEntry.expenses / 1000).toFixed(0) : '0'}K`, change: growth.expenseGrowth, icon: <Wallet className="w-5 h-5" />, color: 'from-red-500 to-rose-600', isExpense: true, explanation: 'All business costs. Should grow slower than revenue.' },
    { label: 'Revenue Growth', value: `${growth.revenueGrowth.toFixed(1)}%`, change: growth.revenueGrowth, icon: <ArrowUpRight className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600', explanation: 'Month-over-month revenue change. Above 5% is healthy.' },
    { label: 'Profit Growth', value: `${growth.profitGrowth.toFixed(1)}%`, change: growth.profitGrowth, icon: <TrendingUp className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600', explanation: 'Month-over-month profit change. Should exceed revenue growth.' },
    { label: 'Expense Growth', value: `${growth.expenseGrowth.toFixed(1)}%`, change: growth.expenseGrowth, icon: <TrendingDown className="w-5 h-5" />, color: 'from-amber-500 to-orange-600', isExpense: true, explanation: 'Month-over-month expense change. Lower is better.' },
    { label: 'Profit Margin', value: `${latestEntry ? ((latestEntry.profit / latestEntry.revenue) * 100).toFixed(1) : '0'}%`, change: growth.marginDelta, icon: <BarChart3 className="w-5 h-5" />, color: 'from-teal-500 to-cyan-600', explanation: 'Profit as % of revenue. SaaS target: 40-60%.' },
    { label: 'Profit Score', value: `${currentAnalysis?.profitScore || 0}`, change: 0, icon: <Brain className="w-5 h-5" />, color: 'from-nexora-500 to-emerald-600', explanation: 'AI health score (0-100). Above 75 is strong.' },
  ];

  // Per-entry margin data for trend
  const marginTrend = entries.map((e, i) => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short' }),
    margin: Number(((e.profit / e.revenue) * 100).toFixed(1)),
    score: analyses[i]?.profitScore || 0,
  }));

  // Revenue vs expense comparison
  const comparisonData = entries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short' }),
    revenue: e.revenue,
    expenses: e.expenses,
    profit: e.profit,
  }));

  // Growth rate over time
  const growthRateData = entries.slice(1).map((e, i) => {
    const prev = entries[i];
    return {
      date: new Date(e.date).toLocaleDateString('en-US', { month: 'short' }),
      revGrowth: Number((((e.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)),
      profGrowth: Number((((e.profit - prev.profit) / prev.profit) * 100).toFixed(1)),
      expGrowth: Number((((e.expenses - prev.expenses) / prev.expenses) * 100).toFixed(1)),
    };
  });

  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">KPI Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track all critical business metrics with trend analysis and AI explanations</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs text-gray-500 font-medium">{kpi.label}</div>
                  <button
                    onClick={() => setShowExplanation(showExplanation === i ? null : i)}
                    className="text-gray-300 dark:text-gray-600 hover:text-nexora-500 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
                  (kpi as any).isExpense
                    ? (kpi.change <= 0 ? 'text-green-500' : 'text-red-500')
                    : (kpi.change >= 0 ? 'text-green-500' : 'text-red-500')
                }`}>
                  {kpi.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}% MoM
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white`}>
                {kpi.icon}
              </div>
            </div>
            {showExplanation === i && (
              <div className="mt-2 p-2.5 rounded-lg bg-nexora-50 dark:bg-nexora-950/30 border border-nexora-100 dark:border-nexora-900/40">
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">{kpi.explanation}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Revenue vs Expenses Bar Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Revenue vs Expenses vs Profit</h3>
            <p className="text-xs text-gray-500 mt-0.5">Side-by-side comparison over time</p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Expenses</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Profit</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
            <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Growth Rates & Margin Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-1">Growth Rate Trends</h3>
          <p className="text-xs text-gray-500 mb-4">Revenue, profit, and expense growth rates over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="revGrowth" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 3 }} name="Revenue Growth" />
              <Line type="monotone" dataKey="profGrowth" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} name="Profit Growth" />
              <Line type="monotone" dataKey="expGrowth" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#f87171', r: 3 }} name="Expense Growth" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-1">Profit Margin & Score Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Tracking profitability and business health</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={marginTrend}>
              <defs>
                <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="margin" stroke="#10b981" fill="url(#marginGrad)" strokeWidth={2.5} name="Margin %" />
              <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 3 }} name="Profit Score" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Cash Flow Summary with context-aware messaging */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Cash Flow Summary</h3>
          <span className="text-xs text-gray-500">Based on {entries.length} tracked periods</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(() => {
            const totalRev = entries.reduce((s, e) => s + e.revenue, 0);
            const totalExp = entries.reduce((s, e) => s + e.expenses, 0);
            const totalProf = entries.reduce((s, e) => s + e.profit, 0);
            return [
              { label: 'Total Revenue (Tracked)', value: totalRev, color: 'green', explanation: `Across ${entries.length} periods of tracked data` },
              { label: 'Total Expenses (Tracked)', value: totalExp, color: 'red', explanation: `${((totalExp / totalRev) * 100).toFixed(1)}% of revenue spent on costs` },
              { label: 'Net Cumulative Profit', value: totalProf, color: 'nexora', explanation: `${((totalProf / totalRev) * 100).toFixed(1)}% average profit margin` },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-950/20 border border-${item.color}-100 dark:border-${item.color}-900/30`}>
                <div className={`text-xs text-${item.color}-600 dark:text-${item.color}-400 font-medium mb-1`}>{item.label}</div>
                <div className={`text-2xl font-bold text-${item.color}-700 dark:text-${item.color}-300`}>${(item.value / 1000).toFixed(0)}K</div>
                <div className="text-[11px] text-gray-500 mt-1">{item.explanation}</div>
              </div>
            ));
          })()}
        </div>
      </Card>
      {/* Revenue Forecast */}
      {(() => {
        const { getForecast: gf } = useBusiness();
        const fc = gf(6);
        if (fc.length === 0) return null;
        return (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-semibold">Revenue & Profit Forecast</h3><p className="text-xs text-gray-500 mt-0.5">6-month AI projection based on trends</p></div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fc}>
                <defs>
                  <linearGradient id="fcRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="revenue" stroke="#a855f7" fill="url(#fcRev)" strokeWidth={2.5} strokeDasharray="5 5" name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-center text-[10px] text-gray-400 mt-2 italic">Dashed lines indicate AI-projected values</div>
          </Card>
        );
      })()}
    </div>
  );
}
