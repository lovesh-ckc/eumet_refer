'use client';
import { useEffect, useState } from 'react';
import { controlClient } from '@eumetise/api';
import { Button, Badge, Card } from '@eumetise/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);

  useEffect(() => {
    controlClient.getOrgs().then(setOrgs).catch(() => {
        setOrgs([
            { id: '1', name: 'St. Marys Hospital', region: 'UK-South', status: 'Active', tiers: 'Enterprise' },
            { id: '2', name: 'Apollo Ind.', region: 'IN-West', status: 'Active', tiers: 'Pro' },
            { id: '3', name: 'Kaiser Permanente', region: 'US-West', status: 'Onboarding', tiers: 'Enterprise' },
        ]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-page-heading font-haas-disp">Organizations</h2>
           <p className="text-gray-500">Manage tenants and regional configuration.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Organization
        </Button>
      </div>

      <div className="grid gap-4">
        {orgs.map((org) => (
          <Link href={`/orgs/${org.id}`} key={org.id}>
            <Card className="flex items-center justify-between p-6 hover:shadow-md hover:border-accent-300 transition-all cursor-pointer">
                <div>
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold font-haas-disp">{org.name}</h3>
                    <Badge variant={org.status === 'Active' ? 'success' : 'warning'}>{org.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">Region: {org.region} • Tier: {org.tiers}</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}