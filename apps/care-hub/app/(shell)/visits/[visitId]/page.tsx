'use client';
import { useState } from 'react';
import { Wizard, Button, Input, Card } from '@eumetise/ui';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import Link from 'next/link';

export default function VisitExecutionPage({ params }: { params: { visitId: string } }) {
    const [step, setStep] = useState(0);
    const steps = ['Check-in', 'Vitals', 'Assessment', 'Notes', 'Complete'];

    return (
        <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)]">
            <div className="mb-6">
                <Link href="/visits" className="text-sm text-gray-500 flex items-center mb-4"><ArrowLeft className="w-4 h-4 mr-1"/> Back to List</Link>
                <h1 className="text-sub-heading font-haas-disp">Visit: John Doe</h1>
                <Wizard steps={steps} currentStep={step} />
            </div>

            <Card className="flex-1 p-6 overflow-y-auto mb-4">
                {step === 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Safety Check</h2>
                        <p className="text-gray-600">Please confirm patient identity and environment safety.</p>
                        <div className="space-y-2">
                             <label className="flex items-center gap-3 p-3 border rounded">
                                <input type="checkbox" className="w-5 h-5 accent-accent-500" />
                                <span>Patient ID Band Verified</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border rounded">
                                <input type="checkbox" className="w-5 h-5 accent-accent-500" />
                                <span>Environment Safe</span>
                             </label>
                        </div>
                    </div>
                )}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Vitals Recording</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">BPM</label>
                                <Input type="number" className="h-14 text-lg" placeholder="--" />
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium">SpO2 %</label>
                                <Input type="number" className="h-14 text-lg" placeholder="--" />
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium">Sys BP</label>
                                <Input type="number" className="h-14 text-lg" placeholder="--" />
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm font-medium">Dia BP</label>
                                <Input type="number" className="h-14 text-lg" placeholder="--" />
                            </div>
                        </div>
                    </div>
                )}
                {step > 1 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Step content placeholder...
                    </div>
                )}
            </Card>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</Button>
                {step < steps.length - 1 ? (
                    <Button onClick={() => setStep(step + 1)}>Next Step <ArrowRight className="w-4 h-4 ml-2"/></Button>
                ) : (
                    <Button variant="primary" className="bg-success-600 hover:bg-success-700 text-white">Complete Visit <Save className="w-4 h-4 ml-2" /></Button>
                )}
            </div>
        </div>
    );
}