import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GranularPermission } from '@/lib/rbac';
import { v4 as uuidv4 } from 'uuid';

export interface CustomRole {
    id: string;
    name: string;
    permissions: GranularPermission[];
    createdAt: string;
}

interface RoleState {
    customRoles: CustomRole[];
    addRole: (name: string, permissions: GranularPermission[]) => void;
    updateRole: (id: string, name: string, permissions: GranularPermission[]) => void;
    deleteRole: (id: string) => void;
    getRole: (id: string) => CustomRole | undefined;
}

export const useRoleStore = create<RoleState>()(
    persist(
        (set, get) => ({
            customRoles: [],

            addRole: (name, permissions) => {
                const newRole: CustomRole = {
                    id: `role_${uuidv4().slice(0, 8)}`,
                    name,
                    permissions,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ customRoles: [...state.customRoles, newRole] }));
            },

            updateRole: (id, name, permissions) => {
                set((state) => ({
                    customRoles: state.customRoles.map((role) =>
                        role.id === id ? { ...role, name, permissions } : role
                    ),
                }));
            },

            deleteRole: (id) => {
                set((state) => ({
                    customRoles: state.customRoles.filter((role) => role.id !== id),
                }));
            },

            getRole: (id) => get().customRoles.find((r) => r.id === id),
        }),
        {
            name: 'cmd-role-storage',
        }
    )
);
