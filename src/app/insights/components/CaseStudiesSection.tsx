'use client';

import React, { useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

interface CaseStudy {
  id: number;
  number: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  color: string;
  accentColor: string;
  status: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    number: 'CS-01',
    sector: 'Financial Services',
    title: 'Quantum Portfolio Optimisation for a Tier-1 Asset Manager',
    challenge: 'A 200-asset portfolio rebalancing problem requiring sub-second execution across correlated equity, bond, and derivative positions — classical solvers taking 4+ minutes per cycle.',
    approach: 'Deployed QAOA on IBM Quantum Eagle (127-qubit) with a hybrid classical pre-processing layer for constraint encoding. Integrated with existing risk management infrastructure via REST API.',
    outcome: 'Achieved 94% solution quality vs. classical optimal in 0.8 seconds. Reduced rebalancing latency by 82% in simulation. Validated on 6-month historical data.',
    metrics: [
      { label: 'Latency Reduction', value: '82%' },
      { label: 'Solution Quality', value: '94%' },
      { label: 'Assets Optimised', value: '200' },
    ],
    color: '#0e76ff',
    accentColor: 'rgba(14,118,255,0.08)',
    status: 'Simulation Validated',
  },
  {
    id: 2,
    number: 'CS-02',
    sector: 'Healthcare & Diagnostics',
    title: 'Quantum-Enhanced MRI Reconstruction for Faster Clinical Throughput',
    challenge: 'Compressed sensing MRI reconstruction bottleneck causing 45-minute scan-to-diagnosis delays in a 600-bed hospital network. Classical iterative solvers computationally prohibitive for real-time use.',
    approach: 'Applied variational quantum algorithms for sparse signal recovery combined with classical deep learning post-processing. Tested on 1.5T and 3T scanner outputs across 3 anatomical regions.',
    outcome: 'Reconstruction time reduced from 45 minutes to under 4 minutes in hybrid simulation. Image quality SSIM score improved by 12% over classical compressed sensing baseline.',
    metrics: [
      { label: 'Time Reduction', value: '91%' },
      { label: 'SSIM Improvement', value: '+12%' },
      { label: 'Scanner Types', value: '2' },
    ],
    color: '#f59e0b',
    accentColor: 'rgba(245,158,11,0.08)',
    status: 'Research Phase',
  },
  {
    id: 3,
    number: 'CS-03',
    sector: 'Cybersecurity',
    title: 'Post-Quantum Cryptography Migration for a National Banking Infrastructure',
    challenge: 'Legacy RSA-2048 and ECC-256 cryptographic infrastructure across 14 banking nodes requiring migration to NIST-approved PQC standards without service disruption or performance degradation.',
    approach: 'Phased migration using CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures. Hybrid classical-PQC mode during transition with automated rollback capability.',
    outcome: 'Zero-downtime migration across all 14 nodes. TLS handshake latency increase of only 8ms (within acceptable SLA). Full NIST PQC compliance achieved in 6-week deployment window.',
    metrics: [
      { label: 'Nodes Migrated', value: '14' },
      { label: 'Downtime', value: '0 hrs' },
      { label: 'Latency Overhead', value: '+8ms' },
    ],
    color: '#6366f1',
    accentColor: 'rgba(99,102,241,0.08)',
    status: 'Deployed',
  },
  {
    id: 4,
    number: 'CS-04',
    sector: 'EdTech & Workforce',
    title: 'Quantum Workforce Readiness Programme for a Central Government Ministry',
    challenge: 'Upskilling 1,200 STEM officers across 8 departments with no prior quantum background. Requirement: measurable competency uplift within 90 days using blended learning delivery.',
    approach: 'Designed 8-module competency framework mapped to QWV Fellowship tiers. Deployed simulation-first pedagogy using IBM Quantum Learning and custom QWV circuit simulators. Cohort-based delivery with peer mentoring.',
    outcome: '94% completion rate. Average competency score improved from 18% to 71% on standardised quantum literacy assessment. 3 cohorts now pursuing QWV Fellowship Level 3+.',
    metrics: [
      { label: 'Officers Trained', value: '1,200' },
      { label: 'Completion Rate', value: '94%' },
      { label: 'Competency Uplift', value: '+53pts' },
    ],
    color: '#10b981',
    accentColor: 'rgba(16,185,129,0.08)',
    status: 'Completed',
  },
];

function CaseStudyCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(6,13,26,0.97) 0%, ${cs.accentColor} 100%)`,
        border: `1px solid ${cs.color}22`,
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0 ? `0 24px 60px ${cs.color}18` : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${cs.color}, transparent)` }} />

      <div className="p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-narrow text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: cs.color }}>{cs.number}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="font-narrow text-[10px] tracking-[0.12em] uppercase text-[rgba(243,243,243,0.45)]">{cs.sector}</span>
            </div>
            <h3 className="font-archivo font-semibold text-[1rem] leading-snug text-[#f3f3f3] max-w-sm">{cs.title}</h3>
          </div>
          <span
            className="flex-shrink-0 font-narrow text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full ml-3"
            style={{ background: cs.color + '18', color: cs.color, border: `1px solid ${cs.color}33` }}
          >
            {cs.status}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {cs.metrics.map(m => (
            <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: cs.color + '0d', border: `1px solid ${cs.color}18` }}>
              <div className="font-archivo font-bold text-[1.2rem] leading-none" style={{ color: cs.color }}>{m.value}</div>
              <div className="font-narrow text-[9px] tracking-[0.1em] uppercase text-[rgba(243,243,243,0.4)] mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Challenge */}
        <div className="mb-4">
          <div className="font-narrow text-[10px] font-semibold tracking-[0.16em] uppercase text-[rgba(243,243,243,0.4)] mb-1.5">Challenge</div>
          <p className="font-narrow text-[0.8rem] text-[rgba(243,243,243,0.6)] leading-relaxed line-clamp-2">{cs.challenge}</p>
        </div>

        {/* Expandable */}
        {expanded && (
          <div className="space-y-4 mt-4 pt-4 border-t border-white/8">
            <div>
              <div className="font-narrow text-[10px] font-semibold tracking-[0.16em] uppercase text-[rgba(243,243,243,0.4)] mb-1.5">Approach</div>
              <p className="font-narrow text-[0.8rem] text-[rgba(243,243,243,0.6)] leading-relaxed">{cs.approach}</p>
            </div>
            <div>
              <div className="font-narrow text-[10px] font-semibold tracking-[0.16em] uppercase text-[rgba(243,243,243,0.4)] mb-1.5">Outcome</div>
              <p className="font-narrow text-[0.8rem] text-[rgba(243,243,243,0.6)] leading-relaxed">{cs.outcome}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-2 font-narrow text-[11px] font-semibold tracking-[0.1em] uppercase transition-all"
          style={{ color: cs.color }}
        >
          {expanded ? 'Show Less' : 'Read Full Case Study'}
          <svg
            className="w-3 h-3 transition-transform"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="py-24 relative overflow-hidden" style={{ background: '#04090f' }}>
      {/* CSS/SVG background — replaces Three.js hexagonal grid + particle WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" hexGrid className="z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#04090f]/60 via-transparent to-[#04090f]/60 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0e76ff]">Applied Research</span>
          </div>
          <h2 className="font-archivo font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#f3f3f3] leading-tight mb-3">Case Studies</h2>
          <p className="font-narrow text-[0.9rem] text-[rgba(243,243,243,0.5)] max-w-xl">
            Real-world quantum and AI deployments — from financial optimisation to healthcare diagnostics and national security infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CASE_STUDIES.map((cs, i) => (
            <CaseStudyCard key={cs.id} cs={cs} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
