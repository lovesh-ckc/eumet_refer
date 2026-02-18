'use client';
import { useState, useEffect } from 'react';
import { careClient } from '@eumetise/api';
import { Card, Badge, Button } from '@eumetise/ui';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function InboxPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for offline-first feel
    setTasks([
      { id: 1, type: 'Urgent', title: 'Review SPO2 Alert', patient: 'John Doe', time: '10m ago', status: 'pending' },
      { id: 2, type: 'Routine', title: 'Post-discharge Call', patient: 'Sarah Connor', time: '1h ago', status: 'pending' },
      { id: 3, type: 'Visit', title: 'Wound Dressing', patient: 'Kyle Reese', time: '2h ago', status: 'completed' },
    ]);
  }, []);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h1 className="text-sub-heading font-haas-disp mb-6">Task Inbox</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default">All (3)</Badge>
        <Badge variant="warning">Urgent (1)</Badge>
        <Badge variant="success">Completed (1)</Badge>
      </div>

      {tasks.map((task) => (
        <Card key={task.id} className="p-4 flex items-center gap-4 active:scale-[0.99] transition-transform touch-target">
          <div className={`p-3 rounded-full ${task.type === 'Urgent' ? 'bg-error-100 text-error-600' : 'bg-gray-100 text-gray-600'}`}>
            {task.type === 'Urgent' ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-500">{task.patient} • {task.time}</p>
          </div>
          {task.status === 'pending' ? (
             <Button size="sm" variant="outline" className="rounded-full">
               Start <ArrowRight className="ml-1 w-4 h-4" />
             </Button>
          ) : (
            <CheckCircle className="text-success-500 w-6 h-6" />
          )}
        </Card>
      ))}
    </div>
  );
}