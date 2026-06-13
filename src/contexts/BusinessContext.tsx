import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrency } from '../data/currencies';
import { api } from '../utils/api';

// ── TYPES ──────────────────────────────────────────────────────────────
export interface BusinessEntry {
  _id: string; id?: string; date: string; revenue: number; expenses: number; profit: number;
  industry: string; employeeCount: number; customerCount: number;
  adSpend: number; productCount: number; topProduct: string; notes: string;
  currency: string;
}

export interface LeakFinding {
  id: string; entryId: string;
  category: 'revenue' | 'expenses' | 'operations' | 'marketing' | 'products' | 'staffing';
  problem: string; impact: 'low' | 'medium' | 'high';
  estimatedLoss: number; recommendation: string;
  status: 'open' | 'resolved' | 'dismissed'; detectedAt: string;
}

export interface FocusItem {
  id: string; type: 'stop' | 'keep' | 'improve';
  action: string; reasoning: string; impact: string;
  priority: 'low' | 'medium' | 'high' | 'critical'; createdAt: string;
}

export interface ProfitScoreBreakdown {
  overall: number;
  pricing: { score: number; explanation: string };
  marketing: { score: number; explanation: string };
  operations: { score: number; explanation: string };
  retention: { score: number; explanation: string };
  cashFlow: { score: number; explanation: string };
  growth: { score: number; explanation: string };
  profitability: { score: number; explanation: string };
}

export interface Opportunity {
  id: string; category: 'revenue' | 'cost' | 'pricing' | 'retention' | 'marketing';
  title: string; description: string; potentialImpact: number;
  ease: 'easy' | 'moderate' | 'hard'; timeToResults: string;
  priority: number;
}

export interface Goal {
  _id: string; title: string; type: 'revenue' | 'profit' | 'expenses' | 'retention' | 'growth' | 'custom';
  targetValue: number; currentValue: number; unit: string;
  deadline: string; createdAt: string; status: 'active' | 'completed' | 'missed';
}

export interface ActionPlanItem {
  id: string; task: string; priority: 'critical' | 'high' | 'medium' | 'low';
  expectedImpact: string; difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; category: string;
}

export interface ActionPlan {
  sevenDay: ActionPlanItem[];
  thirtyDay: ActionPlanItem[];
  ninetyDay: ActionPlanItem[];
  longTerm: ActionPlanItem[];
}

export interface IndustryBenchmark {
  industry: string; avgMargin: number; avgGrowth: number; avgAdRatio: number;
  avgRevenuePerEmployee: number; tips: string[];
}

export interface AnalysisRecord {
  _id: string; entryId: string; date: string;
  profitScore: number; profitScoreBreakdown: ProfitScoreBreakdown;
  revenueGrowth: number; expenseGrowth: number; profitGrowth: number; profitMargin: number;
  summary: string; leaks: LeakFinding[]; focusItems: FocusItem[];
  opportunities: Opportunity[];
}

