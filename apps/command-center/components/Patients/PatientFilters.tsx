"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface PatientFiltersState {
  patientType: "all" | "my-patients" | "active-30d" | "offboarded" | "pending";
  genders: string[];
  dateType: "dob" | "surgery";
  dateRange: { start: string | null; end: string | null }; // ISO strings
  labels: string[];
}

export const INITIAL_FILTERS: PatientFiltersState = {
  patientType: "all",
  genders: [],
  dateType: "dob",
  dateRange: { start: null, end: null },
  labels: [],
};

interface PatientFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PatientFiltersState;
  onApply: (filters: PatientFiltersState) => void;
  onClear: () => void;
}

export const FILTER_TABS = [
  { id: "type", label: "Patient Type" },
  { id: "gender", label: "Gender" },
  { id: "dates", label: "DOB / Surgery date" },
  { id: "labels", label: "Labels" },
];

export const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Not known",
  "Prefer not to say",
  "Non-binary/ genderqueer/ agender /gender fluid",
  "Transgender",
  "Other",
  "Unspecified",
];

export const LABEL_OPTIONS = [
  "Inpatient",
  "Outpatient",
  "Discharged",
  "Lost to follow up",
  "Continuous monitoring",
  "High risk",
];

export function PatientFilters({ isOpen, onClose, filters, onApply, onClear }: PatientFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PatientFiltersState>(filters);
  const [activeTab, setActiveTab] = useState("type");

  const handleTypeChange = (val: PatientFiltersState["patientType"]) => {
    setLocalFilters((prev) => ({ ...prev, patientType: val }));
  };

  const toggleGender = (gender: string) => {
    setLocalFilters((prev) => {
      const exists = prev.genders.includes(gender);
      return {
        ...prev,
        genders: exists
          ? prev.genders.filter((g) => g !== gender)
          : [...prev.genders, gender],
      };
    });
  };

  const toggleAllGenders = () => {
    setLocalFilters((prev) => ({
      ...prev,
      genders: prev.genders.length === GENDER_OPTIONS.length ? [] : [...GENDER_OPTIONS],
    }));
  };

  const toggleLabel = (label: string) => {
    setLocalFilters((prev) => {
      const exists = prev.labels.includes(label);
      return {
        ...prev,
        labels: exists
          ? prev.labels.filter((l) => l !== label)
          : [...prev.labels, label],
      };
    });
  };
  
  const toggleAllLabels = () => {
    setLocalFilters((prev) => ({
      ...prev,
      labels: prev.labels.length === LABEL_OPTIONS.length ? [] : [...LABEL_OPTIONS],
    }));
  };

  const handleSearch = () => {
    onApply(localFilters);
    onClose();
  };
  
  const handleClear = () => {
      const cleared = { ...INITIAL_FILTERS };
      setLocalFilters(cleared);
      onApply(cleared);
      onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                 <input 
                   type="text" 
                   placeholder="Enter patient name or patient ID if any"
                   className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                 />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Patient Type */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Type</h3>
                    <div className="space-y-3">
                        {[
                            { id: 'all', label: 'All patients' },
                            { id: 'my-patients', label: 'My patients' },
                            { id: 'active-30d', label: 'Patients active in the last 30 days' },
                            { id: 'offboarded', label: 'Offboarded patients' },
                            { id: 'pending', label: 'Pending patient invitations' },
                        ].map(opt => (
                            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                    localFilters.patientType === opt.id 
                                        ? 'border-blue-600 bg-blue-600' 
                                        : 'border-gray-300 group-hover:border-blue-400'
                                }`}>
                                    {localFilters.patientType === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <input 
                                    type="radio" 
                                    name="patientType" 
                                    className="hidden" 
                                    checked={localFilters.patientType === opt.id}
                                    onChange={() => handleTypeChange(opt.id as any)}
                                />
                                <span className={`text-sm ${localFilters.patientType === opt.id ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Gender */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Gender</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                         <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                localFilters.genders.length === GENDER_OPTIONS.length
                                    ? 'border-gray-900 bg-gray-900' 
                                    : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                                {localFilters.genders.length === GENDER_OPTIONS.length && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" onChange={toggleAllGenders} checked={localFilters.genders.length === GENDER_OPTIONS.length} />
                            <span className="text-sm font-medium text-gray-900">All</span>
                        </label>
                        {GENDER_OPTIONS.map(opt => {
                             const isChecked = localFilters.genders.includes(opt);
                             return (
                                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-400'
                                    }`}>
                                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" onChange={() => toggleGender(opt)} checked={isChecked} />
                                    <span className="text-sm text-gray-700">{opt}</span>
                                </label>
                             );
                        })}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Dates */}
                <section>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">DOB</h3>
                             <div className="relative">
                                <div className="flex items-center gap-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors">
                                    <span className="flex-1">Start date — End date</span>
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                </div>
                             </div>
                        </div>
                        <div>
                             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Surgery Date</h3>
                             <div className="relative">
                                <div className="flex items-center gap-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors">
                                    <span className="flex-1">Start date — End date</span>
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Labels */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                         <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                             localFilters.labels.length === LABEL_OPTIONS.length
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                         }`}>
                            <input type="checkbox" className="hidden" onChange={toggleAllLabels} checked={localFilters.labels.length === LABEL_OPTIONS.length} />
                            {localFilters.labels.length === LABEL_OPTIONS.length && <Check className="w-3.5 h-3.5" />}
                            All
                        </label>
                        {LABEL_OPTIONS.map(opt => {
                            const isSelected = localFilters.labels.includes(opt);
                            return (
                                <label key={opt} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                                    isSelected
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}>
                                   <input type="checkbox" className="hidden" onChange={() => toggleLabel(opt)} checked={isSelected} />
                                   {isSelected && <Check className="w-3.5 h-3.5" />}
                                   {opt}
                               </label>
                            );
                        })}
                    </div>
                </section>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                <button 
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSearch}
                    className="px-8 py-2.5 rounded-xl bg-gray-900 text-sm font-medium text-white hover:bg-black transition-colors shadow-lg shadow-gray-900/10"
                >
                    Search
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
