// File: components/landing-page/timeline/components/display-cards-itt.tsx 
"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; 
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; 

// --- MODIFIED: Simplified initial positions, ensured grid-area ---
const ittSuiteCards = [
  { // Card 3 (Back)
    icon: <Library className="w-5 h-5 text-cyan-300" />, 
    title: "Resource Hub",
    description: "Access tools, templates, and learning materials.",
    date: "Knowledge Base",
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    className: cn(
      "[grid-area:stack]", // Ensure grid area is applied
      "group-hover:-translate-y-20", // Keep hover effect for later testing
      "border-cyan-900/30 bg-black/40 backdrop-blur-md",
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent",
      "transition-all duration-500 ease-out",
      "z-10" // Explicitly set lower z-index for back card
    ),
  },
  { // Card 2 (Middle)
    icon: <Network className="w-5 h-5 text-blue-300" />, 
    title: "Incubator Network",
    description: "Connect with mentors, peers, and investors.",
    date: "Community",
    iconBgClassName: "bg-blue-600/20",
    titleClassName: "text-blue-400",
    className: cn(
      "[grid-area:stack]", // Ensure grid area is applied
      "group-hover:-translate-y-10", // Keep hover effect
      "border-blue-900/30 bg-black/40 backdrop-blur-md",
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent",
      "transition-all duration-500 ease-out",
      "z-20" // Explicitly set middle z-index
    ),
  },
  { // Card 1 (Front)
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
    title: "AI Startup Analysis",
    description: "Data-driven insights into your startup's readiness.",
    date: "Core Feature", 
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    className: cn(
      "[grid-area:stack]", // Ensure grid area is applied
      "group-hover:-translate-y-2", // Keep hover effect
      "border-purple-900/30 bg-black/40 backdrop-blur-md", 
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent", 
      "transition-all duration-500 ease-out",
      "z-30" // Explicitly set highest z-index for front card
    ),
  },
];

export function ITTSuiteCardsFeature() { 
  return (
    <div className="flex min-h-[28rem] w-full items-center justify-center py-8">
      {/* Container needs size and relative positioning */}
      <div className="group w-full max-w-xl relative h-72"> {/* Added explicit height */}
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}
