// File: components/landing-page/timeline/components/display-cards-itt.tsx 
"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; 
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; 

// --- MODIFIED: Card definitions for bottom-right positioning ---
const ittSuiteCards = [
  { // Card 3 (Back - Top Left relative to corner)
    icon: <Library className="w-5 h-5 text-cyan-300" />, 
    title: "Customized Growth Strategies",
    description: "Receive a comprehensive report featuring personalized growth strategies and improvement recommendations.",
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    className: cn(
      "absolute bottom-0 right-0", // Anchor bottom-right
      // Initial State: Fanned up-left, titles visible
      "-rotate-[10deg] -translate-x-[6rem] -translate-y-[7rem]", 
      // Hover State: Move further up-left
      "group-hover:-rotate-[12deg] group-hover:-translate-x-[10rem] group-hover:-translate-y-[22rem]", 
      "z-10", 
      "border-cyan-900/30 bg-gray-950/80 backdrop-blur-md" 
    ),
  },
  { // Card 2 (Middle - Up Left relative to corner)
    icon: <Network className="w-5 h-5 text-blue-300" />, 
    title: "Assessment Score",
    description: "Get a clear performance score that indicates your business’s readiness for the next phase. Whether you need to refine your strategies or are ready to pitch to investors, our scoring system provides a clear indicator of your position.",
    iconBgClassName: "bg-blue-600/20",
    titleClassName: "text-blue-400",
    className: cn(
      "absolute bottom-0 right-0", // Anchor bottom-right
      // Initial State: Fanned slightly up-left, titles visible
      "-rotate-[5deg] -translate-x-[3rem] -translate-y-[3.5rem]", 
      // Hover State: Move further up-left
      "group-hover:-rotate-[6deg] group-hover:-translate-x-[5rem] group-hover:-translate-y-[11rem]", 
      "z-20", 
      "border-blue-900/30 bg-gray-950/80 backdrop-blur-md" 
    ),
  },
  { // Card 1 (Front - Closest to corner)
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
    title: "Team Collaboration",
    description: "Share reports and chats with your team or client to ensure everyone is aligned on the next steps. Collaborate effectively to build out what you need to get into the ITT Incubator or even re-thinking square one.",
    date: "Readiness Assessment", 
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    className: cn(
      "absolute bottom-0 right-0", // Anchor bottom-right
      // Initial State: Minimal offset/rotation
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
    // --- MODIFIED: Container alignment ---
    <div className="flex w-full items-end justify-end py-8 pr-8 min-h-[36rem]"> 
      {/* Container: group, relative, explicit height/width */}
      <div className="group w-full max-w-md relative h-[32rem]"> 
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}