// ── INDUSTRY BENCHMARKS ────────────────────────────────────────────────
export const industryBenchmarks: Record<string, IndustryBenchmark> = {
  SaaS:          { industry:'SaaS',          avgMargin:55, avgGrowth:12, avgAdRatio:10, avgRevenuePerEmployee:8000, tips:['Focus on reducing churn below 5%','Optimize MRR expansion through upselling','Invest in product-led growth','Aim for LTV:CAC ratio above 3:1'] },
  'E-commerce':  { industry:'E-commerce',    avgMargin:25, avgGrowth:15, avgAdRatio:18, avgRevenuePerEmployee:12000, tips:['Optimize conversion rate above 3%','Reduce cart abandonment with retargeting','Implement dynamic pricing','Focus on average order value growth'] },
  Agency:        { industry:'Agency',        avgMargin:35, avgGrowth:8, avgAdRatio:5,  avgRevenuePerEmployee:9000,  tips:['Increase billable utilization above 70%','Move to value-based pricing','Build recurring revenue streams','Standardize delivery processes'] },
  Retail:        { industry:'Retail',        avgMargin:20, avgGrowth:5, avgAdRatio:8,  avgRevenuePerEmployee:10000, tips:['Optimize inventory turnover rate','Implement loyalty programs','Focus on store-level profitability','Negotiate better supplier terms'] },
  Restaurant:    { industry:'Restaurant',    avgMargin:12, avgGrowth:4, avgAdRatio:6,  avgRevenuePerEmployee:5500,  tips:['Optimize table turnover rate','Analyze menu item profitability','Reduce food waste below 5%','Implement dynamic pricing for peak hours'] },
  Manufacturing: { industry:'Manufacturing', avgMargin:18, avgGrowth:6, avgAdRatio:3,  avgRevenuePerEmployee:15000, tips:['Reduce downtime below 5%','Optimize supply chain costs','Implement lean manufacturing','Focus on quality to reduce returns'] },
  Freelancer:    { industry:'Freelancer',    avgMargin:60, avgGrowth:10, avgAdRatio:5, avgRevenuePerEmployee:7000,  tips:['Raise rates quarterly','Build passive income streams','Specialize in high-value niches','Productize your services'] },
  Service:       { industry:'Service',       avgMargin:30, avgGrowth:7, avgAdRatio:8,  avgRevenuePerEmployee:6500,  tips:['Increase client retention above 85%','Implement tiered service pricing','Automate scheduling and billing','Focus on customer lifetime value'] },
  Startup:       { industry:'Startup',       avgMargin:15, avgGrowth:25, avgAdRatio:20, avgRevenuePerEmployee:6000, tips:['Prioritize product-market fit','Keep burn rate below 18 months runway','Focus on one acquisition channel first','Build virality into the product'] },
  Enterprise:    { industry:'Enterprise',    avgMargin:40, avgGrowth:8, avgAdRatio:6,  avgRevenuePerEmployee:20000, tips:['Optimize department-level P&L','Negotiate volume discounts','Invest in process automation','Focus on enterprise customer retention'] },
};

// ── ENGINE FUNCTIONS ───────────────────────────────────────────────────
const cs = (e: BusinessEntry) => getCurrency(e.currency).symbol;
const generateLeaks = (entry: BusinessEntry, prev?: BusinessEntry): LeakFinding[] => {
  const leaks: LeakFinding[] = [];
  const margin = entry.profit / entry.revenue;
  const adRatio = entry.adSpend / entry.revenue;
  const bench = industryBenchmarks[entry.industry] || industryBenchmarks.SaaS;
  const targetMargin = bench.avgMargin / 100;
  const id = entry._id;

  if (adRatio > bench.avgAdRatio / 100 * 1.2) {
    leaks.push({ id:`lk-${id}-1`, entryId:id, category:'marketing', problem:`Ad spend is ${(adRatio*100).toFixed(1)}% of revenue — above ${bench.industry} benchmark of ${bench.avgAdRatio}%`, impact: adRatio > bench.avgAdRatio/100*1.5 ? 'high' : 'medium', estimatedLoss:Math.round(entry.adSpend*0.3), recommendation:'Audit underperforming channels. Shift budget to high-ROAS campaigns.', status:'open', detectedAt:entry.date });
  }
  if (prev && entry.expenses > prev.expenses * 1.08) {
    leaks.push({ id:`lk-${id}-2`, entryId:id, category:'expenses', problem:`Expenses grew ${((entry.expenses-prev.expenses)/prev.expenses*100).toFixed(1)}% MoM — faster than revenue`, impact:'high', estimatedLoss:Math.round(entry.expenses-prev.expenses*1.05), recommendation:'Review new expense items. Defer non-essential spending.', status:'open', detectedAt:entry.date });
  }
  if (margin < targetMargin) {
    leaks.push({ id:`lk-${id}-3`, entryId:id, category:'revenue', problem:`Profit margin ${(margin*100).toFixed(1)}% — below ${bench.industry} target of ${bench.avgMargin}%`, impact:'high', estimatedLoss:Math.round(entry.revenue*(targetMargin-margin)), recommendation:'Evaluate pricing strategy or reduce COGS.', status:'open', detectedAt:entry.date });
  }
  if (entry.customerCount > 0 && entry.revenue/entry.customerCount < 80) {
    leaks.push({ id:`lk-${id}-4`, entryId:id, category:'revenue', problem:`ARPU is ${cs(entry)}${(entry.revenue/entry.customerCount).toFixed(0)}/mo — below ${cs(entry)}80 target`, impact:'medium', estimatedLoss:Math.round((80-entry.revenue/entry.customerCount)*entry.customerCount), recommendation:'Upsell higher tiers. Add usage-based pricing.', status:'open', detectedAt:entry.date });
  }
  if (entry.employeeCount > 0 && entry.revenue/entry.employeeCount < bench.avgRevenuePerEmployee*0.8) {
    leaks.push({ id:`lk-${id}-5`, entryId:id, category:'staffing', problem:`Revenue/employee ${cs(entry)}${(entry.revenue/entry.employeeCount).toFixed(0)}/mo — below ${cs(entry)}${bench.avgRevenuePerEmployee} benchmark`, impact:'medium', estimatedLoss:Math.round((bench.avgRevenuePerEmployee*0.8-entry.revenue/entry.employeeCount)*entry.employeeCount), recommendation:'Automate tasks or redistribute workload.', status:'open', detectedAt:entry.date });
  }
  if (entry.productCount >= 5) {
    leaks.push({ id:`lk-${id}-6`, entryId:id, category:'products', problem:`${entry.productCount} products may spread resources thin`, impact:'low', estimatedLoss:Math.round(entry.revenue*0.03), recommendation:'Sunset products below 5% revenue contribution.', status:'open', detectedAt:entry.date });
  }
  const opsCost = entry.expenses - entry.adSpend;
  if (opsCost/entry.revenue > 0.35) {
    leaks.push({ id:`lk-${id}-7`, entryId:id, category:'operations', problem:`Operating costs ${((opsCost/entry.revenue)*100).toFixed(1)}% of revenue — above 35% threshold`, impact:'medium', estimatedLoss:Math.round(opsCost-entry.revenue*0.35), recommendation:'Review subscriptions and overhead.', status:'open', detectedAt:entry.date });
  }
  return leaks;
};

