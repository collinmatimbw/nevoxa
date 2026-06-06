import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth, PLAN_LIMITS } from '../contexts/AuthContext';
import { industries } from '../data/mockData';
import { currencies, formatCurrency, getCurrency } from '../data/currencies';
import { Plus, TrendingUp, Database, AlertCircle, Trash2, Zap } from 'lucide-react';

export default function DataEntry({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { entries, addEntry, deleteEntry, currentAnalysis } = useBusiness();
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [revenue, setRevenue] = useState('');
  const [expenses, setExpenses] = useState('');
  const [industry, setIndustry] = useState('SaaS');
  const [employeeCount, setEmployeeCount] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [productCount, setProductCount] = useState('');
  const [topProduct, setTopProduct] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState(() => { try { return localStorage.getItem('nexora-currency') || 'TZS'; } catch { return 'TZS'; } });

  const handleCurrencyChange = (c: string) => {
    setCurrency(c);
    try { localStorage.setItem('nexora-currency', c); } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rev = parseFloat(revenue);
    const exp = parseFloat(expenses);
    if (isNaN(rev) || isNaN(exp)) return;
    addEntry({
      date: new Date(date).toISOString(),
      revenue: rev,
      expenses: exp,
      profit: rev - exp,
      industry,
      employeeCount: parseInt(employeeCount) || 0,
      customerCount: parseInt(customerCount) || 0,
      adSpend: parseFloat(adSpend) || 0,
      productCount: parseInt(productCount) || 0,
      topProduct: topProduct || 'N/A',
      notes,
      currency,
    });
    setRevenue(''); setExpenses(''); setEmployeeCount(''); setCustomerCount('');
    setAdSpend(''); setProductCount(''); setTopProduct(''); setNotes('');
  };

  const planLimit = PLAN_LIMITS[user?.plan || 'free'];
  const atEntryLimit = entries.length >= planLimit;
  const canSubmit = revenue && expenses && !isNaN(parseFloat(revenue)) && !isNaN(parseFloat(expenses)) && !atEntryLimit;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Database className="w-6 h-6 text-nexora-500" />
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Data Entry</h1>
          <p className="text-sm text-gray-500">Enter your real business data — the AI engine will automatically detect leaks, opportunities, and insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <Card className="lg:col-span-3">
          <h3 className="font-semibold mb-4">New Monthly Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Month</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Industry</label>
                <select value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                  {industries.map(ind => <option key={ind.name} value={ind.name}>{ind.icon} {ind.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Currency</label>
                <select value={currency} onChange={e => handleCurrencyChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.symbol}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Revenue ({getCurrency(currency).symbol})</label>
                <input type="number" min="0" step="0.01" value={revenue} onChange={e => setRevenue(e.target.value)}
                  placeholder="e.g. 84000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Expenses ({getCurrency(currency).symbol})</label>
                <input type="number" min="0" step="0.01" value={expenses} onChange={e => setExpenses(e.target.value)}
                  placeholder="e.g. 41000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Employees</label>
                <input type="number" min="0" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Customers</label>
                <input type="number" min="0" value={customerCount} onChange={e => setCustomerCount(e.target.value)}
                  placeholder="e.g. 880"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Ad Spend ({getCurrency(currency).symbol})</label>
                <input type="number" min="0" step="0.01" value={adSpend} onChange={e => setAdSpend(e.target.value)}
                  placeholder="e.g. 11800"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Product Count</label>
                <input type="number" min="0" value={productCount} onChange={e => setProductCount(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Top Product</label>
                <input type="text" value={topProduct} onChange={e => setTopProduct(e.target.value)}
                  placeholder="e.g. Business Plan"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="Any notes about this month..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-nexora-500 outline-none resize-none" />
            </div>

            <Button type="submit" disabled={!canSubmit} icon={<Plus className="w-4 h-4" />}>
              Add Entry
            </Button>
          </form>
        </Card>

        {/* Summary */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Database className="w-4 h-4 text-nexora-500" /> Your Entries</h3>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Database className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No entries yet</p>
                <p className="text-xs mt-1">Add your first month of data to start getting AI-powered insights.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {entries.slice().reverse().map(e => (
                  <div key={e.id} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 border border-gray-200/60 dark:border-gray-700/30 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{e.industry}</span>
                        <button onClick={() => deleteEntry(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500" title="Delete entry">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div><span className="text-gray-500">Rev</span> <span className="font-medium">{formatCurrency(e.revenue, e.currency)}</span></div>
                      <div><span className="text-gray-500">Exp</span> <span className="font-medium">{formatCurrency(e.expenses, e.currency)}</span></div>
                      <div><span className="text-gray-500">Profit</span> <span className={`font-medium ${e.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(e.profit, e.currency)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {currentAnalysis && (
            <Card>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-nexora-500" /> Latest Analysis</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">{currentAnalysis.summary}</div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
                  <div className="text-lg font-bold text-nexora-500">{currentAnalysis.profitScore}</div>
                  <div className="text-[10px] text-gray-500">Profit Score</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40 text-center">
                  <div className="text-lg font-bold text-amber-500">{currentAnalysis.leaks.length}</div>
                  <div className="text-[10px] text-gray-500">Leaks Found</div>
                </div>
              </div>
            </Card>
          )}

          {user?.plan === 'free' && entries.length >= 2 ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-nexora-500 to-emerald-600 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <h4 className="font-semibold">Free Plan Limit Reached</h4>
              </div>
              <p className="text-xs opacity-90 mb-3">You've added 2 entries (free plan max). Upgrade to add unlimited data and unlock all features.</p>
              <button onClick={() => onNavigate?.('upgrade')} className="px-4 py-2 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-white/90 transition-colors">
                Upgrade Plan
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-amber-700 dark:text-amber-400">Tip:</strong> Add at least 2-3 months of data for the best analysis. The AI detects trends, growth rates, and profit leaks by comparing month-over-month.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
