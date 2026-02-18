'use client';
import { use } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn, Card } from '@eumetise/ui';
import { Activity, Pill, Smartphone, FileText, BarChart2 } from 'lucide-react';

export default function HealthDataLayout({ children, params }: { children: React.ReactNode; params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const pathname = usePathname();
  const baseUrl = `/patients/${patientId}/health-data`;

  const tabs = [
    { label: 'Dashboard', href: baseUrl, icon: BarChart2, exact: true },
    { label: 'Symptoms', href: `${baseUrl}/symptoms`, icon: Activity },
    { label: 'Medications', href: `${baseUrl}/medications`, icon: Pill },
    { label: 'Devices', href: `${baseUrl}/modules`, icon: Smartphone },
    { label: 'Export', href: `${baseUrl}/export`, icon: FileText },
  ];

  return (
    <div className="flex gap-6 h-full">
      <Card className="w-64 h-full flex flex-col p-2 space-y-1">
        <p className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Clinical Data</p>
        {tabs.map((tab) => {
          const isActive = tab.exact 
            ? pathname === tab.href 
            : pathname.startsWith(tab.href);
            
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-accent-50 text-accent-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tab.icon className={cn("mr-3 h-4 w-4", isActive ? "text-accent-500" : "text-gray-400")} />
              {tab.label}
            </Link>
          );
        })}
      </Card>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}