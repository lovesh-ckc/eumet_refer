import { HealthMetricCard } from '@/components/Patients/overview/HealthMetricCard';

// Mock data generator for sparklines
const generateSparkline = (base: number, variance: number, points: number = 10) => {
    return Array.from({ length: points }).map((_, i) => ({
        value: base + Math.random() * variance - variance / 2
    }));
};

export default function PatientOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthMetricCard 
            title="Resting Heart Rate"
            value="75"
            unit="bpm"
            trend="up"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(72, 5)}
        />
        <HealthMetricCard 
            title="Heart Rate"
            value="80"
            unit="bpm"
            trend="up"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(78, 8)}
            colorTheme="yellow"
        />
        <HealthMetricCard 
            title="Heart Rate Variability"
            value="70"
            unit="ms"
            trend="up"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(65, 10)}
            colorTheme="pink"
        />
        <HealthMetricCard 
            title="Blood Pressure"
            value="120/80"
            unit="mmHg"
            trend="neutral"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(120, 10)} // Simplified for demo, just rendering sys
        />
        <HealthMetricCard 
            title="Blood Glucose"
            value="8.2"
            unit="mmol/L"
            trend="up"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(8.0, 1.5)}
        />
        <HealthMetricCard 
            title="Weight & BMI"
            value="65"
            unit="kg"
            trend="up"
            date="18 Apr 2026"
            time="10:16"
            data={generateSparkline(63, 2)}
            colorTheme="yellow"
        />
    </div>
  );
}