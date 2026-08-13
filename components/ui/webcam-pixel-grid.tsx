"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type WebcamPixelGridProps = {
  /** Number of columns in the grid */
  gridCols?: number;
  /** Number of rows in the grid */
  gridRows?: number;
  /** Maximum elevation for motion detection */
  maxElevation?: number;
  /** Motion sensitivity (0-1) */
  motionSensitivity?: number;
  /** Smoothing factor for elevation transitions */
  elevationSmoothing?: number;
  /** Color mode: 'webcam' uses actual colors, 'monochrome' uses single color */
  colorMode?: "webcam" | "monochrome";
  /** Base color when in monochrome mode */
  monochromeColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Whether to mirror the webcam feed */
  mirror?: boolean;
  /** Gap between cells (0-1, fraction of cell size) */
  gapRatio?: number;
  /** Invert the colors */
  invertColors?: boolean;
  /** Darken factor (0-1, 0 = no darkening, 1 = fully dark) */
  darken?: number;
  /** Border color for cells */
  borderColor?: string;
  /** Border opacity (0-1) */
  borderOpacity?: number;
  /** Additional class name */
  className?: string;
  /** Callback when webcam access is denied */
  onWebcamError?: (error: Error) => void;
  /** Callback when webcam is ready */
  onWebcamReady?: () => void;
};

type PixelData = {
  r: number;
  g: number;
  b: number;
  motion: number;
  targetElevation: number;
  currentElevation: number;
};

