import React from 'react';
import { cn } from './utils';
import { Input, Button } from './atoms';

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
}

export const FormRenderer = ({ 
  schema, 
  onSubmit 
}: { 
  schema: FormSchema; 
  onSubmit?: (data: any) => void 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, collect FormData here
    onSubmit && onSubmit({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(schema.title || schema.description) && (
        <div className="mb-6">
           {schema.title && <h3 className="text-lg font-bold text-gray-900">{schema.title}</h3>}
           {schema.description && <p className="text-sm text-gray-500">{schema.description}</p>}
        </div>
      )}

      {schema.fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            {field.label} {field.required && <span className="text-error-500">*</span>}
          </label>
          
          {field.type === 'text' || field.type === 'date' || field.type === 'number' ? (
            <Input 
              type={field.type} 
              placeholder={field.placeholder} 
              required={field.required}
            />
          ) : field.type === 'select' ? (
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400">
               {field.options?.map(opt => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
               ))}
            </select>
          ) : field.type === 'radio' ? (
            <div className="space-y-2">
               {field.options?.map(opt => (
                 <div key={opt.value} className="flex items-center">
                    <input id={`${field.id}-${opt.value}`} name={field.id} type="radio" className="h-4 w-4 border-gray-300 text-accent-600 focus:ring-accent-500" />
                    <label htmlFor={`${field.id}-${opt.value}`} className="ml-3 block text-sm font-medium text-gray-700">{opt.label}</label>
                 </div>
               ))}
            </div>
          ) : null}
        </div>
      ))}

      <div className="pt-4">
        <Button type="submit" className="w-full">
            {schema.submitLabel || 'Submit'}
        </Button>
      </div>
    </form>
  );
};