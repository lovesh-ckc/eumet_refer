'use client';
import { Card, Badge, Button, Input } from '@eumetise/ui';
import { Search, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const deployments = [
  { id: 'dep-1', name: 'Virtual Ward A - Cardiac', org: 'St. Marys', status: 'Live', version: 'v2.4.0', patients: 45 },
  { id: 'dep-2', name: 'Virtual Ward B - Respiratory', org: 'St. Marys', status: 'Live', version: 'v2.3.1', patients: 28 },
  { id: 'dep-3', name: 'Home Care Pilot', org: 'Apollo Ind.', status: 'Draft', version: 'v1.0.0', patients: 0 },
];

export default function DeploymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-page-heading font-haas-disp">Deployments</h2>
          <p className="text-gray-500">Configure clinical pathways and app interfaces.</p>
        </div>
        <Button>Create Deployment</Button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input className="pl-10" placeholder="Search deployments..." />
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="space-y-4">
        {deployments.map((dep) => (
          <Card key={dep.id} className="p-0 overflow-hidden hover:border-accent-300 transition-colors">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-50 rounded-lg">
                    <Globe className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-haas-disp text-gray-900">{dep.name}</h3>
                  <p className="text-sm text-gray-500">{dep.org} • {dep.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Active Patients</p>
                    <p className="font-bold text-lg">{dep.patients}</p>
                </div>
                <Badge variant={dep.status === 'Live' ? 'success' : 'default'}>{dep.status}</Badge>
                <Link href={`/deployments/builder`}>
                    <Button variant="ghost" size="sm"><ChevronRight className="h-5 w-5" /></Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}