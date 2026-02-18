'use client';
import { Card, Button } from '@eumetise/ui';
import { Wifi, RefreshCw, Check } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-page-heading font-haas-disp">Sync Status</h1>
      
      <Card className="p-6 bg-base-black text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300">Connection</span>
          <span className="flex items-center text-success-400 font-bold"><Wifi className="w-4 h-4 mr-2" /> Online</span>
        </div>
        <div className="flex items-center justify-between mb-4">
           <span className="text-gray-300">Pending Uploads</span>
           <span className="font-mono text-xl">0</span>
        </div>
        <div className="flex items-center justify-between">
           <span className="text-gray-300">Last Sync</span>
           <span className="text-sm text-gray-400">Just now</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
         <Button variant="outline" className="h-16 flex-col gap-2">
            <RefreshCw className="w-5 h-5" />
            Force Sync
         </Button>
         <Button variant="outline" className="h-16 flex-col gap-2">
            <Check className="w-5 h-5" />
            Download Forms
         </Button>
      </div>

      <p className="text-center text-caption text-gray-400">
        App Version: 2.1.0 (Build 450)<br/>
        Local Database: 14.2 MB
      </p>
    </div>
  );
}