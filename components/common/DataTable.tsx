import React from 'react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, emptyMessage = 'لا يوجد بيانات', className }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full py-12 flex items-center justify-center border border-black/5 rounded-2xl bg-white/50">
        <p className="text-forest/50">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-start border-collapse">
        <thead>
          <tr className="border-b border-black/5">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={cn("px-4 py-4 text-start font-semibold text-forest/70 text-sm whitespace-nowrap", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors group">
              {columns.map((col, i) => (
                <td 
                  key={i} 
                  className={cn("px-4 py-4 text-forest text-sm align-middle whitespace-nowrap", col.className)}
                >
                  {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
