'use client';
import { Card, Button, Badge } from '@eumetise/ui';
import { Copy, ArrowRight, Heart, Activity, Wind } from 'lucide-react';

const templates = [
    { id: 1, name: 'Heart Failure (Post-discharge)', icon: Heart, modules: ['Weight', 'BP', 'Symptom Check'], duration: '30 days' },
    { id: 2, name: 'COPD Management', icon: Wind, modules: ['SpO2', 'CAT Assessment', 'Inhaler Tracker'], duration: 'Ongoing' },
    { id: 3, name: 'Diabetes Type 2', icon: Activity, modules: ['Glucose', 'Diet Log', 'Activity'], duration: 'Ongoing' },
];

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
             <div>
                <h2 className="text-xl font-bold font-haas-disp">Clinical Templates</h2>
                <p className="text-gray-500">Accelerate deployment with pre-configured care pathways.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map(t => (
                    <Card key={t.id} className="p-6 flex flex-col hover:border-accent-300 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors">
                                <t.icon className="w-6 h-6" />
                            </div>
                            <Badge variant="default">Official</Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{t.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">Includes: {t.modules.join(', ')}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase">{t.duration}</span>
                            <Button size="sm" variant="ghost" className="text-accent-600 hover:text-accent-700 p-0">
                                Use Template <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </Card>
                ))}
                
                {/* Custom Template Card */}
                <Card className="p-6 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400 cursor-pointer">
                    <div className="p-4 bg-white rounded-full mb-3 shadow-sm">
                        <Copy className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-600">Import JSON</h3>
                    <p className="text-xs text-gray-400 mt-1">Paste a schema definition</p>
                </Card>
            </div>
        </div>
    );
}