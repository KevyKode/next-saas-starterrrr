// File: components/landing-page/timeline/components/display-cards.tsx
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react"; 
import React from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string; 
  titleClassName?: string; 
  iconBgClassName?: string; 
}

export function DisplayCard({
  className, 
  icon = <Sparkles className="w-5 h-5 text-purple-300" />, 
  title = "Feature",
  description = "Innovator Suite Component",
  date = "Included",
  iconClassName, 
  titleClassName = "text-purple-400", 
  iconBgClassName = "bg-purple-600/20", 
}: DisplayCardProps) {
  return (
    // --- MODIFIED: Base styles for fanned layout ---
    <div
      className={cn(
        // Base styles - Adjusted width, removed skew, added origin for rotation
        "absolute flex h-64 w-[28rem] select-none flex-col justify-between rounded-xl p-6 origin-bottom", // Reduced width slightly for fanning
        "border border-gray-700/50 bg-gray-950/80 backdrop-blur-md shadow-xl", // Added shadow
        "transition-all duration-300 ease-out", // Changed duration
        // Removed ::after element as it might interfere with fanning
        // Hover effect (scale and border) - will be triggered by group-hover on parent
        "hover:border-purple-500/50", 
        // Layout for direct children (icon/title div)
        "[&>div]:flex [&>div]:items-center [&>div]:gap-3", 
        className // Apply positioning, rotation, z-index, and hover effects from props
      )}
    >
     {/* Card content (no changes needed here) */}
      <div>
        <span className={cn("relative inline-block rounded-full p-2", iconBgClassName )}>{icon}</span>
        <p className={cn("text-lg font-semibold", titleClassName)}>{title}</p> 
      </div>
      <p className="whitespace-nowrap text-base text-gray-300">{description}</p> 
      <p className="text-sm text-gray-500">{date}</p> 
    </div>
  );
}

// --- MODIFIED: DisplayCards container is now just a relative positioning context ---
export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  if (!cards || cards.length === 0) {
    return null; 
  }

  return (
    // Removed grid layout. Parent div in ITTSuiteCardsFeature provides size and group context.
    // This div is now just a fragment or simple div if needed for structure, but layout is handled by parent
    <> 
      {cards.map((cardProps, index) => (
        // Renders each card with absolute positioning defined in its className
        <DisplayCard key={index} {...cardProps} />
      ))}
    </>
  );
}
