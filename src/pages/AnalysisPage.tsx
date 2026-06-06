import { useState } from 'react';
import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Brain, AlertTriangle, ChevronDown, ChevronUp, Database } from 'lucide-react';

export default function AnalysisPage() {
  const { entries, currentAnalysis } = useBusiness();
  const [expandedLeak, setExpandedLeak] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mb-6">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-2">No Data Yet</h2>
        <p className="text-gray-500">Add your business data to see AI-powered analysis including profit scores, leaks, and action plans.</p>
      </div>
    );
  }

  const scoreBreakdown = currentAnalysis?.profitScoreBreakdown;
  const radarData = scoreBreakdown ? [
    { subject: 'Pricing', score: scoreBreakdown.pricing.score, fullMark: 100 },
    { subject: 'Marketing', score: scoreBreakdown.marketing.score, fullMark: 100 },
    { subject: 'Operations', score: scoreBreakdown.operations.score, fullMark: 100 },
    { subject: 'Retention', score: scoreBreakdown.retention.score, fullMark: 100 },
    { subject: 'Cash Flow', score: scoreBreakdown.cashFlow.score, fullMark: 100 },
    { subject: 'Growth', score: scoreBreakdown.growth.score, fullMark: 100 },
    { subject: 'Profitability', score: scoreBreakdown.profitability.score, fullMark: 100 },
  ] : [];

  const scoreCats = scoreBreakdown ? [
    { name: 'Pricing', score: scoreBreakdown.pricing.score, explanation: scoreBreakdown.pricing.explanation, icon: '💰' },
    { name: 'Marketing', score: scoreBreakdown.marketing.score, explanation: scoreBreakdown.marketing.explanation, icon: '📢' },
    { name: 'Operations', score: scoreBreakdown.operations.score, explanation: scoreBreakdown.operations.explanation, icon: '⚙️' },
    { name: 'Retention', score: scoreBreakdown.retention.score, explanation: scoreBreakdown.retention.explanation, icon: '🔄' },
    { name: 'Cash Flow', score: scoreBreakdown.cashFlow.score, explanation: scoreBreakdown.cashFlow.explanation, icon: '💵' },
    { name: 'Growth', score: scoreBreakdown.growth.score, explanation: scoreBreakdown.growth.explanation, icon: '📈' },
    { name: 'Profitability', score: scoreBreakdown.profitability.score, explanation: scoreBreakdown.profitability.explanation, icon: '⚡' },
  ] : [];

  const leaks = currentAnalysis?.leaks || [];
  const totalLeakLoss = leaks.reduce((s, l) => s + l.estimatedLoss, 0);
  const opportunities = currentAnalysis?.opportunities || [];

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
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Business Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered deep analysis of your business performance</p>
      </div>

      {/* Profit Score Detailed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-nexora-500" />
            <h3 className="font-semibold">Profit Score Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:opacity-30" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Category Details</h3>
          <div className="space-y-4">
            {scoreCats.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.name}
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${getScoreBg(cat.score)}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{cat.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Profit Leaks Full */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold">All Profit Leaks</h3>
          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold ml-auto">
            Total Impact: -${(totalLeakLoss * 12).toLocaleString()}/yr
          </span>
        </div>
        {leaks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No profit leaks detected. Great job!</p>
        ) : (
          <div className="space-y-3">
            {leaks.map((leak) => (
              <div key={leak.id} className="border border-gray-200/60 dark:border-gray-700/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedLeak(expandedLeak === leak.id ? null : leak.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      leak.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      leak.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>{leak.impact.toUpperCase()}</span>
                    <span className="text-sm font-medium text-left">{leak.problem}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-red-500">-${leak.estimatedLoss.toLocaleString()}/mo</span>
                    {expandedLeak === leak.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {expandedLeak === leak.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700/30">
                    <div className="p-3 rounded-lg bg-nexora-50 dark:bg-nexora-950/30 mt-3">
                      <div className="text-xs font-semibold text-nexora-700 dark:text-nexora-300 mb-1">💡 AI Recommendation</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{leak.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Opportunities */}
      <Card>
        <h3 className="font-semibold mb-6">Growth Opportunities</h3>
        {opportunities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No opportunities identified yet.</p>
        ) : (
          <div className="space-y-3">
            {opportunities.slice(0, 6).map(op => (
              <div key={op.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{op.category === 'revenue' ? '💰' : op.category === 'pricing' ? '🏷️' : op.category === 'marketing' ? '📢' : op.category === 'retention' ? '🔄' : '✂️'}</span>
                  <div>
                    <div className="text-sm font-medium">{op.title}</div>
                    <div className="text-xs text-gray-500">{op.timeToResults} · {op.ease}</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-500">+${op.potentialImpact.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      {currentAnalysis && (
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-nexora-500" /> AI Summary</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{currentAnalysis.summary}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
              <div className="text-lg font-bold text-nexora-500">{currentAnalysis.profitScore}</div>
              <div className="text-[10px] text-gray-500">Profit Score</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
              <div className="text-lg font-bold text-green-500">+{currentAnalysis.revenueGrowth.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-500">Revenue Growth</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
              <div className="text-lg font-bold text-red-500">{currentAnalysis.expenseGrowth.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-500">Expense Growth</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
              <div className="text-lg font-bold text-nexora-500">{currentAnalysis.profitMargin.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-500">Profit Margin</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
