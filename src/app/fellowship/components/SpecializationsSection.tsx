'use client';

import React, { useRef, useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const specializations = [
  { id: 'F-01', domain: 'Computing', title: 'Quantum Computing Research', desc: 'Quantum algorithms, circuit design, and hybrid quantum-classical architectures.', tags: ['Algorithms', 'Circuits', 'HPC'], color: '#0e76ff' },
  { id: 'F-02', domain: 'Communication', title: 'Quantum Communication & QKD', desc: 'Quantum key distribution, quantum-safe cryptography, and secure communication protocols.', tags: ['QKD', 'Cryptography', 'Security'], color: '#3b82f6' },
  { id: 'F-03', domain: 'Sensing', title: 'Quantum Sensing & Metrology', desc: 'Precision measurement, quantum sensors, and metrology applications.', tags: ['Sensors', 'Precision', 'Metrology'], color: '#60a5fa' },
  { id: 'F-04', domain: 'MedTech', title: 'Quantum Medical Imaging', desc: 'Quantum-enhanced CT/MRI, biosensors, and next-generation diagnostic imaging.', tags: ['Imaging', 'Diagnostics', 'MRI'], color: '#0e76ff' },
  { id: 'F-05', domain: 'AI', title: 'Quantum AI & Machine Learning', desc: 'Hybrid quantum-classical AI, quantum machine learning, and deep learning research.', tags: ['QML', 'Deep Learning', 'AI'], color: '#3b82f6' },
  { id: 'F-06', domain: 'EdTech', title: 'Quantum Education & L&D', desc: 'Quantum curriculum design, Centres of Excellence, and institutional learning programs.', tags: ['Curriculum', 'CoE', 'Training'], color: '#60a5fa' },
  { id: 'F-07', domain: 'FinTech', title: 'Quantum Financial Systems', desc: 'PFMS, IFMS, quantum-safe financial cryptography, and fraud detection systems.', tags: ['PFMS', 'Fraud Detection', 'Finance'], color: '#0e76ff' },
  { id: 'F-08', domain: 'SecureTech', title: 'Quantum Cybersecurity', desc: 'Post-quantum cryptography, threat detection, and quantum-safe infrastructure.', tags: ['Post-Quantum', 'Threat Intel', 'Infra'], color: '#3b82f6' },
  { id: 'F-09', domain: 'Photonics', title: 'Quantum Photonics & Optics', desc: 'Photonic quantum computing, optical quantum communication, and photon-based sensing.', tags: ['Photonics', 'Optics', 'Quantum Light'], color: '#60a5fa' },
  { id: 'F-10', domain: 'Materials', title: 'Quantum Materials & Devices', desc: 'Superconducting qubits, topological materials, and quantum device engineering.', tags: ['Qubits', 'Superconductors', 'Devices'], color: '#0e76ff' },
  { id: 'F-11', domain: 'Policy', title: 'Quantum Policy & Governance', desc: 'National Quantum Mission alignment, regulatory frameworks, and technology policy.', tags: ['NQM', 'Policy', 'Governance'], color: '#3b82f6' },
  { id: 'F-12', domain: 'Innovation', title: 'Deep-Tech Entrepreneurship', desc: 'Quantum startup development, IP strategy, prototype acceleration, and incubation.', tags: ['Startups', 'IP', 'Incubation'], color: '#60a5fa' },
  { id: 'F-13', domain: 'Healthcare', title: 'Quantum Health Informatics', desc: 'Clinical data intelligence, quantum-enhanced diagnostics, and health system optimization.', tags: ['Health Data', 'Diagnostics', 'Clinical'], color: '#0e76ff' },
  { id: 'F-14', domain: 'Agriculture', title: 'Quantum AgriTech & Climate', desc: 'Precision agriculture, climate sensing, and quantum-enhanced environmental monitoring.', tags: ['AgriTech', 'Climate', 'Sensing'], color: '#3b82f6' },
  { id: 'F-15', domain: 'Defence', title: 'Quantum Defence & National Security', desc: 'Quantum radar, secure military communications, and national security applications.', tags: ['Defence', 'Radar', 'Security'], color: '#60a5fa' },
  { id: 'F-16', domain: 'Energy', title: 'Quantum Energy Systems', desc: 'Quantum simulation for energy materials, battery optimization, and grid security.', tags: ['Energy', 'Simulation', 'Grid'], color: '#0e76ff' },
  { id: 'F-17', domain: 'Smart Cities', title: 'Quantum Smart Infrastructure', desc: 'Quantum-enhanced urban systems, smart city sensing, and infrastructure optimization.', tags: ['Smart Cities', 'Urban', 'IoT'], color: '#3b82f6' },
  { id: 'F-18', domain: 'Research', title: 'Fundamental Quantum Research', desc: 'Pure quantum physics, quantum information theory, and foundational quantum science.', tags: ['Physics', 'Theory', 'Foundations'], color: '#60a5fa' },
  { id: 'F-19', domain: 'Workforce', title: 'Quantum Workforce Development', desc: 'Talent pipeline building, quantum literacy programs, and institutional capacity building.', tags: ['Talent', 'Literacy', 'Capacity'], color: '#0e76ff' },
  { id: 'F-20', domain: 'Translational', title: 'Translational Quantum Research', desc: 'Prototype development, TRL progression, validation, and technology transfer.', tags: ['TRL', 'Prototypes', 'Transfer'], color: '#3b82f6' },
  { id: 'F-21', domain: 'International', title: 'Global Quantum Collaboration', desc: 'International research partnerships, global quantum networks, and cross-border innovation.', tags: ['Global', 'Partnerships', 'Networks'], color: '#60a5fa' },
];

// ===== SPECIALIZATION CARD =====
function SpecCard({ spec, index, visible }: { spec: typeof specializations[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setRotX(-dy * 6);
    setRotY(dx * 6);
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRotX(0); setRotY(0); }}
      style={{ perspective: '700px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${(index % 7) * 0.06}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${(index % 7) * 0.06}s` }}>
      <div style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`, transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)', transformStyle: 'preserve-3d', background: hovered ? `${spec.color}08` : 'rgba(14,118,255,0.02)', border: `1px solid ${hovered ? spec.color + '30' : 'rgba(243,243,243,0.07)'}`, padding: '20px', position: 'relative', overflow: 'hidden', cursor: 'default', height: '100%' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: spec.color }}>{spec.id}</span>
          <span className="font-narrow text-[9px] font-medium tracking-[0.1em] uppercase px-2 py-0.5 border"
            style={{ borderColor: `${spec.color}20`, color: `${spec.color}80`, background: `${spec.color}06` }}>{spec.domain}</span>
        </div>
        <h4 className="font-archivo font-medium text-[14px] text-[#f3f3f3] leading-snug mb-2">{spec.title}</h4>
        <p className="font-archivo text-[11.5px] leading-relaxed mb-3" style={{ color: 'rgba(243,243,243,0.4)' }}>{spec.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {spec.tags.map((tag) => (
            <span key={tag} className="font-narrow text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5"
              style={{ background: `${spec.color}08`, color: `${spec.color}70`, border: `1px solid ${spec.color}15` }}>{tag}</span>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 h-[1.5px] transition-all duration-500"
          style={{ width: hovered ? '100%' : '0%', background: `linear-gradient(to right, ${spec.color}, transparent)` }} />
      </div>
    </div>
  );
}

export default function SpecializationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const domains = ['All', 'Computing', 'AI', 'MedTech', 'EdTech', 'FinTech', 'SecureTech', 'Research'];
  const filtered = activeFilter === 'All' ? specializations : specializations.filter(s => s.domain === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="specializations" className="relative overflow-hidden border-t border-white/5" style={{ background: '#04080f' }}>
      {/* CSS/SVG background — replaces Three.js network WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" networkGraph className="z-0 opacity-30" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 60% 70% at 85% 50%, rgba(14,118,255,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        <div className="mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">03 / 21 SPECIALIZED FELLOWSHIPS</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h2 className="section-headline text-[#f3f3f3]">
              21 Domains.
              <span className="block" style={{ color: '#0e76ff' }}>One Quantum</span>
              <span className="block text-[#f3f3f3]">Ecosystem.</span>
            </h2>
            <p className="font-archivo text-[15px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.55)' }}>
              Choose from 21 specialized fellowship tracks spanning quantum computing, AI, MedTech, FinTech, SecureTech, EdTech, and beyond — each designed to build deep expertise and real-world research capability.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          {domains.map((domain) => (
            <button key={domain} onClick={() => setActiveFilter(domain)}
              className="font-narrow text-[10px] font-medium tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-300"
              style={{ borderColor: activeFilter === domain ? '#0e76ff' : 'rgba(243,243,243,0.1)', color: activeFilter === domain ? '#0e76ff' : 'rgba(243,243,243,0.45)', background: activeFilter === domain ? 'rgba(14,118,255,0.08)' : 'transparent' }}>
              {domain}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((spec, i) => (
            <SpecCard key={spec.id} spec={spec} index={i} visible={visible} />
          ))}
        </div>

        <div className="mt-10 text-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}>
          <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(243,243,243,0.3)' }}>
            Showing {filtered.length} of 21 specializations
          </span>
        </div>
      </div>
    </section>
  );
}
