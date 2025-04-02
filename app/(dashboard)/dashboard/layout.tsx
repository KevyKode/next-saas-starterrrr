// File: app/(dashboard)/layout.tsx
// --- Verify this contains the Sidebar ---
'use client';

import { AppSidebar } from "@/components/app-sidebar"; 
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"; 
import { cn } from "@/lib/utils"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main flex container for dashboard
    <div className={cn("flex min-h-screen w-full bg-background")}> 
      <SidebarProvider> 
        <AppSidebar variant="floating" collapsible="icon" /> 
        <SidebarInset>
          {/* Main content area with dark background */}
          <div className="min-h-screen w-full bg-background"> 
            <div className="flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"> 
              {children} {/* Renders the specific dashboard page */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
