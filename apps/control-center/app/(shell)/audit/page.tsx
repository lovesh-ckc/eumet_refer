'use client';
import { DataTable, Badge, Button, Input, FiltersBar } from '@eumetise/ui';
import { Download, Calendar, Search } from 'lucide-react';

const auditLogs = [
  { id: '1', user: 'Dr. Gregory House', action: 'VIEW_PATIENT', resource: 'Patient #83920', ip: '192.168.1.10', timestamp: '2023-10-25 14:30:22' },
  { id: '2', user: 'Nurse Joy', action: 'UPDATE_MEDS', resource: 'Prescription #992', ip: '192.168.1.15', timestamp: '2023-10-25 14:28:10' },
  { id: '3', user: 'System', action: 'AUTO_ALERT', resource: 'Alert #7721', ip: 'internal', timestamp: '2023-10-25 14:15:00' },
  { id: '4', user: 'Dr. Gregory House', action: 'LOGIN_SUCCESS', resource: 'Session', ip: '192.168.1.10', timestamp: '2023-10-25 09:00:01' },
  { id: '5', user: 'Admin User', action: 'CONFIG_CHANGE', resource: 'Org Settings', ip: '10.0.0.5', timestamp: '2023-10-24 18:22:19' },
];

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-page-heading font-haas-disp">Audit Logs</h2>
        <p className="text-gray-500">Immutable record of all system access and modifications.</p>
      </div>

      <FiltersBar>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search user, action or resource..." />
        </div>
        <Button variant="outline" className="text-gray-600">
           <Calendar className="mr-2 h-4 w-4" /> Date Range
        </Button>
        <Button variant="outline">
           <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </FiltersBar>

      <DataTable 
        data={auditLogs}
        columns={[
          { header: 'Timestamp', accessorKey: 'timestamp', width: '200px' },
          { header: 'User', accessorKey: 'user' },
          { header: 'Action', accessorKey: 'action', cell: (row) => (
            <Badge variant="default" className="font-mono">{row.action}</Badge>
          )},
          { header: 'Resource', accessorKey: 'resource' },
          { header: 'IP Address', accessorKey: 'ip', cell: (row) => (
             <span className="font-mono text-xs text-gray-500">{row.ip}</span>
          )}
        ]}
      />
    </div>
  );
}