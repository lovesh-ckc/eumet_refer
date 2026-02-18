
export const MOCK_PATIENTS = [
    { id: '1', name: 'Rahul Verma', age: 65, gender: 'Male', dob: '1958-05-12', surgeryDate: '2025-12-01', labels: ['Inpatient', 'High risk'], condition: 'CHF', status: 'Active', episode: 'EP-001', assigned: true },
    { id: '2', name: 'Meera Joshi', age: 42, gender: 'Female', dob: '1981-11-23', surgeryDate: '2026-01-15', labels: ['Post-op'], condition: 'Post-Surgery', status: 'Active', episode: 'EP-002', assigned: true },
    { id: '3', name: 'Amit Patel', age: 71, gender: 'Male', dob: '1952-08-30', surgeryDate: null, labels: ['Chronic', 'Outpatient'], condition: 'COPD', status: 'Monitoring', episode: 'EP-003', assigned: false },
    { id: '4', name: 'Sunita Gupta', age: 55, gender: 'Female', dob: '1968-03-14', surgeryDate: null, labels: ['Maternal'], condition: 'Maternal', status: 'Pre-Intake', episode: 'EP-004', assigned: false },
    { id: '5', name: 'Vikram Singh', age: 48, gender: 'Male', dob: '1975-07-19', surgeryDate: '2026-02-10', labels: ['Diabetic', 'Active'], condition: 'Diabetes', status: 'Active', episode: 'EP-005', assigned: true },
    // Adding John Doe from layout to match ID
    { id: '83920', name: 'John Doe', age: 64, gender: 'Male', dob: '1959-01-01', surgeryDate: null, labels: ['COPD Exacerbation'], condition: 'COPD', status: 'Active', episode: 'EP-999', assigned: true },
];

export const MOCK_INVITES = [
    { id: 'inv-1', email: 'joseph.bishop@live.com', invitedBy: 'Donna Keller', date: '18 Feb 2026 | 17:00', validity: '1 year', expiry: '17 Feb 2027' },
    { id: 'inv-2', email: 't.jensen@aol.com', invitedBy: 'Edith Murray', date: '20 Feb 2026 | 19:30', validity: '1 year', expiry: '19 Feb 2027' },
];

// Simple seeded random to ensure hydration consistency
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

// Helper to generate specific random vitals deterministically
export const generateVitals = (id: string = 'default') => {
    // Determine a base "seed" from the ID, but vary it for each field
    // by appending a suffix to the seed string before hashing/randomizing
    const r = (suffix: string) => seededRandom(id + suffix);
    const rInt = (suffix: string, min: number, max: number) => Math.floor(r(suffix) * (max - min) + min);

    return {
        bloodGlucose: (r('bg') * 10 + 4).toFixed(1), // 4.0 - 14.0
        bloodPressure: `${rInt('bp1', 100, 140)}/${rInt('bp2', 60, 80)}`, // 100-140 / 60-80
        breathlessness: rInt('br', 0, 10), // 0-10
        ecg: r('ecg') > 0.8 ? 'Abnormal' : 'Normal',
        peakFlow: rInt('pf', 300, 500), // 300-500
        spo2: rInt('spo2', 95, 101) + '%', // 95-100%
        rhr: rInt('rhr', 60, 80), // 60-80
        heartRate: rInt('hr', 60, 100), // 60-100
        respiratoryRate: rInt('rr', 12, 20), // 12-20
        steps: rInt('steps', 1000, 6000),
        symptoms: r('sym') > 0.7 ? 'Cough' : '-',
        temperature: (r('temp') * 2 + 36).toFixed(1), // 36.0 - 38.0
        weight: rInt('wt', 60, 90) + 'kg',
        diabetesDistress: rInt('dd', 1, 6),
        oxfordHip: rInt('oh', 0, 48),
        oxfordKnee: rInt('ok', 0, 48),
        gad7: rInt('gad', 0, 21),
        phq8: rInt('phq', 0, 24),
        koos: rInt('koos', 0, 100),
        kccq: rInt('kccq', 0, 100),
        norfolk: rInt('nor', 0, 4),
        fjsHip: rInt('fjsH', 0, 100),
        fjsKnee: rInt('fjsK', 0, 100),
        sf36: rInt('sf36', 0, 100),
        ikdc: rInt('ikdc', 0, 100),
        lysholm: rInt('lys', 0, 100),
    };
};

import { calculateFlags } from './flags';

export const getPatients = () => {
    return MOCK_PATIENTS.map(p => {
        const vitals = generateVitals(p.id);
        const merged = { ...p, ...vitals };
        const flags = calculateFlags(merged);
        return { ...merged, flags, notes: [] as string[] }; // Add notes array for resolution
    });
};
