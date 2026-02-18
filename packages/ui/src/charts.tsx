import React from 'react';
import { cn } from './utils';

interface DataPoint {
  label: string;
  value: number;
  timestamp?: string;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  minY?: number;
  maxY?: number;
  showDots?: boolean;
}

export const LineChart = ({ 
  data, 
  color = '#235C3F', // success-500 default
  height = 200,
  minY,
  maxY,
  showDots = true
}: LineChartProps) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">No Data</div>;

  // Calculate scales
  const values = data.map(d => d.value);
  const min = minY ?? Math.min(...values);
  const max = maxY ?? Math.max(...values);
  const range = max - min || 1;

  const padding = 20;
  const graphWidth = 100; // using percentage for width
  const graphHeight = height - padding * 2;

  // Create SVG Path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100; // Percentage
    const y = height - padding - ((d.value - min) / range) * graphHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points[0]} L ${points.slice(1).join(' L ')}`;

  return (
    <div className="w-full relative" style={{ height }}>
      {/* Y-Axis Labels (Simple) */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-400 pointer-events-none p-1">
        <span>{max}</span>
        <span>{min}</span>
      </div>

      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 100 ${height}`} 
        preserveAspectRatio="none" 
        className="overflow-visible pl-6 pr-2"
      >
        {/* Grid Lines */}
        <line x1="0" y1={padding} x2="100" y2={padding} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={height - padding} x2="100" y2={height - padding} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />

        {/* The Line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke" 
          className="drop-shadow-sm"
        />

        {/* Area under curve (Optional, simple gradient effect) */}
        <path 
          d={`${pathD} L 100,${height} L 0,${height} Z`} 
          fill={color} 
          fillOpacity="0.1" 
          stroke="none"
          vectorEffect="non-scaling-stroke" 
        />

        {/* Data Points */}
        {showDots && data.map((d, i) => {
           const x = (i / (data.length - 1)) * 100; 
           const y = height - padding - ((d.value - min) / range) * graphHeight;
           return (
             <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="4" 
                fill="white" 
                stroke={color} 
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="hover:r-6 transition-all cursor-pointer"
             >
                <title>{d.label}: {d.value}</title>
             </circle>
           );
        })}
      </svg>
    </div>
  );
};