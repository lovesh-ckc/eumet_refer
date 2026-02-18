'use client';
import { ScreenRenderer, ScreenDefinition } from '@eumetise/ui';
import { Video, Calendar, Phone } from 'lucide-react';

const telemedSchema: ScreenDefinition = {
  id: 'telemed-dashboard',
  layout: [
    {
      id: 'header',
      type: 'FlexRow',
      children: [
        { id: 'title', type: 'SectionHeader', props: { title: 'Telemedicine Hub' } },
        { id: 'new-call', type: 'Button', props: { children: 'Instant Call', variant: 'primary', icon: Video } }
      ]
    },
    {
      id: 'upcoming-grid',
      type: 'GridContainer',
      props: { columns: 3 },
      children: [
        { 
            id: 'call-1', 
            type: 'Card', 
            props: { 
                className: 'p-4 border-l-4 border-accent-500', 
                children: [
                    <div key="c1" className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900">John Doe</h4>
                            <p className="text-sm text-gray-500">Scheduled Follow-up</p>
                        </div>
                        <span className="bg-accent-100 text-accent-700 text-xs px-2 py-1 rounded">10:00 AM</span>
                    </div>,
                    <div key="c2" className="mt-4">
                        <button className="w-full bg-base-black text-white py-2 rounded text-sm font-medium">Join Call</button>
                    </div>
                ]
            } 
        },
        { 
            id: 'call-2', 
            type: 'Card', 
            props: { 
                className: 'p-4 border-l-4 border-gray-300', 
                children: [
                     <div key="c1" className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900">Jane Smith</h4>
                            <p className="text-sm text-gray-500">Symptom Review</p>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">11:30 AM</span>
                    </div>,
                    <div key="c2" className="mt-4">
                        <button className="w-full border border-gray-300 text-gray-600 py-2 rounded text-sm font-medium" disabled>Waiting</button>
                    </div>
                ]
            } 
        },
      ]
    }
  ]
};

export default function TelemedicinePage() {
  return <ScreenRenderer schema={telemedSchema} />;
}