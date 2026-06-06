import Card from '../components/ui/Card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Repeat, MousePointer, Wallet, ArrowUpRight } from 'lucide-react';

const conversionData = [
  { month: 'Jan', rate: 3.2 }, { month: 'Feb', rate: 3.5 }, { month: 'Mar', rate: 3.8 },
  { month: 'Apr', rate: 4.0 }, { month: 'May', rate: 3.9 }, { month: 'Jun', rate: 4.2 },
  { month: 'Jul', rate: 4.1 }, { month: 'Aug', rate: 4.4 }, { month: 'Sep', rate: 4.3 },
  { month: 'Oct', rate: 4.5 }, { month: 'Nov', rate: 4.6 }, { month: 'Dec', rate: 4.7 },
];

const retentionData = [
  { month: 'Jan', rate: 82 }, { month: 'Feb', rate: 83 }, { month: 'Mar', rate: 84 },
  { month: 'Apr', rate: 85 }, { month: 'May', rate: 86 }, { month: 'Jun', rate: 85 },
  { month: 'Jul', rate: 87 }, { month: 'Aug', rate: 88 }, { month: 'Sep', rate: 87 },
  { month: 'Oct', rate: 88 }, { month: 'Nov', rate: 89 }, { month: 'Dec', rate: 89.3 },
];

const cacData = [
  { month: 'Jan', cac: 165 }, { month: 'Feb', cac: 158 }, { month: 'Mar', cac: 152 },
  { month: 'Apr', cac: 148 }, { month: 'May', cac: 145 }, { month: 'Jun', cac: 140 },
  { month: 'Jul', cac: 138 }, { month: 'Aug', cac: 135 }, { month: 'Sep', cac: 132 },
  { month: 'Oct', cac: 130 }, { month: 'Nov', cac: 128 }, { month: 'Dec', cac: 127 },
];

export default function KPIDashboard() {
  const kpis = [
    { label: 'Monthly Revenue', value: '$0', change: 0, icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Net Profit', value: '$0', change: 0, icon: <TrendingUp className="w-5 h-5" />, color: 'from-nexora-500 to-violet-600' },
    { label: 'Total Expenses', value: '$0', change: 0, icon: <Wallet className="w-5 h-5" />, color: 'from-red-500 to-rose-600', isExpense: true },
    { label: 'Growth Rate', value: '0%', change: 0, icon: <ArrowUpRight className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600' },
    { label: 'CAC', value: '$0', change: 0, icon: <Users className="w-5 h-5" />, color: 'from-amber-500 to-orange-600', isExpense: true },
    { label: 'Customer LTV', value: '$0', change: 0, icon: <BarChart3 className="w-5 h-5" />, color: 'from-violet-500 to-fuchsia-600' },
    { label: 'Retention Rate', value: '0%', change: 0, icon: <Repeat className="w-5 h-5" />, color: 'from-teal-500 to-cyan-600' },
    { label: 'Conversion Rate', value: '0%', change: 0, icon: <MousePointer className="w-5 h-5" />, color: 'from-indigo-500 to-violet-600' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">KPI Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track all critical business metrics in real-time</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">{kpi.label}</div>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
                  (kpi as any).isExpense
                    ? (kpi.change <= 0 ? 'text-green-500' : 'text-red-500')
                    : (kpi.change >= 0 ? 'text-green-500' : 'text-red-500')
                }`}>
                  {kpi.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white`}>
                {kpi.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Full */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Revenue, Expenses & Profit</h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-nexora-500" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Expenses</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Profit</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={[]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Conversion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[2.5, 5.5]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Line type="monotone" dataKey="rate" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Customer Retention</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={retentionData}>
              <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[75, 95]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Area type="monotone" dataKey="rate" stroke="#10b981" fill="url(#retGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Customer Acquisition Cost</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cacData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[100, 180]} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(value: any) => `$${value}`} />
              <Line type="monotone" dataKey="cac" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Cash Flow */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Cash Flow Summary</h3>
          <span className="text-xs text-gray-500">Last 12 months</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
            <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Total Revenue (YTD)</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">$734,000</div>
            <div className="text-xs text-green-500 mt-1">↑ 28.4% vs last year</div>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
            <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Total Expenses (YTD)</div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">$397,500</div>
            <div className="text-xs text-red-500 mt-1">↑ 12.1% vs last year</div>
          </div>
          <div className="p-4 rounded-xl bg-nexora-50 dark:bg-nexora-950/20 border border-nexora-100 dark:border-nexora-900/30">
            <div className="text-xs text-nexora-600 dark:text-nexora-400 font-medium mb-1">Net Cash Position</div>
            <div className="text-2xl font-bold text-nexora-700 dark:text-nexora-300">$156,000</div>
            <div className="text-xs text-nexora-500 mt-1">↑ 42.7% vs last year</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
