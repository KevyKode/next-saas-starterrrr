// File: ai-tutor-api-example-main/src/components/nav-main.tsx
"use client"

import { type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[#6e3bff] font-medium">
        Main
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                variant={item.isActive ? "active" : "default"}
                className={item.isActive ? 
                  "bg-[#6e3bff]/10 border-l-2 border-l-[#6e3bff]" : 
                  "hover:bg-[#6e3bff]/5 transition-colors duration-200"
                }
              >
                <a href={item.url} className="w-full">
                  {item.icon && (
                    <item.icon 
                      className={`mr-2 h-4 w-4 ${item.isActive ? "text-[#6e3bff]" : "text-gray-400 group-hover:text-[#6e3bff] transition-colors duration-200"}`}
                    />
                  )}
                  <span className={item.isActive ? "text-[#6e3bff] font-medium" : "group-hover:text-[#6e3bff] transition-colors duration-200"}>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}