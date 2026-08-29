'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { TerminalHistory } from '@/types/os';
import DOMPurify from 'dompurify';
import { Terminal as TerminalIcon, ShieldCheck, CornerDownLeft } from 'lucide-react';

const INITIAL_WELCOME = `Anugamya Shell v1.0 (x86_64-apple-darwin23.0)
Type "help" for a list of available commands.
Security Protocol: XSS Sanitization & Prompt Injection Shield Enabled.`;

export const TerminalApp: React.FC = () => {
  const { openWindow, telemetry } = useOSStore();
  const [inputCommand, setInputCommand] = useState<string>('');
  const [history, setHistory] = useState<TerminalHistory[]>([
    {
      id: 'init-1',
      command: '',
      output: INITIAL_WELCOME,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
  const [pastInputs, setPastInputs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Input Sanitization Protocol (Section 2.A Security Requirement)
  const sanitizeInput = (input: string): string => {
    // Strip dangerous HTML/script characters
    const cleanStr = input.replace(/[<>'"`;]/g, '');
    if (typeof window !== 'undefined' && DOMPurify.sanitize) {
      return DOMPurify.sanitize(cleanStr);
    }
    return cleanStr;
  };

  const handleCommandExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = inputCommand.trim();
    if (!rawInput) return;

    // Sanitize input command to block injection attacks
    const sanitizedCmd = sanitizeInput(rawInput);
    const parts = sanitizedCmd.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let outputResult: React.ReactNode = '';
    let outputType: TerminalHistory['type'] = 'output';

    switch (mainCommand) {
      case 'help':
        outputResult = (
          <div className="space-y-1 text-slate-300">
            <p className="text-cyan-400 font-bold">Available System Commands:</p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">help</span> - Display
              command manual
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">ls</span> - List directory
              contents
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">whoami</span> - Display
              engineer profile summary
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">projects</span> - Open
              Finder Projects bento window
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">cat achievements.txt</span> -
              Print key credentials & hackathon wins
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">open github</span> - Direct
              redirect to GitHub repository
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">telemetry</span> - View real-time
              node telemetry
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">rag &lt;query&gt;</span> - Query
              RAG AI engine directly
            </p>
            <p>
              <span className="text-emerald-400 font-bold w-28 inline-block">clear</span> - Clear terminal
              screen
            </p>
          </div>
        );
        break;

      case 'ls':
        outputResult = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <span className="text-blue-400 font-bold">drwxr-xr-x Projects/</span>
            <span className="text-amber-400 font-bold">drwxr-xr-x Achievements/</span>
            <span className="text-emerald-400 font-bold">-rw-r--r-- achievements.txt</span>
            <span className="text-purple-400 font-bold">-rw-r--r-- system_telemetry.log</span>
            <span className="text-cyan-400 font-bold">-rwxr-xr-x security_audit.sh</span>
            <span className="text-pink-400 font-bold">drwxr-xr-x AI_Assistant_RAG/</span>
          </div>
        );
        break;

      case 'whoami':
        outputResult = (
          <div className="space-y-1 text-slate-200">
            <p className="font-bold text-white">Anugamya (@AP-boi) - Creative Full-Stack & 3D WebGL Developer</p>
            <p className="text-slate-400 text-xs">
              Building AI-powered web experiences (Bharat Dekho), 2D cyberpunk game engines (Cyber Ascension), and desktop OS simulators in Next.js, Three.js & Canvas.
            </p>
            <p className="text-emerald-400 font-mono text-[11px]">
              GitHub: https://github.com/AP-boi • Open Source Contributor
            </p>
          </div>
        );
        break;

      case 'projects':
        openWindow('projects');
        outputResult = 'Launching Projects.app Finder window...';
        break;

      case 'camera':
      case 'cam':
        openWindow('camera');
        outputResult = 'Launching Camera & Motion Grid app...';
        break;

      case 'cat':
        if (args === 'achievements.txt') {
          openWindow('achievements');
          outputResult = (
            <div className="space-y-1 text-amber-300 font-mono text-xs">
              <p className="font-bold">[=== REAL PROJECTS & MILESTONES ===]</p>
              <p>• Bharat Dekho: AI-powered Indian Tourism & 3D Heritage Portal (Next.js 15 + Gemini AI + Three.js)</p>
              <p>• Cyber Ascension: 2D Cyberpunk Action Game Engine with Branching Narrative (HTML5 Canvas)</p>
              <p>• macOS Portfolio OS: Interactive Desktop OS Simulator with Liquid Glassmorphism</p>
              <p>• AirPure Delhi: iOS-styled Real-time AQI tracking and air purifier web application</p>
            </div>
          );
        } else {
          outputResult = `cat: ${args || 'file'}: No such file or directory. Try "cat achievements.txt"`;
          outputType = 'error';
        }
        break;

      case 'open':
        if (args === 'github') {
          window.open('https://github.com/AP-boi', '_blank', 'noopener,noreferrer');
          openWindow('github');
          outputResult = 'Executing direct action: Opening GitHub profile...';
        } else {
          outputResult = `open: command target "${args}" not recognized. Try "open github"`;
          outputType = 'error';
        }
        break;

      case 'telemetry':
        outputResult = (
          <div className="space-y-1 font-mono text-xs text-cyan-300">
            <p className="font-bold text-white">[=== REAL-TIME TELEMETRY MONITOR ===]</p>
            <p>Node Latency: {telemetry.latencyMs} ms</p>
            <p>Edge Region: {telemetry.region}</p>
            <p>FPS Benchmark: {telemetry.fps} FPS</p>
            <p>Active Memory: {telemetry.activeMemoryMb} MB</p>
            <p>Edge Status: {telemetry.edgeStatus}</p>
          </div>
        );
        break;

      case 'rag':
        if (!args) {
          outputResult = 'Usage: rag <your architecture question>';
          outputType = 'error';
        } else {
          openWindow('ai-assistant');
          outputResult = `Invoking AI Assistant Drawer with query: "${args}"...`;
        }
        break;

      case 'clear':
        setHistory([]);
        setInputCommand('');
        return;

      default:
        outputResult = `zsh: command not found: ${mainCommand}. Type "help" for available commands.`;
        outputType = 'error';
        break;
    }

    const newHistoryItem: TerminalHistory = {
      id: Math.random().toString(),
      command: rawInput,
      output: outputResult,
      type: outputType,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [...prev, newHistoryItem]);
    setPastInputs((prev) => [...prev, rawInput]);
    setCommandHistoryIndex(-1);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastInputs.length === 0) return;
      const nextIdx = commandHistoryIndex + 1;
      if (nextIdx < pastInputs.length) {
        setCommandHistoryIndex(nextIdx);
        setInputCommand(pastInputs[pastInputs.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistoryIndex > 0) {
        const nextIdx = commandHistoryIndex - 1;
        setCommandHistoryIndex(nextIdx);
        setInputCommand(pastInputs[pastInputs.length - 1 - nextIdx]);
      } else if (commandHistoryIndex === 0) {
        setCommandHistoryIndex(-1);
        setInputCommand('');
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full flex flex-col font-mono text-xs bg-slate-950 text-slate-100 p-3.5 selection:bg-cyan-500 selection:text-slate-950 overflow-hidden"
    >
      {/* History Log Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-emerald-400 font-bold">anugamya@portfolio</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span className="text-slate-400">$</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
            )}

            <div
              className={`${
                item.type === 'error'
                  ? 'text-rose-400 font-semibold'
                  : item.type === 'system'
                  ? 'text-slate-400'
                  : 'text-slate-200'
              }`}
            >
              {item.output}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Command Input Bar */}
      <form onSubmit={handleCommandExecute} className="mt-3 flex items-center space-x-2 pt-2 border-t border-white/10">
        <span className="text-emerald-400 font-bold whitespace-nowrap">anugamya@portfolio</span>
        <span className="text-cyan-400 font-bold">~</span>
        <span className="text-slate-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help')..."
          className="flex-1 bg-transparent text-white focus:outline-none font-mono caret-cyan-400"
          autoFocus
          spellCheck={false}
        />
        <button type="submit" className="text-slate-500 hover:text-cyan-400 transition-colors">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
