'use client';

import React, { useEffect, useState } from 'react';
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

export default function ContactHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#060d1a' }}
    >
      {mounted && (
        <CSSParticleField
          variant="hero"
          count={70}
          color="#0e76ff"
          networkGraph
          orbitalRings
          scanLines
          className="z-0"
        />
      )}

      {/* Radial glow */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(14,118,255,0.08) 0%, transparent 65%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[2]"
        style={{ background: 'linear-gradient(to top, #060d1a, transparent)' }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14,118,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-36 pb-20 text-center">
        <div
          className="inline-flex items-center gap-3 mb-8"
          style={{ opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s forwards' }}
        >
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
          <span className="font-narrow text-[11px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">
            Quantum World Ventures · Get In Touch
          </span>
          <div className="w-8 h-[1px] bg-[#0e76ff]" />
        </div>

        <h1
          className="font-archivo font-medium leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto"
          style={{ fontSize: 'clamp(38px, 6vw, 76px)', color: '#f3f3f3' }}
        >
          <WordReveal text="Connect with" delay={300} />
          <span className="block" style={{ color: '#0e76ff' }}>
            <WordReveal text="Quantum World Ventures." delay={500} />
          </span>
        </h1>

        <p
          className="font-archivo text-[17px] leading-relaxed max-w-2xl mx-auto"
          style={{
            color: 'rgba(243,243,243,0.55)',
            opacity: 0,
            animation: 'fadeInUp 0.9s cubic-bezier(0.23,1,0.32,1) 0.9s forwards',
          }}
        >
          Whether you are exploring fellowship opportunities, institutional partnerships, research
          collaborations, or have a general inquiry — our team responds within one business day.
        </p>
      </div>
    </section>
  );
}
