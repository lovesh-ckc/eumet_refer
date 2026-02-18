'use client';
import { useState } from 'react';
import { Button, Card, Badge, Input, DataTable } from '@eumetise/ui';
import { Shield, Plus, Lock } from 'lucide-react';

const permissions = [
    'view:patients', 'edit:patients', 'discharge:patients',
    'view:telemetry', 'manage:alerts',
    'view:users', 'edit:users',
    'view:audit'
];

const roles = [
    { id: 'r1', name: 'Medical Director', description: 'Full clinical and operational access', users: 3 },
    { id: 'r2', name: 'Ward Nurse', description: 'Patient management and vital monitoring', users: 24 },
    { id: 'r3', name: 'Visiting Physician', description: 'Read-only access to assigned patients', users: 8 },
];

export default function RolesPage() {
    const [selectedRole, setSelectedRole] = useState(roles[0].id);

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-page-heading font-haas-disp">Roles & Permissions</h2>
                    <p className="text-gray-500">Define access controls for clinical staff.</p>
                </div>
                <Button icon={Plus}>Create Role</Button>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* Role List */}
                <Card className="w-1/3 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <Input placeholder="Search roles..." className="bg-white" />
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {roles.map(role => (
                            <div 
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                                    selectedRole === role.id 
                                    ? 'bg-accent-50 border-accent-200' 
                                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{role.name}</h3>
                                    <Badge variant="default">{role.users} Users</Badge>
                                </div>
                                <p className="text-sm text-gray-500">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Matrix Editor */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-900 text-white rounded-lg"><Shield className="w-5 h-5"/></div>
                            <div>
                                <h3 className="font-bold text-lg">{roles.find(r => r.id === selectedRole)?.name}</h3>
                                <p className="text-sm text-gray-500">Permission Configuration</p>
                            </div>
                        </div>
                        <Button variant="primary">Save Changes</Button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {['Patient Care', 'Operations', 'Administration'].map(category => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">{category}</h4>
                                    {permissions.slice(0, 3).map(perm => (
                                        <label key={perm} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-accent-600 rounded" defaultChecked={Math.random() > 0.5} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{perm}</p>
                                                <p className="text-xs text-gray-400">Allows access to {perm.split(':')[1]} module</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Changes to permissions are logged in the Audit Trail.
                    </div>
                </Card>
            </div>
        </div>
    );
}