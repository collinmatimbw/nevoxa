import { useState } from 'react';
import Card from '../components/ui/Card';
import { Target, StopCircle, CheckCircle, Wrench, Zap, Rocket, ChevronRight } from 'lucide-react';

export default function FocusEngine() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All', icon: <Target className="w-4 h-4" />, color: 'nexora' },
    { key: 'stop', label: 'Stop Doing', icon: <StopCircle className="w-4 h-4" />, color: 'red', emoji: '🛑' },
    { key: 'keep', label: 'Keep Doing', icon: <CheckCircle className="w-4 h-4" />, color: 'green', emoji: '✅' },
    { key: 'improve', label: 'Improve', icon: <Wrench className="w-4 h-4" />, color: 'amber', emoji: '🔧' },
    { key: 'automate', label: 'Automate', icon: <Zap className="w-4 h-4" />, color: 'blue', emoji: '⚡' },
    { key: 'scale', label: 'Scale', icon: <Rocket className="w-4 h-4" />, color: 'purple', emoji: '🚀' },
  ];

  const colorMap: Record<string, { card: string; badge: string; bg: string; headerBg: string }> = {
    stop: {
      card: 'border-red-200 dark:border-red-900/30',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      bg: 'bg-red-50/50 dark:bg-red-950/10',
      headerBg: 'bg-red-500',
    },
    keep: {
      card: 'border-green-200 dark:border-green-900/30',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      bg: 'bg-green-50/50 dark:bg-green-950/10',
      headerBg: 'bg-green-500',
    },
    improve: {
      card: 'border-amber-200 dark:border-amber-900/30',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50/50 dark:bg-amber-950/10',
      headerBg: 'bg-amber-500',
    },
    automate: {
      card: 'border-blue-200 dark:border-blue-900/30',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50/50 dark:bg-blue-950/10',
      headerBg: 'bg-blue-500',
    },
    scale: {
      card: 'border-purple-200 dark:border-purple-900/30',
      badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      bg: 'bg-purple-50/50 dark:bg-purple-950/10',
      headerBg: 'bg-purple-500',
    },
  };

  const renderCategory = (key: string) => {
    const items: Array<{ id: number; action: string; impact: string; priority: string }> = [];
    const cat = categories.find(c => c.key === key)!;
    const colors = colorMap[key];
    
    return (
      <div key={key} className={`rounded-2xl border ${colors.card} overflow-hidden`}>
        <div className={`${colors.headerBg} px-4 py-3 flex items-center gap-2`}>
          <span className="text-lg">{cat.emoji}</span>
          <h3 className="font-semibold text-white text-sm">{cat.label}</h3>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">{items.length}</span>
        </div>
        <div className={`${colors.bg} p-4 space-y-3`}>
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/40 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{item.action}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.badge}`}>
                      {item.impact}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      item.priority === 'high' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const allKeys = ['stop', 'keep', 'improve', 'automate', 'scale'] as const;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
          <Target className="w-6 h-6 text-nexora-500" />
          Focus Engine
        </h1>
        <p className="text-sm text-gray-500 mt-1">AI-categorized recommendations to optimize your business</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {allKeys.map(key => {
          const items: Array<any> = [];
          const cat = categories.find(c => c.key === key)!;
          return (
            <Card key={key} hover padding="sm">
              <div className="text-center">
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-lg font-bold">{items.length}</div>
                <div className="text-xs text-gray-500">{cat.label}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === cat.key
                ? 'bg-nexora-100 dark:bg-nexora-900/40 text-nexora-700 dark:text-nexora-300 border border-nexora-200 dark:border-nexora-800'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {allKeys.map(key => renderCategory(key))}
        </div>
      ) : (
        <div className="max-w-2xl">
          {renderCategory(activeTab)}
        </div>
      )}

      {/* AI Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">AI Focus Summary</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              No focus items yet. Add recommendations from other modules to see your AI-generated priority summary here.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
