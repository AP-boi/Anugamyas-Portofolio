'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { TerminalHistory, VisitorRecord } from '@/types/os';
import {
  CornerDownLeft,
  ShieldCheck,
  Lock,
  Terminal as TerminalIcon,
  Sparkles,
  Trash2,
  HelpCircle,
  Cpu,
  FolderGit2,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export const TerminalApp: React.FC = () => {
  const { openWindow, telemetry, isAdmin, currentUser } = useOSStore();
  const [inputCommand, setInputCommand] = useState<string>('');

  const welcomeBanner = `Last login: ${new Date().toLocaleDateString()} on ttys002
Anugamya OS zsh (x86_64-apple-darwin23.0)${
    isAdmin ? ' — 👑 [ADMINISTRATOR SESSION ACTIVE]' : ''
  }
Type ${isAdmin ? '"check" to audit visitor logs or ' : ''}"help" to view available system commands.`;

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
              <p><span className="text-emerald-400 font-bold w-24 inline-block">neofetch</span> System info summary & ASCII</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">ls</span> List files and directories</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">whoami</span> Developer biography</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">projects</span> Open Projects Finder</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">analytics</span> Open Activity Monitor</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">ai &lt;query&gt;</span> Query AP Intelligence</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">cat &lt;file&gt;</span> Print file contents</p>
              <p><span className="text-emerald-400 font-bold w-24 inline-block">clear</span> Clear terminal screen</p>
            </div>
          </div>
        );
        break;

      case 'check':
      case 'visitors':
      case 'audit':
        if (!isAdmin) {
          outputResult = (
            <div className="space-y-1 text-rose-400 text-xs py-1">
              <p className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>zsh: permission denied: 'check' is an Administrator-only command.</span>
              </p>
              <p className="text-slate-400">
                Please log in with administrator passcode <strong className="text-white">2026</strong> from the lock screen (⌘L) to unlock.
              </p>
            </div>
          );
          outputType = 'error';
        } else {
          try {
            const res = await fetch('/api/admin/visitors');
            const data = await res.json();
            const visitors: VisitorRecord[] = data.analytics?.recentLogins || [];
            const summary = data.analytics;

            outputResult = (
              <div className="space-y-2 text-xs font-mono text-slate-200 py-1">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>VISITOR INTELLIGENCE AUDIT — LIVE NODE TELEMETRY</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      ONLINE
                    </span>
                  </div>
                  <div className="flex space-x-4 text-[11px] text-slate-300 pt-0.5">
                    <span>Total Visits: <strong className="text-white">{summary?.totalVisits || 0}</strong></span>
                    <span>Total Logins: <strong className="text-white">{summary?.totalLogins || 0}</strong></span>
                    <span>Active Sessions: <strong className="text-emerald-400">{summary?.activeSessions || 1}</strong></span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-white/15 bg-white/5 text-slate-400 uppercase text-[9px] tracking-wider">
                        <th className="py-1.5 px-3">Visitor Name</th>
                        <th className="py-1.5 px-3">Role</th>
                        <th className="py-1.5 px-3">Company</th>
                        <th className="py-1.5 px-3">Device / OS</th>
                        <th className="py-1.5 px-3">Location</th>
                        <th className="py-1.5 px-3 text-right">Logins</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {visitors.map((v) => (
                        <tr key={v.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-1.5 px-3 font-semibold text-white truncate max-w-[120px]">
                            {v.name} {v.isAdmin ? '👑' : ''}
                          </td>
                          <td className="py-1.5 px-3 text-slate-300 truncate max-w-[100px]">{v.role || 'Visitor'}</td>
                          <td className="py-1.5 px-3 text-slate-400 truncate max-w-[110px]">{v.company || 'Guest'}</td>
                          <td className="py-1.5 px-3 text-cyan-400">{v.os} • {v.browser}</td>
                          <td className="py-1.5 px-3 text-slate-400">{v.city || 'Delhi'}, {v.country || 'IN'}</td>
                          <td className="py-1.5 px-3 text-right font-bold text-amber-400">{v.sessionCount || 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          } catch (err) {
            outputResult = 'Error retrieving visitor intelligence data from backend node.';
            outputType = 'error';
          }
        }
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
            <span className="text-pink-400 font-bold">drwxr-xr-x Analytics/</span>
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
    <div className="flex flex-col h-full space-y-3 text-slate-900 p-3 bg-white/95 select-none overflow-hidden">
      {/* Top macOS App Subheader Bar (Matching Finder, Notes, Analytics) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <img src="/icons/terminal.png" alt="Terminal" className="w-5 h-5 rounded-md object-contain shadow-xs" />
          <span className="text-xs font-bold text-slate-900">Terminal — zsh</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-600">
            {isAdmin ? '👑 Administrator' : 'Guest / Visitor'}
          </span>
        </div>

        {/* Quick Command Action Toolbar Chips */}
        <div className="flex items-center space-x-1.5">
          {isAdmin && (
            <button
              onClick={() => executeCommand('check')}
              className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              <span>Check Visitors</span>
            </button>
          )}

          <button
            onClick={() => executeCommand('neofetch')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <Cpu className="w-3 h-3 text-cyan-600" />
            <span>Neofetch</span>
          </button>

          <button
            onClick={() => executeCommand('projects')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <FolderGit2 className="w-3 h-3 text-blue-600" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => executeCommand('help')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-slate-600" />
            <span>Help</span>
          </button>

          <button
            onClick={() => setHistory([])}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            title="Clear Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inner Sleek Dark Terminal Console Pane */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 min-h-0 w-full rounded-2xl bg-slate-950 text-slate-100 p-4 border border-slate-800 shadow-inner flex flex-col font-mono text-xs overflow-hidden cursor-text"
      >
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.command && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">
                    anugamya{isAdmin ? '#root' : '@macbook'}
                  </span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400 font-bold">~</span>
                  <span className="text-slate-400">{isAdmin ? '#' : '$'}</span>
                  <span className="text-white font-bold">{item.command}</span>
                </div>
              )}

              <div
                className={`${
                  item.type === 'error'
                    ? 'text-rose-400 font-semibold'
                    : item.type === 'system'
                    ? 'text-slate-300 whitespace-pre-line leading-relaxed'
                    : 'text-slate-200'
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
          className="mt-3 flex items-center space-x-2 pt-2.5 border-t border-white/10 flex-shrink-0 bg-slate-950"
        >
          <span className="text-emerald-400 font-bold whitespace-nowrap">
            anugamya{isAdmin ? '#root' : '@macbook'}
          </span>
          <span className="text-cyan-400 font-bold">~</span>
          <span className="text-slate-400">{isAdmin ? '#' : '$'}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAdmin ? "Type 'check' for visitor log..." : "Type 'help' for commands..."}
            className="flex-1 bg-transparent text-white focus:outline-none font-mono caret-cyan-400"
            autoFocus
            spellCheck={false}
          />
          <button type="submit" className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
