'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
          <span
            className="inline-block transition-all duration-700"
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transitionDelay: `${delay + i * 80}ms`,
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

export default function RDHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js WebGL */}
      {mounted && (
        <CSSParticleField
          variant="hero"
          count={80}
          color="#0e76ff"
          orbitalRings
          icoWireframe
          scanLines
          className="z-0"
        />
      )}

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,118,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[2]" style={{ background: 'linear-gradient(to top, #060d1a, transparent)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(14,118,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-[#0e76ff]/50" />
          <span className="font-narrow text-[10px] font-medium tracking-[0.3em] uppercase text-[#0e76ff]">
            R&amp;D Division · Quantum World Ventures
          </span>
          <div className="h-px w-12 bg-[#0e76ff]/50" />
        </div>

        {/* Main headline */}
        <h1 className="font-archivo text-[56px] md:text-[80px] lg:text-[96px] font-bold leading-[0.95] tracking-tight text-white mb-6">
          <WordReveal text="From Discovery" className="block" delay={200} />
          <span className="block" style={{ background: 'linear-gradient(135deg, #0e76ff 0%, #60a5fa 50%, #99c5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <WordReveal text="to Delivery" delay={500} />
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="font-narrow text-[17px] md:text-[19px] text-[rgba(243,243,243,0.6)] max-w-2xl mx-auto leading-relaxed mb-12">
          A four-layer research architecture carrying quantum and AI science from fundamental theory to deployable real-world impact.
        </p>

        {/* Layer indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {['Fundamental', 'Applied', 'Translational', 'MedTech'].map((layer, i) => (
            <div key={layer} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" style={{ opacity: 0.4 + i * 0.15 }} />
              <span className="font-narrow text-[11px] font-medium tracking-[0.12em] uppercase text-[rgba(243,243,243,0.7)]">
                {layer}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="#research-layers" className="btn-primary font-narrow text-[12px] flex items-center gap-2 px-7 py-3.5">
            Explore Research
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/about" className="btn-ghost font-narrow text-[12px] px-7 py-3.5">
            About QWV
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-narrow text-[9px] tracking-[0.25em] uppercase text-white">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
