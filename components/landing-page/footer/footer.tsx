"use client";
import React from "react";
import Image from 'next/image';
import AnimatedGradientBackground from "./animated-gradient-background";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircle, Info } from "lucide-react";

function Footer() {
  return (
    <footer className="relative min-h-[75vh] py-12 overflow-hidden">
      {/* Animated Gradient Background */}
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
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="mb-8 mt-12 rounded-full bg-black/30 p-4 backdrop-blur-sm">
            {/* Replace with your ITT logo */}
            <h1 className="text-3xl font-bold text-white">ITT</h1>
          </div>
          
          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-gray-300">
            <a href="#" className="hover:text-purple-400 transition-colors">Home</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Network</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Community</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Learn</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Our Programs</a>
          </nav>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                {['Home', 'Network', 'Community', 'Learn', 'Our Programs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Documentation', 'Tutorials', 'Blog', 'API', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-black/20 hover:bg-purple-900/30 hover:border-purple-500/50 text-white">
                  <Icons.twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-black/20 hover:bg-purple-900/30 hover:border-purple-500/50 text-white">
                  <Icons.gitHub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-black/20 hover:bg-purple-900/30 hover:border-purple-500/50 text-white">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Button 
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" /> ITT Incubator
            </Button>
            
            <Button 
              variant="outline"
              className="gap-2 border border-white/20 text-white hover:bg-white/5 transition-all duration-300"
            >
              <Info className="w-5 h-5" /> Learn More
            </Button>
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

export { Footer };