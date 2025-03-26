import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Card variants to support ITT branding
const cardVariants = cva(
  "rounded-xl shadow transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground",
        cosmic: "border border-purple-900/20 bg-black/30 backdrop-blur-sm text-white",
        gradient: "border-0 bg-gradient-to-br from-[#18061e] to-[#051530] text-white",
        glassmorphic: "border border-white/10 bg-white/5 backdrop-blur-md text-white",
        glow: "border border-[#6e3bff]/20 bg-black/40 text-white shadow-[0_0_15px_rgba(110,59,255,0.2)]",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// New component for feature highlight cards with an ITT style
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-purple-900/20 bg-black/30 backdrop-blur-sm p-6 transition-all hover:shadow-[0_0_20px_rgba(110,59,255,0.2)] hover:border-purple-900/40",
      className
    )}
    {...props}
  />
))
FeatureCard.displayName = "FeatureCard"

// New component for pricing cards with ITT style
const PricingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { highlight?: boolean }
>(({ className, highlight = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-white text-gray-800 shadow-lg transition-all duration-300",
      highlight && "ring-2 ring-[#6e3bff] shadow-[0_0_20px_rgba(110,59,255,0.3)]",
      className
    )}
    {...props}
  />
))
PricingCard.displayName = "PricingCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  FeatureCard,
  PricingCard,
  cardVariants
}