"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";
import type { PatientFiltersState } from "./PatientFilters";
import { INITIAL_FILTERS, GENDER_OPTIONS, LABEL_OPTIONS } from "./PatientFilters";

interface FilterBarProps {
  filters: PatientFiltersState;
  onClear: () => void;
  onOpenFilters: () => void;
  onUpdate: (filters: PatientFiltersState) => void;
}

export function FilterBar({ filters, onClear, onOpenFilters, onUpdate }: FilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close active dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters = 
     filters.patientType !== 'all' || 
     filters.genders.length > 0 || 
     filters.labels.length > 0 ||
     filters.dateRange.start !== null;

  if (!hasActiveFilters && activeDropdown === null) return null;

  // Helper to toggle a value in an array
  const toggleArrayValue = (key: 'genders' | 'labels', value: string) => {
      const current = filters[key];
      const exists = current.includes(value);
      const updated = exists 
          ? current.filter(v => v !== value)
          : [...current, value];
      onUpdate({ ...filters, [key]: updated });
  };

  const handleTypeChange = (val: PatientFiltersState['patientType']) => {
      onUpdate({ ...filters, patientType: val });
      setActiveDropdown(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-2" ref={wrapperRef}>
       {/* Filter Trigger Button */}
       <button 
         onClick={onOpenFilters}
         className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
             hasActiveFilters ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
         }`}
       >
         <SlidersHorizontal className="w-4 h-4" />
       </button>

       {/* Clear Result Button */}
       {hasActiveFilters && (
         <button 
           onClick={onClear}
           className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
         >
           Clear result
         </button>
       )}

       {hasActiveFilters && <div className="h-6 w-px bg-gray-200 mx-1 flex-shrink-0 hidden sm:block" />}

       {/* Patient Type Chip */}
       <div className="relative">
           <button 
               onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
               className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors shadow-sm ${
                   filters.patientType !== 'all' 
                       ? 'bg-blue-50 border-blue-200 text-blue-700' 
                       : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
               }`}
           >
                <span className={filters.patientType !== 'all' ? 'text-blue-500/80' : 'text-gray-500'}>View:</span>
                {filters.patientType === 'my-patients' ? 'My patients' : filters.patientType}
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
           </button>
           
           {activeDropdown === 'type' && (
               <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-xl z-50 p-2 py-3 flex flex-col gap-1">
                   {[
                       { id: 'all', label: 'All patients' },
                       { id: 'my-patients', label: 'My patients' },
                       { id: 'active-30d', label: 'Patients active in the last 30 days' },
                       { id: 'offboarded', label: 'Offboarded patients' },
                       { id: 'pending', label: 'Pending patient invitations' },
                   ].map(opt => (
                       <button
                           key={opt.id}
                           onClick={() => handleTypeChange(opt.id as any)}
                           className="flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50"
                       >
                           <span className={filters.patientType === opt.id ? 'font-medium text-gray-900' : 'text-gray-600'}>{opt.label}</span>
                           {filters.patientType === opt.id && <Check className="w-4 h-4 text-blue-600" />}
                       </button>
                   ))}
               </div>
           )}
       </div>

       {/* Gender Chip */}
       <div className="relative">
           <button 
               onClick={() => setActiveDropdown(activeDropdown === 'gender' ? null : 'gender')}
               className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors shadow-sm ${
                   filters.genders.length > 0
                       ? 'bg-orange-50 border-orange-200 text-orange-800' 
                       : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
               }`}
           >
                <span className={filters.genders.length > 0 ? 'text-orange-600/80' : 'text-gray-500'}>Gender:</span>
                {filters.genders.length === 0 
                    ? 'All' 
                    : filters.genders.length === 1 ? filters.genders[0] : `${filters.genders.length} selected`}
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
           </button>

           {activeDropdown === 'gender' && (
               <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl z-50 p-2 py-3 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                   <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Gender</div>
                   {GENDER_OPTIONS.map(opt => {
                       const isSelected = filters.genders.includes(opt);
                       return (
                           <button
                               key={opt}
                               onClick={() => toggleArrayValue('genders', opt)}
                               className="flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50"
                           >
                               <span className={isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}>{opt}</span>
                               {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                           </button>
                       )
                   })}
               </div>
           )}
       </div>

       {/* Labels Chip */}
       <div className="relative">
           <button 
               onClick={() => setActiveDropdown(activeDropdown === 'labels' ? null : 'labels')}
               className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors shadow-sm ${
                   filters.labels.length > 0
                       ? 'bg-purple-50 border-purple-200 text-purple-800' 
                       : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
               }`}
           >
                <span className={filters.labels.length > 0 ? 'text-purple-600/80' : 'text-gray-500'}>Labels:</span>
                {filters.labels.length === 0 
                    ? 'All' 
                    : filters.labels.length === 1 ? filters.labels[0] : `${filters.labels.length} selected`}
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
           </button>

           {activeDropdown === 'labels' && (
               <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl z-50 p-2 py-3 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                   <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Labels</div>
                   {LABEL_OPTIONS.map(opt => {
                       const isSelected = filters.labels.includes(opt);
                       return (
                           <button
                               key={opt}
                               onClick={() => toggleArrayValue('labels', opt)}
                               className="flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50"
                           >
                               <span className={isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}>{opt}</span>
                               {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                           </button>
                       )
                   })}
               </div>
           )}
       </div>
    </div>
  );
}
