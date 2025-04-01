// File: components/landing-page/timeline/TimelineSection.tsx
"use client"; 

import React from "react";
import { motion } from "framer-motion";
import { GlowingEffectDemo } from "./components/glowing-effect-demo"; 
import { ITTSuiteCardsFeature } from "./components/display-cards-itt"; // Use the correct component name
import { ShuffleCards } from "./components/testimonial-cards";
import AnimatedGradientBackground from "../footer/animated-gradient-background"; 

export function TimelineSection() {
  return (
    // Removed py-*, added pt-* only, NO pb-* or mb-*
    <div className="relative overflow-hidden pt-8 bg-gray-950"> {/* Ensure matching background */}
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatedGradientBackground 
          Breathing={true}
          gradientColors={[
            "#09090b00", "#0a0118", "#18061e", "#3b0d99", 
            "#6e3bff", "#3b7dff", "#051530"  
          ]}
          topOffset={0.5} 
          startingGap={125} 
        />
      </div>

      {/* Added bottom padding HERE */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl pb-16 md:pb-24"> {/* Added bottom padding */}
        
        {/* Mobile view */}
        <div className="md:hidden space-y-16">
           {/* Mobile Heading */}
           <div className="text-center"> 
             <h2 className="text-4xl font-bold text-itt-gradient">
               How It Works
             </h2>
             <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
               The ITT Readiness Report helps transform ideas into real-world impact.
             </p>
           </div>
           <motion.div /* ... */ >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Innovate</h3>
            <GlowingEffectDemo />
          </motion.div>
          <motion.div /* ... */ >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Collaborate</h3>
            <ITTSuiteCardsFeature /> 
          </motion.div>
          <motion.div /* ... */ >
            <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">Transform</h3>
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
    { title: "Transform", content: <div className="relative"><ShuffleCards /></div> },
  ];

  return (
    <div className="relative">
      {/* Desktop Heading */}
      <div className="text-center mb-20"> 
         <h2 className="text-4xl md:text-5xl font-bold text-itt-gradient">
           How It Works
         </h2>
         <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
           The ITT Readiness Report helps transform ideas into real-world impact through these key stages.
         </p>
       </div>
       
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
            {/* Left */}
            <div className="w-1/4 relative flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-black/50 border-2 border-[#6e3bff] shadow-[0_0_15px_rgba(110,59,255,0.5)] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="mt-4 hidden md:block text-3xl font-bold text-[#6e3bff]">
                {entry.title}
              </h3>
            </div>
            
            {/* Right */}
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
