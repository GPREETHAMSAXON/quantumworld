'use client';

import React, { useRef, useEffect, useState } from 'react';

// ===== JOURNEY TIMELINE WEBGL =====
function JourneyParticles() {
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

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
      color: ['rgba(14,118,255', 'rgba(59,130,246', 'rgba(96,165,250'][Math.floor(Math.random() * 3)],
    }));

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Flowing data stream
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yBase = h * (0.3 + i * 0.2);
        for (let x = 0; x <= w; x += 3) {
          const y = yBase + Math.sin(x * 0.01 + t * 0.5 + i * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(14,118,255,${0.06 - i * 0.015})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color},${p.opacity})`;
        ctx.fill();
      });

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} />;
}

// ===== 3D CARD COMPONENT =====
function JourneyCard({
  step, index, visible,
}: {
  step: { phase: string; title: string; desc: string; detail: string; icon: React.ReactNode; color: string };
  index: number;
  visible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRotX(-dy * 8);
    setRotY(dx * 8);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 0.1}s`,
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          background: hovered
            ? 'linear-gradient(135deg, rgba(14,118,255,0.12) 0%, rgba(14,118,255,0.04) 100%)'
            : 'rgba(14,118,255,0.03)',
          border: `1px solid ${hovered ? 'rgba(14,118,255,0.3)' : 'rgba(243,243,243,0.08)'}`,
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* Shimmer layer */}
        {hovered && (
          <div
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
            }}
          />
        )}

        {/* Phase number */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase"
            style={{ color: step.color }}
          >
            {step.phase}
          </span>
          <div
            className="w-8 h-8 flex items-center justify-center border"
            style={{ borderColor: `${step.color}40`, color: step.color }}
          >
            {step.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-archivo font-medium text-[20px] text-[#f3f3f3] leading-tight mb-3">
          {step.title}
        </h3>

        {/* Desc */}
        <p className="font-archivo text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(243,243,243,0.5)' }}>
          {step.desc}
        </p>

        {/* Detail tag */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 border"
          style={{ borderColor: `${step.color}25`, background: `${step.color}08` }}
        >
          <div className="w-1 h-1 rounded-full" style={{ background: step.color }} />
          <span className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: step.color }}>
            {step.detail}
          </span>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{ width: hovered ? '100%' : '0%', background: step.color }}
        />
      </div>
    </div>
  );
}

const journeySteps = [
  {
    phase: 'PHASE 01',
    title: 'Discovery',
    desc: 'Identifying real-world problems where quantum and AI technologies can create measurable impact across healthcare, education, finance, and public safety.',
    detail: 'Problem Identification',
    color: '#0e76ff',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    phase: 'PHASE 02',
    title: 'Research',
    desc: 'Fundamental and applied quantum research — from quantum algorithms and QKD to hybrid quantum-classical AI architectures and quantum sensing.',
    detail: 'Fundamental & Applied R&D',
    color: '#3b82f6',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    phase: 'PHASE 03',
    title: 'Prototype',
    desc: 'Building working prototypes — quantum imaging systems, quantum-safe communication tools, AI-enhanced diagnostic platforms, and financial security modules.',
    detail: 'Proof of Concept',
    color: '#60a5fa',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    phase: 'PHASE 04',
    title: 'Validation',
    desc: 'Rigorous testing, clinical pilots, regulatory pathway design, and independent validation — ensuring every technology meets real-world standards before deployment.',
    detail: 'Testing & Verification',
    color: '#93c5fd',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    phase: 'PHASE 05',
    title: 'Deployment',
    desc: 'Institutional rollout through partnerships with universities, hospitals, government bodies, and enterprises — embedding quantum technology into operational systems.',
    detail: 'Institutional Rollout',
    color: '#bfdbfe',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    phase: 'PHASE 06',
    title: 'Impact',
    desc: 'Measurable outcomes — improved diagnostics, quantum-safe financial systems, trained quantum workforce, and a national ecosystem aligned with India\'s Quantum Mission.',
    detail: 'Real-World Outcomes',
    color: '#e0f2fe',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
];

export default function JourneyTimelineSection() {
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
      ref={ref}
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: '#04080f' }}
      id="journey"
    >
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <JourneyParticles />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Header */}
        <div
          className="text-center mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
              02 / DISCOVERY TO DELIVERY
            </span>
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
          </div>
          <h2 className="section-headline text-[#f3f3f3] mb-6">
            The Journey from
            <span className="block" style={{ color: '#0e76ff' }}>Discovery to Delivery.</span>
          </h2>
          <p className="font-archivo text-[15px] max-w-2xl mx-auto" style={{ color: 'rgba(243,243,243,0.5)' }}>
            Every technology we build follows a rigorous six-phase journey — from identifying the problem 
            to deploying solutions that create measurable national impact.
          </p>
        </div>

        {/* Connecting line */}
        <div className="relative mb-4 hidden lg:block">
          <div
            className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(14,118,255,0.3) 10%, rgba(14,118,255,0.3) 90%, transparent)',
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s ease 0.5s',
            }}
          />
          {/* Arrow dots */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0e76ff]"
              style={{
                left: `${(i + 1) * (100 / 6)}%`,
                opacity: visible ? 0.5 : 0,
                transition: `opacity 0.5s ease ${0.6 + i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journeySteps.map((step, i) => (
            <JourneyCard key={step.phase} step={step} index={i} visible={visible} />
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          className="mt-16 text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 border border-white/8" style={{ background: 'rgba(14,118,255,0.04)' }}>
            {['Discovery', '→', 'Research', '→', 'Prototype', '→', 'Validation', '→', 'Deployment', '→', 'Impact'].map((item, i) => (
              <span
                key={i}
                className={`font-narrow text-[11px] font-medium tracking-[0.1em] uppercase ${
                  item === '→' ? 'text-[rgba(243,243,243,0.2)]' : 'text-[#0e76ff]'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
