'use client';

import React, { useEffect, useRef, useState, memo } from 'react';

export const AnalogClockWidget: React.FC = memo(() => {
  const [time, setTime] = useState<Date | null>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setTime(new Date());

    // Use rAF-driven updates for the second hand (smooth sweep)
    // and only update state once per minute for the digital readout
    let lastMinute = -1;

    const tick = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() + minutes / 60;

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6;
      const hourDeg = (hours % 12) * 30;

      // Direct DOM mutations — bypasses React reconciliation entirely
      if (secondHandRef.current) secondHandRef.current.style.transform = `rotate(${secondDeg}deg)`;
      if (minuteHandRef.current) minuteHandRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (hourHandRef.current) hourHandRef.current.style.transform = `rotate(${hourDeg}deg)`;

      // Only trigger React re-render when minute changes (for digital readout)
      const currentMinute = now.getMinutes();
      if (currentMinute !== lastMinute) {
        lastMinute = currentMinute;
        setTime(new Date());
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!time) {
    return (
      <div className="w-48 h-48 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-xl flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();

  const formattedHours = hours % 12 || 12;
  const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const dayShorts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${dayShorts[time.getDay()]}, ${monthShorts[time.getMonth()]} ${time.getDate()}`;

  return (
    <div className="liquid-glass-card w-48 p-4 text-slate-900 select-none flex flex-col items-center justify-between">
      {/* Analog Clock Dial */}
      <div className="relative z-10 w-28 h-28 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-inner flex items-center justify-center">
        {/* Hour Markers (12, 3, 6, 9 emphasized) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <div
            key={deg}
            className="absolute inset-0 flex justify-center p-1"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div
              className={`rounded-full ${
                i % 3 === 0 ? 'w-1 h-2 bg-slate-800' : 'w-0.5 h-1 bg-slate-400/80'
              }`}
            />
          </div>
        ))}

        {/* Hour Hand — driven by direct DOM ref, not React state */}
        <div
          ref={hourHandRef}
          className="absolute w-1 bg-slate-900 rounded-full origin-bottom z-10 shadow-sm"
          style={{
            height: '28px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Minute Hand */}
        <div
          ref={minuteHandRef}
          className="absolute w-0.5 bg-slate-800 rounded-full origin-bottom z-20 shadow-sm"
          style={{
            height: '38px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Second Hand (Signature macOS Red / Orange) — smooth sweep via rAF */}
        <div
          ref={secondHandRef}
          className="absolute w-0.5 bg-orange-500 rounded-full origin-bottom z-30"
          style={{
            height: '42px',
            bottom: '50%',
            willChange: 'transform',
          }}
        />

        {/* Center Pivot Point */}
        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white z-40 shadow-sm" />
      </div>

      {/* Digital Time & Date Label below clock */}
      <div className="flex flex-col items-center mt-2.5">
        <div className="flex items-baseline space-x-1">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            {formattedHours}:{formattedMins}
          </span>
          <span className="text-[10px] font-bold text-blue-600">{ampm}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium mt-0.5">{dateStr}</span>
      </div>
    </div>
  );
});

AnalogClockWidget.displayName = 'AnalogClockWidget';

export default AnalogClockWidget;
