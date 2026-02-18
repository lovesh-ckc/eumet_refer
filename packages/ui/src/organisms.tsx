import React from 'react';
import { cn } from './utils';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Button } from './atoms';

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick,
  isLoading 
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <tr key={i}>
                   {columns.map((_, c) => (
                     <td key={c} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                   ))}
                 </tr>
               ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-6 py-4 text-sm text-gray-700">
                      {col.cell 
                        ? col.cell(row) 
                        : typeof col.accessorKey === 'function' 
                          ? col.accessorKey(row)
                          : (row[col.accessorKey] as React.ReactNode)
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-500">Showing {data.length} results</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" disabled><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}

export const FiltersBar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 mb-6">
    {children}
  </div>
);