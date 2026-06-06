import { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { useBusiness } from '../contexts/BusinessContext';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, RotateCcw, Zap, ArrowUpRight, ArrowDownRight, Shield } from 'lucide-react';
import Button from '../components/ui/Button';

export default function GrowthSimulatorV3() {
  const { currentEntry, getIndustryBenchmark } = useBusiness();
  const bench = getIndustryBenchmark();
  const e = currentEntry;
  const baseRev = e?.revenue || 0;
  const baseExp = e?.expenses || 0;

  const [s, setS] = useState({ priceChange:0, expenseReduction:0, adSpendChange:0, hireChange:0, newProducts:0, newMarkets:0, retentionImprove:0, conversionImprove:0 });

  const sim = useMemo(() => {
    const churnFactor = Math.max(0.7, 1 - Math.abs(s.priceChange) * 0.008);
    const priceRev = baseRev * (s.priceChange / 100) * churnFactor;
    const costSave = baseExp * (s.expenseReduction / 100);
    const adCost = (s.adSpendChange / 100) * (e?.adSpend || 0);
    const adRev = adCost * 2.2;
    const hireCost = s.hireChange * 5500;
    const hireRev = Math.max(0, s.hireChange) * 8200 * 0.5;
    const fireRev = Math.min(0, s.hireChange) * 3000;
    const prodRev = s.newProducts * 6500;
    const prodCost = s.newProducts * 2800;
    const mktRev = s.newMarkets * 14000 * 0.25;
    const mktCost = s.newMarkets * 4500;
    const retRev = baseRev * (s.retentionImprove / 100) * 0.8;
    const convRev = baseRev * (s.conversionImprove / 100) * 0.6;

    const projRev = baseRev + priceRev + adRev + hireRev + fireRev + prodRev + mktRev + retRev + convRev;
    const projExp = baseExp - costSave + adCost + hireCost + prodCost + mktCost;
    const projProfit = projRev - projExp;
    const revChange = ((projRev - baseRev) / baseRev) * 100;
    const profChange = ((projProfit - (baseRev - baseExp)) / (baseRev - baseExp)) * 100;
    const projMargin = (projProfit / projRev) * 100;

    let risk = 0;
    const risks: string[] = [];
    const benefits: string[] = [];
    const downsides: string[] = [];

    if (Math.abs(s.priceChange) > 15) { risk += 3; risks.push('Large price change may cause significant churn'); }
    if (s.priceChange > 5) benefits.push(`+$${Math.round(priceRev).toLocaleString()}/mo from price increase`);
    if (s.priceChange > 10) downsides.push(`~${Math.round(Math.abs(s.priceChange) * 0.8)}% customer churn risk`);
    if (s.expenseReduction > 15) { risk += 2; downsides.push('Deep cuts may impact quality'); } else if (s.expenseReduction > 0) benefits.push(`$${Math.round(costSave).toLocaleString()}/mo saved`);
    if (s.adSpendChange > 50) { risk += 2; risks.push('Large ad spend increase without proven channels'); } else if (s.adSpendChange > 0) benefits.push(`Est. +$${Math.round(adRev).toLocaleString()}/mo from ads`);
    if (s.hireChange > 3) { risk += 2; downsides.push('Rapid hiring increases onboarding overhead'); } else if (s.hireChange > 0) benefits.push(`+${s.hireChange} team members boost capacity`);
    if (s.hireChange < 0) { downsides.push('Layoffs impact morale and capacity'); benefits.push(`Save $${Math.round(Math.abs(hireCost)).toLocaleString()}/mo`); }
    if (s.newMarkets > 2) { risk += 3; risks.push('Multi-market expansion is resource-intensive'); } else if (s.newMarkets > 0) benefits.push(`Access ${s.newMarkets} new market${s.newMarkets>1?'s':''}`);
    if (s.newProducts > 0) benefits.push(`${s.newProducts} new product${s.newProducts>1?'s':''} diversify revenue`);
    if (s.retentionImprove > 0) benefits.push(`+${s.retentionImprove}% retention = higher LTV`);
    if (s.conversionImprove > 0) benefits.push(`+${s.conversionImprove}% conversion = more customers`);

    const riskLevel = risk >= 6 ? 'High' : risk >= 3 ? 'Medium' : 'Low';

    const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
    const projection = months.map((m, i) => {
      const ramp = Math.min(1, (i + 1) / 4);
      const r = baseRev + (projRev - baseRev) * ramp + i * 1500;
      const ex = baseExp + (projExp - baseExp) * ramp * 0.8 + i * 500;
      return { month: m, baseline: baseRev + i * 1200, projected: Math.round(r), profit: Math.round(r - ex) };
    });

    return { projRev, projExp, projProfit, revChange, profChange, projMargin, riskLevel, risk, projection, benefits, downsides, risks };
  }, [s, baseRev, baseExp, e]);

  const reset = () => setS({ priceChange:0, expenseReduction:0, adSpendChange:0, hireChange:0, newProducts:0, newMarkets:0, retentionImprove:0, conversionImprove:0 });

  const sliders: { key: keyof typeof s; label: string; min: number; max: number; icon: string; unit: string }[] = [
    { key:'priceChange', label:'Price Change', min:-30, max:50, icon:'🏷️', unit:'%' },
    { key:'expenseReduction', label:'Expense Reduction', min:0, max:40, icon:'✂️', unit:'%' },
    { key:'adSpendChange', label:'Ad Spend Change', min:-50, max:100, icon:'📢', unit:'%' },
    { key:'hireChange', label:'Hire / Reduce Staff', min:-5, max:10, icon:'👥', unit:'' },
    { key:'newProducts', label:'Launch Products', min:0, max:5, icon:'📦', unit:'' },
    { key:'newMarkets', label:'New Markets', min:0, max:5, icon:'🌍', unit:'' },
    { key:'retentionImprove', label:'Retention Improvement', min:0, max:30, icon:'🔄', unit:'%' },
    { key:'conversionImprove', label:'Conversion Improvement', min:0, max:30, icon:'🎯', unit:'%' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-nexora-500" /> Growth Simulator
          </h1>
          <p className="text-sm text-gray-500 mt-1">Test business decisions before making them — see projected outcomes</p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="w-4 h-4" /> Reset</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">🎛️ Simulation Controls</h3>
          <div className="space-y-5">
            {sliders.map(sl => (
              <div key={sl.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{sl.icon} {sl.label}</span>
                  <span className="text-sm font-bold text-nexora-600 dark:text-nexora-400">{s[sl.key] > 0 ? '+' : ''}{s[sl.key]}{sl.unit}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} value={s[sl.key]} onChange={ev => setS(p => ({ ...p, [sl.key]: Number(ev.target.value) }))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-nexora-500" />
                <div className="flex justify-between text-[10px] text-gray-400"><span>{sl.min}{sl.unit}</span><span>{sl.max}{sl.unit}</span></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Card hover padding="sm">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-green-500" /> Projected Revenue</div>
              <div className="text-xl font-bold">${Math.round(sim.projRev).toLocaleString()}</div>
              <div className={`text-xs font-medium ${sim.revChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{sim.revChange >= 0 ? '+' : ''}{sim.revChange.toFixed(1)}%</div>
            </Card>
            <Card hover padding="sm">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-nexora-500" /> Projected Profit</div>
              <div className="text-xl font-bold">${Math.round(sim.projProfit).toLocaleString()}</div>
              <div className={`text-xs font-medium ${sim.profChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{sim.profChange >= 0 ? '+' : ''}{sim.profChange.toFixed(1)}%</div>
            </Card>
            <Card hover padding="sm">
              <div className="text-xs text-gray-500 mb-1">Projected Margin</div>
              <div className="text-xl font-bold">{sim.projMargin.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">vs {bench.avgMargin}% avg</div>
            </Card>
            <Card hover padding="sm">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Shield className={`w-3.5 h-3.5 ${sim.riskLevel==='Low'?'text-green-500':sim.riskLevel==='Medium'?'text-amber-500':'text-red-500'}`} /> Risk Level</div>
              <div className={`text-xl font-bold ${sim.riskLevel==='Low'?'text-green-500':sim.riskLevel==='Medium'?'text-amber-500':'text-red-500'}`}>{sim.riskLevel}</div>
              <div className="text-xs text-gray-400">{sim.risk}/10 score</div>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <h3 className="font-semibold mb-4">12-Month Revenue Projection</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={sim.projection}>
                <defs>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                  <linearGradient id="simProfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="baseline" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Baseline" />
                <Area type="monotone" dataKey="projected" stroke="#a855f7" fill="url(#simGrad)" strokeWidth={2.5} name="Projected Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#simProfGrad)" strokeWidth={2} name="Projected Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Benefits / Downsides / Risks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="!border-green-200 dark:!border-green-900/30">
              <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> Benefits</h4>
              {sim.benefits.length === 0 ? <p className="text-xs text-gray-400 italic">Adjust sliders to see benefits</p> : sim.benefits.map((b, i) => <div key={i} className="text-xs text-gray-600 dark:text-gray-400 py-1 flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span>{b}</div>)}
            </Card>
            <Card className="!border-amber-200 dark:!border-amber-900/30">
              <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Downsides</h4>
              {sim.downsides.length === 0 ? <p className="text-xs text-gray-400 italic">No downsides detected</p> : sim.downsides.map((d, i) => <div key={i} className="text-xs text-gray-600 dark:text-gray-400 py-1 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">⚠</span>{d}</div>)}
            </Card>
            <Card className="!border-red-200 dark:!border-red-900/30">
              <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1"><ArrowDownRight className="w-4 h-4" /> Risks</h4>
              {sim.risks.length === 0 ? <p className="text-xs text-gray-400 italic">Low risk scenario</p> : sim.risks.map((r, i) => <div key={i} className="text-xs text-gray-600 dark:text-gray-400 py-1 flex items-start gap-1.5"><span className="text-red-500 mt-0.5">✗</span>{r}</div>)}
            </Card>
          </div>

          {/* AI Analysis */}
          <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-nexora-500 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-nexora-700 dark:text-nexora-300">🧠 AI Verdict: </strong>
                {sim.profChange > 15 ? 'This is an aggressive but potentially high-reward scenario. ' : sim.profChange > 0 ? 'This scenario shows positive profit growth. ' : 'This scenario reduces profitability — consider adjustments. '}
                Projected margin of <strong>{sim.projMargin.toFixed(1)}%</strong> {sim.projMargin >= bench.avgMargin ? 'exceeds' : 'is below'} the {bench.industry} average of {bench.avgMargin}%.
                {sim.riskLevel === 'High' && ' ⚠️ High risk — consider phasing changes over 2-3 months.'}
                {sim.riskLevel === 'Low' && sim.profChange > 0 && ' ✅ Low risk with positive returns — strong candidate for execution.'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
