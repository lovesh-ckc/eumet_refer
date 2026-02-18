import React from "react";
import { cn } from "./utils";
import { Bell, Search, Menu, LogOut, Settings } from "lucide-react";
import { Button } from "./atoms";

interface SideNavProps {
  items: { label: string; href: string; icon: any; active?: boolean }[];
  appName: string;
}

export const SideNav = ({ items, appName }: SideNavProps) => {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-base-cream">
      <div className="flex h-16 items-center px-6 border-b border-gray-200/50">
        <div className="h-8 w-8 bg-base-black rounded-lg mr-3" />
        <span className="text-section-header font-haas-disp font-bold tracking-tight">{appName}</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-body-text font-medium transition-colors",
              item.active
                ? "bg-accent-100 text-accent-500"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", item.active ? "text-accent-500" : "text-gray-400 group-hover:text-gray-500")} />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4">
        <Button variant="ghost" className="w-full justify-start text-error-500">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export interface UserMenuAction {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const TopBar = ({ user, title, onAction, userMenuActions = [] }: { user?: any; title?: string; onAction?: (action: string) => void; userMenuActions?: UserMenuAction[] }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-base-white px-6">
      <h1 className="text-sub-heading font-haas-disp">{title || "Overview"}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-gray-300 bg-gray-50 pl-9 pr-4 text-sm focus:border-accent-400 focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error-500" />
        </Button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 w-8 rounded-full bg-accent-300 flex items-center justify-center text-xs font-bold ring-2 ring-transparent ring-offset-2 hover:ring-accent-100 transition-all focus:outline-none"
          >
            {user?.initials || "DR"}
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Dr. House"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "senior.md@hospital.com"}</p>
                </div>
                
                <div className="p-1">
                  <button 
                    onClick={() => { setShowMenu(false); onAction?.("invite-patient"); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.492a5.2 5.2 0 019.07 0 4 4 0 01-.98 1.832c-.59.7-1.46 1.176-2.455 1.176h-1.2c-.995 0-1.865-.476-2.454-1.176a4 4 0 01-.98-1.832z" />
                      </svg>
                    </div>
                    Invite Patients
                  </button>
                  
                  {/* Dynamic Actions */}
                  {userMenuActions.map((action) => (
                    <button 
                        key={action.action}
                        onClick={() => { setShowMenu(false); onAction?.(action.action); }}
                        className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left", action.className)}
                    >
                        {action.icon && <action.icon className="h-4 w-4 text-gray-400" />}
                        {action.label}
                    </button>
                  ))}

                  <button 
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 p-1">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const AppShell = ({
  children,
  navItems,
  appName,
  title,
  onAction,
  userMenuActions
}: {
  children: React.ReactNode;
  navItems: any[];
  appName: string;
  title?: string;
  onAction?: (action: string) => void;
  userMenuActions?: UserMenuAction[];
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideNav items={navItems} appName={appName} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} onAction={onAction} userMenuActions={userMenuActions} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};