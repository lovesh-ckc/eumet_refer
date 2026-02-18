import React from 'react';
import { Card, StatCard, Button, Badge } from './atoms';
import { LineChart } from './charts';
import { FormRenderer } from './forms';
import { Gate } from '@eumetise/rbac';

// A mapped registry of components available to the "Builder"
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  'StatCard': StatCard,
  'Button': Button,
  'Card': Card,
  'Badge': Badge,
  'LineChart': LineChart,
  'FormRenderer': FormRenderer,
  'SectionHeader': ({ title }: { title: string }) => (
    <h3 className="text-section-header font-semibold mb-4 text-gray-800">{title}</h3>
  ),
  'GridContainer': ({ children, columns = 3 }: { children: React.ReactNode, columns: number }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 mb-6`}>{children}</div>
  ),
  'FlexRow': ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center space-x-4 mb-4">{children}</div>
  )
};

export interface ScreenComponentDef {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: ScreenComponentDef[];
  permissions?: string[]; // RBAC requirement to see this component
}

export interface ScreenDefinition {
  id: string;
  layout: ScreenComponentDef[];
}

export const ScreenRenderer = ({ schema }: { schema: ScreenDefinition }) => {
  const renderComponent = (def: ScreenComponentDef) => {
    const Component = COMPONENT_REGISTRY[def.type];
    
    if (!Component) {
      console.warn(`Unknown component type: ${def.type}`);
      return null;
    }

    // Recursively render children if they exist in the definition
    const children = def.children ? def.children.map(renderComponent) : undefined;

    const content = (
      <Component key={def.id} {...def.props}>
        {children}
      </Component>
    );

    if (def.permissions && def.permissions.length > 0) {
      return (
        <Gate key={def.id} allow={def.permissions}>
          {content}
        </Gate>
      );
    }

    return content;
  };

  return <div className="animate-in fade-in duration-500">{schema.layout.map(renderComponent)}</div>;
};