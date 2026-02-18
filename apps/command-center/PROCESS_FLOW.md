# Eumetise Command Center - Process Flow & Design Guide

## 1. Design Philosophy
The Eumetise Command Center is built with a "Clinical OS" aesthetic, inspired by modern operating systems (Apple/iOS) but tailored for high-stakes clinical environments.

### Core Principles
-   **"Calm Clarity"**: Using whitespace, blurred backdrops, and subtle gradients to reduce cognitive load.
-   **Typography**:
    -   **Haas Grot Disp**: Used for bold, impactful headings (Hero titles, values).
    -   **IBM Plex Sans**: Used for data-dense areas (tables, charts) for maximum legibility.
    -   **Haas Grot Text**: Used for body copy and UI labels.
-   **Color System**:
    -   **Base**: Cream (`#F6F4F2`) and White (`#FFFFFF`) for warmth and cleanliness.
    -   **Action**: Deep Black (`#1A1A1A`) for primary actions.
    -   **Status**: Soft pastels for background states, vibrant but accessible colors for alerts (Red/Amber).

## 2. User Flow

### Phase 1: Authentication & Onboarding
**Goal**: Secure, frictionless entry.
1.  **Login Page**
    -   *Design*: Split screen or centered card with frosted glass effect (`backdrop-blur-xl`).
    -   *Interaction*: Progressive disclosure. User enters email -> System validates -> transitions to MFA.
    -   *Animation*: Smooth layout transitions (`framer-motion`) between steps.
2.  **MFA Verification**
    -   *Method*: Passwordless/Time-based OTP.
    -   *Feedback*: Real-time animation while waiting for approval.
3.  **Account Setup (First time)**
    -   *Style*: Conversational UI ("Chat with Eumetise").
    -   *Steps*: Confirm Name -> Address -> Clinical Units Preference -> Setup Authenticator.

### Phase 2: Command Center Dashboard (Shell)
**Goal**: Immediate operational awareness.
1.  **Overview**
    -   **Header**: Personalized greeting ("Good morning, Doctor") with role scope.
    -   **Stat Cards**: Vital metrics (Active Alerts, Episodes) with trend indicators.
    -   **Mini Queues**: Quick access to "Alerts Queue" and "Active Episodes".
2.  **Navigation**
    -   Sidebar with clear, icon-based modules (Patients, Staff, Analytics).

### Phase 3: Patient Management
**Goal**: Deep clinical insight.
1.  **Patient List** (implied)
    -   Searchable, filterable table of assigned patients.
2.  **Patient Health Data** (`/patients/[id]/health-data`)
    -   **Module Sidebar**: Quick switching between Vitals, Labs, Respiratory, etc.
    -   **Main View**:
        -   **Hero Metric**: Large, bold display of the latest reading.
        -   **Interactive Chart**: Zoomable, pannable history.
        -   **Overlay**: Compare two metrics (e.g., SpO2 vs Heart Rate) to find correlations.
    -   **Tools**: Time range slider, Export, Table view toggle.

### Phase 4: Staff Management
**Goal**: efficient role administration.
1.  **Staff Table**
    -   List of all clinical staff.
    -   **Role Management**: Clickable badges to upgrade/downgrade permissions instantly (RBAC).

## 3. Technical Highlights
-   **Performance**: Server Components for layout, Client Components for interactivity.
-   **Loading States**: Custom `Skeleton` components with shimmer effects matching the brand colors.
-   **Icons**: Lucide React for consistent, clean iconography.
-   **State**: `zustand` for managing local overrides and UI state (sidebars, overlays).
