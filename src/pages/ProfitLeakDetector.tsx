import { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useBusiness } from '../contexts/BusinessContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, DollarSign, Filter, ChevronDown, ChevronUp, CheckCircle2, XCircle, Shield, Zap } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  revenue: '💰', expenses: '💸', operations: '⚙️', marketing: '📢', products: '📦', staffing: '👥',
};

export default function ProfitLeakDetector() {
  const { analyses, currentAnalysis, entries } = useBusiness();
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedLeak, setExpandedLeak] = useState<string | null>(null);

  const currentLeaks = currentAnalysis?.leaks || [];

  const filteredLeaks = currentLeaks.filter(l => {
    if (filterImpact !== 'all' && l.impact !== filterImpact) return false;
    if (filterCategory !== 'all' && l.category !== filterCategory) return false;
    return true;
  });

  const totalLoss = currentLeaks.reduce((s, l) => s + l.estimatedLoss, 0);
  const highCount = currentLeaks.filter(l => l.impact === 'high').length;
  const medCount = currentLeaks.filter(l => l.impact === 'medium').length;
  const lowCount = currentLeaks.filter(l => l.impact === 'low').length;

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    currentLeaks.forEach(l => {
      map.set(l.category, (map.get(l.category) || 0) + l.estimatedLoss);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [currentLeaks]);

  const PIE_COLORS = ['#22c55e', '#16a34a', '#4ade80', '#15803d', '#34d399', '#166534'];

  // Historical leak trend
  const leakTrend = useMemo(() => {
    return analyses.map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short' }),
      totalLoss: a.leaks.reduce((s, l) => s + l.estimatedLoss, 0),
      count: a.leaks.length,
    }));
  }, [analyses]);

  const categories = Array.from(new Set(currentLeaks.map(l => l.category)));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Profit Leak Detector
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered detection of inefficiencies, waste, and missed revenue across your business
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!border-red-200 dark:!border-red-900/30 !bg-red-50/50 dark:!bg-red-950/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">Total Estimated Losses</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">${totalLoss.toLocaleString()}<span className="text-sm font-medium opacity-60">/mo</span></div>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg">🔴</div>
            <div>
              <div className="text-xs text-gray-500 font-medium">High Impact</div>
              <div className="text-2xl font-bold">{highCount}</div>
              <div className="text-[10px] text-red-500 font-medium">Needs immediate action</div>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg">🟡</div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Medium Impact</div>
              <div className="text-2xl font-bold">{medCount}</div>
              <div className="text-[10px] text-amber-500 font-medium">Schedule for this month</div>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">🔵</div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Low Impact</div>
              <div className="text-2xl font-bold">{lowCount}</div>
              <div className="text-[10px] text-blue-500 font-medium">Review when convenient</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Leak Trend Over Time</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly estimated losses from detected profit leaks</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leakTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="totalLoss" fill="#ef4444" radius={[6, 6, 0, 0]} name="Est. Loss" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Losses by Category</h3>
          <p className="text-xs text-gray-500 mb-4">Where your business is leaking the most money</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="capitalize text-gray-600 dark:text-gray-400">{CATEGORY_ICONS[d.name] || '📊'} {d.name}</span>
                  </div>
                  <span className="font-semibold text-red-500">${d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        <select
          value={filterImpact}
          onChange={e => setFilterImpact(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none"
        >
          <option value="all">All Impacts</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c] || '📊'} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filteredLeaks.length} leak{filteredLeaks.length !== 1 ? 's' : ''} shown</span>
      </div>

      {/* Leak List */}
      <div className="space-y-3">
        {filteredLeaks.length === 0 ? (
          <Card className="text-center py-12">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">No leaks match your filters</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or — congratulations, your business might be leak-free! 🎉</p>
          </Card>
        ) : filteredLeaks.map(leak => (
          <div key={leak.id} className="border border-gray-200/60 dark:border-gray-700/40 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/80">
            <button
              onClick={() => setExpandedLeak(expandedLeak === leak.id ? null : leak.id)}
              className="w-full p-5 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors text-left"
            >
              <div className="text-2xl">{CATEGORY_ICONS[leak.category] || '📊'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    leak.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    leak.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>{leak.impact} impact</span>
                  <span className="text-xs text-gray-400 capitalize">{leak.category}</span>
                </div>
                <p className="text-sm font-medium">{leak.problem}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-red-500">-${leak.estimatedLoss.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500">per month</div>
              </div>
              {expandedLeak === leak.id ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>

            {expandedLeak === leak.id && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/30">
                <div className="mt-4 p-4 rounded-xl bg-nexora-50 dark:bg-nexora-950/30 border border-nexora-100 dark:border-nexora-900/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-nexora-500" />
                    <span className="text-xs font-bold text-nexora-700 dark:text-nexora-300 uppercase tracking-wider">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{leak.recommendation}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-center">
                    <div className="text-xs text-gray-500 mb-1">Annual Impact</div>
                    <div className="text-sm font-bold text-red-500">-${(leak.estimatedLoss * 12).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-center">
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-sm font-bold capitalize">{leak.category}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-center">
                    <div className="text-xs text-gray-500 mb-1">Detected</div>
                    <div className="text-sm font-bold">{new Date(leak.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="primary"><CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved</Button>
                  <Button size="sm" variant="ghost"><XCircle className="w-3.5 h-3.5" /> Dismiss</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">AI Leak Analysis Summary</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Nexora detected <strong>{currentLeaks.length} profit leaks</strong> totaling an estimated <strong className="text-red-500">${totalLoss.toLocaleString()}/month</strong> ({`$${(totalLoss * 12).toLocaleString()}/year`}).
              {highCount > 0 && <> The <strong>{highCount} high-impact</strong> issue{highCount !== 1 ? 's' : ''} should be addressed this week.</>}
              {' '}Resolving all identified leaks could improve your profit margin by approximately <strong className="text-green-500">{entries.length > 0 ? ((totalLoss / entries[entries.length - 1].revenue) * 100).toFixed(1) : '0'}%</strong>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
