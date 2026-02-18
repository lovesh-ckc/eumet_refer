import './globals.css';
import { SecurityRuntime } from '@eumetise/security';

export const metadata = {
  title: 'Eumetise Care Hub',
  description: 'Provider Tablet App',
  manifest: '/manifest.json', // PWA ready
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-ibm-plex text-base-black bg-white antialiased touch-manipulation">
        <SecurityRuntime />
        {children}
      </body>
    </html>
  );
}