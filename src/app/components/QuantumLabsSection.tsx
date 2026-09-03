'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import dynamic from 'next/dynamic';

const QuantumNetworkGL = dynamic(() => import('./QuantumNetworkGL'), { ssr: false });

const labs = [
  {
    number: '01',
    tag: 'HEALTHCARE',
    title: 'Quantum MedTech',
    subtitle: 'Quantum-Enhanced Diagnostics',
    description: 'Advancing next-generation medical imaging and biosensing through quantum-enhanced CT/MRI, quantum imaging, diagnostic intelligence and clinical validation.',
    focus: ['Quantum CT/MRI Enhancement', 'Quantum Biosensors', 'Diagnostic Intelligence', 'Clinical Validation', 'Medical Device Productisation'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Medical imaging laboratory with MRI scanner equipment in dim blue-lit room, clinical precision atmosphere',
    accent: '#0e76ff',
  },
  {
    number: '02',
    tag: 'EDUCATION',
    title: 'Quantum EdTech',
    subtitle: 'Campus Innovation Ecosystem',
    description: 'Embedding quantum education inside universities through Centres of Excellence, interdisciplinary learning, hackathons, incubation and career-ready innovation.',
    focus: ['Quantum & AI Education', 'Centres of Excellence', 'Incubation Programs', 'Interdisciplinary Research', 'Campus Innovation Hubs'],
    image: 'https://images.unsplash.com/photo-1532094349884-543559fee673?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'University quantum computing lab with students working on computers, scientific equipment in background',
    accent: '#3b82f6',
  },
  {
    number: '03',
    tag: 'PUBLIC SAFETY',
    title: 'Quantum SecureTech',
    subtitle: 'Quantum-Safe Infrastructure',
    description: 'Securing critical public infrastructure through quantum-safe communication, threat detection, quantum sensing, cybersecurity and advanced police technology.',
    focus: ['Quantum-Safe Communication', 'Threat Detection Systems', 'Quantum Sensing', 'Cybersecurity Frameworks', 'Police Technology'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dark cybersecurity operations center with multiple screens showing network data, blue-tinted monitoring environment',
    accent: '#60a5fa',
  },
  {
    number: '04',
    tag: 'PUBLIC FINANCE',
    title: 'Quantum FinTech',
    subtitle: "Securing India\'s Financial Backbone",
    description: "Protecting and optimising India's public financial systems — PFMS, IFMS, fraud detection, quantum-safe cryptography and large-scale transaction systems.",
    focus: ['PFMS & IFMS Security', 'Fraud Detection AI', 'Quantum-Safe Cryptography', 'Transaction Optimisation', 'Financial System Architecture'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Abstract financial data visualization with dark background, glowing circuit patterns representing secure financial networks',
    accent: '#93c5fd',
  },
];

export default function QuantumLabsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      if (gl) setWebglReady(true);
    } catch {
      setWebglReady(false);
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      id="labs"
      ref={ref}
      style={{ background: 'linear-gradient(180deg, #060d1a 0%, #0a1525 50%, #060d1a 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(14,118,255,0.1) 0%, transparent 60%)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-white/20" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-white/40">
                QUANTUM CHANGE LABS
              </span>
            </div>
            <h2 className="section-headline text-[#f3f3f3] max-w-xl">
              One Model.
              <span className="block">Many Sectors.</span>
              <span className="block" style={{ color: '#0e76ff' }}>Real Governance Impact.</span>
            </h2>
          </div>
          <p className="font-archivo text-[15px] text-white/45 leading-relaxed max-w-sm">
            Four quantum research labs, each embedded in a critical sector of India&apos;s national infrastructure.
          </p>
        </div>

        {/* 3D Network Visualization Banner */}
        <div
          className="relative h-[280px] mb-0 overflow-hidden border border-white/8 border-b-0"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {webglReady ? (
            <QuantumNetworkGL className="w-full h-full" />
          ) : (
            <QuantumNetworkSVG />
          )}
          {/* Overlay gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, #060d1a 100%)' }}
          />
          {/* Label */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
            <span className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase text-white/40">
              LIVE QUANTUM NETWORK SIMULATION · GPU ACCELERATED
            </span>
          </div>
        </div>

        {/* Labs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/8 border-t-0">
          {labs?.map((lab, i) => (
            <div
              key={lab?.number}
              className="group relative overflow-hidden border-b border-r border-white/8 last:border-b-0 even:border-r-0 md:last:border-b-0 cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${i * 120 + 400}ms`,
              }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <AppImage
                  src={lab?.image}
                  alt={lab?.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #060d1a 0%, rgba(6,13,26,0.6) 50%, transparent 100%)' }} />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span
                    className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1 border"
                    style={{ color: lab?.accent, borderColor: `${lab?.accent}30`, background: `${lab?.accent}15` }}
                  >
                    {lab?.tag}
                  </span>
                </div>

                {/* Number */}
                <div
                  className="absolute top-4 right-4 font-archivo font-medium text-5xl leading-none"
                  style={{ color: `${lab?.accent}12` }}
                >
                  {lab?.number}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 bg-[rgba(38,38,41,0.45)]">
                <h3 className="font-archivo font-medium text-[20px] text-[#f3f3f3] leading-tight mb-1">
                  {lab?.title}
                </h3>
                <p className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-4">
                  {lab?.subtitle}
                </p>
                <p className="font-archivo text-[13px] text-white/55 leading-relaxed mb-5">
                  {lab?.description}
                </p>

                {/* Focus tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {lab?.focus?.slice(0, 3)?.map((f) => (
                    <span
                      key={f}
                      className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 border"
                      style={{ color: `${lab?.accent}99`, borderColor: `${lab?.accent}20`, background: `${lab?.accent}08` }}
                    >
                      {f}
                    </span>
                  ))}
                  {lab?.focus?.length > 3 && (
                    <span className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 border border-white/10 text-white/30">
                      +{lab?.focus?.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="#labs"
                  className="inline-flex items-center gap-2 font-narrow text-[11px] font-medium tracking-[0.1em] uppercase transition-all duration-300 group/cta"
                  style={{ color: lab?.accent }}
                >
                  Explore {lab?.title}
                  <svg
                    className="w-3 h-3 transition-transform group-hover/cta:translate-x-1"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Bottom accent line */}
              <div
                className="h-[2px] w-0 group-hover:w-full transition-all duration-700"
                style={{ background: `linear-gradient(90deg, ${lab?.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SVG fallback for non-WebGL environments
function QuantumNetworkSVG() {
  return (
    <div className="w-full h-full bg-[#0a1525] flex items-center justify-center">
      <svg viewBox="0 0 800 280" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(14,118,255,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="800" height="280" fill="url(#netGlow)" />
        {/* Network nodes */}
        {[
          [100, 80], [200, 140], [300, 60], [400, 160], [500, 80],
          [600, 140], [700, 90], [150, 200], [350, 220], [550, 200],
        ]?.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#0e76ff" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={y} r="8" fill="none" stroke="#0e76ff" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" values="6;12;6" dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* Connection lines */}
        {[
          [100, 80, 200, 140], [200, 140, 300, 60], [300, 60, 400, 160],
          [400, 160, 500, 80], [500, 80, 600, 140], [600, 140, 700, 90],
          [200, 140, 350, 220], [400, 160, 350, 220], [500, 80, 550, 200],
        ]?.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0e76ff" strokeWidth="0.5" opacity="0.25" />
        ))}
      </svg>
    </div>
  );
}
