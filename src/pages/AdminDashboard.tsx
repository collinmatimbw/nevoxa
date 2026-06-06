import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth, PLAN_PRICES } from '../contexts/AuthContext';
import { Shield, Users, DollarSign, TrendingUp, Check, X, Clock, Edit2 } from 'lucide-react';

export default function AdminDashboard() {
  const { trackedUsers, approvePayment, rejectPayment, changeUserPlan } = useAuth();
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const totalRevenue = trackedUsers.reduce((s, u) => s + (PLAN_PRICES[u.plan] || 0), 0);
  const totalLogins = trackedUsers.reduce((s, u) => s + u.loginCount, 0);
  const pendingPayments = trackedUsers.filter(u => u.paymentStatus === 'pending');

  const plans: ('free' | 'pro' | 'business' | 'enterprise')[] = ['free', 'pro', 'business', 'enterprise'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Track registered users, subscriptions, payments, and revenue</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Total Users</div>
              <div className="text-2xl font-bold">{trackedUsers.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Monthly Revenue</div>
              <div className="text-2xl font-bold">${totalRevenue}/mo</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Total Logins</div>
              <div className="text-2xl font-bold">{totalLogins}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Active Subscribers</div>
              <div className="text-2xl font-bold">{trackedUsers.filter(u => u.plan !== 'free').length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending Payment Approvals
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold ml-2">{pendingPayments.length}</span>
          </h3>
          <div className="space-y-3">
            {pendingPayments.map(u => (
              <div key={u.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-semibold text-sm">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-gray-500">Plan: <strong className="text-nexora-600 dark:text-nexora-400 capitalize">{u.selectedPlan}</strong></span>
                    <span className="text-gray-500">Amount: <strong className="text-green-600">${PLAN_PRICES[u.selectedPlan]}/mo</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => approvePayment(u.email)} size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                    <Check className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <button onClick={() => rejectPayment(u.email)} className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/30 transition-colors">
                    <X className="w-3.5 h-3.5 inline mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <h3 className="font-semibold mb-4">Registered Users</h3>
        {trackedUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No users registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/60 dark:border-gray-700/40">
                  {['Name', 'Email', 'Password', 'Company', 'Plan', 'Revenue', 'Payment', 'Registered', 'Last Login', 'Logins'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 py-3 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trackedUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                    <td className="py-3 px-3 text-sm font-medium">{u.name}</td>
                    <td className="py-3 px-3 text-sm">{u.email}</td>
                    <td className="py-3 px-3 text-sm font-mono text-gray-500">{u.password}</td>
                    <td className="py-3 px-3 text-sm">{u.company}</td>
                    <td className="py-3 px-3">
                      {editingUser === u.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={u.plan}
                            onChange={e => { changeUserPlan(u.email, e.target.value as any); setEditingUser(null); }}
                            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none focus:ring-2 focus:ring-nexora-500"
                            autoFocus
                          >
                            {plans.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                          </select>
                          <button onClick={() => setEditingUser(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.plan === 'enterprise' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            u.plan === 'business' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            u.plan === 'pro' ? 'bg-nexora-100 dark:bg-nexora-900/30 text-nexora-700 dark:text-nexora-400' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>{u.plan.toUpperCase()}</span>
                          <button onClick={() => setEditingUser(u.id)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Change plan">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-green-500">${PLAN_PRICES[u.plan]}/mo</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.paymentStatus === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        u.paymentStatus === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        u.paymentStatus === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>{u.paymentStatus.toUpperCase()}</span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">{new Date(u.registeredAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-xs text-gray-500">{new Date(u.lastLogin).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-sm font-medium">{u.loginCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
