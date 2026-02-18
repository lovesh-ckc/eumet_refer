import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Brush,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { HealthModule, HealthDataPoint } from '@/lib/mock-health-data';

interface HealthChartProps {
  primaryModule: HealthModule;
  overlayModule?: HealthModule;
  dateRange: [Date | null, Date | null];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
        <p className="font-medium text-gray-900 mb-2">{format(new Date(label), 'MMM d, HH:mm')}</p>
        
        {payload.map((entry: any, index: number) => (
           <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-bold text-gray-900">
                {entry.value} {entry.unit}
              </span>
           </div>
        ))}
      </div>
    );
  }

  return null;
};

export function HealthChart({ primaryModule, overlayModule }: HealthChartProps) {
  // Combine data to create a unified timeline
  const dataMap = new Map<string, any>();
  
  primaryModule.values.forEach(d => {
    const key = d.timestamp;
    if(!dataMap.has(key)) dataMap.set(key, { timestamp: key, rawDate: d.timestamp });
    dataMap.get(key)[primaryModule.id] = d.value;
  });

  if (overlayModule) {
     overlayModule.values.forEach(d => {
        const key = d.timestamp;
         if(!dataMap.has(key)) dataMap.set(key, { timestamp: key, rawDate: d.timestamp });
         dataMap.get(key)[overlayModule.id] = d.value;
     });
  }

  const chartData = Array.from(dataMap.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Zoom State
  const [left, setLeft] = React.useState<string | 'dataMin'>('dataMin');
  const [right, setRight] = React.useState<string | 'dataMax'>('dataMax');
  const [refAreaLeft, setRefAreaLeft] = React.useState<string>('');
  const [refAreaRight, setRefAreaRight] = React.useState<string>('');

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // xAxis domain
    let newLeft = refAreaLeft;
    let newRight = refAreaRight;

    if (newLeft > newRight) [newLeft, newRight] = [newRight, newLeft];

    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(newLeft);
    setRight(newRight);
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  return (
    <div className="w-full h-[500px] relative select-none">
      {(left !== 'dataMin' || right !== 'dataMax') && (
        <button 
          className="absolute top-2 right-12 z-10 bg-white border border-gray-300 rounded-md px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={zoomOut}
        >
          Reset Zoom
        </button>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onMouseDown={(e: any) => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e: any) => refAreaLeft && e && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            allowDataOverflow
            dataKey="timestamp" 
            domain={[left, right]}
            type="category"
            tickFormatter={(str) => {
               const date = new Date(str);
               // If zoomed in (e.g. less than 24h), show time? 
               // For now stick to simple format or adaptive
               return format(date, 'd MMM');
            }}
            stroke="#9CA3AF"
            fontSize={12}
            minTickGap={30}
          />
          {/* Primary Y Axis */}
          <YAxis 
            yAxisId="left"
            allowDataOverflow
            stroke={primaryModule.color}
            domain={[Math.floor(primaryModule.minNormal * 0.8), Math.ceil(primaryModule.maxNormal * 1.2)]}
            fontSize={12}
            tickCount={6}
          />
          
          {/* Secondary Y Axis (if overlay) */}
          {overlayModule && (
            <YAxis 
              yAxisId="right"
              allowDataOverflow
              orientation="right"
              stroke={overlayModule.color}
              domain={[Math.floor(overlayModule.minNormal * 0.8), Math.ceil(overlayModule.maxNormal * 1.2)]}
              fontSize={12}
              tickCount={6}
            />
          )}

          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference Areas for Normal Range - Primary */}
           <ReferenceArea 
             yAxisId="left"
             y1={primaryModule.minNormal} 
             y2={primaryModule.maxNormal} 
             fill={primaryModule.color} 
             fillOpacity={0.05} 
           />

           {/* Reference Areas for Danger Zones - Primary */}
           <ReferenceArea 
             yAxisId="left"
             y1={primaryModule.maxNormal} 
             y2={9999} // indefinite up
             fill="#FEE2E2" 
             fillOpacity={0.2} 
           />
           <ReferenceArea 
             yAxisId="left"
             y1={-9999} 
             y2={primaryModule.minNormal} 
             fill="#FEE2E2" 
             fillOpacity={0.2} 
           />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey={primaryModule.id}
            name={primaryModule.label}
            unit={primaryModule.unit}
            stroke={primaryModule.color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6 }}
            connectNulls
            animationDuration={300}
          />

          {overlayModule && (
             <Line
              yAxisId="right"
              type="monotone"
              dataKey={overlayModule.id}
              name={overlayModule.label}
              unit={overlayModule.unit}
              stroke={overlayModule.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
              strokeDasharray="5 5"
              connectNulls
              animationDuration={300}
            />
          )}

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea yAxisId="left" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#8884d8" fillOpacity={0.3} />
          ) : null}

          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke="#CBD5E1"
            tickFormatter={(str) => format(new Date(str), 'd MMM')}
            onChange={(obj: any) => {
               // Sync brush if needed with zoom state, or let brush handle it independently?
               // Brush creates its own internal state usually. 
               // For simplicity, we let Brush stay as 'pan/zoom via slider' at bottom.
               // However, brush might conflict if domain is controlled by [left, right].
               // If domain is controlled, Brush might not update or might fight.
               // A robust implementation would sync them. 
               // Given 'turbo' nature, we'll keep Brush separate or just rely on drag-zoom.
               // Recharts Brush usually works best when it controls the domain itself.
               // If we control domain via props for drag-zoom, we might need to update Brush too via startIndex/endIndex
               // But calculating index from timestamp string is tricky here.
               // Let's rely on Brush for panning and our drag for zooming.
            }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
