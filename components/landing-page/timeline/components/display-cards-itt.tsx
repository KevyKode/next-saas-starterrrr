// File: components/landing-page/timeline/components/display-cards-itt.tsx 
// Renamed from display-cards-demo.tsx for clarity

"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; // Import the base component
// Import ITT-relevant icons
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; // Import cn if needed for dynamic classes

// Define the ITT-specific card data
const ittSuiteCards = [
  {
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, // Adjusted icon size and color
    title: "AI Startup Analysis",
    description: "Data-driven insights into your startup's readiness.",
    date: "Core Feature", // Changed date to something more relevant
    // Use ITT purple for title, adjust icon background
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    // Keep stacking effect, remove grayscale, adjust background/border for dark theme
    className: cn(
      "[grid-area:stack] hover:-translate-y-8", // Slightly less translate
      "border-purple-900/30 bg-black/40 backdrop-blur-md", // Darker theme bg/border
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent", // Darker fade effect
      "transition-all duration-500" // Smoother transition
    ),
  },
  {
    icon: <Network className="w-5 h-5 text-blue-300" />, // Different color for variety
    title: "Get into the ITT Incubator",
    description: "Connect with mentors, peers, and investors.",
    date: "Community",
    iconBgClassName: "bg-blue-600/20",
    titleClassName: "text-blue-400",
    className: cn(
      "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-1", // Adjusted position/hover
      "border-blue-900/30 bg-black/40 backdrop-blur-md",
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent",
      "transition-all duration-500"
    ),
  },
  {
    icon: <Library className="w-5 h-5 text-cyan-300" />, // Another color
    title: "Resource Hub",
    description: "Access tools, templates, and learning materials.",
    date: "Knowledge Base",
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    className: cn(
      "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-8", // Adjusted position/hover
      "border-cyan-900/30 bg-black/40 backdrop-blur-md",
      "after:bg-gradient-to-l after:from-gray-950 after:to-transparent",
      "transition-all duration-500"
    ),
  },
];

// Rename the exported component
export function ITTSuiteCardsFeature() { 
  return (
    // Adjusted min-height and container padding/margins if needed
    <div className="flex min-h-[24rem] w-full items-center justify-center py-8"> 
      <div className="w-full max-w-lg"> {/* Adjusted max-width slightly */}
        {/* Pass the ITT-specific card data to the base DisplayCards component */}
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}
