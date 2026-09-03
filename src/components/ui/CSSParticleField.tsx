'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

interface CSSParticleFieldProps {
  /** Number of CSS-animated dots (default 60) */
  count?: number;
  /** Primary colour in hex (default #0e76ff) */
  color?: string;
  /** Show SVG scanning lines (default true) */
  scanLines?: boolean;
  /** Show SVG orbital rings (default false) */
  orbitalRings?: boolean;
  /** Show SVG network graph (default false) */
  networkGraph?: boolean;
  /** Show SVG icosahedron wireframe (default false) */
  icoWireframe?: boolean;
  /** Show SVG spiral (default false) */
  spiral?: boolean;
  /** Show SVG hex grid (default false) */
  hexGrid?: boolean;
  /** Extra className on wrapper */
  className?: string;
  /** Variant controls overall density/style preset */
  variant?: 'hero' | 'section' | 'card' | 'minimal';
}

// Deterministic pseudo-random based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateParticles(count: number, seed: number = 0): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => seededRandom(seed + i * 17 + n);
    return {
      id: i,
      x: r(0) * 100,
      y: r(1) * 100,
      size: r(2) * 2.5 + 0.8,
      opacity: r(3) * 0.45 + 0.08,
      duration: r(4) * 12 + 8,
      delay: r(5) * -20,
      dx: (r(6) - 0.5) * 40,
      dy: (r(7) - 0.5) * 40,
    };
  });
}

// ===== SVG ORBITAL RINGS =====
function OrbitalRings({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <ellipse cx="400" cy="300" rx="320" ry="100" fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="0 400 300" to="360 400 300" dur="25s" repeatCount="indefinite" />
      </ellipse>
      {/* Middle ring tilted */}
      <ellipse cx="400" cy="300" rx="240" ry="80" fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="1" transform="rotate(-30 400 300)">
        <animateTransform attributeName="transform" type="rotate" from="-30 400 300" to="330 400 300" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner ring */}
      <ellipse cx="400" cy="300" rx="160" ry="55" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1" transform="rotate(60 400 300)">
        <animateTransform attributeName="transform" type="rotate" from="60 400 300" to="420 400 300" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Orbiting dot on outer ring */}
      <circle r="4" fill={color} fillOpacity="0.7">
        <animateMotion dur="25s" repeatCount="indefinite">
          <mpath href="#outerRingPath" />
        </animateMotion>
      </circle>
      <path id="outerRingPath" d="M 80,300 A 320,100 0 1,1 79.9,300" fill="none" />
      {/* Orbiting dot on middle ring */}
      <circle r="3" fill={color} fillOpacity="0.6">
        <animateMotion dur="18s" repeatCount="indefinite">
          <mpath href="#midRingPath" />
        </animateMotion>
      </circle>
      <path id="midRingPath" d="M 160,300 A 240,80 0 1,1 159.9,300" fill="none" />
      {/* Central nucleus */}
      <circle cx="400" cy="300" r="8" fill={color} fillOpacity="0.6">
        <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="fillOpacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="300" r="20" fill={color} fillOpacity="0.06">
        <animate attributeName="r" values="16;26;16" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ===== SVG ICOSAHEDRON WIREFRAME (CSS-approximated) =====
function IcoWireframe({ color }: { color: string }) {
  // Approximate icosahedron with projected 2D polygon layers
  const cx = 400, cy = 300;
  const r1 = 180, r2 = 120, r3 = 60;
  const pts = (r: number, n: number, offset = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + offset;
      return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
    }).join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity="0.12" stroke={color} strokeWidth="0.8" fill="none">
        <animateTransform attributeName="transform" type="rotate" from="0 400 300" to="360 400 300" dur="40s" repeatCount="indefinite" />
        <polygon points={pts(r1, 5, 0)} />
        <polygon points={pts(r1, 5, Math.PI)} />
        <polygon points={pts(r2, 5, Math.PI / 5)} />
        <polygon points={pts(r3, 5, 0)} />
        {/* Cross-connect lines */}
        {Array.from({ length: 5 }, (_, i) => {
          const a1 = (i / 5) * Math.PI * 2;
          const a2 = ((i + 2) / 5) * Math.PI * 2;
          return (
            <line key={i}
              x1={cx + Math.cos(a1) * r1} y1={cy + Math.sin(a1) * r1}
              x2={cx + Math.cos(a2) * r2} y2={cy + Math.sin(a2) * r2}
            />
          );
        })}
      </g>
    </svg>
  );
}

