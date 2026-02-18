"use client";

import { useState } from 'react';
import { Button } from '@eumetise/ui';
import { Settings2 } from 'lucide-react';
import { THRESHOLDS } from '@/lib/flags'; // Importing standardized thresholds

export function RagSettings() {
  const [modules, setModules] = useState([
    { id: 'heartRate', label: 'Heart Rate', unit: 'bpm', thresholds: THRESHOLDS.heartRate },
    { id: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', thresholds: THRESHOLDS.systolicBP },
    { id: 'spo2', label: 'Oxygen Saturation', unit: '%', thresholds: THRESHOLDS.spo2 },
    { id: 'temperature', label: 'Temperature', unit: '°C', thresholds: THRESHOLDS.temperature },
    { id: 'respiratoryRate', label: 'Respiratory Rate', unit: 'bpm', thresholds: THRESHOLDS.respiratoryRate },
    { id: 'bloodGlucose', label: 'Blood Glucose', unit: 'mmol/L', thresholds: THRESHOLDS.bloodGlucose },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>(null);

  const startEdit = (module: any) => {
      setEditingId(module.id);
      setEditValues({
          redLow: module.thresholds.red[0],
          redHigh: module.thresholds.red[1],
          amberLow: module.thresholds.amber[0],
          amberHigh: module.thresholds.amber[1],
      });
  };

  const saveEdit = () => {
      setModules(prev => prev.map(m => {
          if (m.id === editingId) {
              return {
                  ...m,
                  thresholds: {
                      red: [Number(editValues.redLow), Number(editValues.redHigh)],
                      amber: [Number(editValues.amberLow), Number(editValues.amberHigh)],
                  }
              };
          }
          return m;
      }));
      setEditingId(null);
      setEditValues(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="font-bold text-lg">Clinical Modules & RAG Thresholds</h3>
         <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
            <Settings2 className="w-4 h-4" /> Reset to Default
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map(module => {
            const isEditing = editingId === module.id;
            
            return (
            <div key={module.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h4 className="font-medium text-gray-900">{module.label}</h4>
                        <p className="text-xs text-gray-500 mt-1">Unit: {module.unit}</p>
                    </div>
                    {!isEditing ? (
                        <Button variant="outline" size="xs" className="rounded-full px-3" onClick={() => startEdit(module)}>Customize</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button size="xs" className="bg-gray-900 text-white" onClick={saveEdit}>Save</Button>
                            <Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                    )}
                </div>

                {!isEditing ? (
                    <div className="space-y-2">
                        <div className="flex items-center text-xs gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-400 shrink-0"></span>
                            <span className="text-gray-600">
                                 {module.thresholds?.amber[0]} - {module.thresholds?.amber[1]}
                            </span>
                        </div>
                        <div className="flex items-center text-xs gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="text-gray-600">
                                {module.thresholds?.red[0]} - {module.thresholds?.amber[0]} & {module.thresholds?.amber[1]} - {module.thresholds?.red[1]}
                            </span>
                        </div>
                        <div className="flex items-center text-xs gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400 shrink-0"></span>
                            <span className="text-gray-600">
                                &lt; {module.thresholds?.red[0]} or &gt; {module.thresholds?.red[1]}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-gray-500 mb-1">Amber Min</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1"
                                    value={editValues.amberLow}
                                    onChange={e => setEditValues({...editValues, amberLow: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Amber Max</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1" 
                                    value={editValues.amberHigh}
                                    onChange={e => setEditValues({...editValues, amberHigh: e.target.value})}
                                />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-gray-500 mb-1">Red Min</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1"
                                    value={editValues.redLow}
                                    onChange={e => setEditValues({...editValues, redLow: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Red Max</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1" 
                                    value={editValues.redHigh}
                                    onChange={e => setEditValues({...editValues, redHigh: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            );
        })}
      </div>
    </div>
  );
}
