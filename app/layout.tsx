// File: app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google'; // Use your actual font import
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries'; 
import { cn } from '@/lib/utils'; 

export const metadata: Metadata = {
  title: 'Innovators Think Tank', 
  description: 'Transforming Ideas To Impact', 
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' }); 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser(); 

  return (
    // Apply 'dark' class and font variable
    <html lang="en" className={cn("dark font-sans", manrope.variable)} suppressHydrationWarning> 
      {/* Body has minimal classes, inherits from html/globals.css */}
      <body className="min-h-[100dvh]"> 
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
