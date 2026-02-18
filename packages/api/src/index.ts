// Simple fetch wrapper
async function http<T>(path: string, config?: RequestInit): Promise<T> {
  const request = new Request(path, config);
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

// Mock Clients - mimicking NestJS BFF structure
export const controlClient = {
  getOrgs: () => http<any[]>('/api/control/orgs'),
  getDeployment: (id: string) => http<any>(`/api/control/deployments/${id}`),
};

export const commandClient = {
  getPatients: () => Promise.resolve([
    { id: 'p1', name: 'John Doe', risk: 'high', condition: 'Copd' },
    { id: 'p2', name: 'Jane Smith', risk: 'low', condition: 'Diabetes' }
  ]),
  getPatientMetrics: (id: string) => Promise.resolve({ hr: 72, spo2: 98 }),
};

export const careClient = {
  getTasks: () => http<any[]>('/api/care/tasks'),
};