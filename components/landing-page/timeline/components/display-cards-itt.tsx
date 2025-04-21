"use client";

import React, { useEffect, useState } from "react";
import { BrainCircuit, MessageSquare, Library, FileText, Users, Bot } from "lucide-react"; 
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ITTSuiteCardsFeature() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  // Rotate through cards slowly
  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 3);
    }, 6000); // 6 seconds per card for more viewing time
    
    return () => clearInterval(interval);
  }, []);

  // Card content definitions with vertical image format
  const cards = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-purple-300" />, 
      title: "Assessment Reports",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-900/30",
      textColor: "text-purple-300",
      iconBgColor: "bg-purple-600/20",
      titleColor: "text-purple-400",
      placeholderIcon: <FileText className="w-10 h-10 text-purple-300 opacity-60" />,
      fallbackText: "Comprehensive Business Assessment",
      imageSrc: "/report-example.png",
      description: "Advanced analysis of your business model, market fit, and growth potential."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-indigo-300" />, 
      title: "Innovator AI Assistant",
      bgColor: "bg-indigo-900/20",
      borderColor: "border-indigo-900/30",
      textColor: "text-indigo-300",
      iconBgColor: "bg-indigo-600/20",
      titleColor: "text-indigo-400",
      placeholderIcon: <Bot className="w-10 h-10 text-indigo-300 opacity-60" />,
      fallbackText: "Intelligent AI Assistant",
      imageSrc: "/report-example.png",
      description: "Get personalized guidance and answers to your business questions with our advanced AI assistant."
    },
    {
      icon: <Library className="w-5 h-5 text-blue-300" />, 
      title: "Think Tank",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-900/30",
      textColor: "text-blue-300",
      iconBgColor: "bg-blue-600/20",
      titleColor: "text-blue-400",
      placeholderIcon: <Users className="w-10 h-10 text-blue-300 opacity-60" />,
      fallbackText: "Team Collaboration Tools",
      imageSrc: "/team-example.png",
      description: "Collaborative workspace for teams to share chats & reports."
    }
  ];

  // Handle image error
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({...prev, [index]: true}));
    console.error(`Failed to load image for card ${index}: ${cards[index].imageSrc}`);
  };

  return (
    <div className="flex w-full items-center justify-center py-6 min-h-[42rem]">
      <div className={cn(
        "relative w-full max-w-md h-[40rem]", // Increased height for taller cards
        {"opacity-0": !mounted, "opacity-100": mounted},
        "transition-opacity duration-500"
      )}>
        {/* Render cards directly */}
        <div className="relative w-full h-full">
          {cards.map((card, index) => {
            // Position cards based on their relation to active card
            const position = (index - activeIndex + 3) % 3;
            let transformStyle = "";
            let opacity = "opacity-0";
            
            if (position === 0) { // Active card
              transformStyle = "translate-x-0";
              opacity = "opacity-100";
            } else if (position === 1) { // Next card
              transformStyle = "translate-x-[100%]";
            } else { // Previous card
              transformStyle = "translate-x-[-100%]";
            }
            
            return (
              <div 
                key={index}
                className={cn(
                  "absolute inset-0 w-full h-full",
                  "flex flex-col rounded-xl p-5", // Reduced padding
                  "border border-gray-700/50 bg-gray-950/90 backdrop-blur-md shadow-xl",
                  "transition-all duration-1000 ease-in-out",
                  transformStyle,
                  opacity
                )}
              >
                {/* Header section */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn("relative inline-block rounded-full p-2", card.iconBgColor)}>
                    {card.icon}
                  </span>
                  <p className={cn("text-lg font-semibold", card.titleColor)}>{card.title}</p>
                </div>
                
                {/* Image container - much taller now */}
                <div className={cn(
                  "relative flex-1 w-full overflow-hidden rounded-md border mb-3", 
                  card.borderColor
                )}>
                  {imageErrors[index] ? (
                    // Fallback content if image fails to load
                    <div className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center p-4",
                      "bg-gradient-to-br from-gray-900 to-black"
                    )}>
                      {card.placeholderIcon}
                      <div className={cn("mt-3 text-center font-medium", card.textColor)}>
                        {card.fallbackText}
                      </div>
                    </div>
                  ) : (
                    // Attempt to load the real image
                    <>
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        card.bgColor, "z-0"
                      )}>
                        <span className={cn("text-sm", card.textColor)}>Loading...</span>
                      </div>
                      <Image
                        src={card.imageSrc}
                        alt={card.fallbackText}
                        fill
                        quality={90}
                        priority={index === activeIndex}
                        className="object-contain z-10 relative"
                        onError={() => handleImageError(index)}
                      />
                    </>
                  )}
                </div>
                
                {/* Description - now at the bottom */}
                <div className="mb-3">
                  <p className="text-sm text-gray-300">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map(i => (
            <button 
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activeIndex === i 
                  ? "bg-white w-4" 
                  : "bg-gray-500 hover:bg-gray-400"
              )}
              aria-label={`View ${cards[i].title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}