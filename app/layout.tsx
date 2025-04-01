// File: app/layout.tsx
import './globals.css'; // Import the global styles
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google'; // Use your actual font import
import { UserProvider } from '@/lib/auth'; // Assuming path is correct
import { getUser } from '@/lib/db/queries'; // Assuming path is correct
import { cn } from '@/lib/utils'; // Assuming path is correct

export const metadata: Metadata = {
  title: 'Innovators Think Tank', // Updated Title
  description: 'Transforming Ideas To Impact', // Updated Description
};

export const viewport: Viewport = {
  maximumScale: 1,
};

// Setup font with CSS variable
const manrope = Manrope({ 
  subsets: ['latin'], 
  variable: '--font-manrope' // Define CSS variable name
}); 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data if needed for context
  let userPromise = getUser(); 

  return (
    // Apply 'dark' class to enable dark theme via globals.css
    // Apply font variable class
    // Remove specific theme classes (bg-*, text-*) - let globals.css handle it
    // Add suppressHydrationWarning
    <html lang="en" className={cn("dark font-sans", manrope.variable)} suppressHydrationWarning> 
      {/* Remove theme classes from body */}
      <body className="min-h-[100dvh]"> 
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
