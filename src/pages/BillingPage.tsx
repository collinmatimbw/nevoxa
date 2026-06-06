import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { usePlatform, PlanTier } from '../contexts/PlatformContext';
import { CreditCard, Zap, Crown, Building2, Rocket } from 'lucide-react';

export default function BillingPage() {
  const { subscription, upgradePlan, toggleBillingCycle, team } = usePlatform();
  const [showPlans, setShowPlans] = useState(false);

  const plans: { tier: PlanTier; name: string; icon: any }[] = [
    { tier: 'free', name: 'Free', icon: <Zap className="w-5 h-5" /> },
    { tier: 'pro', name: 'Pro', icon: <Rocket className="w-5 h-5" /> },
    { tier: 'business', name: 'Business', icon: <Building2 className="w-5 h-5" /> },
    { tier: 'enterprise', name: 'Enterprise', icon: <Crown className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div><h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2"><CreditCard className="w-6 h-6 text-nexora-500" /> Billing & Plans</h1><p className="text-sm text-gray-500 mt-1">Manage your subscription and billing</p></div>

      {/* Current Plan */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1"><h3 className="text-lg font-bold capitalize">{subscription.plan} Plan</h3><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-nexora-100 dark:bg-nexora-900/30 text-nexora-700 dark:text-nexora-400">{subscription.status.toUpperCase()}</span></div>
            <p className="text-sm text-gray-500">Billed {subscription.billingCycle} • {team.filter(t => t.status === 'active').length}/{subscription.seats} seats used</p>
            {subscription.currentPeriodEnd && <p className="text-xs text-gray-400 mt-1">Current period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toggleBillingCycle()}>{subscription.billingCycle === 'monthly' ? 'Switch to Annual (Save 20%)' : 'Switch to Monthly'}</Button>
            <Button size="sm" onClick={() => setShowPlans(!showPlans)}>{showPlans ? 'Hide Plans' : 'Change Plan'}</Button>
          </div>
        </div>
      </Card>

      {/* Plan Selector */}
      {showPlans && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => {
            const isActive = plan.tier === subscription.plan;
            return (
              <Card key={plan.tier} className={`${plan.tier === 'business' && !isActive ? '!border-nexora-500 ring-2 ring-nexora-500/20' : ''} ${isActive ? '!border-nexora-500 !bg-nexora-50 dark:!bg-nexora-950/30' : ''}`}>
                <div className="text-center mb-4">{plan.icon}<h3 className="text-lg font-bold mt-2">{plan.name}</h3></div>
                <Button size="sm" className="w-full" variant={isActive ? 'secondary' : 'outline'} disabled={isActive} onClick={() => upgradePlan(plan.tier)}>
                  {isActive ? 'Current Plan' : plan.tier === 'enterprise' ? 'Contact Sales' : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* No payment method or billing history available yet */}
      <Card>
        <div className="text-center py-8 text-sm text-gray-500">
          No payment method or billing history available.
        </div>
      </Card>
    </div>
  );
}
