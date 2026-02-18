'use client';
import { use, useState } from 'react';
import { cn } from '@eumetise/ui';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { MOCK_PATIENTS } from '@/lib/mock-patients';
import { UpdateLabelsModal } from '@/components/Patients/UpdateLabelsModal';

export default function PatientLayout({ children, params }: { children: React.ReactNode; params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const pathname = usePathname();
  const baseUrl = `/patients/${patientId}`;
  
  const tabs = [
    { label: 'Overview', href: `${baseUrl}/overview` },
    { label: 'Health Data', href: `${baseUrl}/health-data` },
    { label: 'Care Plan', href: `${baseUrl}/care-plan` },
    { label: 'Profile', href: `${baseUrl}/profile` },
  ];

  // Dynamic Data
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || { 
      name: 'John Doe', 
      gender: 'M', 
      age: 64, 
      id: patientId, 
      condition: 'COPD Exacerbation', 
      ward: 'Virtual-01',
      labels: ['High Risk', 'COPD'] 
  };
  
  const [labels, setLabels] = useState(patient.labels || []);
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#FCF8F5]"> {/* Cream/Pinkish background for entire page context */}
      {/* Patient Context Header */}
      <div className="bg-[#FCF8F5] px-8 py-8 flex items-start justify-between">
        <div className="flex items-center gap-6">
           <div className="h-16 w-16 rounded-full bg-rose-200 flex items-center justify-center text-2xl font-haas-disp font-medium text-rose-900">
              {patient.name.split(' ').map(n => n[0]).join('')}
           </div>
           <div>
              <h1 className="text-hero-subtitle font-haas-disp font-medium text-gray-900 tracking-tight">
                  {patient.name} <span className="text-gray-400 font-normal">({patient.age}, {patient.gender === 'Male' ? 'M' : 'F'})</span>
              </h1>
              <div className="flex items-center gap-6 mt-2 text-body text-gray-500 font-haas-text">
                 <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">DOB:</span> 23 Jun 1979
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-400"># {patient.id}</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors font-ibm-plex text-sm">
                Add note / Resolve flags
            </button>
            <button className="p-2.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>

        {/* Edit Labels Modal - Keeping functionality but hiding from UI as per new design focus, 
            or we can integrate it into the "Add note" flow later. 
            For now, hidden to match the clean design provided. */}
        {showLabelModal && (
            <UpdateLabelsModal 
                isOpen={showLabelModal}
                onClose={() => setShowLabelModal(false)}
                patients={[{ id: patient.id, name: patient.name, labels: labels }]}
                allLabels={Array.from(new Set(MOCK_PATIENTS.flatMap(p => p.labels || [])))}
                onSave={(ids, newLabels) => {
                    setLabels(newLabels);
                    const p = MOCK_PATIENTS.find(p => p.id === ids[0]);
                    if (p) p.labels = newLabels;
                }}
            />
        )}
      </div>

      {/* Navigation Tabs - Hidden/Different in the new design? 
          The design shows "< Overview of Katherine Poole", implying this might be a drill-down.
          However, adhering to the shell structure, we likely still want tabs but styled cleaner. 
          For now, I'll keep them but style them to blend into the cream background. */}
      {/* 
      <div className="px-8 border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8">
          ... tabs ...
        </nav>
      </div> 
      */}
      {/* Based on the image, there are no tabs visible in the main view, just cards. 
          But for navigation purposes in our app, we should probably keep them or the sidebar.
          I will render children directly as the content area. */}

      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}

function MoreHorizontal({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
    )
}