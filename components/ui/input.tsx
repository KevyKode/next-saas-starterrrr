import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-transparent shadow-sm focus-visible:ring-1 focus-visible:ring-ring",
        
        // ITT-specific variants
        cosmic: "border border-white/10 bg-black/30 backdrop-blur-sm px-3 py-2 shadow-sm text-white placeholder:text-gray-500 focus-visible:border-[#6e3bff]/50 focus-visible:ring-1 focus-visible:ring-[#6e3bff]/50",
        
        glassmorphic: "border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 text-white placeholder:text-gray-500 focus-visible:border-white/20 focus-visible:bg-white/10",
        
        glow: "border border-[#6e3bff]/30 bg-black/40 px-3 py-2 text-white placeholder:text-gray-500 shadow-[0_0_5px_rgba(110,59,255,0.2)] focus-visible:shadow-[0_0_10px_rgba(110,59,255,0.4)] focus-visible:border-[#6e3bff]/50",
        
        minimal: "border-b border-white/20 bg-transparent rounded-none px-3 py-2 text-white placeholder:text-gray-500 focus-visible:border-b-[#6e3bff]"
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        lg: "rounded-lg",
        none: "rounded-none"
      },
    },
    defaultVariants: {
      variant: "cosmic", // Changed default to cosmic for ITT theme
      size: "default",
      rounded: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
    containerClassName?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, rounded, containerClassName, icon, iconPosition = "left", ...props }, ref) => {
    // If there's an icon, wrap the input in a container
    if (icon) {
      return (
        <div className={cn(
          "relative flex items-center",
          containerClassName
        )}>
          {iconPosition === "left" && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size, rounded }),
              iconPosition === "left" ? "pl-10" : iconPosition === "right" ? "pr-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          {iconPosition === "right" && (
            <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, size, rounded }),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
