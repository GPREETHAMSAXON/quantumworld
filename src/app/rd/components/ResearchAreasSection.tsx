'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

// ===== GPU PARTICLE BACKGROUND FOR SECTION =====
function ResearchAreaGL() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let animationId: number;
    let renderer: import('three').WebGLRenderer;
    let scene: import('three').Scene;
    let camera: import('three').PerspectiveCamera;

    const init = async () => {
      const THREE = await import('three');
      const w = container.clientWidth;
      const h = container.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.set(0, 0, 20);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);

      // Particle grid
      const count = 3000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        let t = Math.random();
        colors[i * 3] = 0.05 + t * 0.5;
        colors[i * 3 + 1] = 0.46 + t * 0.25;
        colors[i * 3 + 2] = 1.0;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.08, vertexColors: true, transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      scene.add(new THREE.Points(geo, mat));

      const handleResize = () => {
        const w2 = container.clientWidth;
        const h2 = container.clientHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener('resize', handleResize);

      let t = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        t += 0.003;
        scene.rotation.y = t * 0.05;
        renderer.render(scene, camera);
      };
      animate();

      return () => window.removeEventListener('resize', handleResize);
    };

    init();
    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

const researchAreas = [
  {
    id: 'edtech',
    label: 'EdTech',
    title: 'Quantum EdTech Research',
    color: '#0e76ff',
    description: 'Embedding quantum and AI education into university ecosystems through Centres of Excellence, interdisciplinary curricula, and innovation labs.',
    pillars: ['Curriculum Design', 'CoE Development', 'Incubation Support', 'Faculty Training'],
    href: '#',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M4 10 L16 4 L28 10 L16 16 Z" stroke="#0e76ff" strokeWidth="1.2" strokeOpacity="0.7" fill="none" strokeLinejoin="round" />
        <path d="M8 13 L8 22 L16 26 L24 22 L24 13" stroke="#0e76ff" strokeWidth="1.2" strokeOpacity="0.5" fill="none" strokeLinejoin="round" />
        <line x1="28" y1="10" x2="28" y2="20" stroke="#0e76ff" strokeWidth="1.2" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'medtech',
    label: 'MedTech',
    title: 'Quantum MedTech Research',
    color: '#3b82f6',
    description: 'Developing quantum-enhanced imaging, sensing, and diagnostic technologies from prototype to clinical validation and regulatory readiness.',
    pillars: ['Quantum Imaging', 'Biosensors', 'Clinical Validation', 'Device Engineering'],
    href: '#',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect x="10" y="6" width="12" height="20" rx="2" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
        <line x1="16" y1="11" x2="16" y2="21" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="11" y1="16" x2="21" y2="16" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="16" cy="16" r="3.5" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      </svg>
    ),
  },
  {
    id: 'fintech',
    label: 'FinTech',
    title: 'Quantum FinTech Research',
    color: '#60a5fa',
    description: 'Securing and optimising India\'s public financial infrastructure through quantum-safe cryptography, fraud detection, and transaction-scale AI.',
    pillars: ['Quantum-Safe Crypto', 'Fraud Detection', 'PFMS/IFMS', 'Transaction Optimisation'],
    href: '#',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
        <line x1="4" y1="14" x2="28" y2="14" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="8" y="18" width="6" height="3" rx="1" fill="#60a5fa" fillOpacity="0.3" />
        <circle cx="22" cy="19.5" r="2" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 'securetech',
    label: 'SecureTech',
    title: 'Quantum SecureTech Research',
    color: '#99c5ff',
    description: 'Protecting critical infrastructure and public safety systems through quantum-safe communication, threat detection, and quantum sensing.',
    pillars: ['QKD Networks', 'Threat Detection', 'Quantum Sensing', 'Police Technology'],
    href: '#',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4 L26 8 L26 18 C26 23 16 28 16 28 C16 28 6 23 6 18 L6 8 Z" stroke="#99c5ff" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinejoin="round" />
        <path d="M11 16 L14 19 L21 12" stroke="#99c5ff" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
];

export default function ResearchAreasSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#07101f' }}>
      {/* CSS/SVG background — replaces Three.js WebGL */}
      <CSSParticleField variant="section" count={50} color="#0e76ff" networkGraph scanLines className="z-0 opacity-50" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(7,16,31,0.3) 0%, rgba(7,16,31,0.85) 70%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#0e76ff]/50" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.3em] uppercase text-[#0e76ff]">
              02 / Research Domains
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-archivo text-[42px] md:text-[56px] font-bold leading-[1.0] tracking-tight text-white max-w-xl">
              Four Research<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #99c5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Application Domains
              </span>
            </h2>
            <p className="font-narrow text-[15px] text-[rgba(243,243,243,0.55)] max-w-md leading-relaxed">
              Research outcomes are channelled into four high-impact sectors, each with dedicated labs, researchers, and productisation pathways.
            </p>
          </div>
        </div>

        {/* Domain cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {researchAreas.map((area, i) => (
            <div
              key={area.id}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all duration-500 cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms, border-color 0.3s ease`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${area.color}10 0%, transparent 70%)` }}
              />
              <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] group-hover:border-white/20 transition-colors">
                      {area.icon}
                    </div>
                    <div>
                      <span className="font-narrow text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: area.color }}>
                        {area.label}
                      </span>
                      <h3 className="font-archivo text-[20px] font-bold text-white leading-tight mt-0.5">{area.title}</h3>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/25 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <p className="font-narrow text-[14px] text-[rgba(243,243,243,0.55)] leading-relaxed mb-6">{area.description}</p>
                <div className="flex flex-wrap gap-2">
                  {area.pillars.map((pillar) => (
                    <span key={pillar} className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border"
                      style={{ color: area.color + 'cc', borderColor: area.color + '30', background: area.color + '0a' }}>
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${area.color}50, transparent)` }} />
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Researchers & Innovators', value: 'Active', icon: '◎' },
            { label: 'IP & Patents', value: 'Filed', icon: '◈' },
            { label: 'Validation Partnerships', value: 'Ongoing', icon: '◉' },
            { label: 'Research Collaborations', value: 'Open', icon: '◐' },
          ].map((item) => (
            <div key={item.label} className="p-5 rounded-xl border border-white/8 bg-white/[0.02] text-center"
              style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.5s' }}>
              <div className="text-[#0e76ff] text-xl mb-2 opacity-60">{item.icon}</div>
              <div className="font-archivo text-[18px] font-bold text-white mb-1">{item.value}</div>
              <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)] tracking-[0.1em] uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