const generateFocusItems = (entry: BusinessEntry, leaks: LeakFinding[], prev?: BusinessEntry): FocusItem[] => {
  const items: FocusItem[] = [];
  const now = entry.date;
  const id = entry._id;
  leaks.filter(l => l.impact === 'high' && l.category === 'marketing').forEach(l => {
    items.push({ id:`f-stop-${l.id}`, type:'stop', action:'Stop spending on low-ROAS advertising channels', reasoning:l.problem, impact:`Save ~${cs(entry)}${l.estimatedLoss.toLocaleString()}/mo`, priority:'high', createdAt:now });
  });
  if (leaks.find(l => l.category === 'products')) items.push({ id:`f-stop-prod-${id}`, type:'stop', action:'Stop investing in underperforming products', reasoning:'Products diluting focus', impact:'Recover bandwidth', priority:'medium', createdAt:now });
  if (prev && entry.revenue > prev.revenue) items.push({ id:`f-keep-rev-${id}`, type:'keep', action:`Keep sales strategy — revenue grew ${((entry.revenue-prev.revenue)/prev.revenue*100).toFixed(1)}%`, reasoning:'Upward trajectory', impact:`${cs(entry)}${entry.revenue.toLocaleString()}/mo`, priority:'high', createdAt:now });
  if (prev && entry.customerCount > prev.customerCount) items.push({ id:`f-keep-cust-${id}`, type:'keep', action:'Keep acquisition efforts — added customers', reasoning:'Growing customer base', impact:`${entry.customerCount} total`, priority:'high', createdAt:now });
  items.push({ id:`f-keep-core-${id}`, type:'keep', action:`Keep ${entry.topProduct} as priority`, reasoning:'Top revenue driver', impact:'Core revenue', priority:'critical', createdAt:now });
  if (entry.adSpend/entry.revenue > 0.10) items.push({ id:`f-imp-ads-${id}`, type:'improve', action:'Improve ad spend efficiency', reasoning:`Ad ratio ${(entry.adSpend/entry.revenue*100).toFixed(1)}%`, impact:`Save ${cs(entry)}${Math.round(entry.adSpend*0.2).toLocaleString()}/mo`, priority:'high', createdAt:now });
  if (entry.employeeCount > 10) items.push({ id:`f-imp-auto-${id}`, type:'improve', action:'Automate repetitive tasks', reasoning:`${entry.employeeCount} employees`, impact:'15-20 hrs/week saved', priority:'medium', createdAt:now });
  items.push({ id:`f-imp-price-${id}`, type:'improve', action:'Benchmark pricing vs competitors', reasoning:'Quarterly review', impact:'10-20% margin potential', priority:'high', createdAt:now });
  return items;
};

