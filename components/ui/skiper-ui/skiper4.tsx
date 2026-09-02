"use client";

import { motion } from "framer-motion";
import { GripHorizontal, RefreshCcw } from "lucide-react";
import React, { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
  isDark?: boolean;
  onToggle?: (isDark: boolean) => void;
  title?: string;
}

//..................................................... //
// Theme Toggle Button 1: Dual Yin-Yang Rotating Eclipse
export const ThemeToggleButton1 = ({
  className = "",
  isDark: controlledDark,
  onToggle,
  title = "Toggle Light / Dark Theme",
}: ThemeToggleProps) => {
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark !== undefined ? controlledDark : internalDark;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isDark);
    } else {
      setInternalDark(!isDark);
    }
  };

  return (
    <motion.button
      type="button"
      title={title}
      aria-label={title}
      whileHover={{ scale: 1.15, rotate: isDark ? -15 : 15 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={cn(
        "rounded-full bg-slate-950 dark:bg-slate-900 border border-slate-700/60 dark:border-white/30 text-white cursor-pointer flex items-center justify-center p-0.5 shadow-xs hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-shadow",
        className,
      )}
      onClick={handleToggle}
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          style={{ transformOrigin: "120px 120px" }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="white"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="#0f172a"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          style={{ transformOrigin: "120px 120px" }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="white"
        />
      </svg>
    </motion.button>
  );
};

//..................................................... //
// Theme Toggle Button 2: Sun-to-Moon Morph with Rotating Sunburst Rays
export const ThemeToggleButton2 = ({
  className = "",
  isDark: controlledDark,
  onToggle,
  title = "Toggle Light / Dark Theme",
}: ThemeToggleProps) => {
  const clipId = useId().replace(/:/g, "");
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark !== undefined ? controlledDark : internalDark;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isDark);
    } else {
      setInternalDark(!isDark);
    }
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center p-1.5",
        isDark ? "bg-slate-900 text-amber-300 border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]" : "bg-white text-slate-800 border border-slate-300 shadow-sm",
        className,
      )}
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="w-full h-full"
      >
        <clipPath id={`skiper-btn-2-${clipId}`}>
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath={`url(#skiper-btn-2-${clipId})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
};

//..................................................... //
// Theme Toggle Button 3: Dotted Orbit to Crescent
export const ThemeToggleButton3 = ({
  className = "",
  isDark: controlledDark,
  onToggle,
  title = "Toggle Light / Dark Theme",
}: ThemeToggleProps) => {
  const clipId = useId().replace(/:/g, "");
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark !== undefined ? controlledDark : internalDark;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isDark);
    } else {
      setInternalDark(!isDark);
    }
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center p-1.5",
        isDark ? "bg-slate-900 text-cyan-300 border border-cyan-400/30" : "bg-white text-slate-800 border border-slate-300",
        className,
      )}
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="w-full h-full"
      >
        <clipPath id={`skiper-btn-3-${clipId}`}>
          <motion.path
            animate={{ y: isDark ? 14 : 0, x: isDark ? -11 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-11h25a1 1 0 0017 13v30H0Z"
          />
        </clipPath>
        <g clipPath={`url(#skiper-btn-3-${clipId})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
};

//..................................................... //
// Theme Toggle Button 4: Filament Bulb Line-Draw
export const ThemeToggleButton4 = ({
  className = "",
  isDark: controlledDark,
  onToggle,
  title = "Toggle Light / Dark Theme",
}: ThemeToggleProps) => {
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark !== undefined ? controlledDark : internalDark;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isDark);
    } else {
      setInternalDark(!isDark);
    }
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center p-1.5",
        isDark ? "bg-slate-900 text-yellow-300 border border-yellow-400/30" : "bg-white text-slate-800 border border-slate-300",
        className,
      )}
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        strokeWidth="0.7"
        stroke="currentColor"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="w-full h-full"
      >
        <path
          strokeWidth="0"
          d="M9.4 9.9c1.8-1.8 4.1-2.7 6.6-2.7 5.1 0 9.3 4.2 9.3 9.3 0 2.3-.8 4.4-2.3 6.1-.7.8-2 2.8-2.5 4.4 0 .2-.2.4-.5.4-.2 0-.4-.2-.4-.5v-.1c.5-1.8 2-3.9 2.7-4.8 1.4-1.5 2.1-3.5 2.1-5.6 0-4.7-3.7-8.5-8.4-8.5-2.3 0-4.4.9-5.9 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.1.7 4 2.1 5.6.8.9 2.2 2.9 2.7 4.9 0 .2-.1.5-.4.5h-.1c-.2 0-.4-.1-.4-.4-.5-1.7-1.8-3.7-2.5-4.5-1.5-1.7-2.3-3.9-2.3-6.1 0-2.3 1-4.7 2.7-6.5z"
        />
        <path d="M19.8 28.3h-7.6" />
        <path d="M19.8 29.5h-7.6" />
        <path d="M19.8 30.7h-7.6" />
        <motion.path
          animate={{
            pathLength: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ ease: "easeInOut", duration: 0.35 }}
          pathLength="1"
          fill="none"
          d="M14.6 27.1c0-3.4 0-6.8-.1-10.2-.2-1-1.1-1.7-2-1.7-1.2-.1-2.3 1-2.2 2.3.1 1 .9 1.9 2.1 2h7.2c1.1-.1 2-1 2.1-2 .1-1.2-1-2.3-2.2-2.3-.9 0-1.7.7-2 1.7 0 3.4 0 6.8-.1 10.2"
        />
        <motion.g
          animate={{
            scale: isDark ? 0.5 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ ease: "easeInOut", duration: 0.35 }}
        >
          <path pathLength="1" d="M16 6.4V1.3" />
          <path pathLength="1" d="M26.3 15.8h5.1" />
          <path pathLength="1" d="m22.6 9 3.7-3.6" />
          <path pathLength="1" d="M9.4 9 5.7 5.4" />
          <path pathLength="1" d="M5.7 15.8H.6" />
        </motion.g>
      </svg>
    </button>
  );
};

