'use client';

import React, { useEffect, useRef, useState } from 'react';

function EligibilityGL() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = mountRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }

    let t = 0;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scanning line
      const scanY = ((Math.sin(t * 0.5) + 1) / 2) * canvas.height;
      const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, 'rgba(14,118,255,0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 60, canvas.width, 120);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,118,255,${p.alpha})`;
        ctx.fill();
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

const tracks = [
  {
    code: 'UG',
    title: 'Undergraduate',
    subtitle: 'B.Tech / B.Sc / BCA / BA / B.Com',
    description: 'Final-year and pre-final-year undergraduate students from any discipline are eligible. No prior quantum knowledge required — curiosity and commitment are the only prerequisites.',
    requirements: ['Currently enrolled in UG programme', 'Minimum 60% aggregate', 'Any discipline welcome', 'Final or pre-final year'],
    color: '#0e76ff',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    code: 'PG',
    title: 'Postgraduate',
    subtitle: 'M.Tech / M.Sc / MBA / MA / MCA',
    description: 'Postgraduate students gain access to advanced research tracks, deeper mentorship, and the opportunity to contribute to live R&D projects within Quantum World Ventures labs.',
    requirements: ['Currently enrolled in PG programme', 'Minimum 65% aggregate', 'Research aptitude preferred', 'STEM or management background'],
    color: '#3b82f6',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    code: 'PhD',
    title: 'Doctoral',
    subtitle: 'PhD / Research Scholar / Post-Doc',
    description: 'Doctoral researchers and post-doctoral scholars engage with cutting-edge quantum research, co-authoring publications, contributing to IP development, and leading innovation challenges.',
    requirements: ['Enrolled in PhD / Post-Doc', 'Active research in relevant domain', 'Publication record preferred', 'Supervisor endorsement required'],
    color: '#60a5fa',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

export default function EligibilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#060d1a' }}>
      <div className="absolute inset-0 z-0">
        <EligibilityGL />
      </div>
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(180deg, #060d1a 0%, rgba(6,13,26,0.6) 50%, #060d1a 100%)',
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
              02 / Eligibility
            </span>
          </div>
          <h2 className="font-archivo font-bold leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f3f3f3' }}>
            Who Can Apply
          </h2>
          <p className="font-archivo text-[rgba(243,243,243,0.55)] max-w-xl leading-relaxed" style={{ fontSize: '1.05rem' }}>
            Three distinct tracks designed for students at every stage of their academic journey — from undergraduate to doctoral research.
          </p>
        </div>

        {/* Track selector */}
        <div className="flex gap-2 mb-10" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s',
        }}>
          {tracks.map((track, i) => (
            <button
              key={i}
              onClick={() => setActiveTrack(i)}
              className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-300"
              style={{
                background: activeTrack === i ? track.color : 'rgba(14,118,255,0.05)',
                border: `1px solid ${activeTrack === i ? track.color : 'rgba(14,118,255,0.2)'}`,
                color: activeTrack === i ? '#fff' : 'rgba(243,243,243,0.5)',
              }}
            >
              {track.code}
            </button>
          ))}
        </div>

        {/* Track cards — asymmetric bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {tracks.map((track, i) => (
            <div
              key={i}
              onClick={() => setActiveTrack(i)}
              className="relative cursor-pointer group transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${0.2 + i * 0.12}s`,
                background: activeTrack === i
                  ? `linear-gradient(135deg, rgba(14,118,255,0.12) 0%, rgba(14,118,255,0.04) 100%)`
                  : 'rgba(14,118,255,0.03)',
                border: `1px solid ${activeTrack === i ? track.color + '40' : 'rgba(14,118,255,0.12)'}`,
                padding: '32px',
              }}
            >
              {/* Active indicator */}
              {activeTrack === i && (
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${track.color}, transparent)` }} />
              )}

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: `rgba(14,118,255,0.1)`, border: `1px solid ${track.color}30`, color: track.color }}>
                    {track.icon}
                  </div>
                  <div>
                    <div className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase mb-0.5" style={{ color: track.color }}>
                      {track.code} Track
                    </div>
                    <div className="font-archivo font-semibold text-[#f3f3f3] text-lg">{track.title}</div>
                  </div>
                </div>
                <div className="font-narrow text-[10px] tracking-[0.1em] uppercase px-2 py-1" style={{ background: `${track.color}15`, color: track.color, border: `1px solid ${track.color}30` }}>
                  Open
                </div>
              </div>

              <p className="font-narrow text-[11px] font-medium tracking-[0.08em] uppercase mb-3" style={{ color: 'rgba(243,243,243,0.35)' }}>
                {track.subtitle}
              </p>

              <p className="font-archivo text-[rgba(243,243,243,0.6)] text-sm leading-relaxed mb-6">
                {track.description}
              </p>

              <div className="space-y-2">
                {track.requirements.map((req, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: track.color }} />
                    <span className="font-archivo text-[rgba(243,243,243,0.5)] text-[13px]">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
