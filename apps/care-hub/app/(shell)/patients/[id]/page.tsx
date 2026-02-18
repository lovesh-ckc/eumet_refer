'use client';
import Link from 'next/link';
import { Card, Button, Badge } from '@eumetise/ui';
import { ArrowLeft, Phone, Video, MapPin, ChevronRight, FileText, Activity } from 'lucide-react';

export default function PatientSummary({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       <div className="flex items-center gap-4">
          <Link href="/patients">
             <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div className="flex-1">
             <h1 className="text-hero-subtitle font-haas-disp">John Doe</h1>
             <div className="flex items-center text-gray-500 gap-4 text-sm">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> 12 Maple St (1.2m)</span>
                <span className="text-gray-300">|</span>
                <span>DOB: 12/05/1959</span>
             </div>
          </div>
          <div className="flex gap-2">
             <Button className="rounded-full w-12 h-12 p-0 bg-success-500 hover:bg-success-600 text-white"><Phone className="w-5 h-5"/></Button>
             <Button className="rounded-full w-12 h-12 p-0 bg-accent-500 hover:bg-accent-600 text-base-black"><Video className="w-5 h-5"/></Button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 bg-error-50 border-error-200">
             <h3 className="text-error-700 font-bold mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Critical Alert</h3>
             <p className="text-gray-800 mb-4">SpO2 dropped to 88% last night. Require immediate assessment of respiratory status.</p>
             <Button size="sm" variant="danger">Acknowledge</Button>
          </Card>

          <Card className="p-5">
             <h3 className="text-gray-900 font-bold mb-3">Today's Plan</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                   <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 accent-accent-500" />
                      <span className="font-medium">Morning Vitals</span>
                   </div>
                   <span className="text-xs text-gray-400">09:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                   <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 accent-accent-500" />
                      <span className="font-medium">Wound Dressing</span>
                   </div>
                   <span className="text-xs text-gray-400">09:15 AM</span>
                </div>
             </div>
          </Card>
       </div>

       <div className="space-y-4">
          <h3 className="font-bold text-xl font-haas-disp">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Link href={`/visits/new?patient=${params.id}`} className="block">
                <Card className="p-4 h-32 flex flex-col items-center justify-center gap-3 hover:border-accent-400 transition-colors cursor-pointer">
                   <div className="p-3 bg-accent-100 rounded-full text-accent-600"><Activity className="w-6 h-6" /></div>
                   <span className="font-medium">New Vitals</span>
                </Card>
             </Link>
             <Card className="p-4 h-32 flex flex-col items-center justify-center gap-3 hover:border-accent-400 transition-colors cursor-pointer">
                 <div className="p-3 bg-gray-100 rounded-full text-gray-600"><FileText className="w-6 h-6" /></div>
                 <span className="font-medium">Clinical Notes</span>
             </Card>
             {/* More actions... */}
          </div>
       </div>

       <Card className="p-0 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 uppercase text-xs">Recent History</div>
          <div className="divide-y divide-gray-100">
             {[1,2,3].map(i => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
                   <div>
                      <p className="font-bold text-sm">Vital Check</p>
                      <p className="text-xs text-gray-500">Yesterday • 2:00 PM</p>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                      Normal Range <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                   </div>
                </div>
             ))}
          </div>
       </Card>
    </div>
  );
}