const generateProfitScore = (entry: BusinessEntry, prev?: BusinessEntry, leaks?: LeakFinding[]): ProfitScoreBreakdown => {
  const bench = industryBenchmarks[entry.industry] || industryBenchmarks.SaaS;
  const margin = (entry.profit/entry.revenue)*100;
  const revGrowth = prev ? ((entry.revenue-prev.revenue)/prev.revenue)*100 : 0;
  const adRatio = (entry.adSpend/entry.revenue)*100;
  const revPerEmp = entry.employeeCount > 0 ? entry.revenue/entry.employeeCount : 10000;
  const openLeaks = (leaks||[]).filter(l=>l.status==='open');

  const pricing = Math.min(100, Math.max(10, margin >= bench.avgMargin ? 85 + Math.min(15,(margin-bench.avgMargin)/2) : 40 + (margin/bench.avgMargin)*45));
  const marketing = Math.min(100, Math.max(10, adRatio <= bench.avgAdRatio ? 80 + Math.min(20,(bench.avgAdRatio-adRatio)*2) : 80 - (adRatio-bench.avgAdRatio)*4));
  const operations = Math.min(100, Math.max(10, revPerEmp >= bench.avgRevenuePerEmployee ? 85 : 40 + (revPerEmp/bench.avgRevenuePerEmployee)*45));
  const retention = Math.min(100, Math.max(10, prev && entry.customerCount >= prev.customerCount ? 75 + Math.min(25,((entry.customerCount-prev.customerCount)/prev.customerCount)*200) : 50));
  const cashFlow = Math.min(100, Math.max(10, margin > 30 ? 70 + Math.min(30, margin-30) : 30 + margin*1.3));
  const growth = Math.min(100, Math.max(10, revGrowth > bench.avgGrowth ? 80 + Math.min(20,(revGrowth-bench.avgGrowth)) : 40 + (revGrowth/Math.max(1,bench.avgGrowth))*40));
  const profitability = Math.min(100, Math.max(10, margin >= bench.avgMargin*0.9 ? 80 + Math.min(20, (margin-bench.avgMargin*0.9)*2) : 30 + (margin/(bench.avgMargin*0.9))*50));
  let overall = Math.round((pricing+marketing+operations+retention+cashFlow+growth+profitability)/7);
  overall -= openLeaks.filter(l=>l.impact==='high').length * 3;
  overall -= openLeaks.filter(l=>l.impact==='medium').length * 1;
  overall = Math.max(10, Math.min(98, overall));

  return {
    overall,
    pricing:{ score:Math.round(pricing), explanation: pricing >= 75 ? `Pricing is ${pricing>=85?'strong':'adequate'} vs ${bench.industry} benchmarks.` : `Pricing needs work — margin ${margin.toFixed(1)}% vs ${bench.avgMargin}% industry avg.` },
    marketing:{ score:Math.round(marketing), explanation: marketing >= 75 ? 'Ad spend ratio is healthy.' : `Ad spend ${adRatio.toFixed(1)}% exceeds ${bench.avgAdRatio}% benchmark.` },
    operations:{ score:Math.round(operations), explanation: operations >= 75 ? 'Operational efficiency is strong.' : `Revenue/employee ${cs(entry)}${revPerEmp.toFixed(0)} is below ${cs(entry)}${bench.avgRevenuePerEmployee} target.` },
    retention:{ score:Math.round(retention), explanation: retention >= 75 ? 'Customer retention is healthy.' : 'Customer growth is slow — focus on retention.' },
    cashFlow:{ score:Math.round(cashFlow), explanation: cashFlow >= 75 ? 'Cash flow position is strong.' : 'Low margins put pressure on cash reserves.' },
    growth:{ score:Math.round(growth), explanation: growth >= 75 ? `Growing at ${revGrowth.toFixed(1)}% — above ${bench.avgGrowth}% avg.` : `Growth at ${revGrowth.toFixed(1)}% — below ${bench.avgGrowth}% avg.` },
    profitability:{ score:Math.round(profitability), explanation: profitability >= 75 ? 'Profitability is strong.' : 'Profitability below industry benchmarks.' },
  };
};

