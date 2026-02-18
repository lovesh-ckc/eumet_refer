'use client';
import { useState } from 'react';
import { Button, Card } from '@eumetise/ui';

export default function BuilderPage() {
  const [schema, setSchema] = useState(JSON.stringify({
    id: "new-screen",
    layout: [{ id: "1", type: "StatCard", props: { label: "Sample", value: "100" } }]
  }, null, 2));

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-page-heading font-haas-disp">Screen Builder</h2>
        <div className="space-x-2">
          <Button variant="outline">Preview</Button>
          <Button>Save Schema</Button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-6">
        <Card className="p-0 flex flex-col">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-mono text-xs">schema.json</div>
          <textarea 
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </Card>
        <Card className="p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-400 mb-2">Live Preview Area</p>
                <div className="pointer-events-none opacity-50 border border-dashed border-gray-400 p-8 rounded">
                    Component Rendering Here
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}