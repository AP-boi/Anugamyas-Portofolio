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
  'What distributed systems architectural patterns are used in AegisMesh?',
  'How did you reduce RAG query latency down to 18ms with pgvector?',
  'What security credentials and CVE patches have you delivered?',
];

export const AIAssistantDrawer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-ai',
      sender: 'assistant',
      text: "Hello! I'm your context-aware macOS Siri Intelligence Assistant. Ask me anything about system architecture, latency optimizations, or engineering milestones!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

      if (lower.includes('aegismesh') || lower.includes('distributed')) {
        aiResponseText =
          'AegisMesh employs eBPF kernel socket probes combined with Rust and gRPC consensus channels. By loading zero-trust packet filter bytecode directly into Linux kernel sockets, context switches are avoided, sustaining 150K req/sec with sub-2.1ms P99 latency.';
      } else if (lower.includes('pgvector') || lower.includes('rag') || lower.includes('latency')) {
        aiResponseText =
          'The VectorRAG engine tuned pgvector with HNSW index parameters (m=16, ef_construction=64). By combining cosine distance partitioning with Next.js 14 Server Actions, RAG vector query times dropped from 480ms to 18.2ms.';
      } else if (lower.includes('security') || lower.includes('cve') || lower.includes('credentials')) {
        aiResponseText =
          'Security milestones include remediating 3 critical CVEs across open-source web frameworks (protecting 2.4M+ deployments) and holding the AWS Certified Solutions Architect – Professional (SAP-C02) credential.';
      } else {
        aiResponseText = `Based on the candidate's architecture portfolio: They specialize in high-throughput distributed systems, WebGL creative graphics (Next.js 14 / R3F), and zero-trust security infrastructure with proven P99 latency optimizations.`;
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
    <div className="flex flex-col h-full space-y-3 text-slate-900 -m-2 p-3 bg-white/90 rounded-b-xl">
      {/* Siri Header & Intelligence Glow Orb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          {/* Animated Siri Intelligence Glow Ring */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Apple Siri Intelligence
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                RAG ON-DEVICE
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Contextual Codebase Neural Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-500">
          <Volume2 className="w-3.5 h-3.5" />
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
