// File: components/landing-page/timeline/components/display-cards-itt.tsx
"use client";

import React from "react";
import { DisplayCards } from "./display-cards"; 
import { BrainCircuit, Network, Library } from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import Image from "next/image";

// --- MODIFIED: Card definitions with images and rotation animation ---
const ittSuiteCards = [
  { // Card 3 (Back)
    icon: <Library className="w-5 h-5 text-cyan-300" />, 
    title: "Growth Strategy Report",
    // Screenshot example
    description: (
      <div className="w-full h-32 relative overflow-hidden rounded-md">
        <Image 
          src="/images/report-example.png" // This is the image path
          alt="Strategy Report Example"
          fill
          className="object-contain"
        />
      </div>
    ),
    iconBgClassName: "bg-cyan-600/20",
    titleClassName: "text-cyan-400",
    date: null,
    className: cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // Center positioning
      "-rotate-[20deg] scale-90", // Initial rotation
      "group-hover:rotate-[30deg] group-hover:scale-95", // Rotation on hover (no translation)
      "z-10", 
      "border-cyan-900/30 bg-gray-950/80 backdrop-blur-md shadow-lg",
      "h-auto", // Allow height to adjust based on content
      "transition-all duration-500 ease-in-out" // Smoother transition
    ),
  },
  { // Card 2 (Middle)
    icon: <Network className="w-5 h-5 text-blue-300" />, 
    title: "Assessment Dashboard",
    // Screenshot example
    description: (
      <div className="w-full h-32 relative overflow-hidden rounded-md">
        <Image 
          src="/images/dashboard-example.png" // This is the image path
          alt="Assessment Dashboard"
          fill
          className="object-contain"
        />
      </div>
    ),
    iconBgClassName: "bg-blue-600/20",
    titleClassName: "text-blue-400",
    date: null,
    className: cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // Center positioning
      "-rotate-[5deg] scale-95", // Initial rotation
      "group-hover:rotate-[-15deg] group-hover:scale-100", // Rotation on hover (no translation)
      "z-20", 
      "border-blue-900/30 bg-gray-950/80 backdrop-blur-md shadow-lg",
      "h-auto", // Allow height to adjust based on content
      "transition-all duration-500 ease-in-out" // Smoother transition
    ),
  },
  { // Card 1 (Front)
    icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
    title: "Collaboration Tools",
    // Screenshot example
    description: (
      <div className="w-full h-32 relative overflow-hidden rounded-md">
        <Image 
          src="/images/collaboration-example.png" // This is the image path
          alt="Team Collaboration Interface"
          fill
          className="object-contain"
        />
      </div>
    ),
    iconBgClassName: "bg-purple-600/20", 
    titleClassName: "text-purple-400", 
    date: null,
    className: cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // Center positioning
      "rotate-[0deg] scale-100", // Initial rotation
      "group-hover:rotate-[10deg] group-hover:scale-105", // Rotation on hover (no translation)
      "z-30", 
      "border-purple-900/30 bg-gray-950/80 backdrop-blur-md shadow-lg",
      "h-auto", // Allow height to adjust based on content
      "transition-all duration-500 ease-in-out" // Smoother transition
    ),
  },
];

export function ITTSuiteCardsFeature() { 
  return (
    <div className="flex w-full items-center justify-center py-16 min-h-[32rem]"> 
      {/* Modified container to center cards better */}
      <div className="group relative w-full max-w-md h-[32rem] perspective-1000"> 
        <DisplayCards cards={ittSuiteCards} /> 
      </div>
    </div>
  );
}