'use client';
import { Card, Button, Input, Wizard } from '@eumetise/ui';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdmitPatientPage() {
    return (
        <div className="max-w-3xl mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/patients">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-5 h-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-page-heading font-haas-disp">Admit Patient</h1>
                    <p className="text-gray-500">Create a new virtual ward episode.</p>
                </div>
            </div>

            <Wizard steps={['Demographics', 'Clinical Condition', 'Device Setup', 'Confirm']} currentStep={0} />

            <Card className="p-8 space-y-6">
                <h3 className="text-lg font-bold">Patient Demographics</h3>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="Jane" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Doe" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input type="date" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">NHS / MRN Number</label>
                        <Input placeholder="123-456-7890" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Home Address (Device Delivery)</label>
                    <Input placeholder="123 Main St, London" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input type="tel" placeholder="+44 7700 900000" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email (App Invite)</label>
                        <Input type="email" placeholder="jane.doe@email.com" />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <Button variant="primary" className="w-32">Next Step</Button>
                </div>
            </Card>
        </div>
    );
}