'use client';
import { Card, Badge, Button, DataTable } from '@eumetise/ui';
import { Pill, AlertCircle, CheckCircle } from 'lucide-react';

const meds = [
    { id: '1', name: 'Amoxicillin', dose: '500mg', freq: '3x Daily', adherence: 98, status: 'Active' },
    { id: '2', name: 'Lisinopril', dose: '10mg', freq: '1x Daily', adherence: 100, status: 'Active' },
    { id: '3', name: 'Metformin', dose: '500mg', freq: '2x Daily', adherence: 85, status: 'Review Needed' },
];

export default function MedicationsPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
                <Card className="p-4 flex items-center gap-4 bg-success-50 border-success-100">
                    <div className="p-3 bg-white rounded-full text-success-600"><CheckCircle className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500">Overall Adherence</p>
                        <p className="text-2xl font-bold text-success-700">94%</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full text-gray-600"><Pill className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500">Active Scripts</p>
                        <p className="text-2xl font-bold">4</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-warning-50 border-warning-100">
                    <div className="p-3 bg-white rounded-full text-warning-600"><AlertCircle className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500">Missed Doses (7d)</p>
                        <p className="text-2xl font-bold text-warning-700">2</p>
                    </div>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Prescription List</h3>
                    <Button variant="outline" size="sm">History</Button>
                </div>
                <DataTable 
                    data={meds}
                    columns={[
                        { header: 'Medication', accessorKey: 'name', cell: (row) => (
                            <div>
                                <p className="font-bold text-gray-900">{row.name}</p>
                                <p className="text-xs text-gray-500">{row.dose} • {row.freq}</p>
                            </div>
                        )},
                        { header: 'Adherence', accessorKey: 'adherence', cell: (row) => (
                            <div className="w-full max-w-[100px]">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>{row.adherence}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${row.adherence > 90 ? 'bg-success-500' : 'bg-warning-500'}`} 
                                        style={{ width: `${row.adherence}%` }} 
                                    />
                                </div>
                            </div>
                        )},
                        { header: 'Status', accessorKey: 'status', cell: (row) => (
                            <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>
                        )}
                    ]}
                />
            </Card>
        </div>
    );
}