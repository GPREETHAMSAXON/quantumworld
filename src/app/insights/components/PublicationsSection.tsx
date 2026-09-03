'use client';

import React, { useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

interface Publication {
  id: number;
  type: 'Journal' | 'Conference' | 'Preprint' | 'White Paper';
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  doi?: string;
  tags: string[];
  color: string;
  citations?: number;
  impact?: string;
}

const PUBLICATIONS: Publication[] = [
  {
    id: 1,
    type: 'Journal',
    title: 'Hybrid Quantum-Classical Optimisation for Real-Time Portfolio Rebalancing Under Stochastic Constraints',
    authors: 'Mehta A., Desai R., Nair P.',
    venue: 'Quantum Science and Technology, IOP Publishing',
    year: '2026',
    abstract: 'We present a hybrid QAOA-classical framework for constrained portfolio optimisation achieving 94% solution quality at sub-second latency on 127-qubit hardware. The approach integrates penalty-based constraint encoding with classical warm-starting to overcome NISQ-era depth limitations.',
    doi: '10.1088/2058-9565/qwv2026',
    tags: ['QAOA', 'Portfolio Optimisation', 'FinTech', 'NISQ'],
    color: '#0e76ff',
    citations: 12,
    impact: 'IF: 6.8',
  },
  {
    id: 2,
    type: 'Conference',
    title: 'Competency-Mapped Quantum Literacy Frameworks for Non-Physics STEM Professionals',
    authors: 'Rao S., Krishnan K., Mehta A.',
    venue: 'IEEE International Conference on Quantum Education (ICQE 2026)',
    year: '2026',
    abstract: 'A structured 8-tier competency framework for quantum workforce development, validated across 1,200 government STEM officers. Demonstrates 53-point average competency uplift using simulation-first pedagogy and peer-mentored cohort delivery.',
    tags: ['Quantum Education', 'Workforce Development', 'Competency Framework'],
    color: '#10b981',
    citations: 7,
    impact: 'CORE A',
  },
  {
    id: 3,
    type: 'Preprint',
    title: 'Variational Quantum Eigensolver Convergence Under Realistic Noise Models: A Systematic Benchmarking Study',
    authors: 'Nair P., Sinha V., Mehta A.',
    venue: 'arXiv:2026.08741 [quant-ph]',
    year: '2026',
    abstract: 'Systematic benchmarking of VQE convergence across 6 ansatz families under depolarising, amplitude damping, and crosstalk noise models on IBM Quantum hardware. Identifies optimal circuit depth-noise trade-offs for molecular simulation applications.',
    doi: 'arXiv:2026.08741',
    tags: ['VQE', 'Noise Mitigation', 'Quantum Chemistry', 'Benchmarking'],
    color: '#6366f1',
    citations: 3,
    impact: 'Preprint',
  },
  {
    id: 4,
    type: 'White Paper',
    title: 'Post-Quantum Cryptography Migration Playbook for Indian Financial Infrastructure',
    authors: 'Sinha V., Desai R., QWV Security Research Group',
    venue: 'QWV Technical Report Series, Vol. 3',
    year: '2025',
    abstract: 'A comprehensive migration playbook for transitioning RSA/ECC-based financial infrastructure to NIST PQC standards. Covers phased deployment strategies, hybrid classical-PQC transition modes, performance benchmarks, and regulatory compliance mapping for RBI and SEBI frameworks.',
    tags: ['Post-Quantum Cryptography', 'NIST PQC', 'Financial Security', 'Migration'],
    color: '#f59e0b',
    citations: 24,
    impact: 'Policy Impact',
  },
  {
    id: 5,
    type: 'Journal',
    title: 'Quantum Sensing for Magnetoencephalography: Signal-to-Noise Enhancement via NV-Centre Arrays',
    authors: 'Krishnan K., Rao S.',
    venue: 'npj Quantum Information, Nature Publishing Group',
    year: '2025',
    abstract: 'Demonstrates 3.2× SNR improvement in MEG signal acquisition using nitrogen-vacancy centre arrays at room temperature. Presents a scalable fabrication pathway for clinical-grade quantum magnetometers compatible with existing MEG infrastructure.',
    doi: '10.1038/s41534-025-qwv-01',
    tags: ['Quantum Sensing', 'MEG', 'NV Centres', 'MedTech'],
    color: '#ec4899',
    citations: 18,
    impact: 'IF: 9.1',
  },
  {
    id: 6,
    type: 'Conference',
    title: 'Quantum Key Distribution Over Metropolitan Fibre Networks: Field Trial Results',
    authors: 'Sinha V., Mehta A.',
    venue: 'Optical Fiber Communication Conference (OFC 2025)',
    year: '2025',
    abstract: 'Field trial results for BB84 QKD deployment over 42km metropolitan fibre with 98.7% key generation fidelity and 12 kbps secure key rate. Demonstrates practical integration with existing classical network management systems.',
    tags: ['QKD', 'BB84', 'Quantum Networks', 'Cryptography'],
    color: '#0ea5e9',
    citations: 9,
    impact: 'CORE A*',
  },
];

const PUB_TYPES = ['All', 'Journal', 'Conference', 'Preprint', 'White Paper'];

const TYPE_ICONS: Record<string, string> = {
  'Journal': 'J',
  'Conference': 'C',
  'Preprint': 'P',
  'White Paper': 'W',
};

function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
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
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(6,13,26,0.97) 0%, rgba(14,118,255,0.04) 100%)',
        border: `1px solid ${pub.color}1a`,
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0 ? `0 20px 50px ${pub.color}15` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${pub.color}60, transparent)` }} />

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Type badge */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-archivo font-bold text-[0.85rem]"
            style={{ background: pub.color + '18', color: pub.color, border: `1px solid ${pub.color}30` }}
          >
            {TYPE_ICONS[pub.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-narrow text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: pub.color }}>{pub.type}</span>
              <span className="font-narrow text-[9px] text-[rgba(243,243,243,0.35)]">·</span>
              <span className="font-narrow text-[9px] text-[rgba(243,243,243,0.4)]">{pub.year}</span>
              {pub.impact && (
                <>
                  <span className="font-narrow text-[9px] text-[rgba(243,243,243,0.35)]">·</span>
                  <span className="font-narrow text-[9px] font-semibold" style={{ color: pub.color }}>{pub.impact}</span>
                </>
              )}
            </div>
            <h3 className="font-archivo font-semibold text-[0.9rem] leading-snug text-[#f3f3f3] group-hover:text-white transition-colors line-clamp-2">
              {pub.title}
            </h3>
          </div>
        </div>

        <div className="mb-3">
          <div className="font-narrow text-[11px] text-[rgba(243,243,243,0.55)] mb-0.5">{pub.authors}</div>
          <div className="font-narrow text-[10px] italic text-[rgba(243,243,243,0.35)]">{pub.venue}</div>
        </div>

        <p className="font-narrow text-[0.78rem] text-[rgba(243,243,243,0.5)] leading-relaxed line-clamp-2 mb-4">
          {pub.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pub.tags.map(tag => (
            <span
              key={tag}
              className="font-narrow text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: pub.color + '12', color: pub.color + 'cc', border: `1px solid ${pub.color}20` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/6">
          {pub.citations !== undefined && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[rgba(243,243,243,0.35)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)]">{pub.citations} citations</span>
            </div>
          )}
          {pub.doi && (
            <span className="font-narrow text-[10px] font-semibold tracking-[0.08em] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: pub.color }}>
              View Publication →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PublicationsSection() {
  const [activeType, setActiveType] = useState('All');
  const filtered = activeType === 'All' ? PUBLICATIONS : PUBLICATIONS.filter(p => p.type === activeType);

  return (
    <section id="publications" className="py-24 relative overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG background — replaces Three.js dodecahedron + particle WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" icoWireframe scanLines className="z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1a]/70 via-transparent to-[#060d1a]/70 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0e76ff]">Publications</span>
            </div>
            <h2 className="font-archivo font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#f3f3f3] leading-tight mb-2">Research Publications</h2>
            <p className="font-narrow text-[0.9rem] text-[rgba(243,243,243,0.5)] max-w-lg">
              Peer-reviewed journals, conference proceedings, preprints, and technical white papers from the QWV research group.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PUB_TYPES.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className="font-narrow text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full transition-all duration-200"
                style={{ background: activeType === t ? '#0e76ff' : 'rgba(14,118,255,0.08)', color: activeType === t ? '#fff' : 'rgba(243,243,243,0.55)', border: `1px solid ${activeType === t ? '#0e76ff' : 'rgba(14,118,255,0.2)'}` }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((pub, i) => (
            <PublicationCard key={pub.id} pub={pub} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
