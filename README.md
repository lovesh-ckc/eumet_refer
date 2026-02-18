# EUMETISE Virtual Ward Platform

A production-grade, monorepo frontend system for Connected Care.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    pnpm install
    ```

2.  **Start the Platform**
    ```bash
    pnpm dev
    ```

3.  **Access the System**
    Open your browser to the Unified Launcher:
    👉 **http://localhost:3000**

## 📦 Applications

The system runs 3 simultaneous Next.js applications:

| App | Role | Port | Description |
|-----|------|------|-------------|
| **Control Center** | Admin / Builder | `:3000` | Deployment configuration, RBAC, and System settings. |
| **Command Center** | Clinician / Ops | `:3001` | Patient monitoring, telemedicine, and alerts. |
| **Care Hub** | Provider | `:3002` | Offline-first tablet app for home visits. |

## 🛠 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Monorepo:** Turbo + PNPM
*   **Styling:** Tailwind CSS + Design Tokens (`packages/config`)
*   **State:** Zustand (Global Session + Personalization)
*   **Security:** CSP Headers + Runtime DOM Guard (`packages/security`)
*   **UI System:** Atomic Design (`packages/ui`)

## 🔐 Security Features

*   **CSP Nonce:** Generated per request in `middleware.ts`.
*   **Watermarking:** `SecurityRuntime` overlays user session info.
*   **DOM Guard:** MutationObserver prevents tampering with sensitive UI.
*   **RBAC:** `<Gate>` component restricts access based on permissions.
