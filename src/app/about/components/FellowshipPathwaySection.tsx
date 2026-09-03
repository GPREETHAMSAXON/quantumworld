'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ===== GPU PATHWAY BACKGROUND =====
function PathwayGL() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let animationId: number;
    let THREE: typeof import('three');
    let renderer: import('three').WebGLRenderer;
    let scene: import('three').Scene;
    let camera: import('three').PerspectiveCamera;

    const init = async () => {
      THREE = await import('three');
      const w = container.clientWidth;
      const h = container.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
      camera.position.set(0, 0, 15);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // ===== ASCENDING SPIRAL =====
      const spiralGroup = new THREE.Group();
      scene.add(spiralGroup);

      const spiralPoints: import('three').Vector3[] = [];
      for (let i = 0; i < 300; i++) {
        let t = (i / 300) * Math.PI * 12;
        const r = 3 + i * 0.01;
        spiralPoints.push(new THREE.Vector3(
          Math.cos(t) * r * 0.4,
          i * 0.08 - 12,
          Math.sin(t) * r * 0.4,
        ));
      }

      const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
      const spiralGeo = new THREE.TubeGeometry(spiralCurve, 400, 0.015, 8, false);
      const spiralMat = new THREE.MeshBasicMaterial({ color: 0x0e76ff, transparent: true, opacity: 0.4 });
      spiralGroup.add(new THREE.Mesh(spiralGeo, spiralMat));

      // Tier nodes on spiral
      const tierPositions = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        let t = (i / 7) * Math.PI * 12;
        const r = 3 + (i / 7) * 300 * 0.01;
        return new THREE.Vector3(
          Math.cos(t) * r * 0.4,
          (i / 7) * 300 * 0.08 - 12,
          Math.sin(t) * r * 0.4,
        );
      });

      tierPositions.forEach((pos, i) => {
        const size = 0.12 + i * 0.02;
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0e76ff, emissive: 0x0e76ff,
          emissiveIntensity: 1.5 + i * 0.3,
          roughness: 0, metalness: 1,
        });
        spiralGroup.add(new THREE.Mesh(geo, mat));
        spiralGroup.children[spiralGroup.children.length - 1].position.copy(pos);
      });

      // ===== PARTICLE FIELD =====
      const pCount = 800;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 20;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x0e76ff, size: 0.04, transparent: true, opacity: 0.35,
        sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      scene.add(new THREE.Points(pGeo, pMat));

      // Lights
      scene.add(new THREE.AmbientLight(0x0a1a3a, 2));
      const pl = new THREE.PointLight(0x0e76ff, 8, 20);
      pl.position.set(0, 0, 5);
      scene.add(pl);

      const handleResize = () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', handleResize);

      let t = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        t += 0.004;
        spiralGroup.rotation.y = t * 0.2;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

