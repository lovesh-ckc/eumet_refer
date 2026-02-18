import './globals.css';
import { SecurityRuntime } from '@eumetise/security';

export const metadata = {
  title: 'Eumetise Control Center',
  description: 'Admin & Builder Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-ibm-plex text-base-black bg-gray-50 antialiased">
        <SecurityRuntime />
        {children}
      </body>
    </html>
  );
}