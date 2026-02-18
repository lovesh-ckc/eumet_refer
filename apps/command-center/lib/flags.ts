
export type RagStatus = 'red' | 'amber' | 'green';

export interface VitalThresholds {
    red: [number, number];   // < min OR > max
    amber: [number, number]; // < min OR > max (but within red)
}

// Mock thresholds based on NEWS2 or standard ranges
export const THRESHOLDS: Record<string, VitalThresholds> = {
    bloodGlucose: { red: [4, 11], amber: [5, 9] }, // mmol/L
    // BP is tricky as it's string "120/80". We'll parse systolic for simplicity in this demo.
    systolicBP: { red: [90, 220], amber: [100, 180] },
    heartRate: { red: [40, 131], amber: [50, 111] }, // bpm
    spo2: { red: [91, 101], amber: [93, 101] }, // % (Lower limit important)
    temperature: { red: [35, 39.1], amber: [36, 38.1] }, // C
    respiratoryRate: { red: [8, 25], amber: [11, 21] }, // bpm
};

export const getRagStatus = (vital: string, value: string | number): RagStatus => {
    if (value === undefined || value === null || value === '-') return 'green';

    let numVal = typeof value === 'string' ? parseFloat(value) : value;

    // Handle BP special case
    if (vital === 'bloodPressure' && typeof value === 'string') {
        const parts = value.split('/');
        if (parts.length === 2) {
            // Check Systolic
            const sys = parseFloat(parts[0]);
            const sysStatus = getRagStatus('systolicBP', sys);
            // We could check Diastolic too, but let's stick to Systolic for the demo RAG
            return sysStatus;
        }
        return 'green';
    }

    const threshold = THRESHOLDS[vital];
    if (!threshold) return 'green';

    // Check Red (Outside the absolute limits)
    // Logic: "Red flags ... deemed Red". Usually this means VERY high or VERY low.
    // My threshold structure above: red: [min, max]. 
    // If val < min OR val > max -> Red.
    if (numVal <= threshold.red[0] || numVal >= threshold.red[1]) {
        return 'red';
    }

    // Check Amber
    if (numVal <= threshold.amber[0] || numVal >= threshold.amber[1]) {
        return 'amber';
    }

    return 'green';
};

export interface FlagCounts {
    red: number;
    amber: number;
    grey: number; // Represents Green/Unreviewed
    details: Record<string, RagStatus>;
}

export const calculateFlags = (patient: any): FlagCounts => {
    const details: Record<string, RagStatus> = {};
    let red = 0;
    let amber = 0;
    let grey = 0;

    const vitalsToCheck = ['bloodGlucose', 'bloodPressure', 'heartRate', 'spo2', 'temperature', 'respiratoryRate'];

    vitalsToCheck.forEach(vital => {
        if (patient[vital]) {
            const status = getRagStatus(vital, patient[vital]);
            details[vital] = status;

            if (status === 'red') red++;
            else if (status === 'amber') amber++;
            else grey++; // Green counts as Grey flag (new info)
        }
    });

    return { red, amber, grey, details };
}
