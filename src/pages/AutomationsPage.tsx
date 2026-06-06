import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { usePlatform } from '../contexts/PlatformContext';
import { Zap, Plus, Clock, Play, Pause, X } from 'lucide-react';

export default function AutomationsPage() {
  const { automations, toggleAutomation, addAutomation } = usePlatform();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', trigger: '', action: '', frequency: 'weekly' as any });

  const handleAdd = () => {
    if (!form.name || !form.trigger || !form.action) return;
    addAutomation({ ...form, enabled: true }); setForm({ name: '', trigger: '', action: '', frequency: 'weekly' }); setShowAdd(false);
  };
  const timeSince = (d?: string) => { if (!d) return '—'; const s = (Date.now() - new Date(d).getTime()) / 1000; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };

  const enabled = automations.filter(a => a.enabled).length;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Zap className="w-6 h-6 text-nexora-500" /> Automations</h1><p className="text-sm text-gray-500 mt-1">Automate reports, alerts, and monitoring</p></div>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> New Rule</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm" hover><div className="text-center"><div className="text-2xl font-bold text-nexora-500">{automations.length}</div><div className="text-xs text-gray-500">Total Rules</div></div></Card>
        <Card padding="sm" hover><div className="text-center"><div className="text-2xl font-bold text-green-500">{enabled}</div><div className="text-xs text-gray-500">Active</div></div></Card>
        <Card padding="sm" hover><div className="text-center"><div className="text-2xl font-bold text-gray-400">{automations.length - enabled}</div><div className="text-xs text-gray-500">Paused</div></div></Card>
      </div>

      {showAdd && (
        <Card className="!border-nexora-200 dark:!border-nexora-800/50">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Create Automation Rule</h3><button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={ev => setForm(p => ({...p, name: ev.target.value}))} placeholder="Rule name" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-nexora-500" />
            <select value={form.frequency} onChange={ev => setForm(p => ({...p, frequency: ev.target.value}))} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
            <input value={form.trigger} onChange={ev => setForm(p => ({...p, trigger: ev.target.value}))} placeholder="Trigger (e.g., Every Monday 9am)" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-nexora-500" />
            <input value={form.action} onChange={ev => setForm(p => ({...p, action: ev.target.value}))} placeholder="Action (e.g., Send KPI report)" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-nexora-500" />
          </div>
          <div className="flex gap-2 mt-4"><Button size="sm" onClick={handleAdd}>Create Rule</Button><Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button></div>
        </Card>
      )}

      <div className="space-y-3">
        {automations.map(a => (
          <Card key={a.id} hover>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleAutomation(a.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${a.enabled ? 'bg-nexora-100 dark:bg-nexora-900/30 text-nexora-600 dark:text-nexora-400' : 'bg-gray-100 dark:bg-gray-700/30 text-gray-400'}`}>
                {a.enabled ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h4 className="text-sm font-semibold">{a.name}</h4><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{a.enabled ? 'ACTIVE' : 'PAUSED'}</span><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500">{a.frequency}</span></div>
                <p className="text-xs text-gray-500 mt-0.5"><span className="text-gray-400">Trigger:</span> {a.trigger}</p>
                <p className="text-xs text-gray-500"><span className="text-gray-400">Action:</span> {a.action}</p>
              </div>
              <div className="text-right shrink-0 text-xs text-gray-400">
                {a.lastRun && <div className="flex items-center gap-1"><Clock className="w-3 h-3" />Last: {timeSince(a.lastRun)}</div>}
                {a.nextRun && <div className="mt-0.5">Next: {new Date(a.nextRun).toLocaleDateString()}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
