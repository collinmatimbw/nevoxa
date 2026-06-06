export const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 31000, profit: 11000 },
  { month: 'Feb', revenue: 45000, expenses: 29500, profit: 15500 },
  { month: 'Mar', revenue: 48000, expenses: 32000, profit: 16000 },
  { month: 'Apr', revenue: 51000, expenses: 30000, profit: 21000 },
  { month: 'May', revenue: 55000, expenses: 33500, profit: 21500 },
  { month: 'Jun', revenue: 58000, expenses: 34000, profit: 24000 },
  { month: 'Jul', revenue: 62000, expenses: 35000, profit: 27000 },
  { month: 'Aug', revenue: 66000, expenses: 36500, profit: 29500 },
  { month: 'Sep', revenue: 71000, expenses: 37000, profit: 34000 },
  { month: 'Oct', revenue: 74000, expenses: 38000, profit: 36000 },
  { month: 'Nov', revenue: 78000, expenses: 39500, profit: 38500 },
  { month: 'Dec', revenue: 84000, expenses: 41000, profit: 43000 },
];

export const kpiData = {
  revenue: { value: 84000, change: 12.5, trend: 'up' as const },
  profit: { value: 43000, change: 18.2, trend: 'up' as const },
  expenses: { value: 41000, change: 3.8, trend: 'down' as const },
  growthRate: { value: 15.3, change: 2.1, trend: 'up' as const },
  cac: { value: 127, change: -8.4, trend: 'up' as const },
  ltv: { value: 2840, change: 14.2, trend: 'up' as const },
  retention: { value: 89.3, change: 3.2, trend: 'up' as const },
  conversion: { value: 4.7, change: 0.8, trend: 'up' as const },
  cashFlow: { value: 156000, change: 22.1, trend: 'up' as const },
};

export const profitScore = {
  overall: 74,
  categories: [
    { name: 'Pricing', score: 82, icon: '💰' },
    { name: 'Marketing', score: 68, icon: '📢' },
    { name: 'Operations', score: 71, icon: '⚙️' },
    { name: 'Retention', score: 85, icon: '🔄' },
    { name: 'Cash Flow', score: 79, icon: '💵' },
    { name: 'Growth', score: 63, icon: '📈' },
    { name: 'Efficiency', score: 76, icon: '⚡' },
  ],
};

export const profitLeaks = [
  { id: 1, category: 'Marketing', issue: 'Facebook Ads campaign "Summer Sale" has 0.3% CTR', impact: 4200, severity: 'high', recommendation: 'Pause campaign and reallocate budget to Google Ads (2.1% CTR)' },
  { id: 2, category: 'Operations', issue: 'Duplicate SaaS subscriptions detected (Slack + Teams)', impact: 1800, severity: 'medium', recommendation: 'Consolidate to one platform — save $150/month' },
  { id: 3, category: 'Pricing', issue: 'Enterprise tier underpriced by 23% vs competitors', impact: 12400, severity: 'critical', recommendation: 'Increase enterprise pricing from $299 to $399/month' },
  { id: 4, category: 'Products', issue: 'Widget Pro has -8% margin after support costs', impact: 6800, severity: 'high', recommendation: 'Reduce support overhead or discontinue product' },
  { id: 5, category: 'Staffing', issue: 'Customer support overstaffed during off-peak hours', impact: 3200, severity: 'medium', recommendation: 'Implement shift optimization — reduce to 2 agents off-peak' },
  { id: 6, category: 'Inventory', issue: 'Excess inventory holding costs on 3 SKUs', impact: 2100, severity: 'low', recommendation: 'Run clearance promotion or bundle with popular items' },
];

export const focusRecommendations = {
  stop: [
    { id: 1, action: 'Stop running Facebook retargeting ads to cold audiences', impact: '$2,400/mo saved', priority: 'high' },
    { id: 2, action: 'Stop offering free shipping on orders under $25', impact: '$1,800/mo saved', priority: 'medium' },
    { id: 3, action: 'Stop maintaining the legacy API v1 endpoint', impact: '$900/mo saved', priority: 'low' },
  ],
  keep: [
    { id: 1, action: 'Keep the referral program — 34% of new customers', impact: '$12,400/mo revenue', priority: 'high' },
    { id: 2, action: 'Keep weekly email newsletter — 18% open rate', impact: '$3,200/mo revenue', priority: 'medium' },
    { id: 3, action: 'Keep the annual billing discount — 67% choose annual', impact: '$8,900/mo revenue', priority: 'high' },
  ],
  improve: [
    { id: 1, action: 'Improve onboarding flow — 42% drop off at step 3', impact: '+$5,600/mo potential', priority: 'critical' },
    { id: 2, action: 'Improve checkout page speed (currently 4.2s)', impact: '+$3,100/mo potential', priority: 'high' },
    { id: 3, action: 'Improve customer support response time (avg 4.2hrs)', impact: '+$2,800/mo retention', priority: 'medium' },
  ],
  automate: [
    { id: 1, action: 'Automate invoice generation and follow-ups', impact: '12 hrs/week saved', priority: 'high' },
    { id: 2, action: 'Automate social media posting schedule', impact: '8 hrs/week saved', priority: 'medium' },
    { id: 3, action: 'Automate customer onboarding emails', impact: '6 hrs/week saved', priority: 'medium' },
  ],
  scale: [
    { id: 1, action: 'Scale Google Ads — currently 3.2x ROAS', impact: '+$18,000/mo potential', priority: 'critical' },
    { id: 2, action: 'Scale enterprise sales team — 89% close rate', impact: '+$24,000/mo potential', priority: 'high' },
    { id: 3, action: 'Scale into European market — low competition', impact: '+$36,000/mo potential', priority: 'high' },
  ],
};

