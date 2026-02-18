"use client";

import { AlertTriangle, X } from 'lucide-react';

interface DeleteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  labelName: string;
  affectedCount: number;
}

export function DeleteLabelModal({ isOpen, onClose, onConfirm, labelName, affectedCount }: DeleteLabelModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Label</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Are you sure? The label <span className="font-semibold text-gray-800">"{labelName}"</span> is assigned to <span className="font-semibold text-gray-800">{affectedCount} patients</span>.
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            You can reassign these {affectedCount} patients with new labels before deleting. Once a label is deleted you will need to recreate and reassign those labels manually.
                        </p>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center">
                            Reassign labels
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
                    <X className="w-5 h-5" />
                </button>
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
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm"
            >
                Confirm
            </button>
        </div>
      </div>
    </>
  );
}
