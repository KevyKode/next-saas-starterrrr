"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlowingEffectDemo } from "./components/glowing-effect-demo";
import { DisplayCardsDemo } from "./components/display-cards-demo";
import { ShuffleCards } from "./components/testimonial-cards";
import AnimatedGradientBackground from "../footer/animated-gradient-background";
import { MessageCircle, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimelineSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Dark background with animated gradient */}
      <div className="fixed inset-0 z-[-1] bg-[#09090F]">
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

      {/* ITT Incubator Promo Section */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="px-4 py-2 rounded-full bg-[#6e3bff]/20 text-purple-300 text-sm font-medium">
            ONLY 5 SPOTS AVAILABLE
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          ITT <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6e3bff] to-[#3b7dff]">Incubator</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl text-gray-300 mb-12"
        >
          5 Founders. 8 Weeks. Maximum Impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button 
            className="gap-2 bg-gradient-to-r from-[#6e3bff] to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 px-8 py-6 text-lg h-auto"
          >
            Apply Now
          </Button>
          
          <Button 
            variant="outline"
            className="gap-2 border border-white/20 text-white hover:bg-white/5 transition-all duration-300 px-8 py-6 text-lg h-auto"
          >
            <Info className="w-5 h-5" /> Learn More
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </div>

      {/* Ideas to Impact Series */}
      <div className="w-full py-24 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              IDEAS TO IMPACT <span className="text-[#6e3bff]">SERIES</span>: SEASON 7
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Welcome to the ITT Season of Ideas meant to Impact Creator Economy.
            </p>
          </div>

          {/* Timeline Content */}
          <div className="max-w-7xl mx-auto">
            {/* Mobile view - stacked components */}
            <div className="md:hidden space-y-16">
              <div className="bg-black/30 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">Innovate</h3>
                <GlowingEffectDemo />
              </div>
              
              <div className="bg-black/30 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">Collaborate</h3>
                <DisplayCardsDemo />
              </div>
              
              <div className="bg-black/30 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">Transform</h3>
                <ShuffleCards />
              </div>
            </div>

            {/* Desktop view - timeline */}
            <div className="hidden md:block">
              <TimelineContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

function TimelineContent() {
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
              <div className="bg-black/30 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                {entry.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}