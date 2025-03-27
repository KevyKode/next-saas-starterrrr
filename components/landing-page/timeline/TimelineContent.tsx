"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Particles } from "./components/particles";
import { GlowingEffectDemo } from "./components/glowing-effect-demo";
import { DisplayCardsDemo } from "./components/display-cards-demo";
import { ShuffleCards } from "./components/testimonial-cards";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode; // Optional icon for each timeline entry
}

export function TimelineContent() {
  // Define timeline entries for ITT
  const timelineData: TimelineEntry[] = [
    {
      title: "Innovate",
      content: (
        <div className="relative">
          <GlowingEffectDemo />
        </div>
      ),
    },
    {
      title: "Collaborate",
      content: (
        <div className="relative">
          <DisplayCardsDemo />
        </div>
      ),
    },
    {
      title: "Transform",
      content: (
        <div className="relative">
          <ShuffleCards />
        </div>
      ),
    },
  ];

  // References and state for the vertical timeline line animation
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineFullHeight, setLineFullHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
  });
  const animatedLineHeight = useTransform(scrollYProgress, [0, 1], [0, lineFullHeight]);

  useEffect(() => {
    if (lineRef.current) {
      setLineFullHeight(lineRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="relative overflow-hidden py-16">
      {/* Cosmic particle background */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles
          className="absolute inset-0"
          quantity={100}
          staticity={30}
          color="#6e3bff"
          size={1}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600">
            Journey to Impact
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Our innovative approach transforms ideas into real-world solutions through these key stages.
          </p>
        </div>
        
        <div ref={containerRef} className="relative z-10">
          <div className="relative">
            {/* Vertical timeline line */}
            <div 
              ref={lineRef} 
              className="absolute left-8 md:left-1/4 top-0 h-full w-[2px] bg-gray-800/50"
            >
              <motion.div
                style={{ height: animatedLineHeight }}
                className="w-[2px] bg-gradient-to-t from-[#6e3bff] via-[#3b7dff] to-transparent rounded-full"
              />
            </div>
            
            {/* Timeline entries */}
            <div className="space-y-24">
              {timelineData.map((entry, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col md:flex-row items-start md:gap-10"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px 0px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Left: timeline indicator and title */}
                  <div className="w-full md:w-1/4 relative flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-black/50 border-2 border-[#6e3bff] shadow-[0_0_20px_rgba(110,59,255,0.5)] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 hidden md:block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6e3bff] to-[#3b7dff]">
                      {entry.title}
                    </h3>
                  </div>
                  
                  {/* Right: entry content */}
                  <div className="w-full md:w-3/4 pl-4 md:pl-0 mt-4 md:mt-0">
                    <h3 className="md:hidden block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6e3bff] to-[#3b7dff] mb-4">
                      {entry.title}
                    </h3>
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-lg">
                      {entry.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}