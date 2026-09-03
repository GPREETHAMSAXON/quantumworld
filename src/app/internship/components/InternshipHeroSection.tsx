'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span className={`inline ${className || ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <span className="inline-block transition-all duration-700"
            style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)', opacity: visible ? 1 : 0, transitionDelay: `${delay + i * 80}ms`, transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function InternshipHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = [
    { value: '6', label: 'Month Programme' },
    { value: '6', label: 'Core Modules' },
    { value: '10K+', label: 'Target Interns' },
    { value: '3', label: 'Eligibility Tracks' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js growth spiral WebGL */}
      {mounted && (
        <CSSParticleField variant="hero" count={80} color="#0e76ff" spiral orbitalRings scanLines className="z-0" />
      )}

      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,118,255,0.07) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[2]" style={{ background: 'linear-gradient(to top, #060d1a, transparent)' }} />
      <div className="absolute inset-0 z-[1] opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(14,118,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-3 mb-8" style={{ opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s forwards' }}>
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
          <span className="font-narrow text-[11px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">Quantum World Ventures · Internship Programme</span>
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
        </div>

        <h1 className="font-archivo font-bold leading-[1.05] tracking-tight mb-6" style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', color: '#f3f3f3' }}>
          <WordReveal text="Empowering" delay={300} />
          {' '}
          <span style={{ background: 'linear-gradient(135deg, #0e76ff 0%, #60a5fa 50%, #99c5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <WordReveal text="10,000 Interns" delay={500} />
          </span>
          <br />
          <WordReveal text="— A Global Student" delay={700} />
          <br />
          <WordReveal text="Transformation Mission" delay={900} />
        </h1>

        <p className="font-archivo text-[rgba(243,243,243,0.6)] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 1.1s forwards' }}>
          A structured 6-month internship programme designed to transform students into quantum-ready professionals through mentorship, real projects, and a final certification pitch.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16" style={{ opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 1.3s forwards' }}>
          <a href="#apply" className="btn-primary font-narrow text-[12px] flex items-center gap-2 px-8 py-3.5">
            Apply Now
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#modules" className="btn-ghost font-narrow text-[12px] px-8 py-3.5">Explore Modules</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px max-w-3xl mx-auto"
          style={{ opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 1.5s forwards', border: '1px solid rgba(14,118,255,0.15)' }}>
          {stats.map((s, i) => (
            <div key={i} className="px-6 py-5 text-center" style={{ background: 'rgba(14,118,255,0.04)', borderRight: i < 3 ? '1px solid rgba(14,118,255,0.12)' : 'none' }}>
              <div className="font-archivo font-bold text-[#0e76ff] mb-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>{s.value}</div>
              <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[rgba(243,243,243,0.45)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
