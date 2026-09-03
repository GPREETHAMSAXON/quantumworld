'use client';

import React, { useEffect, useRef, useState } from 'react';

// ===== LAYER CARD PARTICLE CANVAS =====
function LayerCanvas({ color, index }: { color: string; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    let t = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Waveform
      ctx.beginPath();
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 2) {
        const y = canvas.height / 2 + Math.sin(x * 0.04 + t + index) * 12 + Math.sin(x * 0.02 + t * 0.7) * 6;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [color, index]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

// ===== 3D TILT CARD =====
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

const researchLayers = [
  {
    index: '01',
    label: 'Fundamental Quantum Research',
    subtitle: 'The Science Foundation',
    color: '#0e76ff',
    colorHex: '#0e76ff',
    status: 'Research Goal',
    statusColor: '#0e76ff',
    description: 'Advancing the theoretical and experimental foundations of quantum mechanics, algorithms, and communication protocols that underpin all applied work.',
    areas: [
      'Quantum Computing Architectures',
      'Quantum Algorithm Development',
      'Quantum Communication Protocols',
      'Quantum Key Distribution (QKD)',
      'Quantum-Safe Cryptography',
      'Quantum Error Correction',
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="3" fill="#0e76ff" />
        <ellipse cx="20" cy="20" rx="14" ry="6" stroke="#0e76ff" strokeWidth="1" strokeOpacity="0.6" fill="none" />
        <ellipse cx="20" cy="20" rx="14" ry="6" stroke="#0e76ff" strokeWidth="1" strokeOpacity="0.4" fill="none" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="14" ry="6" stroke="#0e76ff" strokeWidth="1" strokeOpacity="0.3" fill="none" transform="rotate(120 20 20)" />
      </svg>
    ),
  },
  {
    index: '02',
    label: 'Applied AI & Quantum-AI Research',
    subtitle: 'Hybrid Intelligence',
    color: '#3b82f6',
    colorHex: '#3b82f6',
    status: 'In Progress',
    statusColor: '#22c55e',
    description: 'Developing hybrid quantum-classical AI systems trained on Indian datasets, bridging theoretical quantum advantage with practical machine learning applications.',
    areas: [
      'Machine Learning & Deep Learning',
      'Hybrid Quantum-Classical AI',
      'Indian Dataset Development',
      'Quantum Neural Networks',
      'AI-Assisted Quantum Simulation',
      'Federated Learning Architectures',
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
        <rect x="22" y="8" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
        <rect x="8" y="22" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
        <rect x="22" y="22" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
        <line x1="18" y1="13" x2="22" y2="13" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="13" y1="18" x2="13" y2="22" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="27" y1="18" x2="27" y2="22" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="18" y1="27" x2="22" y2="27" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="20" cy="20" r="2" fill="#3b82f6" />
      </svg>
    ),
  },
  {
    index: '03',
    label: 'Translational Research',
    subtitle: 'From Lab to Prototype',
    color: '#60a5fa',
    colorHex: '#60a5fa',
    status: 'Validation Underway',
    statusColor: '#f59e0b',
    description: 'Bridging the gap between theoretical research and real-world application through rigorous prototype development, testing, and clinical or field validation.',
    areas: [
      'Prototype Development',
      'Bench-to-Bedside Testing',
      'Clinical Pilot Programs',
      'Technology Validation',
      'TRL Progression (1→9)',
      'Research Partnerships',
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M10 30 L20 10 L30 30" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.7" fill="none" strokeLinejoin="round" />
        <circle cx="20" cy="10" r="2" fill="#60a5fa" fillOpacity="0.8" />
        <circle cx="10" cy="30" r="2" fill="#60a5fa" fillOpacity="0.5" />
        <circle cx="30" cy="30" r="2" fill="#60a5fa" fillOpacity="0.5" />
        <line x1="15" y1="20" x2="25" y2="20" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 2" />
        <line x1="12" y1="25" x2="28" y2="25" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    index: '04',
    label: 'MedTech Application Research',
    subtitle: 'Clinical Deployment',
    color: '#99c5ff',
    colorHex: '#99c5ff',
    status: 'Under Development',
    statusColor: '#a78bfa',
    description: 'Engineering quantum-enhanced medical devices from validated prototypes to market-ready products, navigating regulatory pathways and manufacturing readiness.',
    areas: [
      'Medical Device Engineering',
      'Regulatory Design (CDSCO)',
      'Manufacturing Readiness',
      'IP & Patent Strategy',
      'Clinical Validation',
      'OEM & Productisation',
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="12" y="8" width="16" height="24" rx="3" stroke="#99c5ff" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
        <line x1="20" y1="14" x2="20" y2="26" stroke="#99c5ff" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="14" y1="20" x2="26" y2="20" stroke="#99c5ff" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="20" cy="20" r="4" stroke="#99c5ff" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      </svg>
    ),
  },
];

export default function ResearchLayersSection() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="research-layers" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(14,118,255,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#0e76ff]/50" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.3em] uppercase text-[#0e76ff]">
              01 / Research Architecture
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-archivo text-[42px] md:text-[56px] font-bold leading-[1.0] tracking-tight text-white max-w-xl">
              Four-Layer<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Research Foundation
              </span>
            </h2>
            <p className="font-narrow text-[15px] text-[rgba(243,243,243,0.55)] max-w-md leading-relaxed">
              A structured pipeline from quantum theory to clinical deployment — each layer building on the last, ensuring research integrity at every stage.
            </p>
          </div>
        </div>

        {/* Research layer cards — bento asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {researchLayers.map((layer, i) => (
            <TiltCard
              key={layer.index}
              className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-500 ${
                activeLayer === i
                  ? 'border-[#0e76ff]/40 bg-[#0e76ff]/[0.06]'
                  : 'border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]'
              } ${i === 0 ? 'lg:col-span-2' : ''}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 120}ms`,
              }}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
            >
              {/* Canvas background */}
              <LayerCanvas color={layer.colorHex} index={i} />

              <div className={`relative z-10 p-8 md:p-10 ${i === 0 ? 'md:flex md:gap-12 md:items-start' : ''}`}>
                {/* Left / top */}
                <div className={i === 0 ? 'md:flex-shrink-0 md:w-64' : ''}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04]">
                        {layer.icon}
                      </div>
                      <div>
                        <span className="font-narrow text-[10px] font-medium tracking-[0.25em] uppercase text-[rgba(243,243,243,0.4)]">
                          Layer {layer.index}
                        </span>
                        <div className="font-narrow text-[11px] text-[rgba(243,243,243,0.5)] mt-0.5">{layer.subtitle}</div>
                      </div>
                    </div>
                    {/* Status badge */}
                    <span
                      className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border"
                      style={{ color: layer.statusColor, borderColor: layer.statusColor + '40', background: layer.statusColor + '12' }}
                    >
                      {layer.status}
                    </span>
                  </div>

                  <h3 className="font-archivo text-[22px] md:text-[26px] font-bold text-white leading-tight mb-3">
                    {layer.label}
                  </h3>
                  <p className="font-narrow text-[14px] text-[rgba(243,243,243,0.55)] leading-relaxed">
                    {layer.description}
                  </p>
                </div>

                {/* Research areas */}
                <div className={`${i === 0 ? 'md:flex-1 mt-6 md:mt-0' : 'mt-6'}`}>
                  <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(243,243,243,0.35)] font-narrow mb-4">
                    Research Areas
                  </div>
                  <div className={`grid gap-2 ${i === 0 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {layer.areas.map((area) => (
                      <div key={area} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: layer.colorHex, opacity: 0.7 }} />
                        <span className="font-narrow text-[12px] text-[rgba(243,243,243,0.6)]">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${layer.colorHex}40, transparent)` }} />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
