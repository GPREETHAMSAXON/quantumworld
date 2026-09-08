'use client';

import React, { useEffect, useRef, useState } from 'react';

const propositions = [
  {
    tag: 'LEADERSHIP',
    title: 'Built by Proven Pioneers',
    description: 'QWV is led by Santosh Talaghatti, a visionary entrepreneur and quantum technology advocate, alongside a team of researchers, scientists and industry experts combining protocol-level expertise with institution-caliber execution.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    tag: 'OPERATIONS',
    title: 'Research as an Operating System',
    description: 'QWV runs L&D, R&D, consulting and incubation in-house, allowing the platform to be built with speed, precision and operational control — from discovery through deployment.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    tag: 'IMPACT',
    title: 'National Mission as an Advantage',
    description: "QWV is strategically aligned with India's ₹6,003 Cr National Quantum Mission, using policy alignment, institutional partnerships and government collaboration to accelerate quantum deployment at scale.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    tag: 'TRANSPARENCY',
    title: 'Committed to Real-time Clarity',
    description: 'We provide full visibility into research progress, technology deployment, partnership outcomes and impact metrics — keeping all stakeholders informed at every stage.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    tag: 'COLLABORATION',
    title: 'Partnered with the Best',
    description: "We partner with India's leading universities, IITs, AIIMS, government bodies, hospitals and technology companies to access enhanced research capabilities and real-world deployment pathways.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

export default function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="bg-[#f7f7f5] border-t border-black/8" id="propositions" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-black/30" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/50">PROPOSITIONS</span>
            </div>
            <h2 className="section-headline text-black max-w-xl">
              The Stack for Stacking
              <span className="block" style={{ color: '#0e76ff' }}>Quantum Impact</span>
            </h2>
          </div>
        </div>

        {/* Propositions list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: List */}
          <div className="border border-black/8">
            {propositions?.map((prop, i) => (
              <div
                key={prop?.tag}
                className={`prop-card cursor-pointer border-b border-black/8 last:border-b-0 ${
                  activeIndex === i ? 'bg-black/[0.04]' : ''
                }`}
                onClick={() => setActiveIndex(i)}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms`,
                }}
              >
                <div className="flex items-start gap-4 p-6">
                  {/* Icon */}
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-black/10 bg-white">
                    <span className="text-black/50">{prop?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                        {prop?.tag}
                      </span>
                      <span className="font-narrow text-[10px] text-black/30">{String(i + 1)?.padStart(2, '0')}</span>
                    </div>
                    <h3 className="font-archivo font-medium text-[17px] text-black leading-snug mb-2">
                      {prop?.title}
                    </h3>
                    <p className="font-archivo text-[13px] text-black/55 leading-relaxed">
                      {prop?.description}
                    </p>
                  </div>
                </div>
                {/* Active indicator */}
                {activeIndex === i && (
                  <div className="h-[2px] bg-[#0e76ff] w-full" />
                )}
              </div>
            ))}
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex items-center justify-center bg-[#0a1220] relative overflow-hidden">
            {/* 3D visualization */}
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
              {/* Background glow */}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(14,118,255,0.15) 0%, transparent 70%)' }}
              />

              {/* Central quantum symbol */}
              <svg
                viewBox="0 0 300 300"
                className="w-64 h-64 relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="propGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e76ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#99c5ff" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="propGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer rings */}
                <circle cx="150" cy="150" r="120" stroke="rgba(14,118,255,0.15)" strokeWidth="1" strokeDasharray="6 4">
                  <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="30s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="150" r="90" stroke="rgba(14,118,255,0.2)" strokeWidth="1" strokeDasharray="4 6">
                  <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="150" r="60" stroke="rgba(14,118,255,0.3)" strokeWidth="1">
                  <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="15s" repeatCount="indefinite" />
                </circle>

                {/* Diamond shape */}
                <polygon
                  points="150,30 230,150 150,270 70,150"
                  stroke="url(#propGrad)"
                  strokeWidth="1.5"
                  fill="rgba(14,118,255,0.05)"
                  filter="url(#propGlow)"
                />
                <line x1="150" y1="30" x2="150" y2="270" stroke="rgba(14,118,255,0.2)" strokeWidth="0.75" strokeDasharray="4 4" />
                <line x1="70" y1="150" x2="230" y2="150" stroke="rgba(14,118,255,0.2)" strokeWidth="0.75" strokeDasharray="4 4" />

                {/* Center */}
                <circle cx="150" cy="150" r="8" fill="#0e76ff" filter="url(#propGlow)">
                  <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Orbiting dots */}
                <circle cx="150" cy="30" r="4" fill="#0e76ff" opacity="0.8">
                  <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="8s" repeatCount="indefinite" />
                </circle>
                <circle cx="230" cy="150" r="3" fill="#99c5ff" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" from="120 150 150" to="480 150 150" dur="12s" repeatCount="indefinite" />
                </circle>
                <circle cx="70" cy="150" r="2.5" fill="#0e76ff" opacity="0.5">
                  <animateTransform attributeName="transform" type="rotate" from="240 150 150" to="600 150 150" dur="10s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Active proposition label */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff] mb-1">
                  {propositions?.[activeIndex]?.tag}
                </div>
                <div className="font-archivo font-medium text-[15px] text-[#f3f3f3] leading-snug">
                  {propositions?.[activeIndex]?.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}