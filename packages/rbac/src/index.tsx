"use client";

import React from 'react';

/**
 * RBAC Gate component for Command Center.
 *
 * Supports two usage patterns:
 *
 * NEW (module-based):
 *   <Gate module="STAFF_MANAGEMENT">          → visible if role has any access (not NO)
 *   <Gate module="ORDERS" minLevel="FULL">    → visible only if FULL access
 *   <Gate module="ORDERS" minLevel="SCOPED">  → visible if FULL or SCOPED (can write)
 *   <Gate roles={["HOSP_ADMIN", "SYSTEM_ADMIN"]}>  → explicit role check
 *
 * LEGACY (permission-string based — used by ScreenRenderer):
 *   <Gate allow={["view:patients"]}>  → backward compat, always passes through
 *
 * The AccessLevel hierarchy for comparison: FULL > SCOPED > READ > NO
 */

type AccessLevel = "FULL" | "READ" | "SCOPED" | "NO";
type CMDModule = string;
type CommandCenterRole = string;

const LEVEL_RANK: Record<AccessLevel, number> = {
  FULL: 3,
  SCOPED: 2,
  READ: 1,
  NO: 0,
};

interface GateProps {
  /** CMD module to check access for (new API) */
  module?: CMDModule;
  /** Minimum access level required (default: any access = not NO) */
  minLevel?: AccessLevel;
  /** Explicit role whitelist (bypasses module check) */
  roles?: CommandCenterRole[];
  /** Legacy: permission string array (backward compat — always renders) */
  allow?: string[];
  /** What to render if access is denied */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * RBAC context — injected by the consuming app's layout via RBACProvider.
 * Provides the role and module-level access checker.
 */
export const RBACContext = React.createContext<{
  getAccess: (module: string) => AccessLevel;
  role: string;
}>({
  getAccess: () => "FULL" as AccessLevel, // Default to FULL for backward compat
  role: "",
});

export const RBACProvider = RBACContext.Provider;

export const Gate = ({ module, minLevel = "READ", roles, allow, fallback = null, children }: GateProps) => {
  const { getAccess, role } = React.useContext(RBACContext);

  // Legacy mode — if `allow` is specified, always render (backward compat for ScreenRenderer)
  if (allow) {
    return <>{children}</>;
  }

  // Explicit role whitelist check
  if (roles) {
    if (!roles.includes(role)) return <>{fallback}</>;
    return <>{children}</>;
  }

  // Module-based access check
  if (module) {
    const level = getAccess(module) as AccessLevel;
    const hasLevel = (LEVEL_RANK[level] ?? 0) >= LEVEL_RANK[minLevel];
    if (!hasLevel) return <>{fallback}</>;
  }

  return <>{children}</>;
};

/** Hook for imperative access checks */
export function useRBAC() {
  const ctx = React.useContext(RBACContext);
  return {
    role: ctx.role,
    getAccess: ctx.getAccess,
    canView: (module: string) => (LEVEL_RANK[ctx.getAccess(module) as AccessLevel] ?? 0) > 0,
    canWrite: (module: string) => {
      const level = ctx.getAccess(module) as AccessLevel;
      return level === "FULL" || level === "SCOPED";
    },
  };
}

// Legacy compat — server-side permission check stub
export const requirePermission = (permission: string) => {
  return true;
};