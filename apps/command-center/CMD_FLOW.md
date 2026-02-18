# Command Center (CMD :3011) — Implementation Guide

> **Scope:** Command Center only  
> **Stack:** Next.js App Router (RSC default) + client islands for realtime/forms/charts  
> **RBAC keys:** SYSTEM_ADMIN, EUMETISE_SUPER_ADMIN, HOSP_ADMIN, NURSE_COORD, DOCTOR_ON  
> **Access levels:** FULL / READ / SCOPED / NO

## Global Security

- **Break-Glass** required for super admins on PHI views/actions → `X-Access-Justification` header (UI modal + session TTL)
- **Scope enforcement** for SCOPED roles (`tenant_id` + assignment/department/patient)
- **Audit stamp** visible on sensitive actions ("Logged + justification if break-glass")

## Node Legend

| Field | Description |
|---|---|
| NODE_ID | Unique CMD identifier |
| ROUTE | Next.js App Router path |
| SCREEN / PURPOSE | What the page does |
| PRIMARY COMPONENTS | Key React components |
| API (CMD :3011) | Backend API endpoints consumed |
| RBAC (Allowed + Level) | Role → Access Level mapping |
| SCOPE RULE | How SCOPED access is enforced |
| STATES | Loading / Empty / Error / Locked states |
| SECURITY UX | Security-specific UI behavior |
| NEXT NODES | Where the user navigates next |

---

## 00 — App Shell & Auth

### CMD-000 — Login
- **ROUTE:** `/(auth)/login`
- **SCREEN:** Keycloak login entry / SSO
- **COMPONENTS:** LoginShell, SSOButton, OrgBanner
- **API:** Keycloak/OIDC
- **RBAC:** All roles can authenticate
- **STATES:** loading (SSO redirect), error (invalid creds)
- **SECURITY:** CSP + no PHI
- **NEXT:** CMD-010

### CMD-010 — App Shell Layout
- **ROUTE:** `/(shell)/layout`
- **SCREEN:** Global shell (nav + role badge + scope banner)
- **COMPONENTS:** AppShellRSC, NavRail, UserMenu, RoleBadge, ScopeBanner, RBACGuard(Server)
- **API:** `GET /binds`, `GET /binds/:type`
- **RBAC:**
  - SYSTEM/SUPER/HOSP_ADMIN: FULL
  - NURSE_COORD/DOCTOR_ON: READ
- **SCOPE:** tenant_id always; binds read-only for nurse/doctor
- **STATES:** loading (stream shell), error (binds fetch)
- **SECURITY:** watermark layer toggled ON only on PHI routes
- **NEXT:** all nodes

---

## 01 — Dashboard