//..................................................... //
// Theme Toggle Button 5: Smooth Crescent Eclipse Slide
export const ThemeToggleButton5 = ({
  className = "",
  isDark: controlledDark,
  onToggle,
  title = "Toggle Light / Dark Theme",
}: ThemeToggleProps) => {
  const clipId = useId().replace(/:/g, "");
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark !== undefined ? controlledDark : internalDark;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isDark);
    } else {
      setInternalDark(!isDark);
    }
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center p-1.5",
        isDark ? "bg-slate-900 text-indigo-300 border border-indigo-400/30" : "bg-white text-slate-800 border border-slate-300",
        className,
      )}
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 32 32"
        className="w-full h-full"
      >
        <clipPath id={`skiper-btn-4-${clipId}`}>
          <motion.path
            animate={{ y: isDark ? 5 : 0, x: isDark ? -20 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h55v37h-55zm32 12a1 1 0 0025 0 1 1 0 00-25 0"
          />
        </clipPath>
        <g clipPath={`url(#skiper-btn-4-${clipId})`}>
          <circle cx="16" cy="16" r="15" />
        </g>
      </svg>
    </button>
  );
};

// Interactive Skiper4 Showcase Component
export const Skiper4 = () => {
  const [scale, setScale] = useState(0);
  const [gap, setGap] = useState(0);
  const [flexDirection, setFlexDirection] = useState("row");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6">
      <motion.div
        className="relative flex items-center justify-center gap-2"
        animate={{
          gap: gap ? `${gap}px` : "8px",
          scale: scale ? `${scale / 20}` : "1",
        }}
        style={{
          flexDirection: flexDirection === "column" ? "column" : "row",
        }}
        transition={{ duration: 0.35 }}
      >
        <motion.div layout>
          <ThemeToggleButton1 className="size-11" />
        </motion.div>
        <motion.div layout>
          <ThemeToggleButton2 className="size-11" />
        </motion.div>
        <motion.div layout>
          <ThemeToggleButton3 className="size-11" />
        </motion.div>
        <motion.div layout>
          <ThemeToggleButton4 className="size-11" />
        </motion.div>
        <motion.div layout>
          <ThemeToggleButton5 className="size-11" />
        </motion.div>
      </motion.div>

      {/* Interactive Options Controls */}
      <Options
        scale={scale}
        setScale={setScale}
        gap={gap}
        setGap={setGap}
        setFlexDirection={setFlexDirection}
      />
    </div>
  );
};

type OptionsProps = {
  scale: number;
  setScale: (value: number) => void;
  gap: number;
  setGap: (value: number) => void;
  setFlexDirection: (value: string) => void;
};

const Options = ({
  scale,
  setScale,
  gap,
  setGap,
  setFlexDirection,
}: OptionsProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className="border-slate-300 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 shadow-xl flex w-[245px] flex-col gap-3 rounded-3xl border p-3.5 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs"
      drag={isDragging}
      dragMomentum={false}
    >
      <div className="flex items-center justify-between">
        <span
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="size-4 cursor-grab active:cursor-grabbing"
        >
          <GripHorizontal className="size-4 opacity-50" />
        </span>

        <p
          onClick={() => {
            setScale(0);
            setGap(0);
            setFlexDirection("row");
          }}
          className="hover:bg-slate-100 dark:hover:bg-slate-800 group flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1 text-xs opacity-75 hover:opacity-100 transition-all"
        >
          Reset
          <span className="group-active:-rotate-360 rotate-0 cursor-pointer transition-all duration-300 group-hover:rotate-90">
            <RefreshCcw className="size-3.5 opacity-50" />
          </span>
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="opacity-70">Scale</span>
          <input
            type="range"
            min={0}
            max={100}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-[120px] h-1.5 cursor-pointer accent-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="opacity-70">Gap</span>
          <input
            type="range"
            min={0}
            max={100}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-[120px] h-1.5 cursor-pointer accent-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
          <span className="opacity-70">Layout</span>
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:opacity-100"
              onClick={() => setFlexDirection("column")}
            >
              Column
            </button>
            <button
              className="cursor-pointer px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:opacity-100"
              onClick={() => setFlexDirection("row")}
            >
              Row
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Skiper4;
