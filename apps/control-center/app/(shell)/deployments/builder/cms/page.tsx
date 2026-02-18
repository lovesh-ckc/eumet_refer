'use client';
import { Card, Button, Badge, DataTable } from '@eumetise/ui';
import { FileText, Plus, Image } from 'lucide-react';

const content = [
    { id: '1', title: 'Welcome Guide', type: 'Article', status: 'Published', date: '2023-10-01' },
    { id: '2', title: 'Dietary Advice', type: 'PDF', status: 'Draft', date: '2023-10-05' },
    { id: '3', title: 'Exercise Video', type: 'Video', status: 'Published', date: '2023-09-20' },
];

export default function CMSPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-haas-disp">Content Library</h2>
                    <p className="text-gray-500">Manage educational materials and static assets.</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" /> Upload Content</Button>
            </div>

            <DataTable 
                data={content}
                columns={[
                    { header: 'Title', accessorKey: 'title', cell: (row) => (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded">
                                {row.type === 'Video' ? <Image className="w-4 h-4"/> : <FileText className="w-4 h-4" />}
                            </div>
                            <span className="font-medium">{row.title}</span>
                        </div>
                    )},
                    { header: 'Type', accessorKey: 'type' },
                    { header: 'Status', accessorKey: 'status', cell: (row) => (
                        <Badge variant={row.status === 'Published' ? 'success' : 'default'}>{row.status}</Badge>
                    )},
                    { header: 'Last Updated', accessorKey: 'date' }
                ]}
            />
        </div>
    );
}