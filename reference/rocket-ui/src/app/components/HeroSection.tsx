'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const QuantumWebGL = dynamic(() => import('./QuantumWebGL'), { ssr: false });

// ===== ANIMATED HEADLINE =====
function AnimatedHeadline({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const words = text.split(' ');

  return (
    <span className={`inline ${className || ''}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <span
            className="inline-block transition-all duration-700"
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transitionDelay: `${delay + wi * 80}ms`,
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ===== CANVAS PARTICLE FALLBACK =====
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.35 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 118, 255, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(14, 118, 255, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) setWebglReady(true);
    } catch {
      setWebglReady(false);
    }
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(110% 140% at 60% -20%, #b8cfe8 0%, #d8e8f4 30%, #eef4fa 60%, #f7f7f5 85%, #f4efe9 100%)',
      }}
    >
      {/* Particle canvas overlay */}
      <ParticleCanvas />

      {/* SVG scanning grid lines */}
      <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="hGridH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(14,118,255,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="hGridV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(14,118,255,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="-200" y1="30%" x2="0" y2="30%" stroke="url(#hGridH)" strokeWidth="1">
          <animate attributeName="x1" values="-200;110%" dur="9s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0;130%" dur="9s" repeatCount="indefinite" />
        </line>
        <line x1="110%" y1="65%" x2="130%" y2="65%" stroke="url(#hGridH)" strokeWidth="1">
          <animate attributeName="x1" values="110%;-200" dur="11s" repeatCount="indefinite" />
          <animate attributeName="x2" values="130%;0" dur="11s" repeatCount="indefinite" />
        </line>
        <line x1="20%" y1="-200" x2="20%" y2="0" stroke="url(#hGridV)" strokeWidth="1">
          <animate attributeName="y1" values="-200;110%" dur="10s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0;130%" dur="10s" repeatCount="indefinite" />
        </line>
        <line x1="78%" y1="110%" x2="78%" y2="130%" stroke="url(#hGridV)" strokeWidth="1">
          <animate attributeName="y1" values="110%;-200" dur="13s" repeatCount="indefinite" />
          <animate attributeName="y2" values="130%;0" dur="13s" repeatCount="indefinite" />
        </line>
        {/* Cross-hair corner marks */}
        <g stroke="rgba(14,118,255,0.2)" strokeWidth="1" fill="none">
          <line x1="20" y1="80" x2="20" y2="100" />
          <line x1="0" y1="100" x2="20" y2="100" />
          <line x1="calc(100% - 20px)" y1="80" x2="calc(100% - 20px)" y2="100" />
          <line x1="calc(100% - 20px)" y1="100" x2="100%" y2="100" />
        </g>
      </svg>

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 min-h-screen flex flex-col">
        <div className="h-[72px]" />

        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center py-12 lg:py-16">

            {/* LEFT: Text */}
            <div className="flex flex-col justify-center">
              {/* Eyebrow badge */}
              <div
                className="flex items-center gap-3 mb-8 transition-all duration-700"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: '100ms',
                }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 border border-black/15 bg-black/5 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/60">
                    India&apos;s Quantum + AI Research Ecosystem
                  </span>
                </div>
              </div>

              {/* Main headline */}
              <h1 className="hero-headline text-black mb-8" style={{ color: '#000000' }}>
                <span className="block">
                  <AnimatedHeadline text="Quantum &" delay={200} />
                </span>
                <span className="block">
                  <AnimatedHeadline text="AI Research," delay={350} />
                </span>
                <span className="block" style={{ color: '#0e76ff' }}>
                  <AnimatedHeadline text="Built for" delay={500} />
                </span>
                <span className="block" style={{ color: '#0e76ff' }}>
                  <AnimatedHeadline text="Real-World" delay={650} />
                </span>
                <span className="block" style={{ color: '#0e76ff' }}>
                  <AnimatedHeadline text="Impact" delay={800} />
                </span>
              </h1>

              {/* Description */}
              <div
                className="transition-all duration-700 mb-8"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: '700ms',
                }}
              >
                <p className="font-archivo text-[15px] font-normal leading-relaxed text-black/60 max-w-md">
                  India&apos;s premier Quantum L&amp;D, R&amp;D &amp; Consulting ecosystem — carrying research from discovery to deployable impact across MedTech, EdTech, FinTech &amp; SecureTech.
                </p>
              </div>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-3 mb-10 transition-all duration-700"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: '900ms',
                }}
              >
                <Link href="#labs" className="btn-primary flex items-center gap-2">
                  Explore Research
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="#fellowship" className="btn-ghost-dark flex items-center gap-2">
                  Fellowship Program
                </Link>
                <Link href="#contact" className="btn-ghost-dark flex items-center gap-2">
                  Contact Us
                </Link>
              </div>

              {/* Mission alignment */}
              <div
                className="transition-all duration-700"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: '1100ms',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/40">
                    Aligned with
                  </span>
                  <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/70 border border-black/15 px-2 py-0.5 bg-white/40 backdrop-blur-sm">
                    National Quantum Mission · DST India
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: 3D WebGL Quantum Visualization */}
            <div
              className="relative h-[480px] lg:h-[640px] flex items-center justify-center transition-all duration-1000"
              style={{
                opacity: loaded ? 1 : 0,
                transitionDelay: '400ms',
              }}
            >
              {/* WebGL 3D Scene */}
              <div className="absolute inset-0 rounded-none overflow-hidden">
                {webglReady ? (
                  <QuantumWebGL className="w-full h-full" />
                ) : (
                  /* Canvas 2D fallback */
                  <QuantumGemFallback />
                )}
              </div>

              {/* Floating info card */}
              <div
                className="absolute bottom-6 right-0 max-w-[260px] bg-white/85 backdrop-blur-md border border-black/8 p-4 shadow-xl z-10"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
                  transitionDelay: '1300ms',
                }}
              >
                <div className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase text-black/40 mb-1">COMPANY NEWS</div>
                <div className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase text-black/40 mb-2">2024</div>
                <p className="font-archivo text-[13px] font-medium text-black leading-snug">
                  QWV Launches India&apos;s First Independent Quantum MedTech Research Initiative
                </p>
                <button className="mt-2 w-5 h-5 bg-[#0e76ff] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              {/* Tech label top-left */}
              <div
                className="absolute top-4 left-0 z-10"
                style={{
                  opacity: loaded ? 0.7 : 0,
                  transition: 'opacity 1s ease',
                  transitionDelay: '1500ms',
                }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 border border-black/10 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" />
                  <span className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase text-black/50">
                    GPU · WebGL · Real-time 3D
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="flex justify-center pb-8 transition-all duration-700"
          style={{ opacity: loaded ? 0.5 : 0, transitionDelay: '1600ms' }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-narrow text-[9px] tracking-[0.2em] uppercase text-black/40">Scroll</span>
            <div className="w-[1px] h-8 bg-black/20 overflow-hidden">
              <div
                className="w-full h-1/2 bg-black/50"
                style={{ animation: 'scrollLine 2s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== 2D CANVAS FALLBACK =====
function QuantumGemFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const t = time * 0.0008;
      const floatY = Math.sin(t * 0.7) * 12;
      const rotY = t * 0.5;
      const size = Math.min(w, h) * 0.28;

      const vertices3D = [
        [0, -size, 0], [0, size, 0],
        [size * 0.7, 0, size * 0.7], [-size * 0.7, 0, size * 0.7],
        [size * 0.7, 0, -size * 0.7], [-size * 0.7, 0, -size * 0.7],
      ];

      const rotated = vertices3D.map(([x, y, z]) => {
        const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
        const rz = x * Math.sin(rotY) + z * Math.cos(rotY);
        return [rx, y, rz];
      });

      const fov = 600;
      const project = ([x, y, z]: number[]) => {
        const scale = fov / (fov + z + 200);
        return [cx + x * scale, cy + floatY + y * scale, scale, z];
      };
      const pts = rotated.map(project);

      const faces = [
        [0, 2, 4, '#c8d8e8', 0.85], [0, 4, 5, '#b8ccd8', 0.75],
        [0, 5, 3, '#a8bcc8', 0.7], [0, 3, 2, '#d8e4ee', 0.9],
        [1, 2, 4, '#8090a0', 0.6], [1, 4, 5, '#7080a0', 0.55],
        [1, 5, 3, '#6070a0', 0.5], [1, 3, 2, '#90a0b0', 0.65],
      ];

      faces
        .map(([i0, i1, i2, color, opacity]) => {
          const avgZ = (rotated[i0 as number][2] + rotated[i1 as number][2] + rotated[i2 as number][2]) / 3;
          return { i0: i0 as number, i1: i1 as number, i2: i2 as number, color: color as string, opacity: opacity as number, avgZ };
        })
        .sort((a, b) => a.avgZ - b.avgZ)
        .forEach(({ i0, i1, i2, color, opacity }) => {
          const p0 = pts[i0], p1 = pts[i1], p2 = pts[i2];
          ctx.beginPath();
          ctx.moveTo(p0[0], p0[1]);
          ctx.lineTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.closePath();
          const grad = ctx.createLinearGradient(p0[0], p0[1], p2[0], p2[1]);
          grad.addColorStop(0, color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
          grad.addColorStop(1, '#90a8c0' + Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0'));
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = `rgba(200, 220, 240, ${opacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

      // Orbit rings
      for (let i = 0; i < 3; i++) {
        const angle = t * (0.5 + i * 0.2) + (i * Math.PI * 2) / 3;
        const orbitR = size * (0.9 + i * 0.15);
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + floatY + Math.sin(angle) * orbitR * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, 3 - i * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 118, 255, ${0.7 - i * 0.1})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />;
}
