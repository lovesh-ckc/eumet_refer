"use client";

import { useState, useRef } from "react";
import { X, Upload, ChevronDown, Check, Copy, Link as LinkIcon, Mail, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_META, type CommandCenterRole } from "@/lib/rbac";
import { useRoleStore } from "@/lib/stores/role-store";

/** Roles available for staff invitations (System Defaults) */
const SYSTEM_ROLES: { id: CommandCenterRole; label: string }[] = [
  { id: "HOSP_ADMIN",  label: "Hospital Administrator" },
  { id: "NURSE_COORD", label: "Nurse Coordinator" },
  { id: "DOCTOR_ON",   label: "Doctor (Onsite)" },
];

interface InviteModalProps {
  type: "staff" | "patient";
  onClose: () => void;
  onSubmit?: (data: { emails: string[]; role?: string; expiry: string; method: "email" | "link" }) => void;
  onAddNewRole?: () => void; // Callback to open RoleEditor
}

export function InviteModal({ type, onClose, onSubmit, onAddNewRole }: InviteModalProps) {
  const { customRoles } = useRoleStore();
  const [method, setMethod] = useState<"email" | "link">("email");
  const [emails, setEmails] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("NURSE_COORD");
  const [expiry, setExpiry] = useState("7 days");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Combine System + Custom roles
  const allRoles = [
    ...SYSTEM_ROLES,
    ...customRoles.map(r => ({ id: r.id, label: r.name }))
  ];

  const currentRoleLabel = allRoles.find(r => r.id === selectedRole)?.label ?? selectedRole;

  // Link generation mock
  const generatedLink = `https://care.eumetise.com/invite/${Math.random().toString(36).substring(7)}`;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && trimmed.includes("@") && !emails.includes(trimmed)) {
      setEmails((prev) => [...prev, trimmed]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      currentInput.split(",").forEach(addEmail);
      setCurrentInput("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      text.split(/[\n,]/).forEach(addEmail);
    };
    reader.readAsText(file);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    onSubmit?.({
      emails,
      role: type === "staff" ? selectedRole : undefined,
      expiry,
      method,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {type === "staff" ? "Invite Staff Member" : "Invite Patients"}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Method Tabs */}
            <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setMethod("email")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                  method === "email" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Mail className="h-4 w-4" /> Email Invite
              </button>
              <button
                onClick={() => setMethod("link")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                  method === "link" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LinkIcon className="h-4 w-4" /> Get Link
              </button>
            </div>

            <div className="space-y-5">
              {method === "email" ? (
                /* Email Mode */
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Type or import email address</label>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                         Import CSV
                      </button>
                      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
                    </div>
                    
                    <div className="min-h-[80px] rounded-xl border border-gray-200 bg-gray-50 p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {emails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm"
                          >
                            {email}
                            <button onClick={() => removeEmail(email)} className="ml-0.5 text-gray-400 hover:text-error-500">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={emails.length === 0 ? "e.g. john@example.com, sara@example.com" : ""}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Press Enter or Comma to add multiple emails.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Link Mode */
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Shareable Link</label>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 font-mono truncate select-all">
                          {generatedLink}
                       </div>
                       <button
                         onClick={handleCopyLink}
                         className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                       >
                         {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                         {copied ? "Copied" : "Copy"}
                       </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Anyone with this link can register. It is safer to invite via email if you can.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Role Selection (staff only) */}
              {type === "staff" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {currentRoleLabel}
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showRoleDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-1">
                          {/* System Roles */}
                          <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">System Roles</div>
                          {SYSTEM_ROLES.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => { setSelectedRole(r.id); setShowRoleDropdown(false); }}
                              className={`flex w-full items-center px-3 py-2 text-sm rounded-lg ${
                                selectedRole === r.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}

                          {/* Custom Roles */}
                          {customRoles.length > 0 && (
                             <>
                               <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mt-2">Custom Roles</div>
                               {customRoles.map((r) => (
                                 <button
                                   key={r.id}
                                   onClick={() => { setSelectedRole(r.id); setShowRoleDropdown(false); }}
                                   className={`flex w-full items-center px-3 py-2 text-sm rounded-lg ${
                                     selectedRole === r.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                   }`}
                                 >
                                   {r.name}
                                 </button>
                               ))}
                             </>
                          )}
                          
                          {/* Add Role Action */}
                          <div className="border-t border-gray-100 mt-2 p-1">
                             <button
                               onClick={() => { setShowRoleDropdown(false); onAddNewRole?.(); }}
                               className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                             >
                               <Plus className="h-4 w-4" /> Add a new role
                             </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expiry Settings */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {method === 'email' ? 'Invites expire in' : 'Link expires in'}
                </label>
                <div className="relative">
                    <select
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="24 hours">24 hours</option>
                        <option value="48 hours">48 hours</option>
                        <option value="7 days">7 days</option>
                        <option value="30 days">30 days</option>
                        <option value="1 year">1 year</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              Cancel
            </button>
            {method === "email" && (
                <button
                onClick={handleSubmit}
                disabled={emails.length === 0}
                className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-gray-900/10 hover:bg-black hover:shadow-xl hover:shadow-gray-900/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                {type === "staff" ? "Invite Staff" : "Send Invites"}
                </button>
            )}
            {method === "link" && (
                <button
                onClick={onClose}
                className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-black transition-all"
                >
                 Done
                </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
