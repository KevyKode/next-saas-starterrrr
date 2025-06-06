// File: components/landing-page/timeline/TimelineContent.tsx
"use client"; // Added: Required because motion components are used

import React from "react";
import { motion } from "framer-motion";
// Assuming these components are in a 'components' subdirectory relative to this file
// Double-check these paths match your actual structure
import { GlowingEffectDemo } from "./components/glowing-effect-demo"; 
import { ITTSuiteCardsFeature } from "./components/display-cards-itt";
import { ShuffleCards } from "./components/testimonial-cards";

// --- Main Exported Component ---
// Changed function name to TimelineContent as requested
export function TimelineContent() { 
  // The return statement now correctly wraps the main JSX structure
  return ( 
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6e3bff] via-[#3b7dff] to-[#6e3bff]"
          >
            Ideas to Impact
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Our innovative approach transforms ideas into real-world solutions through these key stages.
          </motion.p>
        </div>
        
        {/* Mobile view - uses MobileTimelineEntry helper */}
        <div className="md:hidden space-y-16">
          <MobileTimelineEntry title="Innovate" delay={0}>
            <GlowingEffectDemo />
          </MobileTimelineEntry>
          <MobileTimelineEntry title="Collaborate" delay={0.2}>
            <ITTSuiteCardsFeature />
          </MobileTimelineEntry>
          <MobileTimelineEntry title="Transform" delay={0.4}>
            <ShuffleCards />
          </MobileTimelineEntry>
        </div>

        {/* Desktop view - uses DesktopTimelineContent helper */}
        <div className="hidden md:block">
          <DesktopTimelineContent />
        </div>
      </div>
  ); // Closing parenthesis for the return statement
} // Closing brace for the TimelineContent function

// --- Helper Component for Mobile View ---
interface MobileTimelineEntryProps {
  title: string;
  delay: number;
  children: React.ReactNode;
}

// This helper uses motion, so its parent ('TimelineContent') needs "use client"
function MobileTimelineEntry({ title, delay, children }: MobileTimelineEntryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30"
    >
      <h3 className="text-2xl font-bold text-[#6e3bff] mb-6">{title}</h3>
      {children}
    </motion.div>
  );
}


// --- Internal Component for Desktop Timeline ---
interface TimelineEntryData {
  title: string;
  content: React.ReactNode;
}

// This helper uses motion, so its parent ('TimelineContent') needs "use client"
function DesktopTimelineContent() {
  const timelineData: TimelineEntryData[] = [
    { title: "Innovate", content: <GlowingEffectDemo /> },
    { title: "Collaborate", content: <ITTSuiteCardsFeature /> },
    { title: "Transform", content: <ShuffleCards /> },
  ];

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6e3bff]/60 via-[#3b7dff]/30 to-transparent pointer-events-none"></div>
      
      {/* Timeline entries */}
      <div className="space-y-24">
        {timelineData.map((entry, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} 
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className={`flex items-start relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Content Block */}
            <div className="w-full md:w-5/12">
              <div className={`bg-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-900/40 shadow-lg shadow-purple-900/10 ${index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-[#6e3bff] mb-4">{entry.title}</h3>
                <div className="relative">
                  {entry.content}
                </div>
              </div>
            </div>

             {/* Timeline Indicator */}
             <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#1a113c] to-[#0e091f] border-2 border-[#6e3bff] shadow-[0_0_20px_rgba(110,59,255,0.6)] flex items-center justify-center z-10">
               <span className="text-2xl font-bold text-white">{index + 1}</span>
             </div>

            {/* Spacer for Desktop */}
            <div className="hidden md:block w-5/12"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
