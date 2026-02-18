"use client";

import { useState } from 'react';
import { X, Search, User, Check } from 'lucide-react';

interface StaffMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

const MOCK_STAFF: StaffMember[] = [
    { id: '1', name: 'Andre Whitehurst', role: 'Cardiologist' },
    { id: '2', name: 'Bok Tinoco', role: 'Nurse' },
    { id: '3', name: 'Chantay Ruther', role: 'General Practitioner' },
    { id: '4', name: 'Dorethea Proudfoot', role: 'Specialist' },
    { id: '5', name: 'Dennise Littell', role: 'Nurse' },
    { id: '6', name: 'Endy Bloxham', role: 'Care Coordinator' },
    { id: '7', name: 'Jean Gray', role: 'Physiotherapist' },
    { id: '8', name: 'Krystina Durrant', role: 'Cardiologist' },
    { id: '9', name: 'Peter Parker', role: 'Specialist' },
];

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffIds: string[]) => void;
  patientName: string;
  initialAssigned?: string[];
}

export function AssignStaffModal({ isOpen, onClose, onAssign, patientName, initialAssigned = [] }: AssignStaffModalProps) {
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set(initialAssigned));

  if (!isOpen) return null;

  const filteredStaff = MOCK_STAFF.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStaff = (id: string) => {
      const newSet = new Set(selectedStaff);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedStaff(newSet);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-gray-100">
            <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assign Staff Member</h6>
            <h3 className="text-lg font-medium text-gray-900">Assigned clinicians for {patientName}</h3>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search staff member"
                    className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                />
            </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            {filteredStaff.map(staff => {
                const isSelected = selectedStaff.has(staff.id);
                return (
                    <div 
                        key={staff.id} 
                        onClick={() => toggleStaff(staff.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {staff.name.charAt(0)}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                            {/* <p className="text-xs text-gray-500">{staff.role}</p> Optional role display */}
                        </div>
                    </div>
                );
            })}
            {filteredStaff.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                    No staff members found
                </div>
            )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => onAssign(Array.from(selectedStaff))}
                className="px-6 py-2 rounded-full text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm"
            >
                Assign
            </button>
        </div>
      </div>
    </>
  );
}
