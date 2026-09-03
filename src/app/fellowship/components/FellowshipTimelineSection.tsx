'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const phases = [
  { month: 'Month 01', phase: 'Orientation & Onboarding', desc: 'Introduction to quantum fundamentals, program structure, mentor assignment, and research domain selection.', milestones: ['Domain selection', 'Mentor assignment', 'Research brief', 'Community access'], color: '#60a5fa' },
  { month: 'Month 02–03', phase: 'Structured Learning', desc: 'Deep-dive into your specialization with curated learning paths, expert sessions, and foundational research.', milestones: ['Expert lectures', 'Literature review', 'Skill assessment', 'Peer collaboration'], color: '#3b82f6' },
  { month: 'Month 04–05', phase: 'Research & Prototyping', desc: 'Active research, prototype development, and validation under expert mentorship.', milestones: ['Research proposal', 'Prototype build', 'Lab access', 'Progress review'], color: '#2563eb' },
  { month: 'Month 06–07', phase: 'Innovation & IP', desc: 'Refine research outputs, explore IP opportunities, and prepare publications or patent disclosures.', milestones: ['IP assessment', 'Draft publication', 'Patent guidance', 'Peer review'], color: '#1d4ed8' },
  { month: 'Month 08–10', phase: 'Leadership & Outreach', desc: 'Tier advancement assessment, mentoring junior fellows, and institutional outreach activities.', milestones: ['Tier assessment', 'Junior mentoring', 'Campus outreach', 'Network building'], color: '#1e40af' },
  { month: 'Month 11–12', phase: 'Final Presentation & Certification', desc: 'Final research presentation, certification, alumni network induction, and next-tier pathway planning.', milestones: ['Final presentation', 'Certification', 'Alumni induction', 'Pathway planning'], color: '#0e76ff' },
];

export default function FellowshipTimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} id="timeline" className="relative overflow-hidden border-t border-white/5" style={{ background: '#060d1a' }}>
      {/* CSS/SVG background — replaces Three.js timeline WebGL */}
      <CSSParticleField variant="section" count={35} color="#0e76ff" scanLines className="z-0 opacity-25" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(14,118,255,0.04) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">04 / FELLOWSHIP JOURNEY</span>
            </div>
            <h2 className="section-headline text-[#f3f3f3]">
              12-Month
              <span className="block" style={{ color: '#0e76ff' }}>Research</span>
              <span className="block text-[#f3f3f3]">Journey.</span>
            </h2>
          </div>
          <p className="font-archivo text-[15px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.55)' }}>
            A structured 12-month fellowship experience designed to take you from orientation to certified quantum researcher — with clear milestones, expert mentorship, and real research outputs at every phase.
          </p>
        </div>

        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          <div className="flex gap-0 mb-0 overflow-x-auto pb-0">
            {phases?.map((phase, i) => (
              <button key={i} onClick={() => setActivePhase(i)}
                className="flex-shrink-0 flex-1 min-w-[120px] p-4 border-b-2 transition-all duration-300 text-left"
                style={{ borderBottomColor: activePhase === i ? phase?.color : 'rgba(243,243,243,0.08)', background: activePhase === i ? `${phase?.color}06` : 'transparent' }}>
                <div className="font-narrow text-[9px] font-medium tracking-[0.12em] uppercase mb-1.5"
                  style={{ color: activePhase === i ? phase?.color : 'rgba(243,243,243,0.3)' }}>{phase?.month}</div>
                <div className="font-archivo font-medium text-[12px] leading-snug"
                  style={{ color: activePhase === i ? '#f3f3f3' : 'rgba(243,243,243,0.4)' }}>{phase?.phase}</div>
              </button>
            ))}
          </div>

          <div className="border border-white/8 p-8 md:p-12" style={{ background: 'rgba(14,118,255,0.02)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: phases?.[activePhase]?.color }} />
                  <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: phases?.[activePhase]?.color }}>{phases?.[activePhase]?.month}</span>
                </div>
                <h3 className="font-archivo font-medium text-[28px] text-[#f3f3f3] leading-tight mb-4">{phases?.[activePhase]?.phase}</h3>
                <p className="font-archivo text-[15px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.55)' }}>{phases?.[activePhase]?.desc}</p>
              </div>
              <div>
                <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase mb-5" style={{ color: 'rgba(243,243,243,0.3)' }}>Key Milestones</div>
                <div className="grid grid-cols-2 gap-3">
                  {phases?.[activePhase]?.milestones?.map((milestone, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 border border-white/6" style={{ background: `${phases?.[activePhase]?.color}05` }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: phases?.[activePhase]?.color }} />
                      <span className="font-archivo text-[13px]" style={{ color: 'rgba(243,243,243,0.65)' }}>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {phases?.map((_, i) => (
              <button key={i} onClick={() => setActivePhase(i)} className="transition-all duration-300"
                style={{ width: activePhase === i ? '24px' : '6px', height: '6px', background: activePhase === i ? '#0e76ff' : 'rgba(243,243,243,0.2)', borderRadius: activePhase === i ? '3px' : '50%' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
