import { create } from 'zustand';

/**
 * User type aligned with Command Center RBAC roles.
 * The `role` field uses the same string literals as `CommandCenterRole`
 * from `@command-center/lib/rbac.ts`.
 *
 * In production this would be hydrated from the Keycloak JWT claims.
 */
interface User {
  id: string;
  name: string;
  role: 'SYSTEM_ADMIN' | 'EUMETISE_SUPER_ADMIN' | 'HOSP_ADMIN' | 'NURSE_COORD' | 'DOCTOR_ON';
  orgId: string;       // tenant_id
  departmentId?: string; // for SCOPED roles
  assignedPatientIds?: string[]; // for SCOPED roles
}

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  breakGlassActive: boolean;
  breakGlassExpiry: number | null; // timestamp
  breakGlassJustification: string | null;
  setUser: (user: User) => void;
  logout: () => void;
  activateBreakGlass: (justification: string, ttlHours: number) => void;
  clearBreakGlass: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Mock default: Hospital Admin for development
  user: {
    id: '1',
    name: 'Dr. House',
    role: 'HOSP_ADMIN',
    orgId: 'eumetise-hospital-01',
  },
  isAuthenticated: true,
  breakGlassActive: false,
  breakGlassExpiry: null,
  breakGlassJustification: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({
    user: null,
    isAuthenticated: false,
    breakGlassActive: false,
    breakGlassExpiry: null,
    breakGlassJustification: null,
  }),
  activateBreakGlass: (justification, ttlHours) => set({
    breakGlassActive: true,
    breakGlassExpiry: Date.now() + ttlHours * 60 * 60 * 1000,
    breakGlassJustification: justification,
  }),
  clearBreakGlass: () => set({
    breakGlassActive: false,
    breakGlassExpiry: null,
    breakGlassJustification: null,
  }),
}));

// Personalization Store - Caches screen definitions
interface PersonalizationState {
  screens: Record<string, any>;
  setScreen: (id: string, def: any) => void;
}

export const usePersonalizationStore = create<PersonalizationState>((set) => ({
  screens: {},
  setScreen: (id, def) => set((state) => ({ screens: { ...state.screens, [id]: def } })),
}));