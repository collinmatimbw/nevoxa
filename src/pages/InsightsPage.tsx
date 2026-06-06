import { useMemo } from 'react';
import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Target, Brain, BarChart3, ArrowRight, CheckCircle2, StopCircle, Wrench, Activity } from 'lucide-react';

interface InsightsPageProps {
  onNavigate: (page: string) => void;
}

export default function InsightsPage({ onNavigate }: InsightsPageProps) {
  const { entries, analyses, currentAnalysis, allFocusItems, getTrends, getGrowthRates } = useBusiness();

  const trends = getTrends();
  const growth = getGrowthRates();

  const currentLeaks = currentAnalysis?.leaks || [];
  const totalLoss = currentLeaks.reduce((s, l) => s + l.estimatedLoss, 0);

  const stopItems = allFocusItems.filter(i => i.type === 'stop');
  const keepItems = allFocusItems.filter(i => i.type === 'keep');
  const improveItems = allFocusItems.filter(i => i.type === 'improve');

  // Score trend data
  const scoreTrend = useMemo(() => {
    return analyses.map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short' }),
      score: a.profitScore,
      margin: a.profitMargin,
    }));
  }, [analyses]);

  // AI-generated key insights
  const keyInsights = useMemo(() => {
    const insights: { type: 'positive' | 'negative' | 'neutral'; title: string; detail: string; metric?: string }[] = [];
    
    if (growth.revenueGrowth > 0) {
      insights.push({ type: 'positive', title: 'Revenue is growing', detail: `Revenue increased ${growth.revenueGrowth.toFixed(1)}% month-over-month, indicating healthy business momentum.`, metric: `+${growth.revenueGrowth.toFixed(1)}%` });
    } else if (growth.revenueGrowth < 0) {
      insights.push({ type: 'negative', title: 'Revenue is declining', detail: `Revenue decreased ${Math.abs(growth.revenueGrowth).toFixed(1)}% — investigate sales pipeline and customer churn.`, metric: `${growth.revenueGrowth.toFixed(1)}%` });
    }

    if (growth.expenseGrowth > growth.revenueGrowth && growth.expenseGrowth > 0) {
      insights.push({ type: 'negative', title: 'Expenses growing faster than revenue', detail: `Expenses grew ${growth.expenseGrowth.toFixed(1)}% vs revenue at ${growth.revenueGrowth.toFixed(1)}% — this erodes profitability over time.`, metric: `${growth.expenseGrowth.toFixed(1)}%` });
    } else if (growth.expenseGrowth < growth.revenueGrowth) {
      insights.push({ type: 'positive', title: 'Expenses under control', detail: `Expenses grew slower (${growth.expenseGrowth.toFixed(1)}%) than revenue (${growth.revenueGrowth.toFixed(1)}%) — good cost discipline.`, metric: 'Healthy' });
    }

    if (growth.profitGrowth > 10) {
      insights.push({ type: 'positive', title: 'Strong profit growth', detail: `Profit grew ${growth.profitGrowth.toFixed(1)}% — your business is becoming more profitable.`, metric: `+${growth.profitGrowth.toFixed(1)}%` });
    }

    if (growth.marginDelta > 0) {
      insights.push({ type: 'positive', title: 'Margin improvement', detail: `Profit margin improved by ${growth.marginDelta.toFixed(1)} percentage points — each dollar of revenue is now more profitable.`, metric: `+${growth.marginDelta.toFixed(1)}pp` });
    } else if (growth.marginDelta < -2) {
      insights.push({ type: 'negative', title: 'Margin compression', detail: `Profit margin decreased by ${Math.abs(growth.marginDelta).toFixed(1)} percentage points — costs may be rising faster than revenue.`, metric: `${growth.marginDelta.toFixed(1)}pp` });
    }

    if (currentLeaks.filter(l => l.impact === 'high').length > 0) {
      insights.push({ type: 'negative', title: `${currentLeaks.filter(l => l.impact === 'high').length} high-impact profit leaks`, detail: `Estimated total loss of $${totalLoss.toLocaleString()}/month. Addressing these could significantly boost profitability.`, metric: `-$${totalLoss.toLocaleString()}` });
    }

    if ((currentAnalysis?.profitScore || 0) >= 75) {
      insights.push({ type: 'positive', title: 'Strong profit score', detail: `Your overall profit health score is ${currentAnalysis?.profitScore}/100 — above the 75-point threshold for healthy businesses.`, metric: `${currentAnalysis?.profitScore}/100` });
    } else if ((currentAnalysis?.profitScore || 0) < 60) {
      insights.push({ type: 'negative', title: 'Profit score needs attention', detail: `Score is ${currentAnalysis?.profitScore}/100 — below 60 indicates significant optimization opportunities remain.`, metric: `${currentAnalysis?.profitScore}/100` });
    } else {
      insights.push({ type: 'neutral', title: 'Moderate profit score', detail: `Score is ${currentAnalysis?.profitScore}/100 — good baseline, but there's room to push above 75.`, metric: `${currentAnalysis?.profitScore}/100` });
    }

    return insights;
  }, [growth, currentLeaks, currentAnalysis, totalLoss]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          Business Insights
        </h1>
        <p className="text-sm text-gray-500 mt-1">AI-generated intelligence combining trend analysis, leak detection, and strategic recommendations</p>
      </div>

      {/* Top-line AI Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-emerald-500/10 to-teal-500/10 dark:from-nexora-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2 text-lg">Nexora Intelligence Brief</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentAnalysis?.summary || 'Analyzing your business data...'}{' '}
              Your Focus Engine has <strong className="text-red-500">{stopItems.length} stop</strong>, <strong className="text-green-500">{keepItems.length} keep</strong>, and <strong className="text-amber-500">{improveItems.length} improve</strong> recommendations active.
              {growth.profitGrowth > 0 
                ? ` Overall trajectory is positive with ${growth.profitGrowth.toFixed(1)}% profit growth.`
                : ` Attention needed — profit ${growth.profitGrowth === 0 ? 'is flat' : `declined ${Math.abs(growth.profitGrowth).toFixed(1)}%`}.`
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Key Insights Grid */}
      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-nexora-500" /> Key Findings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyInsights.map((insight, i) => (
            <Card key={i} hover>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  insight.type === 'positive' ? 'bg-green-100 dark:bg-green-900/30' :
                  insight.type === 'negative' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-gray-100 dark:bg-gray-700/30'
                }`}>
                  {insight.type === 'positive' ? <TrendingUp className="w-5 h-5 text-green-500" /> :
                   insight.type === 'negative' ? <TrendingDown className="w-5 h-5 text-red-500" /> :
                   <BarChart3 className="w-5 h-5 text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{insight.title}</h4>
                    {insight.metric && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        insight.type === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        insight.type === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>{insight.metric}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{insight.detail}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-1">Revenue, Expenses & Profit Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Historical performance over your tracked period</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="insRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="insProfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#insRevGrad)" strokeWidth={2.5} name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#insProfGrad)" strokeWidth={2.5} name="Profit" />
              <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Profit</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Expenses</span>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-1">Profit Score & Margin Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Business health tracking over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#9ca3af" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#9ca3af" domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Profit Score" />
              <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Margin %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Profit Score</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Margin %</span>
          </div>
        </Card>
      </div>

      {/* Growth Rate Cards */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Growth Rates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Revenue Growth', value: growth.revenueGrowth, explanation: growth.revenueGrowth > 5 ? 'Strong growth — keep current strategy' : growth.revenueGrowth > 0 ? 'Moderate growth — look for acceleration levers' : 'Declining — investigate root cause immediately' },
            { label: 'Profit Growth', value: growth.profitGrowth, explanation: growth.profitGrowth > growth.revenueGrowth ? 'Profit growing faster than revenue — great efficiency' : growth.profitGrowth > 0 ? 'Profitable growth — margins could be improved' : 'Profit declining — check expenses and pricing' },
            { label: 'Expense Growth', value: growth.expenseGrowth, isExpense: true, explanation: growth.expenseGrowth < growth.revenueGrowth ? 'Expenses controlled — scaling efficiently' : 'Expenses outpacing revenue — review cost structure' },
            { label: 'Margin Delta', value: growth.marginDelta, suffix: 'pp', explanation: growth.marginDelta > 0 ? 'Improving margins — more profit per revenue dollar' : growth.marginDelta < -1 ? 'Margin compression — costs rising or prices dropping' : 'Margins stable — look for optimization opportunities' },
          ].map((g, i) => (
            <Card key={i} hover>
              <div className="text-xs text-gray-500 font-medium mb-1">{g.label}</div>
              <div className={`text-2xl font-bold ${
                (g as any).isExpense
                  ? (g.value <= 0 ? 'text-green-500' : g.value < 5 ? 'text-amber-500' : 'text-red-500')
                  : (g.value > 0 ? 'text-green-500' : g.value === 0 ? 'text-gray-500' : 'text-red-500')
              }`}>
                {g.value > 0 ? '+' : ''}{g.value.toFixed(1)}{g.suffix || '%'}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{g.explanation}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Focus Engine Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-nexora-500" /> Focus Engine Summary
          </h3>
          <button onClick={() => onNavigate('focus')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline flex items-center gap-1">
            Full Engine <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'stop', items: stopItems, icon: <StopCircle className="w-4 h-4" />, emoji: '🛑', color: 'red', label: 'Stop Doing' },
            { type: 'keep', items: keepItems, icon: <CheckCircle2 className="w-4 h-4" />, emoji: '✅', color: 'green', label: 'Keep Doing' },
            { type: 'improve', items: improveItems, icon: <Wrench className="w-4 h-4" />, emoji: '🔧', color: 'amber', label: 'Improve' },
          ].map(cat => (
            <div key={cat.type} className={`p-4 rounded-xl border border-${cat.color}-200 dark:border-${cat.color}-900/30 bg-${cat.color}-50/50 dark:bg-${cat.color}-950/10`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{cat.emoji}</span>
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-${cat.color}-100 dark:bg-${cat.color}-900/30 text-${cat.color}-700 dark:text-${cat.color}-400`}>{cat.items.length}</span>
              </div>
              <div className="space-y-2">
                {cat.items.slice(0, 3).map(item => (
                  <div key={item.id} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>{item.action.length > 80 ? item.action.substring(0, 80) + '...' : item.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Profit Leaks Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Active Profit Leaks
          </h3>
          <button onClick={() => onNavigate('leaks')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline flex items-center gap-1">
            Full Detector <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {currentLeaks.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">No active leaks detected — your business is running efficiently! 🎉</div>
        ) : (
          <div className="space-y-2">
            {currentLeaks.slice(0, 5).map(leak => (
              <div key={leak.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 hover:border-nexora-200 dark:hover:border-nexora-800 transition-colors">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  leak.impact === 'high' ? 'bg-red-500' : leak.impact === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm flex-1 min-w-0 truncate">{leak.problem}</span>
                <span className="text-sm font-bold text-red-500 shrink-0">-${leak.estimatedLoss.toLocaleString()}/mo</span>
              </div>
            ))}
            {currentLeaks.length > 5 && (
              <div className="text-center text-xs text-gray-400 pt-2">+{currentLeaks.length - 5} more leaks detected</div>
            )}
          </div>
        )}
      </Card>

      {/* Historical Entries Table */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-400" /> Business History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/60 dark:border-gray-700/40">
                {['Date', 'Revenue', 'Expenses', 'Profit', 'Margin', 'Score', 'Leaks'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.slice().reverse().map((entry) => {
                const analysis = analyses.find(a => a.entryId === entry.id);
                const margin = ((entry.profit / entry.revenue) * 100).toFixed(1);
                return (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                    <td className="py-3 px-4 text-sm">${entry.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-red-500">${entry.expenses.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-500">${entry.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">{margin}%</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-bold ${(analysis?.profitScore || 0) >= 75 ? 'text-green-500' : (analysis?.profitScore || 0) >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                        {analysis?.profitScore || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (analysis?.leaks.length || 0) === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        (analysis?.leaks.length || 0) <= 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>{analysis?.leaks.length || 0}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
