'use client';

import React, { useRef, useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const pillars = [
  { id: '01', label: 'Training', title: 'Expert-Led Learning', desc: 'Structured curriculum designed by quantum researchers and industry experts across 21 specialization domains.', color: '#0e76ff' },
  { id: '02', label: 'Research', title: 'Real Research Output', desc: 'Conduct original quantum research with access to labs, datasets, and mentorship from senior researchers.', color: '#3b82f6' },
  { id: '03', label: 'Innovation', title: 'IP & Prototype Development', desc: 'Develop prototypes, file patents, and build IP under guidance — from concept to validated technology.', color: '#60a5fa' },
];

const benefits = [
  { icon: '◈', title: 'Expert Mentorship', desc: 'Personal mentor from senior researchers and industry leaders.' },
  { icon: '◉', title: 'Research Publications', desc: 'Guidance on publishing in peer-reviewed journals and conferences.' },
  { icon: '◆', title: 'Patent & IP Support', desc: 'IP assessment, patent filing guidance, and technology transfer support.' },
  { icon: '◇', title: 'Prototype Development', desc: 'Access to labs and resources for building validated prototypes.' },
  { icon: '○', title: 'Pan-India Network', desc: 'Connect with 10,000+ fellows, researchers, and innovators across India.' },
  { icon: '●', title: 'Fellowship Certificate', desc: 'Nationally recognized certificate upon successful completion.' },
  { icon: '◎', title: 'Interdisciplinary Research', desc: 'Cross-domain collaboration across quantum, AI, and deep-tech fields.' },
  { icon: '◐', title: 'Career Advancement', desc: 'Tier-based pathway to regional, state, and national leadership roles.' },
  { icon: '◑', title: 'Incubation Access', desc: 'Priority access to QWV incubation programs for startup development.' },
];

export default function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} id="benefits" className="relative overflow-hidden border-t border-white/5" style={{ background: '#04080f' }}>
      {/* CSS/SVG background — replaces Three.js icosahedron WebGL */}
      <CSSParticleField variant="section" count={35} color="#0e76ff" icoWireframe className="z-0 opacity-30" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 60% 70% at 20% 50%, rgba(14,118,255,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        <div className="mb-20" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">05 / THREE PILLARS & BENEFITS</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h2 className="section-headline text-[#f3f3f3]">
              Training.
              <span className="block" style={{ color: '#0e76ff' }}>Research.</span>
              <span className="block text-[#f3f3f3]">Innovation.</span>
            </h2>
            <p className="font-archivo text-[15px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.55)' }}>
              Three strategic pillars that define the fellowship experience — structured learning, original research, and real-world innovation — supported by a comprehensive benefits ecosystem.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-16" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
          {pillars?.map((pillar, i) => (
            <div key={pillar?.id} className="relative overflow-hidden border border-white/8 p-8 group" style={{ background: 'rgba(14,118,255,0.02)', minHeight: i === 1 ? '280px' : '240px' }}>
              <div className="absolute top-4 right-6 font-archivo font-medium text-[80px] leading-none select-none pointer-events-none" style={{ color: `${pillar?.color}06` }}>{pillar?.id}</div>
              <div className="relative z-10">
                <span className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-4 block" style={{ color: pillar?.color }}>{pillar?.label}</span>
                <h3 className="font-archivo font-medium text-[22px] text-[#f3f3f3] leading-tight mb-4">{pillar?.title}</h3>
                <p className="font-archivo text-[14px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.5)' }}>{pillar?.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(to right, ${pillar?.color}, transparent)` }} />
            </div>
          ))}
        </div>

        <div className="mb-4" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}>
          <div className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase mb-8" style={{ color: 'rgba(243,243,243,0.3)' }}>Fellowship Benefits</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benefits?.map((benefit, i) => (
              <div key={benefit?.title} className="flex items-start gap-4 p-5 border border-white/6 group hover:border-[#0e76ff]/20 transition-all duration-300"
                style={{ background: 'rgba(14,118,255,0.01)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${0.4 + i * 0.05}s, transform 0.6s ease ${0.4 + i * 0.05}s, border-color 0.3s ease` }}>
                <span className="text-[#0e76ff] text-[18px] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">{benefit?.icon}</span>
                <div>
                  <h4 className="font-archivo font-medium text-[14px] text-[#f3f3f3] mb-1.5">{benefit?.title}</h4>
                  <p className="font-archivo text-[12.5px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.45)' }}>{benefit?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
