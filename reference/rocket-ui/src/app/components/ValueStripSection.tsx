'use client';

import React, { useEffect, useRef, useState } from 'react';

const metrics = [
  { value: '12', label: 'Core Research Domains', sub: 'Quantum + AI verticals' },
  { value: "World\'s First", label: 'Quantum MedTech Lab', sub: 'Independent initiative' },
  { value: '21', label: 'Specialized Fellowships', sub: 'Across 8-tier pathway' },
  { value: '3', label: 'Service Verticals', sub: 'L&D · R&D · Consulting' },
  { value: '10K+', label: 'Target Participants', sub: 'Fellowship & Internship' },
  { value: '₹6,003Cr', label: 'National Quantum Mission', sub: 'DST India commitment' },
];

export default function ValueStripSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="bg-[#f7f7f5] border-t border-black/8" ref={ref}>
      {/* Ticker strip */}
      <div className="border-b border-black/8 overflow-hidden py-3 bg-black/[0.02]">
        <div className="ticker-track inline-flex gap-12">
          {[...Array(3)]?.map((_, rep) => (
            <React.Fragment key={rep}>
              {['Quantum MedTech', 'Quantum EdTech', 'Quantum FinTech', 'Quantum SecureTech', 'National Quantum Mission', 'L&D Programs', 'R&D Division', 'Consulting', 'Fellowship Program', 'India Deep Tech']?.map((item) => (
                <span key={item} className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/40 flex items-center gap-4">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-[#0e76ff] inline-block" />
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-black/8">
          {metrics?.map((m, i) => (
            <div
              key={m?.label}
              className="p-8 group hover:bg-black/[0.02] transition-colors duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] mb-5" style={{ animation: `pulseDot 2s ease-in-out infinite ${i * 0.3}s` }} />
              <div className="font-archivo font-medium text-2xl md:text-3xl text-black leading-none mb-2 tracking-tight">
                {m?.value}
              </div>
              <div className="font-archivo text-[13px] font-medium text-black mb-1 leading-tight">{m?.label}</div>
              <div className="font-narrow text-[11px] text-black/45 tracking-wide">{m?.sub}</div>

              {/* Hover shimmer */}
              <div className="mt-4 h-[1px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="shimmer h-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NQM badge */}
      <div className="border-t border-black/8 py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
          <span className="font-narrow text-[11px] font-medium tracking-[0.12em] uppercase text-black/50">
            Aligned with India&apos;s{' '}
            <span className="text-black font-medium">National Quantum Mission</span>
            {' '}— Department of Science &amp; Technology, Government of India
          </span>
        </div>
      </div>
    </section>
  );
}