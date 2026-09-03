'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ===== CTA PARTICLE CANVAS =====
function CtaParticles() {
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

      // Radial pulse rings
      for (let ring = 0; ring < 4; ring++) {
        const phase = (t * 0.5 + ring * 0.8) % (Math.PI * 2);
        const r = 60 + ring * 40 + Math.sin(phase) * 20;
        const alpha = 0.06 - ring * 0.012;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14,118,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Scanning line
      const scanX = ((t * 60) % (w + 100)) - 50;
      const scanGrad = ctx.createLinearGradient(scanX - 30, 0, scanX + 30, 0);
      scanGrad.addColorStop(0, 'rgba(14,118,255,0)');
      scanGrad.addColorStop(0.5, 'rgba(14,118,255,0.06)');
      scanGrad.addColorStop(1, 'rgba(14,118,255,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 30, 0, 60, h);

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

export default function AboutCtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const actions = [
    {
      label: 'Researchers',
      cta: 'Collaborate With R&D',
      href: '/#labs',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
    },
    {
      label: 'Students',
      cta: 'Apply for Fellowship',
      href: '/#fellowship',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      label: 'Universities',
      cta: 'Partner With Us',
      href: '/#contact',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      label: 'Startups',
      cta: 'Explore Incubation',
      href: '/#contact',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: '#04080f' }}
    >
      {/* Particle canvas */}
      <div className="absolute inset-0 z-0">
        <CtaParticles />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(14,118,255,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Main CTA */}
        <div
          className="text-center mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
              JOIN THE ECOSYSTEM
            </span>
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
          </div>
          <h2 className="section-headline text-[#f3f3f3] mb-6">
            Ready to Build the
            <span className="block" style={{ color: '#0e76ff' }}>Quantum Future?</span>
          </h2>
          <p className="font-archivo text-[16px] max-w-xl mx-auto mb-10" style={{ color: 'rgba(243,243,243,0.5)' }}>
            Whether you are a researcher, student, institution, or startup — there is a place for you 
            in the Quantum World Ventures ecosystem.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/#contact" className="btn-primary flex items-center gap-2">
              Contact Us
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/" className="btn-ghost flex items-center gap-2">
              Explore Homepage
            </Link>
          </div>
        </div>

        {/* Action cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        >
          {actions.map((action, i) => (
            <Link
              key={action.label}
              href={action.href}
              className="group p-6 border-r border-white/8 last:border-r-0 hover:bg-white/[0.03] transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${0.5 + i * 0.1}s`,
              }}
            >
              <div className="w-8 h-8 border border-[#0e76ff]/30 flex items-center justify-center text-[#0e76ff] mb-4 group-hover:border-[#0e76ff]/60 transition-colors">
                {action.icon}
              </div>
              <div className="font-narrow text-[10px] font-medium tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(243,243,243,0.35)' }}>
                {action.label}
              </div>
              <div className="font-archivo font-medium text-[14px] text-[#f3f3f3] leading-snug mb-3">
                {action.cta}
              </div>
              <div className="flex items-center gap-2 text-[#0e76ff]">
                <span className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase">Get Started</span>
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
