'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import {
  Lock,
  User,
  Shield,
  Sparkles,
  ArrowRight,
  KeyRound,
  Building,
  Briefcase,
  Mail,
  MessageSquare,
  CheckCircle2,
  Wifi,
  Battery,
} from 'lucide-react';
import { sounds } from '@/lib/soundEngine';
import { APLogo } from '@/components/ui/APLogo';

interface MacOSLockScreenProps {
  onUnlock?: () => void;
}

export const MacOSLockScreen: React.FC<MacOSLockScreenProps> = ({ onUnlock }) => {
  const { isLocked, unlockScreen, setCurrentUser } = useOSStore();
  const [loginMode, setLoginMode] = useState<'visitor' | 'guest' | 'admin'>('visitor');
  
  // Visitor Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Time & Date for lock screen
  const [currentTime, setCurrentTime] = useState({
    timeStr: '8:45',
    dateStr: 'Thursday, August 13',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMins = mins < 10 ? `0${mins}` : mins;
      const ampm = hours >= 12 ? 'PM' : 'AM';

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      setCurrentTime({
        timeStr: `${formattedHours}:${formattedMins}`,
        dateStr: `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        isGuest: loginMode === 'guest',
      };

      if (loginMode === 'visitor') {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        payload.name = name.trim();
        payload.role = role.trim();
        payload.company = company.trim();
        payload.contact = contact.trim();
        payload.message = message.trim();
      } else if (loginMode === 'guest') {
        payload.name = 'Guest Visitor';
        payload.role = 'Guest Explorer';
        payload.company = 'Independent';
      } else if (loginMode === 'admin') {
        if (!adminPassword.trim()) {
          setError('Please enter admin passcode');
          setIsLoading(false);
          return;
        }
        payload.adminPassword = adminPassword.trim();
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (loginMode === 'admin') {
          setError('Incorrect passcode. Try "2026".');
        } else {
          setError(data.error || 'Failed to sign in');
        }
        setIsLoading(false);
        return;
      }

      // Success
      sounds.playUnlockChime();
      setCurrentUser(data.session);
      unlockScreen();
      if (onUnlock) onUnlock();
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Connection failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickGuestLogin = () => {
    setLoginMode('guest');
    setIsLoading(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isGuest: true, name: 'Guest Explorer', role: 'Visitor', company: 'Community' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentUser(data.session);
          unlockScreen();
          if (onUnlock) onUnlock();
        }
      })
      .catch(() => {
        // Local fallback
        setCurrentUser({
          id: 'guest-local',
          name: 'Guest Explorer',
          role: 'Visitor',
          company: 'Community',
          isGuest: true,
          isAdmin: false,
          loginTime: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        });
        unlockScreen();
        if (onUnlock) onUnlock();
      })
      .finally(() => setIsLoading(false));
  };

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99998] flex flex-col justify-between overflow-hidden select-none bg-cover bg-center"
        style={{
          backgroundImage: `url('/custom-wallpaper.jpg')`,
        }}
      >
        {/* Subtle Blur & Vignette Backdrop */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[16px] backdrop-saturate-150" />

        {/* Lock Screen Top Menu Bar */}
        <div className="relative z-20 flex items-center justify-between px-6 py-3 text-white/90 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <APLogo className="w-5 h-5" variant="light" glow={true} />
            <span className="font-semibold tracking-wide">Anugamya Portfolio OS</span>
          </div>

          <div className="flex items-center space-x-3 text-white/80">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
            <span className="font-mono text-[11px]">{currentTime.timeStr}</span>
          </div>
        </div>

        {/* Center Clock and Login Modal */}
        <div className="relative z-20 flex flex-col items-center justify-center -mt-6 px-4">
          {/* Big macOS Sonoma Clock */}
          <div className="text-center mb-6">
            <h1 className="text-6xl md:text-7xl font-light text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              {currentTime.timeStr}
            </h1>
            <p className="text-sm md:text-base text-white/90 font-medium tracking-wide mt-1 drop-shadow-sm">
              {currentTime.dateStr}
            </p>
          </div>

          {/* Login Card Surface */}
          <div className="liquid-glass-card w-full max-w-[440px] p-6 text-slate-900 border border-white/40 shadow-2xl backdrop-blur-2xl bg-white/75 rounded-3xl">
            {/* Profile Avatar & Header */}
            <div className="relative z-10 flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-xl flex items-center justify-center mb-2">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <APLogo className="w-10 h-7" variant="dark" />
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900">
                {loginMode === 'admin'
                  ? 'Administrator Access'
                  : loginMode === 'guest'
                  ? 'Instant Guest Access'
                  : 'Visitor Sign-Up & Login'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {loginMode === 'admin'
                  ? 'Enter owner passcode to manage analytics'
                  : 'Create your visitor profile to record your session & explore the OS'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="relative z-10 grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl mb-4 text-xs font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('visitor');
                  setError(null);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  loginMode === 'visitor'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('guest');
                  setError(null);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  loginMode === 'guest'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Quick Guest
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setError(null);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  loginMode === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Owner
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative z-10 mb-3 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Forms */}
            {loginMode === 'visitor' && (
              <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Your Name *</label>
                  <div className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner">
                    <User className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Sundar Pichai, Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role / Title</label>
                    <div className="flex items-center px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-500 transition-all shadow-inner">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Recruiter / Dev"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Company / Org</label>
                    <div className="flex items-center px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-500 transition-all shadow-inner">
                      <Building className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Google / Self"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Quick Note to Anugamya (Optional)</label>
                  <div className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus-within:border-blue-500 transition-all shadow-inner">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Loved Bharat Dekho! Let's connect."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                >
                  <span>{isLoading ? 'Signing In...' : 'Sign In & Enter Portfolio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {loginMode === 'guest' && (
              <div className="relative z-10 space-y-3 text-center py-2">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Enter immediately without typing personal details. You can explore all macOS apps, WebGL graphics, and projects freely.
                </p>
                <button
                  type="button"
                  onClick={handleQuickGuestLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? 'Entering...' : 'Instant One-Click Guest Access'}</span>
                </button>
              </div>
            )}

            {loginMode === 'admin' && (
              <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Admin Passcode</label>
                  <div className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
                    <KeyRound className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                    <input
                      type="password"
                      placeholder="Enter owner passcode ('2026')"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>{isLoading ? 'Verifying...' : 'Unlock Administrator Console'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lock Screen Bottom Footer */}
        <div className="relative z-20 text-center pb-5 text-[11px] text-white/75 font-mono">
          <span>Press Enter to submit • Anugamya Portfolio OS v1.0 • Node.js Engine</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MacOSLockScreen;
