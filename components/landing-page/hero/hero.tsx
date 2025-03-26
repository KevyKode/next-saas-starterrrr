"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Info, MessageCircle, ChevronRight } from "lucide-react"; // Changed icons to match ITT buttons
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./components/animated-gradient-text";
import { SparklesText } from "./components/sparkles-text";
import { GlowEffect } from "./components/glow-effect";
import { Confetti } from "./components/confetti";
import type { ConfettiRef } from "./components/confetti";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  // Updated titles to align with innovation themes
  const titles = useMemo(
    () => ["innovators", "creators", "entrepreneurs", "visionaries"],
    []
  );
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
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

  return (
    <div className="w-full relative">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          {/* Optional announcement banner */}
          <div
            onMouseEnter={handleConfetti}
            className="group"
          >
            <AnimatedGradientText>
              ✨{" "}
              <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#6e3bff] via-[#3b7dff] to-[#6e3bff] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Join the Innovators Think Tank Community
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </div>
          
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-white">Transform Ideas</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                To&nbsp;
                <motion.div
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <SparklesText
                    text="Impact!"
                    className="text-5xl md:text-7xl text-purple-500"
                  />
                </motion.div>
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-300 max-w-2xl text-center">
              Welcome to the community for {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -50 : 50, opacity: 0 }
                  }
                >
                  {titleNumber === index && title}
                </motion.span>
              ))}
            </p>
          </div>
          
          <div className="flex flex-row gap-3 relative">
            <div className="relative">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 relative z-10"
              >
                <MessageCircle className="w-5 h-5" /> ITT Incubator
              </Button>
              <GlowEffect
                colors={["#6e3bff", "#3b7dff"]} // Purple and blue from ITT
                mode="colorShift"
                blur="soft"
                duration={3}
                scale={0.9}
                className="absolute inset-0"
              />
            </div>
            
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 border border-white/20 text-white hover:bg-white/5 transition-all duration-300"
            >
              <Info className="w-5 h-5" /> Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-10 size-full pointer-events-none"
        manualstart={true}
      />
    </div>
  );
}

export { Hero };