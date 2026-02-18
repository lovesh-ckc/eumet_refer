'use client';

import { useState } from 'react';
import { useRBAC } from '@eumetise/rbac';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Shield,
  Mail,
  Trash2,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { InviteModal } from '@/components/Roles/InviteModal';
import { RoleEditor } from '@/components/Roles/RoleEditor';
import { useRoleStore } from '@/lib/stores/role-store';
import { PortalDropdown } from '../../../components/Shared/PortalDropdown';

/**
 * Staff Management — Admin only
 */

// Mock staff data
const MOCK_STAFF = [
  { id: '1', name: 'Dr. Priya Sharma',    email: 'priya@hospital.org',   role: 'DOCTOR_ON',   status: 'Active', lastActive: '2h ago' },
  { id: '2', name: 'Nurse Anita Kapoor',   email: 'anita@hospital.org',   role: 'NURSE_COORD', status: 'Active', lastActive: '5m ago' },
  { id: '3', name: 'Dr. Ravi Mehta',       email: 'ravi@hospital.org',    role: 'DOCTOR_ON',   status: 'Active', lastActive: '1d ago' },
  { id: '4', name: 'Admin Suresh Reddy',   email: 'suresh@hospital.org',  role: 'HOSP_ADMIN',  status: 'Active', lastActive: '30m ago' },
];

const INITIAL_INVITES = [
  { id: '1', email: 'new.doctor@hospital.org',  role: 'DOCTOR_ON',   sentAt: '2026-02-10', expires: '2026-02-17' },
  { id: '2', email: 'new.nurse@hospital.org',   role: 'NURSE_COORD', sentAt: '2026-02-09', expires: '2026-02-16' },
];

const ROLE_LABELS: Record<string, string> = {
  SYSTEM_ADMIN: 'System Admin',
  EUMETISE_SUPER_ADMIN: 'Super Admin',
  HOSP_ADMIN: 'Hospital Admin',
  NURSE_COORD: 'Nurse Coordinator',
  DOCTOR_ON: 'Doctor (Onsite)',
};

type StaffView = 'members' | 'invitations' | 'roles';

