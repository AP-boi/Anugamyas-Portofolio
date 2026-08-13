import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anugamya | Desktop OS Portfolio',
  description:
    'Desktop Operating System Simulator Portfolio for Anugamya featuring interactive apps, terminal CLI, and AI assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} h-full bg-slate-950 text-slate-100 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