const generateOpportunities = (entry: BusinessEntry, prev?: BusinessEntry, _leaks?: LeakFinding[]): Opportunity[] => {
  const ops: Opportunity[] = [];
  const bench = industryBenchmarks[entry.industry] || industryBenchmarks.SaaS;
  const margin = (entry.profit/entry.revenue)*100;
  const id = entry._id;

  if (margin < bench.avgMargin) ops.push({ id:`op-price-${id}`, category:'pricing', title:'Pricing optimization', description:`Your margin (${margin.toFixed(1)}%) is below the ${bench.avgMargin}% ${bench.industry} average. A 10% price increase could add ${cs(entry)}${Math.round(entry.revenue*0.08).toLocaleString()}/mo in profit.`, potentialImpact:Math.round(entry.revenue*0.08), ease:'moderate', timeToResults:'30-60 days', priority:9 });
  if (entry.adSpend/entry.revenue > bench.avgAdRatio/100) ops.push({ id:`op-mktg-${id}`, category:'marketing', title:'Marketing channel optimization', description:`Shift ad spend from low-ROAS to high-ROAS channels.`, potentialImpact:Math.round(entry.adSpend*0.25), ease:'easy', timeToResults:'14-30 days', priority:8 });
  ops.push({ id:`op-upsell-${id}`, category:'revenue', title:'Customer upselling program', description:`With ${entry.customerCount} customers, a 10% upsell rate at 50% higher ARPU adds ${cs(entry)}${Math.round(entry.revenue*0.05).toLocaleString()}/mo.`, potentialImpact:Math.round(entry.revenue*0.05), ease:'moderate', timeToResults:'30-60 days', priority:7 });
  if (prev && entry.customerCount > 0) {
    const churnEst = prev.customerCount > 0 ? Math.max(0, 1-(entry.customerCount-30)/(prev.customerCount)) : 0.05;
    if (churnEst > 0.03) ops.push({ id:`op-ret-${id}`, category:'retention', title:'Churn reduction program', description:`Estimated churn ~${(churnEst*100).toFixed(1)}%. Reducing by 2 points retains ~${Math.round(entry.customerCount*0.02)} customers.`, potentialImpact:Math.round(entry.revenue*0.02), ease:'moderate', timeToResults:'60-90 days', priority:7 });
  }
  ops.push({ id:`op-cost-${id}`, category:'cost', title:'Expense optimization audit', description:`A 5% reduction in non-ad expenses saves ${cs(entry)}${Math.round((entry.expenses-entry.adSpend)*0.05).toLocaleString()}/mo.`, potentialImpact:Math.round((entry.expenses-entry.adSpend)*0.05), ease:'easy', timeToResults:'7-14 days', priority:6 });
  ops.push({ id:`op-auto-${id}`, category:'cost', title:'Automation investment', description:`Automating invoicing, onboarding, and reporting could save 20+ hours/week.`, potentialImpact:Math.round(entry.expenses*0.03), ease:'hard', timeToResults:'60-90 days', priority:5 });
  bench.tips.slice(0,2).forEach((tip,i) => {
    ops.push({ id:`op-ind-${id}-${i}`, category: i===0?'revenue':'pricing', title:`${bench.industry} insight: ${tip.substring(0,40)}`, description:tip, potentialImpact:Math.round(entry.revenue*0.02), ease:'moderate', timeToResults:'30-90 days', priority:4 });
  });
  return ops.sort((a,b)=>b.priority-a.priority);
};

