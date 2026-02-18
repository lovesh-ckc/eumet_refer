'use client';
import { useState } from 'react';
import { Card, Button, Input, FormRenderer, FormSchema, Badge } from '@eumetise/ui';
import { Plus, Trash, Eye, Save } from 'lucide-react';

export default function QuestionnaireBuilderPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [schema, setSchema] = useState<FormSchema>({
    id: 'daily-symptom-check',
    title: 'Daily Symptom Check',
    description: 'Please answer the following questions about your health today.',
    fields: [
      { id: 'q1', type: 'radio', label: 'How is your breathing today?', options: [{label: 'Normal', value: 'normal'}, {label: 'Worse than usual', value: 'worse'}] },
      { id: 'q2', type: 'number', label: 'What is your current temperature?', placeholder: 'e.g. 36.5', required: true }
    ],
    submitLabel: 'Submit Log'
  });

  const addField = () => {
    setSchema({
      ...schema,
      fields: [...schema.fields, { id: `q${schema.fields.length + 1}`, type: 'text', label: 'New Question' }]
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-page-heading font-haas-disp">Questionnaire Builder</h2>
          <p className="text-gray-500">Design patient forms and surveys.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
             <Eye className="w-4 h-4 mr-2" /> {isPreview ? 'Edit Mode' : 'Preview'}
           </Button>
           <Button icon={Save}>Save Form</Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
        {/* Editor Column */}
        <Card className={`flex flex-col overflow-hidden ${isPreview ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h3 className="font-bold text-gray-700">Form Structure</h3>
             <Button size="sm" onClick={addField}><Plus className="w-3 h-3 mr-1"/> Add Field</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase">Form Title</label>
               <Input value={schema.title} onChange={e => setSchema({...schema, title: e.target.value})} />
            </div>
            
            <div className="border-t border-gray-100 my-4 pt-4 space-y-4">
              {schema.fields.map((field, idx) => (
                <div key={field.id} className="p-3 bg-gray-50 rounded border border-gray-200 relative group">
                   <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-error-500 hover:text-error-700"><Trash className="w-4 h-4" /></button>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input value={field.label} className="h-8 text-sm font-bold" />
                      <select 
                        className="h-8 text-sm border rounded px-2"
                        value={field.type}
                        onChange={(e) => {
                           const newFields = [...schema.fields];
                           newFields[idx].type = e.target.value as any;
                           setSchema({...schema, fields: newFields});
                        }}
                      >
                         <option value="text">Text Input</option>
                         <option value="number">Number</option>
                         <option value="radio">Radio Choice</option>
                         <option value="select">Dropdown</option>
                         <option value="date">Date Picker</option>
                      </select>
                   </div>
                   <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={field.required} 
                        onChange={(e) => {
                           const newFields = [...schema.fields];
                           newFields[idx].required = e.target.checked;
                           setSchema({...schema, fields: newFields});
                        }}
                        className="rounded text-accent-600"
                      />
                      <span className="text-xs text-gray-500">Required Field</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Preview Column */}
        <Card className="flex flex-col overflow-hidden bg-accent-50/30 border-accent-200">
           <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
             <h3 className="font-bold text-accent-700">Patient View</h3>
             <Badge variant="success">Live Preview</Badge>
           </div>
           <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100">
              <div className="w-full max-w-sm bg-white shadow-xl rounded-[2rem] border border-gray-200 overflow-hidden flex flex-col h-[600px]">
                  <div className="h-6 bg-gray-100 border-b border-gray-200" /> {/* Status bar fake */}
                  <div className="flex-1 p-6 overflow-y-auto">
                     <FormRenderer schema={schema} />
                  </div>
                  <div className="h-12 bg-gray-50 border-t border-gray-200" /> {/* Home bar fake */}
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}