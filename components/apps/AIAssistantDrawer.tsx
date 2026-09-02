'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
  Code2,
  Cpu,
  Flame,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { useOSStore } from '@/store/useOSStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  'Tell me about Bharat Dekho',
  'How does Cyber Ascension work?',
  'What is Anugamya\'s tech stack?',
  'Explain the 3D WebGL architecture',
  'How can I get in touch with Anugamya?',
];

export const AIAssistantDrawer: React.FC = () => {
  const { openWindow } = useOSStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Hello! I am AP Intelligence Assistant, trained on Anugamya's projects, WebGL architectures, and engineering experience. How can I assist you today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('bharat') || q.includes('tourism') || q.includes('heritage') || q.includes('museum')) {
      return `🏛️ Bharat Dekho is a flagship Next.js 15 Indian Tourism & Heritage Portal.\n\n• Tech Stack: Next.js 15 App Router, Google Gemini 1.5 Pro AI, Three.js WebGL 3D Museum, Lenis Smooth Momentum Scrolling, and Tailwind CSS.\n• Highlights: AI-generated personalized travel itineraries, 3D interactive artifacts viewer, state-by-state cultural encyclopedia, and immersive audio backdrops.`;
    }

    if (q.includes('cyber') || q.includes('game') || q.includes('ascension')) {
      return `🎮 Cyber Ascension is a high-performance 2D Cyberpunk Action Game Engine.\n\n• Tech Stack: Pure HTML5 Canvas 2D API, vanilla JavaScript, zero heavy external physics dependencies, running at locked 60 FPS.\n• Highlights: Custom polygon collision detection, frame-accurate hitbox mathematics, procedural particle emissions, responsive sword slashing combos, and branching storyline.`;
    }

    if (q.includes('portfolio') || q.includes('macos') || q.includes('desktop') || q.includes('liquid') || q.includes('glass')) {
      return `✨ Portfolio OS is an authentic simulation of macOS Sonoma & Sequoia inside a modern web browser.\n\n• Tech Stack: Next.js 14 App Router, TypeScript, Zustand (Window state management), Framer Motion, and Web Audio API synthesizer.\n• Features: AP Dynamic Island HUD, Autonomous Tetris AI, Spotlight Search (⌘Space), Camera Motion Matrix, and realistic frosted liquid glass surfaces.`;
    }

    if (q.includes('airpure') || q.includes('aqi') || q.includes('delhi')) {
      return `🌿 AirPure Delhi is an environmental telemetry dashboard tracking real-time air quality (AQI) and PM2.5 particulate levels across Delhi NCR with glassmorphic charts and health safety recommendations.`;
    }

    if (q.includes('gravity') || q.includes('java')) {
      return `⚡ Gravity Client is a modular Java performance engine featuring runtime bytecode transformation (ASM), OpenGL HUD rendering, dynamic event dispatch bus, and smooth trajectory optimization.`;
    }

    if (q.includes('skills') || q.includes('stack') || q.includes('tech') || q.includes('technologies')) {
      return `🛠️ Anugamya's Core Tech Stack:\n\n• Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Lenis Scroll.\n• 3D & Graphics: Three.js, WebGL Shaders (GLSL), HTML5 Canvas 2D/3D, 3D Asset Optimization (GLTF/GLB).\n• Backend & Systems: Node.js, REST & GraphQL APIs, Python, Java, WebSockets, File-backed JSON & SQL databases.\n• AI Integration: Google Gemini AI, LangChain, Vision & LLM streaming architectures.`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('github')) {
      return `📬 Let's connect with Anugamya!\n\n• GitHub: https://github.com/AP-boi\n• Role: Creative Full-Stack & 3D WebGL Developer\n• Collaboration: Open for high-impact fullstack, 3D graphics, and AI engineering opportunities!`;
    }

    return `Anugamya (@AP-boi) is a creative software engineer building next-generation web applications, interactive 3D WebGL simulations, and intelligent AI tools. You can explore his projects in Finder (⌘1) or check achievements in Notes (⌘2).`;
  };

  const handleSend = (text: string) => {
    const query = text.trim();
    if (!query || isTyping) return;

    sounds.playClick();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    const fullResponse = generateAnswer(query);

    // Simulate smart streaming response
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fullResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      speakText(fullResponse);
    }, 450);
  };

  const handleCopy = (id: string, text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    sounds.playClick();
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: "Chat cleared! How else can I help you explore Anugamya's work?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/95 text-slate-100 select-none overflow-hidden font-sans">
      {/* Siri Apple Intelligence Iridescent Glowing Header */}
      <div className="relative p-3.5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* 3D Siri Icon */}
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <img src="/icons/siri.png" alt="Siri" className="w-full h-full object-contain rounded-lg" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold text-white tracking-wide">AP Intelligence</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                AP-AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Trained on Anugamya's Portfolio & Engineering Work</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-1.5 rounded-lg border transition-colors ${
              voiceEnabled
                ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={voiceEnabled ? 'Speech Voice Enabled' : 'Enable Speech Voice'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-amber-500 text-white'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-white/10 border border-white/10 text-slate-100 rounded-tl-xs backdrop-blur-md shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                <div className="flex items-center space-x-2 px-1 text-[10px] text-slate-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-fuchsia-400 animate-spin" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-1.5 overflow-x-auto flex space-x-2 flex-shrink-0 scrollbar-none border-t border-white/5 bg-black/20">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="p-3 border-t border-white/10 bg-slate-950 flex items-center space-x-2 flex-shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Siri about Anugamya's projects, tech stack, WebGL..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-md cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantDrawer;
