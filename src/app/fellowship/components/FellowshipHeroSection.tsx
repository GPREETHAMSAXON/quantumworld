'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

// ===== ANIMATED WORD REVEAL =====
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

export default function FellowshipHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js double helix WebGL */}
      {mounted && (
        <CSSParticleField variant="hero" count={80} color="#0e76ff" spiral orbitalRings scanLines className="z-0" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,118,255,0.07) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[2]" style={{ background: 'linear-gradient(to top, #060d1a, transparent)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(14,118,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,0.8) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-3 mb-8" style={{ opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s forwards' }}>
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
          <span className="font-narrow text-[11px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">
            AI & Quantum Research · Fellowship & Internship Program
          </span>
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
        </div>

        <h1 className="font-archivo font-medium leading-[1.05] tracking-tight mb-8 max-w-5xl mx-auto"
          style={{ fontSize: 'clamp(42px, 7vw, 88px)', color: '#f3f3f3' }}>
          <WordReveal text="Lead Fellows." delay={300} />
          <span className="block" style={{ color: '#0e76ff' }}>
            <WordReveal text="Build Institutions." delay={500} />
          </span>
          <WordReveal text="Advance Quantum Innovation." delay={700} />
        </h1>

        <p className="font-archivo text-[17px] leading-relaxed max-w-2xl mx-auto mb-12"
          style={{ color: 'rgba(243,243,243,0.55)', opacity: 0, animation: 'fadeInUp 0.9s cubic-bezier(0.23,1,0.32,1) 1s forwards' }}>
          A national fellowship program for students, faculty, researchers, innovators and entrepreneurs — 
          with 21 specialised fellowships, an 8-tier leadership pathway, and a pan-India quantum innovation network.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          style={{ opacity: 0, animation: 'fadeInUp 0.9s cubic-bezier(0.23,1,0.32,1) 1.2s forwards' }}>
          <a href="#apply" className="btn-primary flex items-center gap-2 text-[13px]">
            Apply for Fellowship
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#pathway" className="btn-ghost flex items-center gap-2 text-[13px]">Explore Pathway</a>
          <a href="#specializations" className="btn-ghost flex items-center gap-2 text-[13px]">View Specializations</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-white/8 max-w-3xl mx-auto"
          style={{ opacity: 0, animation: 'fadeInUp 0.9s cubic-bezier(0.23,1,0.32,1) 1.4s forwards' }}>
          {[
            { value: '21', label: 'Specialized Fellowships' },
            { value: '8', label: 'Leadership Tiers' },
            { value: '10K+', label: 'Target Fellows' },
            { value: '3', label: 'Strategic Pillars' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 border-r border-white/8 last:border-r-0 border-b md:border-b-0 text-center">
              <div className="font-archivo font-medium text-[28px] text-[#f3f3f3] leading-none mb-1.5">{stat.value}</div>
              <div className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: 'rgba(243,243,243,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0, animation: 'fadeInUp 0.8s ease 2s forwards' }}>
        <span className="font-narrow text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(243,243,243,0.3)' }}>Scroll</span>
        <div className="w-[1px] h-8 overflow-hidden" style={{ background: 'rgba(14,118,255,0.2)' }}>
          <div className="w-full h-full bg-[#0e76ff]" style={{ animation: 'scrollLine 2s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
