'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/revision-chat'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto">
       <header className="py-4">
        <h1 className="text-3xl font-bold text-center">AI Revision Assistant</h1>
        <p className="text-muted-foreground text-center">Ask me anything about your subjects!</p>
      </header>
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-4 overflow-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <Avatar>
                    <AvatarImage src="/icon.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="prose dark:prose-invert max-w-full">
                    {msg.content}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your question..."
              className="flex-grow"
            />
            <Button type="submit">
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
} 