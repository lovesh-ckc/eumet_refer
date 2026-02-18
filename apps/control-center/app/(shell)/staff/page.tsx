'use client';
import { Card, Badge, Button, Input, DataTable } from '@eumetise/ui';
import { Search, UserPlus, Shield } from 'lucide-react';

const staff = [
  { id: 1, name: 'Dr. Gregory House', role: 'Medical Director', org: 'St. Marys', status: 'Active' },
  { id: 2, name: 'Nurse Joy', role: 'Ward Nurse', org: 'St. Marys', status: 'Active' },
  { id: 3, name: 'Admin User', role: 'Org Admin', org: 'Apollo Ind.', status: 'Invited' },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-page-heading font-haas-disp">Staff & Access</h2>
          <p className="text-gray-500">Manage clinical users and role assignments.</p>
        </div>
        <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Staff
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
         <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input className="pl-9" placeholder="Search by name or email..." />
            </div>
         </div>
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right"></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {staff.map(s => (
                    <tr key={s.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> {s.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.org}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={s.status === 'Active' ? 'success' : 'warning'}>{s.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-accent-600 hover:text-accent-900">Edit</button>
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}