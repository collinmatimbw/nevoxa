import { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { Target, StopCircle, CheckCircle, Wrench, ChevronRight, Brain, TrendingUp, TrendingDown } from 'lucide-react';

export default function FocusEngineV2() {
  const { allFocusItems, currentAnalysis, analyses } = useBusiness();
  const [activeTab, setActiveTab] = useState<'all' | 'stop' | 'keep' | 'improve'>('all');

  const stopItems = allFocusItems.filter(i => i.type === 'stop');
  const keepItems = allFocusItems.filter(i => i.type === 'keep');
  const improveItems = allFocusItems.filter(i => i.type === 'improve');

  const categories = [
    { key: 'all' as const, label: 'All Recommendations', icon: <Target className="w-4 h-4" />, count: allFocusItems.length },
    { key: 'stop' as const, label: 'Stop Doing', icon: <StopCircle className="w-4 h-4" />, count: stopItems.length, emoji: '🛑', color: 'red' },
    { key: 'keep' as const, label: 'Keep Doing', icon: <CheckCircle className="w-4 h-4" />, count: keepItems.length, emoji: '✅', color: 'green' },
    { key: 'improve' as const, label: 'Improve', icon: <Wrench className="w-4 h-4" />, count: improveItems.length, emoji: '🔧', color: 'amber' },
  ];

  const colorMap: Record<string, { headerBg: string; bg: string; badge: string; border: string }> = {
    stop: {
      headerBg: 'bg-red-500',
      bg: 'bg-red-50/50 dark:bg-red-950/10',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-900/30',
    },
    keep: {
      headerBg: 'bg-green-500',
      bg: 'bg-green-50/50 dark:bg-green-950/10',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-900/30',
    },
    improve: {
      headerBg: 'bg-amber-500',
      bg: 'bg-amber-50/50 dark:bg-amber-950/10',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-900/30',
    },
  };

  // Historical comparison
  const comparison = useMemo(() => {
    if (analyses.length < 2) return null;
    const curr = analyses[analyses.length - 1];
    const prev = analyses[analyses.length - 2];
    return {
      scoreDelta: curr.profitScore - prev.profitScore,
      leakDelta: curr.leaks.length - prev.leaks.length,
      lossDelta: curr.leaks.reduce((s, l) => s + l.estimatedLoss, 0) - prev.leaks.reduce((s, l) => s + l.estimatedLoss, 0),
    };
  }, [analyses]);

  const renderCategory = (type: 'stop' | 'keep' | 'improve', items: typeof allFocusItems) => {
    const cat = categories.find(c => c.key === type)!;
    const cm = colorMap[type];

    return (
      <div className={`rounded-2xl border ${cm.border} overflow-hidden`}>
        <div className={`${cm.headerBg} px-5 py-3.5 flex items-center gap-2`}>
          <span className="text-lg">{cat.emoji}</span>
          <h3 className="font-semibold text-white">{cat.label}</h3>
          <span className="ml-auto px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">{items.length}</span>
        </div>
        <div className={`${cm.bg} p-4 space-y-3`}>
          {items.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">No recommendations in this category</div>
          ) : items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/40 hover:shadow-md transition-all group">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed mb-2">{item.action}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.reasoning}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cm.badge}`}>{item.impact}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      item.priority === 'high' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      item.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-1 shrink-0 group-hover:text-nexora-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
          <Target className="w-6 h-6 text-nexora-500" />
          Focus Engine
        </h1>
        <p className="text-sm text-gray-500 mt-1">AI-categorized recommendations: what to stop, what's working, and what to improve</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: '🛑 Stop Doing', count: stopItems.length, sub: 'Wasting money/resources', color: 'text-red-500' },
          { label: '✅ Keep Doing', count: keepItems.length, sub: 'Performing well', color: 'text-green-500' },
          { label: '🔧 Improve', count: improveItems.length, sub: 'Needs optimization', color: 'text-amber-500' },
          { label: '📊 Profit Score', count: currentAnalysis?.profitScore || 0, sub: 'Overall health', color: 'text-nexora-500', suffix: '/100' },
          { label: '📈 Score Change', count: comparison?.scoreDelta || 0, sub: 'vs last period', color: (comparison?.scoreDelta || 0) >= 0 ? 'text-green-500' : 'text-red-500', prefix: (comparison?.scoreDelta || 0) >= 0 ? '+' : '' },
          { label: '🔍 Total Leaks', count: currentAnalysis?.leaks.length || 0, sub: 'Active issues', color: 'text-amber-500' },
        ].map((s, i) => (
          <Card key={i} padding="sm" hover>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.prefix || ''}{s.count}{s.suffix || ''}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Banner */}
      {comparison && (
        <Card className="!bg-gradient-to-r from-nexora-500/5 via-violet-500/5 to-fuchsia-500/5 dark:from-nexora-500/10 dark:via-violet-500/10 dark:to-fuchsia-500/10 !border-nexora-200/50 dark:!border-nexora-800/30">
          <div className="flex items-center gap-4 flex-wrap">
            <Brain className="w-5 h-5 text-nexora-500 shrink-0" />
            <span className="text-sm font-medium">Period-over-Period:</span>
            <div className="flex items-center gap-1 text-sm">
              {comparison.scoreDelta >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={comparison.scoreDelta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Score {comparison.scoreDelta >= 0 ? '+' : ''}{comparison.scoreDelta} pts
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {comparison.leakDelta <= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={comparison.leakDelta <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {Math.abs(comparison.leakDelta)} {comparison.leakDelta <= 0 ? 'fewer' : 'more'} leak{Math.abs(comparison.leakDelta) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {comparison.lossDelta <= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={comparison.lossDelta <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                ${Math.abs(comparison.lossDelta).toLocaleString()} {comparison.lossDelta <= 0 ? 'less' : 'more'} in losses
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === cat.key
                ? 'bg-nexora-100 dark:bg-nexora-900/40 text-nexora-700 dark:text-nexora-300 border border-nexora-200 dark:border-nexora-800'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {cat.icon}
            {cat.label}
            <span className="px-1.5 py-0.5 rounded-full bg-gray-200/80 dark:bg-gray-700 text-[10px] font-bold">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderCategory('stop', stopItems)}
          {renderCategory('keep', keepItems)}
          {renderCategory('improve', improveItems)}
        </div>
      ) : (
        <div className="max-w-2xl">
          {renderCategory(activeTab, activeTab === 'stop' ? stopItems : activeTab === 'keep' ? keepItems : improveItems)}
        </div>
      )}

      {/* AI Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">AI Focus Summary</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Based on your latest business data, Nexora identified <strong className="text-red-500">{stopItems.length} activities to stop</strong> (wasting resources),{' '}
              <strong className="text-green-500">{keepItems.length} activities to keep</strong> (performing well), and{' '}
              <strong className="text-amber-500">{improveItems.length} activities to improve</strong> (optimization opportunities).
              {stopItems.length > 0 && <> Priority: address the <strong>stop</strong> items first — they represent the fastest path to profit recovery.</>}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
