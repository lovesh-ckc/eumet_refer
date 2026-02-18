'use client';
import Link from 'next/link';
import { ArrowRight, Settings, Activity, Tablet, ShieldCheck, Database, Lock } from 'lucide-react';
import { Badge, Button } from '@eumetise/ui';

export default function SystemLauncher() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-ibm-plex">
      {/* Global Header */}
      <header className="bg-base-black text-white py-6 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center text-black">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold font-haas-disp tracking-wide">EUMETISE</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Virtual Ward Operating System</p>
            </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"/> System Operational</span>
            <span className="font-mono">v2.4.0-RC1</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="mb-12 text-center">
            <h2 className="text-hero-title font-haas-disp mb-4 text-gray-900">Select Workspace</h2>
            <p className="text-sub-heading font-normal text-gray-500 max-w-2xl mx-auto">
                Access specific modules based on your role. Security policies are enforced across all domains.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* App 1: Control Center */}
            <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-accent-300 transition-all duration-300">
                <div className="h-2 bg-gray-900 w-full" />
                <div className="p-8">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                        <Settings className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold font-haas-disp mb-2">Control Center</h3>
                    <div className="flex gap-2 mb-4">
                        <Badge variant="default">Port 3000</Badge>
                        <Badge variant="default">Admin</Badge>
                    </div>
                    <p className="text-gray-500 mb-8 min-h-[48px]">
                        Tenant configuration, deployment builder, and staff management console.
                    </p>
                    
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                         <Link href="/login" className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-accent-600 transition-colors">
                            Launch Console <ArrowRight className="w-4 h-4" />
                         </Link>
                         <p className="text-xs text-gray-400">Credentials: admin@eumetise.com</p>
                    </div>
                </div>
            </div>

            {/* App 2: Command Center */}
            <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-accent-300 transition-all duration-300">
                <div className="h-2 bg-accent-500 w-full" />
                <div className="p-8">
                    <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                        <Activity className="w-7 h-7 text-accent-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-haas-disp mb-2">Command Center</h3>
                    <div className="flex gap-2 mb-4">
                        <Badge variant="default">Port 3001</Badge>
                        <Badge variant="success">Clinician</Badge>
                    </div>
                    <p className="text-gray-500 mb-8 min-h-[48px]">
                        Patient monitoring dashboard, telemedicine hub, and alerts management.
                    </p>
                    
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                         <a href="http://localhost:3001/login" target="_blank" className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-accent-600 transition-colors">
                            Open Dashboard <ArrowRight className="w-4 h-4" />
                         </a>
                         <p className="text-xs text-gray-400">Credentials: clinician@hospital.org</p>
                    </div>
                </div>
            </div>

            {/* App 3: Care Hub */}
            <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-accent-300 transition-all duration-300">
                <div className="h-2 bg-success-500 w-full" />
                <div className="p-8">
                    <div className="w-14 h-14 bg-success-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-success-500 group-hover:text-white transition-colors">
                        <Tablet className="w-7 h-7 text-success-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-haas-disp mb-2">Care Hub</h3>
                    <div className="flex gap-2 mb-4">
                        <Badge variant="default">Port 3002</Badge>
                        <Badge variant="warning">Tablet / Mobile</Badge>
                    </div>
                    <p className="text-gray-500 mb-8 min-h-[48px]">
                        Offline-first provider application for home visits and task execution.
                    </p>
                    
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                         <a href="http://localhost:3002/login" target="_blank" className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-accent-600 transition-colors">
                            Launch App <ArrowRight className="w-4 h-4" />
                         </a>
                         <p className="text-xs text-gray-400">Provider ID: 8829</p>
                    </div>
                </div>
            </div>
        </div>

        {/* System Stats Footer */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-200 pt-8">
            <div className="flex items-center gap-4">
                <Database className="w-8 h-8 text-gray-300" />
                <div>
                    <p className="font-bold text-lg">PostgreSQL</p>
                    <p className="text-xs text-gray-500">Primary Database</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-gray-300" />
                <div>
                    <p className="font-bold text-lg">RBAC Gate</p>
                    <p className="text-xs text-gray-500">Security Engine Active</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}