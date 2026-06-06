import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FileText, Clock } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'generated' | 'templates'>('generated');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <FileText className="w-6 h-6 text-nexora-500" />
            Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-generated reports and business intelligence documents</p>
        </div>
        <Button size="sm">
          <FileText className="w-4 h-4" /> Generate New Report
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 w-fit">
        {[
          { key: 'generated' as const, label: 'Generated Reports' },
          { key: 'templates' as const, label: 'Report Templates' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key ? 'bg-white dark:bg-gray-700 shadow-sm text-nexora-600 dark:text-nexora-400' : 'text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'generated' ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">No reports yet</h3>
          <p className="text-sm text-gray-400 mb-6">Generate your first report to see it here.</p>
          <Button size="sm">
            <FileText className="w-4 h-4" /> Generate New Report
          </Button>
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">No templates available</h3>
          <p className="text-sm text-gray-400">Report templates will appear here once available.</p>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Recent Report Activity
        </h3>
        <p className="text-sm text-gray-500 text-center py-6">No recent activity.</p>
      </Card>
    </div>
  );
}
