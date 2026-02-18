"use client";

import { useState } from "react";
import { Plus, ChevronDown, Trash2, Edit2, Shield, Check, X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_META, type CommandCenterRole, PERMISSION_LABELS, type GranularPermission } from "@/lib/rbac";
import { useRoleStore, type CustomRole } from "@/lib/stores/role-store";

// Helper to check if a permission is enabled
const hasPermission = (permissions: GranularPermission[], p: GranularPermission) => permissions.includes(p);

interface RoleCardProps {
  role: CommandCenterRole | CustomRole;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Simplified module access descriptions per role (System Roles) */
const ROLE_ACCESS_SUMMARY: Record<CommandCenterRole, string[]> = {
  SYSTEM_ADMIN: ["Full platform control", "Privacy break-glass"],
  EUMETISE_SUPER_ADMIN: ["Full platform control", "Privacy break-glass"],
  HOSP_ADMIN: ["Hospital-wide access", "Staff management"],
  NURSE_COORD: ["Assigned patients only", "Clinical workflows"],
  DOCTOR_ON: ["Assigned patients only", "Clinical workflows", "Orders & Rx"],
};

function RoleCard({ role, isExpanded, onToggle, onEdit, onDelete }: RoleCardProps) {
  const isSystem = typeof role === 'string' || !('permissions' in role);
  
  // Metadata for filtering
  const meta = isSystem ? ROLE_META[role as CommandCenterRole] : {
    label: role.name,
    description: `Custom Role • ${(role as CustomRole).permissions.length} permissions`,
    isSuperAdmin: false,
    isHospitalAdmin: false,
    color: 'gray'
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
             meta.color === 'red' ? 'bg-red-50 text-red-600' :
             meta.color === 'blue' ? 'bg-blue-50 text-blue-600' :
             meta.color === 'teal' ? 'bg-teal-50 text-teal-600' :
             'bg-gray-100 text-gray-600'
          }`}>
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{meta.label}</p>
            <p className="text-xs text-gray-500">{meta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isSystem && (
            <div className="flex items-center gap-1">
               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                 className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
               >
                 <Edit2 className="h-4 w-4" />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                 className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               >
                 <Trash2 className="h-4 w-4" />
               </button>
            </div>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
              {isSystem ? (
                // System Role View
                <ul className="space-y-2">
                  {ROLE_ACCESS_SUMMARY[role as CommandCenterRole].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-emerald-500" /> {item}
                    </li>
                  ))}
                  <li className="mt-2 text-xs text-gray-400 italic">System definitions cannot be modified.</li>
                </ul>
              ) : (
                // Custom Role View
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(PERMISSION_LABELS) as GranularPermission[]).map((perm) => {
                     const isEnabled = hasPermission((role as CustomRole).permissions, perm);
                     return (
                       <div key={perm} className={`flex items-start gap-2 text-sm ${isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {isEnabled ? <Check className="h-4 w-4 text-blue-500 mt-0.5" /> : <X className="h-4 w-4 text-gray-300 mt-0.5" />}
                          <span>{PERMISSION_LABELS[perm]}</span>
                       </div>
                     );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RoleEditor() {
  const { customRoles, addRole, updateRole, deleteRole } = useRoleStore();
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPerms, setEditPerms] = useState<GranularPermission[]>(["VIEW_PATIENT_DATA"]);

  const allSystemRoles: CommandCenterRole[] = ["HOSP_ADMIN", "NURSE_COORD", "DOCTOR_ON"];

  const handleAddNew = () => {
    setEditingId(null);
    setEditName("");
    setEditPerms(["VIEW_PATIENT_DATA"]); // Mandatory default
    setIsEditing(true);
  };

  const handleEdit = (role: CustomRole) => {
    setEditingId(role.id);
    setEditName(role.name);
    setEditPerms([...role.permissions]);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    if (editingId) {
      updateRole(editingId, editName, editPerms);
    } else {
      addRole(editName, editPerms);
    }
    setIsEditing(false);
  };

  const togglePerm = (perm: GranularPermission) => {
    if (perm === 'VIEW_PATIENT_DATA') return; // Cannot uncheck mandatory
    setEditPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
         <div className="flex items-center justify-between">
           <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Role' : 'Create New Role'}</h3>
           <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
         </div>

         <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="e.g. Triage Nurse"
                className="w-full h-10 rounded-xl border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.entries(PERMISSION_LABELS) as [GranularPermission, string][]).map(([key, label]) => {
                  const isChecked = editPerms.includes(key);
                  const isMandatory = key === 'VIEW_PATIENT_DATA';
                  return (
                    <div 
                      key={key}
                      onClick={() => !isMandatory && togglePerm(key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-blue-200 bg-blue-50/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isMandatory ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center ${
                         isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                      }`}>
                        {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${isChecked ? 'text-blue-900' : 'text-gray-700'}`}>{label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
         </div>

         <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button 
              onClick={handleSave} 
              disabled={!editName.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-xl disabled:opacity-50"
            >
              {editingId ? 'Save Changes' : 'Create Role'}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Custom Roles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Custom Roles</h3>
            <p className="text-sm text-gray-500">Access profiles defined by your organisation</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            <Plus className="h-4 w-4" /> Add a role
          </button>
        </div>

        <div className="space-y-3">
          {customRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-8 text-center">
               <div className="bg-gray-50 p-3 rounded-xl mb-3"><Shield className="h-6 w-6 text-gray-400" /></div>
               <p className="text-sm font-medium text-gray-900">No custom roles yet</p>
               <p className="text-xs text-gray-500 max-w-xs mt-1">Create roles with specific permission sets to match your team's workflow.</p>
               <button onClick={handleAddNew} className="mt-4 text-sm font-medium text-blue-600 hover:underline">Create your first role</button>
            </div>
          ) : (
            customRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isExpanded={expandedRole === role.id}
                onToggle={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                onEdit={() => handleEdit(role)}
                onDelete={() => deleteRole(role.id)}
              />
            ))
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* System Roles Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">System Roles</h3>
          <p className="text-sm text-gray-500">Standard access profiles provided by the platform</p>
        </div>
        <div className="space-y-3">
          {allSystemRoles.map((role) => (
            <RoleCard
              key={role}
              role={role}
              isExpanded={expandedRole === role}
              onToggle={() => setExpandedRole(expandedRole === role ? null : role)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
