import { subDays, format } from 'date-fns';

export type HealthStatus = 'normal' | 'amber' | 'red';

export interface HealthDataPoint {
    date: string;
    timestamp: string; // ISO string
    value: number;
    status: HealthStatus;
    note?: string;
}

export interface HealthModule {
    id: string;
    label: string;
    unit: string;
    color: string;
    minNormal: number;
    maxNormal: number;
    values: HealthDataPoint[];
}

// Simple seeded random number generator (Linear Congruential Generator)
const createSeededRandom = (seed: number) => {
    let m = 0x80000000;
    let a = 1103515245;
    let c = 12345;
    let state = seed ? seed : Math.floor(Math.random() * (m - 1));

    return () => {
        state = (a * state + c) % m;
        return state / (m - 1);
    };
};

// Initialize with a fixed seed for consistent hydration
const rng = createSeededRandom(12345);

const generateData = (
    days: number,
    baseValue: number,
    variance: number,
    minNormal: number,
    maxNormal: number
): HealthDataPoint[] => {
    const data: HealthDataPoint[] = [];
    // Fixed start date for consistency
    const now = new Date('2024-04-18T12:00:00Z');

    for (let i = days; i >= 0; i--) {
        const date = subDays(now, i);
        // Generate 1-3 readings per day
        const readingsCount = Math.floor(rng() * 3) + 1;

        for (let j = 0; j < readingsCount; j++) {
            const timeOffset = Math.floor(rng() * 12) + 8; // 8 AM to 8 PM
            const timestamp = new Date(date);
            timestamp.setHours(timeOffset, Math.floor(rng() * 60));

            const value = Number((baseValue + (rng() * variance * 2 - variance)).toFixed(1));

            let status: HealthStatus = 'normal';
            if (value < minNormal || value > maxNormal) {
                // Simple logic: if slightly out -> amber, if far out -> red
                const deviation = Math.abs(value - (value < minNormal ? minNormal : maxNormal));
                status = deviation > 5 ? 'red' : 'amber'; // Arbitrary threshold for demo
            }

            data.push({
                date: format(date, 'yyyy-MM-dd'),
                timestamp: timestamp.toISOString(),
                value,
                status,
            });
        }
    }
    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const MOCK_MODULES: HealthModule[] = [
    {
        id: 'blood-glucose',
        label: 'Blood Glucose',
        unit: 'mmol/L',
        color: '#D97706', // amber-600
        minNormal: 4.0,
        maxNormal: 7.8,
        values: generateData(14, 5.5, 3.0, 4.0, 7.8),
    },
    {
        id: 'blood-pressure-sys',
        label: 'Blood Pressure (Sys)',
        unit: 'mmHg',
        color: '#DC2626', // red-600
        minNormal: 90,
        maxNormal: 120,
        values: generateData(14, 125, 15, 90, 120),
    },
    {
        id: 'heart-rate',
        label: 'Heart Rate',
        unit: 'bpm',
        color: '#EA580C', // orange-600
        minNormal: 60,
        maxNormal: 100,
        values: generateData(14, 75, 10, 60, 100),
    },
    {
        id: 'spo2',
        label: 'Oxygen Saturation',
        unit: '%',
        color: '#059669', // emerald-600
        minNormal: 95,
        maxNormal: 100,
        values: generateData(14, 97, 2, 95, 100).map(d => ({ ...d, value: Math.min(100, d.value) })),
    },
    {
        id: 'weight',
        label: 'Weight',
        unit: 'kg',
        color: '#2563EB', // blue-600
        minNormal: 60,
        maxNormal: 80,
        values: generateData(30, 70, 0.5, 60, 80), // More stable
    },
    {
        id: 'temperature',
        label: 'Temperature',
        unit: '°C',
        color: '#7C3AED', // violet-600
        minNormal: 36.1,
        maxNormal: 37.2,
        values: generateData(14, 36.6, 0.4, 36.1, 37.2),
    }
];
