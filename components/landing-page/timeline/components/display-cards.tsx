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

// --- CORRECTED: Added 'className' back to props destructuring ---
export function DisplayCard({
  className, // <-- ADDED BACK
  icon = <Sparkles className="w-5 h-5 text-purple-300" />, 
  title = "Feature",
  description = "Innovator Suite Component",
  date = "Included",
  iconClassName, 
  titleClassName = "text-purple-400", 
  iconBgClassName = "bg-purple-600/20", 
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        "relative flex h-64 w-[34rem] -skew-y-[4deg] select-none flex-col justify-between rounded-xl p-6", 
        "border border-gray-700/50 bg-gray-950/60 backdrop-blur-sm", 
        "transition-all duration-500 ease-out", 
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[15rem] after:bg-gradient-to-l after:from-gray-950 after:to-transparent after:content-['']",
        "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20",
        "[&>div]:flex [&>div]:items-center [&>div]:gap-3", 
        className // Apply passed className (now correctly defined)
      )}
    >
     {/* Card content */}
      <div>
        <span className={cn("relative inline-block rounded-full p-2", iconBgClassName )}>{icon}</span>
        <p className={cn("text-lg font-semibold", titleClassName)}>{title}</p> 
      </div>
      <p className="whitespace-nowrap text-base text-gray-300">{description}</p> 
      <p className="text-sm text-gray-500">{date}</p> 
    </div>
  );
}


// DisplayCards container remains the same
export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  if (!cards || cards.length === 0) {
    return null; 
  }
  return (
    <div className="grid h-full w-full [grid-template-areas:'stack'] place-items-center">
      {cards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
