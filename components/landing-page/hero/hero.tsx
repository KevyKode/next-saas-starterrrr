// File: components/landing-page/hero/hero.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Info, Rocket, ChevronRight } from "lucide-react"; // Adjusted imports
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./components/animated-gradient-text";
import { Confetti } from "./components/confetti";
import type { ConfettiRef } from "./components/confetti";
import Link from "next/link"; 

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["innovators", "start-ups", "creators", "entrepreneurs", "visionaries"],
    []
  );
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length); 
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleConfetti = () => {
    confettiRef.current?.fire({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Smooth scroll handler for "Learn More" button
  const handleScrollToPricing = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    document.getElementById('pricing-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  };

  return (
    <div className="w-full relative pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden"> 
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-80"> 
        <div 
          className="absolute left-0 top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-radial from-purple-900/30 via-transparent to-transparent blur-3xl -translate-x-1/4"
        />
        <div 
          className="absolute right-0 top-1/3 w-1/2 h-1/2 rounded-full bg-gradient-radial from-blue-900/30 via-transparent to-transparent blur-3xl translate-x-1/4"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex gap-6 items-center justify-center flex-col"> 
          
          {/* --- REMOVED Small Header --- */}
          
          {/* Main Headline Area */}
          <div className="flex gap-4 flex-col items-center"> 
            {/* --- MODIFIED: Main Headline Text --- */}
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-bold"> 
              {/* Apply gradient class from globals.css */}
              <span className="text-itt-gradient"> 
                ITT Assessment
              </span>
            </h1>
            
            {/* Sub-headline with rotating words */}
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-300 max-w-2xl text-center mt-4 h-8 relative flex justify-center items-center"> 
              <span className="mr-2">Unlock Your Business Potential with the ITT Assessment for</span> 
              <span className="inline-block w-36 text-left relative h-full"> 
                {titles.map((title, index) => (
                  <motion.span
                    key={title} 
                    className="absolute inset-0 flex items-center" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 } 
                        : { y: 20, opacity: 0 } 
                    }
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </p>

            {/* --- MOVED: Community Button --- */}
            <a 
              href="https://x.com/i/communities/1677441288361345025" 
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={handleConfetti} 
              className="group mt-4" 
            >
              <AnimatedGradientText>
                ✨{" "}
                <hr className="mx-2 h-4 w-px shrink-0 bg-gray-600" /> 
                <span
                  className={cn(
                    `inline animate-gradient-x bg-gradient-to-r from-[#6e3bff] via-[#3b7dff] to-[#6e3bff] bg-[length:200%_100%] bg-clip-text text-transparent`
                  )}
                >
                  Join the Innovators Think Tank Community
                </span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-gray-400" /> 
              </AnimatedGradientText>
            </a>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-row gap-4 relative mt-10"> 
            {/* ITT Incubator Button */}
            <Button asChild size="lg" variant="gradient" className="gap-2 hover:shadow-purple-500/30 relative z-10" >
              {/* --- VERIFIED LINK --- */}
              <Link href="https://innovatorsthinktank.com/courses/4" target="_blank" rel="noopener noreferrer"> 
                <Rocket className="w-5 h-5" /> 
                ITT Incubator
              </Link>
            </Button>
            
            {/* Learn More Button - Scrolls to Pricing */}
            <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300" onClick={handleScrollToPricing} >
              <Info className="w-5 h-5" /> Learn More
            </Button>
          </div>
           
        </div>
      </div>
      
      {/* Confetti */}
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-10 size-full pointer-events-none"
        manualstart={true}
      />
    </div>
  );
}

export { Hero };
