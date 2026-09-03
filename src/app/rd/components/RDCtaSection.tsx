'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CSSParticleField from '@/components/ui/CSSParticleField';

export default function RDCtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#07101f' }}>
      {/* CSS/SVG background — replaces canvas particle animation */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" scanLines className="z-0" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,118,255,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-[#0e76ff]/40" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.3em] uppercase text-[#0e76ff]">Collaborate With R&amp;D</span>
            <div className="h-px w-10 bg-[#0e76ff]/40" />
          </div>
          <h2 className="font-archivo text-[40px] md:text-[56px] font-bold leading-[1.0] tracking-tight text-white mb-6">
            Join the Research<br />
            <span style={{ background: 'linear-gradient(135deg, #0e76ff, #99c5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ecosystem</span>
          </h2>
          <p className="font-narrow text-[16px] text-[rgba(243,243,243,0.55)] leading-relaxed mb-12 max-w-xl mx-auto">
            Whether you are a researcher, institution, hospital, or technology partner — there is a collaboration pathway designed for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: 'Researchers', cta: 'Collaborate With R&D', href: '/about' },
              { label: 'Institutions', cta: 'Partner With Us', href: '/about' },
              { label: 'Startups', cta: 'Explore Incubation', href: '/about' },
            ]?.map((item) => (
              <Link key={item?.label} href={item?.href}
                className="group flex flex-col items-center gap-2 p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-[#0e76ff]/30 hover:bg-[#0e76ff]/[0.04] transition-all duration-300">
                <span className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(243,243,243,0.4)]">{item?.label}</span>
                <span className="font-narrow text-[13px] font-medium text-white group-hover:text-[#60a5fa] transition-colors flex items-center gap-1.5">
                  {item?.cta}
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about" className="btn-primary font-narrow text-[12px] flex items-center gap-2 px-8 py-3.5">
              Contact R&amp;D Team
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about" className="btn-ghost font-narrow text-[12px] px-8 py-3.5">Apply for Fellowship</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
