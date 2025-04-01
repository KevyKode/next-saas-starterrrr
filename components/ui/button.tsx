import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // ITT-specific variants
        cosmic: 
          "border border-white/10 bg-black/30 text-white backdrop-blur-sm shadow-sm hover:bg-black/10 hover:border-white/20 transition-all duration-300",
        
        gradient: 
          "bg-gradient-to-r from-[#6e3bff] to-[#3b7dff] text-white border-0 shadow-sm hover:shadow-[0_0_15px_rgba(110,59,255,0.4)] transition-all duration-300",
        
        glow: 
          "relative bg-[#6e3bff] text-white shadow-[0_0_15px_rgba(110,59,255,0.5)] hover:shadow-[0_0_20px_rgba(110,59,255,0.7)] transition-all duration-300",
        
        outlineGlow: 
          "border border-[#6e3bff] bg-transparent text-[#6e3bff] hover:bg-[#6e3bff]/10 transition-all duration-300",
        
        glassPurple: 
          "bg-[#6e3bff]/10 backdrop-blur-md border border-[#6e3bff]/20 text-white hover:bg-[#6e3bff]/20 transition-all duration-300",
        
        action: 
          "bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white shadow-md hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-md",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  withIcon?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, withIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // For the glow variant, we'll add the glow effect via CSS instead of a separate element
    const glowStyles = variant === 'glow' 
      ? "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[#6e3bff]/40 before:blur-md before:-z-10"
      : "";
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, rounded, className }),
          withIcon && "gap-2",
          variant === 'gradient' && "hover:bg-[length:200%_200%] transition-all duration-300",
          glowStyles
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }