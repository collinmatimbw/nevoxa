import { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, Sliders, RotateCcw, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

export default function GrowthSimulator() {
  const [priceChange, setPriceChange] = useState(0);
  const [costReduction, setCostReduction] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [adSpendChange, setAdSpendChange] = useState(0);
  const [newProducts, setNewProducts] = useState(0);
  const [newMarkets, setNewMarkets] = useState(0);

  const baseRevenue = 0;
  const baseExpenses = 0;
  const baseProfit = baseRevenue - baseExpenses;

  const simulation = useMemo(() => {
    const priceImpact = baseRevenue * (priceChange / 100) * 0.85; // 15% churn per price increase
    const costSavings = baseExpenses * (costReduction / 100);
    const hireCost = newHires * 5500;
    const hireRevenue = newHires * 8200 * 0.6;
    const adRevenue = (adSpendChange / 100) * 0 * 2.2;
    const adCost = (adSpendChange / 100) * 0;
    const productRevenue = newProducts * 6500;
    const productCost = newProducts * 2800;
    const marketRevenue = newMarkets * 14000 * 0.3;
    const marketCost = newMarkets * 4500;

    const projectedRevenue = baseRevenue + priceImpact + hireRevenue + adRevenue + productRevenue + marketRevenue;
    const projectedExpenses = baseExpenses - costSavings + hireCost + adCost + productCost + marketCost;
    const projectedProfit = projectedRevenue - projectedExpenses;

    const revenueChange = ((projectedRevenue - baseRevenue) / baseRevenue) * 100;
    const profitChange = ((projectedProfit - baseProfit) / baseProfit) * 100;

    // Risk assessment
    let riskLevel = 'Low';
    let riskScore = 0;
    if (Math.abs(priceChange) > 15) riskScore += 2;
    if (newHires > 3) riskScore += 1;
    if (adSpendChange > 50) riskScore += 1;
    if (newMarkets > 2) riskScore += 2;
    if (newProducts > 2) riskScore += 1;
    if (riskScore >= 4) riskLevel = 'High';
    else if (riskScore >= 2) riskLevel = 'Medium';

    // Generate 12-month projection
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const projection = months.map((month, i) => {
      const rampUp = Math.min(1, (i + 1) / 4);
      const currentRevenue = baseRevenue + (projectedRevenue - baseRevenue) * rampUp;
      const currentExpenses = baseExpenses + (projectedExpenses - baseExpenses) * rampUp * 0.8;
      return {
        month,
        baseline: baseRevenue + i * 1200,
        projected: Math.round(currentRevenue + i * 1800 * (1 + revenueChange / 200)),
        profit: Math.round(currentRevenue - currentExpenses + i * 600),
      };
    });

    return { projectedRevenue, projectedExpenses, projectedProfit, revenueChange, profitChange, riskLevel, riskScore, projection };
  }, [priceChange, costReduction, newHires, adSpendChange, newProducts, newMarkets]);

  const resetAll = () => {
    setPriceChange(0);
    setCostReduction(0);
    setNewHires(0);
    setAdSpendChange(0);
    setNewProducts(0);
    setNewMarkets(0);
  };

  const sliders = [
    { label: 'Price Change', value: priceChange, setter: setPriceChange, min: -30, max: 50, unit: '%', icon: '💰', desc: 'Adjust pricing up or down' },
    { label: 'Cost Reduction', value: costReduction, setter: setCostReduction, min: 0, max: 40, unit: '%', icon: '✂️', desc: 'Reduce operational costs' },
    { label: 'New Hires', value: newHires, setter: setNewHires, min: 0, max: 10, unit: '', icon: '👥', desc: 'Add team members' },
    { label: 'Ad Spend Change', value: adSpendChange, setter: setAdSpendChange, min: -50, max: 100, unit: '%', icon: '📢', desc: 'Increase or decrease ad budget' },
    { label: 'New Products', value: newProducts, setter: setNewProducts, min: 0, max: 5, unit: '', icon: '📦', desc: 'Launch new products/services' },
    { label: 'New Markets', value: newMarkets, setter: setNewMarkets, min: 0, max: 5, unit: '', icon: '🌍', desc: 'Expand to new markets' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-nexora-500" />
            Growth Simulator
          </h1>
          <p className="text-sm text-gray-500 mt-1">Simulate business decisions before making them</p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetAll}>
          <RotateCcw className="w-4 h-4" /> Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-nexora-500" />
              <h3 className="font-semibold">Simulation Controls</h3>
            </div>
            <div className="space-y-5">
              {sliders.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span>{s.icon}</span> {s.label}
                    </label>
                    <span className="text-sm font-bold text-nexora-600 dark:text-nexora-400">
                      {s.value > 0 ? '+' : ''}{s.value}{s.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={s.value}
                    onChange={e => s.setter(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-nexora-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>{s.min}{s.unit}</span>
                    <span className="text-gray-500">{s.desc}</span>
                    <span>{s.max}{s.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projection Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card hover>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-gray-500">Projected Revenue</span>
              </div>
              <div className="text-2xl font-bold">${Math.round(simulation.projectedRevenue).toLocaleString()}</div>
              <div className={`text-xs font-medium mt-1 ${simulation.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {simulation.revenueChange >= 0 ? '+' : ''}{simulation.revenueChange.toFixed(1)}% vs current
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-nexora-500" />
                <span className="text-xs font-medium text-gray-500">Projected Profit</span>
              </div>
              <div className="text-2xl font-bold">${Math.round(simulation.projectedProfit).toLocaleString()}</div>
              <div className={`text-xs font-medium mt-1 ${simulation.profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {simulation.profitChange >= 0 ? '+' : ''}{simulation.profitChange.toFixed(1)}% vs current
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${
                  simulation.riskLevel === 'Low' ? 'text-green-500' :
                  simulation.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
                }`} />
                <span className="text-xs font-medium text-gray-500">Risk Level</span>
              </div>
              <div className={`text-2xl font-bold ${
                simulation.riskLevel === 'Low' ? 'text-green-500' :
                simulation.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
              }`}>{simulation.riskLevel}</div>
              <div className="text-xs text-gray-500 mt-1">Score: {simulation.riskScore}/10</div>
            </Card>
          </div>

          {/* Projection Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">12-Month Revenue Projection</h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Baseline</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-nexora-500" /> Projected</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={simulation.projection}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="baseline" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Area type="monotone" dataKey="projected" stroke="#a855f7" fill="url(#projGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Analysis */}
          <Card className="!bg-gradient-to-r from-nexora-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-nexora-500/20 dark:via-violet-500/20 dark:to-fuchsia-500/20 !border-nexora-200 dark:!border-nexora-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-nexora-700 dark:text-nexora-300 mb-2">🧠 AI Simulation Analysis</h3>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  {simulation.profitChange > 0 ? (
                    <>
                      <p>
                        This scenario projects a <strong className="text-green-600 dark:text-green-400">{simulation.profitChange.toFixed(1)}% profit increase</strong> to{' '}
                        <strong>${Math.round(simulation.projectedProfit).toLocaleString()}/month</strong>.
                      </p>
                      {priceChange > 10 && <p>⚠️ Price increases above 10% may cause customer churn. Consider A/B testing first.</p>}
                      {newHires > 3 && <p>⚠️ Hiring {newHires} people simultaneously is aggressive. Consider phasing over 2-3 months.</p>}
                      {newMarkets > 1 && <p>💡 Entering {newMarkets} markets at once increases complexity. Start with the highest-potential market.</p>}
                      <p>📊 Estimated ROI timeline: {simulation.riskScore <= 2 ? '30-60 days' : simulation.riskScore <= 4 ? '60-90 days' : '90-180 days'}</p>
                    </>
                  ) : (
                    <p>
                      This scenario shows a <strong className="text-red-600 dark:text-red-400">{Math.abs(simulation.profitChange).toFixed(1)}% profit decrease</strong>.
                      Consider adjusting your parameters to find a more profitable combination.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
