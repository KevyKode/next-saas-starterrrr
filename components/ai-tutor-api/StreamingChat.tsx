// src/components/StreamingChat.tsx
'use client';

import { useChat, Message } from 'ai/react';

export default function StreamingChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat', // Use local API route instead of external URL
    keepLastMessageOnError: true,
  });

  return (
    <div className="flex flex-col h-[600px] rounded-lg overflow-hidden border border-purple-900/20 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              message.role === 'user'
                ? 'bg-[#6e3bff]/10 border border-[#6e3bff]/20 ml-8'
                : 'bg-white/5 backdrop-blur-sm border border-white/10 mr-8'
            }`}
          >
            <div className={`font-semibold mb-1 ${
              message.role === 'user' ? 'text-[#6e3bff]' : 'text-gray-200'
            }`}>
              {message.role === 'user' ? 'You:' : 'Assistant:'}
            </div>
            <div className={`${
              message.role === 'user' ? 'text-gray-300' : 'text-gray-200'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-purple-900/20 bg-black/30">
        <div className="flex gap-2">
          <input
            className="flex-1 p-4 rounded-lg bg-black/20 border border-[#6e3bff]/30 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6e3bff]/50 focus:border-transparent shadow-inner"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-4 rounded-lg bg-gradient-to-r from-[#6e3bff] to-[#ffffff] hover:from-[#5c32d6] hover:to-[#f0f0ff] text-white font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}