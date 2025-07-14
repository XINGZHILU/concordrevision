'use client';

import Chat from "@/lib/chatbot/form";

export default function Page() {
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-4xl mx-auto">
      <header className="py-4">
        <h1 className="text-3xl font-bold text-center">AI Revision Assistant</h1>
        <p className="text-muted-foreground text-center">Ask me anything about your subjects!</p>
      </header>

      <Chat/>
    </div>
  );
} 