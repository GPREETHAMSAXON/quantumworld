'use client';

import React, { useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

interface Resource {
  id: number;
  category: string;
  title: string;
  description: string;
  format: string;
  size: string;
  pages?: number;
  downloads: string;
  tags: string[];
  color: string;
  accentColor: string;
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: 1,
    category: 'Curriculum Guide',
    title: 'QWV Quantum Literacy Curriculum Framework v2.0',
    description: 'Complete 8-tier competency mapping for quantum workforce development. Includes learning objectives, assessment rubrics, simulation lab guides, and industry alignment matrices for each fellowship tier.',
    format: 'PDF',
    size: '4.2 MB',
    pages: 84,
    downloads: '1,240',
    tags: ['Education', 'Fellowship', 'Curriculum'],
    color: '#0e76ff',
    accentColor: 'rgba(14,118,255,0.08)',
    featured: true,
  },
  {
    id: 2,
    category: 'Technical Report',
    title: 'Post-Quantum Cryptography Migration Playbook',
    description: 'Step-by-step migration guide from RSA/ECC to NIST PQC standards. Covers CRYSTALS-Kyber, Dilithium, FALCON implementation, hybrid transition modes, and compliance mapping for Indian financial regulators.',
    format: 'PDF',
    size: '6.8 MB',
    pages: 112,
    downloads: '892',
    tags: ['Security', 'PQC', 'NIST', 'Migration'],
    color: '#6366f1',
    accentColor: 'rgba(99,102,241,0.08)',
    featured: true,
  },
  {
    id: 3,
    category: 'Research Brief',
    title: 'Quantum Computing Readiness Assessment for Indian Enterprises',
    description: 'A 12-point readiness framework for organisations evaluating quantum adoption. Covers infrastructure prerequisites, talent gap analysis, use-case prioritisation, and 3-year roadmap templates.',
    format: 'PDF',
    size: '2.1 MB',
    pages: 36,
    downloads: '634',
    tags: ['Enterprise', 'Strategy', 'Readiness'],
    color: '#10b981',
    accentColor: 'rgba(16,185,129,0.08)',
  },
  {
    id: 4,
    category: 'Dataset',
    title: 'QWV Quantum Circuit Benchmark Suite (QCBS-2026)',
    description: 'Standardised benchmark circuits for NISQ hardware evaluation. Includes 200+ circuits across 6 algorithm families with noise characterisation data from IBM Quantum, Quantinuum, and IonQ hardware.',
    format: 'ZIP',
    size: '18.4 MB',
    downloads: '421',
    tags: ['Benchmarking', 'NISQ', 'Circuits', 'Dataset'],
    color: '#f59e0b',
    accentColor: 'rgba(245,158,11,0.08)',
  },
  {
    id: 5,
    category: 'Slide Deck',
    title: 'Quantum-AI Convergence: Executive Briefing 2026',
    description: 'Board-level presentation on quantum-AI hybrid opportunities, investment landscape, risk assessment, and strategic positioning for Indian enterprises. Includes sector-specific use-case matrices.',
    format: 'PPTX',
    size: '8.9 MB',
    pages: 48,
    downloads: '756',
    tags: ['Executive', 'Strategy', 'AI', 'Quantum'],
    color: '#0ea5e9',
    accentColor: 'rgba(14,165,233,0.08)',
  },
  {
    id: 6,
    category: 'Lab Manual',
    title: 'Hands-On Quantum Programming with Qiskit & PennyLane',
    description: 'Practical lab manual for 14 QWV course modules. Covers circuit construction, variational algorithms, noise simulation, and hybrid model implementation with step-by-step Jupyter notebook exercises.',
    format: 'PDF',
    size: '11.2 MB',
    pages: 196,
    downloads: '1,089',
    tags: ['Qiskit', 'PennyLane', 'Programming', 'Labs'],
    color: '#8b5cf6',
    accentColor: 'rgba(139,92,246,0.08)',
  },
];

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  PDF: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ZIP: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  PPTX: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
};

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1800);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, rgba(6,13,26,0.97) 0%, ${resource.accentColor} 100%)`,
        border: `1px solid ${resource.color}1e`,
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0 ? `0 20px 50px ${resource.color}15` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${resource.color}70, transparent)` }} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: resource.color + '18', color: resource.color, border: `1px solid ${resource.color}30` }}
          >
            {FORMAT_ICONS[resource.format] || FORMAT_ICONS['PDF']}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-narrow text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: resource.color }}>{resource.category}</span>
              {resource.featured && (
                <span className="font-narrow text-[8px] font-bold tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full bg-[#0e76ff]/15 text-[#0e76ff] border border-[#0e76ff]/25">
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-archivo font-semibold text-[0.9rem] leading-snug text-[#f3f3f3] group-hover:text-white transition-colors line-clamp-2">
              {resource.title}
            </h3>
          </div>
        </div>

        <p className="font-narrow text-[0.78rem] text-[rgba(243,243,243,0.5)] leading-relaxed line-clamp-3 mb-4">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {resource.tags.map(tag => (
            <span
              key={tag}
              className="font-narrow text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: resource.color + '10', color: resource.color + 'bb', border: `1px solid ${resource.color}1e` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta + Download */}
        <div className="flex items-center justify-between pt-4 border-t border-white/6">
          <div className="flex items-center gap-3">
            <span className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)]">
              {resource.format} · {resource.size}
              {resource.pages ? ` · ${resource.pages}pp` : ''}
            </span>
            <span className="font-narrow text-[10px] text-[rgba(243,243,243,0.3)]">↓ {resource.downloads}</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 font-narrow text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: downloading ? resource.color + '30' : resource.color + '18',
              color: resource.color,
              border: `1px solid ${resource.color}30`,
            }}
          >
            {downloading ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Preparing
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourceDownloadsSection() {
  return (
    <section id="resources" className="py-24 relative overflow-hidden" style={{ background: '#04090f' }}>
      {/* CSS/SVG background — replaces Three.js octahedron + radial rings + particle WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" orbitalRings className="z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#04090f]/70 via-transparent to-[#04090f] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0e76ff]">Resource Library</span>
          </div>
          <h2 className="font-archivo font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#f3f3f3] leading-tight mb-3">Downloads & Resources</h2>
          <p className="font-narrow text-[0.9rem] text-[rgba(243,243,243,0.5)] max-w-xl">
            Curriculum guides, technical reports, benchmark datasets, and executive briefings — free to download for QWV community members and researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {RESOURCES.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>

        <div className="relative rounded-2xl overflow-hidden p-8 md:p-10"
          style={{ background: 'linear-gradient(135deg, rgba(14,118,255,0.12) 0%, rgba(6,13,26,0.97) 100%)', border: '1px solid rgba(14,118,255,0.2)' }}>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#0e76ff] via-[#3b82f6] to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-archivo font-bold text-[1.3rem] text-[#f3f3f3] mb-2">Contribute to the QWV Research Library</h3>
              <p className="font-narrow text-[0.85rem] text-[rgba(243,243,243,0.55)] max-w-lg">
                QWV Fellows and researchers can submit original work for peer review and publication in the QWV Technical Report Series. Open to all fellowship tiers Level 3 and above.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="/fellowship" className="btn-ghost font-narrow text-[11px] whitespace-nowrap">Join Fellowship</a>
              <a href="#contact" className="btn-primary font-narrow text-[11px] whitespace-nowrap flex items-center gap-2">
                Submit Research
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
