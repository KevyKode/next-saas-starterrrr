// File: components/landing-page/timeline/components/display-cards.tsx
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react"; // Default icon
import React from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string; // Color of the icon itself
  titleClassName?: string; // Color of the title text
  iconBgClassName?: string; // NEW: Class for the icon background span
}

export function DisplayCard({
  className,
  icon = <Sparkles className="w-4 h-4 text-purple-300" />, // Default icon color
  title = "Feature",
  description = "Innovator Suite Component",
  date = "Included",
  iconClassName, // Keep this if needed for direct icon styling
  titleClassName = "text-purple-400", // Default title color
  iconBgClassName = "bg-purple-600/20", // Default icon background
}: DisplayCardProps) {
  return (
    // Base card styles - adjusted for dark theme
    <div
      className={cn(
        "relative flex h-52 w-[28rem] -skew-y-[6deg] select-none flex-col justify-between rounded-xl p-4", // Adjusted size/skew/padding
        "border border-gray-700/50 bg-gray-950/50 backdrop-blur-sm", // Base dark theme style
        "transition-all duration-500 ease-out", // Ensure smooth transitions
        // Fade effect from right using ::after pseudo-element
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[15rem] after:bg-gradient-to-l after:from-gray-950 after:to-transparent after:content-['']",
        // Hover effect
        "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20",
        // Ensure children layout is correct
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className // Allow overriding classes
      )}
    >
      {/* Top section: Icon and Title */}
      <div>
        {/* Icon background span */}
        <span className={cn(
            "relative inline-block rounded-full p-1.5", // Adjusted padding
            iconBgClassName // Apply dynamic background class
          )}>
          {icon}
        </span>
        {/* Title */}
        <p className={cn("text-base font-semibold", titleClassName)}>{title}</p> {/* Adjusted size */}
      </div>
      
      {/* Middle section: Description */}
      {/* Removed [&>*] styling from parent for this p tag */}
      <p className="whitespace-nowrap text-sm text-gray-300">{description}</p> 
      
      {/* Bottom section: Date/Tag */}
      <p className="text-xs text-gray-500">{date}</p> {/* Adjusted size */}
    </div>
  );
}

// DisplayCards container remains largely the same, just renders DisplayCard
export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  // If no cards are passed, maybe render nothing or a placeholder?
  if (!cards || cards.length === 0) {
    return null; // Or return a placeholder div
  }

  return (
    // Use the stacking grid layout
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((cardProps, index) => (
        // Pass all props down to the individual DisplayCard
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
