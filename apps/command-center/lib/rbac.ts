/**
 * Command Center RBAC System
 * ==========================
 * Source of truth: CMD_FLOW.md (RBAC Role → API Mapping v2.0)
 *
 * 5 CMD Roles × 23 Modules × 4 Access Levels
 *
 * This file is consumed by:
 *  - (shell)/layout.tsx  → getNavItems()
 *  - (shell)/page.tsx    → dashboard scope
 *  - packages/rbac Gate  → canView / canWrite
 *  - All page-level guards
 */

// ─── Roles ────────────────────────────────────────────────────────────
export type CommandCenterRole =
    | "SYSTEM_ADMIN"
    | "EUMETISE_SUPER_ADMIN"
    | "HOSP_ADMIN"
    | "NURSE_COORD"
    | "DOCTOR_ON";

// ─── Access Levels ────────────────────────────────────────────────────
export type AccessLevel = "FULL" | "READ" | "SCOPED" | "NO";

// ─── Modules (from CMD_FLOW.md nodes) ─────────────────────────────────
export type CMDModule =
    | "EPISODES"
    | "PRE_INTAKE"
    | "INSURANCE"
    | "ENROLLMENT"
    | "PATIENTS"
    | "FAMILY_LINKS"
    | "ASSIGNMENTS"
    | "ALERTS"
    | "ORDERS"
    | "RESULTS"
    | "CLINICAL_NOTES"
    | "ROUNDS"
    | "MEDICATIONS"
    | "TELEMETRY"
    | "DEVICES"
    | "TRANSFERS"
    | "VIDEO_SESSIONS"
    | "BINDS"
    | "OFFSITE"
    | "APPROVALS"
    | "PROACTIVE_CARE"
    | "WELLNESS_CHECKS"
    | "MATERNAL_NEO"
    // Admin-only modules (staff/roles management)
    | "STAFF_MANAGEMENT"
    | "SETTINGS";

// ─── Role Metadata ────────────────────────────────────────────────────
export interface RoleMetadata {
    id: CommandCenterRole;
    label: string;
    shortLabel: string;
    description: string;
    color: string;         // badge color
    isSuperAdmin: boolean; // cross-platform access
    isHospitalAdmin: boolean;
    isClinical: boolean;   // nurse/doctor = true
}

export const ROLE_META: Record<CommandCenterRole, RoleMetadata> = {
    SYSTEM_ADMIN: {
        id: "SYSTEM_ADMIN",
        label: "System Administrator",
        shortLabel: "Sys Admin",
        description: "Lemnyscate CEO/CTO — Full platform control, emergency override, cross-hospital access",
        color: "red",
        isSuperAdmin: true,
        isHospitalAdmin: false,
        isClinical: false,
    },
    EUMETISE_SUPER_ADMIN: {
        id: "EUMETISE_SUPER_ADMIN",
        label: "Eumetise Super Admin",
        shortLabel: "Super Admin",
        description: "Lemnyscate Global Admin — Identical to SYSTEM_ADMIN, separate audit identity",
        color: "red",
        isSuperAdmin: true,
        isHospitalAdmin: false,
        isClinical: false,
    },
    HOSP_ADMIN: {
        id: "HOSP_ADMIN",
        label: "Hospital Administrator",
        shortLabel: "Hosp Admin",
        description: "Full clinical and operational access within own hospital",
        color: "blue",
        isSuperAdmin: false,
        isHospitalAdmin: true,
        isClinical: false,
    },
    NURSE_COORD: {
        id: "NURSE_COORD",
        label: "Nurse Coordinator",
        shortLabel: "Nurse",
        description: "Assigned patient scope — vitals, rounds, alerts, enrollment",
        color: "teal",
        isSuperAdmin: false,
        isHospitalAdmin: false,
        isClinical: true,
    },
    DOCTOR_ON: {
        id: "DOCTOR_ON",
        label: "Doctor (Onsite)",
        shortLabel: "Doctor",
        description: "Assigned patient scope — orders, notes, medications, telemetry",
        color: "indigo",
        isSuperAdmin: false,
        isHospitalAdmin: false,
        isClinical: true,
    },
};

// ─── Role × Module → Access Level Matrix ──────────────────────────────
// Directly derived from the RBAC Role → API Mapping v2.0 tables
//
// Order: [SYSTEM_ADMIN, EUMETISE_SUPER_ADMIN, HOSP_ADMIN, NURSE_COORD, DOCTOR_ON]

type RoleAccessRow = [AccessLevel, AccessLevel, AccessLevel, AccessLevel, AccessLevel];