const generateActionPlan = (entry: BusinessEntry, leaks: LeakFinding[], _opps: Opportunity[], bench: IndustryBenchmark): ActionPlan => {
  const plan: ActionPlan = { sevenDay:[], thirtyDay:[], ninetyDay:[], longTerm:[] };
  plan.sevenDay.push({ id:'7d-1', task:'Audit all marketing channels — pause anything below 2x ROAS', priority:'critical', expectedImpact:`Save ${cs(entry)}${Math.round(entry.adSpend*0.15).toLocaleString()}/mo`, difficulty:'easy', estimatedTime:'2-3 hours', category:'Marketing' });
  plan.sevenDay.push({ id:'7d-2', task:'Review and cancel duplicate software subscriptions', priority:'high', expectedImpact:`${cs(entry)}200-${cs(entry)}500/mo savings`, difficulty:'easy', estimatedTime:'1 hour', category:'Operations' });
  plan.sevenDay.push({ id:'7d-3', task:'Benchmark pricing against top 3 competitors', priority:'high', expectedImpact:'Identify 10-25% pricing gap', difficulty:'easy', estimatedTime:'2-3 hours', category:'Pricing' });
  if (leaks.length > 0) plan.sevenDay.push({ id:'7d-4', task:`Fix top profit leak: "${leaks[0].problem.substring(0,60)}"`, priority:'critical', expectedImpact:`Recover ${cs(entry)}${leaks[0].estimatedLoss.toLocaleString()}/mo`, difficulty:'medium', estimatedTime:'4-8 hours', category:'Profit Recovery' });
  plan.sevenDay.push({ id:'7d-5', task:'Set up automated weekly KPI reporting', priority:'medium', expectedImpact:'2 hrs/week saved', difficulty:'easy', estimatedTime:'1-2 hours', category:'Operations' });
  plan.thirtyDay.push({ id:'30d-1', task:`Implement ${bench.industry}-specific optimization: ${bench.tips[0]}`, priority:'high', expectedImpact:`+${cs(entry)}${Math.round(entry.revenue*0.03).toLocaleString()}/mo`, difficulty:'medium', estimatedTime:'1-2 weeks', category:'Strategy' });
  plan.thirtyDay.push({ id:'30d-2', task:'Launch customer upselling campaign', priority:'high', expectedImpact:`+${cs(entry)}${Math.round(entry.revenue*0.05).toLocaleString()}/mo`, difficulty:'medium', estimatedTime:'1 week', category:'Revenue' });
  plan.thirtyDay.push({ id:'30d-3', task:'Implement one key automation', priority:'medium', expectedImpact:'10+ hrs/week saved', difficulty:'medium', estimatedTime:'1-2 weeks', category:'Operations' });
  plan.thirtyDay.push({ id:'30d-4', task:'Design and launch customer feedback survey', priority:'medium', expectedImpact:'Reduce churn by 1-2%', difficulty:'easy', estimatedTime:'3-4 hours', category:'Retention' });
  plan.thirtyDay.push({ id:'30d-5', task:'A/B test pricing page', priority:'high', expectedImpact:'+5-15% conversion', difficulty:'medium', estimatedTime:'1 week', category:'Pricing' });
  plan.ninetyDay.push({ id:'90d-1', task:'Achieve profit margin above industry benchmark', priority:'critical', expectedImpact:`Reach ${bench.avgMargin}%+ margin`, difficulty:'hard', estimatedTime:'Full quarter', category:'Profitability' });
  plan.ninetyDay.push({ id:'90d-2', task:'Build customer loyalty/referral program', priority:'high', expectedImpact:'+15-25% organic acquisition', difficulty:'hard', estimatedTime:'4-6 weeks', category:'Growth' });
  plan.ninetyDay.push({ id:'90d-3', task:'Scale highest-ROAS channel by 50%', priority:'high', expectedImpact:`+${cs(entry)}${Math.round(entry.revenue*0.08).toLocaleString()}/mo`, difficulty:'medium', estimatedTime:'Ongoing', category:'Marketing' });
  plan.ninetyDay.push({ id:'90d-4', task:'Implement churn prediction and proactive outreach', priority:'medium', expectedImpact:'-30% churn rate', difficulty:'hard', estimatedTime:'4-6 weeks', category:'Retention' });
  plan.longTerm.push({ id:'lt-1', task:`Scale to ${cs(entry)}${Math.round(entry.revenue*2/1000)}K/mo revenue`, priority:'critical', expectedImpact:'Double the business', difficulty:'hard', estimatedTime:'12-18 months', category:'Growth' });
  plan.longTerm.push({ id:'lt-2', task:'Expand into adjacent market or geography', priority:'high', expectedImpact:'+30-50% addressable market', difficulty:'hard', estimatedTime:'6-12 months', category:'Expansion' });
  plan.longTerm.push({ id:'lt-3', task:'Build competitive moat', priority:'high', expectedImpact:'Sustainable advantage', difficulty:'hard', estimatedTime:'6-18 months', category:'Strategy' });
  plan.longTerm.push({ id:'lt-4', task:'Achieve operational excellence', priority:'medium', expectedImpact:'40%+ efficiency gain', difficulty:'hard', estimatedTime:'12-24 months', category:'Operations' });
  return plan;
};

