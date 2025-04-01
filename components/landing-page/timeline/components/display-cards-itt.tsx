// File: components/landing-page/timeline/components/display-cards-itt.tsx 
"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; 
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; 

// --- MODIFIED: Card definitions for fanned layout ---
const ittSuiteCards = [
  { // Card 1 (Left-most, Back)
    icon: <Library className="w-5 h-5 text-cyan-300" />, 
    title: "Resource Hub",
    description: "Access tools, templates, and learning materials.",
    date: "Knowledge Base",
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    className: cn(
      "absolute bottom-0 left-1/2 -translate-x-[115%]", // Position left
      "-rotate-[15deg]", // Rotate left
      "z-10", // Back z-index
      "group-hover:rotate-[-18deg] group-hover:-translate-y-4 group-hover:scale-[1.02]", // Hover effect
      "border-cyan-900/30" // Specific border color
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
      "absolute bottom-0 left-1/2 -translate-x-1/2", // Position center
      "rotate-0", // No initial rotation
      "z-20", // Middle z-index
      "group-hover:-translate-y-6 group-hover:scale-[1.03]", // Hover effect
      "border-blue-900/30" // Specific border color
    ),
  },
  { // Card 3 (Right-most, Front)
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
    title: "AI Startup Analysis",
    description: "Data-driven insights into your startup's readiness.",
    date: "Core Feature", 
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    className: cn(
      "absolute bottom-0 left-1/2 translate-x-[15%]", // Position right
      "rotate-[15deg]", // Rotate right
      "z-30", // Front z-index
      "group-hover:rotate-[18deg] group-hover:-translate-y-4 group-hover:scale-[1.02]", // Hover effect
      "border-purple-900/30" // Specific border color
    ),
  },
];

export function ITTSuiteCardsFeature() { 
  return (
    // Container needs enough height and width to show the fanned cards
    <div className="flex min-h-[32rem] w-full items-end justify-center pb-10 pt-8"> {/* Adjusted min-h, padding */}
      {/* Container needs relative positioning for absolute children */}
      {/* Width needs to accommodate the fanned cards */}
      <div className="group w-[150%] max-w-4xl relative h-72"> {/* Increased width, explicit height */}
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}
