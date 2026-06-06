import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { usePlatform } from '../contexts/PlatformContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, Brain, ArrowRight } from 'lucide-react';

interface Props { onNavigate: (p: string) => void }

export default function AICFOPage({ onNavigate }: Props) {
  const { currentEntry, currentAnalysis, getGrowthRates, getIndustryBenchmark, getForecast } = useBusiness();
  const { memories } = usePlatform();
  const growth = getGrowthRates();
  const bench = getIndustryBenchmark();
  const forecast = getForecast(6);
  const e = currentEntry;
  const margin = e ? (e.profit / e.revenue * 100) : 0;
  const leaks = currentAnalysis?.leaks || [];
  const totalLeakLoss = leaks.reduce((s, l) => s + l.estimatedLoss, 0);
  const milestones = memories.filter(m => m.type === 'milestone');

  const risks: { level: string; title: string; detail: string }[] = [];
  if (margin < bench.avgMargin) risks.push({ level: 'high', title: 'Below-benchmark margins', detail: `${margin.toFixed(1)}% vs ${bench.avgMargin}% industry avg` });
  if (growth.expenseGrowth > growth.revenueGrowth && growth.expenseGrowth > 0) risks.push({ level: 'high', title: 'Expense growth outpacing revenue', detail: `Expenses +${growth.expenseGrowth.toFixed(1)}% vs revenue +${growth.revenueGrowth.toFixed(1)}%` });
  if (totalLeakLoss > e!?.revenue * 0.05) risks.push({ level: 'medium', title: 'Significant profit leakage', detail: `$${totalLeakLoss.toLocaleString()}/mo in detected leaks` });
  if (growth.revenueGrowth < 3) risks.push({ level: 'medium', title: 'Revenue growth stalling', detail: `Only ${growth.revenueGrowth.toFixed(1)}% MoM — below 5% healthy threshold` });

  const budgetRec = [
    { category: 'Marketing', current: e?.adSpend || 0, recommended: Math.round((e?.revenue || 0) * bench.avgAdRatio / 100), note: `Target ${bench.avgAdRatio}% of revenue` },
    { category: 'Operations', current: Math.round(((e?.expenses || 0) - (e?.adSpend || 0)) * 0.4), recommended: Math.round((e?.revenue || 0) * 0.15), note: 'Optimize to 15% of revenue' },
    { category: 'Salaries', current: Math.round(((e?.expenses || 0) - (e?.adSpend || 0)) * 0.5), recommended: Math.round((e?.revenue || 0) * 0.25), note: 'Target 25% for SaaS' },
    { category: 'R&D / Product', current: Math.round(((e?.expenses || 0) - (e?.adSpend || 0)) * 0.1), recommended: Math.round((e?.revenue || 0) * 0.12), note: 'Invest 12% in growth' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><DollarSign className="w-6 h-6 text-nexora-500" /> AI CFO</h1>
        <p className="text-sm text-gray-500 mt-1">Executive-level financial intelligence — profit, cash flow, budget, and risk analysis</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `$${(e?.revenue || 0).toLocaleString()}`, change: growth.revenueGrowth, icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' },
          { label: 'Net Profit', value: `$${(e?.profit || 0).toLocaleString()}`, change: growth.profitGrowth, icon: <TrendingUp className="w-5 h-5" />, color: 'from-nexora-500 to-emerald-600' },
          { label: 'Profit Margin', value: `${margin.toFixed(1)}%`, change: growth.marginDelta, icon: <Brain className="w-5 h-5" />, color: 'from-teal-500 to-cyan-600' },
          { label: 'Active Risks', value: `${risks.length}`, change: 0, icon: <AlertTriangle className="w-5 h-5" />, color: risks.length > 2 ? 'from-red-500 to-rose-600' : 'from-amber-500 to-orange-600' },
        ].map((m, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">{m.label}</div>
                <div className="text-2xl font-bold">{m.value}</div>
                {m.change !== 0 && <div className={`text-xs font-medium mt-1 ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{m.change >= 0 ? '+' : ''}{m.change.toFixed(1)}% MoM</div>}
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white`}>{m.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cash Flow Forecast */}
      <Card>
        <h3 className="font-semibold mb-1">Cash Flow Forecast</h3>
        <p className="text-xs text-gray-500 mb-4">AI-projected 6-month financial outlook</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="cfoRevG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
            <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#cfoRevG)" strokeWidth={2.5} strokeDasharray="5 5" name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Profit" />
            <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Risks */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Financial Risk Assessment</h3>
          {risks.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30"><ShieldCheck className="w-6 h-6 text-green-500" /><div><div className="text-sm font-semibold text-green-700 dark:text-green-300">No Critical Risks</div><div className="text-xs text-gray-500">Financials are healthy</div></div></div>
          ) : (
            <div className="space-y-3">
              {risks.map((r, i) => (
                <div key={i} className={`p-3 rounded-xl border ${r.level === 'high' ? 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10' : 'border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.level === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>{r.level.toUpperCase()}</span>
                    <span className="text-sm font-semibold">{r.title}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.detail}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Budget Recommendations */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-nexora-500" /> Budget Allocation</h3>
          <div className="space-y-3">
            {budgetRec.map((b, i) => {
              const diff = b.recommended - b.current;
              return (
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{b.category}</span>
                    <span className={`text-xs font-bold ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {diff > 0 ? '↑' : diff < 0 ? '↓' : '='} ${Math.abs(diff).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Current: ${b.current.toLocaleString()}</span>
                    <span>Recommended: ${b.recommended.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{b.note}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* CFO Executive Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-emerald-500/10 to-teal-500/10 dark:from-nexora-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0"><DollarSign className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">🧠 CFO Executive Brief</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Revenue is at <strong>${(e?.revenue || 0).toLocaleString()}/mo</strong> with <strong>{margin.toFixed(1)}%</strong> margin ({margin >= bench.avgMargin ? 'above' : 'below'} {bench.industry} avg of {bench.avgMargin}%).
              {risks.length > 0 ? ` ${risks.length} financial risk${risks.length > 1 ? 's' : ''} require attention.` : ' No critical risks detected.'}
              {totalLeakLoss > 0 && ` Profit leaks total $${totalLeakLoss.toLocaleString()}/mo — fixing these is the highest-ROI action.`}
              {' '}Based on {milestones.length} tracked milestones, the business trajectory is {growth.profitGrowth > 5 ? 'strongly positive' : growth.profitGrowth > 0 ? 'moderately positive' : 'concerning'}.
            </p>
            <button onClick={() => onNavigate('plans')} className="text-sm font-semibold text-nexora-600 dark:text-nexora-400 mt-2 hover:underline inline-flex items-center gap-1">View Action Plans <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}
