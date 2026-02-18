'use client';
import { Card, Input, Button, Badge } from '@eumetise/ui';
import { UploadCloud, CheckCircle, GitBranch, AlertTriangle } from 'lucide-react';

export default function PublishPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-page-heading font-haas-disp">Publish Deployment</h2>
        <p className="text-gray-500">Release a new version to the Virtual Ward A - Cardiac cohort.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 space-y-6">
            <h3 className="font-bold text-lg">Release Configuration</h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Version Tag</label>
                <div className="flex gap-2">
                    <Input defaultValue="v2.5.0" className="font-mono" />
                    <Button variant="outline">Auto-increment</Button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Release Notes</label>
                <textarea 
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm"
                    placeholder="- Added new blood pressure threshold logic&#10;- Updated patient welcome screen&#10;- Fixed bug in symptom tracker"
                />
            </div>

            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0" />
                <div className="text-sm text-warning-800">
                    <p className="font-bold">Breaking Change Detection</p>
                    <p>This update removes the "Daily Mood" questionnaire. 45 active patients currently use this module. Data may be orphaned.</p>
                </div>
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">Target Environment</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm">Schema Validated</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm">Assets Optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Branch: <span className="font-mono">main</span></span>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button className="w-full h-12" variant="primary">
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Publish Now
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}