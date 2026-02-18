'use client';
import { useState } from 'react';
import { Button, Card, ScreenRenderer, ScreenDefinition } from '@eumetise/ui';
import { Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';

// Mock schema representing a patient's home screen
const patientHomeSchema: ScreenDefinition = {
  id: 'patient-home',
  layout: [
    {
      id: 'greeting',
      type: 'SectionHeader',
      props: { title: 'Good Morning, John' }
    },
    {
      id: 'task-1',
      type: 'Card',
      props: { className: 'p-4 mb-2 border-l-4 border-accent-500', children: 'Time for your Blood Pressure check' }
    },
    {
      id: 'stats',
      type: 'GridContainer',
      props: { columns: 2 },
      children: [
        { id: 's1', type: 'StatCard', props: { label: 'Steps', value: '1,240' } },
        { id: 's2', type: 'StatCard', props: { label: 'Sleep', value: '7h 20m' } }
      ]
    }
  ]
};

export default function PreviewPage() {
  const [device, setDevice] = useState<'mobile' | 'tablet'>('mobile');

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-page-heading font-haas-disp">Deployment Preview</h2>
           <p className="text-gray-500">Visualize how the configuration appears on patient devices.</p>
        </div>
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button 
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded ${device === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
                <Smartphone className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded ${device === 'tablet' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
                <Tablet className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center p-8 overflow-hidden relative">
        {/* Device Frame */}
        <div 
            className={`bg-base-black rounded-[3rem] p-4 shadow-2xl transition-all duration-300 ${
                device === 'mobile' ? 'w-[375px] h-[812px]' : 'w-[768px] h-[1024px]'
            }`}
        >
            <div className="bg-white w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col relative">
                {/* Status Bar Mock */}
                <div className="h-8 bg-gray-50 flex justify-between items-center px-6 text-[10px] font-bold text-gray-900">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <WifiIcon />
                        <BatteryIcon />
                    </div>
                </div>
                
                {/* App Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <ScreenRenderer schema={patientHomeSchema} />
                </div>

                {/* Bottom Nav Mock */}
                <div className="h-16 border-t border-gray-200 flex justify-around items-center pb-4">
                    <div className="w-8 h-8 rounded bg-accent-100"></div>
                    <div className="w-8 h-8 rounded bg-gray-100"></div>
                    <div className="w-8 h-8 rounded bg-gray-100"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const WifiIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.0001 20.2426L2.1214 10.364C7.57754 4.90781 16.4227 4.90781 21.8788 10.364L12.0001 20.2426Z" /></svg>
);
const BatteryIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17 6H3C2.44772 6 2 6.44772 2 7V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6Z" /><path d="M20 9H21C21.5523 9 22 9.44772 22 10V14C22 14.5523 21.5523 15 21 15H20V9Z" /></svg>
);