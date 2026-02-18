'use client';
import { usePathname } from 'next/navigation';
import { cn } from '@eumetise/ui';
import Link from 'next/link';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabs = [
    { label: 'Interface', href: '/deployments/builder/interface' },
    { label: 'Questionnaires', href: '/deployments/builder/questionnaires' },
    { label: 'CMS', href: '/deployments/builder/cms' },
    { label: 'Devices', href: '/deployments/builder/devices' },
    { label: 'Templates', href: '/deployments/builder/templates' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <h1 className="text-sub-heading font-haas-disp mb-4">Deployment Configuration</h1>
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => {
             const isActive = pathname.includes(tab.href);
             return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </Link>
             );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {children}
      </div>
    </div>
  );
}