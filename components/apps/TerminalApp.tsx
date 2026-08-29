'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { TerminalHistory } from '@/types/os';
import { CornerDownLeft } from 'lucide-react';

const INITIAL_WELCOME = `Last login: ${new Date().toLocaleDateString()} on ttys002
Anugamya OS zsh (x86_64-apple-darwin23.0)
Type "help" to view available system commands.`;

export const TerminalApp: React.FC = () => {
  const { openWindow, telemetry } = useOSStore();
  const [inputCommand, setInputCommand] = useState<string>('');
  const [history, setHistory] = useState<TerminalHistory[]>([
    {
      id: 'init-1',
      command: '',
      output: INITIAL_WELCOME,
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
  const [pastInputs, setPastInputs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = inputCommand.trim();
    if (!rawInput) return;

    const sanitizedCmd = rawInput.replace(/[<>'"`;]/g, '');
    const parts = sanitizedCmd.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let outputResult: React.ReactNode = '';
    let outputType: TerminalHistory['type'] = 'output';

    switch (mainCommand) {
      case 'help':
        outputResult = (
          <div className="space-y-1 text-slate-300">
            <p className="text-cyan-400 font-bold">Available Commands:</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">help</span> Display available commands</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">ls</span> List files and directories</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">whoami</span> Display developer profile</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">projects</span> Open Projects Finder window</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">analytics</span> Open Visitor Intelligence dashboard</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">cat &lt;file&gt;</span> Read file contents</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">open &lt;app&gt;</span> Launch an application or URL</p>
            <p><span className="text-emerald-400 font-bold w-28 inline-block">clear</span> Clear terminal buffer</p>
          </div>
        );
        break;

      case 'ls':
        outputResult = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <span className="text-blue-400 font-bold">drwxr-xr-x Projects/</span>
            <span className="text-amber-400 font-bold">drwxr-xr-x Achievements/</span>
            <span className="text-emerald-400 font-bold">-rw-r--r-- about.txt</span>
            <span className="text-purple-400 font-bold">-rw-r--r-- telemetry.log</span>
            <span className="text-cyan-400 font-bold">drwxr-xr-x AI_Assistant/</span>
            <span className="text-pink-400 font-bold">drwxr-xr-x Analytics/</span>
          </div>
        );
        break;

      case 'whoami':
        outputResult = (
          <div className="space-y-1 text-slate-200">
            <p className="font-bold text-white">Anugamya (@AP-boi) — Creative Full-Stack & 3D WebGL Developer</p>
            <p className="text-slate-400 text-xs">
              Specializing in Next.js, Three.js 3D WebGL graphics, Gemini AI apps, and interactive canvas engines.
            </p>
            <p className="text-emerald-400 font-mono text-[11px]">
              GitHub: https://github.com/AP-boi
            </p>
          </div>
        );
        break;

      case 'projects':
        openWindow('projects');
        outputResult = 'Launching Projects Finder...';
        break;

      case 'analytics':
        openWindow('analytics');
        outputResult = 'Opening Visitor Intelligence & Analytics...';
        break;

      case 'camera':
      case 'cam':
        openWindow('camera');
        outputResult = 'Launching Camera & Motion Grid...';
        break;

      case 'cat':
        if (args === 'about.txt' || args === 'achievements.txt') {
          openWindow('achievements');
          outputResult = (
            <div className="space-y-1 text-amber-300 font-mono text-xs">
              <p className="font-bold">[ Featured Projects ]</p>
              <p>• Bharat Dekho: AI-powered Indian Tourism & 3D Heritage Portal (Next.js 15 + Gemini AI + Three.js)</p>
              <p>• Cyber Ascension: 2D Cyberpunk Action Game Engine (HTML5 Canvas)</p>
              <p>• Portfolio OS: Interactive Apple macOS Desktop Simulation</p>
              <p>• AirPure Delhi: Real-time AQI tracking platform</p>
            </div>
          );
        } else {
          outputResult = `cat: ${args || 'file'}: No such file. Try "cat about.txt"`;
          outputType = 'error';
        }
        break;

      case 'open':
        if (args === 'github' || args === 'gh') {
          window.open('https://github.com/AP-boi', '_blank', 'noopener,noreferrer');
          openWindow('github');
          outputResult = 'Opening GitHub in Safari...';
        } else if (args === 'projects') {
          openWindow('projects');
          outputResult = 'Opening Projects...';
        } else if (args === 'analytics') {
          openWindow('analytics');
          outputResult = 'Opening Analytics...';
        } else {
          outputResult = `open: unknown target "${args}". Try "open github" or "open projects"`;
          outputType = 'error';
        }
        break;

      case 'telemetry':
        outputResult = (
          <div className="space-y-1 font-mono text-xs text-cyan-300">
            <p className="font-bold text-white">[ Node Telemetry ]</p>
            <p>Latency: {telemetry.latencyMs} ms</p>
            <p>Region: {telemetry.region}</p>
            <p>Framerate: {telemetry.fps} FPS</p>
            <p>Active Memory: {telemetry.activeMemoryMb} MB</p>
            <p>Status: {telemetry.edgeStatus}</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputCommand('');
        return;

      default:
        outputResult = `zsh: command not found: ${mainCommand}. Type "help" for a list of commands.`;
        outputType = 'error';
        break;
    }

    const newHistoryItem: TerminalHistory = {
      id: Math.random().toString(36).substring(2, 9),
      command: rawInput,
      output: outputResult,
      type: outputType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-emerald-400 font-bold">anugamya@macbook</span>
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

      <form onSubmit={handleCommandExecute} className="mt-3 flex items-center space-x-2 pt-2 border-t border-white/10">
        <span className="text-emerald-400 font-bold whitespace-nowrap">anugamya@macbook</span>
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

export default TerminalApp;
