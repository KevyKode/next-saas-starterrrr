// File: components/landing-page/footer/footer.tsx
"use client";

import React from "react";
import Image from 'next/image'; 
import Link from 'next/link'; 
import { Button } from "@/components/ui/button"; 
import { Icons } from "./icons"; 
import { Linkedin } from "lucide-react"; 

export function Footer() { 
  return (
    // Ensure footer has matching background, remove top padding
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden pt-0"> {/* Removed pt-16 */}
      
      {/* --- MODIFIED: Gradient Overlay --- */}
      <div 
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[180%] h-[100%] // Increased size and moved up
                   bg-radial-gradient from-[#6e3bff]/25 via-transparent to-transparent // Increased intensity
                   blur-[120px] pointer-events-none -z-10 opacity-80" // Increased blur/opacity
        style={{
          // Ensure gradient fades nicely to transparent edge
          background: 'radial-gradient(ellipse at bottom, rgba(110, 59, 255, 0.25) 0%, transparent 70%)' 
        }}
      ></div>
      {/* --- End Modification --- */}

      {/* Add top padding back to the container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 pb-16"> {/* Increased pt */}
        <div className="flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-8">
             <Image 
               src="/logo-long.png" 
               alt="Innovators Think Tank Logo" 
               width={300} 
               height={200} 
               className="opacity-80"
             />
           </div>

          {/* Main Navigation */}
          <nav className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-300">
            <Link href="#" className="hover:text-purple-400 transition-colors">Home</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Network</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Community</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Learn</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Our Programs</Link>
          </nav>

          {/* Link Columns */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center md:text-left">
             {/* Platform Column */}
             <div>
               <h3 className="text-purple-400 font-semibold mb-4">Platform</h3>
               <ul className="space-y-2">
                 {['Home', 'Network', 'Community', 'Learn', 'Our Programs'].map((item) => ( <li key={item}><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{item}</Link></li> ))}
               </ul>
             </div>
             {/* Resources Column */}
             <div>
               <h3 className="text-purple-400 font-semibold mb-4">Resources</h3>
               <ul className="space-y-2">
                 {['Documentation', 'Tutorials', 'Blog', 'API', 'Support'].map((item) => ( <li key={item}><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{item}</Link></li> ))}
               </ul>
             </div>
             {/* Connect Column */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-purple-400 font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                 <a href="https://x.com/tsi_org" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 border border-gray-700 rounded-full text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"><Icons.twitter className="h-5 w-5" /></a>
                 <a href="https://github.com/Tech-in-Schools-Initiative/aitutor-api-saas-starter" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 border border-gray-700 rounded-full text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"><Icons.gitHub className="h-5 w-5" /></a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center w-full pt-8"> 
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Innovators Think Tank. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
