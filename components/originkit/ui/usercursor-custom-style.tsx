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
  color: "#FF8C8C",
  size: 32,
  pressScale: 1.1,
  offsetX: 0,
  offsetY: 0,
  showLabel: true,
  name: "Anugamya",
  textColor: "#FFFFFF",
  labelTiltStrength: 30,
  labelOffsetUseDefault: true,
  labelOffsetX: 25,
  labelOffsetY: 12,
};

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

  // Spring physics
  const arrowSpring = useMemo<SpringOptions>(
    () => ({ stiffness: 450, damping: 30, mass: 0.5 }),
    []
  );
  const labelSpringCfg = useMemo<SpringOptions>(
    () => ({ stiffness: 260, damping: 24, mass: 0.6 }),
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
    stiffness: 220,
    damping: 22,
    mass: 0.5,
  });

  const lastSampleRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // Global mouse tracking across full viewport
  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") return;

    // Apply global CSS rule to hide default cursor while component is mounted
    const styleTag = document.createElement("style");
    styleTag.id = "originkit-usercursor-style";
    styleTag.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleTag);

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

      mouseX.set(x + offsetX);
      mouseY.set(y + offsetY);

      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * labelTiltStrength);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setHovering(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      const existing = document.getElementById("originkit-usercursor-style");
      if (existing) existing.remove();
    };
  }, [isTouchDevice, offsetX, offsetY, mouseX, mouseY, labelTiltTarget, labelTiltStrength]);

  const labelTranslateX = useTransform(labelX, (v) => v + (labelOffsetUseDefault ? size * 0.9 : labelOffsetX));
  const labelTranslateY = useTransform(labelY, (v) => v + (labelOffsetUseDefault ? size * 0.2 + 6 : labelOffsetY));

  const arrowContent = useMemo(() => {
    if (typeof arrow === "function") return arrow(color);
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
          fill={color}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </svg>
    );
  }, [arrow, color, size]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Label trailing pill */}
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
            background: color,
            borderRadius: 999,
            padding: `${size * 0.18}px ${size * 0.36}px`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)",
            opacity: hovering ? 1 : 0,
            transformOrigin: "0% 50%",
            transition: "opacity 140ms ease",
            willChange: "transform, opacity",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div
            className={classNames?.labelText}
            style={{
              color: textColor,
              fontSize: Math.max(9, size * 0.42),
              lineHeight: 1.1,
              fontWeight: 700,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              whiteSpace: "nowrap",
              letterSpacing: 0.2,
            }}
          >
            {label || name}
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
