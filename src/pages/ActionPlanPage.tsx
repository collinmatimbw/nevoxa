import { useState } from 'react';
import Card from '../components/ui/Card';
import { useBusiness, ActionPlanItem } from '../contexts/BusinessContext';
import { Calendar, Clock, Zap, ChevronDown, ChevronUp, Target, Rocket, Map } from 'lucide-react';

export default function ActionPlanPage() {
  const { getActionPlan, getIndustryBenchmark } = useBusiness();
  const plan = getActionPlan();
  const bench = getIndustryBenchmark();
  const [activeTab, setActiveTab] = useState<'sevenDay' | 'thirtyDay' | 'ninetyDay' | 'longTerm'>('sevenDay');
  const [expanded, setExpanded] = useState<string | null>(null);

  const tabs = [
    { key: 'sevenDay' as const, label: '7-Day Plan', icon: <Zap className="w-4 h-4" />, desc: 'Quick wins & immediate improvements', emoji: '⚡' },
    { key: 'thirtyDay' as const, label: '30-Day Plan', icon: <Calendar className="w-4 h-4" />, desc: 'Operational optimization', emoji: '📅' },
    { key: 'ninetyDay' as const, label: '90-Day Plan', icon: <Target className="w-4 h-4" />, desc: 'Growth initiatives', emoji: '🎯' },
    { key: 'longTerm' as const, label: 'Long-Term Roadmap', icon: <Map className="w-4 h-4" />, desc: '6-24 month strategy', emoji: '🗺️' },
  ];

  const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    high: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };
  const difficultyColors: Record<string, string> = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-amber-600 dark:text-amber-400',
    hard: 'text-red-600 dark:text-red-400',
  };

  const items = plan[activeTab];
  const currentTab = tabs.find(t => t.key === activeTab)!;

  const renderItem = (item: ActionPlanItem, i: number) => {
    const isExpanded = expanded === item.id;
    return (
      <div key={item.id} className="border border-gray-200/60 dark:border-gray-700/40 rounded-xl overflow-hidden bg-white dark:bg-gray-800/80">
        <button onClick={() => setExpanded(isExpanded ? null : item.id)} className="w-full p-4 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors text-left">
          <div className="w-7 h-7 rounded-lg bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-xs font-bold text-nexora-600 dark:text-nexora-400 shrink-0 mt-0.5">{i + 1}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{item.task}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColors[item.priority]}`}>{item.priority.toUpperCase()}</span>
              <span className="text-[10px] text-gray-400">{item.category}</span>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Impact</div>
                <div className="text-xs font-semibold text-green-600 dark:text-green-400">{item.expectedImpact}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Difficulty</div>
                <div className={`text-xs font-semibold capitalize ${difficultyColors[item.difficulty]}`}>{item.difficulty}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Time Needed</div>
                <div className="text-xs font-semibold">{item.estimatedTime}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Category</div>
                <div className="text-xs font-semibold">{item.category}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Rocket className="w-6 h-6 text-nexora-500" /> Action Plan Generator</h1>
        <p className="text-sm text-gray-500 mt-1">AI-generated action plans tailored to {bench.industry} industry benchmarks</p>
      </div>

      {/* Tab Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTab === t.key ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600'}`}>
            <div className="text-2xl mb-2">{t.emoji}</div>
            <div className="text-sm font-semibold">{t.label}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
            <div className="text-xs font-bold text-nexora-600 dark:text-nexora-400 mt-1">{plan[t.key].length} tasks</div>
          </button>
        ))}
      </div>

      {/* Active Plan Header */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentTab.emoji}</div>
          <div>
            <h2 className="font-semibold text-nexora-700 dark:text-nexora-300">{currentTab.label}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentTab.desc} — {items.length} prioritized tasks for your {bench.industry} business</p>
          </div>
        </div>
      </Card>

      {/* Plan Items */}
      <div className="space-y-3">
        {items.map((item, i) => renderItem(item, i))}
      </div>

      {/* Summary */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" /> Plan Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
            <div className="text-lg font-bold text-red-600">{items.filter(i => i.priority === 'critical').length}</div>
            <div className="text-[10px] text-gray-500">Critical Tasks</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30">
            <div className="text-lg font-bold text-amber-600">{items.filter(i => i.priority === 'high').length}</div>
            <div className="text-[10px] text-gray-500">High Priority</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30">
            <div className="text-lg font-bold text-green-600">{items.filter(i => i.difficulty === 'easy').length}</div>
            <div className="text-[10px] text-gray-500">Easy Wins</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-nexora-50 dark:bg-nexora-950/10 border border-nexora-100 dark:border-nexora-900/30">
            <div className="text-lg font-bold text-nexora-600">{items.length}</div>
            <div className="text-[10px] text-gray-500">Total Tasks</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
