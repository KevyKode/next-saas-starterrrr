// File: components/landing-page/timeline/components/display-cards.tsx
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react"; 
import React from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: React.ReactNode; // Changed from string to ReactNode
  date?: string | null;
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
        "absolute flex h-auto w-[28rem] select-none flex-col justify-between rounded-xl p-6 origin-bottom", 
        "border border-gray-700/50 bg-gray-950/80 backdrop-blur-md shadow-xl", 
        "transition-all duration-300 ease-out",
        "hover:border-purple-500/50", 
        "[&>div]:flex [&>div]:items-center [&>div]:gap-3", 
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full p-2", iconBgClassName )}>{icon}</span>
        <p className={cn("text-lg font-semibold", titleClassName)}>{title}</p> 
      </div>
      
      {/* Handle both string and ReactNode descriptions */}
      {typeof description === 'string' ? (
        <p className="text-base text-gray-300">{description}</p>
      ) : (
        <div className="w-full">{description}</div>
      )}
      
      {date !== null && <p className="text-sm text-gray-500">{date}</p>}
    </div>
  );
}

export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  if (!cards || cards.length === 0) {
    return null; 
  }
  return (
    <> 
      {cards?.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </>
  );
}