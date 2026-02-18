# Command Center: Roles, Permissions, and Invitations

This document outlines the architecture and implementation details for the Roles, Permissions, and Invitation system within the **Eumetise Command Center**.

## 1. System Overview

The Command Center features a robust **Role-Based Access Control (RBAC)** system. Users (Staff) can only access features and data associated with their roles.

### User Roles

#### Default Roles
- **Admin & Access Controller**: Full control over users, roles, and configurations.
- **Organisation Staff**: View staff, view/edit patient data, offboard patients.
- **Deployment Staff**: Manage deployments, view/edit patient data.
- **Contributor**: Limited view (often read-only or specific task-based access).

#### Custom Roles
- Administrators can create bespoke roles by selecting specific permission sets.
- Example: "Triage Nurse" (View data, Contact patient, but cannot Config system).

### Permissions Matrix
| Permission | Description |
| :--- | :--- |
| **View patient data** | Mandatory. Read-only access to vitals/logs. |
| **Manage patient data** | Add/remove patients, edit details, assign labels/staff. |
| **Contact patient** | Schedule calls, direct messaging. |
| **View patient identifiers** | Access PII (Name, Email, DOB). |
| **Export patient data** | Download JSON/CSV reports. |
| **Edit roles & permissions** | Create/Modify custom roles. |
| **Add/remove staff members** | Invite users, assign roles, revoke access. |
| **View staff in Organisation** | See colleagues and their roles. |
| **Offboard patients** | Remove patient access/discharge. |

---

## 2. Implementation Flows

### A. Inviting Staff Members
**Actors**: Admin, Access Controller.
1.  **Navigate**: Top Bar -> "Overview of All staff members" OR Profile Menu -> "Invite staff".
2.  **Action**: Click "Invite staff members".
3.  **Modal Input**:
    *   **Email(s)**: Comma-separated or CSV Import.
    *   **Role**: Select from Dropdown (Default or Custom).
    *   **Expiry**: Set link duration (24h, 48h, 7 days, 1 year).
4.  **Process**: System sends email invitation.
5.  **Tracking**: "Pending staff invitations" view allows resending or deleting invites.

### B. Creating Custom Roles
**Actors**: Admin, Access Controller.
1.  **Entry**: "Edit roles" (from Invite Modal or Staff List menu).
2.  **Interface**: List of existing roles.
3.  **Action**: Click "Add a role".
4.  **Configuration**:
    *   **Name**: Define role name.
    *   **Permissions**: Toggle checkboxes (some mandatory).
5.  **Save**: Validates logic and persists role definition.

### C. Inviting Patients
**Actors**: Staff with 'Manage patient data' permission.
1.  **Navigate**: Profile Menu -> "Invite Patients".
2.  **Input**:
    *   **Expiry**: Set link duration.
    *   **Email(s)**: Comma-separated or CSV / Direct Link Copy.
3.  **Process**:
    *   Patient receives link -> Downloads App -> Creates Account.
4.  **Tracking**: "Pending patient invitations" view (via filter or Overview dropdown).

---

## 3. Technical Architecture

### Frontend (Next.js App Router)
- **RBAC Hook**: `usePermission(permission: string): boolean`
- **Guards**: `RoleGuard` component to wrap protected routes/elements.
- **State Management**: React Query / SWR for fetching role definitions and staff lists.

### Components
- `StaffList`: Data table with robust filtering/sorting.
- `InviteModal`: Polymorphic modal handling both Staff and Patient invites.
- `RoleEditor`: Form with validation for permissions.
- `PendingInvitesList`: Specialized view of the `StaffList`/`PatientList`.

### Integration Readiness
- Data structures align with standard RBAC schemas (User -> Role -> Permissions[]).
- "Optimistic UI" updates for invites to ensure responsiveness.
- APIs structured for BFF (Backend-for-Frontend) consumption patterns.
