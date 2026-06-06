import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, DollarSign, Clock, Zap, TrendingUp, ChevronRight } from 'lucide-react';

interface Props { onNavigate:(p:string)=>void }

export default function OpportunityEngine({ onNavigate: _onNavigate }: Props) {
  const { currentAnalysis, getIndustryBenchmark } = useBusiness();
  const bench = getIndustryBenchmark();
  const opportunities = currentAnalysis?.opportunities || [];
  const totalImpact = opportunities.reduce((s, o) => s + o.potentialImpact, 0);

  const chartData = opportunities.slice(0, 6).map(o => ({ name: o.title.substring(0, 20), impact: o.potentialImpact }));

  const easeColors: Record<string, string> = { easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', moderate: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
  const catIcons: Record<string, string> = { revenue: '💰', cost: '✂️', pricing: '🏷️', retention: '🔄', marketing: '📢' };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Sparkles className="w-6 h-6 text-nexora-500" /> Opportunity Engine</h1>
        <p className="text-sm text-gray-500 mt-1">AI-ranked opportunities to grow revenue, cut costs, and improve profitability</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="!bg-gradient-to-br from-nexora-500/10 to-violet-500/10 dark:from-nexora-500/20 dark:to-violet-500/20 !border-nexora-200 dark:!border-nexora-800/50">
          <div className="text-xs text-nexora-600 dark:text-nexora-400 font-medium mb-1">Total Potential Impact</div>
          <div className="text-2xl font-bold text-nexora-700 dark:text-nexora-300">${totalImpact.toLocaleString()}<span className="text-sm opacity-60">/mo</span></div>
        </Card>
        <Card hover padding="sm">
          <div className="text-xs text-gray-500 mb-1">Opportunities Found</div>
          <div className="text-2xl font-bold">{opportunities.length}</div>
          <div className="text-[10px] text-gray-400">Across {new Set(opportunities.map(o=>o.category)).size} categories</div>
        </Card>
        <Card hover padding="sm">
          <div className="text-xs text-gray-500 mb-1">Quick Wins</div>
          <div className="text-2xl font-bold text-green-500">{opportunities.filter(o=>o.ease==='easy').length}</div>
          <div className="text-[10px] text-gray-400">Easy to implement</div>
        </Card>
        <Card hover padding="sm">
          <div className="text-xs text-gray-500 mb-1">Industry</div>
          <div className="text-lg font-bold">{bench.industry}</div>
          <div className="text-[10px] text-gray-400">Benchmarks applied</div>
        </Card>
      </div>

      {/* Impact Chart */}
      <Card>
        <h3 className="font-semibold mb-4">Potential Impact by Opportunity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" width={120} />
            <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}/mo`} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="impact" fill="#22c55e" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Opportunity Cards */}
      <div className="space-y-4">
        {opportunities.map((op, i) => (
          <Card key={op.id} hover>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-lg shrink-0">{catIcons[op.category] || '📊'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                  <h4 className="text-sm font-semibold">{op.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${easeColors[op.ease]}`}>{op.ease.toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 capitalize">{op.category}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{op.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><DollarSign className="w-3.5 h-3.5" />${op.potentialImpact.toLocaleString()}/mo</span>
                  <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3.5 h-3.5" />{op.timeToResults}</span>
                  <span className="flex items-center gap-1 text-gray-500"><TrendingUp className="w-3.5 h-3.5" />Priority: {op.priority}/10</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
            </div>
          </Card>
        ))}
      </div>

      {/* Industry Tips */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-3 flex items-center gap-2"><Zap className="w-5 h-5" /> {bench.industry} Industry Intelligence</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bench.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-nexora-500 mt-0.5 shrink-0">💡</span> {tip}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span>Avg Margin: <strong>{bench.avgMargin}%</strong></span>
          <span>Avg Growth: <strong>{bench.avgGrowth}%</strong></span>
          <span>Avg Rev/Employee: <strong>${bench.avgRevenuePerEmployee.toLocaleString()}</strong></span>
        </div>
      </Card>
    </div>
  );
}
