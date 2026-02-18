'use client';
import { AppShell } from '@eumetise/ui';
import { Building2, Layers, PenTool, Users, Settings, FileSearch, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Organizations', href: '/orgs', icon: Building2, active: pathname.startsWith('/orgs') },
    { label: 'Deployments', href: '/deployments', icon: Globe, active: pathname.startsWith('/deployments') },
    { label: 'Staff Management', href: '/staff', icon: Users, active: pathname.startsWith('/staff') },
    { label: 'Builder', href: '/deployments/builder', icon: PenTool, active: pathname.includes('/builder') },
    { label: 'Audit Log', href: '/audit', icon: FileSearch, active: pathname.startsWith('/audit') },
    { label: 'Settings', href: '/settings', icon: Settings, active: pathname.startsWith('/settings') },
  ];

  return (
    <AppShell appName="CONTROL CENTER" navItems={navItems}>
      {children}
    </AppShell>
  );
}