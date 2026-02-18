'use client';

import { useSessionStore } from '@eumetise/state';
import { useRBAC } from '@eumetise/rbac';
import {
  Bell,
  ClipboardList,
  Users,
  CheckSquare,
  ArrowRight,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import type { CommandCenterRole } from '@/lib/rbac';
import { ROLE_META, getScopeLabel, canView, isSuperAdmin as checkSuperAdmin } from '@/lib/rbac';

/**
 * CMD-100 — Dashboard Overview
 *
 * Operational overview page. Shows:
 * - Alert count + mini queue
 * - Active episodes count
 * - Pending approvals (admin only)
 * - Quick navigation cards
 *
 * SCOPED roles see filtered counts; super admins see cross-hospital totals.
 */

// Mock data for development — replace with real API calls
const MOCK_ALERTS = [
  { id: '1', patient: 'John D.', type: 'Vital Threshold', severity: 'red', time: '2m ago' },
  { id: '2', patient: 'Sarah M.', type: 'Missed Medication', severity: 'amber', time: '15m ago' },
  { id: '3', patient: 'Ravi K.', type: 'Device Offline', severity: 'gray', time: '1h ago' },
];

const MOCK_EPISODES = [
  { id: '1', patient: 'John D.', status: 'Active', pathway: 'Post-Surgery', day: 3 },
  { id: '2', patient: 'Sarah M.', status: 'Monitoring', pathway: 'CHF', day: 7 },
  { id: '3', patient: 'Ravi K.', status: 'Pre-Intake', pathway: 'Maternal', day: 1 },
];

export default function DashboardPage() {
  const { user } = useSessionStore();
  const { canView: canViewModule } = useRBAC();

  const role: CommandCenterRole = (user?.role as CommandCenterRole) ?? 'HOSP_ADMIN';
  const meta = ROLE_META[role];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-hero-subtitle font-haas-disp font-bold text-gray-900 tracking-tight">
          Good {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Doctor'}
        </h1>
        <p className="mt-1 text-body-text text-gray-500 font-haas-text">
          {meta.shortLabel} · {getScopeLabel(role)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Bell className="h-5 w-5 text-red-500" />}
          label="Active Alerts"
          value={MOCK_ALERTS.length}
          trend="2 critical"
          trendColor="text-red-600"
          href="/alerts"
        />
        <StatCard
          icon={<ClipboardList className="h-5 w-5 text-blue-500" />}
          label="Active Episodes"
          value={MOCK_EPISODES.length}
          trend="+1 today"
          trendColor="text-blue-600"
          href="/episodes"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-emerald-500" />}
          label="Patients"
          value={12}
          trend={meta.isClinical ? 'Assigned to you' : 'In hospital'}
          trendColor="text-emerald-600"
          href="/patients"
        />
        {canViewModule('APPROVALS') && (
          <StatCard
            icon={<CheckSquare className="h-5 w-5 text-amber-500" />}
            label="Pending Approvals"
            value={5}
            trend="3 urgent"
            trendColor="text-amber-600"
            href="/approvals"
          />
        )}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Alerts Mini Queue */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section-header font-semibold text-gray-900 font-haas-disp">Alerts Queue</h2>
            <Link
              href="/alerts"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_ALERTS.map((alert) => (
              <Link
                key={alert.id}
                href={`/alerts/${alert.id}`}
                className="flex items-center gap-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group"
              >
                <div className={`h-3 w-3 rounded-full flex-shrink-0 shadow-sm ${
                  alert.severity === 'red' ? 'bg-red-500 shadow-red-200' :
                  alert.severity === 'amber' ? 'bg-amber-500 shadow-amber-200' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {meta.isClinical && alert.severity === 'red' ? alert.patient : 'Patient'}
                    {' — '}{alert.type}
                  </p>
                </div>
                <span className="text-caption-sm text-gray-400 flex-shrink-0 font-medium">{alert.time}</span>
              </Link>
            ))}
            {MOCK_ALERTS.length === 0 && (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <Bell className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-body text-gray-500">No active alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Episodes */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section-header font-semibold text-gray-900 font-haas-disp">Active Episodes</h2>
            <Link
              href="/episodes"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_EPISODES.map((ep) => (
              <Link
                key={ep.id}
                href={`/episodes/${ep.id}`}
                className="flex items-center justify-between rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 font-ibm-plex">
                    D{ep.day}
                  </div>
                  <div>
                    <p className="text-body font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {meta.isClinical ? ep.patient : 'Patient'} — {ep.pathway}
                    </p>
                    <p className="text-caption-sm text-gray-500 font-medium">{ep.status}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
            {MOCK_EPISODES.length === 0 && (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <ClipboardList className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-body text-gray-500">No active episodes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Super Admin Notice */}
      {checkSuperAdmin(role) && (
        <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 backdrop-blur-sm">
          <div className="p-2 bg-red-100 rounded-full">
             <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          </div>
          <div className="text-sm pt-1">
            <p className="font-semibold text-red-900 font-haas-text">Cross-Platform Admin Session</p>
            <p className="mt-1 text-red-700 leading-relaxed">
              PHI access requires break-glass justification. All actions are logged with enhanced audit detail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  trend,
  trendColor,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend: string;
  trendColor: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50/50 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-2xl bg-gray-50 p-2.5 group-hover:bg-blue-50 transition-colors duration-300">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
      <p className="text-widget-value font-bold text-gray-900 font-haas-disp tracking-tight">{value}</p>
      <p className="text-body text-gray-500 font-medium mt-1">{label}</p>
      <p className={`mt-2 text-caption-sm font-semibold ${trendColor} bg-gray-50 inline-block px-2 py-0.5 rounded-md`}>{trend}</p>
    </Link>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
