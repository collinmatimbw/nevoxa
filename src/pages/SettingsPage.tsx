import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePlatform } from '../contexts/PlatformContext';
import { User, Building, Bell, Shield, CreditCard, Palette, Globe, Key } from 'lucide-react';
import getInitials from '../utils/getInitials';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { subscription } = usePlatform();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'company', label: 'Company', icon: <Building className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-nexora-50 dark:bg-nexora-950/50 text-nexora-700 dark:text-nexora-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <h3 className="font-semibold mb-4">Profile Information</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Role</label>
                    <input type="text" defaultValue="" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Timezone</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button size="sm">Save Changes</Button>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'company' && (
            <Card>
              <h3 className="font-semibold mb-4">Company Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Company Name</label>
                  <input type="text" defaultValue={user?.company || ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Industry</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                    <option>SaaS</option>
                    <option>E-commerce</option>
                    <option>Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Company Size</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                    <option>11-50 employees</option>
                    <option>1-10 employees</option>
                    <option>51-200 employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Currency</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <Button size="sm">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Profit drop alerts', desc: 'Get notified when profit drops below threshold', enabled: true },
                  { label: 'Revenue decline warnings', desc: 'Alert when revenue trends downward', enabled: true },
                  { label: 'Expense increase alerts', desc: 'Notify when expenses exceed budget', enabled: true },
                  { label: 'Marketing performance drops', desc: 'Alert when ROAS falls below target', enabled: false },
                  { label: 'Opportunity detection', desc: 'Get notified about new growth opportunities', enabled: true },
                  { label: 'Weekly digest email', desc: 'Receive weekly performance summary', enabled: true },
                  { label: 'AI recommendations', desc: 'New AI insights and recommendations', enabled: true },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{pref.label}</div>
                      <div className="text-xs text-gray-500">{pref.desc}</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors ${pref.enabled ? 'bg-nexora-500' : 'bg-gray-300 dark:bg-gray-600'} relative cursor-pointer`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200 ${pref.enabled ? 'left-5.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <h3 className="font-semibold mb-4">Current Plan</h3>
              <div className="p-4 rounded-xl bg-nexora-50 dark:bg-nexora-950/30 border border-nexora-200 dark:border-nexora-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-nexora-700 dark:text-nexora-300 capitalize">{subscription.plan} Plan</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{subscription.status} • Billed {subscription.billingCycle}</div>
                  </div>
                  <Button variant="outline" size="sm">Upgrade</Button>
                </div>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="mt-4 text-sm text-gray-500">Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</div>
              )}
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h3 className="font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Change Password</div>
                      <div className="text-xs text-gray-500">Last changed 30 days ago</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Two-Factor Authentication</div>
                      <div className="text-xs text-green-500 font-medium">Enabled</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Active Sessions</div>
                      <div className="text-xs text-gray-500">2 active sessions</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">View</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <h3 className="font-semibold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        theme === 'light' ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="w-full h-20 rounded-lg bg-white border border-gray-200 mb-2 flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-gray-100" />
                      </div>
                      <div className="text-sm font-medium text-center">Light</div>
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        theme === 'dark' ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="w-full h-20 rounded-lg bg-gray-800 border border-gray-700 mb-2 flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-gray-700" />
                      </div>
                      <div className="text-sm font-medium text-center">Dark</div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
