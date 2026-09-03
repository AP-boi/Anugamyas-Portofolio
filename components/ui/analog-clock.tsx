'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export const AnalogClockWidget: React.FC = memo(() => {
  const [time, setTime] = useState<Date | null>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setTime(new Date());

    let lastMinute = -1;

    const tick = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() + minutes / 60;

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6;
      const hourDeg = (hours % 12) * 30;

      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${secondDeg}deg)`;
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      }
      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${hourDeg}deg)`;
      }

      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        setTime(new Date(now));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!time) {
    return (
      <div className="w-48 h-48 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const hours = time.getHours();
  const mins = time.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const dayShorts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${dayShorts[time.getDay()]}, ${monthShorts[time.getMonth()]} ${time.getDate()}`;

  return (
    <LiquidGlassCard
      cornerRadius={28}
      displacementScale={65}
      blurAmount={0.08}
      saturation={140}
      aberrationIntensity={1.8}
      elasticity={0.2}
      className="w-48 p-4 text-slate-900 dark:text-slate-100 select-none flex flex-col items-center justify-between transition-colors dark:bg-slate-900/80 dark:border-slate-700/80"
    >
      {/* Analog Clock Dial */}
      <div className="relative z-10 w-28 h-28 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-inner flex items-center justify-center">
        {/* Hour Markers (12, 3, 6, 9 emphasized) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <div
            key={deg}
            className="absolute inset-0 flex justify-center p-1"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div
              className={`rounded-full ${
                i % 3 === 0 ? 'w-1 h-2 bg-slate-800 dark:bg-slate-200' : 'w-0.5 h-1 bg-slate-400/80 dark:bg-slate-500'
              }`}
            />
          </div>
        ))}

        {/* Hour Hand — driven by direct DOM ref, not React state */}
        <div
          ref={hourHandRef}
          className="absolute w-1 bg-slate-900 dark:bg-slate-100 rounded-full origin-bottom z-10 shadow-sm"
          style={{
            height: '28px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Minute Hand */}
        <div
          ref={minuteHandRef}
          className="absolute w-0.5 bg-slate-800 dark:bg-slate-200 rounded-full origin-bottom z-20 shadow-sm"
          style={{
            height: '38px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Second Hand — smooth continuous sweep via requestAnimationFrame */}
        <div
          ref={secondHandRef}
          className="absolute w-0.5 bg-rose-500 rounded-full origin-bottom z-30"
          style={{
            height: '46px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Center Pin */}
        <div className="relative z-40 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-xs" />
      </div>

      {/* Digital Readout Subtitle */}
      <div className="relative z-10 mt-3 text-center">
        <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          {formattedHours}:{formattedMins}{' '}
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{ampm}</span>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5">
          {dateStr}
        </div>
      </div>
    </LiquidGlassCard>
  );
});

AnalogClockWidget.displayName = 'AnalogClockWidget';

export default AnalogClockWidget;
