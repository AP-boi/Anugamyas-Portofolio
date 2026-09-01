'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Check, User, Briefcase, Building, Mail, KeyRound, CornerDownLeft } from 'lucide-react';
import { sounds } from '@/lib/soundEngine';

export interface VanishFormProps {
  placeholders?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  value?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
}

export const VanishForm: React.FC<VanishFormProps> = ({
  placeholders = ['Enter your name to explore...', 'Enter your role / company...', 'Type anything to unlock...'],
  onChange,
  onSubmit,
  value: controlledValue,
  type = 'text',
  placeholder,
  className = '',
  wrapperClassName = '',
  icon,
  buttonText,
  disabled = false,
  autoFocus = false,
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [internalValue, setInternalValue] = useState('');
  const [animating, setAnimating] = useState(false);

  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Cycle through placeholders if multiple provided
  useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [placeholders]);

  // Particle Disintegration Vanish Effect
  const triggerVanishParticles = useCallback(
    (textToVanish: string, onComplete?: () => void) => {
      const canvas = canvasRef.current;
      const input = inputRef.current;
      if (!canvas || !input || !textToVanish) {
        if (onComplete) onComplete();
        return;
      }

      const rect = input.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const computed = window.getComputedStyle(input);
      ctx.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
      ctx.fillStyle = '#0f172a';
      ctx.textBaseline = 'middle';
      const paddingLeft = parseFloat(computed.paddingLeft) || 12;
      ctx.fillText(type === 'password' ? '•'.repeat(textToVanish.length) : textToVanish, paddingLeft, canvas.height / 2);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles: Particle[] = [];
      const data = imgData.data;
      const step = 2; // sample resolution

      const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 64) {
            particles.push({
              x,
              y,
              r: Math.random() * 2 + 1,
              color: colors[Math.floor(Math.random() * colors.length)],
              vx: (Math.random() - 0.5) * 5 + 1.2,
              vy: (Math.random() - 0.5) * 4 - 1.5,
              alpha: 1,
              life: Math.random() * 0.4 + 0.6,
            });
          }
        }
      }

      setAnimating(true);
      sounds.playClick();

      let startTime = performance.now();
      const duration = 750; // ms

      const render = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // subtle gravity
          p.alpha = Math.max(0, 1 - progress / p.life);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        if (progress < 1 && particles.some((p) => p.alpha > 0.05)) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setAnimating(false);
          if (onComplete) onComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(render);
    },
    [type]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || animating || disabled) return;

    const val = inputValue.trim();
    triggerVanishParticles(val, () => {
      if (onSubmit) onSubmit(val);
      if (controlledValue === undefined) setInternalValue('');
    });
  };

  return (
    <div className={`relative w-full ${wrapperClassName}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-300 dark:border-white/20 rounded-2xl shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 ${className}`}
      >
        {/* Leading Icon */}
        {icon && <div className="mr-2 text-slate-400 flex-shrink-0">{icon}</div>}

        {/* Input Field */}
        <div className="relative flex-1 overflow-hidden">
          <input
            ref={inputRef}
            type={type}
            value={inputValue}
            autoFocus={autoFocus}
            disabled={disabled || animating}
            onChange={(e) => {
              if (controlledValue === undefined) setInternalValue(e.target.value);
              if (onChange) onChange(e);
            }}
            placeholder=""
            className={`w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none relative z-10 transition-opacity ${
              animating ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Animated Cycling Placeholder */}
          {!inputValue && !animating && (
            <div className="absolute inset-0 pointer-events-none flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholder || currentPlaceholder}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="text-xs font-normal text-slate-400 truncate select-none"
                >
                  {placeholder || placeholders[currentPlaceholder]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          {/* Particle Animation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-20"
          />
        </div>

        {/* Submit Arrow Action Button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || animating || disabled}
          className="ml-2 w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer"
        >
          {buttonText ? (
            <span className="text-xs font-semibold px-2">{buttonText}</span>
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export interface DevouringLoginFormProps {
  onSuccess: (userData: { name: string; role: string; company: string; contact?: string; message?: string }) => void;
  onAdminLogin?: (pass: string) => void;
  className?: string;
}

export const DevouringLoginForm: React.FC<DevouringLoginFormProps> = ({
  onSuccess,
  onAdminLogin,
  className = '',
}) => {
  const [step, setStep] = useState<number>(0); // 0: Name, 1: Role/Company, 2: Message/Contact
  const [name, setName] = useState('');
  const [roleCompany, setRoleCompany] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleStepSubmit = (value: string) => {
    if (step === 0) {
      setName(value);
      setStep(1);
    } else if (step === 1) {
      setRoleCompany(value);
      setStep(2);
    } else if (step === 2) {
      setContactMsg(value);
      sounds.playUnlockChime();
      onSuccess({
        name: name || 'Guest Visitor',
        role: roleCompany.split('@')[0]?.trim() || 'Software Engineer / Visitor',
        company: roleCompany.split('@')[1]?.trim() || 'Tech Explorer',
        contact: value,
        message: value,
      });
    }
  };

  const stepMeta = [
    {
      title: 'What is your name?',
      subtitle: 'Personalize your portfolio session',
      icon: <User className="w-4 h-4 text-blue-500" />,
      placeholders: ['Sundar Pichai', 'Sam Altman', 'Jane Doe', 'Recruiter @ Tech'],
    },
    {
      title: 'Your Role or Organization?',
      subtitle: 'e.g. Senior Frontend Dev @ Google, Founder, Student',
      icon: <Briefcase className="w-4 h-4 text-purple-500" />,
      placeholders: ['Engineering Lead @ Apple', 'Founder @ Startup', 'Recruiter @ Meta'],
    },
    {
      title: 'Leave a note or contact info?',
      subtitle: 'Optional quick message for Anugamya (press enter to finish)',
      icon: <Mail className="w-4 h-4 text-emerald-500" />,
      placeholders: ['loved the 3D portfolio!', 'email@domain.com', 'hiring for frontend'],
    },
  ];

  const current = stepMeta[step];

  return (
    <div className={`w-full max-w-[420px] p-6 bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl space-y-4 ${className}`}>
      {/* Progress Dots */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1.5">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-6 bg-blue-600'
                  : s < step
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-slate-400">Step {step + 1} of 3</span>
      </div>

      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {current.icon}
          <span>{current.title}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{current.subtitle}</p>
      </div>

      {/* Vanishing Form Input */}
      <VanishForm
        key={step}
        autoFocus
        placeholders={current.placeholders}
        onSubmit={handleStepSubmit}
        buttonText={step === 2 ? 'Unlock' : undefined}
      />

      {/* Helper text */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
        <span>Press ↵ Enter to submit</span>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="hover:text-blue-500 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default function Skiper56Demo() {
  const [submittedData, setSubmittedData] = useState<any>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 space-y-8 bg-slate-950 text-white rounded-3xl border border-white/15">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>Skiper UI — Vanish Form / Devouring Details (skiper56)</span>
        </h3>
        <p className="text-xs text-white/60">
          Canvas particle disintegration vanishing text on form submission
        </p>
      </div>

      <DevouringLoginForm
        onSuccess={(data) => setSubmittedData(data)}
        className="mx-auto"
      />

      {submittedData && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 text-center space-y-1 max-w-sm"
        >
          <div className="font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Authenticated Successfully</span>
          </div>
          <p className="text-[11px] text-white/80">
            Welcome, <b>{submittedData.name}</b> ({submittedData.role} • {submittedData.company})
          </p>
        </motion.div>
      )}
    </div>
  );
}
