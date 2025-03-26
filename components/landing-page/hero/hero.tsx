"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Info, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./components/animated-gradient-text";
import { SparklesText } from "./components/sparkles-text";
import { GlowEffect } from "./components/glow-effect";
import { Confetti } from "./components/confetti";
import type { ConfettiRef } from "./components/confetti";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
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
    <div className="w-full relative py-20 lg:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 w-1/3 h-full">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#6e3bff]/10 blur-3xl"></div>
        </div>
        <div className="absolute right-0 w-1/3 h-full">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#3b7dff]/10 blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex gap-8 items-center justify-center flex-col">
          {/* Announcement banner - links to X community */}
          <a 
            href="https://x.com/i/communities/1677441288361345025" 
            target="_blank" 
            rel="noopener noreferrer"
            onMouseEnter={handleConfetti} 
            className="group"
          >
            <AnimatedGradientText>
              ✨{" "}
              <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `inline animate-gradient-x bg-gradient-to-r from-[#6e3bff] via-[#3b7dff] to-[#6e3bff] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Join the Innovators Think Tank Community
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </a>
          
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold">
              <span className="text-white">Transform Ideas</span>
              <br />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-2"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6e3bff] to-[#3b7dff]">
                  To Impact!
                </span>
              </motion.div>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-300 max-w-2xl text-center mt-4">
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
          
          <div className="flex flex-row gap-3 relative mt-8">
            <div className="relative">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 relative z-10"
              >
                <MessageCircle className="w-5 h-5" /> ITT Incubator
              </Button>
              <GlowEffect
                colors={["#6e3bff", "#3b7dff"]} 
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