// File: app/(dashboard)/chat/page.tsx
import Link from 'next/link';

export default function ChatbotPage() { // Renamed component function
    return (
        // Removed p-8, padding handled by layout
        <div className="w-full"> 
            <div className="max-w-5xl mx-auto"> {/* Increased max-width */}
                 {/* --- MODIFIED: Title --- */}
                <div className="text-center mb-8 pt-4 pb-8"> 
                    <h1 className="text-4xl md:text-5xl font-bold text-itt-gradient inline-block"> 
                        AI Assistant
                    </h1>
                     <p className="text-gray-400 mt-2">Chat with the AI to refine your ideas.</p> {/* Added subtitle */}
                </div>

                {/* --- MODIFIED: Container Styling --- */}
                <div className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-8 shadow-xl overflow-hidden"> {/* Added padding, overflow hidden */}
                    <iframe 
                        // Consider making the chatbot ID an environment variable
                        src={process.env.NEXT_PUBLIC_CHATBOT_EMBED_URL || "https://aitutor-api.vercel.app/embed/chatbot/cm6w0fkel0001vfbweh9y6j1a"}
                        className="w-full h-[600px] md:h-[700px] rounded-lg border-0" // Removed border
                        title="AI Assistant Chatbot" // Added title attribute
                    />
                </div>
            </div>
        </div>
    );
}
