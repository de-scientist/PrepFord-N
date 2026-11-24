// This is the root layout
import './globals.css';
import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import { LeftSidebarProvider } from '@/lib/contexts/panel/layout/includes/sidebar/LeftSidebarContext';
import { RightSidebarProvider } from '@/lib/contexts/panel/layout/includes/sidebar/RightSidebarContext';
import { ThemeProvider } from '@/lib/contexts/panel/layout/theme/PanelThemeContext';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PrepFord — NCLEX-RN & NCLEX-PN Exam Preparation',
  description: 'A focused learning platform for NCLEX-RN and NCLEX-PN candidates, built with clinical accuracy and transparent assessment at its core.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
          <LeftSidebarProvider>
            <RightSidebarProvider>
              {children}
            </RightSidebarProvider>
          </LeftSidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
