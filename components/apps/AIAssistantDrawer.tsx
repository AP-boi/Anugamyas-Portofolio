'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, Wand2, Volume2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  'How did you build the 3D museum in Bharat Dekho?',
  'What tech stack powers the Cyber Ascension game engine?',
  'How is the macOS liquid glass desktop architecture structured?',
];

export const AIAssistantDrawer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Hi there! I'm Anugamya's Siri Assistant. Ask me anything about his projects, WebGL experiments, 3D graphics, or full-stack architecture.",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const query = text.trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('bharat') || q.includes('tourism') || q.includes('heritage') || q.includes('museum')) {
        reply =
          'Bharat Dekho is built using Next.js 15, Google Gemini AI, and Three.js. It features an AI-assisted itinerary planner, an interactive 3D museum with real-time GLTF artifact models, state guides, and Lenis smooth momentum scrolling.';
      } else if (q.includes('cyber') || q.includes('game') || q.includes('ascension')) {
        reply =
          'Cyber Ascension is a 2D cyberpunk action game engine written in JavaScript with HTML5 Canvas running at 60 FPS. It features custom hitboxes, video cutscenes, responsive combat, and branching narrative paths.';
      } else if (q.includes('portfolio') || q.includes('macos') || q.includes('desktop') || q.includes('glass')) {
        reply =
          'This portfolio simulates an Apple macOS desktop environment in Next.js 14, Zustand, Framer Motion, and Three.js shaders. It includes multi-window management, persistent visitor tracking, spotlight search, and native apps.';
      } else if (q.includes('airpure') || q.includes('aqi') || q.includes('delhi')) {
        reply =
          'AirPure Delhi is an iOS-styled glassmorphic web app that tracks real-time Delhi NCR air quality (AQI) and PM2.5 concentrations with responsive hardware controller telemetry.';
      } else if (q.includes('gravity') || q.includes('java')) {
        reply =
          'Gravity Client is a custom Java client engine with modular HUD overlays, runtime bytecode manipulation, low-latency event dispatching, and optimized OpenGL rendering.';
      } else {
        reply =
          'Anugamya (@AP-boi) is a creative full-stack developer and software engineer specializing in Next.js, Three.js 3D WebGL graphics, Gemini AI integration, Canvas game engines, and full-stack interactive applications.';
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-slate-900 p-3 bg-white/95">
      {/* Siri Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
            <span>Apple Intelligence Siri</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">• Online</span>
        </div>

        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Suggestions</span>
        <div className="flex flex-col space-y-1">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              onClick={() => handleSend(item)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-[11px] text-slate-800 font-medium transition-colors flex items-center justify-between group"
            >
              <span className="line-clamp-1">{item}</span>
              <Wand2 className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-auto space-y-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs font-medium shadow-xs'
                  : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs font-medium shadow-2xs'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 p-2.5 bg-white rounded-xl border border-purple-200 text-xs text-purple-700 font-medium shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
            <span>Siri is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="flex items-center space-x-2 pt-1"
      >
        <div className="flex-1 flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus-within:border-purple-500 focus-within:bg-white transition-all shadow-inner">
          <input
            type="text"
            placeholder="Ask Siri Intelligence..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-900 placeholder:text-slate-400"
          />
          <Mic className="w-3.5 h-3.5 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer" />
        </div>
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantDrawer;
