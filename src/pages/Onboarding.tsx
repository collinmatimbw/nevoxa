import { useState } from 'react';
import Button from '../components/ui/Button';
import { Zap, ArrowRight, Check, Building, Target, DollarSign } from 'lucide-react';
import { industries } from '../data/mockData';

interface OnboardingProps {
  onNavigate: (page: string) => void;
}

export default function Onboarding({ onNavigate }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

  const totalSteps = 4;

  const goalOptions = [
    { id: 'profit', label: 'Increase Profit Margins', icon: '💰' },
    { id: 'revenue', label: 'Grow Revenue', icon: '📈' },
    { id: 'costs', label: 'Reduce Costs', icon: '✂️' },
    { id: 'marketing', label: 'Optimize Marketing', icon: '📢' },
    { id: 'retention', label: 'Improve Customer Retention', icon: '🔄' },
    { id: 'pricing', label: 'Optimize Pricing', icon: '🏷️' },
    { id: 'operations', label: 'Streamline Operations', icon: '⚙️' },
    { id: 'scale', label: 'Scale the Business', icon: '🚀' },
  ];

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-subtle">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold font-[family-name:var(--font-display)]">Nexora</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 max-w-md mx-auto mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? 'bg-nexora-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 shadow-xl p-8">
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Building className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold mb-2">What industry are you in?</h2>
                <p className="text-sm text-gray-500">This helps us tailor recommendations to your specific business.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {industries.map(ind => (
                  <button
                    key={ind.name}
                    onClick={() => setSelectedIndustry(ind.name)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedIndustry === ind.name
                        ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{ind.icon}</div>
                    <div className="text-sm font-medium">{ind.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <DollarSign className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold mb-2">What's your monthly revenue?</h2>
                <p className="text-sm text-gray-500">We optimize differently based on business size.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['$0 - $1K', '$1K - $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K - $1M', '$1M - $10M', '$10M+'].map(range => (
                  <button
                    key={range}
                    onClick={() => setRevenueRange(range)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      revenueRange === range
                        ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-lg font-bold">{range}</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Target className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold mb-2">What are your top goals?</h2>
                <p className="text-sm text-gray-500">Select all that apply. We'll prioritize our analysis accordingly.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      goals.includes(goal.id)
                        ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="text-sm font-medium">{goal.label}</span>
                    {goals.includes(goal.id) && <Check className="w-4 h-4 text-nexora-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-2xl font-bold mb-3">You're all set!</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Nexora AI is now analyzing your business profile. Your personalized dashboard is ready with tailored recommendations.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                <div className="p-3 rounded-xl bg-nexora-50 dark:bg-nexora-950/30">
                  <div className="text-lg font-bold text-nexora-600">AI</div>
                  <div className="text-[10px] text-gray-500">Analysis Ready</div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
                  <div className="text-lg font-bold text-green-600">24/7</div>
                  <div className="text-[10px] text-gray-500">AI Advisor</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-lg font-bold text-purple-600">∞</div>
                  <div className="text-[10px] text-gray-500">Insights</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/40">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                Back
              </button>
            ) : (
              <button onClick={() => onNavigate('dashboard')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                Skip setup
              </button>
            )}
            <Button
              onClick={() => step < totalSteps ? setStep(s => s + 1) : onNavigate('dashboard')}
            >
              {step < totalSteps ? 'Continue' : 'Go to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
