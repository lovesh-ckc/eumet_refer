'use client';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@eumetise/ui';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <h1 className="text-hero-title font-haas-disp">Care Hub</h1>
        <p className="text-gray-400 text-xl">Provider Access</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); router.push('/inbox'); }}>
        <div className="space-y-4">
            <Input className="h-14 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600" placeholder="Provider ID" />
            <Input className="h-14 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600" type="password" placeholder="PIN" />
        </div>
        <Button className="w-full h-14 text-xl bg-accent-500 hover:bg-accent-400 text-black font-bold">
          Enter Ward
        </Button>
      </form>

      <div className="pt-12 text-center text-gray-600 text-sm">
        Device ID: IPAD-WARD-04<br/>
        Sync Status: Online
      </div>
    </div>
  );
}