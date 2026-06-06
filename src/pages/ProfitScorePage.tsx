import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Brain, Info, TrendingUp, TrendingDown } from 'lucide-react';

export default function ProfitScorePage() {
  const { currentAnalysis, analyses, getIndustryBenchmark } = useBusiness();
  const bench = getIndustryBenchmark();
  const breakdown = currentAnalysis?.profitScoreBreakdown;
  const score = breakdown?.overall || 0;

  const categories = breakdown ? [
    { name: 'Pricing', ...breakdown.pricing, icon: '💰' },
    { name: 'Marketing', ...breakdown.marketing, icon: '📢' },
    { name: 'Operations', ...breakdown.operations, icon: '⚙️' },
    { name: 'Retention', ...breakdown.retention, icon: '🔄' },
    { name: 'Cash Flow', ...breakdown.cashFlow, icon: '💵' },
    { name: 'Growth', ...breakdown.growth, icon: '📈' },
    { name: 'Profitability', ...breakdown.profitability, icon: '🏆' },
  ] : [];

  const radarData = categories.map(c => ({ subject: c.name, score: c.score, fullMark: 100 }));
  const scoreTrend = analyses.map(a => ({ date: new Date(a.date).toLocaleDateString('en-US', { month: 'short' }), score: a.profitScoreBreakdown?.overall || a.profitScore }));

  const getScoreColor = (s: number) => s >= 80 ? 'text-green-500' : s >= 60 ? 'text-amber-500' : 'text-red-500';
  const getScoreBg = (s: number) => s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';
  const getScoreLabel = (s: number) => s >= 85 ? 'Excellent' : s >= 75 ? 'Strong' : s >= 60 ? 'Good' : s >= 40 ? 'Needs Work' : 'Critical';

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Brain className="w-6 h-6 text-nexora-500" /> Nexora Profit Score</h1>
        <p className="text-sm text-gray-500 mt-1">AI-generated business health score based on {bench.industry} benchmarks</p>
      </div>

      {/* Score Hero */}
      <Card className="text-center">
        <div className="relative w-44 h-44 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-700" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${score * 2.64} 264`} />
            <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#86efac" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-xs text-gray-500">out of 100</span>
          </div>
        </div>
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)} ${score >= 80 ? 'bg-green-100 dark:bg-green-900/30' : score >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {getScoreLabel(score)}
        </div>
        <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">{currentAnalysis?.summary}</p>
      </Card>

      {/* Radar + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:opacity-30" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Category Details</h3>
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-2"><span>{cat.icon}</span>{cat.name}</span>
                  <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>{cat.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <div className={`h-2 rounded-full transition-all duration-700 ${getScoreBg(cat.score)}`} style={{ width: `${cat.score}%` }} />
                </div>
                <div className="flex items-start gap-1">
                  <Info className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">{cat.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Score Trend */}
      <Card>
        <h3 className="font-semibold mb-4">Score History</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={scoreTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Profit Score" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Improvement Areas */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-3">🧠 Areas to Improve</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.filter(c => c.score < 75).sort((a, b) => a.score - b.score).map((c, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/20">
              <TrendingDown className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div><div className="text-sm font-medium">{c.icon} {c.name} ({c.score}/100)</div><div className="text-xs text-gray-500 mt-0.5">{c.explanation}</div></div>
            </div>
          ))}
          {categories.filter(c => c.score < 75).length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"><TrendingUp className="w-4 h-4" /> All categories are performing well! 🎉</div>
          )}
        </div>
      </Card>
    </div>
  );
}