// ===== SVG NETWORK GRAPH =====
function NetworkGraph({ color, nodeCount = 20 }: { color: string; nodeCount?: number }) {
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      x: 50 + seededRandom(i * 7) * 700,
      y: 50 + seededRandom(i * 7 + 1) * 500,
      r: seededRandom(i * 7 + 2) * 4 + 2,
      isHub: seededRandom(i * 7 + 3) < 0.15,
    }));
  }, [nodeCount]);

  const edges = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    const maxDist = 200;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          result.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, opacity: (1 - d / maxDist) * 0.25 });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={color} strokeOpacity={e.opacity} strokeWidth="0.8" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.isHub ? n.r * 2 : n.r} fill={color} fillOpacity={n.isHub ? 0.6 : 0.35}>
            {n.isHub && (
              <animate attributeName="r" values={`${n.r * 2};${n.r * 3};${n.r * 2}`} dur={`${3 + seededRandom(i) * 2}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}
      </g>
    </svg>
  );
}

// ===== SVG SPIRAL =====
function SpiralSVG({ color }: { color: string }) {
  const points: string[] = [];
  for (let i = 0; i < 300; i++) {
    const frac = i / 300;
    const t = frac * Math.PI * 12;
    const r = 20 + frac * 160;
    const x = 400 + Math.cos(t) * r;
    const y = 50 + frac * 500;
    points.push(`${x},${y}`);
  }
  const points2: string[] = [];
  for (let i = 0; i < 300; i++) {
    const frac = i / 300;
    const t = frac * Math.PI * 12 + Math.PI;
    const r = 20 + frac * 160;
    const x = 400 + Math.cos(t) * r;
    const y = 50 + frac * 500;
    points2.push(`${x},${y}`);
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="1.5">
        <animate attributeName="strokeOpacity" values="0.2;0.45;0.2" dur="4s" repeatCount="indefinite" />
      </polyline>
      <polyline points={points2.join(' ')} fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="1">
        <animate attributeName="strokeOpacity" values="0.1;0.3;0.1" dur="5s" repeatCount="indefinite" />
      </polyline>
      {/* Tier nodes */}
      {Array.from({ length: 8 }, (_, i) => {
        const frac = i / 7;
        const t = frac * Math.PI * 12;
        const r = 20 + frac * 160;
        const x = 400 + Math.cos(t) * r;
        const y = 50 + frac * 500;
        return (
          <circle key={i} cx={x} cy={y} r={4 + i * 0.8} fill={color} fillOpacity="0.7">
            <animate attributeName="r" values={`${3 + i * 0.8};${6 + i * 0.8};${3 + i * 0.8}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

// ===== SVG HEX GRID =====
function HexGrid({ color }: { color: string }) {
  const hexes: { x: number; y: number }[] = [];
  const size = 40;
  const w = size * 2;
  const h = Math.sqrt(3) * size;
  for (let row = -1; row <= 8; row++) {
    for (let col = -1; col <= 12; col++) {
      const x = col * w * 0.75;
      const y = row * h + (col % 2 === 0 ? 0 : h / 2);
      hexes.push({ x, y });
    }
  }
  const hexPath = (cx: number, cy: number, r: number) => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {hexes.map((h, i) => (
        <polygon key={i} points={hexPath(h.x, h.y, size * 0.9)} fill="none" stroke={color} strokeOpacity="0.05" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

// ===== SVG SCAN LINES =====
function ScanLines({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true">
      <defs>
        <linearGradient id="scanH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="scanV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <line x1="-200" y1="30%" x2="0" y2="30%" stroke="url(#scanH)" strokeWidth="1">
        <animate attributeName="x1" values="-200;110%" dur="9s" repeatCount="indefinite" />
        <animate attributeName="x2" values="0;130%" dur="9s" repeatCount="indefinite" />
      </line>
      <line x1="110%" y1="65%" x2="130%" y2="65%" stroke="url(#scanH)" strokeWidth="1">
        <animate attributeName="x1" values="110%;-200" dur="11s" repeatCount="indefinite" />
        <animate attributeName="x2" values="130%;0" dur="11s" repeatCount="indefinite" />
      </line>
      <line x1="20%" y1="-200" x2="20%" y2="0" stroke="url(#scanV)" strokeWidth="1">
        <animate attributeName="y1" values="-200;110%" dur="10s" repeatCount="indefinite" />
        <animate attributeName="y2" values="0;130%" dur="10s" repeatCount="indefinite" />
      </line>
      <line x1="78%" y1="110%" x2="78%" y2="130%" stroke="url(#scanV)" strokeWidth="1">
        <animate attributeName="y1" values="110%;-200" dur="13s" repeatCount="indefinite" />
        <animate attributeName="y2" values="130%;0" dur="13s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

// ===== MAIN COMPONENT =====
export default function CSSParticleField({
  count,
  color = '#0e76ff',
  scanLines = false,
  orbitalRings = false,
  networkGraph = false,
  icoWireframe = false,
  spiral = false,
  hexGrid = false,
  className = '',
  variant = 'section',
}: CSSParticleFieldProps) {
  const defaultCount = variant === 'hero' ? 80 : variant === 'section' ? 50 : variant === 'card' ? 20 : 30;
  const particleCount = count ?? defaultCount;
  const particles = useMemo(() => generateParticles(particleCount, 42), [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* CSS keyframe particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: color,
              opacity: p.opacity,
              willChange: 'transform, opacity',
              animation: `cssParticleFloat ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Optional SVG overlays */}
      {scanLines && <ScanLines color={color} />}
      {orbitalRings && <OrbitalRings color={color} />}
      {networkGraph && <NetworkGraph color={color} />}
      {icoWireframe && <IcoWireframe color={color} />}
      {spiral && <SpiralSVG color={color} />}
      {hexGrid && <HexGrid color={color} />}
    </div>
  );
}
