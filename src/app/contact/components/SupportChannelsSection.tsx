'use client';

import React, { useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const CHANNELS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'General Inquiries',
    value: 'contact@quantumworldventures.in',
    href: 'mailto:contact@quantumworldventures.in',
    note: 'Responds within 24 hours',
    tag: 'Email',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    label: 'Academic Partnerships',
    value: 'partnerships@quantumworldventures.in',
    href: 'mailto:partnerships@quantumworldventures.in',
    note: 'For institutions & universities',
    tag: 'Email',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.213c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3" />
      </svg>
    ),
    label: 'Research Collaboration',
    value: 'research@quantumworldventures.in',
    href: 'mailto:research@quantumworldventures.in',
    note: 'Joint R&D and publications',
    tag: 'Email',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: 'Programme Helpdesk',
    value: '+91 80 4567 8900',
    href: 'tel:+918045678900',
    note: 'Mon–Fri, 10 AM – 6 PM IST',
    tag: 'Phone',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Headquarters',
    value: 'Bengaluru, Karnataka, India',
    href: 'https://maps.google.com/?q=Bengaluru,Karnataka,India',
    note: 'By appointment only',
    tag: 'Office',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    ),
    label: 'Live Chat Support',
    value: 'Available on website',
    href: '#',
    note: 'Mon–Fri, 9 AM – 7 PM IST',
    tag: 'Chat',
  },
];

const TAG_COLORS: Record<string, string> = {
  Email: 'rgba(14,118,255,0.15)',
  Phone: 'rgba(0,200,150,0.12)',
  Office: 'rgba(255,180,0,0.12)',
  Chat: 'rgba(153,197,255,0.12)',
};
const TAG_TEXT: Record<string, string> = {
  Email: '#0e76ff',
  Phone: '#00c896',
  Office: '#ffb400',
  Chat: '#99c5ff',
};

export default function SupportChannelsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* Divider line */}
      <div className="absolute top-0 left-6 right-6 md:left-10 md:right-10 h-[1px] bg-[rgba(243,243,243,0.06)]" />

      <CSSParticleField variant="section" count={25} color="#0e76ff" hexGrid className="z-0 opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
                Support Channels
              </span>
            </div>
            <h2
              className="font-archivo font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', color: '#f3f3f3' }}
            >
              Multiple Ways to
              <span style={{ color: '#0e76ff' }}> Reach Us.</span>
            </h2>
          </div>
          <p className="font-archivo text-[14px] leading-relaxed max-w-sm" style={{ color: 'rgba(243,243,243,0.45)' }}>
            Choose the channel that best suits your inquiry. All channels are monitored by our
            dedicated team.
          </p>
        </div>

        {/* Bento grid — asymmetric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((ch, i) => (
            <a
              key={i}
              href={ch.href}
              target={ch.tag === 'Office' ? '_blank' : undefined}
              rel={ch.tag === 'Office' ? 'noopener noreferrer' : undefined}
              className="group relative flex flex-col gap-4 p-6 rounded-[10px] border border-[rgba(243,243,243,0.07)] transition-all duration-300 overflow-hidden"
              style={{
                background:
                  hovered === i
                    ? 'rgba(14,118,255,0.06)'
                    : 'rgba(14,118,255,0.02)',
                borderColor: hovered === i ? 'rgba(14,118,255,0.25)' : 'rgba(243,243,243,0.07)',
                transform: hovered === i ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tag */}
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{
                    background: TAG_COLORS[ch.tag] || 'rgba(14,118,255,0.1)',
                    color: TAG_TEXT[ch.tag] || '#0e76ff',
                  }}
                >
                  {ch.icon}
                </div>
                <span
                  className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                  style={{
                    background: TAG_COLORS[ch.tag] || 'rgba(14,118,255,0.1)',
                    color: TAG_TEXT[ch.tag] || '#0e76ff',
                  }}
                >
                  {ch.tag}
                </span>
              </div>

              <div>
                <p className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase mb-1.5" style={{ color: 'rgba(243,243,243,0.45)' }}>
                  {ch.label}
                </p>
                <p className="font-archivo text-[15px] font-medium text-[#f3f3f3] group-hover:text-[#0e76ff] transition-colors duration-200 break-all">
                  {ch.value}
                </p>
              </div>

              <p className="font-narrow text-[11px] tracking-wide mt-auto" style={{ color: 'rgba(243,243,243,0.35)' }}>
                {ch.note}
              </p>

              {/* Arrow */}
              <div
                className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ transform: hovered === i ? 'translate(0,0)' : 'translate(4px,4px)' }}
              >
                <svg className="w-4 h-4 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
