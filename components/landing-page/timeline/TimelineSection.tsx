// File: components/landing-page/timeline/TimelineSection.tsx
"use client"; 

import React from "react";
import { motion } from "framer-motion";
// Imports for components within the timeline/components/ directory
import { GlowingEffectDemo } from "./components/glowing-effect-demo"; 
import { ITTSuiteCardsFeature } from "./components/display-cards-itt";
import { ShuffleCards } from "./components/testimonial-cards";
// --- CORRECTED Import Path & Syntax for AnimatedGradientBackground ---
import AnimatedGradientBackground from "../footer/animated-gradient-background"; // Correct relative path and default import
// --- END CORRECTION ---

export function TimelineSection() {
  return (
    <div className="relative overflow-hidden py-16">
      {/* Cosmic particle background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Ensure AnimatedGradientBackground props are correct */}
        <AnimatedGradientBackground 
          Breathing={true}
          gradientColors={[
            "#09090b00", 
            "#0a0118", 
            "#18061e", 
            "#3b0d99", 
            "#6e3bff", 
            "#3b7dff", 
            "#051530"  
          ]}
          topOffset={0.5} 
          startingGap={125} 
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6e3bff] via-[#3b7dff] to-[#6e3bff]">
            Transform Your Ideas to Impact
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Our innovation tool suite helps transforms ideas into real-world impact through these key stages.
          </p>
        </div>
        
        {/* Mobile view */}
        <div className="md:hidden space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30"
          >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Innovate</h3>
            <GlowingEffectDemo />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30"
          >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Collaborate</h3>
            <ITTSuiteCardsFeature />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30"
          >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Integrate</h3>
            <ShuffleCards />
          </motion.div>
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <TimelineContent /> 
        </div>
      </div>
    </div>
  );
}

// --- TimelineContent Definition ---
interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

function TimelineContent() {
  const timelineData: TimelineEntry[] = [
    { title: "Innovate", content: <div className="relative"><GlowingEffectDemo /></div> },
    { title: "Collaborate", content: <div className="relative"><ITTSuiteCardsFeature /></div> },
    { title: "Integrate", content: <div className="relative"><ShuffleCards /></div> },
  ];

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-8 top-0 h-full w-[2px] bg-purple-900/30">
        <div className="w-[2px] h-full bg-gradient-to-b from-[#6e3bff] to-transparent"></div>
      </div>
      
      {/* Timeline entries */}
      <div className="space-y-24">
        {timelineData.map((entry, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="flex flex-col md:flex-row items-start md:gap-10"
          >
            {/* Left: timeline indicator and title */}
            <div className="w-1/4 relative flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-black/50 border-2 border-[#6e3bff] shadow-[0_0_15px_rgba(110,59,255,0.5)] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="mt-4 hidden md:block text-3xl font-bold text-[#6e3bff]">
                {entry.title}
              </h3>
            </div>
            
            {/* Right: entry content */}
            <div className="w-3/4 pl-4">
              <h3 className="md:hidden block text-2xl font-bold text-[#6e3bff] mb-4">
                {entry.title}
              </h3>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                {entry.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
