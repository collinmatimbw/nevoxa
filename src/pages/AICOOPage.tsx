import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { usePlatform } from '../contexts/PlatformContext';
import { Cog, Users, Zap, Clock, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props { onNavigate: (p: string) => void }

export default function AICOOPage({ onNavigate }: Props) {
  const { currentEntry, currentAnalysis, getIndustryBenchmark } = useBusiness();
  const { automations, team } = usePlatform();
  const bench = getIndustryBenchmark();
  const e = currentEntry;
  const revPerEmp = e && e.employeeCount > 0 ? e.revenue / e.employeeCount : 0;
  const leaks = currentAnalysis?.leaks || [];
  const opsLeaks = leaks.filter(l => l.category === 'operations' || l.category === 'staffing');
  const enabledAuto = automations.filter(a => a.enabled).length;

  const efficiencyScore = Math.min(100, Math.max(10, Math.round(
    (revPerEmp >= bench.avgRevenuePerEmployee ? 85 : 40 + (revPerEmp / bench.avgRevenuePerEmployee) * 45) * 0.4 +
    (opsLeaks.length === 0 ? 90 : 90 - opsLeaks.length * 15) * 0.3 +
    (enabledAuto >= 3 ? 85 : 40 + enabledAuto * 15) * 0.3
  )));

  const bottlenecks = [
    ...(revPerEmp < bench.avgRevenuePerEmployee ? [{ area: 'Team Productivity', issue: `Revenue/employee ($${revPerEmp.toFixed(0)}) below $${bench.avgRevenuePerEmployee} benchmark`, impact: 'High', fix: 'Automate repetitive tasks, upskill team, or redistribute workload' }] : []),
    ...(opsLeaks.length > 0 ? opsLeaks.map(l => ({ area: l.category === 'staffing' ? 'Staffing' : 'Operations', issue: l.problem, impact: l.impact === 'high' ? 'High' : 'Medium', fix: l.recommendation })) : []),
    ...(enabledAuto < 3 ? [{ area: 'Automation', issue: `Only ${enabledAuto} automations active — manual processes slow growth`, impact: 'Medium', fix: 'Enable automated reports, alerts, and monitoring' }] : []),
    { area: 'Process', issue: 'No documented SOPs detected for core workflows', impact: 'Low', fix: 'Create standard operating procedures for top 5 recurring tasks' },
  ];

  const improvements = [
    { title: 'Automate invoicing & follow-ups', impact: '12 hrs/week saved', difficulty: 'Easy', category: 'Automation' },
    { title: 'Implement async communication policy', impact: '8 hrs/week saved', difficulty: 'Easy', category: 'Process' },
    { title: 'Cross-train team for redundancy', impact: 'Reduce single points of failure', difficulty: 'Medium', category: 'Team' },
    { title: 'Deploy project management tooling', impact: '20% faster delivery', difficulty: 'Medium', category: 'Tools' },
    { title: 'Establish weekly ops review cadence', impact: 'Faster issue detection', difficulty: 'Easy', category: 'Process' },
    { title: 'Implement customer onboarding automation', impact: '+15% retention', difficulty: 'Hard', category: 'Automation' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><Cog className="w-6 h-6 text-nexora-500" /> AI COO</h1>
        <p className="text-sm text-gray-500 mt-1">Operational excellence — efficiency, automation, team productivity, and process optimization</p>
      </div>

      {/* Ops Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ops Efficiency Score', value: `${efficiencyScore}/100`, icon: <Cog className="w-5 h-5" />, color: efficiencyScore >= 75 ? 'from-green-500 to-emerald-600' : 'from-amber-500 to-orange-600' },
          { label: 'Revenue / Employee', value: `$${revPerEmp.toFixed(0)}`, icon: <Users className="w-5 h-5" />, color: revPerEmp >= bench.avgRevenuePerEmployee ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600' },
          { label: 'Active Automations', value: `${enabledAuto}/${automations.length}`, icon: <Zap className="w-5 h-5" />, color: 'from-nexora-500 to-emerald-600' },
          { label: 'Bottlenecks Found', value: `${bottlenecks.length}`, icon: <Clock className="w-5 h-5" />, color: bottlenecks.length > 3 ? 'from-red-500 to-rose-600' : 'from-amber-500 to-orange-600' },
        ].map((m, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div><div className="text-xs text-gray-500 font-medium mb-1">{m.label}</div><div className="text-2xl font-bold">{m.value}</div></div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white`}>{m.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottlenecks */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Operational Bottlenecks</h3>
          <div className="space-y-3">
            {bottlenecks.map((b, i) => (
              <div key={i} className={`p-3 rounded-xl border ${b.impact === 'High' ? 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10' : b.impact === 'Medium' ? 'border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10' : 'border-gray-200 dark:border-gray-700/30 bg-gray-50 dark:bg-gray-800/40'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.impact === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : b.impact === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{b.impact}</span>
                  <span className="text-xs text-gray-400">{b.area}</span>
                </div>
                <p className="text-sm font-medium">{b.issue}</p>
                <p className="text-xs text-gray-500 mt-1">💡 {b.fix}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Process Improvements */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-nexora-500" /> Recommended Improvements</h3>
          <div className="space-y-3">
            {improvements.map((imp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30">
                <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{imp.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">{imp.impact}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${imp.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : imp.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{imp.difficulty}</span>
                    <span className="text-[10px] text-gray-400">{imp.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Metrics */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Team Overview</h3>
          <button onClick={() => onNavigate('team')} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium hover:underline">Manage Team →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 text-center">
            <div className="text-2xl font-bold">{e?.employeeCount || 16}</div><div className="text-xs text-gray-500">Total Employees</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 text-center">
            <div className="text-2xl font-bold">{team.filter(t => t.status === 'active').length}</div><div className="text-xs text-gray-500">Platform Users</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 text-center">
            <div className="text-2xl font-bold text-nexora-500">${revPerEmp.toFixed(0)}</div><div className="text-xs text-gray-500">Rev / Employee</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 text-center">
            <div className="text-2xl font-bold">${bench.avgRevenuePerEmployee.toLocaleString()}</div><div className="text-xs text-gray-500">Benchmark</div>
          </div>
        </div>
      </Card>

      {/* COO Summary */}
      <Card className="!bg-gradient-to-r from-nexora-500/10 via-emerald-500/10 to-teal-500/10 dark:from-nexora-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 !border-nexora-200 dark:!border-nexora-800/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0"><Cog className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">🧠 COO Executive Brief</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Operational efficiency score is <strong>{efficiencyScore}/100</strong>. {bottlenecks.length} bottleneck{bottlenecks.length !== 1 ? 's' : ''} identified.
              Revenue per employee is ${revPerEmp.toFixed(0)} ({revPerEmp >= bench.avgRevenuePerEmployee ? 'above' : 'below'} ${bench.avgRevenuePerEmployee.toLocaleString()} benchmark).
              {enabledAuto < automations.length && ` ${automations.length - enabledAuto} automations are disabled — enabling them could save 10+ hours/week.`}
              {' '}Priority: {bottlenecks[0]?.fix || 'Continue current operational strategy.'}
            </p>
            <button onClick={() => onNavigate('automations')} className="text-sm font-semibold text-nexora-600 dark:text-nexora-400 mt-2 hover:underline inline-flex items-center gap-1">Manage Automations <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}
