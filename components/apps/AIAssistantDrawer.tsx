'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
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
  Terminal,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { useOSStore } from '@/store/useOSStore';
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  commandShortcut?: string;
}

const QUICK_PROMPTS = [
  'Explain the 3D WebGL architecture',
  'What is the Bharat Dekho streaming pipeline?',
  'How does the Rapier3D physics engine work in PhysX Studio?',
  'What is Anugamya\'s core tech stack?',
  'How can I get in touch with Anugamya?',
];

export const AIAssistantDrawer: React.FC = () => {
  const { openWindow } = useOSStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "AP Intelligence Assistant initialized. Verified knowledge base: Three.js WebGL rendering pipelines, Gemini 1.5 streaming architectures, Rapier3D WASM physics, and macOS portfolio internals. Enter a query or select a technical prompt below.",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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

  const generateAnswer = (query: string): { text: string; codeSnippet?: string; commandShortcut?: string } => {
    const q = query.toLowerCase();

    if (q.includes('bharat') || q.includes('tourism') || q.includes('heritage') || q.includes('museum')) {
      return {
        text: `Bharat Dekho Architecture Overview:\n\n• Streaming Engine: Google Gemini 1.5 Flash streaming API with low-temperature prompt constraints for reproducible itinerary trees.\n• 3D Heritage Museum: Three.js GLTF loaders with OrbitControls, instanced buffer geometry, and dynamic depth-map lighting shaders.\n• Latency Profile: 118ms Time-To-First-Token, 60 FPS continuous WebGL render loop.\n• Smooth Scroll: Lenis momentum scroll synchronizer with hardware-accelerated transforms.`,
        codeSnippet: `// gemini_itinerary_stream.ts\nconst result = await model.generateContentStream({\n  contents: [{ role: 'user', parts: [{ text: prompt }] }],\n  generationConfig: { temperature: 0.15, maxOutputTokens: 2048 }\n});`,
        commandShortcut: 'Press ⌘1 to open Projects Finder',
      };
    }

    if (q.includes('physx') || q.includes('physics') || q.includes('rapier')) {
      return {
        text: `PhysX Studio Simulation Architecture:\n\n• Engine: Rapier 3D WebAssembly (WASM) physics runtime.\n• Collision Resolution: Continuous contact manifold computation with zero JavaScript main-thread lockup.\n• Render Layer: React Three Fiber (R3F) with Three.js point and directional shadow mapping.\n• Performance: Locked 60 FPS at 16.6ms per step with over 100 concurrent rigid bodies.`,
        codeSnippet: `// rapier_simulation_loop.ts\nworld.timestep = Math.min(deltaTime, 0.033);\nworld.step(eventQueue);\neventQueue.drainCollisionEvents((h1, h2, started) => {\n  if (started) computeContactResolution(h1, h2);\n});`,
        commandShortcut: 'Explore in Finder (⌘1)',
      };
    }

    if (q.includes('webgl') || q.includes('three') || q.includes('graphics') || q.includes('3d') || q.includes('canvas')) {
      return {
        text: `3D WebGL & Graphics Engineering Stack:\n\n1. React Three Fiber & Three.js: Custom GLTF/GLB asset loading pipelines, instanced mesh rendering, and GLSL fragment shaders.\n2. Rapier 3D WASM: High-throughput rigid-body and soft-body physical kinematics running in WebAssembly.\n3. HTML5 Canvas 2D: Custom sprite-sheet render loop with delta-time integration and AABB bounding-box collision detection running at 60 FPS.\n4. Memory Management: Automatic GPU texture and buffer deallocation on component unmount.`,
        codeSnippet: `// glsl_fragment_pass.glsl\nuniform float uTime;\nvarying vec2 vUv;\nvoid main() {\n  vec2 uv = vUv * 2.0 - 1.0;\n  gl_FragColor = vec4(vec3(smoothstep(0.4, 0.5, length(uv))), 1.0);\n}`,
      };
    }

    if (q.includes('cyber') || q.includes('game') || q.includes('ascension')) {
      return {
        text: `Cyber Ascension Combat Engine Architecture:\n\n• Core Loop: Vanilla HTML5 Canvas 2D with requestAnimationFrame delta-time updates.\n• Hitbox Physics: Discrete AABB intersection checks with frame-accurate attack windows.\n• State Machine: Character state controller managing idle, dash, attack, and hit-stun transitions.\n• Audio: Web Audio API procedural synthesis for dynamic slashing and impact sounds.`,
        codeSnippet: `// canvas_combat_loop.ts\nfunction updateFrame(dt: number) {\n  player.update(dt);\n  checkCollisions(player.slashBox, enemy.hurtBox);\n  renderSparksPass(ctx);\n}`,
      };
    }

    if (q.includes('portfolio') || q.includes('macos') || q.includes('desktop') || q.includes('store') || q.includes('zustand')) {
      return {
        text: `Anugamya Portfolio OS System Internals:\n\n• Framework: Next.js 14 App Router with React 18 concurrent hydration.\n• Window Management: Zustand atomic reactive store with focus stacks and z-index ordering.\n• Physics & Motion: Framer Motion spring curves (damping: 26, stiffness: 320).\n• Tactile Materiality: Layered inner highlights, hairline borders, and zero gratuitous glassmorphism blur lag.`,
        codeSnippet: `// use_os_store.ts\nexport const useOSStore = create<OSStore>()(\n  persist((set) => ({\n    windows: INITIAL_WINDOWS,\n    openWindow: (id) => set(s => focusWindow(s, id))\n  }), { name: 'ap-os-session' })\n);`,
        commandShortcut: 'Press ⌘T to launch Terminal',
      };
    }

    if (q.includes('skills') || q.includes('stack') || q.includes('tech') || q.includes('technologies')) {
      return {
        text: `Anugamya Technical Competency Matrix:\n\n• Frontend Architecture: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Lenis Scroll.\n• Graphics & Physics: Three.js, WebGL (GLSL), Rapier 3D (WASM), HTML5 Canvas 2D/3D.\n• Systems & Backend: Node.js Streams, REST/GraphQL APIs, Java 17 (ASM/LWJGL), Python, SQLite/PostgreSQL.\n• AI & Concurrency: Google Gemini 1.5 streaming APIs, vector representations, zero-re-render state synchronization.`,
        commandShortcut: 'Run "help" or "neofetch" in Terminal',
      };
    }

    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('github')) {
      return {
        text: `Direct Communication & Repository Channels:\n\n• GitHub: https://github.com/AP-boi\n• Focus Area: High-impact full-stack web applications, 3D WebGL graphics, and systems engineering.\n• Available for technical collaborations and production engineering engagements.`,
        commandShortcut: 'GitHub: @AP-boi',
      };
    }

    return {
      text: `Anugamya (@AP-boi) is a software engineer and creative technologist specializing in full-stack web systems, 3D WebGL computer graphics, GPU physics simulations, and desktop simulator architectures. Explore projects in Finder (⌘1) or review milestones in Notes (⌘2).`,
      commandShortcut: 'Open Finder: ⌘1 | Notes: ⌘2',
    };
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

    const answer = generateAnswer(query);

    // Realistic response latency
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: answer.text,
        codeSnippet: answer.codeSnippet,
        commandShortcut: answer.commandShortcut,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      speakText(answer.text);
    }, 380);
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
        text: "Session reset. Ready for technical inquiries on WebGL, Three.js, streaming APIs, or portfolio architecture.",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fbfbf9] dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 select-none overflow-hidden font-sans transition-colors selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Header Bar with Tactile Physical Controls */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-[#111213] flex-shrink-0 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-tactile">
            <img src="/icons/siri.png" alt="AP Assistant" className="w-6 h-6 object-contain" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight font-sans">
                AP Intelligence Assistant
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-semibold">
                v2.4 TELEMETRY
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              Grounded Domain Model: Three.js • Rapier3D • Gemini Streaming
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              sounds.playClick();
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all btn-tactile ${
              voiceEnabled
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-neutral-900 dark:border-white shadow-tactile'
                : 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title={voiceEnabled ? 'Voice Output Active' : 'Enable Voice Synthesis'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all btn-tactile"
            title="Reset Context"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-tactile ${
                  isUser
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <img src="/icons/siri.png" alt="AP" className="w-4 h-4 object-contain" />
                )}
              </div>

              {/* Bubble Body */}
              <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-tactile'
                      : 'bg-white dark:bg-[#121315] border border-neutral-200/90 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-tactile space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>

                  {/* Optional Technical Code Snippet */}
                  {msg.codeSnippet && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                        <span>IMPLEMENTATION ARTIFACT</span>
                        <button
                          onClick={() => handleCopy(msg.id + '-code', msg.codeSnippet!)}
                          className="hover:text-neutral-100 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id + '-code' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="bg-[#0b0c0d] text-neutral-200 p-2.5 rounded-lg border border-neutral-800 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                        {msg.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Optional Shortcut Hint */}
                  {msg.commandShortcut && (
                    <div className="pt-1 text-[10px] font-mono text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-neutral-400" />
                      <span>{msg.commandShortcut}</span>
                    </div>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="flex items-center space-x-2 px-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex items-center gap-1"
                      title="Copy message text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
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
          <div className="flex items-center space-x-2 text-xs text-neutral-500 font-mono">
            <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <span className="animate-pulse">Synthesizing deterministic response...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3 py-2 overflow-x-auto flex space-x-2 flex-shrink-0 scrollbar-none border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-[#0f1011]">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap transition-all shadow-tactile btn-tactile"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Bar with Physical Controls & Smooth Caret */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111213] flex items-center space-x-2 flex-shrink-0 transition-colors shadow-xs"
      >
        <div className="flex-1">
          <SmoothInput
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AP Intelligence regarding WebGL, Gemini streaming, or architecture..."
            wrapperClassName="bg-neutral-100/80 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2 shadow-tactile"
            className="text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 font-sans"
            caretColor="bg-neutral-900 dark:bg-neutral-100 shadow-xs"
          />
        </div>

        {/* Tactile Concrete Button (No purple/cyan gradient blobs) */}
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-30 transition-all shadow-tactile btn-tactile active:translate-y-px cursor-pointer flex-shrink-0 font-medium"
          title="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantDrawer;