const ROLE_ORDER: CommandCenterRole[] = [
    "SYSTEM_ADMIN", "EUMETISE_SUPER_ADMIN", "HOSP_ADMIN", "NURSE_COORD", "DOCTOR_ON"
];

const ACCESS_MATRIX: Record<CMDModule, RoleAccessRow> = {
    //                                          SYS    SUPER   HOSP   NURSE   DOCTOR
    EPISODES: ["FULL", "FULL", "FULL", "SCOPED", "SCOPED"],
    PRE_INTAKE: ["FULL", "FULL", "FULL", "NO", "NO"],
    INSURANCE: ["FULL", "FULL", "FULL", "NO", "NO"],
    ENROLLMENT: ["FULL", "FULL", "FULL", "SCOPED", "NO"],
    PATIENTS: ["FULL", "FULL", "FULL", "SCOPED", "READ"],
    FAMILY_LINKS: ["FULL", "FULL", "FULL", "READ", "READ"],
    ASSIGNMENTS: ["FULL", "FULL", "FULL", "SCOPED", "READ"],
    ALERTS: ["FULL", "FULL", "FULL", "SCOPED", "SCOPED"],
    ORDERS: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    RESULTS: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    CLINICAL_NOTES: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    ROUNDS: ["FULL", "FULL", "FULL", "SCOPED", "SCOPED"],
    MEDICATIONS: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    TELEMETRY: ["FULL", "FULL", "FULL", "SCOPED", "SCOPED"],
    DEVICES: ["FULL", "FULL", "FULL", "SCOPED", "READ"],
    TRANSFERS: ["FULL", "FULL", "FULL", "NO", "SCOPED"],
    VIDEO_SESSIONS: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    BINDS: ["FULL", "FULL", "FULL", "READ", "READ"],
    OFFSITE: ["FULL", "FULL", "FULL", "READ", "READ"],
    APPROVALS: ["FULL", "FULL", "FULL", "READ", "READ"],
    PROACTIVE_CARE: ["FULL", "FULL", "FULL", "SCOPED", "READ"],
    WELLNESS_CHECKS: ["FULL", "FULL", "FULL", "SCOPED", "NO"],
    MATERNAL_NEO: ["FULL", "FULL", "FULL", "READ", "SCOPED"],
    // Admin-only modules
    STAFF_MANAGEMENT: ["FULL", "FULL", "FULL", "NO", "NO"],
    SETTINGS: ["FULL", "FULL", "FULL", "NO", "NO"],
};

// ─── Access Helpers ───────────────────────────────────────────────────

/** Get the access level for a specific role on a specific module */
export function getAccess(role: CommandCenterRole, module: CMDModule): AccessLevel {
    const roleIndex = ROLE_ORDER.indexOf(role);
    if (roleIndex === -1) return "NO";
    return ACCESS_MATRIX[module][roleIndex];
}

/** Can this role see anything in this module (not NO)? */
export function canView(role: CommandCenterRole, module: CMDModule): boolean {
    return getAccess(role, module) !== "NO";
}

/** Can this role write/mutate in this module (FULL or SCOPED)? */
export function canWrite(role: CommandCenterRole, module: CMDModule): boolean {
    const level = getAccess(role, module);
    return level === "FULL" || level === "SCOPED";
}

/** Is this role a super admin (cross-platform FULL access)? */
export function isSuperAdmin(role: CommandCenterRole): boolean {
    return ROLE_META[role].isSuperAdmin;
}

/** Is this role a hospital-level admin? */
export function isAdmin(role: CommandCenterRole): boolean {
    return ROLE_META[role].isHospitalAdmin || ROLE_META[role].isSuperAdmin;
}

/** Does this role require break-glass for PHI? */
export function requiresBreakGlass(role: CommandCenterRole): boolean {
    return ROLE_META[role].isSuperAdmin;
}

/** Is this a clinical role (nurse/doctor)? */
export function isClinical(role: CommandCenterRole): boolean {
    return ROLE_META[role].isClinical;
}

/** Get scope descriptor for this role */
export function getScopeLabel(role: CommandCenterRole): string {
    if (isSuperAdmin(role)) return "All hospitals";
    if (isAdmin(role)) return "Own hospital";
    return "Assigned patients only";
}

// ─── Navigation ───────────────────────────────────────────────────────

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: string; // lucide icon name
    module: CMDModule;
    badge?: string;
    section: "main" | "admin";
}

