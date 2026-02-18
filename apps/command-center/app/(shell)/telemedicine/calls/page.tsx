'use client';
import { Button, Card, Avatar } from '@eumetise/ui';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings } from 'lucide-react';

export default function ActiveCallPage() {
  return (
    <div className="h-[calc(100vh-120px)] bg-black rounded-xl overflow-hidden flex flex-col relative">
        {/* Main Video Feed (Patient) */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
             {/* Simulated Video Stream */}
            <div className="text-gray-500 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse mb-4"></div>
                <p>Waiting for video from John Doe...</p>
            </div>
            
            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white">
                <h3 className="font-bold">John Doe</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live • 04:12
                </p>
            </div>

            {/* PIP (Clinician) */}
            <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-lg border-2 border-gray-700 shadow-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Your Video</div>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-6">
            <ControlBtn icon={Mic} label="Mute" />
            <ControlBtn icon={Video} label="Stop Video" />
            
            <button className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg mx-4">
                <PhoneOff className="w-6 h-6" />
            </button>

            <ControlBtn icon={MessageSquare} label="Chat" />
            <ControlBtn icon={Users} label="Participants" />
        </div>
    </div>
  );
}

function ControlBtn({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <div className="p-3 rounded-full bg-gray-800 hover:bg-gray-700">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{label}</span>
        </button>
    )
}