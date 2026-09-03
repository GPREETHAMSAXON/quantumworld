'use client';

import React, { useEffect, useRef, useState } from 'react';


// ===== LIGHTWEIGHT PROCESS CANVAS (2D only, single context) =====
function ProcessCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = [
      { x: 0.1, y: 0.5 },
      { x: 0.28, y: 0.5 },
      { x: 0.46, y: 0.5 },
      { x: 0.64, y: 0.5 },
      { x: 0.82, y: 0.5 },
    ];

    let pulseT = 0;
    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      pulseT += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < nodes.length - 1; i++) {
        const x1 = nodes[i].x * w, y1 = nodes[i].y * h;
        const x2 = nodes[i + 1].x * w, y2 = nodes[i + 1].y * h;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(14,118,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const progress = (pulseT * 0.5 + i * 0.2) % 1;
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, 'rgba(14,118,255,0.9)');
        grad.addColorStop(1, 'rgba(14,118,255,0)');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      nodes.forEach((node, i) => {
        const x = node.x * w, y = node.y * h;
        const pulse = Math.sin(pulseT * 2 + i * 0.8) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 14 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14,118,255,${0.15 * pulse})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,118,255,${0.6 + 0.4 * pulse})`;
        ctx.fill();
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

const processSteps = [
  { index: '01', phase: 'Discovery', title: 'Fundamental Research', description: 'Theoretical exploration of quantum phenomena, algorithm design, and communication protocols. Pure science with no immediate application constraint.', tags: ['Quantum Theory', 'Algorithm Design', 'QKD Protocols'], color: '#0e76ff' },
  { index: '02', phase: 'Applied Research', title: 'Hybrid AI & Quantum-AI', description: 'Applying quantum principles to real-world AI problems. Building hybrid architectures trained on Indian datasets for sector-specific applications.', tags: ['ML/DL', 'Hybrid Architectures', 'Indian Datasets'], color: '#3b82f6' },
  { index: '03', phase: 'Prototype', title: 'Translational Development', description: 'Converting validated research into working prototypes. Engineering devices, software systems, and platforms ready for controlled testing.', tags: ['Device Engineering', 'Software Platforms', 'TRL 3→6'], color: '#60a5fa' },
  { index: '04', phase: 'Validation', title: 'Clinical & Field Testing', description: 'Rigorous testing in real-world environments — clinical pilots, field deployments, and regulatory compliance assessments.', tags: ['Clinical Pilots', 'Field Testing', 'Regulatory Review'], color: '#93c5fd' },
  { index: '05', phase: 'Deployment', title: 'Productisation & Impact', description: 'Taking validated technology to market through IP protection, manufacturing readiness, OEM partnerships, and institutional deployment.', tags: ['IP & Patents', 'Manufacturing', 'OEM Partnerships'], color: '#99c5ff' },
];

export default function ResearchProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveStep(prev => (prev + 1) % processSteps.length), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14,118,255,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#0e76ff]/50" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.3em] uppercase text-[#0e76ff]">03 / Research Pipeline</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-archivo text-[42px] md:text-[56px] font-bold leading-[1.0] tracking-tight text-white max-w-xl">
              The Research<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pipeline</span>
            </h2>
            <p className="font-narrow text-[15px] text-[rgba(243,243,243,0.55)] max-w-md leading-relaxed">
              Every research initiative follows a disciplined five-phase journey — from initial discovery to real-world deployment and measurable impact.
            </p>
          </div>
        </div>

        <div className="relative h-24 mb-16 rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}>
          <ProcessCanvas />
          <div className="absolute inset-0 flex items-end pb-3">
            {processSteps.map((step, i) => (
              <div key={step.index} className="flex-1 text-center cursor-pointer" onClick={() => setActiveStep(i)}>
                <span className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase transition-colors duration-300"
                  style={{ color: activeStep === i ? '#0e76ff' : 'rgba(243,243,243,0.3)' }}>
                  {step.phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {processSteps.map((step, i) => (
            <div key={step.index}
              className={`relative overflow-hidden rounded-xl border p-6 cursor-pointer transition-all duration-400 ${activeStep === i ? 'border-[#0e76ff]/40 bg-[#0e76ff]/[0.06]' : 'border-white/8 bg-white/[0.02] hover:border-white/15'}`}
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms, border-color 0.3s ease, background 0.3s ease` }}
              onClick={() => setActiveStep(i)}>
              {activeStep === i && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #0e76ff, transparent)' }} />}
              <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: step.color, opacity: 0.8 }}>{step.index} / {step.phase}</div>
              <h4 className="font-archivo text-[14px] font-bold text-white leading-tight mb-3">{step.title}</h4>
              <p className="font-narrow text-[12px] text-[rgba(243,243,243,0.5)] leading-relaxed mb-4">{step.description}</p>
              <div className="flex flex-col gap-1.5">
                {step.tags.map(tag => (
                  <span key={tag} className="font-narrow text-[9px] font-medium tracking-[0.1em] uppercase px-2 py-1 rounded border text-center"
                    style={{ color: step.color + 'aa', borderColor: step.color + '25', background: step.color + '08' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl border border-white/8 bg-white/[0.02]">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full border border-[#0e76ff]/30 bg-[#0e76ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-[#0e76ff] mb-1">Research Integrity Note</div>
              <p className="font-narrow text-[13px] text-[rgba(243,243,243,0.5)] leading-relaxed">
                All research milestones are clearly distinguished as <span className="text-[rgba(243,243,243,0.7)]">Verified</span>, <span className="text-[rgba(243,243,243,0.7)]">Research Goal</span>, <span className="text-[rgba(243,243,243,0.7)]">In Progress</span>, or <span className="text-[rgba(243,243,243,0.7)]">Under Development</span>. Quantum World Ventures does not fabricate scientific results, clinical outcomes, or regulatory approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
