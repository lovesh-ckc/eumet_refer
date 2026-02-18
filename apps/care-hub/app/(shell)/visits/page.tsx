'use client';
import Link from 'next/link';
import { Card, Badge, Button } from '@eumetise/ui';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const visits = [
    { id: 'v1', patient: 'John Doe', type: 'Initial Assessment', time: '09:00 AM', status: 'In Progress', address: '12 Maple St' },
    { id: 'v2', patient: 'Jane Smith', type: 'Wound Care', time: '11:30 AM', status: 'Scheduled', address: '88 Oak Ave' },
    { id: 'v3', patient: 'Bob Wilson', type: 'Vitals Check', time: '02:00 PM', status: 'Scheduled', address: '42 Pine Ln' },
];

export default function VisitsPage() {
    return (
        <div className="space-y-4 max-w-2xl mx-auto">
             <div className="flex justify-between items-end mb-4">
                <h1 className="text-sub-heading font-haas-disp">Today's Visits</h1>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
             </div>

             {visits.map(v => (
                 <Card key={v.id} className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg">{v.patient}</h3>
                                {v.status === 'In Progress' && <Badge variant="warning" className="animate-pulse">Active</Badge>}
                            </div>
                            <p className="text-gray-600">{v.type}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-mono font-bold text-lg">{v.time}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded">
                        <MapPin className="w-4 h-4 mr-2" />
                        {v.address}
                    </div>

                    <Link href={`/visits/${v.id}`} className="w-full">
                        <Button className="w-full justify-between group" variant={v.status === 'In Progress' ? 'primary' : 'secondary'}>
                            {v.status === 'In Progress' ? 'Resume Visit' : 'Start Visit'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                 </Card>
             ))}
        </div>
    );
}