/** All possible nav items in the CMD shell */
const ALL_NAV_ITEMS: NavItem[] = [
    // Main section — clinical operations
    { id: "dashboard", label: "Dashboard", href: "/", icon: "LayoutDashboard", module: "EPISODES", section: "main" },
    { id: "episodes", label: "Episodes", href: "/episodes", icon: "ClipboardList", module: "EPISODES", section: "main" },
    { id: "alerts", label: "Alerts", href: "/alerts", icon: "Bell", module: "ALERTS", section: "main" },
    { id: "patients", label: "Patients", href: "/patients", icon: "Users", module: "PATIENTS", section: "main" },
    { id: "orders", label: "Orders", href: "/orders", icon: "FileText", module: "ORDERS", section: "main" },
    { id: "rounds", label: "Rounds", href: "/rounds", icon: "Stethoscope", module: "ROUNDS", section: "main" },
    { id: "devices", label: "Devices", href: "/devices", icon: "Cpu", module: "DEVICES", section: "main" },
    { id: "approvals", label: "Approvals", href: "/approvals", icon: "CheckSquare", module: "APPROVALS", section: "main" },
    { id: "telemedicine", label: "Telemedicine", href: "/telemedicine", icon: "Video", module: "VIDEO_SESSIONS", section: "main" },
    // Admin section — hospital management
    { id: "staff", label: "Staff", href: "/staff", icon: "UserCog", module: "STAFF_MANAGEMENT", section: "admin" },
    { id: "roles", label: "Roles", href: "/roles-permissions", icon: "Shield", module: "STAFF_MANAGEMENT", section: "admin" },
    { id: "settings", label: "Settings", href: "/settings", icon: "Settings", module: "SETTINGS", section: "admin" },
];

/** Get navigation items visible to a specific role */
export function getNavItems(role: CommandCenterRole): NavItem[] {
    return ALL_NAV_ITEMS.filter(item => canView(role, item.module));
}

/** Get navigation items grouped by section */
export function getNavItemsBySection(role: CommandCenterRole): { main: NavItem[]; admin: NavItem[] } {
    const items = getNavItems(role);
    return {
        main: items.filter(i => i.section === "main"),
        admin: items.filter(i => i.section === "admin"),
    };
}

// ─── Break-Glass Categories ───────────────────────────────────────────

export type BreakGlassCategory =
    | "EMERGENCY_OVERRIDE"
    | "INVESTIGATION"
    | "SUPPORT_ESCALATION"
    | "SYSTEM_MAINTENANCE"
    | "AUDIT_REVIEW";

export const BREAK_GLASS_CATEGORIES: { id: BreakGlassCategory; label: string; ttlHours: number }[] = [
    { id: "EMERGENCY_OVERRIDE", label: "Patient safety emergency", ttlHours: 4 },
    { id: "INVESTIGATION", label: "Compliance investigation", ttlHours: 24 },
    { id: "SUPPORT_ESCALATION", label: "Support ticket escalation", ttlHours: 8 },
    { id: "SYSTEM_MAINTENANCE", label: "Planned maintenance", ttlHours: 8 },
    { id: "AUDIT_REVIEW", label: "Scheduled audit/review", ttlHours: 24 },
];

// ─── Granular Permissions (Huma Spec) ─────────────────────────────────

export type GranularPermission =
    | "MANAGE_PATIENT_DATA"    // Add/remove, edit, labels, assign staff
    | "CONTACT_PATIENT"        // Schedule calls, message, call
    | "VIEW_PATIENT_DATA"      // Read-only access (Mandatory)
    | "VIEW_IDENTIFIERS"       // Name, email, DOB
    | "EXPORT_PATIENT_DATA"    // JSON/CSV export
    | "MANAGE_ROLES"           // Edit roles & permissions
    | "MANAGE_STAFF"           // Add/remove staff, assign roles
    | "VIEW_STAFF"             // View staff list
    | "OFFBOARD_PATIENTS";     // Remove patient access

export const PERMISSION_LABELS: Record<GranularPermission, string> = {
    MANAGE_PATIENT_DATA: "Manage patient data",
    CONTACT_PATIENT: "Contact patient",
    VIEW_PATIENT_DATA: "View patient data (can't uncheck)",
    VIEW_IDENTIFIERS: "View patient identifiers",
    EXPORT_PATIENT_DATA: "Export patient data",
    MANAGE_ROLES: "Edit roles & permissions",
    MANAGE_STAFF: "Add / Remove staff members",
    VIEW_STAFF: "View staff members in organisation",
    OFFBOARD_PATIENTS: "Offboard patient",
};

export interface CustomRole {
    id: string;
    label: string;
    permissions: GranularPermission[];
    isSystem: false;
}

// ─── Default Dashboard Redirect ───────────────────────────────────────

/** Where should this role land after login? */
export function getDefaultRoute(role: CommandCenterRole): string {
    // All roles land on the dashboard overview (CMD-100)
    // The dashboard itself shows role-scoped content
    return "/";
}
