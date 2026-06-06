import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { usePlatform } from '../contexts/PlatformContext';
import { Users, Plus, Trash2, Shield, Clock, X, Mail, Activity } from 'lucide-react';
import getInitials from '../utils/getInitials';

export default function TeamPage() {
  const { team, addTeamMember, removeTeamMember, updateMemberRole, activityLog, subscription } = usePlatform();
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'analyst' as any });

  const roleColors: Record<string, string> = { owner: 'bg-nexora-100 dark:bg-nexora-900/30 text-nexora-700 dark:text-nexora-400', admin: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', manager: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', analyst: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' };

  const handleInvite = () => {
    if (!form.name || !form.email) return;
    addTeamMember({ name: form.name, email: form.email, role: form.role });
    setForm({ name: '', email: '', role: 'analyst' }); setShowInvite(false);
  };

  const timeSince = (d: string) => { if (!d) return 'Never'; const s = (Date.now() - new Date(d).getTime()) / 1000; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Users className="w-6 h-6 text-nexora-500" /> Team</h1><p className="text-sm text-gray-500 mt-1">Manage your team, roles, and permissions</p></div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{team.filter(t=>t.status==='active').length}/{subscription.seats} seats</span>
          <Button size="sm" onClick={() => setShowInvite(true)}><Plus className="w-4 h-4" /> Invite</Button>
        </div>
      </div>

      {showInvite && (
        <Card className="!border-nexora-200 dark:!border-nexora-800/50">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Invite Team Member</h3><button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={form.name} onChange={ev => setForm(p => ({...p, name: ev.target.value}))} placeholder="Full name" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-nexora-500" />
            <input type="email" value={form.email} onChange={ev => setForm(p => ({...p, email: ev.target.value}))} placeholder="Email" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-nexora-500" />
            <select value={form.role} onChange={ev => setForm(p => ({...p, role: ev.target.value}))} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none">
              <option value="admin">Admin</option><option value="manager">Manager</option><option value="analyst">Analyst</option><option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4"><Button size="sm" onClick={handleInvite}><Mail className="w-4 h-4" /> Send Invite</Button><Button size="sm" variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button></div>
        </Card>
      )}

      {/* Members */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-200/60 dark:border-gray-700/40">{['Member', 'Role', 'Status', 'Last Active', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 py-3 px-4">{h}</th>)}</tr></thead>
            <tbody>
              {team.map(m => (
                <tr key={m.id} className="border-b border-gray-100 dark:border-gray-700/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">{getInitials(m.name)}</div><div><div className="text-sm font-medium">{m.name}</div><div className="text-xs text-gray-500">{m.email}</div></div></div></td>
                  <td className="py-3 px-4">
                    {m.role === 'owner' ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColors.owner}`}>OWNER</span> : (
                      <select value={m.role} onChange={ev => updateMemberRole(m.id, ev.target.value as any)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none">
                        <option value="admin">Admin</option><option value="manager">Manager</option><option value="analyst">Analyst</option><option value="viewer">Viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>{m.status.toUpperCase()}</span></td>
                  <td className="py-3 px-4 text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{timeSince(m.lastActive)}</td>
                  <td className="py-3 px-4">{m.role !== 'owner' && <button onClick={() => removeTeamMember(m.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permissions */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-gray-400" /> Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-200/60 dark:border-gray-700/40"><th className="text-left py-2 px-3 text-gray-500">Permission</th>{['Owner','Admin','Manager','Analyst','Viewer'].map(r=><th key={r} className="text-center py-2 px-3 text-gray-500">{r}</th>)}</tr></thead>
            <tbody>
              {[['View Dashboard','✓','✓','✓','✓','✓'],['Run Simulations','✓','✓','✓','✓','—'],['Edit Goals','✓','✓','✓','—','—'],['Generate Reports','✓','✓','✓','✓','—'],['Manage Team','✓','✓','—','—','—'],['Billing & Plans','✓','—','—','—','—'],['Delete Data','✓','—','—','—','—']].map((row,i)=>(
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700/20"><td className="py-2 px-3 font-medium">{row[0]}</td>{row.slice(1).map((v,j)=><td key={j} className={`text-center py-2 px-3 ${v==='✓'?'text-green-500':'text-gray-300'}`}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity Log */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-gray-400" /> Recent Activity</h3>
        <div className="space-y-2">
          {activityLog.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-nexora-100 dark:bg-nexora-900/30 flex items-center justify-center text-[10px] font-bold text-nexora-600 dark:text-nexora-400">{getInitials(a.userName)}</div>
              <div className="flex-1 min-w-0"><span className="text-sm"><strong>{a.userName}</strong> {a.action}</span><div className="text-xs text-gray-400">{a.detail}</div></div>
              <span className="text-[10px] text-gray-400 shrink-0">{timeSince(a.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
