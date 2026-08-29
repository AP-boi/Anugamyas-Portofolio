'use client';

import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Bot, Send, User, Sparkles, ShieldCheck, Terminal, Layers, Mic, Volume2, Wand2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'How did you build the AI Heritage Portal in Bharat Dekho?',
  'What architecture powers the Cyber Ascension game engine?',
  'How does the macOS Liquid Glass desktop portfolio work?',
];

export const AIAssistantDrawer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-ai',
      sender: 'assistant',
      text: "Hello! I'm your context-aware Siri Intelligence Assistant. Ask me anything about Anugamya's projects like Bharat Dekho (Gemini AI + Three.js), Cyber Ascension (Canvas 2D Engine), or WebGL systems!",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Input Sanitization Protocol
  const sanitizeQuery = (input: string): string => {
    const cleanStr = input.replace(/[<>'"`;]/g, '');
    if (typeof window !== 'undefined' && DOMPurify.sanitize) {
      return DOMPurify.sanitize(cleanStr);
    }
    return cleanStr;
  };

  const handleSendQuery = (userText: string) => {
    const cleanQuery = sanitizeQuery(userText.trim());
    if (!cleanQuery || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: cleanQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    // Simulate RAG Vector Search & Streaming LLM Synthesis
    setTimeout(() => {
      let aiResponseText = '';
      const lower = cleanQuery.toLowerCase();

      if (lower.includes('bharat') || lower.includes('heritage') || lower.includes('gemini') || lower.includes('tourism')) {
        aiResponseText =
          'Bharat Dekho (Chalo Dekhe Bharat) is built with Next.js 15, Google Gemini AI, and Three.js. It features an AI-powered personalized itinerary planner, a 3D interactive museum with GLTF heritage artifact models, WebGL photo gallery, state travel guides, and Lenis smooth momentum scrolling.';
      } else if (lower.includes('cyber') || lower.includes('game') || lower.includes('ascension')) {
        aiResponseText =
          'Cyber Ascension is a fast-paced 2D cyberpunk action game engine built with JavaScript and HTML5 Canvas running at a locked 60 FPS. It features custom hitboxes, dynamic video cutscenes, fluid sword and dash combat, and Detroit: Become Human style branching narrative choice systems.';
      } else if (lower.includes('portfolio') || lower.includes('macos') || lower.includes('desktop') || lower.includes('glass')) {
        aiResponseText =
          'This macOS Desktop Portfolio is engineered in Next.js 14, React Three Fiber, Framer Motion, and Zustand. It implements real-time draggable multi-window architecture, liquid glassmorphism shaders, an autonomous Dellacherie AI Tetris engine, and interactive 3D webcam pixel grid.';
      } else if (lower.includes('airpure') || lower.includes('aqi') || lower.includes('delhi')) {
        aiResponseText =
          'AirPure Delhi is an iOS-styled glassmorphic web application built to monitor real-time Delhi NCR air pollution index (AQI) and PM2.5 levels with responsive hardware controller telemetry.';
      } else if (lower.includes('gravity') || lower.includes('java')) {
        aiResponseText =
          'Gravity Client is a custom Java client architecture engine featuring modular HUD overlays, runtime bytecode manipulation, low-latency event bus dispatching, and optimized OpenGL rendering.';
      } else {
        aiResponseText = `Based on Anugamya's GitHub portfolio (@AP-boi): Anugamya is a creative developer and software engineer specializing in Next.js 15, Three.js 3D WebGL graphics, Gemini AI integration, 2D HTML5 Canvas game engines, and full-stack interactive applications.`;
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 p-3 bg-white/95">
      {/* Siri Neural Engine Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-800 text-[10px] font-semibold shadow-2xs">
            <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
            <span>Neural RAG Engine Active</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">• Contextual</span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Preset Suggested Siri Prompts */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Suggested Prompts</span>
        <div className="flex flex-col space-y-1.5">
          {PRESET_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendQuery(prompt)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-[11px] text-slate-800 font-medium transition-colors flex items-center justify-between group"
            >
              <span className="line-clamp-1">{prompt}</span>
              <Wand2 className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* iMessage / Siri Chat Stream Area */}
      <div className="flex-1 overflow-auto space-y-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                  : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs font-medium'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 p-3 bg-white rounded-xl border border-purple-200 text-xs text-purple-700 font-medium shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
            <span>Neural RAG Engine synthesizing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputQuery);
        }}
        className="flex items-center space-x-2 pt-1"
      >
        <div className="flex-1 flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus-within:border-purple-500 transition-colors shadow-inner">
          <input
            type="text"
            placeholder="Ask Siri Intelligence..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-900 placeholder:text-slate-400"
          />
          <Mic className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-purple-600 transition-colors" />
        </div>
        <button
          type="submit"
          disabled={!inputQuery.trim() || isGenerating}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantDrawer;
