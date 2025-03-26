"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// Define content variants for consistent styling
const dropdownContentVariants = cva(
  "z-50 min-w-[12rem] overflow-hidden rounded-md p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "border bg-popover text-popover-foreground",
        cosmic: "border border-white/10 bg-black/80 backdrop-blur-md text-white/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8)]",
        glassmorphic: "border border-white/10 bg-white/5 backdrop-blur-md text-white/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)]",
        gradient: "border-0 bg-gradient-to-br from-[#18061e] to-[#051530] text-white/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8)]",
        glow: "border border-[#6e3bff]/20 bg-black/80 backdrop-blur-md text-white/90 shadow-[0_0_20px_rgba(110,59,255,0.2)]",
      }
    },
    defaultVariants: {
      variant: "cosmic"
    }
  }
);

// Define item variants for consistent styling
const dropdownItemVariants = cva(
  "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-all",
  {
    variants: {
      variant: {
        default: "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        cosmic: "focus:bg-white/10 hover:bg-white/5 data-[disabled]:opacity-30 data-[disabled]:pointer-events-none",
        glassmorphic: "focus:bg-white/15 hover:bg-white/10 data-[disabled]:opacity-30 data-[disabled]:pointer-events-none",
        gradient: "focus:bg-[#6e3bff]/20 hover:bg-[#6e3bff]/10 data-[disabled]:opacity-30 data-[disabled]:pointer-events-none",
        glow: "focus:bg-[#6e3bff]/20 hover:bg-[#6e3bff]/10 focus:shadow-[0_0_10px_rgba(110,59,255,0.2)] data-[disabled]:opacity-30 data-[disabled]:pointer-events-none"
      }
    },
    defaultVariants: {
      variant: "cosmic"
    }
  }
);

interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>,
    VariantProps<typeof dropdownItemVariants> {
  inset?: boolean
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, variant, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      dropdownItemVariants({ variant }),
      "data-[state=open]:bg-[#6e3bff]/20",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4 opacity-70" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>,
    VariantProps<typeof dropdownContentVariants> {}

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(dropdownContentVariants({ variant }), className)}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    VariantProps<typeof dropdownContentVariants> {}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, variant, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownContentVariants({ variant }), className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof dropdownItemVariants> {
  inset?: boolean
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, variant, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      dropdownItemVariants({ variant }),
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    VariantProps<typeof dropdownItemVariants> {}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, variant, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      dropdownItemVariants({ variant }),
      "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center rounded-sm border border-white/20 bg-white/5">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3.5 w-3.5 text-[#6e3bff]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
    VariantProps<typeof dropdownItemVariants> {}

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, variant, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      dropdownItemVariants({ variant }),
      "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/20 bg-white/5">
      <DropdownMenuPrimitive.ItemIndicator>
        <div className="h-2 w-2 rounded-full bg-[#6e3bff]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

interface DropdownMenuLabelProps 
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>,
    VariantProps<typeof dropdownContentVariants> {
  inset?: boolean
}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, variant, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm",
      variant === "cosmic" || variant === "glassmorphic" || variant === "gradient" || variant === "glow" 
        ? "text-white/50 font-medium" 
        : "font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>,
    VariantProps<typeof dropdownContentVariants> {}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1 h-px",
      variant === "cosmic" || variant === "glassmorphic" ? "bg-white/10" :
      variant === "gradient" ? "bg-white/10" :
      variant === "glow" ? "bg-[#6e3bff]/20" : "bg-muted",
      className
    )}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

interface DropdownMenuShortcutProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof dropdownContentVariants> {}

const DropdownMenuShortcut = ({
  className,
  variant,
  ...props
}: DropdownMenuShortcutProps) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest",
        variant === "cosmic" || variant === "glassmorphic" || variant === "gradient" || variant === "glow" 
          ? "text-white/30" 
          : "opacity-60",
        className
      )}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  dropdownContentVariants,
  dropdownItemVariants
}