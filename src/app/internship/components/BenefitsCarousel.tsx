'use client';

import React, { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Personal Mentor',
    description: 'Every intern is assigned a dedicated personal mentor — a researcher, industry expert, or senior fellow — providing structured 1:1 guidance throughout the programme.',
    tag: 'Mentorship',
    color: '#0e76ff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: 'Real Project',
    description: 'Work on a live project within the QWV research ecosystem — not a simulated exercise. Your work contributes to real research, product development, or institutional initiatives.',
    tag: 'Real Work',
    color: '#1a8cff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Structured Training',
    description: 'Six carefully designed modules covering soft skills, technical competencies, project management, and governance — building a complete professional profile.',
    tag: 'Curriculum',
    color: '#2a9fff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Final Presentation',
    description: 'Present your project to QWV leadership, mentors, and industry partners at the culminating Demo Day — a high-stakes, high-reward showcase of your 6-month journey.',
    tag: 'Demo Day',
    color: '#3ab2ff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Certificate',
    description: 'Receive a Quantum World Ventures internship certificate upon successful completion — recognised across the QWV institutional network and partner organisations.',
    tag: 'Certification',
    color: '#4ac5ff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Global Network',
    description: 'Join the QWV alumni network — a growing community of quantum-ready professionals, researchers, and innovators spanning institutions and industries across India and beyond.',
    tag: 'Alumni Network',
    color: '#5ad8ff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Portfolio Project',
    description: 'Build a tangible portfolio project that demonstrates real-world quantum and AI competency — a powerful differentiator for further studies, research positions, or industry careers.',
    tag: 'Portfolio',
    color: '#0e76ff',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Mentor Reference',
    description: 'Earn a professional reference from your assigned mentor — a researcher, industry expert, or QWV senior fellow — to support your next career or academic step.',
    tag: 'Reference',
    color: '#1a8cff',
  },
];

export default function BenefitsCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % benefits?.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [visible, isPaused]);

  const visibleCount = 3;
  const displayedBenefits = [...benefits, ...benefits]?.slice(activeIndex, activeIndex + visibleCount);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#04080f' }}>
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(14,118,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,0.8) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">
              05 / Programme Benefits
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-archivo font-bold leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f3f3f3' }}>
              What You Gain<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                From This Programme
              </span>
            </h2>
            <p className="font-archivo text-[rgba(243,243,243,0.5)] max-w-sm leading-relaxed text-sm">
              Eight tangible outcomes designed to accelerate your career, deepen your expertise, and expand your professional network.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s',
          }}
        >
          {/* Cards grid */}
          <div ref={trackRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {benefits?.map((benefit, i) => {
              const isActive = i === activeIndex % benefits?.length;
              return (
                <div
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="relative cursor-pointer transition-all duration-500 group"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${benefit?.color}15 0%, ${benefit?.color}05 100%)`
                      : 'rgba(14,118,255,0.03)',
                    border: `1px solid ${isActive ? benefit?.color + '45' : 'rgba(14,118,255,0.1)'}`,
                    padding: '24px',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: `linear-gradient(90deg, transparent, ${benefit?.color}, transparent)` }} />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isActive ? `${benefit?.color}20` : 'rgba(14,118,255,0.06)',
                        border: `1px solid ${isActive ? benefit?.color + '40' : 'rgba(14,118,255,0.15)'}`,
                        color: benefit?.color,
                      }}>
                      {benefit?.icon}
                    </div>
                    <div className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2 py-1"
                      style={{
                        background: `${benefit?.color}12`,
                        border: `1px solid ${benefit?.color}25`,
                        color: benefit?.color,
                      }}>
                      {benefit?.tag}
                    </div>
                  </div>

                  <h3 className="font-archivo font-semibold text-[#f3f3f3] mb-2 text-[0.95rem]">{benefit?.title}</h3>
                  <p className="font-archivo text-[rgba(243,243,243,0.5)] text-[12px] leading-relaxed">{benefit?.description}</p>
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2">
            {benefits?.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all duration-300"
                style={{
                  width: i === activeIndex % benefits?.length ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === activeIndex % benefits?.length ? '#0e76ff' : 'rgba(14,118,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
