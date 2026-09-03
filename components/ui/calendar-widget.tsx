'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  if (!currentDate) {
    return (
      <div className="w-48 h-48 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Previous month padding days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevPadding = Array.from({ length: firstDayIndex }, (_, i) => prevMonthDays - firstDayIndex + i + 1);

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month padding to fill out a 35 or 42 grid
  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
  const nextPaddingCount = totalCells - (firstDayIndex + daysInMonth);
  const nextPadding = Array.from({ length: nextPaddingCount }, (_, i) => i + 1);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <LiquidGlassCard
      cornerRadius={28}
      displacementScale={65}
      blurAmount={0.08}
      saturation={140}
      aberrationIntensity={1.8}
      elasticity={0.2}
      className="w-48 p-3.5 text-slate-900 dark:text-slate-100 select-none flex flex-col justify-between transition-colors dark:bg-slate-900/80 dark:border-slate-700/80"
    >
      {/* Header: Month & Navigation */}
      <div className="relative z-10 flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700">
        <div className="flex items-center space-x-1.5">
          <img src="/icons/calendar.png" alt="" className="w-4 h-4 rounded object-cover shadow-2xs" />
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">
            {monthNames[month].slice(0, 3)}
          </span>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{year}</span>
        </div>

        <div className="flex items-center space-x-0.5">
          <button
            onClick={handlePrevMonth}
            className="p-0.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-0.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 text-center pt-1.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      {/* Monthly Days Grid */}
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px] font-medium pt-1">
        {/* Previous Month Days */}
        {prevPadding.map((d, i) => (
          <div key={`prev-${i}`} className="text-slate-300 dark:text-slate-600 py-0.5">
            {d}
          </div>
        ))}

        {/* Current Month Days */}
        {currentMonthDays.map((d) => {
          const activeToday = isToday(d);
          return (
            <div key={`curr-${d}`} className="flex items-center justify-center py-0.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  activeToday
                    ? 'bg-red-500 text-white font-bold shadow-sm scale-110'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {d}
              </span>
            </div>
          );
        })}

        {/* Next Month Days */}
        {nextPadding.map((d, i) => (
          <div key={`next-${i}`} className="text-slate-300 dark:text-slate-600 py-0.5">
            {d}
          </div>
        ))}
      </div>
    </LiquidGlassCard>
  );
};

export default CalendarWidget;
