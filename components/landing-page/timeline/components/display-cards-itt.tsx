// File: components/landing-page/timeline/components/display-cards-itt.tsx 
"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; 
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; 

// --- MODIFIED: Card definitions for initial fan + hover reveal ---
const ittSuiteCards = [
  { // Card 3 (Back - Left)
    icon: <Library className="w-5 h-5 text-cyan-300" />, 
    title: "Resource Hub",
    description: "Access tools, templates, and learning materials.",
    date: "Knowledge Base",
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    className: cn(
      "[grid-area:stack]", 
      // Initial State: Fanned left, slightly up (showing title above Card 2)
      "-rotate-[10deg] -translate-x-[4rem] -translate-y-[7rem]", 
      // Hover State: Rotate more, move further up and left
      "group-hover:-rotate-[16deg] group-hover:-translate-x-[10rem] group-hover:-translate-y-[18rem]", 
      "z-10", 
      "border-cyan-900/30 bg-gray-950/80 backdrop-blur-md" 
    ),
  },
  { // Card 2 (Middle - Slightly Left)
    icon: <Network className="w-5 h-5 text-blue-300" />, 
    title: "Incubator Network",
    description: "Connect with mentors, peers, and investors.",
    date: "Community",
    iconBgClassName: "bg-blue-600/20",
    titleClassName: "text-blue-400",
    className: cn(
      "[grid-area:stack]", 
      // Initial State: Fanned slightly left, slightly up (showing title above Card 1)
      "-rotate-[5deg] -translate-x-[2rem] -translate-y-[3.5rem]", 
      // Hover State: Rotate more, move further up and left
      "group-hover:-rotate-[8deg] group-hover:-translate-x-[5rem] group-hover:-translate-y-[9rem]", 
      "z-20", 
      "border-blue-900/30 bg-gray-950/80 backdrop-blur-md" 
    ),
  },
  { // Card 1 (Front - Center/Slightly Right)
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
    title: "AI Startup Analysis",
    description: "Data-driven insights into your startup's readiness.",
    date: "Core Feature", 
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    className: cn(
      "[grid-area:stack]", 
      // Initial State: Minimal rotation/translation
      "rotate-[0deg] translate-x-0 translate-y-0", 
      // Hover State: Lift slightly
      "group-hover:-translate-y-[1rem]", 
      "z-30", 
      "border-purple-900/30 bg-gray-950/80 backdrop-blur-md" 
    ),
  },
];

export function ITTSuiteCardsFeature() { 
  return (
    // Container needs enough height for initial fan + hover movement
    <div className="flex min-h-[40rem] w-full items-center justify-center py-8"> 
      {/* Container needs group class and enough height/width */}
      <div className="group w-full max-w-xl relative h-[30rem]"> {/* Adjusted height */}
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}