export const actionPlans = {
  '7day': [
    { day: 'Day 1-2', tasks: ['Pause underperforming Facebook ads', 'Audit all SaaS subscriptions', 'Review pricing against competitors'] },
    { day: 'Day 3-4', tasks: ['Implement checkout page optimizations', 'Set up automated invoice system', 'Update enterprise pricing tier'] },
    { day: 'Day 5-7', tasks: ['Launch A/B test on onboarding flow', 'Scale Google Ads budget by 20%', 'Schedule team meeting to review changes'] },
  ],
  '30day': [
    { day: 'Week 1', tasks: ['Complete all Day 1-7 actions', 'Hire part-time data analyst', 'Begin European market research'] },
    { day: 'Week 2', tasks: ['Redesign onboarding flow based on A/B test', 'Implement customer feedback system', 'Launch referral program v2'] },
    { day: 'Week 3', tasks: ['Automate social media content pipeline', 'Optimize support team shift scheduling', 'Launch clearance sale for excess inventory'] },
    { day: 'Week 4', tasks: ['Review all KPIs against baselines', 'Prepare investor performance report', 'Plan Q2 growth strategy'] },
  ],
  '90day': [
    { day: 'Month 1', tasks: ['Execute all 30-day plan items', 'Achieve 15% reduction in CAC', 'Increase conversion rate to 5.5%'] },
    { day: 'Month 2', tasks: ['Launch in 2 European markets', 'Hire enterprise sales rep', 'Implement AI-powered customer support'] },
    { day: 'Month 3', tasks: ['Scale to $100K monthly revenue', 'Achieve 92% customer retention', 'Prepare Series A documentation'] },
  ],
};

export const chatMessages = [
  { id: 1, role: 'assistant' as const, content: "Welcome to Nexora AI Advisor! 👋 I've analyzed your business data and I'm ready to help you optimize your profits. I can see several opportunities to increase your revenue by up to 28% this quarter. What would you like to focus on?" },
];

export const expenseBreakdown = [
  { name: 'Marketing', value: 12800, color: '#22c55e' },
  { name: 'Salaries', value: 15200, color: '#16a34a' },
  { name: 'Software', value: 4800, color: '#4ade80' },
  { name: 'Operations', value: 3600, color: '#86efac' },
  { name: 'Office', value: 2400, color: '#bbf7d0' },
  { name: 'Other', value: 2200, color: '#dcfce7' },
];

export const customerSegments = [
  { segment: 'Enterprise', customers: 24, revenue: 38400, ltv: 8900, retention: 94 },
  { segment: 'Mid-Market', customers: 156, revenue: 28600, ltv: 3200, retention: 88 },
  { segment: 'Small Biz', customers: 420, revenue: 12600, ltv: 1400, retention: 82 },
  { segment: 'Startup', customers: 280, revenue: 4400, ltv: 680, retention: 71 },
];

export const marketingChannels = [
  { channel: 'Google Ads', spend: 4200, revenue: 13440, roas: 3.2, leads: 340 },
  { channel: 'Facebook Ads', spend: 3100, revenue: 4030, roas: 1.3, leads: 120 },
  { channel: 'Email', spend: 400, revenue: 8800, roas: 22.0, leads: 210 },
  { channel: 'Organic', spend: 1200, revenue: 18600, roas: 15.5, leads: 480 },
  { channel: 'Referral', spend: 800, revenue: 12400, roas: 15.5, leads: 180 },
  { channel: 'LinkedIn', spend: 2100, revenue: 5460, roas: 2.6, leads: 95 },
];

export const alerts = [
  { id: 1, type: 'warning', title: 'Revenue Dip Detected', message: 'Weekly revenue dropped 8% compared to previous week average.', time: '2 hours ago', read: false },
  { id: 2, type: 'success', title: 'Profit Goal Achieved', message: 'You\'ve hit your monthly profit target of $40,000! 🎉', time: '1 day ago', read: false },
  { id: 3, type: 'danger', title: 'Marketing Spend Alert', message: 'Facebook Ads spend exceeded budget by 15% with declining ROAS.', time: '1 day ago', read: true },
  { id: 4, type: 'info', title: 'New Opportunity', message: 'Competitor "XYZ Corp" just increased prices by 20% — potential market opportunity.', time: '3 days ago', read: true },
  { id: 5, type: 'warning', title: 'Churn Risk Identified', message: '12 enterprise customers showing reduced engagement this month.', time: '4 days ago', read: true },
];

export const industries = [
  { name: 'SaaS', icon: '💻', description: 'Software as a Service' },
  { name: 'E-commerce', icon: '🛒', description: 'Online Retail' },
  { name: 'Agency', icon: '🏢', description: 'Marketing & Creative' },
  { name: 'Retail', icon: '🏪', description: 'Physical Retail' },
  { name: 'Restaurant', icon: '🍽️', description: 'Food & Beverage' },
  { name: 'Manufacturing', icon: '🏭', description: 'Production' },
  { name: 'Freelancer', icon: '👤', description: 'Solo Business' },
  { name: 'Service', icon: '🔧', description: 'Service Business' },
  { name: 'Startup', icon: '🚀', description: 'Early Stage' },
  { name: 'Enterprise', icon: '🏛️', description: 'Large Corporation' },
];

export const simulationDefaults = {
  priceChange: 0,
  costReduction: 0,
  newHires: 0,
  adSpendChange: 0,
  newProducts: 0,
  newMarkets: 0,
};
