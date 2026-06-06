import Card from '../components/ui/Card';
import { Shield } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-nexora-500" />
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Admin Panel</h1>
          <p className="text-sm text-gray-500">Platform management and analytics</p>
        </div>
      </div>

      <Card>
        <div className="text-center py-16">
          <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">No admin data available</h3>
          <p className="text-sm text-gray-400">Admin metrics, user management, and system monitoring data will appear here once available.</p>
        </div>
      </Card>
    </div>
  );
}