const generateAnalysis = (entry: BusinessEntry, prev?: BusinessEntry, leaks?: LeakFinding[], focus?: FocusItem[]): AnalysisRecord => {
  const revenueGrowth = prev ? ((entry.revenue-prev.revenue)/prev.revenue)*100 : 0;
  const expenseGrowth = prev ? ((entry.expenses-prev.expenses)/prev.expenses)*100 : 0;
  const profitGrowth = prev ? ((entry.profit-prev.profit)/prev.profit)*100 : 0;
  const profitMargin = (entry.profit/entry.revenue)*100;
  const scoreBreakdown = generateProfitScore(entry, prev, leaks);
  const openLeaks = (leaks||[]).filter(l=>l.status==='open');
  const opportunities = generateOpportunities(entry, prev, leaks);
  const summary = revenueGrowth > 0
    ? `Revenue grew ${revenueGrowth.toFixed(1)}% to $${entry.revenue.toLocaleString()}. Margin ${profitMargin.toFixed(1)}%. ${openLeaks.length} leak${openLeaks.length!==1?'s':''} detected. ${opportunities.length} opportunities identified.`
    : `Revenue declined ${Math.abs(revenueGrowth).toFixed(1)}%. Immediate attention on ${openLeaks.length} leak${openLeaks.length!==1?'s':''}.`;
  return { _id:`a-${entry._id}`, entryId:entry._id, date:entry.date, profitScore:scoreBreakdown.overall, profitScoreBreakdown:scoreBreakdown, revenueGrowth, expenseGrowth, profitGrowth, profitMargin, summary, leaks:leaks||[], focusItems:focus||[], opportunities };
};

