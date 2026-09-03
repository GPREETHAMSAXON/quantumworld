'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ===== QUANTUM INDIA MAP CANVAS =====
function QuantumIndiaCanvas() {
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

    // Key Indian cities with quantum relevance
    const cities = [
      { name: 'Delhi', x: 0.42, y: 0.28, size: 6, hub: true },
      { name: 'Mumbai', x: 0.28, y: 0.52, size: 5, hub: true },
      { name: 'Bengaluru', x: 0.38, y: 0.72, size: 6, hub: true },
      { name: 'Chennai', x: 0.46, y: 0.76, size: 4, hub: false },
      { name: 'Hyderabad', x: 0.44, y: 0.64, size: 4, hub: false },
      { name: 'Pune', x: 0.32, y: 0.56, size: 3, hub: false },
      { name: 'Kolkata', x: 0.62, y: 0.44, size: 4, hub: false },
      { name: 'Ahmedabad', x: 0.26, y: 0.42, size: 3, hub: false },
      { name: 'Chandigarh', x: 0.38, y: 0.22, size: 3, hub: false },
      { name: 'Visakhapatnam', x: 0.56, y: 0.64, size: 4, hub: false },
    ];

    // Data pulses between cities
    const pulses: Array<{
      from: number;
      to: number;
      progress: number;
      speed: number;
    }> = [];

    const connections = [
      [0, 1], [0, 2], [0, 6], [1, 2], [1, 3], [2, 3],
      [2, 4], [3, 4], [4, 9], [0, 8], [1, 7], [5, 2],
    ];

    for (let i = 0; i < 6; i++) {
      pulses.push({
        from: Math.floor(Math.random() * cities.length),
        to: Math.floor(Math.random() * cities.length),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    let time = 0;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.008;

      // Background grid
      ctx.strokeStyle = 'rgba(14,118,255,0.04)';
      ctx.lineWidth = 0.5;
      const gs = 30;
      for (let x = 0; x < w; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gs) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw connections
      connections.forEach(([a, b]) => {
        const ca = cities[a];
        const cb = cities[b];
        const x1 = ca.x * w;
        const y1 = ca.y * h;
        const x2 = cb.x * w;
        const y2 = cb.y * h;

        // Curved connection
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 20;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.strokeStyle = 'rgba(14,118,255,0.15)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      // Draw data pulses
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.from = pulse.to;
          pulse.to = Math.floor(Math.random() * cities.length);
        }

        const from = cities[pulse.from];
        const to = cities[pulse.to];
        let x = from.x * w + (to.x * w - from.x * w) * pulse.progress;
        let y = from.y * h + (to.y * h - from.y * h) * pulse.progress;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 8);
        glow.addColorStop(0, 'rgba(14,118,255,0.9)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();
      });

      // Draw city nodes
      cities.forEach((city) => {
        let x = city.x * w;
        let y = city.y * h;
        const pulse = 1 + Math.sin(time * 2 + city.x * 10) * 0.15;

        if (city.hub) {
          // Hub glow
          const glow = ctx.createRadialGradient(x, y, 0, x, y, city.size * 4 * pulse);
          glow.addColorStop(0, 'rgba(14,118,255,0.3)');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, city.size * 4 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // Outer ring
          ctx.beginPath();
          ctx.arc(x, y, city.size * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(14,118,255,0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Node
        ctx.beginPath();
        ctx.arc(x, y, city.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = city.hub ? '#0e76ff' : '#3b82f6';
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(243,243,243,0.5)';
        ctx.font = `${city.hub ? '500' : '400'} 10px Archivo Narrow, Arial Narrow, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(city.name, x, y + city.size + 14);
      });

      // Title overlay
      ctx.fillStyle = 'rgba(14,118,255,0.6)';
      ctx.font = '500 11px Archivo Narrow, Arial Narrow, sans-serif';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0.15em';
      ctx.fillText('INDIA QUANTUM NETWORK', 16, 20);

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
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}

const missionPillars = [
  {
    number: '01',
    title: 'Quantum Computing',
    desc: 'Superconducting & photonic qubits, error correction, hybrid architectures.',
    accent: '#0e76ff',
  },
  {
    number: '02',
    title: 'Quantum Communication',
    desc: 'QKD networks, quantum-safe cryptography, secure national infrastructure.',
    accent: '#3b82f6',
  },
  {
    number: '03',
    title: 'Quantum Sensing',
    desc: 'Atomic clocks, gravimeters, magnetometers, medical imaging sensors.',
    accent: '#60a5fa',
  },
  {
    number: '04',
    title: 'Quantum Materials',
    desc: 'Novel quantum materials, devices and enabling technologies.',
    accent: '#93c5fd',
  },
];

export default function NationalMissionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      id="mission"
      ref={ref}
      style={{ background: '#f7f7f5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">

        {/* Section header */}
        <div
          className="mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[1px] bg-black/30" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/50">
              NATIONAL QUANTUM MISSION
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="section-headline text-black max-w-xl">
              India&apos;s Quantum
              <span className="block" style={{ color: '#0e76ff' }}>Moment Has Arrived</span>
            </h2>
            <p className="font-archivo text-[15px] text-black/55 leading-relaxed max-w-sm">
              India&apos;s ₹6,003 Cr National Quantum Mission is the world&apos;s most ambitious quantum technology programme. QWV is positioned at its core.
            </p>
          </div>
        </div>

        {/* Main grid: Map + Content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black/8 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s',
          }}
        >
          {/* Left: Quantum India Map */}
          <div className="relative h-[380px] bg-[#0a1220] overflow-hidden border-r border-black/8">
            <QuantumIndiaCanvas />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(6,13,26,0.3) 0%, transparent 50%, rgba(6,13,26,0.3) 100%)' }}
            />
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 divide-x divide-y divide-black/8">
            {[
              { value: '₹6,003Cr', label: 'National Quantum Mission', sub: 'DST India 2023–2031' },
              { value: '2035', label: 'Target Year', sub: 'India quantum superpower' },
              { value: '25+', label: 'Research Institutions', sub: 'Across India' },
              { value: '4', label: 'Mission Pillars', sub: 'Computing, Sensing, Comm, Materials' },
            ].map((stat, i) => (
              <div key={stat.label} className="p-8 hover:bg-black/[0.02] transition-colors">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] mb-4"
                  style={{ animation: `pulseDot 2s ease-in-out infinite ${i * 0.3}s` }}
                />
                <div className="font-archivo font-medium text-2xl md:text-3xl text-black leading-none mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="font-archivo text-[13px] font-medium text-black mb-1">{stat.label}</div>
                <div className="font-narrow text-[11px] text-black/40 tracking-wide">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Pillars */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-black/8 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s',
          }}
        >
          {missionPillars.map((pillar, i) => (
            <div
              key={pillar.number}
              className="group p-6 border-r border-black/8 last:border-r-0 hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: pillar.accent }}>
                  {pillar.number}
                </span>
                <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: pillar.accent }} />
              </div>
              <h3 className="font-archivo font-medium text-[15px] text-black leading-snug mb-2">
                {pillar.title}
              </h3>
              <p className="font-archivo text-[12px] text-black/50 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="border border-black/8 p-8 md:p-12 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.45s',
          }}
        >
          <p className="font-archivo font-medium text-[20px] md:text-[26px] text-black leading-relaxed max-w-4xl mx-auto" style={{ letterSpacing: '-0.01em' }}>
            <strong>Quantum for Everyone,</strong>{' '}
            <span className="text-black/50">Engineered to Compound.</span>
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link href="#labs" className="btn-primary flex items-center gap-2">
              Explore Research
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="#contact" className="btn-ghost-dark flex items-center gap-2">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}