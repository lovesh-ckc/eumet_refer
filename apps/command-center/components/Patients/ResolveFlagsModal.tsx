"use client";

import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface ResolveFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (note: string) => void;
  patientName: string;
}

export function ResolveFlagsModal({ isOpen, onClose, onResolve, patientName }: ResolveFlagsModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Resolve flags</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                    Adding a note confirms that you have reviewed the flagged information for <span className="font-semibold">{patientName}</span> and it will be logged as resolved.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add a note</label>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter clinical notes here..."
                    className="w-full h-32 rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    autoFocus
                />
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => {
                    if (note.trim()) {
                        onResolve(note);
                    }
                }}
                disabled={!note.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Resolve flags
            </button>
        </div>
      </div>
    </>
  );
}
