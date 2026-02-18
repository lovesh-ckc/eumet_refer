'use client';

import { AppShell } from '@eumetise/ui';
import { RBACProvider } from '@eumetise/rbac';
import { useSessionStore } from '@eumetise/state';
import { usePathname } from 'next/navigation';
import {
  EyeOff,
  Shield,
  UserPlus,
  LayoutDashboard,
  ClipboardList,
  Bell,
  Users,
  FileText,
  Stethoscope,
  Cpu,
  CheckSquare,
  Video,
  UserCog,
  Settings,
} from 'lucide-react';
import type { CommandCenterRole } from '@/lib/rbac';
import { getNavItemsBySection, ROLE_META, getScopeLabel, getAccess } from '@/lib/rbac';
import { useState } from "react";
import { InviteModal } from "@/components/Roles/InviteModal";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  ClipboardList,
  Bell,
  Users,
  FileText,
  Stethoscope,
  Cpu,
  CheckSquare,
  Video,
  UserCog,
  Shield,
  Settings,
};

/**
 * CMD-010 — App Shell Layout
 *
 * Role-aware navigation shell. Nav items are filtered by the user's role
 * using the access matrix from lib/rbac.ts. Non-permitted modules are
 * hidden entirely (not grayed out).
 */

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const { breakGlassActive, user } = useSessionStore();
  // const { role, canView } = useRBAC(); // Removed: We are the provider now
  
  const role = (user?.role as CommandCenterRole) || "NO";
  
  // Helper for RBAC Context
  const getAccessForRole = (module: string) => getAccess(role as any, module as any);
  const pathname = usePathname();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteType, setInviteType] = useState<'patient' | 'staff'>('patient');

  // Derive nav items from the current role
  const sections = getNavItemsBySection(role as any);
  // Map string icons to components
  const navItems = [...sections.main, ...sections.admin].map(item => ({
    ...item,
    icon: ICON_MAP[item.icon] || LayoutDashboard
  }));
  const roleMeta = ROLE_META[role as any];

  // Define User Actions
  const userMenuActions = [];
  // Define getAccess helper locally for valid role check
  const canViewModule = (module: string) => getAccess(role as any, module as any) !== "NO";

  if (canViewModule('STAFF_MANAGEMENT')) {
      userMenuActions.push({
          label: 'Invite Staff',
          action: 'invite-staff',
          icon: UserPlus
      });
  }

  const handleAction = (action: string) => {
    if (action === "invite-patient") {
      setInviteType('patient');
      setShowInviteModal(true);
    } else if (action === "invite-staff") {
      setInviteType('staff');
      setShowInviteModal(true);
    }
  };

  return (
    <>
    <RBACProvider value={{ role, getAccess: getAccessForRole }}>
      <AppShell 
        navItems={navItems} 
        appName="Command Center" 
        title={getPageTitle(pathname)}
        onAction={handleAction}
        userMenuActions={userMenuActions}
      >
        {/* Scope Banner (Clinical roles) */}
        {roleMeta?.isClinical && (
          <div className="mx-6 mt-4 mb-2 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700 border border-blue-100">
             <EyeOff className="h-4 w-4" />
             <span className="font-medium">Scoped Access:</span>
             <span>{getScopeLabel(role as CommandCenterRole)}</span>
          </div>
        )}

        {/* Break Shield Banner (Super Admin) - if viewing sensitive data? */}
        {roleMeta?.isSuperAdmin && !breakGlassActive && (
           <div className="mx-6 mt-4 mb-2 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white border border-gray-800 shadow-md">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="font-medium">Admin Mode:</span>
              <span>You have full cross-tenant access. Use break-glass for PHI interactions.</span>
           </div>
        )}

        {children}
      </AppShell>
    </RBACProvider>

      {showInviteModal && (
         <InviteModal 
           type={inviteType} 
           onClose={() => setShowInviteModal(false)}
           onSubmit={(data) => {
             console.log("Invites sent:", data);
             setShowInviteModal(false);
           }}
         />
      )}
    </>
  );
}

/** Derive page title from pathname for the TopBar */
function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Dashboard';
  const segment = pathname.split('/').filter(Boolean)[0];
  const titles: Record<string, string> = {
    episodes: 'Episodes',
    alerts: 'Alerts',
    patients: 'Patients',
    orders: 'Orders',
    rounds: 'Rounds',
    devices: 'Devices',
    approvals: 'Approvals',
    telemedicine: 'Telemedicine',
    staff: 'Staff Management',
    'roles-permissions': 'Roles & Permissions',
    settings: 'Settings',
  };
  return titles[segment ?? ''] ?? 'Overview';
}