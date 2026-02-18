import React from 'react';
import { cn } from './utils';
import { Card, Button } from './atoms';
import { Check, ChevronRight } from 'lucide-react';

// --- Timeline Pattern ---
export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'pending' | 'error';
}

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-8">
      {events.map((event, idx) => (
        <div key={event.id} className="relative pl-8">
          <span className={cn(
            "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white",
            event.status === 'completed' ? "bg-success-500" : 
            event.status === 'error' ? "bg-error-500" : "bg-gray-300"
          )} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{event.title}</p>
              {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
            </div>
            <span className="text-xs text-gray-400 mt-1 sm:mt-0 font-mono">{event.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Wizard / Stepper Pattern ---
export const Wizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
        {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
                <div key={step} className="flex flex-col items-center bg-white px-2">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        isCompleted ? "bg-accent-500 text-white" :
                        isCurrent ? "bg-accent-100 text-accent-600 border-2 border-accent-500" :
                        "bg-gray-100 text-gray-400"
                    )}>
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn("text-xs mt-2 font-medium", isCurrent ? "text-gray-900" : "text-gray-500")}>
                        {step}
                    </span>
                </div>
            )
        })}
      </div>
    </div>
  );
};

// --- Master Detail Pattern ---
export const MasterDetail = ({ 
    master, 
    detail, 
    isOpen 
}: { 
    master: React.ReactNode, 
    detail: React.ReactNode, 
    isOpen: boolean 
}) => {
    return (
        <div className="flex h-full overflow-hidden bg-white border border-gray-200 rounded-lg">
            <div className={cn("w-full md:w-1/3 border-r border-gray-200 flex flex-col", isOpen ? "hidden md:flex" : "flex")}>
                {master}
            </div>
            <div className={cn("flex-1 flex-col bg-gray-50", isOpen ? "flex" : "hidden md:flex")}>
                {detail}
            </div>
        </div>
    );
};