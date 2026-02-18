'use client';
import { Card, Button, Input } from '@eumetise/ui';
import { FileText, Download, Mail, Lock } from 'lucide-react';

export default function ExportDataPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-xl font-bold font-haas-disp">Export Clinical Record</h2>
                <p className="text-gray-500">Generate PDF reports or raw CSV data for this patient.</p>
            </div>

            <Card className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Date Range</label>
                        <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>Full History</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700">Format</label>
                         <div className="flex gap-4">
                            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                <input type="radio" name="fmt" defaultChecked className="accent-accent-600" />
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">PDF Report</span>
                            </label>
                             <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                <input type="radio" name="fmt" className="accent-accent-600" />
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">CSV / Excel</span>
                            </label>
                         </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Included Modules</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Vitals Logs', 'Medication History', 'Symptom Questionnaires', 'Telemedicine Notes', 'Audit Trail'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded accent-accent-600" />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Report will be password protected. Default password is patient DOB (DDMMYYYY).
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <Button className="flex-1" icon={Download}>Download</Button>
                    <Button className="flex-1" variant="outline" icon={Mail}>Email to GP</Button>
                </div>
            </Card>
        </div>
    );
}