### CMD-100 — Dashboard Overview
- **ROUTE:** `/(shell)/page`
- **SCREEN:** Operational overview (today's alerts, active episodes, pending approvals)
- **COMPONENTS:** DashboardCards, AlertsMiniQueue, ActiveEpisodesList, ApprovalsWidget
- **API:** `GET /alerts`, `GET /episodes`, `GET /pending-approvals`
- **RBAC:**
  - SYSTEM/SUPER/HOSP_ADMIN: FULL (read UI)
  - NURSE_COORD: SCOPED (filtered)
  - DOCTOR_ON: SCOPED (filtered)
- **SCOPE:** SCOPED → only assigned patients/episodes/department
- **STATES:**
  - Loading: skeleton cards
  - Empty: "No active alerts / episodes"
  - Error: retry panel
  - Locked: if scope none → "No assigned workload"
- **SECURITY:** no PHI beyond minimal counts unless allowed; blur patient identifiers when not scoped
- **NEXT:** CMD-200, CMD-300, CMD-800

---

## 02 — Episodes

### CMD-200 — Episodes List
- **ROUTE:** `/episodes`
- **SCREEN:** Search + filters + list
- **COMPONENTS:** EpisodesTable(RSC), FiltersBar, SearchInput, CreateEpisodeCTA
- **API:** `GET /episodes`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: SCOPED
- **SCOPE:** SCOPED sees only assigned/scope episodes
- **STATES:** loading (table skeleton), empty, error, locked (no scope)
- **SECURITY:** hide patient PII columns for out-of-scope rows
- **NEXT:** CMD-210, CMD-220

### CMD-210 — Create Episode Wizard
- **ROUTE:** `/episodes/new`
- **SCREEN:** Create new episode
- **COMPONENTS:** EpisodeCreateWizard(Client), PatientPicker, PathwaySelector, DraftSummary
- **API:** `POST /episodes`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: SCOPED
- **SCOPE:** must belong to tenant + department
- **STATES:** loading, error (validation/409), locked
- **SECURITY:** audit stamp on create
- **NEXT:** CMD-220

### CMD-220 — Episode Overview
- **ROUTE:** `/episodes/[id]`
- **SCREEN:** Episode "hub" (patient dashboard equivalent)
- **COMPONENTS:** EpisodeHeader, StatusChip, PatientMiniCard, AssignmentsSummary, AlertSummary, QuickActions
- **API:** `GET /episodes/:id`, `GET /episodes/:id/timeline`, `GET /episodes/:id/transitions`, `GET /episodes/:id/assignments`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: SCOPED
- **SCOPE:** must be assigned or in dept scope
- **STATES:** loading, empty, error (404/403), locked
- **SECURITY:** PHI → watermark ON; break-glass for super admins
- **NEXT:** CMD-230…CMD-295

### CMD-230 — Episode Timeline
- **ROUTE:** `/episodes/[id]/timeline`
- **COMPONENTS:** TimelineFeed, EventFilters
- **API:** `GET /episodes/:id/timeline`
- **RBAC:** same as CMD-220
- **NEXT:** CMD-240, CMD-260

### CMD-240 — Episode Transitions
- **ROUTE:** `/episodes/[id]/transitions`
- **COMPONENTS:** TransitionPanel(Client), TransitionHistory
- **API:** `GET /episodes/:id/transitions`, `POST /episodes/:id/transition`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: SCOPED
- **SECURITY:** decision modal requires reason; audit stamp
- **NEXT:** CMD-250, CMD-260, CMD-900

### CMD-250 — Pre-Intake Wizard
- **ROUTE:** `/episodes/[id]/pre-intake`
- **COMPONENTS:** PreIntakeStepper(Client), InterviewForm, TriageForm, EligibilityForm
- **API:** `POST /episodes/:id/pre-intake/interview`, `POST /episodes/:id/pre-intake/triage`, `POST /episodes/:id/pre-intake/eligibility`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: NO; DOCTOR_ON: NO
- **SECURITY:** show 403 page, not partial UI
- **NEXT:** CMD-255

### CMD-255 — Insurance
- **ROUTE:** `/episodes/[id]/insurance`
- **COMPONENTS:** InsurancePanel(Client), VerifyCard, PreAuthCard
- **API:** `POST /episodes/:id/insurance/verify`, `POST/PATCH .../insurance/pre-auth`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE/DOCTOR: NO
- **NEXT:** CMD-260

### CMD-260 — Virtual Ward Enrollment
- **ROUTE:** `/episodes/[id]/enrollment`
- **COMPONENTS:** EnrollmentStepper(Client), ConsentCapture, DeviceAssign, BaselineEntry, CompletionSummary
- **API:** `POST /episodes/:id/enrollment/{eligibility,consent,devices,baseline,complete}`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: NO
- **SECURITY:** consent = logged + immutable; break-glass for super admins
- **NEXT:** CMD-270

### CMD-270 — Assignments
- **ROUTE:** `/episodes/[id]/assignments`
- **COMPONENTS:** AssignmentsTable, AssignUserModal
- **API:** `GET/POST /episodes/:id/assignments`, `DELETE /assignments/:id`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: READ
- **NEXT:** CMD-300, CMD-220

### CMD-280 — Clinical Notes
- **ROUTE:** `/episodes/[id]/notes`
- **COMPONENTS:** NotesList(RSC), NoteComposer(Client) (doctor only)
- **API:** `GET/POST /episodes/:id/notes`, `GET /notes/:id`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: READ; DOCTOR_ON: SCOPED (write)
- **SECURITY:** watermark; PHI; break-glass for super admins
- **NEXT:** CMD-220

### CMD-285 — Medications (Episode)
- **ROUTE:** `/episodes/[id]/medications`
- **COMPONENTS:** MedicationTable, AddMedicationModal (doctor/admin), AdherenceTimeline
- **API:** `GET/POST /episodes/:id/medications`, `PATCH /medications/:id`, `POST /medications/:id/adherence`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: READ; DOCTOR_ON: SCOPED
- **NEXT:** CARE patient view (outside CMD)

### CMD-290 — Telemetry (Episode)
- **ROUTE:** `/episodes/[id]/telemetry`
- **COMPONENTS:** TelemetryDashboard(Client), ChartsAdaptive, ThresholdOverlays, TimeRangePicker
- **API:** `GET /episodes/:id/telemetry`, `GET /episodes/:id/telemetry/aggregates`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE/DOCTOR: SCOPED
- **SECURITY:** watermark; prevent caching (private)
- **NEXT:** CMD-300, CMD-295

### CMD-295 — Devices
- **ROUTE:** `/devices` and `/devices/[id]`
- **COMPONENTS:** DevicesTable, PairDeviceModal, HeartbeatPanel
- **API:** `GET/POST /devices`, `POST/DELETE /devices/:id/pair`, `GET /devices/:id/heartbeats`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: READ
- **SECURITY:** pairing requires audit reason
- **NEXT:** CMD-290

---

## 03 — Alerts

### CMD-300 — Alerts Queue
- **ROUTE:** `/alerts`
- **COMPONENTS:** AlertQueue(Client), Filters, VirtualList, SSEStatusPill
- **API:** `GET /alerts` (+ SSE subscription)
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE/DOCTOR: SCOPED
- **SCOPE:** scoped queue items; out-of-scope rows masked
- **SECURITY:** minimal PHI in list; full detail on scoped selection
- **NEXT:** CMD-310

### CMD-310 — Alert Detail
- **ROUTE:** `/alerts/[id]`
- **COMPONENTS:** AlertDetailPanel, EvidenceTabs, AckButton, ResolveModal, EscalateDrawer, DecisionModal
- **API:** `GET/POST /alerts/:id/{acknowledge,escalate,resolve,decision}`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE/DOCTOR: SCOPED
- **SCOPE:** must be assigned; otherwise 403
- **SECURITY:** actions require reason; watermark; break-glass
- **NEXT:** CMD-220, CMD-290

---

## 04 — Patients

### CMD-400 — Patients List
- **ROUTE:** `/patients`
- **COMPONENTS:** PatientsTable(RSC), Search, Filters
- **API:** `GET /patients`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: READ
- **SECURITY:** mask PII for non-scoped rows
- **NEXT:** CMD-410

### CMD-410 — Patient Profile
- **ROUTE:** `/patients/[id]`
- **COMPONENTS:** PatientHeader, IdentityPanel, ABHALinkPanel, VerificationPanel, PatientEpisodesTable
- **API:** `GET/PATCH /patients/:id`, `POST /patients/:id/abha/link`, `POST /patients/:id/identity/verify`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: READ
- **SECURITY:** break-glass for super admins; audit on verify/link
- **NEXT:** CMD-220

### CMD-420 — Family Links
- **ROUTE:** `/patients/[id]/family`
- **COMPONENTS:** FamilyLinksTable
- **API:** `GET /patients/:id/family`
- **RBAC:** all roles READ
- **NEXT:** admin-only management (later)

---

## 05 — Orders & Results

### CMD-500 — Orders Board
- **ROUTE:** `/orders`
- **COMPONENTS:** OrdersTable(RSC), CreateOrderButtons (doctor/admin)
- **API:** `GET /orders`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: READ; DOCTOR_ON: SCOPED
- **NEXT:** CMD-510

### CMD-510 — Order Detail
- **ROUTE:** `/orders/[id]`
- **API:** `GET /orders/:id`, `PATCH /orders/:id/status`
- **RBAC:** nurse READ; doctor scoped patch; admin full
- **NEXT:** CMD-520

### CMD-520 — Results Board
- **ROUTE:** `/results`
- **API:** `GET /results`
- **RBAC:** nurse READ; doctor scoped; admin full
- **NEXT:** CMD-530

### CMD-530 — Result Detail
- **ROUTE:** `/results/[id]`
- **API:** `GET /results/:id`
- **RBAC:** nurse READ; doctor scoped; admin full
- **SECURITY:** watermark if PHI docs/images

---

## 06 — Rounds

### CMD-600 — Nurse Rounds
- **ROUTE:** `/rounds/nurse`
- **API:** `POST /nurse-rounds`, `POST /nurse-rounds/:id/complete`
- **RBAC:** SYSTEM/SUPER/HOSP_ADMIN: FULL; NURSE_COORD: SCOPED; DOCTOR_ON: SCOPED

### CMD-610 — Doctor Rounds
- **ROUTE:** `/rounds/doctor`
- **API:** `POST /doctor-rounds`, `POST /doctor-rounds/:id/complete`
- **RBAC:** same as CMD-600

---

## 07 — Video Sessions

### CMD-700 — Video Session
- **ROUTE:** `/episodes/[id]/video`
- **API:** `POST/GET /video-sessions`, `POST .../start`, `POST .../end`
- **RBAC:** nurse READ; doctor scoped; admin full
- **SECURITY:** do not expose join tokens to unauthorized roles

---

## 08 — Transfers

### CMD-750 — Transfers
- **ROUTE:** `/episodes/[id]/transfers`
- **API:** `POST /transfers/{ed,hospital,vw}`, `PATCH /transfers/:id/status`
- **RBAC:** doctor scoped; nurse NO; admin full
- **SECURITY:** require reason

---

## 09 — Approvals

### CMD-800 — Pending Approvals Inbox
- **ROUTE:** `/approvals`
- **API:** `GET /pending-approvals`, `POST .../approve`, `POST .../deny`
- **RBAC:** read for nurse/doctor; approve/deny only admin/super
- **SECURITY:** decision requires justification; audited

---

## 10 — Offsite / Binds

### CMD-850 — CC Binds
- **ROUTE:** `/binds`
- **API:** `GET /binds`, `GET /binds/:type`, `GET /binds/:type/users`
- **RBAC:** admin full; nurse/doctor READ

### CMD-860 — Offsite Centers
- **ROUTE:** `/offsite`
- **API:** `GET /offsite/centers`, `GET /offsite/:id/users`, `POST /offsite/:id/actions`
- **RBAC:** read: all; actions: admin-only

---

## 11 — Feature Modules

### CMD-900 — Proactive Care
- **ROUTE:** `/proactive-care`
- **RBAC:** admin full; nurse scoped; doctor read

### CMD-910 — Wellness Checks
- **ROUTE:** `/wellness-checks`
- **RBAC:** admin full; nurse scoped; doctor NO

### CMD-920 — Maternal/Neonatal
- **ROUTE:** `/episodes/[id]/maternal` and `/episodes/[id]/neonatal`
- **RBAC:** admin full; doctor scoped; nurse read

---

## Global Error Pages

| ID | Route | When |
|---|---|---|
| CMD-E403 | `/forbidden` | role=NO or scope failed |
| CMD-E404 | `/not-found` | resource not found in tenant scope |
| CMD-E429/503 | `/error` | rate limit / service issues |

---

## Required Shared Primitives

| Primitive | Purpose |
|---|---|
| **RBACGuard** | Server: blocks route render (403). Client: hides/locks actions |
| **ScopeResolver** | derives scope from JWT claims + assignments; `isInScope()` memoized |
| **BreakGlassModal** | Super admin PHI access: category + justification + TTL + `X-Access-Justification` header |
| **AuditStamp** | who/when/action/reason on every mutation |
| **SSEClient** | Alerts queue subscribe + reconnect backoff + optimistic UI |
