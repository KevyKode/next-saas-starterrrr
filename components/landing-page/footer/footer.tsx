"use client";
import React from "react";
import Image from 'next/image';
import AnimatedGradientBackground from "./animated-gradient-background";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import { MessageCircle, Info } from "lucide-react";

// Changed from function declaration + separate export to direct export
export function StackedCircularFooter() {
  return (
    <footer className="relative min-h-[75vh] py-12 overflow-hidden">
      {/* Use the darker version of the background for the footer */}
      <div className="absolute inset-0 z-0 bg-[#060611]">
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
          topOffset={0.7}
          startingGap={90}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="mb-8 mt-12 rounded-full bg-black/30 p-4 backdrop-blur-sm">
            <Image alt="Logo" src="/logo-square.png" width={100} height={100} />
          </div>
          
          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-gray-300">
            <a href="#" className="hover:text-[#6e3bff] transition-colors">Home</a>
            <a href="#" className="hover:text-[#6e3bff] transition-colors">Network</a>
            <a href="#" className="hover:text-[#6e3bff] transition-colors">Community</a>
            <a href="#" className="hover:text-[#6e3bff] transition-colors">Learn</a>
            <a href="#" className="hover:text-[#6e3bff] transition-colors">Our Programs</a>
          </nav>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div>
              <h3 className="text-[#6e3bff] font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                {['Home', 'Network', 'Community', 'Learn', 'Our Programs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#3b7dff] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-[#6e3bff] font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Documentation', 'Tutorials', 'Blog', 'API', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#3b7dff] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-[#6e3bff] font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-black/20 hover:bg-[#6e3bff]/20 hover:border-[#6e3bff]/50 text-white" asChild>
                  <a href="https://x.com/i/communities/1677441288361345025" target="_blank" rel="noopener noreferrer">
                    <Icons.twitter className="h-5 w-5" />
                    <span className="sr-only">X Community</span>
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-black/20 hover:bg-[#6e3bff]/20 hover:border-[#6e3bff]/50 text-white" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Icons.gitHub className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <a 
              href="https://x.com/i/communities/1677441288361345025" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative"
            >
              <Button 
                className="gap-2 bg-gradient-to-r from-[#6e3bff] to-[#3b7dff] text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" /> Join Community
              </Button>
            </a>
          </div>
          
          <div className="text-center border-t border-gray-800 pt-8 w-full">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Innovators Think Tank. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Removed the separate export statement