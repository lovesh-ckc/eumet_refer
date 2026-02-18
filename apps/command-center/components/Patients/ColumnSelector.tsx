"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";

export interface ColumnOption {
  id: string;
  label: string;
  isSortable?: boolean;
}

interface ColumnSelectorProps {
  allColumns: ColumnOption[];
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

export function ColumnSelector({ allColumns, visibleColumns, onChange }: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (id: string) => {
    if (visibleColumns.includes(id)) {
      // Don't allow hiding the last column to prevent empty table
      if (visibleColumns.length > 1) {
        onChange(visibleColumns.filter(c => c !== id));
      }
    } else {
      onChange([...visibleColumns, id]);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
             isOpen ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
         }`}
         title="Set vitals"
       >
         <SlidersHorizontal className="w-5 h-5" />
       </button>

       {isOpen && (
         <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
            />
            {/* Modal Content */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Set vitals</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {allColumns.map((col) => {
                        const isChecked = visibleColumns.includes(col.id);
                        return (
                            <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    isChecked 
                                        ? 'bg-gray-900 border-gray-900' 
                                        : 'bg-white border-gray-300 group-hover:border-gray-400'
                                }`}>
                                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={isChecked}
                                    onChange={() => toggleColumn(col.id)}
                                />
                                <span className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                    {col.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
         </div>
         </>
       )}
    </div>
  );
}
