import { useState, useRef, useEffect } from 'react';

import { Send, Brain, Sparkles, RotateCcw, Copy, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How can I increase profit margins by 10%?",
  "Which marketing channels should I double down on?",
  "Analyze my customer retention and suggest improvements",
  "What pricing changes would maximize revenue?",
  "Create a 90-day growth strategy for my business",
  "Which expenses can I cut without affecting quality?",
];

const aiResponses: Record<string, string> = {
  default: `Great question! Let me analyze your business data to provide a detailed answer.

Based on your current metrics:

📊 **Key Findings:**
- Your revenue is growing at 15.3% month-over-month, which is strong
- However, your CAC of $127 could be reduced by optimizing your marketing mix
- Your retention rate of 89.3% is good but there's room for improvement

💡 **Recommendations:**
1. **Optimize Facebook Ads** — Currently at 1.3x ROAS. Consider pausing and reallocating to Google Ads (3.2x ROAS)
2. **Increase enterprise pricing** — Your tier is 23% below market rate
3. **Improve onboarding** — 42% drop-off at step 3 is costing you ~$5,600/month in potential revenue

📈 **Expected Impact:**
If you implement all three changes, I project a **+$23,400/month increase in profit** within 60 days.

Would you like me to create a detailed action plan for any of these recommendations?`,

  "How can I increase profit margins by 10%": `Let me analyze the fastest path to increasing your profit margins by 10%.

📊 **Current State:**
- Revenue: $84,000/mo
- Expenses: $41,000/mo  
- Profit Margin: 51.2%
- Target Margin: 56.3% (+10%)

🎯 **Strategy to Reach 56.3% Margin:**

**1. Pricing Optimization (+3.2% margin impact)**
Your enterprise tier is underpriced by 23%. Raising from $299 → $399/mo adds $12,400/yr in pure profit. Estimated churn: <2%.

**2. Marketing Reallocation (+2.1% margin impact)**
- Cut Facebook Ads spend by 50% (save $1,550/mo)
- Redirect to Google Ads (3.2x ROAS vs 1.3x)
- Double down on email marketing (22x ROAS)

**3. Operational Efficiency (+1.8% margin impact)**
- Eliminate duplicate SaaS tools (save $150/mo)
- Optimize support shifts (save $800/mo)
- Automate invoice follow-ups (save 12 hrs/week)

**4. Customer Retention (+2.9% margin impact)**
- Fix onboarding flow (recover $5,600/mo)
- Implement proactive churn detection
- Launch loyalty program for top-tier customers

📈 **Total Projected Margin Increase: +10.0%**
Timeline: 60-90 days for full implementation

Shall I generate a detailed week-by-week implementation plan?`,

  "Which marketing channels should I double down on": `Here's my analysis of your marketing channels:

📊 **Channel Performance Ranking:**

🥇 **Email Marketing — SCALE AGGRESSIVELY**
- ROAS: 22.0x ($400 spend → $8,800 revenue)
- 210 leads/month
- Recommendation: Increase frequency, add segmentation, build automation flows
- Projected impact: +$4,400/mo with just $200 more spend

🥈 **Organic/SEO — SCALE**
- ROAS: 15.5x ($1,200 spend → $18,600 revenue)
- 480 leads/month (highest volume)
- Recommendation: Invest in content team, target high-intent keywords
- Projected impact: +$9,300/mo with $600 more investment

🥉 **Google Ads — OPTIMIZE & SCALE**
- ROAS: 3.2x ($4,200 spend → $13,440 revenue)
- 340 leads/month
- Recommendation: Increase budget by 30%, optimize ad copy and landing pages
- Projected impact: +$4,032/mo revenue

⚠️ **Facebook Ads — REDUCE/PAUSE**
- ROAS: 1.3x ($3,100 spend → $4,030 revenue)
- Only 120 leads/month
- Recommendation: Pause underperforming campaigns, reallocate budget

💰 **Total Projected Impact: +$17,732/mo additional revenue**

Want me to create specific campaign strategies for each channel?`,
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Welcome to Nexora AI Advisor! 👋\n\nI've analyzed your business data and I'm ready to help you optimize profits. I can see several opportunities to increase your revenue by up to 28% this quarter.\n\n**Here's what I can help with:**\n- 📊 Profit optimization strategies\n- 💰 Pricing recommendations\n- 📢 Marketing performance analysis\n- 🔧 Operational efficiency improvements\n- 📈 Growth planning & forecasting\n\nWhat would you like to focus on?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: messages.length + 1,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || aiResponses.default;
      const aiMsg: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="mt-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <p key={i} className="ml-4 mt-0.5">{line}</p>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mt-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <Brain className="w-6 h-6 text-nexora-500" />
            AI Profit Advisor
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your personal AI business consultant — ask anything</p>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          title="New conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-700/40 bg-white dark:bg-gray-800/60 mb-4">
        <div className="p-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'gradient-bg' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-white" /> : <span className="text-sm font-bold">A</span>}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-nexora-500 text-white rounded-tr-md'
                    : 'bg-gray-100 dark:bg-gray-700/60 rounded-tl-md'
                }`}>
                  {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                </div>
                {msg.role === 'assistant' && msg.id > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
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
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <span className="text-xs font-medium text-gray-500">Suggested Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium hover:border-nexora-300 dark:hover:border-nexora-700 hover:bg-nexora-50 dark:hover:bg-nexora-950/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-nexora-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask your AI Advisor anything about your business..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl gradient-bg text-white hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
