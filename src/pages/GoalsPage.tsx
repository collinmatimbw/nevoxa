import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useBusiness } from '../contexts/BusinessContext';
import { Target, Plus, Trash2, CheckCircle2, Clock, TrendingUp, AlertTriangle, X } from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, currentEntry } = useBusiness();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'revenue' as any, targetValue: '', unit: '$', deadline: '' });

  const handleAdd = () => {
    if (!form.title || !form.targetValue || !form.deadline) return;
    const currentVal = form.type === 'revenue' ? (currentEntry?.revenue || 0) : form.type === 'profit' ? ((currentEntry?.profit || 0) / (currentEntry?.revenue || 1) * 100) : form.type === 'expenses' ? (currentEntry?.expenses || 0) : form.type === 'retention' ? (currentEntry?.customerCount || 0) : 0;
    addGoal({ title: form.title, type: form.type, targetValue: Number(form.targetValue), currentValue: currentVal, unit: form.unit, deadline: form.deadline });
    setForm({ title: '', type: 'revenue', targetValue: '', unit: '$', deadline: '' });
    setShowAdd(false);
  };

  const getProgress = (g: typeof goals[0]) => {
    if (g.type === 'expenses') return g.targetValue > 0 ? Math.min(100, Math.max(0, ((g.currentValue - g.targetValue) / (g.currentValue)) * 100)) : 0;
    return g.targetValue > 0 ? Math.min(100, (g.currentValue / g.targetValue) * 100) : 0;
  };

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Target className="w-6 h-6 text-nexora-500" /> Business Goals</h1>
          <p className="text-sm text-gray-500 mt-1">Set targets and track your progress automatically</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> New Goal</Button>
      </div>

      {/* Add Goal Modal */}
      {showAdd && (
        <Card className="!border-nexora-200 dark:!border-nexora-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Create New Goal</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Goal Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Reach $100K monthly revenue" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none">
                <option value="revenue">Revenue</option><option value="profit">Profit Margin</option><option value="expenses">Expenses</option><option value="retention">Customers</option><option value="growth">Growth Rate</option><option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Target Value</label>
              <input type="number" value={form.targetValue} onChange={e => setForm(p => ({ ...p, targetValue: e.target.value }))} placeholder="100000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Unit</label>
              <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none">
                <option value="$">$</option><option value="%">%</option><option value="customers">Customers</option><option value="units">Units</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4"><Button size="sm" onClick={handleAdd}>Create Goal</Button><Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button></div>
        </Card>
      )}

      {/* Active Goals */}
      <div className="space-y-4">
        {activeGoals.length === 0 && !showAdd && (
          <Card className="text-center py-12">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No active goals</h3>
            <p className="text-sm text-gray-500 mb-4">Set your first business goal to start tracking progress</p>
            <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Create Goal</Button>
          </Card>
        )}
        {activeGoals.map(g => {
          const progress = getProgress(g);
          const days = getDaysRemaining(g.deadline);
          const isOnTrack = progress >= (1 - days / 365) * 100 * 0.8;
          return (
            <Card key={g.id} hover>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${progress >= 100 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-nexora-100 dark:bg-nexora-900/30'}`}>
                  {progress >= 100 ? '🎉' : g.type === 'revenue' ? '💰' : g.type === 'profit' ? '📈' : g.type === 'expenses' ? '✂️' : g.type === 'retention' ? '🔄' : '🎯'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{g.title}</h4>
                    <div className="flex items-center gap-2">
                      {progress >= 100 ? (
                        <button onClick={() => updateGoal(g.id, { status: 'completed' })} className="text-xs text-green-600 font-medium hover:underline">Mark Complete</button>
                      ) : (
                        <span className={`flex items-center gap-1 text-xs font-medium ${isOnTrack ? 'text-green-500' : 'text-amber-500'}`}>
                          {isOnTrack ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {isOnTrack ? 'On track' : 'Behind'}
                        </span>
                      )}
                      <button onClick={() => deleteGoal(g.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Current: <strong>{g.unit === '$' ? `$${g.currentValue.toLocaleString()}` : `${g.currentValue.toLocaleString()} ${g.unit}`}</strong></span>
                    <span>Target: <strong>{g.unit === '$' ? `$${g.targetValue.toLocaleString()}` : `${g.targetValue.toLocaleString()} ${g.unit}`}</strong></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{days} days left</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{progress.toFixed(1)}% complete</span>
                      <span className="text-xs text-gray-400">{g.unit === '$' ? `$${(g.targetValue - g.currentValue).toLocaleString()} remaining` : `${(g.targetValue - g.currentValue).toFixed(1)} ${g.unit} remaining`}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all duration-700 ${progress >= 100 ? 'bg-green-500' : progress >= 60 ? 'bg-nexora-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Completed ({completedGoals.length})</h3>
          <div className="space-y-2">
            {completedGoals.map(g => (
              <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium flex-1">{g.title}</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Achieved ✓</span>
                <button onClick={() => deleteGoal(g.id)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
