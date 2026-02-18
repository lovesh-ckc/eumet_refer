'use client';
import { Input, Card, Badge } from '@eumetise/ui';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const patients = [
    { id: 'p1', name: 'John Doe', address: '12 Maple St', risk: 'High', distance: '1.2m' },
    { id: 'p2', name: 'Sarah Connor', address: '44 Terminus Rd', risk: 'Medium', distance: '0.5m' },
    { id: 'p3', name: 'Kyle Reese', address: '98 Future Ln', risk: 'Low', distance: '3.4m' },
];

export default function MyPatientsPage() {
    return (
        <div className="space-y-4 max-w-2xl mx-auto">
             <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10">
                <h1 className="text-sub-heading font-haas-disp mb-4">My Patients</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="Search name or ID..." />
                </div>
             </div>

             <div className="space-y-3">
                {patients.map(p => (
                    <Link href={`/patients/${p.id}`} key={p.id}>
                        <Card className="p-4 active:bg-gray-50 touch-target mb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base-black">{p.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {p.address}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={p.risk === 'High' ? 'error' : p.risk === 'Medium' ? 'warning' : 'success'}>
                                        {p.risk} Risk
                                    </Badge>
                                    <span className="text-xs text-gray-400">{p.distance} away</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
             </div>
        </div>
    );
}