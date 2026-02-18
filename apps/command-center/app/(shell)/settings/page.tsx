'use client';
import { Card, Button, Input } from '@eumetise/ui';
import { Bell, Lock, Moon, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-page-heading font-haas-disp">Settings</h2>
        <p className="text-gray-500">Manage your workspace preferences and security.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <section>
           <h3 className="text-section-header font-bold mb-4">Account</h3>
           <Card className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue="Dr. Gregory House" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="house@stmarys.org" />
                 </div>
              </div>
              <Button variant="outline" className="mt-2">Update Profile</Button>
           </Card>
        </section>

        {/* Notifications */}
        <section>
           <h3 className="text-section-header font-bold mb-4">Notifications</h3>
           <Card className="divide-y divide-gray-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                       <p className="font-medium text-gray-900">Critical Alerts</p>
                       <p className="text-sm text-gray-500">Push notifications for high-risk events</p>
                    </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                 </label>
              </div>
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                       <p className="font-medium text-gray-900">Email Digest</p>
                       <p className="text-sm text-gray-500">Daily summary of ward activity</p>
                    </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                 </label>
              </div>
           </Card>
        </section>

         {/* Preferences */}
        <section>
           <h3 className="text-section-header font-bold mb-4">Appearance</h3>
           <Card className="p-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-gray-400" />
                    <div>
                       <p className="font-medium text-gray-900">Dark Mode</p>
                       <p className="text-sm text-gray-500">Switch interface to dark theme</p>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" disabled>Coming Soon</Button>
              </div>
           </Card>
        </section>
      </div>
    </div>
  );
}