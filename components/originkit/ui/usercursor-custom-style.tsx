'use client';

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type SpringOptions,
} from "framer-motion";
import { useOSStore } from "@/store/useOSStore";

type ClassNames = {
  root?: string;
  cursor?: string;
  arrow?: string;
  label?: string;
  labelText?: string;
};

type Props = {
  name?: string;
  arrow?: React.ReactNode | ((color: string) => React.ReactNode);
  label?: React.ReactNode;
  color?: string;
  textColor?: string;
  size?: number;
  labelTiltStrength?: number;
  showLabel?: boolean;
  offsetX?: number;
  offsetY?: number;
  labelOffsetUseDefault?: boolean;
  labelOffsetX?: number;
  labelOffsetY?: number;
  pressScale?: number;
  offset?: { x?: number; y?: number };
  labelOffset?: { x?: number; y?: number };
  classNames?: ClassNames;
  style?: React.CSSProperties;
};

const COMPONENT_DEFAULTS = {
  color: "#3B82F6",
  size: 28,
  pressScale: 1.1,
  offsetX: 0,
  offsetY: 0,
  showLabel: true,
  name: "Anugamya",
  textColor: "#FFFFFF",
  labelTiltStrength: 24,
  labelOffsetUseDefault: true,
  labelOffsetX: 22,
  labelOffsetY: 10,
};

export const VIBRANT_PASTEL_PALETTE = [
  { bg: "#38bdf8", text: "#0f172a", name: "Sky Blue" },
  { bg: "#c084fc", text: "#0f172a", name: "Lilac Lavender" },
  { bg: "#f472b6", text: "#0f172a", name: "Blush Rose" },
  { bg: "#fb923c", text: "#0f172a", name: "Vibrant Peach" },
  { bg: "#34d399", text: "#0f172a", name: "Mint Emerald" },
  { bg: "#2dd4bf", text: "#0f172a", name: "Pastel Turquoise" },
  { bg: "#facc15", text: "#0f172a", name: "Sun Butter" },
  { bg: "#a78bfa", text: "#0f172a", name: "Soft Violet" },
  { bg: "#fb7185", text: "#0f172a", name: "Coral Rose" },
  { bg: "#4ade80", text: "#0f172a", name: "Spring Lime" },
];