export const WebcamPixelGrid: React.FC<WebcamPixelGridProps> = ({
  gridCols = 60,
  gridRows = 40,
  maxElevation = 35,
  motionSensitivity = 0.3,
  elevationSmoothing = 0.15,
  colorMode = "webcam",
  monochromeColor = "#00ff88",
  backgroundColor = "#030303",
  mirror = true,
  gapRatio = 0.05,
  invertColors = false,
  darken = 0.4,
  borderColor = "#ffffff",
  borderOpacity = 0.08,
  className,
  onWebcamError,
  onWebcamReady,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const pixelDataRef = useRef<PixelData[][]>([]);
  const animationRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Parse monochrome color
  const monoRGB = React.useMemo(() => {
    const hex = monochromeColor.replace("#", "");
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }, [monochromeColor]);

  // Parse border color
  const borderRGB = React.useMemo(() => {
    const hex = borderColor.replace("#", "");
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }, [borderColor]);

  // Initialize pixel data
  useEffect(() => {
    pixelDataRef.current = Array.from({ length: gridRows }, () =>
      Array.from({ length: gridCols }, () => ({
        r: 30,
        g: 45,
        b: 70,
        motion: 0,
        targetElevation: 0,
        currentElevation: 0,
      })),
    );
  }, [gridCols, gridRows]);

  // Track mouse movements for interactive fallback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const streamRef = useRef<MediaStream | null>(null);

  // Request camera access
  const requestCameraAccess = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam API not supported in this browser environment");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsWebcamActive(true);
        setError(null);
        setShowErrorPopup(false);
        onWebcamReady?.();
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Webcam access denied");
      setError(errorObj.message);
      setIsWebcamActive(false);
      onWebcamError?.(errorObj);
    }
  }, [onWebcamError, onWebcamReady]);

  // Initialize webcam on mount
  useEffect(() => {
    requestCameraAccess();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [requestCameraAccess]);

  // Main render loop
  const render = useCallback(() => {
    const video = videoRef.current;
    const processingCanvas = processingCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!displayCanvas) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }

    const dispCtx = displayCanvas.getContext("2d");
    if (!dispCtx) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }

    const hasVideo =
      video &&
      processingCanvas &&
      video.readyState >= 2 &&
      isWebcamActive;

    const time = Date.now() * 0.002;
    const pixels = pixelDataRef.current;

    if (hasVideo) {
      const procCtx = processingCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (procCtx) {
        processingCanvas.width = gridCols;
        processingCanvas.height = gridRows;

        procCtx.save();
        if (mirror) {
          procCtx.scale(-1, 1);
          procCtx.drawImage(video, -gridCols, 0, gridCols, gridRows);
        } else {
          procCtx.drawImage(video, 0, 0, gridCols, gridRows);
        }
        procCtx.restore();

        const imageData = procCtx.getImageData(0, 0, gridCols, gridRows);
        const currentData = imageData.data;
        const previousData = previousFrameRef.current;

        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridCols; col++) {
            const idx = (row * gridCols + col) * 4;
            const r = currentData[idx];
            const g = currentData[idx + 1];
            const b = currentData[idx + 2];

            const pixel = pixels[row]?.[col];
            if (!pixel) continue;

            let motion = 0;
            if (previousData) {
              const prevR = previousData[idx];
              const prevG = previousData[idx + 1];
              const prevB = previousData[idx + 2];
              const diff =
                Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB);
              motion = Math.min(1, diff / 255 / motionSensitivity);
            }

            pixel.motion = pixel.motion * 0.7 + motion * 0.3;

            let finalR = r;
            let finalG = g;
            let finalB = b;

            if (colorMode === "monochrome") {
              const brightness = (r + g + b) / 3 / 255;
              finalR = Math.round(monoRGB.r * brightness);
              finalG = Math.round(monoRGB.g * brightness);
              finalB = Math.round(monoRGB.b * brightness);
            }

            if (invertColors) {
              finalR = 255 - finalR;
              finalG = 255 - finalG;
              finalB = 255 - finalB;
            }

            if (darken > 0) {
              const darkenFactor = 1 - darken;
              finalR = Math.round(finalR * darkenFactor);
              finalG = Math.round(finalG * darkenFactor);
              finalB = Math.round(finalB * darkenFactor);
            }

            pixel.r = finalR;
            pixel.g = finalG;
            pixel.b = finalB;

            pixel.targetElevation = pixel.motion * maxElevation;
            pixel.currentElevation +=
              (pixel.targetElevation - pixel.currentElevation) *
              elevationSmoothing;
          }
        }

        previousFrameRef.current = new Uint8ClampedArray(currentData);
      }
    } else {
      // Interactive Synthetic Motion Fallback (Wave + Mouse proximity)
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = displayCanvas.clientWidth;
      const displayHeight = displayCanvas.clientHeight;
      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const pixel = pixels[row]?.[col];
          if (!pixel) continue;

          const cellX = (col / gridCols) * displayWidth;
          const cellY = (row / gridRows) * displayHeight;
          const distToMouse = Math.hypot(cellX - mouseX, cellY - mouseY);
          const mouseGlow = Math.max(0, 1 - distToMouse / 220);

          const wave =
            Math.sin(col * 0.2 + time * 1.2) *
            Math.cos(row * 0.2 + time * 0.9);
          const ripple = Math.sin(distToMouse * 0.05 - time * 3) * mouseGlow;

          const synthMotion = Math.max(0, wave * 0.3 + mouseGlow * 0.8 + ripple * 0.4);
          pixel.motion = pixel.motion * 0.8 + synthMotion * 0.2;

          // Cyber Neon Gradient palette fallback
          const baseR = Math.round(15 + Math.sin(col * 0.1 + time) * 15 + mouseGlow * 120);
          const baseG = Math.round(40 + Math.cos(row * 0.1 + time) * 35 + mouseGlow * 180);
          const baseB = Math.round(90 + Math.sin(time + row * 0.1) * 50 + mouseGlow * 220);

          pixel.r = Math.min(255, baseR);
          pixel.g = Math.min(255, baseG);
          pixel.b = Math.min(255, baseB);

          pixel.targetElevation = pixel.motion * maxElevation;
          pixel.currentElevation +=
            (pixel.targetElevation - pixel.currentElevation) * elevationSmoothing;
        }
      }
    }

    // Render to display canvas
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = displayCanvas.clientWidth;
    const displayHeight = displayCanvas.clientHeight;

    displayCanvas.width = displayWidth * dpr;
    displayCanvas.height = displayHeight * dpr;
    dispCtx.scale(dpr, dpr);

    dispCtx.fillStyle = backgroundColor;
    dispCtx.fillRect(0, 0, displayWidth, displayHeight);

    const cellSize = Math.max(
      displayWidth / gridCols,
      displayHeight / gridRows,
    );
    const gap = cellSize * gapRatio;

    const gridWidth = cellSize * gridCols;
    const gridHeight = cellSize * gridRows;
    const offsetXGrid = (displayWidth - gridWidth) / 2;
    const offsetYGrid = (displayHeight - gridHeight) / 2;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const pixel = pixels[row]?.[col];
        if (!pixel) continue;

        const x = offsetXGrid + col * cellSize;
        const y = offsetYGrid + row * cellSize;
        const elevation = pixel.currentElevation;

        const offsetX = -elevation * 1.2;
        const offsetY = -elevation * 1.8;

        if (elevation > 0.5) {
          dispCtx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.6, elevation * 0.04)})`;
          dispCtx.fillRect(
            x + gap / 2 + elevation * 1.5,
            y + gap / 2 + elevation * 2.0,
            cellSize - gap,
            cellSize - gap,
          );
        }

        if (elevation > 0.5) {
          dispCtx.fillStyle = `rgb(${Math.max(0, pixel.r - 80)}, ${Math.max(0, pixel.g - 80)}, ${Math.max(0, pixel.b - 80)})`;
          dispCtx.beginPath();
          dispCtx.moveTo(
            x + cellSize - gap / 2 + offsetX,
            y + gap / 2 + offsetY,
          );
          dispCtx.lineTo(x + cellSize - gap / 2, y + gap / 2);
          dispCtx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
          dispCtx.lineTo(
            x + cellSize - gap / 2 + offsetX,
            y + cellSize - gap / 2 + offsetY,
          );
          dispCtx.closePath();
          dispCtx.fill();

          dispCtx.fillStyle = `rgb(${Math.max(0, pixel.r - 50)}, ${Math.max(0, pixel.g - 50)}, ${Math.max(0, pixel.b - 50)})`;
          dispCtx.beginPath();
          dispCtx.moveTo(
            x + gap / 2 + offsetX,
            y + cellSize - gap / 2 + offsetY,
          );
          dispCtx.lineTo(x + gap / 2, y + cellSize - gap / 2);
          dispCtx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
          dispCtx.lineTo(
            x + cellSize - gap / 2 + offsetX,
            y + cellSize - gap / 2 + offsetY,
          );
          dispCtx.closePath();
          dispCtx.fill();
        }

        const brightness = 1 + elevation * 0.05;
        dispCtx.fillStyle = `rgb(${Math.min(255, Math.round(pixel.r * brightness))}, ${Math.min(255, Math.round(pixel.g * brightness))}, ${Math.min(255, Math.round(pixel.b * brightness))})`;
        dispCtx.fillRect(
          x + gap / 2 + offsetX,
          y + gap / 2 + offsetY,
          cellSize - gap,
          cellSize - gap,
        );

        dispCtx.strokeStyle = `rgba(${borderRGB.r}, ${borderRGB.g}, ${borderRGB.b}, ${borderOpacity + elevation * 0.008})`;
        dispCtx.lineWidth = 0.5;
        dispCtx.strokeRect(
          x + gap / 2 + offsetX,
          y + gap / 2 + offsetY,
          cellSize - gap,
          cellSize - gap,
        );
      }
    }

    animationRef.current = requestAnimationFrame(render);
  }, [
    gridCols,
    gridRows,
    mirror,
    motionSensitivity,
    colorMode,
    monoRGB,
    maxElevation,
    elevationSmoothing,
    backgroundColor,
    gapRatio,
    invertColors,
    darken,
    borderRGB,
    borderOpacity,
    isWebcamActive,
  ]);

  // Start render loop immediately on mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [render]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Hidden video element */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        playsInline
        muted
      />

      {/* Hidden processing canvas */}
      <canvas
        ref={processingCanvasRef}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      {/* Display canvas */}
      <canvas
        ref={displayCanvasRef}
        className="h-full w-full opacity-100 transition-opacity duration-500"
        style={{ backgroundColor }}
      />

      {/* Error notification banner if camera access denied */}
      {error && showErrorPopup && (
        <div className="animate-in fade-in slide-in-from-top-2 fixed top-4 right-4 z-50 duration-300 pointer-events-auto">
          <div className="relative flex max-w-sm items-start gap-3 rounded-lg border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setShowErrorPopup(false)}
              className="absolute top-2 right-2 rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-white/90">
                Interactive Grid Active
              </p>
              <p className="mt-1 text-xs text-white/50">
                Mouse-driven wave mode active. Enable camera for real-time video feed.
              </p>
              <button
                onClick={requestCameraAccess}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-cyan-600/40 border border-cyan-400/40 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-500/60"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Retry Camera Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamPixelGrid;
