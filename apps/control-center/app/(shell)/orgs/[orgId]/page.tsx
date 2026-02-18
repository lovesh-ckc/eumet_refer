'use client';
import { Card, Button, Badge, DataTable, StatCard } from '@eumetise/ui';
import { ArrowLeft, Building2, MapPin, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function OrgDetailPage({ params }: { params: { orgId: string } }) {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Link href="/orgs">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-5 h-5" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-hero-subtitle font-haas-disp">St. Marys Hospital</h1>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" /> London, UK • Enterprise Tier
                    </p>
                </div>
                <Button variant="outline">Edit Configuration</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Patients" value="1,204" trend={5} icon={Users} />
                <StatCard label="Active Deployments" value="3" icon={Activity} />
                <StatCard label="Clinician Seats" value="45/50" icon={Users} />
                <StatCard label="Storage Used" value="450 GB" icon={Building2} />
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-lg">Active Deployments</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {[
                        { name: 'Virtual Ward A - Cardiac', patients: 45, version: 'v2.4.0' },
                        { name: 'Virtual Ward B - Respiratory', patients: 28, version: 'v2.3.1' }
                    ].map((dep, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-900">{dep.name}</h4>
                                <p className="text-sm text-gray-500">Version: {dep.version}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{dep.patients} Active Patients</p>
                                <Link href="/deployments/builder" className="text-sm text-accent-600 hover:underline">Configure</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}