import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2, GraduationCap } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const { progress, curriculum, getWeekProgress } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello, Candidate. I am your IELTS Prep Tutor. How can I assist your journey to a Band 9.0 today? I can evaluate your essays, suggest speaking topics, or review your mock test performance." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const currentWeekData = curriculum.find(m => m.id === progress.currentWeek);
      const weekProgress = getWeekProgress(progress.currentWeek);
      
      const systemInstruction = `
        You are the "IELTS AI Tutor" for GrindIELTS.
        Your goal is to guide the student to achieve a Band 9.0.
        
        Current Student Context:
        - Month: ${progress.currentWeek}
        - Current Month Progress: ${weekProgress}%
        - Practice Tests Taken: ${progress.practiceTestsTaken}/12
        - Essays Written: ${progress.essaysWritten}
        - Study Plan Topic: ${currentWeekData?.title}
        
        Guidelines:
        1. If asked for "essay feedback", ask them to paste their essay and you will grade it based on IELTS rubrics (Task Response, Coherence, Lexical Resource, Grammatical Range).
        2. If asked for a "study plan", prioritize incomplete tasks from the current month.
        3. If the student asks for "speaking practice", provide Part 2 cue cards and follow-up questions.
        4. Maintain an encouraging, academic, and highly constructive tone.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
      });

      const aiResponse = response.text || "I apologize, I'm having trouble connecting to the academic servers. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "System error. Please ensure your GEMINI_API_KEY is configured." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-muted text-foreground border border-border">
            <Bot className="size-3" />
            <span>AI Academic Advisor</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">IELTS AI Tutor</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Your personal English coach. Ask for essay feedback, speaking practice, or mock test reviews.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-card px-6 py-3 border border-border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">Gemini 3.5 Pro Active</span>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card shadow-sm relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
        
        <ScrollArea className="flex-1 p-8" ref={scrollRef}>
          <div className="space-y-10 pb-12">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-6",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border",
                  m.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {m.role === 'assistant' ? <GraduationCap size={20} /> : <User size={20} />}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-lg px-6 py-4 text-sm leading-relaxed",
                  m.role === 'assistant' 
                    ? "bg-muted/50 text-foreground border border-border" 
                    : "bg-primary text-primary-foreground"
                )}>
                  <div className={cn("prose prose-sm max-w-none", m.role === 'user' ? "prose-invert" : "")}>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-6">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-primary text-primary-foreground">
                  <Loader2 className="animate-spin" size={20} />
                </div>
                <div className="bg-muted/50 rounded-lg border border-border px-6 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-8 bg-muted/20 border-t border-border">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for essay feedback, speaking exercises..."
              className="rounded-lg border-border bg-background py-6 px-6 text-lg focus-visible:ring-primary focus-visible:ring-offset-0 transition-all"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-lg bg-primary hover:opacity-90 h-auto px-10 shadow-sm transition-all"
            >
              <Send size={24} />
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Grade my essay', 'Speaking Part 2 practice', 'Explain Writing Task 1', 'Reading tips'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="rounded border border-border bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
