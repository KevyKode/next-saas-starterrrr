// File: app/(dashboard)/chat/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Loader2, RefreshCw } from 'lucide-react';

export default function ChatbotPage() {
    // Hard-code the chatbot ID for now to simplify debugging
    const chatbotId = 'cb_va9j8g2v7t8b0z7ev0lwy7a'; // Replace with your actual chatbot ID
    const [isLoading, setIsLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    
    // Direct implementation - no token handling on our side
    useEffect(() => {
        // Set a timer to stop showing loading after 2 seconds regardless
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Use the direct embedding URL from the AI Tutor API
    const chatbotUrl = `https://aitutor-api.vercel.app/embed/chatbot/${chatbotId}`;
    
    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                {/* Title Section with ITT branding */}
                <div className="text-center mb-6 pt-4 pb-6"> 
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e3bff] to-[#ffffff] inline-block"> 
                        Innovator AI Assistant
                    </h1>
                    <p className="text-gray-400 mt-2">Chat with the AI to refine your ideas.</p>
                </div>
                
                {/* Main chat container - full width */}
                <div className="relative mb-8">
                    {/* Glow effects */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#6e3bff]/20 via-transparent to-[#6e3bff]/10 rounded-xl blur-xl opacity-70 -z-10"></div>
                    
                    {/* Main container */}
                    <div className="bg-gray-900/70 rounded-xl overflow-hidden border border-[#6e3bff]/20 shadow-xl flex flex-col h-[700px]">
                        {/* Custom header */}
                        <div className="bg-gradient-to-r from-[#6e3bff]/30 to-[#3b7dff]/20 p-3 flex items-center justify-between border-b border-[#6e3bff]/20">
                            <div className="flex items-center">
                                <Bot className="text-[#6e3bff] mr-2" size={20} />
                                <span className="text-white font-medium">Innovator AI Assistant</span>
                            </div>
                            
                            {/* Reload button */}
                            <button
                                onClick={() => {
                                    setIsLoading(true);
                                    if (iframeRef.current) {
                                        iframeRef.current.src = chatbotUrl;
                                    }
                                    setTimeout(() => setIsLoading(false), 1000);
                                }}
                                className="text-gray-400 hover:text-[#6e3bff] transition-colors"
                                title="Refresh Connection"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                        
                        {/* Content area */}
                        <div className="flex-1 relative">
                            <iframe 
                                ref={iframeRef}
                                src={chatbotUrl}
                                className="w-full h-full border-0"
                                title="ITT AI Assistant"
                                allow="microphone"
                                onLoad={() => setIsLoading(false)}
                            />
                            
                            {/* Loading overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm">
                                    <div className="text-center">
                                        <Loader2 className="animate-spin h-8 w-8 text-[#6e3bff] mx-auto mb-3" />
                                        <p className="text-gray-400">Connecting to AI Assistant...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Custom styled footer */}
                        <div className="bg-gradient-to-r from-[#6e3bff]/20 to-[#3b7dff]/10 p-3 border-t border-[#6e3bff]/20 flex justify-between items-center">
                            <span className="text-xs text-gray-400">AI-powered assistant by Innovators Think Tank™</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#6e3bff]/20 text-[#6e3bff]">Premium</span>
                        </div>
                    </div>
                </div>
                
                {/* Pro Tips at bottom as requested */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-900/50 border border-[#6e3bff]/20 p-4 rounded-xl">
                        <h3 className="font-medium text-white flex items-center mb-2">
                            <span className="text-[#6e3bff] mr-2">•</span>
                            Expert Tips
                        </h3>
                        <p className="text-sm text-gray-400">Be specific about your business challenges for better answers</p>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-[#6e3bff]/20 p-4 rounded-xl">
                        <h3 className="font-medium text-white flex items-center mb-2">
                            <span className="text-[#6e3bff] mr-2">•</span>
                            Get Clarity
                        </h3>
                        <p className="text-sm text-gray-400">Ask for clarification if you need more detailed guidance</p>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-[#6e3bff]/20 p-4 rounded-xl">
                        <h3 className="font-medium text-white flex items-center mb-2">
                            <span className="text-[#6e3bff] mr-2">•</span>
                            Next Steps
                        </h3>
                        <p className="text-sm text-gray-400">The AI can suggest next steps based on your current situation</p>
                    </div>
                </div>
                
                {/* Debug info if needed */}
                {debugInfo && (
                    <div className="mb-8 p-4 bg-gray-900/50 border border-amber-500/20 rounded-lg">
                        <h4 className="text-amber-400 font-medium mb-2">Debug Information:</h4>
                        <pre className="text-gray-400 text-sm overflow-auto whitespace-pre-wrap">{debugInfo}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}