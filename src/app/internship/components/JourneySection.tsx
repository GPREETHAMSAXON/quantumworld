'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const months = [
  { month: 'Month 01', phase: 'Orientation', icon: '◎', description: 'Welcome to the QWV ecosystem. Onboarding sessions, mentor assignment, programme overview, and goal-setting workshops. Understand the quantum landscape and your role within it.', milestones: ['Mentor assignment', 'Programme orientation', 'Goal-setting workshop', 'Ecosystem introduction'], color: '#0e76ff', accent: 'rgba(14,118,255,0.15)' },
  { month: 'Month 02', phase: 'Skill Building', icon: '⬡', description: 'Intensive technical and soft-skills training. Module 01 and Module 02 run in parallel — building your professional foundation alongside domain-specific technical competencies.', milestones: ['Technical skills training', 'Soft skills workshops', 'Domain deep-dives', 'Peer learning circles'], color: '#1a8cff', accent: 'rgba(26,140,255,0.12)' },
  { month: 'Month 03', phase: 'Mentorship', icon: '◈', description: 'Deep mentorship phase. Weekly 1:1 sessions with your assigned mentor. Research guidance, career counselling, and introduction to live projects within the QWV research ecosystem.', milestones: ['Weekly 1:1 mentor sessions', 'Research area selection', 'Project brief development', 'Network expansion'], color: '#2a9fff', accent: 'rgba(42,159,255,0.12)' },
  { month: 'Month 04', phase: 'Project Development', icon: '◇', description: 'The core execution phase. Work on your assigned real project using agile methodology. Weekly check-ins, milestone reviews, and iterative development with mentor oversight.', milestones: ['Project kickoff', 'Sprint planning & execution', 'Mid-point review', 'Prototype development'], color: '#3ab2ff', accent: 'rgba(58,178,255,0.12)' },
  { month: 'Month 05', phase: 'Refinement', icon: '◉', description: 'Polish, validate, and prepare. Refine your project based on feedback, conduct user testing or research validation, and begin building your final presentation narrative.', milestones: ['Project refinement', 'Validation & testing', 'Pitch preparation', 'Portfolio documentation'], color: '#4ac5ff', accent: 'rgba(74,197,255,0.12)' },
  { month: 'Month 06', phase: 'Final Pitch + Certification + Alumni', icon: '★', description: 'The culmination. Present your project to QWV leadership, mentors, and industry partners. Receive your certification, join the QWV alumni network, and unlock your next opportunity.', milestones: ['Final pitch presentation', 'Certification ceremony', 'Alumni network induction', 'Career pathway guidance'], color: '#5ad8ff', accent: 'rgba(90,216,255,0.15)', highlight: true },
];

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeMonth, setActiveMonth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setActiveMonth(prev => (prev + 1) % 6), 3500);
    return () => clearInterval(interval);
  }, [visible]);

  const active = months[activeMonth];

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG background — replaces Three.js journey path WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" spiral className="z-0" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, #060d1a 0%, rgba(6,13,26,0.55) 50%, #060d1a 100%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">04 / Month-by-Month Journey</span>
          </div>
          <h2 className="font-archivo font-bold leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f3f3f3' }}>
            Your 6-Month<br />
            <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Transformation Arc</span>
          </h2>
        </div>

        <div className="relative mb-12" style={{ opacity: visible ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s' }}>
          <div className="absolute top-6 left-0 right-0 h-[1px] hidden md:block" style={{ background: 'rgba(14,118,255,0.15)' }} />
          <div className="absolute top-6 left-0 h-[1px] hidden md:block transition-all duration-700"
            style={{ background: 'linear-gradient(90deg, #0e76ff, #5ad8ff)', width: `${((activeMonth + 1) / 6) * 100}%` }} />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-0">
            {months.map((m, i) => (
              <button key={i} onClick={() => setActiveMonth(i)} className="relative flex flex-col items-center gap-3 group">
                <div className="relative z-10 w-12 h-12 flex items-center justify-center transition-all duration-500"
                  style={{ background: i <= activeMonth ? m.color : 'rgba(14,118,255,0.08)', border: `2px solid ${i <= activeMonth ? m.color : 'rgba(14,118,255,0.2)'}`, borderRadius: '50%', boxShadow: i === activeMonth ? `0 0 20px ${m.color}60` : 'none' }}>
                  <span className="text-[18px]" style={{ color: i <= activeMonth ? '#fff' : 'rgba(243,243,243,0.3)' }}>{m.icon}</span>
                </div>
                <div className="text-center">
                  <div className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase mb-0.5" style={{ color: i <= activeMonth ? m.color : 'rgba(243,243,243,0.3)' }}>{m.month}</div>
                  <div className="font-archivo text-[11px] font-medium hidden md:block" style={{ color: i === activeMonth ? '#f3f3f3' : 'rgba(243,243,243,0.4)' }}>{m.phase.split(' ')[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.35s' }}>
          <div className="lg:col-span-3 relative p-8 transition-all duration-500"
            style={{ background: `linear-gradient(135deg, ${active.accent} 0%, rgba(14,118,255,0.03) 100%)`, border: `1px solid ${active.color}35` }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${active.color}, transparent)` }} />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center text-3xl" style={{ background: `${active.color}15`, border: `1px solid ${active.color}30` }}>{active.icon}</div>
              <div>
                <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-1" style={{ color: active.color }}>{active.month}</div>
                <h3 className="font-archivo font-bold text-[#f3f3f3]" style={{ fontSize: '1.4rem' }}>{active.phase}</h3>
              </div>
              {(active as typeof months[5]).highlight && (
                <div className="ml-auto font-narrow text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ background: `${active.color}20`, border: `1px solid ${active.color}40`, color: active.color }}>Culmination</div>
              )}
            </div>
            <p className="font-archivo text-[rgba(243,243,243,0.65)] leading-relaxed mb-8" style={{ fontSize: '1rem' }}>{active.description}</p>
            <div className="flex items-center gap-3">
              <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[rgba(243,243,243,0.35)]">Progress</div>
              <div className="flex-1 h-[2px] rounded-full" style={{ background: 'rgba(14,118,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((activeMonth + 1) / 6) * 100}%`, background: `linear-gradient(90deg, #0e76ff, ${active.color})` }} />
              </div>
              <div className="font-narrow text-[10px] font-medium tracking-[0.1em]" style={{ color: active.color }}>{Math.round(((activeMonth + 1) / 6) * 100)}%</div>
            </div>
          </div>

          <div className="lg:col-span-2 p-8" style={{ background: 'rgba(14,118,255,0.03)', border: '1px solid rgba(14,118,255,0.1)' }}>
            <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(243,243,243,0.4)' }}>Key Milestones</div>
            <div className="space-y-4">
              {active.milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${active.color}15`, border: `1px solid ${active.color}40` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: active.color }} />
                  </div>
                  <span className="font-archivo text-[rgba(243,243,243,0.65)] text-sm leading-relaxed">{milestone}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-8 pt-6" style={{ borderTop: '1px solid rgba(14,118,255,0.1)' }}>
              <button onClick={() => setActiveMonth(prev => Math.max(0, prev - 1))} disabled={activeMonth === 0}
                className="w-9 h-9 flex items-center justify-center transition-all duration-300"
                style={{ background: activeMonth === 0 ? 'rgba(14,118,255,0.03)' : 'rgba(14,118,255,0.1)', border: `1px solid ${activeMonth === 0 ? 'rgba(14,118,255,0.1)' : 'rgba(14,118,255,0.3)'}`, color: activeMonth === 0 ? 'rgba(243,243,243,0.2)' : '#0e76ff', cursor: activeMonth === 0 ? 'not-allowed' : 'pointer' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex-1 text-center font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-[rgba(243,243,243,0.4)]">{activeMonth + 1} / 6</div>
              <button onClick={() => setActiveMonth(prev => Math.min(5, prev + 1))} disabled={activeMonth === 5}
                className="w-9 h-9 flex items-center justify-center transition-all duration-300"
                style={{ background: activeMonth === 5 ? 'rgba(14,118,255,0.03)' : 'rgba(14,118,255,0.1)', border: `1px solid ${activeMonth === 5 ? 'rgba(14,118,255,0.1)' : 'rgba(14,118,255,0.3)'}`, color: activeMonth === 5 ? 'rgba(243,243,243,0.2)' : '#0e76ff', cursor: activeMonth === 5 ? 'not-allowed' : 'pointer' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
