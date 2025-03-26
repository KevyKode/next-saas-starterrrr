"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  "z-50 overflow-hidden text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "rounded-md bg-primary px-3 py-1.5 text-primary-foreground",
        cosmic: "rounded-md border border-white/10 bg-black/80 backdrop-blur-sm px-3 py-1.5 text-white shadow-sm",
        gradient: "rounded-md bg-gradient-to-r from-[#6e3bff] to-[#3b7dff] px-3 py-1.5 text-white shadow-md",
        glow: "rounded-md bg-[#6e3bff] px-3 py-1.5 text-white shadow-[0_0_10px_rgba(110,59,255,0.5)]",
        glass: "rounded-md border border-white/10 bg-white/10 backdrop-blur-md px-3 py-1.5 text-white shadow-sm",
        dark: "rounded-md bg-black/90 border border-gray-800 px-3 py-1.5 text-gray-200 shadow-md",
      },
      size: {
        default: "px-3 py-1.5 text-xs",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-sm",
      },
      withArrow: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "cosmic",
      size: "default",
      withArrow: false,
    },
  }
)

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, size, withArrow, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ variant, size, withArrow }), className)}
      {...props}
    >
      {props.children}
      {withArrow && (
        <TooltipPrimitive.Arrow 
          className={cn(
            "fill-current", 
            variant === "cosmic" && "fill-black/80",
            variant === "gradient" && "fill-[#6e3bff]",
            variant === "glow" && "fill-[#6e3bff]",
            variant === "glass" && "fill-white/10",
            variant === "dark" && "fill-black/90",
          )}
          width={10} 
          height={5} 
        />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  tooltipVariants 
}
