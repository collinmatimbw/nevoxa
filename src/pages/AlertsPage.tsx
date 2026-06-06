import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { usePlatform } from '../contexts/PlatformContext';
import { Bell, Check, X, AlertTriangle, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface Props { onNavigate: (p: string) => void }

export default function AlertsPage({ onNavigate }: Props) {
  const { alerts, unreadCount, markAlertRead, markAllRead, dismissAlert } = usePlatform();
  const severityIcon: Record<string, any> = { critical: <AlertTriangle className="w-5 h-5 text-red-500" />, high: <DollarSign className="w-5 h-5 text-amber-500" />, medium: <TrendingUp className="w-5 h-5 text-blue-500" />, info: <Sparkles className="w-5 h-5 text-nexora-500" /> };
  const severityBorder: Record<string, string> = { critical: 'border-l-red-500', high: 'border-l-amber-500', medium: 'border-l-blue-500', info: 'border-l-nexora-500' };

  const timeSince = (d: string) => { const s = (Date.now() - new Date(d).getTime()) / 1000; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Bell className="w-6 h-6 text-nexora-500" /> Smart Alerts</h1><p className="text-sm text-gray-500 mt-1">AI-powered notifications for your business</p></div>
        {unreadCount > 0 && <Button size="sm" variant="ghost" onClick={markAllRead}><Check className="w-4 h-4" /> Mark all read</Button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alerts.length, color: 'text-gray-700 dark:text-gray-300' },
          { label: 'Unread', value: unreadCount, color: unreadCount > 0 ? 'text-red-500' : 'text-gray-400' },
          { label: 'Critical', value: alerts.filter(a => a.severity === 'critical').length, color: 'text-red-500' },
          { label: 'Resolved', value: alerts.filter(a => a.read).length, color: 'text-green-500' },
        ].map((s, i) => <Card key={i} padding="sm" hover><div className="text-center"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div></Card>)}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card className="text-center py-12"><Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="font-semibold mb-1">No alerts</h3><p className="text-sm text-gray-500">Everything is running smoothly 🎉</p></Card>
        ) : alerts.map(alert => (
          <div key={alert.id} className={`rounded-xl border-l-4 ${severityBorder[alert.severity]} ${!alert.read ? 'bg-gray-50 dark:bg-gray-800/80' : 'bg-gray-50/50 dark:bg-gray-800/40'} border border-gray-200/60 dark:border-gray-700/40 p-4`}>
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{severityIcon[alert.severity]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{alert.title}</h4>
                  {!alert.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : alert.severity === 'high' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : alert.severity === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{alert.severity.toUpperCase()}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{timeSince(alert.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  {alert.action && alert.actionRoute && <button onClick={() => { markAlertRead(alert.id); onNavigate(alert.actionRoute!); }} className="text-xs font-semibold text-nexora-600 dark:text-nexora-400 hover:underline flex items-center gap-1">{alert.action} <ArrowRight className="w-3 h-3" /></button>}
                  {!alert.read && <button onClick={() => markAlertRead(alert.id)} className="text-xs text-gray-400 hover:text-gray-600">Mark read</button>}
                </div>
              </div>
              <button onClick={() => dismissAlert(alert.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0"><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
