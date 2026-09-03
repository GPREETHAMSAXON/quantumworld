'use client';

import React, { useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const STATS = [
  { value: '47+', label: 'Research Papers' },
  { value: '12', label: 'Case Studies' },
  { value: '6', label: 'Domains Covered' },
  { value: '3.2K+', label: 'Resource Downloads' },
];

export default function InsightsHeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG Background — replaces Three.js knowledge graph + book geometry + orbital rings WebGL */}
      {mounted && (
        <CSSParticleField variant="hero" count={80} color="#0e76ff" networkGraph orbitalRings scanLines className="z-0" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1a]/30 via-transparent to-[#060d1a]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a]/60 via-transparent to-[#060d1a]/40 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-semibold tracking-[0.22em] uppercase text-[#0e76ff]">Thought Leadership Hub</span>
          </div>

          <h1 className="font-archivo font-bold text-[clamp(2.4rem,5.5vw,4.2rem)] leading-[1.05] tracking-tight text-[#f3f3f3] mb-6">
            Where Quantum Science<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0e76ff] via-[#3b82f6] to-[#99c5ff]">
              Meets Applied Insight
            </span>
          </h1>

          <p className="font-narrow text-[clamp(0.95rem,1.6vw,1.15rem)] text-[rgba(243,243,243,0.6)] leading-relaxed max-w-xl mb-10">
            Peer-reviewed research, applied case studies, and expert publications bridging quantum computing, AI, and real-world deployment — curated by QWV researchers and fellows.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#articles" className="btn-primary font-narrow text-[12px] flex items-center gap-2">
              Explore Articles
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#resources" className="btn-ghost font-narrow text-[12px] flex items-center gap-2">
              Download Resources
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
          {STATS?.map((s) => (
            <div key={s?.label} className="border-l border-[#0e76ff]/30 pl-4">
              <div className="font-archivo font-bold text-[1.8rem] text-[#f3f3f3] leading-none">{s?.value}</div>
              <div className="font-narrow text-[11px] tracking-[0.12em] uppercase text-[rgba(243,243,243,0.45)] mt-1">{s?.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1a] to-transparent pointer-events-none" />
    </section>
  );
}