// ===== TIER CARD =====
function TierCard({
  tier, index, visible,
}: {
  tier: { number: string; title: string; desc: string; badge: string; color: string; bgColor: string };
  index: number;
  visible: boolean;
}) {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRotX(0); setRotY(0); }}
      style={{
        perspective: '600px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.08}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.08}s`,
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          background: hovered ? tier.bgColor : 'rgba(14,118,255,0.03)',
          border: `1px solid ${hovered ? tier.color + '40' : 'rgba(243,243,243,0.08)'}`,
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* Tier number badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 flex items-center justify-center font-archivo font-medium text-[14px]"
            style={{ background: tier.bgColor, border: `1px solid ${tier.color}30`, color: tier.color }}
          >
            {tier.number}
          </div>
          <span
            className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2 py-1 border"
            style={{ borderColor: `${tier.color}25`, color: tier.color, background: `${tier.color}08` }}
          >
            {tier.badge}
          </span>
        </div>

        <h4 className="font-archivo font-medium text-[16px] text-[#f3f3f3] leading-snug mb-2">
          {tier.title}
        </h4>
        <p className="font-archivo text-[12px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.45)' }}>
          {tier.desc}
        </p>

        {/* Ascending indicator */}
        <div
          className="absolute right-4 bottom-4 flex flex-col items-center gap-0.5"
          style={{ opacity: hovered ? 0.8 : 0.2, transition: 'opacity 0.3s ease' }}
        >
          {[...Array(index + 1)].map((_, j) => (
            <div key={j} className="w-1 h-1 rounded-full" style={{ background: tier.color }} />
          ))}
        </div>

        {/* Bottom line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{ width: hovered ? '100%' : '0%', background: `linear-gradient(to right, ${tier.color}, transparent)` }}
        />
      </div>
    </div>
  );
}

const tiers = [
  {
    number: 'T1',
    title: 'Campus Ambassador',
    desc: 'Entry-level representatives spreading quantum awareness across campuses and institutions.',
    badge: 'Entry',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.06)',
  },
  {
    number: 'T2',
    title: 'Student Fellow',
    desc: 'Undergraduate and postgraduate students engaged in structured quantum research and learning.',
    badge: 'Foundation',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    number: 'T3',
    title: 'Faculty Fellow',
    desc: 'Academic faculty integrating quantum education into university curricula and research programs.',
    badge: 'Academic',
    color: '#2563eb',
    bgColor: 'rgba(37,99,235,0.06)',
  },
  {
    number: 'T4',
    title: 'Senior Fellow',
    desc: 'Experienced researchers and professionals leading domain-specific quantum research initiatives.',
    badge: 'Advanced',
    color: '#1d4ed8',
    bgColor: 'rgba(29,78,216,0.06)',
  },
  {
    number: 'T5',
    title: 'Fellow of Fellows',
    desc: 'Elite researchers mentoring junior fellows and driving cross-domain quantum innovation.',
    badge: 'Elite',
    color: '#1e40af',
    bgColor: 'rgba(30,64,175,0.06)',
  },
  {
    number: 'T6',
    title: 'Regional Fellowship Director',
    desc: 'Leaders overseeing fellowship programs across multiple cities and institutions in a region.',
    badge: 'Regional',
    color: '#0e76ff',
    bgColor: 'rgba(14,118,255,0.06)',
  },
  {
    number: 'T7',
    title: 'State Fellowship Director',
    desc: 'State-level directors coordinating quantum education and research ecosystems across entire states.',
    badge: 'State',
    color: '#0e76ff',
    bgColor: 'rgba(14,118,255,0.08)',
  },
  {
    number: 'T8',
    title: 'National Fellowship Director',
    desc: 'The apex of the fellowship pathway — national leaders shaping India\'s quantum talent ecosystem.',
    badge: 'National',
    color: '#0e76ff',
    bgColor: 'rgba(14,118,255,0.1)',
  },
];

export default function FellowshipPathwaySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: '#060d1a' }}
      id="fellowship-pathway"
    >
      {/* WebGL background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <PathwayGL />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 60% 80% at 10% 50%, rgba(14,118,255,0.05) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
                03 / 8-TIER FELLOWSHIP PATHWAY
              </span>
            </div>
            <h2 className="section-headline text-[#f3f3f3]">
              Lead Fellows.
              <span className="block" style={{ color: '#0e76ff' }}>Build Institutions.</span>
              <span className="block text-[#f3f3f3]">Advance Quantum.</span>
            </h2>
          </div>
          <div>
            <p className="font-archivo text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(243,243,243,0.55)' }}>
              A national fellowship program designed for students, faculty, researchers, innovators and 
              entrepreneurs — with 21 specialised fellowships and an 8-tier leadership pathway that builds 
              India's quantum talent ecosystem from campus to national level.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 border border-white/8">
              {[
                { value: '21', label: 'Specialized Fellowships' },
                { value: '8', label: 'Leadership Tiers' },
                { value: '10K+', label: 'Target Fellows' },
              ].map((stat, i) => (
                <div key={stat.label} className="p-5 border-r border-white/8 last:border-r-0 text-center">
                  <div className="font-archivo font-medium text-[24px] text-[#f3f3f3] leading-none mb-1">{stat.value}</div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: 'rgba(243,243,243,0.4)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pathway label */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}
        >
          <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(243,243,243,0.3)' }}>
            Campus Level
          </span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to right, rgba(14,118,255,0.4), rgba(14,118,255,0.1))' }} />
          <svg className="w-4 h-4 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to left, rgba(14,118,255,0.4), rgba(14,118,255,0.1))' }} />
          <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
            National Level
          </span>
        </div>

        {/* 8-tier grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier, i) => (
            <TierCard key={tier.number} tier={tier} index={i} visible={visible} />
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.9s' }}
        >
          <Link href="/#fellowship" className="btn-primary flex items-center gap-2">
            Explore Fellowship Program
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/#fellowship" className="btn-ghost flex items-center gap-2">
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
