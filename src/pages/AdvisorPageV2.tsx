import { useState, useRef, useEffect, useMemo } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { getCurrency } from '../data/currencies';
import { Send, Brain, Sparkles, RotateCcw, Copy, ThumbsUp, ThumbsDown, Lightbulb, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import getInitials from '../utils/getInitials';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AdvisorPageV2({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { entries, currentEntry, currentAnalysis, allLeaks, allFocusItems, goals, getGrowthRates, getTrends, getActionPlan, getIndustryBenchmark, getForecast } = useBusiness();
  const { user } = useAuth();
  const userInitials = getInitials(user?.name);
  const growth = getGrowthRates();
  const trends = getTrends();
  const actionPlan = getActionPlan();
  const benchmark = getIndustryBenchmark();
  const forecast = getForecast(6);
  const entry = currentEntry;
  const analysis = currentAnalysis;
  const leaks = analysis?.leaks || allLeaks;
  const focusItems = allFocusItems;
  const currSym = entry ? getCurrency(entry.currency).symbol : '$';
  const currCode = entry?.currency || 'USD';

  const r = (n: number) => n.toLocaleString();
  const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
  const money = (n: number) => `${currSym}${r(n)}`;

  const margin = entry ? ((entry.profit / entry.revenue) * 100).toFixed(1) : '0';
  const arpu = entry && entry.customerCount > 0 ? (entry.revenue / entry.customerCount).toFixed(0) : '0';
  const revPerEmp = entry && entry.employeeCount > 0 ? (entry.revenue / entry.employeeCount).toFixed(0) : '0';
  const totalLeakLoss = leaks.reduce((s, l) => s + l.estimatedLoss, 0);
  const focusStop = focusItems.filter(i => i.type === 'stop');
  const focusKeep = focusItems.filter(i => i.type === 'keep');
  const focusImprove = focusItems.filter(i => i.type === 'improve');
  const highLeaks = leaks.filter(l => l.impact === 'high');

  // ── QUESTION INTENT CLASSIFIER ──────────────────────────────────────
  interface IntentResult {
    intent: string;
    score: number;
  }

  function classifyIntent(q: string): string[] {
    const lq = q.toLowerCase().trim();
    const intents: IntentResult[] = [];

    const patterns: [string, string[], number][] = [
      ['revenue', ['revenue', 'grow', 'sales', 'income', 'make more', 'increase revenue', 'boost', 'sell more', 'top line', 'turnover', 'upsell', 'cross-sell'], 0],
      ['margin', ['margin', 'profit margin', 'profitability', 'net profit', 'gross profit', 'earnings', 'bottom line'], 0],
      ['expenses', ['expense', 'cost', 'spend', 'cut', 'reduce.*cost', 'overhead', 'burn rate', 'waste', 'saving', 'save money', 'too much'], 0],
      ['pricing', ['price', 'pricing', 'charge', 'raise price', 'lower price', 'tier', 'package', 'offer'], 0],
      ['retention', ['retention', 'churn', 'keep customer', 'customer.*stay', 'attrition', 'loyalty', 'repeat', 'cancel'], 0],
      ['focus', ['focus', 'prioritize', 'this month', 'what should i do', 'next step', 'urgent', 'important', 'where to start'], 0],
      ['leaks', ['leak', 'losing money', 'drain', 'waste', 'bleeding', 'inefficient'], 0],
      ['customers', ['customer', 'client', 'acquisition', 'acquire', 'get more customer', 'lead', 'conversion', 'cac', 'ltv'], 0],
      ['employees', ['employee', 'hire', 'staff', 'team', 'people', 'workforce', 'headcount', 'layoff', 'fire'], 0],
      ['marketing', ['marketing', 'ad', 'advertising', 'roas', 'channel', 'campaign', 'ppc', 'social media', 'seo', 'traffic'], 0],
      ['cashflow', ['cash flow', 'cashflow', 'runway', 'working capital', 'liquidity', 'insolvent', 'broke', 'payroll'], 0],
      ['forecast', ['forecast', 'projection', 'predict', 'future', 'next month', 'next quarter', 'trend', 'growth rate'], 0],
      ['benchmark', ['benchmark', 'compare', 'competitor', 'industry.*average', 'similar.*business', 'how.*others', 'peers'], 0],
      ['actionplan', ['action plan', 'roadmap', 'step', 'implement', 'execute', 'do next', 'plan'], 0],
      ['goals', ['goal', 'target', 'objective', 'kpi', 'metric', 'track', 'measure', 'milestone'], 0],
      ['invest', ['invest', 'funding', 'investor', 'raise.*capital', 'loan', 'finance', 'expand'], 0],
      ['general', ['hello', 'hi', 'hey', 'help', 'what can you', 'how.*work', 'capabilities'], 0],
    ];

    for (const [intent, keywords] of patterns) {
      let score = 0;
      for (const kw of keywords) {
        const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        if (regex.test(lq)) score += kw.includes(' ') ? 3 : 1;
      }
      if (score > 0) intents.push({ intent, score });
    }

    intents.sort((a, b) => b.score - a.score);
    return intents.map(i => i.intent).slice(0, 3);
  }

  // ── DATA SNAPSHOT ───────────────────────────────────────────────────
  function dataSnapshot(): string {
    if (!entry) return '';
    return `**Revenue:** ${money(entry.revenue)}/mo | **Expenses:** ${money(entry.expenses)}/mo | **Profit:** ${money(entry.profit)}/mo | **Margin:** ${margin}%\n**Score:** ${analysis?.profitScore || 'N/A'}/100 | **Leaks:** ${leaks.length} (${money(totalLeakLoss)}/mo) | **Growth:** ${pct(growth.revenueGrowth)} rev, ${pct(growth.profitGrowth)} profit`;
  }

  // ── RESPONSE GENERATOR ─────────────────────────────────────────────
  function generateResponse(question: string): string {
    const intents = classifyIntent(question);

    if (!entry) {
      return `I'd love to help, but I need some data first! Head over to **Data Entry** to add your first month of business data. Once you have at least one entry, I'll analyze it and give you personalized advice.\n\nIn the meantime, you can ask me general business questions!`;
    }

    // Handle general / greeting
    if (intents[0] === 'general') {
      return `Hello! I'm your Nexora AI business advisor. I've analyzed your latest data and I'm ready to help.\n\n📊 **Your Business Snapshot:**\n${dataSnapshot()}\n\nI can help with:\n💰 Revenue growth & pricing strategies\n✂️ Cost reduction & expense optimization\n📈 Marketing ROI & customer acquisition\n🔄 Customer retention & churn reduction\n🎯 Priority focus & action planning\n📊 Industry benchmarks & competitive analysis\n\nWhat business challenge would you like to tackle?`;
    }

    // ── REVENUE ──────────────────────────────────────────────────────
    if (intents[0] === 'revenue') {
      const revGrowth = growth.revenueGrowth;
      const isGrowing = revGrowth > 2;
      const opps = analysis?.opportunities?.filter(o => o.category === 'revenue') || [];

      return `## Revenue Growth Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📈 Growth Assessment\nYour revenue is **${money(entry.revenue)}/mo**, ${isGrowing ? `growing at **${pct(revGrowth)}** MoM` : `with **${pct(revGrowth)}** MoM growth — we need to accelerate this`}.\n${analysis?.profitScoreBreakdown?.growth ? `**Growth Score:** ${analysis.profitScoreBreakdown.growth.score}/100 — ${analysis.profitScoreBreakdown.growth.explanation}` : ''}\n\n### 🚀 Top Revenue Opportunities\n${opps.length > 0 ? opps.slice(0, 3).map((o, i) => `${i + 1}. **${o.title}** — ${o.description.replace(/\$[\d,.]+/g, m => currSym + m.slice(1))}`).join('\n') : `1. **Customer Upselling** — With ${entry.customerCount} customers, a 10% upsell rate at 50% higher ARPU could add **${money(Math.round(entry.revenue * 0.05))}/mo**\n2. **Pricing Optimization** — Review your pricing tiers against competitors\n3. **Expand Customer Base** — Invest in your highest-ROAS acquisition channel`}\n\n### 💡 Key Actions\n${isGrowing ? `- Double down on what's working — allocate 70% of resources to your best channel\n- Identify why customers choose you and amplify those differentiators\n- Consider geographic or vertical expansion` : `- Your ${entry.industry} peers average ${benchmark.avgGrowth}% growth — close the gap\n- Audit your sales funnel for drop-off points\n- A 5% increase in customer count at current ARPU would add **${money(Math.round(entry.revenue * 0.05))}/mo**`}\n\nWant me to dive deeper into a specific growth strategy?`;
    }

    // ── MARGIN / PROFITABILITY ───────────────────────────────────────
    if (intents[0] === 'margin') {
      const marginNum = parseFloat(margin);
      const targetMargin = benchmark.avgMargin;
      const gap = targetMargin - marginNum;

      return `## Profit Margin Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🎯 Margin Assessment\nYour profit margin is **${margin}%** ${gap > 0 ? `— **${gap.toFixed(1)} percentage points below** the ${benchmark.industry} average of ${targetMargin}%` : `— **above** the ${benchmark.industry} average of ${targetMargin}%`}.\n\n### 🔍 Leaks Draining Margin\n${leaks.length > 0 ? leaks.slice(0, 4).map(l => `- **${l.category}:** ${l.problem} → **${money(l.estimatedLoss)}/mo**`).join('\n') : '- No significant profit leaks detected. Great job!'}\n\n### 💡 Margin Improvement Plan\n\n**Immediate (Week 1-2):**\n- ${highLeaks.length > 0 ? `Fix the top leak: "${highLeaks[0].problem}" — recover **${money(highLeaks[0].estimatedLoss)}/mo**` : 'Review variable costs for 5-10% reduction opportunities'}\n- ${entry.adSpend / entry.revenue > 0.12 ? `Reduce ad spend ratio from ${((entry.adSpend / entry.revenue) * 100).toFixed(1)}% to 12% — save **${money(Math.round((entry.adSpend / entry.revenue - 0.12) * entry.revenue))}/mo**` : 'Ad spend ratio is healthy at ' + ((entry.adSpend / entry.revenue) * 100).toFixed(1) + '%'}\n\n**Short-term (Week 3-4):**\n- Renegotiate supplier contracts and software subscriptions\n- Increase prices by 5-10% for new customers only\n\n**Expected Result:** ${money(Math.round(totalLeakLoss * 0.5 + entry.revenue * 0.03))}/${currCode === 'USD' ? 'mo' : `mo in ${currCode}`} recovered.\n\nWould you like a personalized margin improvement action plan?`;
    }

    // ── EXPENSES ─────────────────────────────────────────────────────
    if (intents[0] === 'expenses') {
      const expGrowth = growth.expenseGrowth;
      const revGrowth = growth.revenueGrowth;
      const adRatio = (entry.adSpend / entry.expenses) * 100;
      const opsCost = entry.expenses - entry.adSpend;

      return `## Expense Optimization Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📈 Expense Trend\nExpenses are **${money(entry.expenses)}/mo**, ${expGrowth > 0 ? `growing **${pct(expGrowth)}** MoM` : `declining **${pct(expGrowth)}** MoM`}.\n${expGrowth > revGrowth ? '⚠️ **Expenses are outpacing revenue growth** — this will compress margins if not addressed.' : '✅ Expenses are under control relative to revenue growth.'}\n\n### 💰 Expense Breakdown\n- **Ad Spend:** ${money(entry.adSpend)}/mo (${adRatio.toFixed(0)}% of total expenses)\n- **Operating Costs:** ${money(opsCost)}/mo (${((opsCost / entry.expenses) * 100).toFixed(0)}% of total)\n\n### ✂️ Savings Opportunities\n\n**1. Marketing Efficiency**\n${(entry.adSpend / entry.revenue) > 0.12 ? `Your ad-to-revenue ratio is ${((entry.adSpend / entry.revenue) * 100).toFixed(1)}%. Cutting to 12% saves **${money(Math.round(entry.adSpend - entry.revenue * 0.12))}/mo**` : `Ad spend is efficient at ${((entry.adSpend / entry.revenue) * 100).toFixed(1)}% of revenue.`}\n\n**2. Operational Efficiency**\n- Revenue per employee: **${money(Number(revPerEmp))}/mo** (benchmark: ${money(benchmark.avgRevenuePerEmployee)})\n${Number(revPerEmp) < benchmark.avgRevenuePerEmployee * 0.8 ? `- ⚠️ Below benchmark — consider automation to improve efficiency` : '- ✅ At or above benchmark'}\n\n**3. Quick Wins**\n- Audit software subscriptions for duplicates\n- Negotiate annual contracts for 15-30% discounts\n- Reduce non-essential travel and entertainment\n\n**Estimated Total Savings:** ${money(Math.round(entry.expenses * 0.08))}–${money(Math.round(entry.expenses * 0.15))}/mo\n\nWant me to build a detailed cost-cutting roadmap?`;
    }

    // ── PRICING ──────────────────────────────────────────────────────
    if (intents[0] === 'pricing') {
      return `## Pricing Strategy Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🏷️ Current Pricing\n- **ARPU (Avg Revenue Per User):** ${money(Number(arpu))}/mo\n- **Customer Count:** ${entry.customerCount}\n- **Top Product:** ${entry.topProduct}\n\n${analysis?.profitScoreBreakdown?.pricing ? `**Pricing Score:** ${analysis.profitScoreBreakdown.pricing.score}/100 — ${analysis.profitScoreBreakdown.pricing.explanation}` : ''}\n\n### 💡 Pricing Recommendations\n\n**Option 1: Price Increase (Low Risk)**\n- Raise prices 10-15% for new customers only\n- Estimated impact: **+${money(Math.round(Number(arpu) * 0.12 * entry.customerCount))}/mo**\n- Risk: Minimal — existing customers unaffected\n\n**Option 2: Tiered Restructuring (Medium Risk)**\n- Create 3 tiers: Basic (current), Pro (2x current), Enterprise (4x current)\n- Move 20% of customers up over 3 months\n- Estimated impact: **+${money(Math.round(entry.revenue * 0.15))}/mo**\n\n**Option 3: Value-Based Pricing (Higher Risk/Reward)**\n- Price based on customer value delivered, not costs\n- Recommended for ${entry.industry} businesses with high differentiation\n- Typical uplift: 25-40%\n\n### 📊 ${benchmark.industry} Benchmark\nYour ARPU of **${money(Number(arpu))}/mo** vs industry average of **${money(benchmark.avgRevenuePerEmployee)}/employee**.\n\nWould you like me to model the revenue impact of a specific pricing change?`;
    }

    // ── RETENTION / CHURN ────────────────────────────────────────────
    if (intents[0] === 'retention') {
      const churnRate = entries.length > 1 && entries[entries.length - 2]?.customerCount > 0
        ? Math.max(0, ((entries[entries.length - 2].customerCount - entry.customerCount + 20) / entries[entries.length - 2].customerCount) * 100).toFixed(1)
        : '~5.0';
      return `## Customer Retention Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🔄 Retention Metrics\n- **Total Customers:** ${entry.customerCount}\n- **ARPU:** ${money(Number(arpu))}/mo\n- **Est. Monthly Churn:** ${churnRate}%\n${entries.length > 1 ? `- **Customer Change:** ${entry.customerCount - entries[entries.length - 2]?.customerCount > 0 ? '+' : ''}${entry.customerCount - entries[entries.length - 2]?.customerCount} this period` : ''}\n\n### 📈 Retention Impact\nA **1% reduction in churn** could save **${money(Math.round(Number(arpu) * entry.customerCount * 0.01 * 12))}/year** in retained revenue.\n\n### 🛡️ Retention Strategy\n\n**Immediate (Week 1):**\n- Identify customers who haven't engaged in 30+ days\n- Send personalized re-engagement emails with exclusive offers\n\n**Short-term (Week 2-4):**\n- Implement a customer health scoring system (login frequency, feature usage, support tickets)\n- Create an onboarding checklist for new customers (first 30-day success plan)\n- Launch a referral program — incentivize existing customers to refer\n\n**Long-term (Month 2-3):**\n- Build a customer community or user group\n- Implement quarterly business reviews for top accounts\n- Develop a win-back campaign for lost customers\n\n**Expected Outcome:** ${money(Math.round(Number(arpu) * entry.customerCount * 0.03))}/mo additional revenue from improved retention.\n\nWould you like a detailed retention action plan?`;
    }

    // ── CUSTOMERS / ACQUISITION ──────────────────────────────────────
    if (intents[0] === 'customers') {
      return `## Customer Acquisition Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 👥 Customer Metrics\n- **Current Customers:** ${entry.customerCount}\n- **ARPU:** ${money(Number(arpu))}/mo\n- **Revenue Per Employee:** ${money(Number(revPerEmp))}/mo\n\n### 📈 Acquisition Strategy\n\n**1. Optimize Your Best Channel**\nFocus 70% of your budget on the highest-performing acquisition channel. For ${entry.industry} businesses, these typically perform best:\n- Content marketing / SEO (long-term, highest ROI)\n- Paid search (high intent, predictable)\n- Referral programs (lowest CAC, highest LTV)\n\n**2. Calculate Your Target CAC**\nWith ARPU of ${money(Number(arpu))}/mo and est. LTV of ${money(Math.round(Number(arpu) * 24 * 0.7))} (24mo retention), your target CAC should be under **${money(Math.round(Number(arpu) * 24 * 0.7 * 0.3))}**.\n\n**3. Growth Levers**\n- **+5% conversion rate** → ${money(Math.round(entry.revenue * 0.05))}/mo additional\n- **+10% customer count** → ${money(Math.round(entry.revenue * 0.1))}/mo additional\n- **+20% ARPU** → ${money(Math.round(entry.revenue * 0.2))}/mo additional\n\nWant me to help design a customer acquisition campaign?`;
    }

    // ── FOCUS / PRIORITIES ──────────────────────────────────────────
    if (intents[0] === 'focus') {
      return `## Your Priority Focus Areas\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🚨 Critical Priorities\n${highLeaks.length > 0 ? highLeaks.slice(0, 2).map((l, i) => `**${i + 1}. Fix:** "${l.problem}"\n   Impact: **${money(l.estimatedLoss)}/mo** — ${l.recommendation}`).join('\n\n') : '✅ No critical profit leaks detected'}\n\n### ⚡ High Priority\n${focusImprove.slice(0, 3).map((f, i) => `${i + 1}. **${f.action}** — ${f.impact}`).join('\n') || 'None identified'}\n\n### 📋 Weekly Action Plan\n\n**This Week — Stop:**\n${focusStop.slice(0, 2).map(f => `- ❌ ${f.action}`).join('\n') || '- Nothing critical to stop right now'}\n\n**This Week — Keep Doing:**\n${focusKeep.slice(0, 2).map(f => `- ✅ ${f.action}`).join('\n') || '- Maintain operations and customer service'}\n\n### 🎯 Month-at-a-Glance\n${actionPlan.sevenDay.length > 0 ? `**Week 1:** ${actionPlan.sevenDay[0].task}` : ''}\n${actionPlan.thirtyDay.length > 0 ? `**Month:** ${actionPlan.thirtyDay[0].task}` : ''}\n${actionPlan.ninetyDay.length > 0 ? `**Quarter:** ${actionPlan.ninetyDay[0].task}` : ''}\n\nShall I create a detailed step-by-step action plan?`;
    }

    // ── LEAKS ────────────────────────────────────────────────────────
    if (intents[0] === 'leaks') {
      if (leaks.length === 0) return `Good news — I haven't detected any active profit leaks in your latest data. 🎉\n\nYour profit margin is **${margin}%** with revenue of ${money(entry.revenue)}/mo. To stay leak-free:\n- Monitor expenses monthly\n- Keep ad spend under 12% of revenue\n- Track customer retention trends\n\nWant me to analyze any specific area for hidden inefficiencies?`;

      return `## Profit Leak Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🔍 ${leaks.length} Active Leaks Found\n\n${leaks.map((l, i) => `**${i + 1}. ${l.category.toUpperCase()}** (${l.impact.toUpperCase()})\nProblem: ${l.problem}\nLoss: **${money(l.estimatedLoss)}/mo**\nFix: ${l.recommendation}`).join('\n\n')}\n\n### 💰 Total Impact\n- Monthly loss: **${money(totalLeakLoss)}/mo**\n- Annual loss: **${money(totalLeakLoss * 12)}/yr**\n- Addressable recovery: **${money(Math.round(totalLeakLoss * 0.7))}/mo** (fixing top leaks)\n\n### 🎯 Quick Wins\n${highLeaks.length > 0 ? `Fix "${highLeaks[0].problem}" first — it's your biggest drain at ${money(highLeaks[0].estimatedLoss)}/mo.` : 'All detected leaks are manageable.'}\n\nWant me to create a prioritized leak-fixing action plan?`;
    }

    // ── MARKETING ────────────────────────────────────────────────────
    if (intents[0] === 'marketing') {
      const adRatio = (entry.adSpend / entry.revenue) * 100;
      return `## Marketing Performance Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📢 Marketing Metrics\n- **Ad Spend:** ${money(entry.adSpend)}/mo\n- **Ad-to-Revenue Ratio:** ${adRatio.toFixed(1)}%\n- **${benchmark.industry} Benchmark:** ${benchmark.avgAdRatio}%\n\n### 📈 Channel Assessment\n${adRatio > benchmark.avgAdRatio * 1.2 ? `⚠️ Your ad spend ratio (${adRatio.toFixed(1)}%) exceeds the ${benchmark.industry} benchmark (${benchmark.avgAdRatio}%). Consider reallocating to organic channels.` : `✅ Your ad spend ratio (${adRatio.toFixed(1)}%) is within healthy range for ${benchmark.industry}.`}\n\n### 💡 Marketing Optimization\n\n**1. Audit Channel Performance**\n- Calculate ROAS for each channel\n- Pause channels below 2x ROAS\n- Double down on top-performing channels\n\n**2. Improve Conversion**\n- ${entry.customerCount > 0 ? `At ${entry.customerCount} customers and ${money(entry.revenue)}/mo, your conversion optimization could add **${money(Math.round(entry.revenue * 0.05))}/mo**` : 'Focus on customer acquisition metrics'}\n\n**3. Organic Growth**\n- Content marketing: 3x higher ROI than paid ads over 12 months\n- Email marketing: $42 ROI per $1 spent\n- Referral programs: 30% higher retention rate\n\n### 📋 ${benchmark.industry} Tips\n${benchmark.tips.slice(0, 3).map(t => `- ${t}`).join('\n')}\n\nWould you like a detailed marketing budget reallocation plan?`;
    }

    // ── CASH FLOW ────────────────────────────────────────────────────
    if (intents[0] === 'cashflow') {
      return `## Cash Flow Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 💵 Cash Position\n- **Monthly Burn:** ${money(entry.expenses)}/mo\n- **Revenue Coverage:** ${entry.expenses > 0 ? ((entry.revenue / entry.expenses) * 100).toFixed(0) : 'N/A'}%\n- **Profit Margin:** ${margin}%\n\n### ⚠️ Cash Flow Indicators\n${parseFloat(margin) < 10 ? '🔴 **Warning:** Your margin is below 10% — cash reserves may deplete quickly if revenue dips.' : parseFloat(margin) < 25 ? '🟡 **Caution:** Moderate margin — build a 3-6 month cash reserve.' : '🟢 **Healthy:** Good margin provides cash flow buffer.'}\n\n### 🏦 Recommendations\n\n**Improve Cash Flow:**\n1. Switch customers to annual billing with 10-15% discount\n2. Negotiate Net-60 or Net-90 payment terms with suppliers\n3. Reduce inventory holding period\n4. Implement automated invoice reminders for late payments\n\n**Build Runway:**\n- Target: 6 months of operating expenses in reserve\n- Your target reserve: **${money(entry.expenses * 6)}**\n- ${parseFloat(margin) > 15 ? `At current margin (${margin}%) you'd build this in ~${Math.ceil((entry.expenses * 6) / (entry.profit))} months` : 'Consider a line of credit for working capital'}\n\nWould you like a cash flow projection model?`;
    }

    // ── FORECAST / TRENDS ────────────────────────────────────────────
    if (intents[0] === 'forecast') {
      return `## Business Forecast & Trends\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📈 Historical Trend${trends.length > 1 ? 's' : ''}\n${trends.slice(-4).map(t => `${t.date}: ${money(t.revenue)} rev | ${money(t.profit)} profit | ${t.margin}% margin | Score: ${t.score}`).join('\n')}\n\n### 📊 Growth Rates\n- **Revenue Growth:** ${pct(growth.revenueGrowth)}\n- **Expense Growth:** ${pct(growth.expenseGrowth)}\n- **Profit Growth:** ${pct(growth.profitGrowth)}\n- **Margin Change:** ${growth.marginDelta >= 0 ? '+' : ''}${growth.marginDelta.toFixed(1)}pp\n\n### 🔮 6-Month Forecast\n${forecast.length > 0 ? forecast.slice(0, 4).map(f => `${f.date}: ${money(f.revenue)} rev | ${money(f.profit)} profit`).join('\n') : 'Add at least 2 data points to see a forecast'}\n\n### 💡 Key Insights\n- ${growth.revenueGrowth > 0 ? `At current growth (${pct(growth.revenueGrowth)}), revenue will double in ~${(72 / growth.revenueGrowth).toFixed(0)} months` : 'Revenue is declining — reverse this trend to avoid cash flow issues'}\n- ${growth.expenseGrowth > growth.revenueGrowth ? '⚠️ **Expenses growing faster than revenue — unsustainable**' : '✅ Revenue growing faster than expenses — good trajectory'}\n\nWant me to model different growth scenarios?`;
    }

    // ── BENCHMARK ────────────────────────────────────────────────────
    if (intents[0] === 'benchmark') {
      return `## Industry Benchmark Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📊 ${benchmark.industry} Benchmarks\n| Metric | Your Business | ${benchmark.industry} Avg | Status |\n|--------|-------------|------------------------|--------|\n| Profit Margin | ${margin}% | ${benchmark.avgMargin}% | ${parseFloat(margin) >= benchmark.avgMargin ? '✅ Above' : '⚠️ Below'} |\n| Growth Rate | ${pct(growth.revenueGrowth)} | ${pct(benchmark.avgGrowth)} | ${growth.revenueGrowth >= benchmark.avgGrowth ? '✅ Above' : '⚠️ Below'} |\n| Ad Spend Ratio | ${((entry.adSpend / entry.revenue) * 100).toFixed(1)}% | ${benchmark.avgAdRatio}% | ${(entry.adSpend / entry.revenue) * 100 <= benchmark.avgAdRatio * 1.2 ? '✅ Healthy' : '⚠️ High'} |\n| Rev/Employee | ${money(Number(revPerEmp))}/mo | ${money(benchmark.avgRevenuePerEmployee)}/mo | ${Number(revPerEmp) >= benchmark.avgRevenuePerEmployee * 0.8 ? '✅ Good' : '⚠️ Below'} |\n\n### 💡 ${benchmark.industry} Best Practices\n${benchmark.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n### 🎯 Gap Analysis\n${parseFloat(margin) < benchmark.avgMargin ? `Closing the margin gap to ${benchmark.avgMargin}% would add **${money(Math.round(entry.revenue * (benchmark.avgMargin - parseFloat(margin)) / 100))}/mo** in profit.` : 'You\'re performing at or above industry benchmarks.'}\n\nWant a detailed competitive strategy to outperform your peers?`;
    }

    // ── ACTION PLAN ──────────────────────────────────────────────────
    if (intents[0] === 'actionplan') {
      return `## Custom Action Plan\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 📋 Generated Action Plan\n\n**🚀 Next 7 Days**\n${actionPlan.sevenDay.slice(0, 5).map((a, i) => `${i + 1}. [${a.priority.toUpperCase()}] ${a.task}\n   Impact: ${a.expectedImpact} | Time: ${a.estimatedTime} | ${a.difficulty}`).join('\n')}\n\n**📅 Next 30 Days**\n${actionPlan.thirtyDay.slice(0, 3).map((a, i) => `${i + 1}. [${a.priority.toUpperCase()}] ${a.task}\n   Impact: ${a.expectedImpact} | ${a.difficulty}`).join('\n')}\n\n**🏆 Next 90 Days**\n${actionPlan.ninetyDay.slice(0, 3).map((a, i) => `${i + 1}. [${a.priority.toUpperCase()}] ${a.task}\n   Impact: ${a.expectedImpact}`).join('\n')}\n\n**🎯 Long Term (12+ Months)**\n${actionPlan.longTerm.slice(0, 2).map((a, i) => `${i + 1}. ${a.task} — ${a.expectedImpact}`).join('\n')}\n\n### 💰 Total Potential Impact\nAddressing all items could add **${money(Math.round(totalLeakLoss * 1.5 + entry.revenue * 0.05))}/mo** to your bottom line.\n\nWant me to expand any specific section?`;
    }

    // ── GOALS / KPIs ────────────────────────────────────────────────
    if (intents[0] === 'goals') {
      const activeGoals = goals.filter(g => g.status === 'active');
      return `## Goals & KPI Tracking\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 🎯 Your Goals${activeGoals.length > 0 ? '' : ' (None Set Yet)'}\n${activeGoals.length > 0 ? activeGoals.map(g => `${g.title}: ${money(g.currentValue)}/${money(g.targetValue)} (${Math.min(100, Math.round((g.currentValue / g.targetValue) * 100))}%)`).join('\n') : 'Head to Goals page to set revenue, profit, or growth targets!'}\n\n### 📊 Key Metrics to Track\n| Metric | Current | Target |\n|--------|---------|--------|\n| Monthly Revenue | ${money(entry.revenue)} | ${money(Math.round(entry.revenue * 1.2))} (+20%) |\n| Profit Margin | ${margin}% | ${benchmark.avgMargin}% |\n| Customer Count | ${entry.customerCount} | ${Math.round(entry.customerCount * 1.15)} (+15%) |\n| ARPU | ${money(Number(arpu))} | ${money(Math.round(Number(arpu) * 1.1))} (+10%) |\n\n### 💡 Recommended Goals\n1. **Revenue:** Grow to ${money(Math.round(entry.revenue * 1.3))}/mo (${money(Math.round(entry.revenue * 0.3))} increase)\n2. **Profit:** Reach ${benchmark.avgMargin}% margin (add ${money(Math.round(entry.revenue * (benchmark.avgMargin - parseFloat(margin)) / 100))}/mo)\n3. **Customers:** Add ${Math.max(5, Math.round(entry.customerCount * 0.1))} new customers this quarter\n\nWant me to help you set SMART goals?`;
    }

    // ── EMPLOYEES ───────────────────────────────────────────────────
    if (intents[0] === 'employees') {
      return `## Team & Staffing Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 👥 Team Metrics\n- **Employees:** ${entry.employeeCount}\n- **Revenue Per Employee:** ${money(Number(revPerEmp))}/mo\n- **${benchmark.industry} Benchmark:** ${money(benchmark.avgRevenuePerEmployee)}/mo\n\n### 📊 Efficiency Assessment\n${Number(revPerEmp) < benchmark.avgRevenuePerEmployee * 0.7 ? `⚠️ Your rev/employee (${money(Number(revPerEmp))}) is significantly below the ${benchmark.industry} benchmark (${money(benchmark.avgRevenuePerEmployee)}). Consider:\n- Automating repetitive tasks\n- Cross-training team members\n- Evaluating underutilized roles` : Number(revPerEmp) < benchmark.avgRevenuePerEmployee ? `🟡 Your rev/employee (${money(Number(revPerEmp))}) is slightly below benchmark. Minor optimization needed.` : `✅ Your rev/employee (${money(Number(revPerEmp))}) is at or above the ${benchmark.industry} benchmark of ${money(benchmark.avgRevenuePerEmployee)}.`}\n\n### 💡 Staffing Recommendations\n**Hiring:** Consider hiring when rev/employee exceeds benchmark by 20%+ or when customer count grows 30%+.\n**Optimization:** Use automation for tasks taking more than 10 hours/week per employee.\n\nWould you like a detailed staffing plan?`;
    }

    // ── INVEST / FUNDING ────────────────────────────────────────────
    if (intents[0] === 'invest') {
      const annualRev = entry.revenue * 12;
      return `## Investment & Funding Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n### 💰 Funding Readiness\n\n**Business Health Check:**\n- Annual Run Rate: **${money(annualRev)}/yr**\n- Profit Margin: **${margin}%**\n- Growth Rate: **${pct(growth.revenueGrowth)}**\n\n### 📈 Investor View\n${parseFloat(margin) > 20 && growth.revenueGrowth > 10 ? '✅ Your business looks like a strong investment candidate — good margins + strong growth.' : parseFloat(margin) > 10 || growth.revenueGrowth > 5 ? '🟡 You have potential — improving margins or growth would strengthen your case.' : '🔴 Focus on improving fundamentals before seeking investment.'}\n\n### 🏦 Funding Options\n- **Bootstrapping:** ${parseFloat(margin) > 15 ? 'Achievable — good margin supports reinvestment' : 'Challenging — consider improving margin first'}\n- **Business Loan:** Typical terms: 8-15% APR, requires 2+ years of operation\n- **Angel/VC:** Requires 20%+ MoM growth or strong IP\n- **Grants:** Check local small business grants (often non-dilutive)\n\nWant me to build a financial projection for investors?`;
    }

    // ── DEFAULT (GENERAL ANALYSIS) ──────────────────────────────────
    const summary = analysis?.summary || '';
    const actionableItems = [];
    if (highLeaks.length > 0) actionableItems.push(`Fix "${highLeaks[0].problem}" — recover **${money(highLeaks[0].estimatedLoss)}/mo**`);
    if (growth.expenseGrowth > growth.revenueGrowth) actionableItems.push('Reduce expense growth to match revenue growth');
    if (parseFloat(margin) < benchmark.avgMargin) actionableItems.push(`Improve margin from ${margin}% to ${benchmark.avgMargin}% (adds ${money(Math.round(entry.revenue * (benchmark.avgMargin - parseFloat(margin)) / 100))}/mo)`);
    if (actionableItems.length < 3 && focusImprove.length > 0) actionableItems.push(focusImprove[0].action);
    if (actionableItems.length < 3) actionableItems.push(`Increase customer base to grow revenue by **${money(Math.round(entry.revenue * 0.15))}/mo**`);

    return `## Business Analysis\n\n📊 **Current State:**\n${dataSnapshot()}\n\n${summary ? `**${summary}**\n\n` : ''}**🧠 Analysis:**\nYour business is ${growth.profitGrowth > 10 ? 'performing strongly with solid profit growth' : growth.revenueGrowth > 5 ? 'growing steadily with room to improve profitability' : growth.revenueGrowth > 0 ? 'growing modestly — there are opportunities to accelerate' : 'facing a revenue decline that needs attention'}.\n\n**🎯 Recommended Next Steps**\n${actionableItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n**💰 Total Addressable Impact:** ${money(Math.round(totalLeakLoss * 1.5 + entry.revenue * 0.05))}/mo\n\nI can analyze specific areas in more detail:\n- 💰 Revenue growth & pricing\n- ✂️ Cost reduction & expenses\n- 📈 Marketing & customer acquisition\n- 🔄 Customer retention\n- 🎯 Priority focus & action planning\n\nWhat would you like to explore further?`;
  }

  // ── CHAT STATE ────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>(() => {
    if (!entry) return [{
      id: 1, role: 'assistant' as const,
      content: `Welcome to **Nexora Advisor**! 👋\n\nI'm your AI business consultant. To get started, please add your first month of business data in the **Data Entry** section. Once I have your data, I'll provide personalized analysis and recommendations.\n\nFeel free to ask me general business questions in the meantime!`,
      timestamp: new Date(),
    }];
    return [{
      id: 1, role: 'assistant' as const,
      content: `Welcome to **Nexora Advisor**! 👋 I've analyzed your business data.\n\n📊 **Quick Summary:**\n- Revenue: **${money(entry.revenue)}/mo**\n- Profit: **${money(entry.profit)}/mo** (${margin}% margin)\n- Score: **${analysis?.profitScore || 0}/100**\n- Leaks: **${leaks.length}** (${money(totalLeakLoss)}/mo)\n- Growth: **${pct(growth.revenueGrowth)}** revenue, **${pct(growth.profitGrowth)}** profit\n\nI use your actual data ${entry.currency !== 'USD' ? `(${entry.currency}) ` : ''}and industry benchmarks to give personalized advice. Ask me about:\n💰 Revenue & pricing\n✂️ Costs & expenses\n📈 Marketing & growth\n🔄 Customer retention\n🎯 Focus & priorities\n\nWhat would you like to dive into?`,
      timestamp: new Date(),
    }];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [askedCount, setAskedCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dynamic suggested questions based on context and conversation
  const suggestedQuestions = useMemo(() => {
    const qs: string[] = [];
    if (!entry) {
      qs.push('How do I add my first month of data?');
      qs.push('What can you help me with?');
      qs.push('How does Nexora analyze my business?');
      return qs;
    }
    if (askedCount === 0) {
      if (highLeaks.length > 0) qs.push(`How do I fix the "${highLeaks[0].problem}" leak?`);
      qs.push(growth.revenueGrowth < 5 ? 'How can I accelerate revenue growth?' : 'How do I maintain my growth momentum?');
      qs.push(parseFloat(margin) < benchmark.avgMargin ? 'How can I improve my profit margins?' : 'How can I optimize my pricing?');
      qs.push('What should I focus on this month?');
      qs.push(growth.expenseGrowth > growth.revenueGrowth ? 'My expenses are growing too fast — help!' : 'Create an action plan for this quarter');
    } else {
      qs.push('What are my biggest profit leaks?');
      qs.push('How does my business compare to industry benchmarks?');
      qs.push('Should I raise my prices?');
      qs.push('How can I reduce customer churn?');
      qs.push('What does my 6-month forecast look like?');
    }
    return qs;
  }, [growth, margin, benchmark, entry, highLeaks, askedCount, leaks.length]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setAskedCount(prev => prev + 1);

    setTimeout(() => {
      const response = generateResponse(text);
      const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className={line.startsWith('- ') ? 'ml-4 mt-0.5' : line.startsWith('|') ? 'text-xs mt-0.5' : 'mt-1'}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} className="ml-4 mt-0.5">{line}</p>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mt-1">{line}</p>;
    });
  };

  // Only Enterprise plan can access the advisor
  if (user?.plan !== 'enterprise') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-nexora-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-nexora-500/20">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Nexora Advisor</h2>
        <p className="text-gray-500">The Nexora Advisor is an Enterprise-only feature. Upgrade to get personalized AI-powered business analysis and recommendations.</p>
        <div className="flex flex-col items-center gap-3">
          <button onClick={() => { try { localStorage.setItem('nexora-desired-plan', 'enterprise'); } catch {} onNavigate?.('upgrade'); }} className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-nexora-500/20">
            Upgrade to Enterprise
          </button>
          <button onClick={() => onNavigate?.('dashboard')} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Back to Dashboard
          </button>
        </div>
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 text-xs text-gray-500 text-left">
          <strong className="text-amber-700 dark:text-amber-400">Enterprise features include:</strong>
          <ul className="mt-2 space-y-1">
            <li>• AI-powered business analysis & recommendations</li>
            <li>• Personalized profit optimization strategies</li>
            <li>• Revenue growth & pricing intelligence</li>
            <li>• Competitive benchmarking & gap analysis</li>
            <li>• Unlimited team members & dedicated account manager</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <Brain className="w-6 h-6 text-nexora-500" />
            Nexora Advisor
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI business consultant powered by your actual data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {entry ? `${entry.currency || 'USD'}` : 'No data'}
          </div>
          <button onClick={() => { setMessages([messages[0]]); setAskedCount(0); }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="New conversation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Context Banner */}
      {entry && (
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-nexora-50 dark:bg-nexora-950/30 border border-nexora-100 dark:border-nexora-900/40 mb-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <BarChart3 className="w-3.5 h-3.5 text-nexora-500" />
            <span className="font-medium">{entry.industry}</span>
          </div>
          <div className="w-px h-4 bg-nexora-200 dark:bg-nexora-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
            <span>{money(entry.revenue)}/mo</span>
          </div>
          <div className="w-px h-4 bg-nexora-200 dark:bg-nexora-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <Target className="w-3.5 h-3.5 text-nexora-500" />
            <span>Score: <strong>{analysis?.profitScore || 0}</strong>/100</span>
          </div>
          <div className="w-px h-4 bg-nexora-200 dark:bg-nexora-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Leaks: <strong className="text-red-500">{leaks.length}</strong> ({money(totalLeakLoss)}/mo)</span>
          </div>
          <div className="w-px h-4 bg-nexora-200 dark:bg-nexora-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            {growth.revenueGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-green-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
            <span>{pct(growth.revenueGrowth)} MoM</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60 mb-4">
        <div className="p-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'gradient-bg' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-white" /> : <span className="text-sm font-bold">{userInitials}</span>}
              </div>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-nexora-500 text-white rounded-tr-md' : 'bg-gray-100 dark:bg-gray-700/60 rounded-tl-md'}`}>
                  {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                </div>
                {msg.role === 'assistant' && msg.id > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700/60 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-400">Analyzing your data...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-gray-500">Personalized Questions{askedCount > 0 ? ' (continued)' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium hover:border-nexora-300 dark:hover:border-nexora-700 hover:bg-nexora-50 dark:hover:bg-nexora-950/30 transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-nexora-500 focus-within:border-transparent transition-all">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask Nexora about your business..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl gradient-bg text-white hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
