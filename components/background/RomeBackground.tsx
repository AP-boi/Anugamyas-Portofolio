'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { RomeModelLoader } from './RomeModelLoader';
import { Loader2, Sparkles, Compass } from 'lucide-react';

// Smooth Mouse Parallax & Dynamic Camera Controller
const MouseCameraController: React.FC = () => {
  const targetPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    // Smooth dampening towards current mouse position
    targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, mousePos.current.x, delta * 2.5);
    targetPos.current.y = THREE.MathUtils.lerp(targetPos.current.y, mousePos.current.y, delta * 2.5);

    // Continuous subtle breathing idle movement
    const time = state.clock.getElapsedTime();
    const idleX = Math.sin(time * 0.4) * 0.3;
    const idleY = Math.cos(time * 0.3) * 0.2;

    // Apply camera parallax positioning for reference scenery view
    const camX = targetPos.current.x * 2.5 + idleX;
    const camY = targetPos.current.y * 1.5 + idleY;
    const camZ = 14 - Math.abs(targetPos.current.x) * 0.5;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, camX, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, camY, delta * 3);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, camZ, delta * 3);

    state.camera.lookAt(targetPos.current.x * 1.2, targetPos.current.y * 0.6, 0);
  });

  return null;
};

// Modern Glassmorphic Loading Indicator
const LoadingSpinner: React.FC = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 shadow-2xl text-white min-w-[260px] animate-pulse">
        <div className="relative mb-3 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          <Compass className="w-5 h-5 text-amber-200 absolute" />
        </div>
        <p className="text-sm font-medium tracking-wide text-amber-100">Loading 3D Rome Scenery...</p>
        <span className="text-[11px] text-slate-400 mt-1 font-mono">Rendering geometry & textures</span>
      </div>
    </Html>
  );
};

export interface RomeBackgroundProps {
  onLoaded?: () => void;
  interactive?: boolean;
}

export const RomeBackground: React.FC<RomeBackgroundProps> = ({ onLoaded, interactive = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleModelLoaded = () => {
    setIsLoaded(true);
    if (onLoaded) onLoaded();
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Surface */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        className="w-full h-full"
      >
        {/* Ambient & Natural Sunlight */}
        <ambientLight intensity={1.6} color="#ffffff" />
        
        {/* Key Sunlight */}
        <directionalLight
          position={[-35, 45, 30]}
          intensity={3.8}
          color="#ffffff"
          castShadow
        />

        {/* Fill Sunlight */}
        <directionalLight position={[35, 25, 20]} intensity={1.4} color="#e0f0ff" />

        {/* Sky Hemisphere Light */}
        <hemisphereLight args={['#ffffff', '#605040', 1.2]} />

        {/* Interactive Mouse Parallax Camera */}
        <MouseCameraController />

        {/* Optional Orbit Controls for Touch/Drag exploration */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minDistance={10}
          maxDistance={50}
          rotateSpeed={0.5}
        />

        {/* Async 3D Rome Scenery Model Loader */}
        <Suspense fallback={<LoadingSpinner />}>
          <RomeModelLoader onLoaded={handleModelLoaded} />
        </Suspense>
      </Canvas>

      {/* Atmospheric Vignette Gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70 pointer-events-none" />
    </div>
  );
};

export default RomeBackground;
