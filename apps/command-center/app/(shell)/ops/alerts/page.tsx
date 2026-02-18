'use client';
import { ScreenRenderer, ScreenDefinition } from '@eumetise/ui';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';

const alertsSchema: ScreenDefinition = {
  id: 'ops-alerts',
  layout: [
    {
      id: 'header',
      type: 'FlexRow',
      children: [
        { id: 'title', type: 'SectionHeader', props: { title: 'Clinical Alerts' } },
        { id: 'ack-all', type: 'Button', props: { children: 'Acknowledge All', variant: 'outline', size: 'sm' } }
      ]
    },
    {
        id: 'alerts-list',
        type: 'GridContainer',
        props: { columns: 1 },
        children: [
            {
                id: 'alert-1',
                type: 'Card',
                props: {
                    className: 'p-4 border-l-4 border-error-500 mb-2',
                    children: [
                        <div key="content" className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-error-500 w-5 h-5 mt-1" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Critical SpO2 Drop</h4>
                                    <p className="text-sm text-gray-600">Patient: John Doe • Ward A</p>
                                    <p className="text-xs text-gray-500 mt-1">Value: 88% (Threshold: 92%)</p>
                                </div>
                            </div>
                            <button className="text-sm text-accent-600 font-medium">Review</button>
                        </div>
                    ]
                }
            },
            {
                id: 'alert-2',
                type: 'Card',
                props: {
                    className: 'p-4 border-l-4 border-warning-500 mb-2',
                    children: [
                         <div key="content" className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <Info className="text-warning-500 w-5 h-5 mt-1" />
                                <div>
                                    <h4 className="font-bold text-gray-900">Missed Check-in</h4>
                                    <p className="text-sm text-gray-600">Patient: Sarah Connor • Home Care</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours overdue</p>
                                </div>
                            </div>
                            <button className="text-sm text-accent-600 font-medium">Call</button>
                        </div>
                    ]
                }
            }
        ]
    }
  ]
};

export default function AlertsPage() {
  return <ScreenRenderer schema={alertsSchema} />;
}