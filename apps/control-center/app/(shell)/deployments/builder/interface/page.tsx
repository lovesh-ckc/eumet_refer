'use client';
import { Card, Button, Badge } from '@eumetise/ui';
import { Layout, Plus, GripVertical, Image as ImageIcon, Type, BarChart } from 'lucide-react';

const components = [
    { id: 'c1', type: 'Hero Card', icon: Layout },
    { id: 'c2', type: 'Section Header', icon: Type },
    { id: 'c3', type: 'Chart Widget', icon: BarChart },
    { id: 'c4', type: 'Image Banner', icon: ImageIcon },
];

export default function InterfaceBuilderPage() {
    return (
        <div className="h-full flex gap-6">
            {/* Component Palette */}
            <Card className="w-64 flex flex-col p-4 bg-white">
                <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">Components</h3>
                <div className="space-y-2">
                    {components.map(c => (
                        <div key={c.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm cursor-grab flex items-center gap-3">
                            <c.icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{c.type}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Canvas */}
            <div className="flex-1 bg-gray-200 rounded-xl p-8 overflow-y-auto flex justify-center">
                <div className="w-[375px] bg-white min-h-[800px] shadow-2xl rounded-[3rem] border-8 border-gray-900 overflow-hidden flex flex-col relative">
                    <div className="h-8 bg-gray-900 w-full absolute top-0 left-0 z-10 flex justify-center">
                        <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
                    </div>
                    
                    <div className="mt-10 p-4 space-y-4">
                        <div className="border-2 border-dashed border-accent-300 bg-accent-50 rounded-lg p-4 flex flex-col items-center justify-center text-accent-600 h-32">
                            <Plus className="w-6 h-6 mb-2" />
                            <span className="text-sm font-bold">Drop Hero Component</span>
                        </div>

                        {/* Simulated placed component */}
                        <div className="relative group border border-transparent hover:border-accent-500 rounded-lg">
                            <div className="p-4 bg-base-black text-white rounded-lg">
                                <h2 className="font-bold text-lg">Welcome Back</h2>
                                <p className="text-sm text-gray-300">Your tasks are 80% complete.</p>
                            </div>
                            <div className="absolute -top-3 -right-3 hidden group-hover:flex bg-white shadow-sm border border-gray-200 rounded p-1">
                                <GripVertical className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center text-gray-400 h-16">
                            <span className="text-xs">Drag components here</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Panel */}
            <Card className="w-72 p-4 bg-white">
                <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">Properties</h3>
                <div className="p-4 bg-gray-50 rounded text-center text-sm text-gray-500">
                    Select a component on the canvas to edit its properties.
                </div>
            </Card>
        </div>
    );
}