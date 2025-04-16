// File: components/app-sidebar.tsx
'use client';
import * as React from "react";
// --- MODIFIED: Updated Icons ---
import { Users, Settings, Shield, Activity, MessageCircle, BotIcon, Sparkles, FileText, LinkIcon } from 'lucide-react'; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { SubscriptionStatus } from '@/components/subscription-status';
import { motion } from "framer-motion";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // --- MODIFIED: Navigation Items ---
  const navItems = [
    {
      title: "Assessment", // Renamed
      url: "/dashboard/workflow", 
      icon: FileText, // Changed Icon
      isActive: pathname.startsWith('/dashboard/workflow'),
    },
    {
      title: "Assistant", // Renamed
      url: "/dashboard/chat", 
      icon: BotIcon, // Kept Icon
      isActive: pathname.startsWith('/dashboard/chat'),
    },
    // { // REMOVED Community Item
    //   title: "Community",
    //   url: "/dashboard/streaming", // This URL might need removal/redirect if page is gone
    //   icon: MessageCircle,
    //   isActive: pathname.startsWith('/dashboard/streaming'),
    // },
    {
      title: "Team",
      url: '/dashboard/team',
      icon: Users,
      isActive: pathname.startsWith('/dashboard/team'),
    },
    {
      title: "Preferences", // Kept - maps to general settings
      url: '/dashboard/settings', // Assuming general settings path
      icon: Settings,
      isActive: pathname.startsWith('/dashboard/settings'), 
    },
    {
      title: "Analytics",
      url: '/dashboard/activity', // Assuming activity log path
      icon: Activity,
      isActive: pathname.startsWith('/dashboard/activity'),
    },
    {
      title: "Security", // Kept - maps to security settings
      url: '/dashboard/security', // Assuming security settings path
      icon: Shield,
      isActive: pathname.startsWith('/dashboard/security'),
    },
     // --- ADDED: Link to ITT Community Website ---
     {
      title: "ITT Community",
      url: "https://innovatorsthinktank.com/community", // External Link
      icon: LinkIcon, // Changed Icon
      isExternal: true, // Add flag to handle external links if needed in NavMain
      isActive: false, // External links usually aren't "active"
    },
  ];
  // --- End Modification ---

  return (
    <Sidebar 
      className="hidden lg:block transition-all duration-300 ease-in-out bg-black/90 border-r border-[#6e3bff]/20 overflow-hidden"
      {...props}
    >
      {/* Cosmic background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#6e3bff]/10 to-transparent rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-br from-[#3b7dff]/5 to-transparent rounded-full blur-3xl translate-y-1/3"></div>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SidebarHeader className="py-6 flex flex-col items-center relative">
          <div className="relative">
            <Logo />
            <motion.div
              className="absolute -top-1 -right-1 text-[#6e3bff]"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8], rotate: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles size={16} />
            </motion.div>
          </div>
          <motion.div 
            className="mt-4 px-3 py-1 text-xs font-medium rounded-full bg-[#6e3bff]/10 text-[#6e3bff] border border-[#6e3bff]/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            Transform Ideas to Impact
          </motion.div>
        </SidebarHeader>
      </motion.div>
      
      {/* Content */}
      <SidebarContent className="flex flex-col flex-1 relative z-10">
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {/* Pass updated items to NavMain */}
          <NavMain items={navItems} /> 
        </motion.div>
        
        <motion.div 
          className="mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <SubscriptionStatus />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <SidebarFooter className="mt-auto border-t border-[#6e3bff]/10 pt-4">
            <NavUser />
          </SidebarFooter>
        </motion.div>
      </SidebarContent>
      
      <SidebarRail className="bg-black/70 border-r border-[#6e3bff]/10" />
    </Sidebar>
  );
}