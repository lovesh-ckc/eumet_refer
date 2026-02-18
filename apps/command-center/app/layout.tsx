import './globals.css';
import { SecurityRuntime } from '@eumetise/security';
import { fonts } from '@eumetise/ui';


export const metadata = {
  title: 'Eumetise Command Center',
  description: 'Clinician Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fonts.variableClass} font-urbanist text-base-black bg-gray-50 antialiased`}>
        <SecurityRuntime />
        {children}
      </body>
    </html>
  );
}