'use client';
import { Card, Badge, DataTable } from '@eumetise/ui';
import { AlertTriangle, Smile, Frown, Meh } from 'lucide-react';

const symptomLogs = [
    { id: '1', date: 'Today, 09:00 AM', type: 'Breathlessness', severity: 'Severe', score: 8, notes: 'Felt dizzy after standing up.' },
    { id: '2', date: 'Yesterday, 08:00 PM', type: 'Fatigue', severity: 'Moderate', score: 5, notes: 'Tired early in the evening.' },
    { id: '3', date: 'Yesterday, 09:00 AM', type: 'Cough', severity: 'Mild', score: 2, notes: 'Dry cough.' },
    { id: '4', date: 'Oct 24, 09:00 AM', type: 'General', severity: 'None', score: 0, notes: 'Feeling good.' },
];

export default function SymptomsPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
                <Card className="p-4 bg-error-50 border-error-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg text-error-500"><AlertTriangle className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm font-bold text-error-700">Worsening Trend</p>
                        <p className="text-xs text-error-600 mt-1">Breathlessness score increased by 40% over last 3 days.</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500">Last Assessment</p>
                        <p className="text-lg font-bold">Today, 09:00 AM</p>
                     </div>
                     <Badge variant="warning">Severe</Badge>
                </Card>
                 <Card className="p-4 flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500">Compliance</p>
                        <p className="text-lg font-bold">100%</p>
                     </div>
                     <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-success-500 w-full" />
                     </div>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-700">Symptom History</h3>
                </div>
                <DataTable 
                    data={symptomLogs}
                    columns={[
                        { header: 'Date', accessorKey: 'date' },
                        { header: 'Symptom', accessorKey: 'type', cell: (row) => <span className="font-medium">{row.type}</span> },
                        { header: 'Severity', accessorKey: 'severity', cell: (row) => (
                            <Badge variant={row.severity === 'Severe' ? 'error' : row.severity === 'Moderate' ? 'warning' : 'success'}>
                                {row.severity}
                            </Badge>
                        )},
                        { header: 'Mood', accessorKey: 'score', cell: (row) => (
                             <div className="flex items-center gap-2">
                                {row.score > 6 ? <Frown className="w-4 h-4 text-error-500"/> : row.score > 3 ? <Meh className="w-4 h-4 text-warning-500"/> : <Smile className="w-4 h-4 text-success-500"/>}
                                <span className="text-xs text-gray-500">{row.score}/10</span>
                             </div>
                        )},
                        { header: 'Notes', accessorKey: 'notes', width: '40%' }
                    ]}
                />
            </Card>
        </div>
    );
}