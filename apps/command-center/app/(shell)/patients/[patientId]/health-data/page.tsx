'use client';

import React, { useState, useMemo } from 'react';
import { ModuleSidebar } from '@/components/Patients/health-data/ModuleSidebar';
import { HealthChart } from '@/components/Patients/health-data/HealthChart';
import { HealthTable } from '@/components/Patients/health-data/HealthTable';
import { MOCK_MODULES, HealthModule } from '@/lib/mock-health-data';
import { 
  Calendar,
  Table as TableIcon,
  BarChart2,
  Layers,
  ZoomIn,
  Download
} from 'lucide-react';
import { cn } from '@eumetise/ui';

export default function HealthDataPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(MOCK_MODULES[0].id);
  const [overlayModuleId, setOverlayModuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [dateRange, setDateRange] = useState<string>('Last 7 Days'); // Placeholder for state

  const selectedModule = useMemo(() => 
    MOCK_MODULES.find(m => m.id === selectedModuleId) || MOCK_MODULES[0], 
    [selectedModuleId]
  );

  const overlayModule = useMemo(() => 
    overlayModuleId ? MOCK_MODULES.find(m => m.id === overlayModuleId) : undefined,
    [overlayModuleId]
  );

  // Filter out the selected module from overlay options
  const overlayOptions = MOCK_MODULES.filter(m => m.id !== selectedModuleId);

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Left Sidebar: Modules */}
      <ModuleSidebar 
        selectedModuleId={selectedModuleId}
        onSelectModule={setSelectedModuleId}
        className="w-72 flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">{selectedModule.label}</h2>
            {selectedModule.unit && (
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                {selectedModule.unit}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
             {/* Overlay Toggle */}
             <div className="relative">
                <button 
                  onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors",
                    overlayModuleId ? "bg-accent-50 text-accent-700 border-accent-200" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  {overlayModuleId ? `Overlay: ${overlayModule?.label}` : 'Overlay vital'}
                </button>
                
                {isOverlayOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 py-1">
                    <button
                      onClick={() => { setOverlayModuleId(null); setIsOverlayOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      None
                    </button>
                    {overlayOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => { setOverlayModuleId(option.id); setIsOverlayOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* View Switcher */}
             <div className="flex bg-gray-100 p-1 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-sm flex items-center gap-2 transition-all",
                    viewMode === 'table' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <TableIcon className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-sm flex items-center gap-2 transition-all",
                    viewMode === 'chart' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <BarChart2 className="w-4 h-4" />
                  Chart
                </button>
             </div>

             {/* Date Picker Placeholder */}
             <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
               <Calendar className="w-4 h-4 text-gray-500" />
               {dateRange}
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 relative font-haas-text">
           {viewMode === 'chart' ? (
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="mb-8 flex justify-between items-start">
                   <div>
                      <p className="text-hero-title font-bold text-gray-900 tracking-tight font-haas-disp">
                        {selectedModule.values[selectedModule.values.length - 1].value}
                        <span className="text-xl font-normal text-gray-400 ml-2 font-haas-text">{selectedModule.unit}</span>
                      </p>
                      <p className="text-caption text-gray-400 mt-1 font-medium bg-gray-50 inline-block px-2 py-0.5 rounded-lg">Latest reading</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2.5 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200" title="Zoom">
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200" title="Export Chart">
                         <Download className="w-5 h-5" />
                      </button>
                   </div>
                </div>
                
                <div className="h-[400px]">
                    <HealthChart 
                      primaryModule={selectedModule} 
                      overlayModule={overlayModule} 
                      dateRange={[null, null]} 
                    />
                </div>

                {/* Range Slider Placeholder */}
                <div className="mt-10 px-4">
                   <div className="h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute left-1/4 right-0 top-0 bottom-0 bg-gray-900 rounded-full opacity-10"></div>
                      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-900 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-900 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"></div>
                   </div>
                   <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium font-ibm-plex">
                      <span>14 days ago</span>
                      <span>Today</span>
                   </div>
                </div>
             </div>
           ) : (
             <HealthTable module={selectedModule} />
           )}
        </div>
      </div>
    </div>
  );
}