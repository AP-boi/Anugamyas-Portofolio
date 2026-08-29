'use client';

import { useState, useEffect } from 'react';

export interface SystemTimeInfo {
  timeStr: string;
  ampm: string;
  dayStr: string;
  monthStr: string;
  dateNum: string;
  weekdayFull: string;
  menuDate: string;
  fullDateStr: string;
}

export function useSystemTime(): SystemTimeInfo {
  const [timeInfo, setTimeInfo] = useState<SystemTimeInfo>(() => formatTime(new Date()));

  useEffect(() => {
    const tick = () => setTimeInfo(formatTime(new Date()));
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  return timeInfo;
}

function formatTime(date: Date): SystemTimeInfo {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMins = mins < 10 ? `0${mins}` : mins;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayShorts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = dayNames[date.getDay()];
  const dayShort = dayShorts[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const monthShort = monthShorts[date.getMonth()];
  const dayOfMonth = date.getDate();

  return {
    timeStr: `${formattedHours}:${formattedMins}`,
    ampm,
    dayStr: `${dayShort}, ${monthShort} ${dayOfMonth}`,
    monthStr: monthName.toUpperCase(),
    dateNum: String(dayOfMonth),
    weekdayFull: dayName,
    menuDate: `${dayShort} ${monthShort} ${dayOfMonth} ${formattedHours}:${formattedMins} ${ampm}`,
    fullDateStr: `${dayName}, ${monthName} ${dayOfMonth}`,
  };
}
