'use client';
import { Card, Button, Badge } from '@eumetise/ui';
import { Wifi, Database, Battery, DownloadCloud, LogOut } from 'lucide-react';

export default function TabletSettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
             <h1 className="text-sub-heading font-haas-disp">Device Settings</h1>
             
             <Card className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">NS</div>
                    <div>
                        <h3 className="font-bold text-lg">Nurse Station iPad 04</h3>
                        <p className="text-sm text-gray-500">Last login: Today, 08:00 AM</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="text-error-600 border-error-200 hover:bg-error-50">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
             </Card>

             <div className="space-y-2">
                <p className="text-sm font-bold text-gray-500 uppercase ml-1">Sync & Storage</p>
                <Card className="divide-y divide-gray-100">
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Wifi className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">Sync only on Wi-Fi</span>
                        </div>
                        <input type="checkbox" className="w-5 h-5 accent-accent-500" defaultChecked />
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <DownloadCloud className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium">Offline Patient Data</p>
                                <p className="text-xs text-gray-400">Cache last 30 days of active patients</p>
                            </div>
                        </div>
                        <Badge variant="success">Downloaded</Badge>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium">Local Storage</p>
                                <p className="text-xs text-gray-400">Using 145MB of 2GB Limit</p>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost">Clear Cache</Button>
                    </div>
                </Card>
             </div>

             <div className="space-y-2">
                <p className="text-sm font-bold text-gray-500 uppercase ml-1">Diagnostics</p>
                <Card className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Battery className="w-5 h-5 text-success-500" />
                        <span className="font-medium">Battery Optimization</span>
                    </div>
                    <span className="text-sm text-gray-500">Normal</span>
                </Card>
             </div>

             <div className="text-center pt-8">
                <p className="text-xs text-gray-400">EUMETISE Care Hub v2.1.0 (Build 4920)</p>
                <p className="text-xs text-gray-400">Device ID: 8990-2131-1122</p>
             </div>
        </div>
    );
}