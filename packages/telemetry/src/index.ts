import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export const PERF_BUDGETS = {
  FCP: 1800,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
};

type MetricType = { name: string; value: number; delta: number; id: string };

function sendToAnalytics(metric: MetricType) {
  // In a real app, send to analytics endpoint
  const body = JSON.stringify(metric);
  if (navigator.sendBeacon) {
    // navigator.sendBeacon('/api/telemetry', body);
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Telemetry] ${metric.name}:`, metric.value);
  }
}

export const useWebVitals = () => {
  if (typeof window !== 'undefined') {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }
};