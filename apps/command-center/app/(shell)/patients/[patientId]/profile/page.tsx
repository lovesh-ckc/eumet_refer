'use client';

import { use, useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@eumetise/ui';
import { User, Phone, MapPin, AlertCircle, FileText, Check, X, RotateCcw, Calendar, Clock } from 'lucide-react';
import { cn } from '@eumetise/ui';
import { RagSettings } from '@/components/Patients/RagSettings';
import { MOCK_PATIENTS } from '@/lib/mock-patients';

export default function PatientProfile({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const [activeTab, setActiveTab] = useState<'profile' | 'rag' | 'schedule'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Find Patient
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];

  // Mock extended data based on patient ID (deterministically 'random' or just simple mock)
  // We can just use simple logic to vary it slightly
  const isOdd = parseInt(patientId) % 2 !== 0;

  const [formData, setFormData] = useState({
      condition: patient.condition || "COPD",
      admissionDate: isOdd ? "Oct 12, 2023" : "Jan 05, 2024",
      bloodType: isOdd ? "O+" : "A-",
      allergies: isOdd ? "Penicillin, Peanuts" : "None",
      address: isOdd ? "12 Maple Street, Springfield, IL" : "45 Oak Avenue, Chicago, IL",
      insurance: isOdd ? "BlueCross BlueShield" : "Aetna",
      policy: isOdd ? "#99382011" : "#55442211"
  });

  const handleSave = () => {
      setIsEditing(false);
      // API call to save
  };

  const handleCancel = () => {
      setIsEditing(false);
      // Reset form (optional)
  };

  return (
    <div className="space-y-6">
      {/* Local Tabs */}
      <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
             {['Profile', 'RAG rating', 'Schedule of readings'].map((tab) => {
                 const key = tab.startsWith('RAG') ? 'rag' : tab.startsWith('Schedule') ? 'schedule' : 'profile';
                 const isActive = activeTab === key;
                 
                 return (
                     <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={cn(
                            "pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            isActive 
                                ? "border-gray-900 text-gray-900" 
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                     >
                         {tab}
                     </button>
                 )
             })}
          </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Left Col: Identity */}
          <div className="space-y-6">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold font-haas-disp">{patient.name}</h2>
              <p className="text-gray-500">{patient.gender} • {patient.age} years</p>
              <Badge variant="error" className="mt-2">{patient.condition}</Badge>
              
              <div className="w-full mt-6 space-y-3">
                 {!isEditing ? (
                    <Button className="w-full" variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button> 
                 ) : (
                    <div className="flex gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none" onClick={handleSave}>
                            <Check className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-none" onClick={handleCancel}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                    </div>
                 )}
                 <Button className="w-full" variant="ghost">Reset Password</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent-500" /> Key Contacts
              </h3>
              <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Emergency Contact</p>
                    <p className="font-medium">Jane Doe (Spouse)</p>
                    <div className="flex items-center text-accent-600 text-sm mt-1">
                        <Phone className="w-3 h-3 mr-1" /> +1 555 0192
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase">GP</p>
                    <p className="font-medium">Dr. S. Strange</p>
                    <div className="flex items-center text-accent-600 text-sm mt-1">
                        <Phone className="w-3 h-3 mr-1" /> +1 555 0001
                    </div>
                  </div>
              </div>
            </Card>
          </div>

          {/* Right Col: Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Clinical Profile</h3>
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                      <RotateCcw className="w-3 h-3" /> History Log
                  </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Primary Condition</label>
                    <Input 
                        value={formData.condition} 
                        onChange={e => setFormData({...formData, condition: e.target.value})}
                        disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Admission Date</label>
                    <Input 
                        value={formData.admissionDate}
                        onChange={e => setFormData({...formData, admissionDate: e.target.value})}
                        disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Blood Type</label>
                    <Input 
                        value={formData.bloodType}
                        onChange={e => setFormData({...formData, bloodType: e.target.value})}
                        disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Allergies</label>
                    <Input 
                        value={formData.allergies}
                        onChange={e => setFormData({...formData, allergies: e.target.value})}
                        className={!isEditing ? "text-error-600 font-medium" : ""}
                        disabled={!isEditing} 
                    />
                  </div>
              </div>

              <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="flex gap-2 mt-1">
                    <div className="p-2 bg-gray-100 rounded border border-gray-300">
                        <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <Input 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing} 
                    />
                  </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Insurance & Billing</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                        <Input 
                             value={formData.insurance} 
                             onChange={e => setFormData({...formData, insurance: e.target.value})}
                             disabled={!isEditing}
                             className={`font-medium ${!isEditing ? 'bg-transparent border-transparent px-0 font-bold text-gray-900 h-auto' : 'bg-white h-8 text-sm'}`}
                        />
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>Policy:</span>
                            <Input 
                                 value={formData.policy} 
                                 onChange={e => setFormData({...formData, policy: e.target.value})}
                                 disabled={!isEditing}
                                 className={!isEditing ? 'bg-transparent border-transparent px-0 h-auto w-24' : 'bg-white h-6 w-32 text-xs'}
                            />
                            <span>• Exp: 12/25</span>
                        </div>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'rag' && (
          <div className="animate-in fade-in duration-300">
              <RagSettings />
          </div>
      )}

      {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {['Morning', 'Afternoon', 'Evening'].map((period, i) => (
                  <Card key={period} className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i===0 ? 'bg-orange-100 text-orange-600' : i===1 ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                              <Clock className="w-5 h-5" />
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900">{period} Routine</h4>
                              <p className="text-sm text-gray-500">
                                  {i===0 ? '8:00 AM - 10:00 AM' : i===1 ? '12:00 PM - 2:00 PM' : '6:00 PM - 8:00 PM'}
                              </p>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          {[
                              { label: 'Blood Pressure', done: true },
                              { label: 'Heart Rate', done: true },
                              { label: 'SpO2', done: i === 0 },
                              { label: 'Weight', done: i === 0 },
                          ].map((task, j) => (
                              <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  <span className="text-sm font-medium text-gray-700">{task.label}</span>
                                  {task.done ? (
                                      <Badge variant="success" className="gap-1 px-1.5"><Check className="w-3 h-3" /> Done</Badge>
                                  ) : (
                                      <Badge variant="neutral" className="gap-1 px-1.5 text-gray-400">Pending</Badge>
                                  )}
                              </div>
                          ))}
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
}
