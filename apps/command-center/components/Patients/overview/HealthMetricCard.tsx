'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { cn } from '@eumetise/ui';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  date: string;
  time: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  data: { value: number }[];
  colorTheme?: 'default' | 'pink' | 'yellow' | 'blue';
  className?: string;
}

export const HealthMetricCard = ({
  title,
  value,
  unit,
  date,
  time,
  trend,
  trendValue,
  data,
  colorTheme = 'default',
  className,
}: HealthMetricCardProps) => {
  // Theme configuration for the title pill
  const themeStyles = {
    default: 'bg-gray-100 text-gray-700',
    pink: 'bg-rose-100 text-rose-700',
    yellow: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className={cn("bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <span className={cn("px-4 py-1.5 rounded-full text-sm font-medium font-ibm-plex", themeStyles[colorTheme])}>
          {title}
        </span>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Area */}
      <div className="h-24 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1A1A1A"
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${title})`}
              isAnimationActive={false} // Disable animation for smoother rendering
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Value and Trend */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-light text-gray-900 font-haas-disp tracking-tight">
            {value}
          </span>
          <span className="text-lg text-gray-500 font-normal font-haas-text mb-1">
            {unit}
          </span>
          {trend && (
            <span className="ml-2 flex items-center text-gray-900">
               {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : trend === 'down' ? <ArrowDown className="w-4 h-4" /> : null}
            </span>
          )}
        </div>
        
        <div className="text-right">
             <div className="text-xs text-gray-400 font-medium font-ibm-plex text-[10px] uppercase tracking-wider mb-0.5">
                {date}
             </div>
             <div className="text-xs text-gray-400 font-medium font-ibm-plex">
                {time}
             </div>
        </div>
      </div>
      
       {/* X-Axis Labels Simulation (Just assumes start/end) */}
       <div className="flex justify-between mt-4 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400 font-medium font-ibm-plex">14</span>
          <span className="text-xs text-gray-400 font-medium font-ibm-plex">16</span>
       </div>
    </div>
  );
};
