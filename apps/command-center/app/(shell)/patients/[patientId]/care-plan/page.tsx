'use client';
import { Card, Button, Badge, Input } from '@eumetise/ui';
import { Activity, Bell, Clock, Save, Trash2, Plus } from 'lucide-react';

const monitoringRules = [
    { id: 1, metric: 'SpO2', threshold: '< 92%', freq: 'Daily (Morning)', priority: 'High', active: true },
    { id: 2, metric: 'Body Weight', threshold: '> 2kg gain / 3 days', freq: 'Daily', priority: 'Medium', active: true },
    { id: 3, metric: 'Systolic BP', threshold: '> 140 mmHg', freq: 'Weekly', priority: 'Medium', active: false },
];

export default function CarePlanPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-haas-disp">Active Care Plan</h2>
                    <p className="text-gray-500">Virtual Ward A - Cardiac Monitoring (v2.4)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Reset to Template</Button>
                    <Button icon={Save}>Save Changes</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Monitoring Rules (Thresholds)</h3>
                            <Button size="sm" variant="ghost" className="text-accent-600"><Plus className="w-4 h-4 mr-1"/> Add Rule</Button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {monitoringRules.map(rule => (
                                <div key={rule.id} className={`p-4 flex items-center justify-between ${!rule.active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${rule.active ? 'bg-accent-50 text-accent-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900">{rule.metric}</h4>
                                                {!rule.active && <Badge variant="default">Paused</Badge>}
                                            </div>
                                            <p className="text-sm text-gray-500">Alert if <span className="font-mono font-medium text-gray-700">{rule.threshold}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Clock className="w-3 h-3" /> {rule.freq}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600 justify-end mt-1">
                                                <Bell className="w-3 h-3" /> {rule.priority} Priority
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-error-500 hover:text-error-600 hover:bg-error-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-gray-700 mb-4">Medication Schedule</h3>
                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-500 text-sm">
                            <p>Medication management is handled via the <span className="font-medium text-gray-900">Hospital Pharmacy System (HL7)</span>.</p>
                            <p className="mt-2">External sync active. Last sync: 10 mins ago.</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-5 bg-base-black text-white">
                        <h3 className="font-bold text-lg mb-2">Program Status</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Start Date</p>
                                <p className="font-medium">Oct 12, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Projected Discharge</p>
                                <p className="font-medium">Nov 15, 2023</p>
                            </div>
                            <div className="pt-4 border-t border-gray-700">
                                <Button className="w-full bg-error-600 hover:bg-error-700 text-white border-none">Discharge Patient</Button>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-5">
                        <h3 className="font-bold text-gray-700 mb-3">Care Team</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">JD</div>
                                <div className="text-sm">
                                    <p className="font-bold">Dr. John Dorian</p>
                                    <p className="text-gray-500">Lead Physician</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">ET</div>
                                <div className="text-sm">
                                    <p className="font-bold">Nurse Elliot</p>
                                    <p className="text-gray-500">Care Coordinator</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2">Manage Team</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}