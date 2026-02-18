import React from 'react';
import { cn } from './utils';
import { Button } from './atoms';
import { Inbox, AlertCircle } from 'lucide-react';

// --- Empty State ---
export const EmptyState = ({ 
    title, 
    description, 
    action, 
    icon: Icon = Inbox 
}: { 
    title: string; 
    description: string; 
    action?: React.ReactNode; 
    icon?: React.ComponentType<{ className?: string }>;
}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 max-w-sm mt-1 mb-6">{description}</p>
        {action}
    </div>
);

// --- Error State ---
export const ErrorState = ({ message, retry }: { message: string, retry?: () => void }) => (
    <div className="bg-error-50 border border-error-100 rounded-lg p-4 flex items-start gap-3 text-error-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1">
            <h4 className="font-bold text-sm">Error loading data</h4>
            <p className="text-sm mt-1">{message}</p>
            {retry && <button onClick={retry} className="text-sm font-bold underline mt-2 hover:text-error-900">Try Again</button>}
        </div>
    </div>
);

// --- Chat Bubble ---
export const ChatBubble = ({ 
    message, 
    isSelf, 
    timestamp, 
    sender 
}: { 
    message: string; 
    isSelf: boolean; 
    timestamp: string; 
    sender?: string;
}) => (
    <div className={cn("flex flex-col mb-4", isSelf ? "items-end" : "items-start")}>
        <div className={cn(
            "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
            isSelf 
                ? "bg-base-black text-white rounded-tr-none" 
                : "bg-white border border-gray-200 text-gray-900 rounded-tl-none"
        )}>
            {!isSelf && sender && <p className="text-xs font-bold text-gray-500 mb-1">{sender}</p>}
            <p>{message}</p>
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">{timestamp}</span>
    </div>
);