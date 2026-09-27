import type { Metadata } from 'next';
import { Public_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CopilotProvider } from '@/lib/copilot/CopilotProvider';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'FITT Portfolio OS',
  description: 'Portfolio Management OS for FITT, IIT Delhi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${newsreader.variable} antialiased bg-background text-foreground`}>
        <CopilotProvider>
          <TooltipProvider>
            <AppShell>
              {children}
            </AppShell>
          </TooltipProvider>
        </CopilotProvider>
      </body>
    </html>
  );
}
