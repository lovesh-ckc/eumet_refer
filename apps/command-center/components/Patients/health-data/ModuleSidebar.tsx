import React from 'react';
import { cn } from '@eumetise/ui';
import { MOCK_MODULES, HealthModule } from '@/lib/mock-health-data';
import { ChevronRight } from 'lucide-react';

interface ModuleSidebarProps {
  selectedModuleId: string;
  onSelectModule: (id: string) => void;
  className?: string;
}

export function ModuleSidebar({
  selectedModuleId,
  onSelectModule,
  className
}: ModuleSidebarProps) {
  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full overflow-y-auto", className)}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</h3>
      </div>
      <div className="py-2">
        {MOCK_MODULES.map((module) => {
          const latestValue = module.values[module.values.length - 1];
          const isSelected = selectedModuleId === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={cn(
                "w-full text-left px-4 py-3 flex items-center justify-between group transition-colors relative",
                isSelected ? "bg-accent-50" : "hover:bg-gray-50"
              )}
            >
              {/* Colored status strip */}
              <div 
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                   latestValue.status === 'red' ? 'bg-red-500' :
                   latestValue.status === 'amber' ? 'bg-amber-500' :
                   'bg-transparent'
                )}
              />

              <div className="flex-1 pl-2">
                <div className="flex justify-between items-baseline mb-1">
                  <span className={cn(
                    "font-medium truncate",
                    isSelected ? "text-accent-900" : "text-gray-900"
                  )}>
                    {module.label}
                  </span>
                  {latestValue.status !== 'normal' && (
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      latestValue.status === 'red' ? 'bg-red-500' : 'bg-amber-500'
                    )} />
                  )}
                </div>
                
                <div className="flex items-baseline gap-1 text-sm">
                  <span className="font-semibold text-gray-900">{latestValue.value}</span>
                  <span className="text-gray-500 text-xs">{module.unit}</span>
                </div>
              </div>

               {isSelected && <ChevronRight className="w-4 h-4 text-accent-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
