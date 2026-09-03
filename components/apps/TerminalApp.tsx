'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { TerminalHistory } from '@/types/os';
import {
  CornerDownLeft,
  ShieldCheck,
  Lock,
  Terminal as TerminalIcon,
  Trash2,
  HelpCircle,
  Cpu,
  FolderGit2,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106';

export const TerminalApp: React.FC = () => {
  const { openWindow, telemetry, isAdmin, currentUser, theme } = useOSStore();
  const isDark = theme === 'dark';
  const [inputCommand, setInputCommand] = useState<string>('');

  const welcomeBanner = `Last login: ${new Date().toLocaleDateString()} on ttys002
Anugamya OS zsh (x86_64-apple-darwin23.0)${
    isAdmin ? ' — 👑 [ADMINISTRATOR SESSION ACTIVE]' : ''
  }
Type "help" to view available system commands.`;

  const [history, setHistory] = useState<TerminalHistory[]>([
    {
      id: 'init-1',
      command: '',
      output: welcomeBanner,
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
  const [pastInputs, setPastInputs] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll only when user enters new commands
  useEffect(() => {
    if (history.length > 1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (rawCommand: string) => {
    const rawInput = rawCommand.trim();
    if (!rawInput) return;

    sounds.playClick();
    const sanitizedCmd = rawInput.replace(/[<>'"`;]/g, '');
    const parts = sanitizedCmd.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let outputResult: React.ReactNode = '';
    let outputType: TerminalHistory['type'] = 'output';

    switch (mainCommand) {
      case 'help':
        outputResult = (
          <div className="space-y-1.5 text-slate-300 text-xs py-1">
            <p className="text-cyan-400 font-bold tracking-wide">Available System Commands:</p>
            {isAdmin && (
              <div className="bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-amber-400 font-mono">check</strong>
                  <span>— View real-time visitor database & logins</span>
                </span>
                <span className="text-[10px] bg-amber-400 text-black px-1 rounded font-bold uppercase">Admin</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 font-mono text-[11px]">
              <p><span className="text-emerald-400 font-bold w-24 inline-block">help</span> Display available commands</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">check</span> View real-time visitor database</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">guestbook</span> Read / sign Cloud guestbook</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">dbstatus</span> Supabase database ping</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">neofetch</span> System info summary & ASCII</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">ls</span> List files and directories</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">whoami</span> Developer biography</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">projects</span> Open Projects Finder</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">settings</span> Open System Settings</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">ai &lt;query&gt;</span> Query AP Intelligence</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">clear</span> Clear terminal screen</p>
            </div>
          </div>
        );
        break;

      case 'neofetch':
        outputResult = (
          <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 text-xs font-mono py-1">
            <div className="text-cyan-400 leading-none select-none font-bold">
              <pre>{`       .:'
     ':::
   ':::::
 .::::::
':::::::::.
:::::::::::::  
:::::::::::::  
':::::::::::
 '::::::::
   '::::
     '`}</pre>
            </div>
            <div className="space-y-1 text-slate-300">
              <p className="text-emerald-400 font-bold">anugamya@macbook-pro</p>
              <p className="text-slate-500">----------------------</p>
              <p><span className="text-amber-400 font-semibold">OS:</span> macOS Sonoma 14.4 / Anugamya OS</p>
              <p><span className="text-amber-400 font-semibold">Host:</span> Anugamya M3 Max Studio</p>
              <p><span className="text-amber-400 font-semibold">Kernel:</span> 23.4.0 Darwin Kernel</p>
              <p><span className="text-amber-400 font-semibold">Uptime:</span> 12 days, 4 hours</p>
              <p><span className="text-amber-400 font-semibold">Shell:</span> zsh 5.9 (x86_64-anugamya-darwin23.0)</p>
              <p><span className="text-amber-400 font-semibold">Session:</span> {isAdmin ? 'Administrator (Root)' : 'Visitor'}</p>
              <p><span className="text-amber-400 font-semibold">Memory:</span> {telemetry.activeMemoryMb}MB / 64GB</p>
            </div>
          </div>
        );
        break;

      case 'ls':
        outputResult = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-1">
            <span className="text-blue-400 font-bold">drwxr-xr-x Projects/</span>
            <span className="text-amber-400 font-bold">drwxr-xr-x Achievements/</span>
            <span className="text-emerald-400 font-bold">-rw-r--r-- about.txt</span>
            <span className="text-purple-400 font-bold">-rw-r--r-- telemetry.log</span>
            <span className="text-cyan-400 font-bold">drwxr-xr-x AI_Assistant/</span>
            <span className="text-pink-400 font-bold">drwxr-xr-x Settings/</span>
          </div>
        );
        break;

      case 'whoami':
        outputResult = (
          <div className="space-y-1 text-slate-200 py-1">
            <p className="font-bold text-white">Anugamya (@AP-boi) — Creative Full-Stack & 3D WebGL Developer</p>
            <p className="text-slate-400 text-xs">
              Crafting immersive web experiences with Next.js, Three.js 3D WebGL, AI integration, and HTML5 Canvas engines.
            </p>
            <p className="text-emerald-400 font-mono text-[11px]">
              GitHub: https://github.com/AP-boi
            </p>
          </div>
        );
        break;

      case 'ai':
        openWindow('ai-assistant');
        outputResult = args ? `Passing query to AP Intelligence: "${args}"...` : 'Launching AP Intelligence Assistant...';
        break;

      case 'projects':
        openWindow('projects');
        outputResult = 'Opening Projects Finder...';
        break;

      case 'settings':
      case 'preferences':
        openWindow('system-info');
        outputResult = 'Opening System Settings & Telemetry...';
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
            <div className="space-y-1 text-amber-300 font-mono text-xs py-1">
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
        } else if (args === 'settings' || args === 'telemetry') {
          openWindow('system-info');
          outputResult = 'Opening System Settings...';
        } else {
          outputResult = `open: unknown target "${args}". Try "open github" or "open projects"`;
          outputType = 'error';
        }
        break;

      case 'telemetry':
        outputResult = (
          <div className="space-y-1 font-mono text-xs text-cyan-300 py-1">
            <p className="font-bold text-white">[ Node Telemetry ]</p>
            <p>Latency: {telemetry.latencyMs} ms</p>
            <p>Region: {telemetry.region}</p>
            <p>Framerate: {telemetry.fps} FPS</p>
            <p>Active Memory: {telemetry.activeMemoryMb} MB</p>
            <p>Status: {telemetry.edgeStatus}</p>
          </div>
        );
        break;

      case 'check':
      case 'visitors': {
        try {
          const res = await fetch('/api/visitors?limit=8');
          const data = await res.json();
          if (data.success && Array.isArray(data.visitors)) {
            const FAKE_LIST = ['sundar pichai', 'tech recruiter', 'open source contributor', 'guillermo rauch', 'alphabet & google', 'microsoft ai', 'vercel ecosystem'];
            const cleanVisitors = data.visitors.filter((v: any) => {
              const n = (v.name || '').toLowerCase();
              const c = (v.company || '').toLowerCase();
              return !FAKE_LIST.some((f) => n.includes(f) || c.includes(f));
            });

            outputResult = (
              <div className="space-y-2 font-mono text-xs py-1">
                <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-700/60 pb-1 text-[11px]">
                  <span className="text-emerald-400 font-bold">[ SUPABASE VISITOR LOGS & TELEMETRY ]</span>
                  <span>TOTAL: {cleanVisitors.length} SESSIONS ({data.provider.toUpperCase()})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-neutral-500 border-b border-neutral-800">
                      <tr>
                        <th className="pb-1 pr-3">NAME</th>
                        <th className="pb-1 pr-3">ROLE & COMPANY</th>
                        <th className="pb-1 pr-3">LOCATION</th>
                        <th className="pb-1 pr-3">DEVICE / OS</th>
                        <th className="pb-1">LAST ACTIVE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {cleanVisitors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-neutral-500 font-mono text-[11px] italic">
                            No visitor sessions recorded yet. Fresh sessions will appear here as visitors arrive.
                          </td>
                        </tr>
                      ) : (
                        cleanVisitors.map((v: any) => (
                          <tr key={v.id} className="text-neutral-300">
                            <td className="py-1 pr-3 font-semibold text-neutral-100">{v.name}</td>
                            <td className="py-1 pr-3 text-neutral-400">{v.role} ({v.company})</td>
                            <td className="py-1 pr-3 text-neutral-400">{v.city}, {v.country}</td>
                            <td className="py-1 pr-3 text-neutral-400">{v.device} • {v.os}</td>
                            <td className="py-1 text-emerald-400">{new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          } else {
            outputResult = `Failed to fetch visitor records: ${data.error || 'Unknown error'}`;
            outputType = 'error';
          }
        } catch (e: any) {
          outputResult = `Network error connecting to /api/visitors: ${e.message}`;
          outputType = 'error';
        }
        break;
      }

      case 'guestbook': {
        const trimmedArgs = args.trim();
        if (trimmedArgs.startsWith('sign ') || (trimmedArgs && !trimmedArgs.startsWith('list'))) {
          const messageText = trimmedArgs.startsWith('sign ') ? trimmedArgs.slice(5).trim() : trimmedArgs;
          try {
            const authorName = currentUser?.name || 'Terminal Explorer';
            const res = await fetch('/api/guestbook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                author: authorName,
                role: currentUser?.role || 'Developer',
                company: currentUser?.company || 'Community',
                message: messageText,
              }),
            });
            const data = await res.json();
            if (data.success) {
              outputResult = (
                <div className="font-mono text-xs py-1 space-y-1">
                  <p className="text-emerald-400 font-semibold">✓ Guestbook signature verified & persisted to Supabase database!</p>
                  <p className="text-neutral-400 text-[11px]">Author: {authorName} | Entry ID: {data.entry.id}</p>
                  <p className="text-neutral-300 italic text-[11px]">"{messageText}"</p>
                </div>
              );
            } else {
              outputResult = `Guestbook submission rejected: ${data.error}`;
              outputType = 'error';
            }
          } catch (e: any) {
            outputResult = `Failed to submit signature: ${e.message}`;
            outputType = 'error';
          }
        } else {
          try {
            const res = await fetch('/api/guestbook');
            const data = await res.json();
            if (data.success && Array.isArray(data.entries)) {
              outputResult = (
                <div className="space-y-2 font-mono text-xs py-1">
                  <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-700/60 pb-1 text-[11px]">
                    <span className="text-emerald-400 font-bold">[ SUPABASE CLOUD GUESTBOOK — SIGNATURES ]</span>
                    <span className="text-[10px] text-neutral-500">Sign command: "guestbook sign &lt;message&gt;"</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {data.entries.length === 0 ? (
                      <p className="text-neutral-500 py-1.5 italic text-[11px]">
                        No signatures recorded yet. Type <span className="text-emerald-400">guestbook sign &lt;message&gt;</span> to leave the first verified entry!
                      </p>
                    ) : (
                      data.entries.slice(0, 5).map((e: any) => (
                        <div key={e.id} className="p-2 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span className="font-semibold text-neutral-200">{e.author} {e.company ? `(${e.company})` : ''}</span>
                            <span className="text-[10px] text-neutral-500">{new Date(e.timestamp).toLocaleDateString()}</span>
                          </div>
                          <p className="text-neutral-300">"{e.message}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          } catch (e: any) {
            outputResult = `Failed to query guestbook: ${e.message}`;
            outputType = 'error';
          }
        }
        break;
      }

      case 'dbstatus':
      case 'supabase': {
        try {
          const res = await fetch('/api/telemetry');
          const data = await res.json();
          outputResult = (
            <div className="space-y-1.5 font-mono text-xs py-1">
              <div className="text-emerald-400 font-bold flex items-center justify-between border-b border-neutral-700/60 pb-1">
                <span>[ Supabase PostgreSQL Node Telemetry ]</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {data.database.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-neutral-300 pt-1">
                <p><span className="text-neutral-500 w-28 inline-block">Provider:</span> {data.database.provider.toUpperCase()}</p>
                <p><span className="text-neutral-500 w-28 inline-block">Query Ping:</span> {data.database.latencyMs} ms</p>
                <p><span className="text-neutral-500 w-28 inline-block">Cloud Config:</span> {data.database.isCloudConfigured ? 'PRODUCTION' : 'LOCAL FALLBACK'}</p>
                <p><span className="text-neutral-500 w-28 inline-block">Edge Region:</span> {data.telemetry.region}</p>
                <p><span className="text-neutral-500 w-28 inline-block">Total Visitors:</span> {data.telemetry.totalVisitors}</p>
                <p><span className="text-neutral-500 w-28 inline-block">Guestbook Rows:</span> {data.telemetry.totalGuestbookEntries}</p>
              </div>
            </div>
          );
        } catch (e: any) {
          outputResult = `Error pinging telemetry: ${e.message}`;
          outputType = 'error';
        }
        break;
      }

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
    <div className="flex flex-col h-full space-y-2.5 text-slate-900 dark:text-slate-100 p-3.5 bg-white/95 dark:bg-slate-950 select-none overflow-hidden font-sans transition-colors">
      {/* Top macOS App Subheader Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/terminal.png" alt="Terminal" className="w-5 h-5 rounded-md object-contain shadow-xs" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Terminal — zsh</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            {isAdmin ? '👑 Administrator' : 'Guest / Visitor'}
          </span>
        </div>

        {/* Quick Command Action Toolbar Chips */}
        <div className="flex items-center space-x-1.5">
          {isAdmin && (
            <button
              onClick={() => executeCommand('check')}
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-amber-500" />
              <span>Check Visitors</span>
            </button>
          )}

          <button
            onClick={() => executeCommand('neofetch')}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/80 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <Cpu className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Neofetch</span>
          </button>

          <button
            onClick={() => executeCommand('projects')}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/80 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <FolderGit2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => executeCommand('help')}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/80 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Help</span>
          </button>

          <button
            onClick={() => setHistory([])}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Clear Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inner Sleek Dark/Light Terminal Console Pane */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 min-h-0 w-full rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2.5 flex flex-col font-mono text-xs overflow-hidden cursor-text border border-slate-200 dark:border-slate-800/80 shadow-inner transition-colors"
      >
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.command && (
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    anugamya{isAdmin ? '#root' : '@macbook'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">~</span>
                  <span className="text-slate-500 dark:text-slate-400">{isAdmin ? '#' : '$'}</span>
                  <span className="text-slate-900 dark:text-white font-bold">{item.command}</span>
                </div>
              )}

              <div
                className={`${
                  item.type === 'error'
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : item.type === 'system'
                    ? 'text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {item.output}
              </div>
            </div>
          ))}
        </div>

        {/* Command Line Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputCommand);
          }}
          className="mt-3 flex items-center space-x-2 pt-2.5 border-t border-slate-200 dark:border-white/10 flex-shrink-0 bg-slate-50 dark:bg-slate-950"
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
            anugamya{isAdmin ? '#root' : '@macbook'}
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">~</span>
          <span className="text-slate-500 dark:text-slate-400">{isAdmin ? '#' : '$'}</span>
          <div className="flex-1">
            <SmoothInput
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAdmin ? "Type 'check' for visitor log..." : "Type 'help' for commands..."}
              wrapperClassName="bg-transparent border-none p-0 rounded-none shadow-none"
              className="bg-transparent text-slate-900 dark:text-white focus:outline-none font-mono text-xs"
              caretColor={isDark ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" : "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]"}
              autoFocus
              spellCheck={false}
            />
          </div>
          <button type="submit" className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
