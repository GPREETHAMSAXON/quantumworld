'use client';

import React, { useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

export default function CoursesHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js particle field + icosahedron + orbital rings WebGL */}
      {mounted && (
        <CSSParticleField variant="hero" count={80} color="#0e76ff" icoWireframe orbitalRings networkGraph scanLines className="z-0" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1a]/30 via-transparent to-[#060d1a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a]/60 via-transparent to-[#060d1a]/40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] animate-pulse" />
          <span className="font-narrow text-[10px] font-medium tracking-[0.22em] uppercase text-[#0e76ff]">One-Day Intensive Programmes</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] animate-pulse" />
        </div>

        <h1 className="hero-headline mb-6 max-w-5xl mx-auto">
          Quantum &amp; AI<br />
          <span style={{ background: 'linear-gradient(135deg, #0e76ff 0%, #60a5fa 50%, #99c5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Course Catalogue
          </span>
        </h1>

        <p className="font-archivo text-[rgba(243,243,243,0.65)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          14 precision-engineered one-day intensives — from quantum fundamentals to enterprise AI deployment. Each course delivers measurable competency in a single focused session.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {[
            { value: '14', label: 'Courses' },
            { value: '1-Day', label: 'Format' },
            { value: '5', label: 'Difficulty Levels' },
            { value: '₹8K–₹28K', label: 'Price Range' },
          ]?.map((s) => (
            <div key={s?.label} className="text-center">
              <div className="font-archivo font-medium text-2xl text-[#f3f3f3]">{s?.value}</div>
              <div className="font-narrow text-[10px] tracking-[0.15em] uppercase text-[rgba(243,243,243,0.45)] mt-0.5">{s?.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#catalogue" className="btn-primary font-narrow text-[11px] flex items-center gap-2 px-8 py-3">
            Browse All Courses
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a href="#cohort" className="btn-ghost font-narrow text-[11px] px-8 py-3">Institutional Cohort</a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1a] to-transparent" />
    </section>
  );
}
