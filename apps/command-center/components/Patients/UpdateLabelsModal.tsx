"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Search, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteLabelModal } from './DeleteLabelModal';

interface UpdateLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: { id: string; name: string; dob?: string; labels: string[] }[];
  allLabels: string[]; // List of all available labels in the system
  onSave: (patientIds: string[], newLabels: string[]) => void;
  onDeleteLabel?: (label: string) => void;
}

export function UpdateLabelsModal({ isOpen, onClose, patients, allLabels, onSave, onDeleteLabel }: UpdateLabelsModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Delete Flow
  const [labelToDelete, setLabelToDelete] = useState<string | null>(null);

  // Initialize selected labels based on patients
  useEffect(() => {
    if (isOpen && patients.length > 0) {
      if (patients.length === 1) {
        // For single patient, prepopulate with their labels
        setSelectedLabels([...(patients[0].labels || [])]);
      } else {
        const firstLabels = new Set(patients[0].labels || []);
        const common = patients.slice(1).reduce((acc, p) => {
             const currentSet = new Set(p.labels || []);
             return new Set([...acc].filter(x => currentSet.has(x)));
        }, firstLabels);
        setSelectedLabels(Array.from(common));
      }
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, patients]);

  // Filter suggestions
  useEffect(() => {
    const normalize = (s: string) => s.toLowerCase().trim();
    const query = normalize(inputValue);
    const selectedSet = new Set(selectedLabels.map(normalize));

    const filtered = allLabels.filter(label => {
        const normLabel = normalize(label);
        return !selectedSet.has(normLabel) && normLabel.includes(query);
    });

    setSuggestions(filtered);
  }, [inputValue, selectedLabels, allLabels]);

  const handleAddLabel = (label: string) => {
    if (!selectedLabels.includes(label)) {
      setSelectedLabels([...selectedLabels, label]);
    }
    setInputValue('');
  };

  const handleRemoveLabel = (label: string) => {
    setSelectedLabels(selectedLabels.filter(l => l !== label));
  };
  
  const handleConfirmDelete = () => {
      if (labelToDelete && onDeleteLabel) {
          onDeleteLabel(labelToDelete);
      }
      setLabelToDelete(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
          const exactMatch = suggestions.find(s => s.toLowerCase() === inputValue.toLowerCase());
          if (exactMatch) {
              handleAddLabel(exactMatch);
          } else {
             handleAddLabel(inputValue.trim());
          }
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedLabels.length > 0) {
        handleRemoveLabel(selectedLabels[selectedLabels.length - 1]);
    }
  };

  const handleSave = () => {
      const patientIds = patients.map(p => p.id);
      onSave(patientIds, selectedLabels);
      onClose();
  };

  if (!isOpen) return null;

  const isBulk = patients.length > 1;
  const title = "Update labels";
  const desc = isBulk 
    ? `Update labels for ${patients.length} selected patients.` 
    : `Update labels for ${patients[0].name} ${patients[0].dob ? `(${new Date(patients[0].dob).toLocaleDateString('en-GB')})` : ''}.`;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">
                {desc} Select an existing label or create a new label to add it to the patient{isBulk ? 's' : ''}.
            </p>

            <div className="space-y-4">
                {/* Input Container */}
                <div 
                    className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all min-h-[50px]"
                    onClick={() => inputRef.current?.focus()}
                >
                    {selectedLabels.map(label => (
                        <span key={label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                            {label}
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveLabel(label); }}
                                className="p-0.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedLabels.length === 0 ? "Search or create label..." : ""}
                        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent h-8"
                    />
                </div>

                {/* Suggestions / Create */}
                {inputValue && (
                    <div className="rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                        {suggestions.map(label => (
                            <div
                                key={label}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
                                onClick={() => handleAddLabel(label)}
                            >
                                <span>{label}</span>
                                <div className="flex items-center gap-2">
                                     <button
                                        onClick={(e) => { e.stopPropagation(); setLabelToDelete(label); }}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete label definition"
                                     >
                                        <Trash2 className="w-3.5 h-3.5" />
                                     </button>
                                     <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                        {/* Create option */}
                        {!suggestions.includes(inputValue) && (
                            <button
                                onClick={() => handleAddLabel(inputValue.trim())}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50/50 flex items-center gap-2 group"
                            >
                                <span className="font-medium text-gray-500">Create</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                                    {inputValue}
                                </span>
                            </button>
                        )}
                    </div>
                )}
                
                {/* Popular/Recent Labels */}
                {!inputValue && allLabels.length > 0 && (
                     <div className="pt-2">
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Suggested</div>
                        <div className="flex flex-wrap gap-2">
                            {allLabels.filter(l => !selectedLabels.includes(l)).slice(0, 8).map(label => (
                                <div key={label} className="group relative inline-flex">
                                    <button
                                        onClick={() => handleAddLabel(label)}
                                        className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors pr-8"
                                    >
                                        {label}
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setLabelToDelete(label); }}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 rounded-full"
                                        title="Delete label"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow transition-all"
            >
                Save changes
            </button>
        </div>
      </div>

      {labelToDelete && (
          <DeleteLabelModal 
            isOpen={!!labelToDelete}
            labelName={labelToDelete}
            affectedCount={12} // Mock count for demo
            onClose={() => setLabelToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
      )}
    </>
  );
}
