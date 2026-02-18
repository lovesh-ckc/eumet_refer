"use client";
import { useState } from 'react';
import { useRBAC } from '@eumetise/rbac';
import { useSessionStore } from '@eumetise/state';
import {
  Search,
  Filter,
  UserPlus,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldAlert,
  Clock,
  MoreHorizontal,
  Mail,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { InviteModal } from '@/components/Roles/InviteModal';
import { PatientFilters, type PatientFiltersState, INITIAL_FILTERS } from '@/components/Patients/PatientFilters';
import { FilterBar } from '@/components/Patients/FilterBar';
import { ColumnSelector, type ColumnOption } from '@/components/Patients/ColumnSelector';
import { ResolveFlagsModal } from '@/components/Patients/ResolveFlagsModal';
import { UpdateLabelsModal } from '@/components/Patients/UpdateLabelsModal';
import type { CommandCenterRole } from '@/lib/rbac';
import { ROLE_META, getAccess } from '@/lib/rbac';

/**
 * CMD-400 — Patients List
 */

import { MOCK_PATIENTS, MOCK_INVITES, getPatients } from '@/lib/mock-patients';
import { AssignStaffModal } from '@/components/Patients/AssignStaffModal';
import { OffboardModal } from '@/components/Patients/OffboardModal';
import { PortalDropdown } from '@/components/Shared/PortalDropdown';



export default function PatientsPage() {
  const { role, canView, canWrite } = useRBAC();
  const { user } = useSessionStore();
  
  // State
  const [patientsList, setPatientsList] = useState(getPatients());
  const [view, setView] = useState<'all' | 'pending' | 'offboarded'>('all'); // Simplified view state to work with filters
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PatientFiltersState>(INITIAL_FILTERS);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Selection & Labels
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [showUpdateLabels, setShowUpdateLabels] = useState(false);
  const [patientsToEdit, setPatientsToEdit] = useState<string[]>([]);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Columns
  const ALL_COLUMNS: ColumnOption[] = [
    { id: 'flags', label: 'Flags', isSortable: true },
    { id: 'name', label: 'Patient Name', isSortable: true },
    { id: 'offboardReason', label: 'Reason', isSortable: true },
    { id: 'offboardDate', label: 'Offboard Date', isSortable: true },
    { id: 'gender', label: 'Gender', isSortable: true },
    { id: 'age', label: 'Age', isSortable: true },
    { id: 'condition', label: 'Condition', isSortable: true },
    { id: 'status', label: 'Status', isSortable: true },
    { id: 'episode', label: 'Episode', isSortable: true },
    // Vitals & Scores
    { id: 'bloodGlucose', label: 'Blood Glucose', isSortable: true },
    { id: 'bloodPressure', label: 'Blood Pressure', isSortable: true },
    { id: 'breathlessness', label: 'Breathlessness', isSortable: true },
    { id: 'ecg', label: 'ECG', isSortable: false },
    { id: 'peakFlow', label: 'Peak Flow', isSortable: true },
    { id: 'spo2', label: 'SpO2', isSortable: true },
    { id: 'rhr', label: 'Resting Heart Rate', isSortable: true },
    { id: 'heartRate', label: 'Heart Rate', isSortable: true },
    { id: 'respiratoryRate', label: 'Respiratory Rate', isSortable: true },
    { id: 'steps', label: 'Steps', isSortable: true },
    { id: 'symptoms', label: 'Symptoms', isSortable: false },
    { id: 'temperature', label: 'Temperature', isSortable: true },
    { id: 'weight', label: 'Weight', isSortable: true },
    { id: 'diabetesDistress', label: 'Diabetes Distress Score', isSortable: true },
    { id: 'oxfordHip', label: 'Oxford Hip Score', isSortable: true },
    { id: 'oxfordKnee', label: 'Oxford Knee Score', isSortable: true },
    { id: 'gad7', label: 'GAD-7', isSortable: true },
    { id: 'phq8', label: 'Depression level - PHQ-8', isSortable: true },
    { id: 'koos', label: 'KOOS', isSortable: true },
    { id: 'kccq', label: 'KCCQ', isSortable: true },
    { id: 'norfolk', label: 'Norfolk QOL-DN', isSortable: true },
    { id: 'fjsHip', label: 'FJS Hip Score', isSortable: true },
    { id: 'fjsKnee', label: 'FJS Knee Score', isSortable: true },
    { id: 'sf36', label: 'SF-36', isSortable: true },
    { id: 'ikdc', label: 'Knee health - IKDC', isSortable: true },
    { id: 'lysholm', label: 'Lysholm & Tegner', isSortable: true },
    { id: 'labels', label: 'Labels', isSortable: false },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['flags', 'name', 'condition', 'episode', 'status']);

  // Offboard State
  const [patientToOffboard, setPatientToOffboard] = useState<{ id: string; name: string } | null>(null);

  const currentRole = role as CommandCenterRole;
  const accessLevel = getAccess(currentRole, 'PATIENTS');
  const isScoped = accessLevel === 'SCOPED';
  const isReadOnly = accessLevel === 'READ';

  // Apply Filters
  let patients = patientsList;

  // 1. Patient Type Filter (Also handles 'My patients' logic)
  if (view === 'offboarded') {
      patients = patients.filter(p => p.status === 'Offboarded');
  } else if (filters.patientType === 'my-patients' || (isScoped && view !== 'pending')) {
    patients = patients.filter((p) => p.assigned && p.status !== 'Offboarded');
  } else if (filters.patientType === 'active-30d') {
     // Mock logic for active 30d
     patients = patients.filter(p => p.status === 'Active');
  } else if (view === 'all') {
     patients = patients.filter(p => p.status !== 'Offboarded');
  }

  // 2. Gender Filter
  if (filters.genders.length > 0) {
      patients = patients.filter(p => filters.genders.includes(p.gender));
  }

  // 3. Label Filter
  if (filters.labels.length > 0) {
      patients = patients.filter(p => p.labels.some(l => filters.labels.includes(l)));
  }

  const handleSelectAll = () => {
      if (selectedPatients.size === patients.length) {
          setSelectedPatients(new Set());
      } else {
          setSelectedPatients(new Set(patients.map(p => p.id)));
      }
  };

  const handleSelectPatient = (id: string) => {
      const newSelected = new Set(selectedPatients);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedPatients(newSelected);
  };

  const handleSaveLabels = (ids: string[], newLabels: string[]) => {
      setPatientsList(prev => prev.map(p => {
          if (ids.includes(p.id)) {
              return { ...p, labels: newLabels };
          }
          return p;
      }));
      // Clear selection after update? Optional.
      // setSelectedPatients(new Set()); 
  };

  // 4. Search
  if (search) {
    patients = patients.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
    );
  }


  // State for modals
  const [patientToResolve, setPatientToResolve] = useState<{ id: string; name: string } | null>(null);
  const [patientToAssign, setPatientToAssign] = useState<{ id: string; name: string } | null>(null);
  
  // Handlers
  const handleAssignStaff = (staffIds: string[]) => {
      if (!patientToAssign) return;
      console.log(`Assigning staff ${staffIds.join(', ')} to patient ${patientToAssign.id}`);
      // In a real app, API call here.
      // For mock update:
      setPatientsList(prev => prev.map(p => {
          if (p.id === patientToAssign.id) {
              return { ...p, assigned: staffIds.length > 0 }; // Simple toggle for 'assigned' filter
          }
          return p;
      }));
      setPatientToAssign(null);
  };

  const handleResolveFlags = (note: string) => {
      if (!patientToResolve) return;
      
      // Update local state to "resolve" (clear flags)
      // In a real app, this sends the note to backend and marks flags as 'reviewed'
      setPatientsList(prev => prev.map(p => {
          if (p.id === patientToResolve.id) {
              // Reset flags to 0 or mark them as resolved (green/grey)
              // For demo, let's just clear the red/amber counts visually or maybe leave them but assume reviewed?
              // Prompt says "logged as resolved". Usually this clears the active alert.
              // Let's set counts to 0 but keep vital data.
              return { 
                  ...p, 
                  flags: { ...p.flags, red: 0, amber: 0, grey: 0 }, // Visually clear flags
                  notes: [...p.notes, note]
              };
          }
          return p;
      }));
      setPatientToResolve(null);
      setPatientToResolve(null);
  };

  const handleOffboard = (reason: string, notes: string) => {
      if (!patientToOffboard) return;
      setPatientsList(prev => prev.map(p => {
          if (p.id === patientToOffboard.id) {
              return { 
                  ...p, 
                  status: 'Offboarded',
                  offboardReason: reason,
                  offboardDate: new Date().toISOString().split('T')[0]
              };
          }
          return p;
      }));
      setPatientToOffboard(null);
  };

  const handleReactivate = (id: string) => {
      setPatientsList(prev => prev.map(p => {
          if (p.id === id) {
              return { 
                  ...p, 
                  status: 'Active',
                  offboardReason: undefined,
                  offboardDate: undefined
              };
          }
          return p;
      }));
  };


  // Sorting Logic (Enhanced)
  if (sortConfig) {
      patients = [...patients].sort((a, b) => {
          if (sortConfig.key === 'flags') {
             // Red > Amber > Grey
             const aFlags = (a as any).flags;
             const bFlags = (b as any).flags;
             if (aFlags.red !== bFlags.red) return sortConfig.direction === 'asc' ? aFlags.red - bFlags.red : bFlags.red - aFlags.red;
             if (aFlags.amber !== bFlags.amber) return sortConfig.direction === 'asc' ? aFlags.amber - bFlags.amber : bFlags.amber - aFlags.amber;
             return sortConfig.direction === 'asc' ? aFlags.grey - bFlags.grey : bFlags.grey - aFlags.grey;
          }

          const aVal = (a as any)[sortConfig.key];
          const bVal = (b as any)[sortConfig.key];
          
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  } else {
      // Default Sort: Most Red > Most Amber > Most Grey
      patients = [...patients].sort((a, b) => {
             const aFlags = (a as any).flags;
             const bFlags = (b as any).flags;
             if (aFlags?.red !== bFlags?.red) return bFlags?.red - aFlags?.red;
             if (aFlags?.amber !== bFlags?.amber) return bFlags?.amber - aFlags?.amber;
             return bFlags?.grey - aFlags?.grey;
      });
  }

  const handleSort = (key: string) => {
      setSortConfig(current => {
          if (current?.key === key) {
              return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
          }
          return { key, direction: 'asc' };
      });
  };



  const isColumnVisible = (id: string) => {
      if (view === 'offboarded') {
          // Force specific columns for offboarded view
          if (['name', 'offboardReason', 'offboardDate'].includes(id)) return true;
          return false;
      }
      return visibleColumns.includes(id);
  };

  return (
    <div className="space-y-6">
      {/* Header with View Data */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-2 text-xl font-medium text-gray-900 font-haas-disp">
            <span className="text-gray-500 font-normal">Overview of</span>
            
            <div className="relative group">
                <select 
                    value={view === 'pending' ? 'pending' : (isScoped ? 'my-patients' : 'all')}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'pending') {
                            setView('pending');
                        } else {
                            setView('all');
                            // Toggle scope based on selection (simulating scope change)
                            // Note: real scope is usually prop-driven, but we can filter locally
                            if (val === 'my-patients') {
                                // We don't have a setScoped setter exposed nicely here without refactor, 
                                // but we do have filters. Let's use filters logic or just the view state if we assume 'my-patients' is a filter.
                                // Actually, lines 105 handle `isScoped`. `isScoped` comes from `user?.id`.
                                // Let's use a local override or just mapped filters.
                                setFilters(prev => ({ ...prev, patientType: 'my-patients' }));
                            } else {
                                setFilters(prev => ({ ...prev, patientType: 'all' }));
                            }
                        }
                    }}
                    className="appearance-none bg-transparent border-b border-gray-300 hover:border-gray-500 text-gray-900 font-medium pr-6 py-0.5 outline-none cursor-pointer transition-colors"
                >
                    <option value="all">All patients</option>
                    <option value="my-patients">My patients</option>
                    <option value="pending">Pending invites</option>
                    <option value="offboarded">Offboarded patients</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <span className="text-gray-500 font-normal">by</span>

            <div className="relative group">
                <select 
                    value={sortConfig?.key || 'priority'}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-transparent border-b border-gray-300 hover:border-gray-500 text-gray-900 font-medium pr-6 py-0.5 outline-none cursor-pointer transition-colors"
                >
                    <option value="priority">Priority</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="age">Age</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>

        <div className="flex items-center gap-3">
             {/* Search/Filter moved here for desktop? Or keep separate? Design shows inline. Let's try to inline if space allows, or keep actions here. */}
             {canWrite('PATIENTS') && (
                <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors shadow-sm"
                >
                <UserPlus className="h-4 w-4" /> 
                <span className="hidden sm:inline">Admit Patient</span>
                </button>
            )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
         <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={view === 'pending' ? "Search invitations..." : view === 'offboarded' ? "Search offboarded..." : "Search patients..."}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            </div>
            
            {/* Filter Trigger */}
            <button 
                onClick={() => setShowFilters(true)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    showFilters || (filters !== INITIAL_FILTERS) 
                        ? 'bg-gray-100 border-gray-300 text-gray-900' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
            <Filter className="h-4 w-4" /> Filters
            </button>

            {/* Column Selector */}
            {view === 'all' && (
                <ColumnSelector 
                    allColumns={ALL_COLUMNS} 
                    visibleColumns={visibleColumns} 
                    onChange={setVisibleColumns} 
                />
            )}
        </div>

        {/* Active Filter Bar */}
        {view === 'all' && (
            <FilterBar 
                filters={filters} 
                onClear={() => setFilters(INITIAL_FILTERS)} 
                onOpenFilters={() => setShowFilters(true)}
                onUpdate={setFilters}
            />
        )}
      </div>

      {/* Content View */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto min-h-[400px]">
        {view === 'pending' ? (
          // Pending Invites Table
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left font-medium text-gray-500 w-10"><input type="checkbox" className="rounded border-gray-300"/></th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Invited By</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Invitation Date</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Validity</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Expiry Date</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVITES.map((invite) => (
                <tr key={invite.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                   <td className="px-5 py-4"><input type="checkbox" className="rounded border-gray-300"/></td>
                   <td className="px-5 py-4 font-medium text-gray-900">{invite.email}</td>
                   <td className="px-5 py-4 text-gray-600">{invite.invitedBy}</td>
                   <td className="px-5 py-4 text-gray-600">{invite.date}</td>
                   <td className="px-5 py-4 text-gray-600">{invite.validity}</td>
                   <td className="px-5 py-4 text-gray-600">{invite.expiry}</td>
                   <td className="px-5 py-4 text-right relative">
                      <button 
                         onClick={() => setActiveMenu(activeMenu === invite.id ? null : invite.id)}
                         className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Active Patients Table with Dynamic Columns & Sorting
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left font-medium text-gray-500 w-10">
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={patients.length > 0 && selectedPatients.size === patients.length}
                        onChange={handleSelectAll}
                    />
                </th>
                {ALL_COLUMNS.filter(c => isColumnVisible(c.id)).map(col => {
                    const isSorted = sortConfig?.key === col.id;
                    return (
                        <th 
                            key={col.id} 
                            className={`px-5 py-3 text-left font-medium text-gray-500 group ${col.isSortable ? 'cursor-pointer hover:bg-gray-100/50 hover:text-gray-700 select-none transition-colors' : ''}`}
                            onClick={() => col.isSortable && handleSort(col.id)}
                            title={col.isSortable ? "Click to sort" : undefined}
                        >
                            <div className="flex items-center gap-1">
                                {col.label}
                                {col.isSortable && (
                                    <span className={`flex flex-col -space-y-1 ${isSorted ? 'text-gray-900' : 'text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                        <ChevronUp className={`h-2.5 w-2.5 ${isSorted && sortConfig?.direction === 'asc' ? 'text-gray-900' : ''}`} />
                                        <ChevronDown className={`h-2.5 w-2.5 ${isSorted && sortConfig?.direction === 'desc' ? 'text-gray-900' : ''}`} />
                                    </span>
                                )}
                            </div>
                        </th>
                    );
                })}
                <th className="px-5 py-3 text-right font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => {
                const isInScope = !isScoped || patient.assigned;
                const displayName = isInScope ? patient.name : '••••••••';
                const isLastRows = index >= patients.length - 2; // Show above for last 2 rows

                return (
                  <tr key={patient.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4"><input type="checkbox" className="rounded border-gray-300"/></td>
                    
                    {ALL_COLUMNS.filter(c => isColumnVisible(c.id)).map(col => {
                        // 1. Flags Column
                        if (col.id === 'flags') {
                            return (
                                <td key={col.id} className="px-5 py-4 cursor-pointer" onClick={() => setPatientToResolve({ id: patient.id, name: patient.name })}>
                                     <div className="flex items-center gap-1.5">
                                        {(patient as any).flags.red > 0 && (
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                                {(patient as any).flags.red}
                                            </span>
                                        )}
                                        {(patient as any).flags.amber > 0 && (
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                                                {(patient as any).flags.amber}
                                            </span>
                                        )}
                                        {(patient as any).flags.grey > 0 && (
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                                {(patient as any).flags.grey}
                                            </span>
                                        )}
                                     </div>
                                </td>
                            );
                        }

                        // 2. Name Column
                        if (col.id === 'name') {
                            return (
                                <td key={col.id} className="px-5 py-4">
                                    <div>
                                        {isInScope ? (
                                            <Link href={`/patients/${patient.id}/profile`} className="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                                                {displayName}
                                            </Link>
                                        ) : (
                                            <p className="font-medium text-gray-300">{displayName}</p>
                                        )}
                                    </div>
                                </td>
                            );
                        }

                        // 3. Status Column
                        if (col.id === 'status') {
                            return (
                                <td key={col.id} className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1.5 text-xs ${
                                        patient.status === 'Active' ? 'text-emerald-600' :
                                        patient.status === 'Monitoring' ? 'text-blue-600' : 'text-amber-600'
                                    }`}>
                                        <span className={`h-2 w-2 rounded-full ${
                                        patient.status === 'Active' ? 'bg-emerald-400' :
                                        patient.status === 'Monitoring' ? 'bg-blue-400' : 'bg-amber-400'
                                        }`} />
                                        {patient.status}
                                    </span>
                                </td>
                            );
                        }

                        // 4. Labels Column
                        if (col.id === 'labels') {
                            return (
                                <td key={col.id} className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {patient.labels.map(l => (
                                            <span key={l} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 border border-gray-200">{l}</span>
                                        ))}
                                    </div>
                                </td>
                            );
                        }

                        // 5. Episode Column
                        if (col.id === 'episode') {
                            return (
                                <td key={col.id} className="px-5 py-4">
                                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        {patient.episode}
                                    </span>
                                </td>
                            );
                        }

                        // 6. Offboard Fields
                        if (col.id === 'offboardReason') {
                             return <td key={col.id} className="px-5 py-4 text-gray-700">{ (patient as any).offboardReason || '-' }</td>;
                        }
                        if (col.id === 'offboardDate') {
                             return <td key={col.id} className="px-5 py-4 text-gray-500">{ (patient as any).offboardDate || '-' }</td>;
                        }

                        // 7. Generic Text Fields
                        if (['gender', 'age', 'condition'].includes(col.id)) {
                            return <td key={col.id} className="px-5 py-4 text-gray-700">{(patient as any)[col.id]}</td>;
                        }

                        // 8. Vitals with RAG Support
                        const rag = (patient as any).flags?.details?.[col.id];
                        const val = (patient as any)[col.id];
                        let cellClass = "text-gray-700";
                        let bgClass = "";
                        
                        if (rag === 'red') {
                            cellClass = "text-red-700 font-medium";
                            bgClass = "bg-red-50 rounded-lg px-2 py-1 inline-block";
                        } else if (rag === 'amber') {
                            cellClass = "text-amber-700 font-medium";
                            bgClass = "bg-amber-50 rounded-lg px-2 py-1 inline-block";
                        }

                        return (
                            <td key={col.id} className="px-5 py-4">
                                <span className={bgClass + " " + cellClass}>{val || '-'}</span>
                            </td>
                        );
                    })}
                    
                    <td className="px-5 py-4 text-right">
                            
                            {/* Row Menu */}
                            <PortalDropdown 
                                trigger={
                                    <div className={`p-1.5 rounded-lg transition-colors ${activeMenu === patient.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </div>
                                }
                                isOpen={activeMenu === patient.id}
                                onOpenChange={(open) => setActiveMenu(open ? patient.id : null)}
                                align="right"
                                className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden py-1"
                            >
                                <button 
                                    onClick={() => {
                                        if (selectedPatients.has(patient.id)) {
                                            setPatientsToEdit(Array.from(selectedPatients));
                                        } else {
                                            setPatientsToEdit([patient.id]);
                                        }
                                        setShowUpdateLabels(true);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    Update labels
                                </button>
                                <div className="h-px bg-gray-50 my-1" />
                                <button 
                                    onClick={() => {
                                        setPatientToResolve({ id: patient.id, name: patient.name });
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Add note
                                </button>
                                <button 
                                    onClick={() => {
                                        setPatientToResolve({ id: patient.id, name: patient.name });
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Resolve flags
                                </button>
                                <button 
                                    onClick={() => {
                                        setPatientToAssign({ id: patient.id, name: patient.name });
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Assign staff
                                </button>
                                <div className="h-px bg-gray-50 my-1" />
                                
                                {patient.status === 'Offboarded' ? (
                                    <button 
                                        onClick={() => {
                                            handleReactivate(patient.id);
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                                    >
                                        Reactivate patient
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setPatientToOffboard({ id: patient.id, name: patient.name });
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Stop monitoring patient
                                    </button>
                                )}
                            </PortalDropdown>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Empty State */}
        {((view === 'pending' && MOCK_INVITES.length === 0) || (view !== 'pending' && patients.length === 0)) && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <ShieldAlert className="h-8 w-8 mb-2" />
            <p className="text-sm">
              {view === 'pending' 
                 ? 'No pending invitations found' 
                 : isScoped ? 'No patients assigned to you' : 'No patients match your filters'}
            </p>
            {view !== 'pending' && patients.length === 0 && (filters !== INITIAL_FILTERS) && (
                <button onClick={() => setFilters(INITIAL_FILTERS)} className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                    Clear all filters
                </button>
            )}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          type="patient"
          onClose={() => setShowInvite(false)}
          onSubmit={(data) => {
            console.log('Admit patient:', data);
            setShowInvite(false);
          }}
        />
      )}

      {/* Label Update Modal */}
      {showUpdateLabels && patientsToEdit.length > 0 && (
          <UpdateLabelsModal 
            isOpen={showUpdateLabels}
            onClose={() => {
                setShowUpdateLabels(false);
                setPatientsToEdit([]);
            }}
            patients={patientsList.filter(p => patientsToEdit.includes(p.id))}
            allLabels={Array.from(new Set(patientsList.flatMap(p => p.labels || [])))}
            onSave={handleSaveLabels}
          />
      )}

      {/* Modals */}
      {patientToAssign && (
        <AssignStaffModal
          isOpen={true}
          onClose={() => setPatientToAssign(null)}
          onAssign={handleAssignStaff}
          patientName={patientToAssign.name}
          initialAssigned={[]} // In real app, pass current assigned IDs
        />
      )}

      {patientToResolve && (
        <ResolveFlagsModal
            isOpen={true}
            onClose={() => setPatientToResolve(null)}
            onResolve={handleResolveFlags}
            patientName={patientToResolve.name}
        />
      )}

      {patientToOffboard && (
          <OffboardModal 
            isOpen={true}
            onClose={() => setPatientToOffboard(null)}
            onConfirm={handleOffboard}
            patientName={patientToOffboard.name}
          />
      )}

      {/* Filter Modal */}
      <PatientFilters 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters(INITIAL_FILTERS)}
      />
    </div>
  );
}