'use client';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@eumetise/ui';
import { Settings } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  return (
    <Card className="p-8 space-y-6 shadow-sm">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-haas-disp">Control Center</h1>
        <p className="text-sm text-gray-500">Platform Administration</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push('/orgs'); }}>
        <Input type="email" placeholder="admin@eumetise.com" />
        <Input type="password" placeholder="••••••••" />
        <Button className="w-full">Authenticate</Button>
      </form>
    </Card>
  );
}