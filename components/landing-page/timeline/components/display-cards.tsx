// File: components/landing-page/timeline/components/display-cards.tsx
// NO CHANGES NEEDED from the previous version

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
    <div
      className={cn(
        "absolute flex h-64 w-[28rem] select-none flex-col justify-between rounded-xl p-6 origin-bottom", // Use absolute positioning base
        "border border-gray-700/50 bg-gray-950/80 backdrop-blur-md shadow-xl", 
        "transition-all duration-300 ease-out", // Ensure transition is set
        "hover:border-purple-500/50", 
        "[&>div]:flex [&>div]:items-center [&>div]:gap-3", 
        className // Apply positioning, rotation, z-index, and hover effects from props
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

// DisplayCards container is now just a wrapper
export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  if (!cards || cards.length === 0) {
    return null; 
  }
  return (
    // This div doesn't need grid layout anymore
    <> 
      {cards?.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </>
  );
}
