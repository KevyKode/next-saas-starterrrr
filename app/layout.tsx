// File: app/layout.tsx 
// --- Ensure this is minimal ---
import './globals.css'; 
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google'; 
import { UserProvider } from '@/lib/auth'; 
import { getUser } from '@/lib/db/queries'; 
import { cn } from '@/lib/utils'; 

export const metadata: Metadata = { /* ... */ };
export const viewport: Viewport = { /* ... */ };

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' }); 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser(); 

  return (
    // Apply dark class and font
    <html lang="en" className={cn("dark font-sans", manrope.variable)} suppressHydrationWarning> 
      {/* Body should NOT have dashboard-specific layout components */}
      <body className="min-h-[100dvh]"> 
        {/* UserProvider wraps everything */}
        <UserProvider userPromise={userPromise}>
          {children} {/* This renders the content of nested layouts/pages */}
        </UserProvider>
      </body>
    </html>
  );
}