// ── CONTEXT INTERFACE ──────────────────────────────────────────────────
interface BusinessContextType {
  entries: BusinessEntry[]; analyses: AnalysisRecord[];
  currentEntry: BusinessEntry | null; currentAnalysis: AnalysisRecord | null;
  allLeaks: LeakFinding[]; allFocusItems: FocusItem[];
  goals: Goal[]; addGoal: (g: Omit<Goal,'_id'|'createdAt'|'status'>) => void; updateGoal: (id:string, updates:Partial<Goal>) => void; deleteGoal: (id:string) => void;
  addEntry: (entry: Omit<BusinessEntry,'_id'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryAnalysis: (id:string) => AnalysisRecord | undefined;
  getTrends: () => { date:string; revenue:number; expenses:number; profit:number; margin:number; score:number }[];
  getGrowthRates: () => { revenueGrowth:number; expenseGrowth:number; profitGrowth:number; marginDelta:number };
  getActionPlan: () => ActionPlan;
  getIndustryBenchmark: () => IndustryBenchmark;
  getForecast: (months:number) => { date:string; revenue:number; expenses:number; profit:number }[];
  loading: boolean;
}

const BusinessContext = createContext<BusinessContextType>({
  entries:[], analyses:[], currentEntry:null, currentAnalysis:null,
  allLeaks:[], allFocusItems:[], goals:[],
  addGoal:()=>{}, updateGoal:()=>{}, deleteGoal:()=>{},
  addEntry:async ()=>{}, deleteEntry:async ()=>{}, getEntryAnalysis:()=>undefined,
  getTrends:()=>[], getGrowthRates:()=>({revenueGrowth:0,expenseGrowth:0,profitGrowth:0,marginDelta:0}),
  getActionPlan:()=>({sevenDay:[],thirtyDay:[],ninetyDay:[],longTerm:[]}),
  getIndustryBenchmark:()=>industryBenchmarks.SaaS,
  getForecast:()=>[], loading: true,
});

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<BusinessEntry[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/business/entries').then(setEntries).catch(() => {}),
      api.get('/business/analyses').then(setAnalyses).catch(() => {}),
      api.get('/business/goals').then(setGoals).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const currentEntry = entries[entries.length-1]||null;
  const currentAnalysis = analyses[analyses.length-1]||null;
  const allLeaks = analyses.flatMap(a=>a.leaks);
  const allFocusItems = analyses.length > 0 ? analyses[analyses.length-1].focusItems : [];

  const addEntry = async (d: Omit<BusinessEntry,'_id'>) => {
    const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry: BusinessEntry = { ...d, _id: localId, id: localId };
    const pv = entries[entries.length-1];
    const lk = generateLeaks(entry, pv);
    const fc = generateFocusItems(entry, lk, pv);
    const analysis: AnalysisRecord = generateAnalysis(entry, pv, lk, fc);
    analysis._id = `a-${localId}`;
    setEntries(p => [...p, entry]);
    setAnalyses(p => [...p, analysis]);
    try {
      const saved = await api.post('/business/entries', d);
      const savedAnalysis = await api.post('/business/analyses', { ...analysis, _id: undefined, entryId: saved._id });
      setEntries(p => p.map(e => e._id === localId ? saved : e));
      setAnalyses(p => p.map(a => a._id === analysis._id ? savedAnalysis : a));
    } catch {
      console.warn('Offline mode — data saved locally but not persisted to server.');
    }
  };

  const deleteEntry = async (id: string) => {
    const isLocal = id.startsWith('local-');
    if (!isLocal) {
      try { await api.delete(`/business/entries/${id}`); } catch {}
    }
    setEntries(p => p.filter(e => e._id !== id && e.id !== id));
    setAnalyses(p => p.filter(a => a.entryId !== id));
  };

  const addGoal = async (g: Omit<Goal,'_id'|'createdAt'|'status'>) => {
    const goal = await api.post('/business/goals', { ...g, createdAt: new Date().toISOString(), status: 'active' });
    setGoals(p => [...p, goal]);
  };

  const updateGoal = async (id: string, u: Partial<Goal>) => {
    const goal = await api.put(`/business/goals/${id}`, u);
    setGoals(p => p.map(g => g._id === id ? goal : g));
  };

  const deleteGoal = async (id: string) => {
    await api.delete(`/business/goals/${id}`);
    setGoals(p => p.filter(g => g._id !== id));
  };

  const getEntryAnalysis = (id:string) => analyses.find(a=>a.entryId===id);
  const getTrends = () => entries.map((e,i)=>({ date:new Date(e.date).toLocaleDateString('en-US',{month:'short',year:'2-digit'}), revenue:e.revenue, expenses:e.expenses, profit:e.profit, margin:Number(((e.profit/e.revenue)*100).toFixed(1)), score:analyses[i]?.profitScore||0 }));
  const getGrowthRates = () => {
    if (entries.length<2) return {revenueGrowth:0,expenseGrowth:0,profitGrowth:0,marginDelta:0};
    const c=entries[entries.length-1], p=entries[entries.length-2];
    return { revenueGrowth:((c.revenue-p.revenue)/p.revenue)*100, expenseGrowth:((c.expenses-p.expenses)/p.expenses)*100, profitGrowth:((c.profit-p.profit)/p.profit)*100, marginDelta:(c.profit/c.revenue)*100-(p.profit/p.revenue)*100 };
  };
  const getActionPlan = () => {
    const e = currentEntry; if(!e) return {sevenDay:[],thirtyDay:[],ninetyDay:[],longTerm:[]};
    const bench = industryBenchmarks[e.industry]||industryBenchmarks.SaaS;
    const lk = currentAnalysis?.leaks||[]; const ops = currentAnalysis?.opportunities||[];
    return generateActionPlan(e,lk,ops,bench);
  };
  const getIndustryBenchmark = () => industryBenchmarks[currentEntry?.industry||'SaaS']||industryBenchmarks.SaaS;
  const getForecast = (months:number) => {
    if (entries.length<2) return [];
    const avgRevGrowth = entries.slice(-3).reduce((s,e,i,a)=>i===0?s:s+((e.revenue-a[i-1].revenue)/a[i-1].revenue),0)/(Math.min(entries.length,3)-1);
    const avgExpGrowth = entries.slice(-3).reduce((s,e,i,a)=>i===0?s:s+((e.expenses-a[i-1].expenses)/a[i-1].expenses),0)/(Math.min(entries.length,3)-1);
    const last = entries[entries.length-1];
    const result: {date:string;revenue:number;expenses:number;profit:number}[] = [];
    for (let m=1;m<=months;m++){
      const d=new Date(last.date); d.setMonth(d.getMonth()+m);
      const rev=Math.round(last.revenue*Math.pow(1+avgRevGrowth,m));
      const exp=Math.round(last.expenses*Math.pow(1+avgExpGrowth,m));
      result.push({ date:d.toLocaleDateString('en-US',{month:'short',year:'2-digit'}), revenue:rev, expenses:exp, profit:rev-exp });
    }
    return result;
  };

  return (
    <BusinessContext.Provider value={{ entries, analyses, currentEntry, currentAnalysis, allLeaks, allFocusItems, goals, addGoal, updateGoal, deleteGoal, addEntry, deleteEntry, getEntryAnalysis, getTrends, getGrowthRates, getActionPlan, getIndustryBenchmark, getForecast, loading }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => useContext(BusinessContext);
