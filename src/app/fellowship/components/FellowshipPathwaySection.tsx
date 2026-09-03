'use client';

import React, { useRef, useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const tiers = [
  { number: 'T1', title: 'Campus Ambassador', badge: 'Entry', audience: 'Undergraduate Students', desc: 'Entry-level representatives spreading quantum awareness across campuses and institutions.', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.06)' },
  { number: 'T2', title: 'Student Fellow', badge: 'Foundation', audience: 'UG / PG Students', desc: 'Undergraduate and postgraduate students engaged in structured quantum research and learning.', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.06)' },
  { number: 'T3', title: 'Faculty Fellow', badge: 'Academic', audience: 'University Faculty', desc: 'Academic faculty integrating quantum education into university curricula and research programs.', color: '#2563eb', bgColor: 'rgba(37,99,235,0.06)' },
  { number: 'T4', title: 'Senior Fellow', badge: 'Advanced', audience: 'Researchers & Professionals', desc: 'Experienced researchers and professionals leading domain-specific quantum research initiatives.', color: '#1d4ed8', bgColor: 'rgba(29,78,216,0.06)' },
  { number: 'T5', title: 'Fellow of Fellows', badge: 'Elite', audience: 'Senior Researchers', desc: 'Elite researchers mentoring junior fellows and driving cross-domain quantum innovation.', color: '#1e40af', bgColor: 'rgba(30,64,175,0.06)' },
  { number: 'T6', title: 'Regional Fellowship Director', badge: 'Regional', audience: 'Regional Leaders', desc: 'Leaders overseeing fellowship programs across multiple cities and institutions in a region.', color: '#0e76ff', bgColor: 'rgba(14,118,255,0.06)' },
  { number: 'T7', title: 'State Fellowship Director', badge: 'State', audience: 'State-Level Directors', desc: 'State-level directors coordinating quantum education and research ecosystems across entire states.', color: '#0e76ff', bgColor: 'rgba(14,118,255,0.08)' },
  { number: 'T8', title: 'National Fellowship Director', badge: 'National', audience: 'National Leaders', desc: "The apex of the fellowship pathway — national leaders shaping India\'s quantum talent ecosystem.", color: '#0e76ff', bgColor: 'rgba(14,118,255,0.1)' },
];

// ===== 3D TILT TIER CARD =====
function TierCard({ tier, index, visible }: { tier: typeof tiers[0]; index: number; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    setHovered(false);
  };

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.7s ease ${index * 80}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms` }}>
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden border border-white/8 bg-white/[0.025] hover:border-white/15 transition-colors duration-300 p-5"
        style={{ transition: 'transform 0.15s ease-out, border-color 0.3s ease', transformStyle: 'preserve-3d', position: 'relative', overflow: 'hidden', cursor: 'default', minHeight: '180px' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 flex items-center justify-center font-archivo font-medium text-[13px]"
            style={{ background: tier.bgColor, border: `1px solid ${tier.color}30`, color: tier.color }}>
            {tier.number}
          </div>
          <span className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2 py-1 border"
            style={{ borderColor: `${tier.color}25`, color: tier.color, background: `${tier.color}08` }}>
            {tier.badge}
          </span>
        </div>
        <h4 className="font-archivo font-medium text-[15px] text-[#f3f3f3] leading-snug mb-1.5">{tier.title}</h4>
        <p className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase mb-2.5" style={{ color: tier.color }}>{tier.audience}</p>
        <p className="font-archivo text-[12px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.42)' }}>{tier.desc}</p>
        <div className="absolute right-4 bottom-4 flex flex-col items-center gap-0.5"
          style={{ opacity: hovered ? 0.9 : 0.2, transition: 'opacity 0.3s ease' }}>
          {[...Array(index + 1)].map((_, j) => (
            <div key={j} className="w-1 h-1 rounded-full" style={{ background: tier.color }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{ width: hovered ? '100%' : '0%', background: `linear-gradient(to right, ${tier.color}, transparent)` }} />
      </div>
    </div>
  );
}

export default function FellowshipPathwaySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="pathway" className="relative overflow-hidden border-t border-white/5" style={{ background: '#060d1a' }}>
      {/* CSS/SVG background — replaces Three.js spiral WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" spiral className="z-0 opacity-35" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 70% 80% at 15% 50%, rgba(14,118,255,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">02 / 8-TIER LEADERSHIP PATHWAY</span>
            </div>
            <h2 className="section-headline text-[#f3f3f3]">
              From Campus
              <span className="block" style={{ color: '#0e76ff' }}>to National</span>
              <span className="block text-[#f3f3f3]">Leadership.</span>
            </h2>
          </div>
          <div>
            <p className="font-archivo text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(243,243,243,0.55)' }}>
              An ascending 8-tier pathway designed to grow quantum talent from campus-level awareness to national leadership — with structured milestones, mentorship, and institutional responsibilities at every level.
            </p>
            <div className="grid grid-cols-3 gap-0 border border-white/8">
              {[{ value: '8', label: 'Leadership Tiers' }, { value: 'Pan-India', label: 'Network Reach' }, { value: '10K+', label: 'Target Fellows' }].map((stat) => (
                <div key={stat.label} className="p-5 border-r border-white/8 last:border-r-0 text-center">
                  <div className="font-archivo font-medium text-[22px] text-[#f3f3f3] leading-none mb-1">{stat.value}</div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: 'rgba(243,243,243,0.4)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(243,243,243,0.3)' }}>Campus Level</span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to right, rgba(14,118,255,0.4), rgba(14,118,255,0.1))' }} />
          <svg className="w-4 h-4 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to left, rgba(14,118,255,0.4), rgba(14,118,255,0.1))' }} />
          <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">National Level</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier, i) => (
            <TierCard key={tier.number} tier={tier} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