export function UserCursor(props: Props) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const {
    name,
    arrow,
    label,
    color,
    textColor,
    size,
    labelTiltStrength,
    showLabel,
    offsetX,
    offsetY,
    labelOffsetX,
    labelOffsetY,
    labelOffsetUseDefault,
    pressScale,
    classNames,
  } = mergedProps;

  const { currentUser, isLocked } = useOSStore();
  const displayName = currentUser?.name ? currentUser.name.split(' ')[0] : (label || name);

  // Randomized Vibrant Pastel Color state
  const [paletteIndex, setPaletteIndex] = useState(() =>
    Math.floor(Math.random() * VIBRANT_PASTEL_PALETTE.length)
  );

  const activeColor = props.color || VIBRANT_PASTEL_PALETTE[paletteIndex].bg;
  const activeTextColor = props.textColor || VIBRANT_PASTEL_PALETTE[paletteIndex].text;

  const randomizeColor = React.useCallback(() => {
    setPaletteIndex((prev) => {
      let next = Math.floor(Math.random() * VIBRANT_PASTEL_PALETTE.length);
      while (next === prev && VIBRANT_PASTEL_PALETTE.length > 1) {
        next = Math.floor(Math.random() * VIBRANT_PASTEL_PALETTE.length);
      }
      return next;
    });
  }, []);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  // Spring physics tuned for buttery smooth tracking
  const arrowSpring = useMemo<SpringOptions>(
    () => ({ stiffness: 600, damping: 36, mass: 0.4 }),
    []
  );
  const labelSpringCfg = useMemo<SpringOptions>(
    () => ({ stiffness: 320, damping: 28, mass: 0.5 }),
    []
  );

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const arrowX = useSpring(mouseX, arrowSpring);
  const arrowY = useSpring(mouseY, arrowSpring);
  const labelX = useSpring(mouseX, labelSpringCfg);
  const labelY = useSpring(mouseY, labelSpringCfg);

  const scaleMV = useMotionValue(1);
  useEffect(() => {
    const controls = animate(scaleMV, pressed ? pressScale : 1, {
      type: "spring",
      stiffness: 500,
      damping: 28,
      mass: 0.5,
    });
    return () => controls.stop();
  }, [pressed, pressScale, scaleMV]);

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, {
    stiffness: 240,
    damping: 24,
    mass: 0.5,
  });

  const lastSampleRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // Global mouse tracking across full viewport with rAF throttle
  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") {
      const existing = document.getElementById("originkit-usercursor-style");
      if (existing) existing.remove();
      return;
    }

    const styleTag = document.createElement("style");
    styleTag.id = "originkit-usercursor-style";
    styleTag.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleTag);

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let isDirty = false;

    const flushMove = () => {
      rafId = 0;
      mouseX.set(pendingX + offsetX);
      mouseY.set(pendingY + offsetY);
      isDirty = false;
    };

    const onMove = (e: MouseEvent) => {
      setHovering(true);
      const x = e.clientX;
      const y = e.clientY;

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const last = lastSampleRef.current;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSampleRef.current = { x, y, t: now };

      pendingX = x;
      pendingY = y;
      if (!isDirty) {
        isDirty = true;
        rafId = requestAnimationFrame(flushMove);
      }

      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * labelTiltStrength);
    };

    const onDown = () => {
      setPressed(true);
      randomizeColor();
    };
    const onUp = () => setPressed(false);
    const onLeave = () => setHovering(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      const existing = document.getElementById("originkit-usercursor-style");
      if (existing) existing.remove();
    };
  }, [isTouchDevice, offsetX, offsetY, mouseX, mouseY, labelTiltTarget, labelTiltStrength, randomizeColor]);

  const labelTranslateX = useTransform(labelX, (v) => v + (labelOffsetUseDefault ? size * 0.9 : labelOffsetX));
  const labelTranslateY = useTransform(labelY, (v) => v + (labelOffsetUseDefault ? size * 0.2 + 6 : labelOffsetY));

  const arrowContent = useMemo(() => {
    if (typeof arrow === "function") return arrow(activeColor);
    if (arrow) return arrow;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d="M5 3 L23 14 L14 16 L11 24 Z"
          fill={activeColor}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={1.2}
          strokeLinejoin="round"
          style={{
            transition: "fill 250ms ease",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
          }}
        />
      </svg>
    );
  }, [arrow, activeColor, size]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      {/* Label trailing pill with dynamic visitor name */}
      {showLabel && (
        <motion.div
          className={classNames?.label}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            x: labelTranslateX,
            y: labelTranslateY,
            rotate: labelRotation,
            scale: scaleMV,
            background: activeColor,
            borderRadius: 999,
            padding: `${size * 0.18}px ${size * 0.36}px`,
            boxShadow: `0 4px 14px ${activeColor}55, 0 1px 3px rgba(0,0,0,0.1)`,
            opacity: hovering ? 1 : 0,
            transformOrigin: "0% 50%",
            transition: "background 250ms ease, box-shadow 250ms ease, opacity 140ms ease",
            willChange: "transform, opacity",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div
            className={classNames?.labelText}
            style={{
              color: activeTextColor,
              fontSize: Math.max(9, size * 0.42),
              lineHeight: 1.1,
              fontWeight: 700,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              whiteSpace: "nowrap",
              letterSpacing: 0.2,
              transition: "color 250ms ease",
            }}
          >
            {displayName}
          </div>
        </motion.div>
      )}

      {/* Pointer Arrow */}
      <motion.div
        className={classNames?.cursor}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: arrowX,
          y: arrowY,
          scale: scaleMV,
          width: size,
          height: size,
          opacity: hovering ? 1 : 0,
          transformOrigin: "0% 0%",
          transition: "opacity 140ms ease",
          willChange: "transform, opacity",
          pointerEvents: "none",
        }}
      >
        <div className={classNames?.arrow} style={{ width: size, height: size }}>
          {arrowContent}
        </div>
      </motion.div>
    </div>
  );
}

export default UserCursor;
