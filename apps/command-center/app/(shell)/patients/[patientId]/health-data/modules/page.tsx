'use client';
import { Card, Badge, Button } from '@eumetise/ui';
import { Watch, Wifi, Battery, RotateCw, Bluetooth } from 'lucide-react';

const devices = [
    { id: 1, name: 'Apple Watch Series 8', type: 'Wearable', status: 'Connected', lastSync: '2 mins ago', battery: 82 },
    { id: 2, name: 'Omron BP Monitor', type: 'Bluetooth', status: 'Disconnected', lastSync: '2 days ago', battery: 15 },
    { id: 3, name: 'Withings Scale', type: 'Wi-Fi', status: 'Connected', lastSync: 'Today, 8:00 AM', battery: 100 },
];

export default function ModulesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-haas-disp">Connected Devices</h2>
                <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Pair Device</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map(dev => (
                    <Card key={dev.id} className="p-5 flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-lg ${dev.status === 'Connected' ? 'bg-accent-100 text-accent-600' : 'bg-gray-100 text-gray-400'}`}>
                                {dev.type === 'Wearable' ? <Watch className="w-6 h-6"/> : dev.type === 'Bluetooth' ? <Bluetooth className="w-6 h-6"/> : <Wifi className="w-6 h-6"/>}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{dev.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Badge variant={dev.status === 'Connected' ? 'success' : 'error'}>{dev.status}</Badge>
                                    <span>• {dev.lastSync}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <div className={`flex items-center text-xs font-medium ${dev.battery < 20 ? 'text-error-500' : 'text-success-600'}`}>
                                <Battery className="w-3 h-3 mr-1" /> {dev.battery}%
                             </div>
                             <Button variant="ghost" size="sm"><RotateCw className="w-4 h-4"/></Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function Plus(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}