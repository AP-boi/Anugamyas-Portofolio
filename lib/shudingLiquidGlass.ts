'use client';

/**
 * Shu Ding Liquid Glass Effect
 * Ported & adapted from https://github.com/shuding/liquid-glass
 * 
 * Uses Signed Distance Fields (SDF) + dynamic 2D canvas displacement maps
 * fed into SVG feDisplacementMap and CSS backdrop-filter for authentic optical refraction.
 */

export interface UVCoord {
  x: number;
  y: number;
}

export interface MouseCoord {
  x: number;
  y: number;
}

export type FragmentShader = (uv: UVCoord, mouse?: MouseCoord) => { x: number; y: number };

// Smoothstep interpolation
export function smoothStep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// 2D Vector Length
export function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

// Signed Distance Function (SDF) for rounded rectangle
export function roundedRectSDF(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): number {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

export function texture(x: number, y: number) {
  return { x, y };
}

/**
 * Default Shu Ding fragment shader using rounded-rect SDF and smoothstep distortion
 */
export const defaultShuDingFragment: FragmentShader = (uv, mouse) => {
  const ix = uv.x - 0.5;
  const iy = uv.y - 0.5;
  const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
  const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
  const scaled = smoothStep(0, 1, displacement);
  return texture(ix * scaled + 0.5, iy * scaled + 0.5);
};

/**
 * Generates an SVG displacement map using Shu Ding's SDF algorithm.
 * Encodes horizontal displacement into R channel and vertical into G channel.
 */
export function generateShuDingDisplacementMap(
  width: number,
  height: number,
  fragment: FragmentShader = defaultShuDingFragment,
  mouse: MouseCoord = { x: 0.5, y: 0.5 },
  dpi = 1
): { dataUrl: string; scale: number } | null {
  if (typeof document === 'undefined') return null;

  const w = Math.max(16, Math.floor(width * dpi));
  const h = Math.max(16, Math.floor(height * dpi));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const data = new Uint8ClampedArray(w * h * 4);
  let maxScale = 0;
  const rawValues: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % w;
    const y = Math.floor(i / 4 / w);
    const pos = fragment({ x: x / w, y: y / h }, mouse);
    const dx = pos.x * w - x;
    const dy = pos.y * h - y;
    maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
    rawValues.push(dx, dy);
  }

  maxScale = Math.max(1, maxScale * 0.5);

  let index = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = rawValues[index++] / maxScale + 0.5;
    const g = rawValues[index++] / maxScale + 0.5;
    data[i] = Math.floor(r * 255);
    data[i + 1] = Math.floor(g * 255);
    data[i + 2] = 0;
    data[i + 3] = 255;
  }

  ctx.putImageData(new ImageData(data, w, h), 0, 0);
  const dataUrl = canvas.toDataURL();

  return {
    dataUrl,
    scale: maxScale / dpi,
  };
}

/**
 * Shu Ding's interactive Liquid Glass Controller
 */
export class ShuDingLiquidGlassController {
  private id: string;
  private width: number;
  private height: number;
  private fragment: FragmentShader;
  private container: HTMLDivElement | null = null;
  private svg: SVGSVGElement | null = null;
  private feImage: SVGElement | null = null;
  private feDisplacementMap: SVGElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private mouse = { x: 0.5, y: 0.5 };
  private isDestroyed = false;

  constructor(options: {
    width?: number;
    height?: number;
    fragment?: FragmentShader;
  } = {}) {
    this.width = options.width || 280;
    this.height = options.height || 180;
    this.fragment = options.fragment || defaultShuDingFragment;
    this.id = 'shuding-lg-' + Math.random().toString(36).substring(2, 9);
  }

  public mount(targetParent: HTMLElement = document.body) {
    if (typeof document === 'undefined') return;

    // 1. Container
    this.container = document.createElement('div');
    this.container.id = this.id;
    this.container.className = 'shuding-liquid-glass';
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${this.width}px;
      height: ${this.height}px;
      overflow: hidden;
      border-radius: 40px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -10px 25px rgba(0, 0, 0, 0.15);
      cursor: grab;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: url(#${this.id}_filter) blur(1px) contrast(1.15) brightness(1.05) saturate(1.2);
      -webkit-backdrop-filter: blur(16px) saturate(1.2);
      z-index: 99990;
      pointer-events: auto;
      transition: box-shadow 0.2s ease;
    `;

    // 2. SVG filter setup
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99980;';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `${this.id}_filter`);
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('colorInterpolationFilters', 'sRGB');
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', this.width.toString());
    filter.setAttribute('height', this.height.toString());

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('id', `${this.id}_map`);
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.display = 'none';
    this.context = this.canvas.getContext('2d');

    targetParent.appendChild(this.svg);
    targetParent.appendChild(this.container);

    this.bindEvents();
    this.update();
  }

  private bindEvents() {
    if (!this.container) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      if (this.container) {
        this.container.style.cursor = 'grabbing';
        const rect = this.container.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;
      }
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && this.container) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newX = Math.max(10, Math.min(window.innerWidth - this.width - 10, initialX + deltaX));
        const newY = Math.max(34, Math.min(window.innerHeight - this.height - 10, initialY + deltaY));
        this.container.style.left = `${newX}px`;
        this.container.style.top = `${newY}px`;
        this.container.style.transform = 'none';
      }

      if (this.container) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      if (this.container) {
        this.container.style.cursor = 'grab';
      }
    };

    this.container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  public update() {
    if (this.isDestroyed || !this.canvas || !this.context || !this.feImage || !this.feDisplacementMap) return;

    const result = generateShuDingDisplacementMap(
      this.width,
      this.height,
      this.fragment,
      this.mouse
    );

    if (result) {
      this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', result.dataUrl);
      this.feDisplacementMap.setAttribute('scale', result.scale.toString());
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.svg?.remove();
    this.container?.remove();
    this.canvas?.remove();
  }
}
