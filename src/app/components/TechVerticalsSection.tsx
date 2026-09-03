'use client';

import React, { useRef, useEffect, useState } from 'react';

const verticals = [
  {
    number: '01',
    category: 'COMPUTING',
    title: 'Quantum Computing',
    description: 'Hybrid quantum-classical architectures, HPC-backed simulation and AI systems for exponential computational advantage across research and industry.',
    tags: ['Hybrid Architectures', 'HPC Simulation', 'Quantum Algorithms'],
    accent: '#0e76ff',
  },
  {
    number: '02',
    category: 'IMAGING & SENSING',
    title: 'Quantum Imaging & Sensing',
    description: 'Quantum sensing, photonics, advanced imaging and diagnostic technologies pushing the boundaries of measurement precision and medical diagnostics.',
    tags: ['Quantum Photonics', 'Biosensors', 'Diagnostic Imaging'],
    accent: '#3b82f6',
  },
  {
    number: '03',
    category: 'COMMUNICATION',
    title: 'Quantum Communication',
    description: "Quantum Key Distribution and quantum-safe cryptography securing India\'s critical communication infrastructure against future quantum threats.",
    tags: ['QKD', 'Quantum-Safe Crypto', 'Secure Networks'],
    accent: '#60a5fa',
  },
];

// ===== ANIMATED QUANTUM CIRCUIT CANVAS =====
function QuantumCircuitCanvas({ accent }: { accent: string }) {
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

    // Parse accent color to rgba
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = hexToRgb(accent);

    let time = 0;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      time += 0.015;

      // Grid
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`;
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Quantum waveform
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y1 = h * 0.35 + Math.sin(x * 0.04 + time) * 12;
        const y2 = h * 0.35 + Math.sin(x * 0.04 + time + Math.PI) * 12;
        const blend = (Math.sin(x * 0.02 + time * 0.5) + 1) / 2;
        let y = y1 * blend + y2 * (1 - blend);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second waveform
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x++) {
        let y = h * 0.65 + Math.cos(x * 0.03 + time * 1.3) * 8 + Math.sin(x * 0.07 + time) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Scanning dot
      const dotX = ((time * 30) % (w + 20)) - 10;
      const dotY = h * 0.35 + Math.sin(dotX * 0.04 + time) * 12;
      const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 12);
      dotGlow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)`);
      dotGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = dotGlow;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

export default function TechVerticalsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden border-t border-white/8"
      id="technology"
      ref={ref}
      style={{ background: '#060d1a' }}
    >
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-archivo font-medium text-[20vw] leading-none select-none"
          style={{ color: 'rgba(14,118,255,0.025)', letterSpacing: '-0.05em' }}
        >
          QUANTUM
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[1px] bg-white/20" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-white/40">
              TECHNOLOGY VERTICALS
            </span>
            <div className="w-6 h-[1px] bg-white/20" />
          </div>
          <h2 className="section-headline text-[#f3f3f3] mb-4">
            Three Quantum Technology Verticals
          </h2>
          <p className="font-archivo text-[15px] text-white/45 max-w-2xl mx-auto leading-relaxed">
            A unified research architecture spanning the full quantum technology spectrum — from computation to sensing to secure communication.
          </p>
        </div>

        {/* Verticals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/8">
          {verticals.map((v, i) => (
            <div
              key={v.number}
              className="group relative border-r border-white/8 last:border-r-0 overflow-hidden cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${i * 120}ms`,
              }}
            >
              {/* Top accent */}
              <div className="h-[2px] w-0 group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(90deg, ${v.accent}, transparent)` }} />

              {/* Animated canvas visualization */}
              <div className="relative h-28 overflow-hidden bg-[rgba(10,18,32,0.8)]">
                <QuantumCircuitCanvas accent={v.accent} />
                {/* Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(38,38,41,0.3) 100%)' }}
                />
              </div>

              <div className="p-8 bg-[rgba(38,38,41,0.3)] group-hover:bg-[rgba(38,38,41,0.5)] transition-colors duration-300">
                {/* Number + Category */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: v.accent }}>
                    {v.number}
                  </span>
                  <div className="w-4 h-[1px] bg-white/20" />
                  <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-white/40">
                    {v.category}
                  </span>
                </div>

                <h3 className="font-archivo font-medium text-[20px] text-[#f3f3f3] leading-tight mb-3">
                  {v.title}
                </h3>
                <p className="font-archivo text-[13px] text-white/50 leading-relaxed mb-6">
                  {v.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {v.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 border"
                      style={{ color: `${v.accent}80`, borderColor: `${v.accent}20`, background: `${v.accent}08` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
