'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ClipboardList, Users, CheckSquare, WifiOff, Settings } from 'lucide-react';
import { cn } from '@eumetise/ui';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Inbox', href: '/inbox', icon: ClipboardList, active: pathname.startsWith('/inbox') },
    { label: 'My Patients', href: '/patients', icon: Users, active: pathname.startsWith('/patients') },
    { label: 'Visits', href: '/visits', icon: CheckSquare, active: pathname.startsWith('/visits') },
    { label: 'Offline', href: '/offline', icon: WifiOff, active: pathname.startsWith('/offline') },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top Bar - Simplified for tablet */}
      <header className="h-16 bg-base-black text-white flex items-center justify-between px-6 shadow-md z-10">
        <span className="font-haas-disp font-bold text-lg tracking-wider">CARE HUB</span>
        <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold text-black">
          NS
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>

      {/* Bottom Nav (Mobile/Tablet Style) */}
      <nav className="h-20 bg-white border-t border-gray-200 flex items-center justify-around pb-safe">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1",
              item.active ? "text-accent-600" : "text-gray-400"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}