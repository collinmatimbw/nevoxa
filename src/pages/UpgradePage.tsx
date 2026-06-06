import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth, PLAN_PRICES } from '../contexts/AuthContext';
import { Zap, Shield, Check, ChevronRight, Smartphone, Send, CheckCircle2, Clock } from 'lucide-react';

const MOBILE_MONEY_OPTIONS = [
  { id: 'mpesa', label: 'M-Pesa (Vodacom)', number: '0762 123 456' },
  { id: 'tigo', label: 'Tigo Pesa', number: '0689 123 456' },
  { id: 'airtel', label: 'Airtel Money', number: '0678 123 456' },
  { id: 'halopesa', label: 'HaloPesa', number: '0625 123 456' },
];

const PLAN_FEATURES: Record<string, string[]> = {
  pro: ['Unlimited data entries', 'Advanced profit leak detection', 'Growth simulator', 'Nexora AI Advisor', 'Email support'],
  business: ['Everything in Pro', 'Team collaboration (up to 5)', 'Custom benchmarks', 'Priority support', 'API access'],
  enterprise: ['Everything in Business', 'Unlimited team members', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
};

export default function UpgradePage() {
  const { user, trackedUsers, requestUpgrade } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | 'enterprise'>(() => {
    try { const p = localStorage.getItem('nexora-desired-plan'); if (p === 'pro' || p === 'business' || p === 'enterprise') { localStorage.removeItem('nexora-desired-plan'); return p; } } catch {}
    return 'pro';
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [submitted, setSubmitted] = useState(false);

  const trackedUser = trackedUsers.find(u => u.email === user?.email);
  const paymentStatus = trackedUser?.paymentStatus || 'none';

  const handleUpgrade = () => {
    if (user?.email) {
      requestUpgrade(user.email, selectedPlan);
      setSubmitted(true);
    }
  };

  if (paymentStatus === 'pending' || submitted) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold">Payment Pending</h2>
          <p className="text-sm text-gray-500 mt-1">Your upgrade request has been submitted. The admin will confirm your payment shortly.</p>
        </div>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Requested plan: <strong className="text-nexora-500 capitalize">{trackedUser?.selectedPlan || selectedPlan}</strong></p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Status: <span className="text-amber-500 font-medium">Awaiting admin confirmation</span></p>
          <p className="text-xs text-gray-400 mt-4">Please allow up to 24 hours for payment confirmation. You will be able to add more data once approved.</p>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'approved') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">You're Upgraded!</h2>
          <p className="text-sm text-gray-500 mt-1">Your {trackedUser?.plan} plan is active. Enjoy unlimited data entries and all features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-6 h-6 text-nexora-500" />
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Upgrade Your Plan</h1>
          <p className="text-sm text-gray-500">You've hit the free plan limit (2 entries). Choose a plan to continue adding data.</p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['pro', 'business', 'enterprise'] as const).map(plan => (
          <button
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`relative p-6 rounded-2xl text-left border-2 transition-all ${
              selectedPlan === plan
                ? 'border-nexora-500 bg-nexora-50/50 dark:bg-nexora-950/20 shadow-lg shadow-nexora-500/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {plan === 'pro' && <Shield className="w-8 h-8 text-nexora-500 mb-3" />}
            {plan === 'business' && <Shield className="w-8 h-8 text-blue-500 mb-3" />}
            {plan === 'enterprise' && <Shield className="w-8 h-8 text-purple-500 mb-3" />}
            <h3 className="text-lg font-bold capitalize">{plan}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">${PLAN_PRICES[plan]}</span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
            <ul className="space-y-2">
              {PLAN_FEATURES[plan].map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {selectedPlan === plan && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-nexora-500 rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Payment Method */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-nexora-500" />
          Payment Method — Mobile Money (Tanzania)
        </h3>
        <p className="text-sm text-gray-500 mb-4">Select your mobile money provider and send the payment to the account shown.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {MOBILE_MONEY_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setPaymentMethod(opt.id)}
              className={`p-3 rounded-xl text-center border transition-all ${
                paymentMethod === opt.id
                  ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-medium">{opt.label}</div>
            </button>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium text-sm mb-1">
            <Send className="w-4 h-4" />
            Send payment to:
          </div>
          <div className="text-2xl font-bold text-amber-800 dark:text-amber-300 font-mono tracking-wider">
            {MOBILE_MONEY_OPTIONS.find(o => o.id === paymentMethod)?.number}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Reference: <strong className="font-mono">{user?.email}</strong>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">After payment, click the button below. Admin will confirm and activate your plan.</p>
        <Button onClick={handleUpgrade} icon={<ChevronRight className="w-4 h-4" />}>
          I've Paid — Confirm Upgrade
        </Button>
      </div>
    </div>
  );
}
