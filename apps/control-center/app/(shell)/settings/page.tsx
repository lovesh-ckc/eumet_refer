'use client';
import { Card, Input, Button } from '@eumetise/ui';
import { Shield, Database, Palette } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-page-heading font-haas-disp">Platform Settings</h2>
                <p className="text-gray-500">Global configuration for the EUMETISE instance.</p>
            </div>

            <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg"><Palette className="w-6 h-6 text-gray-700" /></div>
                    <div>
                        <h3 className="font-bold text-lg">White Labeling</h3>
                        <p className="text-sm text-gray-500">Customize the tenant branding defaults.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Platform Name</label>
                        <Input defaultValue="EUMETISE Virtual Ward" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Support Email</label>
                        <Input defaultValue="support@eumetise.com" />
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg"><Shield className="w-6 h-6 text-gray-700" /></div>
                    <div>
                        <h3 className="font-bold text-lg">Security Policies</h3>
                        <p className="text-sm text-gray-500">Enforce global authentication standards.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Enforce MFA for all clinical roles</span>
                        <input type="checkbox" className="w-5 h-5 accent-base-black" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Session Timeout (minutes)</span>
                        <Input className="w-24 h-8" defaultValue="15" type="number" />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="ghost">Discard</Button>
                <Button>Save Configuration</Button>
            </div>
        </div>
    );
}