export default function StaffPage() {
  const { canView } = useRBAC();
  const router = useRouter();
  const { customRoles } = useRoleStore(); // Access custom roles
  const [view, setView] = useState<StaffView>('members');
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  
  // Local State for Interactivity
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [invites, setInvites] = useState(INITIAL_INVITES);

  // Helper to get role label (System or Custom)
  const getRoleLabel = (roleId: string) => {
    if (ROLE_LABELS[roleId]) return ROLE_LABELS[roleId];
    const custom = customRoles.find(r => r.id === roleId);
    return custom ? custom.name : roleId;
  };

  // Actions
  const handleInvite = (data: { emails: string[]; role?: string; expiry: string; method: "email" | "link" }) => {
      if (!data.role) return;
      
      const newInvites = data.emails.map((email, i) => ({
          id: `new-${Date.now()}-${i}`,
          email,
          role: data.role!,
          sentAt: new Date().toISOString().split('T')[0],
          expires: '7 days' // simplify for mock
      }));
      
      setInvites(prev => [...newInvites, ...prev]);
      setShowInvite(false);
      setView('invitations'); // Switch to invites view to show success
  };

  const handleDeleteInvite = (id: string) => {
      if (confirm('Are you sure you want to revoke this invitation?')) {
          setInvites(prev => prev.filter(i => i.id !== id));
      }
  };

  const handleResendInvite = (id: string) => {
      alert(`Invitation resent to recipient.`);
  };

  const handleUpdateRole = (id: string, newRole: string) => {
      setStaffList(prev => prev.map(member => 
        member.id === id ? { ...member, role: newRole } : member
      ));
  };

  // Secondary RBAC check — redirect if not authorized
  if (!canView('STAFF_MANAGEMENT')) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <ShieldAlert className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500">You don&apos;t have permission to manage staff.</p>
      </div>
    );
  }

  const filteredStaff = staffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
           s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {([
          { id: 'members', label: 'All staff' },
          { id: 'invitations', label: 'Pending invites' },
          { id: 'roles', label: 'Roles & Permissions' },
        ] as { id: StaffView; label: string }[]).map((tab) => (
            <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.id === 'invitations' && invites.length > 0 && (
                <span className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${view === tab.id ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                    {invites.length}
                </span>
            )}
          </button>
        ))}
      </div>

      {/* Members View */}
      {view === 'members' && (
        <>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search staff..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              <UserPlus className="h-4 w-4" /> Invite Staff
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden pb-40"> {/* pb-40 to allow dropdown space */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Last Active</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <PortalDropdown
                        align="left"
                        trigger={
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors group">
                                <Shield className="h-3 w-3 text-gray-500 group-hover:text-gray-900" />
                                {getRoleLabel(member.role)}
                                <ChevronDown className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        }
                      >
                         <div className="py-1 bg-white rounded-lg shadow-lg border border-gray-100 w-56 max-h-64 overflow-y-auto">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100 mb-1">
                                System Roles
                            </div>
                            {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => handleUpdateRole(member.id, key)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${member.role === key ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                                >
                                    {label}
                                    {member.role === key && <CheckCircle2 className="h-4 w-4" />}
                                </button>
                            ))}
                            {customRoles.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-y border-gray-100 mt-2 mb-1">
                                        Custom Roles
                                    </div>
                                    {customRoles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleUpdateRole(member.id, role.id)}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${member.role === role.id ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                                        >
                                            {role.name}
                                            {member.role === role.id && <CheckCircle2 className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </>
                            )}
                         </div>
                      </PortalDropdown>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{member.lastActive}</td>
                    <td className="px-5 py-4 text-right">
                      <PortalDropdown
                        align="right"
                        trigger={
                            <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        }
                      >
                         <div className="py-1 bg-white rounded-lg shadow-lg border border-gray-100 w-48">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                View Profile
                            </button>
                            
                            {/* Role Change Submenu - Simplified as a section header for now or just repeat triggers? 
                                A nested dropdown is complex. Let's just create a divider and "Change Role" which focuses the other dropdown?
                                Or just list the roles here? Too long.
                                Let's add a "Change Role" item that is disabled and says "Click role badge" or just generic actions for now.
                                User explicitly asked for "Role can be changed from table or on 3 dots".
                                
                                I will simulate "Change Role" by repurposing the badge logic or simply rendering the role list here again?
                                Rendering role list here if they click "Change Role" is messy.
                                
                                Alternative: "Change Role" opens a small absolute div to pick role?
                                Actually, why not just show the roles directly?
                                "Change Role >"
                            */}
                             <div className="border-t border-gray-100 my-1 pt-1">
                                <div className="px-4 py-1 text-xs text-gray-400 font-medium">Quick Role Change</div>
                                {Object.entries(ROLE_LABELS).slice(0, 3).map(([key, label]) => (
                                     <button
                                        key={key}
                                        onClick={() => handleUpdateRole(member.id, key)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                     >
                                        <Shield className="h-3 w-3 text-gray-400" />
                                        {label}
                                     </button>
                                ))}
                             </div>

                            <div className="border-t border-gray-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                Deactivate Account
                            </button>
                         </div>
                      </PortalDropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Invitations View */}
      {view === 'invitations' && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Sent</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Expires</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{inv.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {getRoleLabel(inv.role)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{inv.sentAt}</td>
                  <td className="px-5 py-4 text-gray-500">{inv.expires}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleResendInvite(inv.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" 
                        title="Resend"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvite(inv.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invites.length === 0 && (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <Mail className="h-8 w-8 mb-2" />
              <p className="text-sm">No pending invitations</p>
            </div>
          )}
        </div>
      )}

      {/* Roles View */}
      {view === 'roles' && <RoleEditor />}

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          type="staff"
          onClose={() => setShowInvite(false)}
          onAddNewRole={() => {
             setShowInvite(false);
             setView('roles');
          }}
          onSubmit={handleInvite}
        />
      )}
    </div>
  );
}
