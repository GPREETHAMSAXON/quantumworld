'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CSSParticleField from '@/components/ui/CSSParticleField';

export default function AboutHeroSection() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js DNA helix WebGL */}
      {mounted && (
        <CSSParticleField variant="hero" count={70} color="#0e76ff" spiral orbitalRings scanLines className="z-0" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,118,255,0.06) 0%, transparent 70%)',
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1]" style={{
        background: 'linear-gradient(to top, #060d1a 0%, transparent 100%)',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-8"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s' }}
          >
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
              ABOUT QUANTUM WORLD VENTURES
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-headline mb-8"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1s cubic-bezier(0.23,1,0.32,1) 0.2s' }}
          >
            <span className="block text-[#f3f3f3]">A Quantum L&D,</span>
            <span className="block" style={{ color: '#0e76ff' }}>R&D &amp; Consulting</span>
            <span className="block text-[#f3f3f3]">Company.</span>
          </h1>

          {/* Description */}
          <p
            className="font-archivo text-[17px] leading-relaxed mb-10 max-w-2xl"
            style={{
              color: 'rgba(243,243,243,0.6)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1) 0.35s',
            }}
          >
            Quantum World Ventures is an ecosystem carrying research from discovery to deployable impact — 
            bridging the gap between quantum science and real-world transformation across healthcare, 
            education, finance, and public safety.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.5s' }}
          >
            <Link href="/about#leadership" className="btn-primary flex items-center gap-2">
              Meet the Team
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about#journey" className="btn-ghost flex items-center gap-2">
              Our Journey
            </Link>
          </div>
        </div>

        {/* Floating stat cards */}
        <div
          className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.8s' }}
        >
          {[
            { value: '2019', label: 'Founded', sub: 'Bengaluru, India' },
            { value: '4+', label: 'Research Verticals', sub: 'MedTech · EdTech · FinTech · SecureTech' },
            { value: '21', label: 'Fellowship Tracks', sub: '8-Tier Pathway' },
          ]?.map((stat, i) => (
            <div
              key={stat?.label}
              className="relative overflow-hidden p-5 border border-white/8"
              style={{
                background: 'rgba(14,118,255,0.04)',
                backdropFilter: 'blur(12px)',
                transform: visible ? 'translateX(0)' : 'translateX(40px)',
                transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${0.9 + i * 0.1}s`,
                minWidth: 200,
              }}
            >
              <div className="font-archivo font-medium text-[28px] text-[#f3f3f3] leading-none mb-1">{stat?.value}</div>
              <div className="font-narrow text-[12px] font-medium tracking-[0.08em] uppercase text-[#0e76ff] mb-1">{stat?.label}</div>
              <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)] tracking-wide">{stat?.sub}</div>
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#0e76ff]" />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-narrow text-[10px] tracking-[0.2em] uppercase text-[rgba(243,243,243,0.3)]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[rgba(14,118,255,0.6)] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
