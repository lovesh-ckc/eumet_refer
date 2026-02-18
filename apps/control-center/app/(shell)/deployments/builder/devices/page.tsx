'use client';
import { Card, Badge, Button, Input } from '@eumetise/ui';
import { Search, ToggleRight, ToggleLeft, Watch, Smartphone, Wifi } from 'lucide-react';

const availableDevices = [
    { id: 1, name: 'Apple Watch', type: 'Wearable', category: 'Activity & Heart', supported: true, enabled: true },
    { id: 2, name: 'Omron Evolv', type: 'Bluetooth', category: 'Blood Pressure', supported: true, enabled: true },
    { id: 3, name: 'Withings Body+', type: 'Wi-Fi', category: 'Weight Scale', supported: true, enabled: false },
    { id: 4, name: 'Biobeat Chest Patch', type: 'Wearable', category: 'Multi-vital', supported: true, enabled: false },
    { id: 5, name: 'Nonin 3230', type: 'Bluetooth', category: 'SpO2', supported: true, enabled: true },
];

export default function DevicesBuilderPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold font-haas-disp">Device Integration</h2>
                    <p className="text-gray-500">Select supported hardware for this deployment.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input className="pl-9" placeholder="Search devices..." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDevices.map(device => (
                    <Card key={device.id} className={`p-4 transition-all ${device.enabled ? 'border-accent-300 shadow-sm' : 'opacity-80'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${device.enabled ? 'bg-accent-50 text-accent-600' : 'bg-gray-100 text-gray-400'}`}>
                                {device.type === 'Wearable' ? <Watch className="w-6 h-6"/> : device.type === 'Wi-Fi' ? <Wifi className="w-6 h-6"/> : <Smartphone className="w-6 h-6"/>}
                            </div>
                            <button className={`text-2xl ${device.enabled ? 'text-success-500' : 'text-gray-300'}`}>
                                {device.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                            </button>
                        </div>
                        <h3 className="font-bold text-gray-900">{device.name}</h3>
                        <p className="text-sm text-gray-500">{device.category}</p>
                        <div className="mt-4 flex items-center gap-2">
                             <Badge variant={device.supported ? 'success' : 'warning'}>{device.supported ? 'Certified' : 'Beta'}</Badge>
                             <span className="text-xs text-gray-400">{device.type}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}