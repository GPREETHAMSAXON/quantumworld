'use client';

import React, { useRef, useEffect, useState } from 'react';

// ===== MISSION WEBGL CANVAS =====
function MissionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Quantum waveform
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const amp = 20 + wave * 8;
        const freq = 0.02 + wave * 0.005;
        const speed = t * (0.8 + wave * 0.3);
        const yBase = h * 0.3 + wave * h * 0.2;
        const alpha = 0.15 - wave * 0.04;

        for (let x = 0; x <= w; x += 2) {
          const y = yBase + Math.sin(x * freq + speed) * amp * Math.cos(x * 0.005 + t * 0.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(14,118,255,${alpha})`;
        ctx.lineWidth = 1.5 - wave * 0.3;
        ctx.stroke();
      }

      // Orbiting nodes
      const cx = w * 0.5;
      const cy = h * 0.5;
      const nodeConfigs = [
        { r: 80, speed: 0.4, size: 4, color: '14,118,255' },
        { r: 120, speed: -0.25, size: 3, color: '59,130,246' },
        { r: 160, speed: 0.18, size: 2.5, color: '96,165,250' },
      ];

      nodeConfigs.forEach((nc) => {
        const angle = t * nc.speed;
        const nx = cx + Math.cos(angle) * nc.r;
        const ny = cy + Math.sin(angle) * nc.r;

        // Orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, nc.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${nc.color},0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node glow
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nc.size * 4);
        grad.addColorStop(0, `rgba(${nc.color},0.8)`);
        grad.addColorStop(1, `rgba(${nc.color},0)`);
        ctx.beginPath();
        ctx.arc(nx, ny, nc.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(nx, ny, nc.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nc.color},1)`;
        ctx.fill();
      });

      // Central pulse
      const pulseR = 15 + Math.sin(t * 2) * 5;
      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR * 3);
      cGrad.addColorStop(0, 'rgba(14,118,255,0.6)');
      cGrad.addColorStop(0.5, 'rgba(14,118,255,0.15)');
      cGrad.addColorStop(1, 'rgba(14,118,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR * 3, 0, Math.PI * 2);
      ctx.fillStyle = cGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14,118,255,0.9)';
      ctx.fill();

      t += 0.012;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}

export default function MissionVisionSection() {
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

  const pillars = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      label: 'VISION',
      title: 'Global Leadership in Quantum AI',
      desc: 'To be the world\'s most trusted Quantum + AI research and learning ecosystem — building institutions, not just products.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      label: 'MISSION',
      title: 'Build Labs. Deliver Learning. Drive Impact.',
      desc: 'Build Quantum Labs, deliver Quantum L&D and Centres of Excellence, and provide technology consulting and R&D support across India and beyond.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      label: 'VALUES',
      title: 'Science. Integrity. Human Impact.',
      desc: 'Every research goal is clearly labelled. Every claim is verified. Every technology is built to serve people — not just institutions.',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: '#060d1a' }}
      id="mission"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
                01 / MISSION & VISION
              </span>
            </div>
            <h2 className="section-headline text-[#f3f3f3]">
              Why We Exist.
              <span className="block" style={{ color: 'rgba(243,243,243,0.35)' }}>What We Build.</span>
            </h2>
          </div>
          <p className="font-archivo text-[15px] leading-relaxed max-w-md" style={{ color: 'rgba(243,243,243,0.5)' }}>
            Quantum World Ventures was founded on a single conviction: that quantum technology must move 
            beyond laboratories and into the hands of institutions, researchers, and citizens.
          </p>
        </div>

        {/* Main layout: 3D canvas + pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/8">
          {/* Canvas visual */}
          <div
            className="relative overflow-hidden border-r border-white/8"
            style={{
              minHeight: 420,
              background: 'rgba(14,118,255,0.02)',
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s ease 0.3s',
            }}
          >
            <MissionCanvas />
            {/* Overlay text */}
            <div className="absolute bottom-8 left-8 right-8">
              <blockquote className="font-archivo font-medium text-[20px] text-[#f3f3f3] leading-snug mb-3">
                &ldquo;From Discovery to Delivery — that is not just our tagline. It is our operating model.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-[#0e76ff]" />
                <span className="font-narrow text-[11px] tracking-[0.12em] uppercase text-[#0e76ff]">
                  Santosh Talaghatti, Founder & MD
                </span>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex flex-col">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.label}
                className="group p-8 border-b border-white/8 last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-default"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(30px)',
                  transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${0.3 + i * 0.15}s`,
                }}
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 border border-[#0e76ff]/30 flex items-center justify-center text-[#0e76ff] group-hover:border-[#0e76ff]/60 transition-colors">
                    {pillar.icon}
                  </div>
                  <div>
                    <span className="font-narrow text-[10px] font-medium tracking-[0.18em] uppercase text-[#0e76ff] block mb-2">
                      {pillar.label}
                    </span>
                    <h3 className="font-archivo font-medium text-[18px] text-[#f3f3f3] leading-snug mb-3">
                      {pillar.title}
                    </h3>
                    <p className="font-archivo text-[13px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.5)' }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-5 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom philosophy strip */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-0 border border-white/8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}
        >
          {['Quantum Technology', 'Artificial Intelligence', 'DeepTech R&D', 'Human Impact', 'National Mission'].map((item, i) => (
            <div key={item} className="p-5 border-r border-white/8 last:border-r-0 text-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] mx-auto mb-3" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: 'rgba(243,243,243,0.45)' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
