'use client';
import { Card, Button, Badge } from '@eumetise/ui';
import { ChevronLeft, ChevronRight, Video, Phone, Clock, Plus } from 'lucide-react';

const schedule = [
    { time: '09:00', patient: 'John Doe', type: 'Video', status: 'Confirmed' },
    { time: '10:00', patient: 'Available', type: 'Slot', status: 'Free' },
    { time: '11:00', patient: 'Sarah Connor', type: 'Phone', status: 'Confirmed' },
    { time: '12:00', patient: 'Lunch Break', type: 'Block', status: 'Blocked' },
    { time: '13:00', patient: 'Kyle Reese', type: 'Video', status: 'Pending' },
];

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-page-heading font-haas-disp">Appointments</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border border-gray-200 rounded-md">
                        <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4"/></Button>
                        <span className="px-4 font-medium text-sm">Oct 26, 2023</span>
                        <Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4"/></Button>
                    </div>
                    <Button>New Appointment</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                {/* Mini Calendar */}
                <Card className="p-4 h-full">
                    <h3 className="font-bold mb-4">October 2023</h3>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-gray-400 text-xs">{d}</span>)}
                        {Array.from({length: 31}).map((_, i) => (
                            <div key={i} className={`p-2 rounded hover:bg-gray-100 cursor-pointer ${i === 25 ? 'bg-accent-500 text-white hover:bg-accent-600' : ''}`}>
                                {i+1}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Day View */}
                <Card className="col-span-3 p-0 overflow-y-auto">
                    {schedule.map((slot, idx) => (
                        <div key={idx} className="flex border-b border-gray-100 min-h-[100px]">
                            <div className="w-24 p-4 border-r border-gray-100 text-gray-500 font-mono text-sm">
                                {slot.time}
                            </div>
                            <div className="flex-1 p-2">
                                {slot.status !== 'Free' ? (
                                    <div className={`h-full rounded-lg p-3 flex justify-between items-start ${
                                        slot.status === 'Blocked' ? 'bg-gray-100' : 
                                        slot.status === 'Pending' ? 'bg-warning-50 border-l-4 border-warning-400' : 
                                        'bg-accent-50 border-l-4 border-accent-500'
                                    }`}>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{slot.patient}</h4>
                                            {slot.status !== 'Blocked' && (
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    {slot.type === 'Video' ? <Video className="w-3 h-3"/> : <Phone className="w-3 h-3"/>}
                                                    {slot.type} Consultation
                                                </p>
                                            )}
                                        </div>
                                        {slot.status === 'Confirmed' && <Badge variant="success">Confirmed</Badge>}
                                        {slot.status === 'Pending' && <Badge variant="warning">Request</Badge>}
                                    </div>
                                ) : (
                                    <div className="h-full border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300 hover:border-accent-200 hover:text-accent-500 cursor-pointer transition-colors">
                                        <Plus className="w-5 h-5 mr-2" /> Add Slot
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}