'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Course {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  domain: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' | 'Executive';
  duration: string;
  audience: string[];
  outcomes: string[];
  price: number;
  originalPrice?: number;
  tag?: string;
  color: string;
  accentColor: string;
}

const COURSES: Course[] = [
  {
    id: 1, code: 'QWV-Q01',
    title: 'Quantum Computing Fundamentals',
    subtitle: 'Qubits, superposition, entanglement & quantum gates from first principles',
    domain: 'Quantum',
    difficulty: 'Foundational',
    duration: '8 hrs',
    audience: ['Engineers', 'Scientists', 'Managers'],
    outcomes: ['Qubit mechanics', 'Gate operations', 'Quantum circuits', 'Industry use-cases'],
    price: 8000,
    tag: 'Most Popular',
    color: '#0e76ff',
    accentColor: 'rgba(14,118,255,0.12)',
  },
  {
    id: 2, code: 'QWV-Q02',
    title: 'Quantum Algorithms Masterclass',
    subtitle: "Shor's, Grover's, QAOA and variational quantum eigensolver deep-dive",
    domain: 'Quantum',
    difficulty: 'Advanced',
    duration: '8 hrs',
    audience: ['CS Researchers', 'Quantum Engineers'],
    outcomes: ["Shor's algorithm", "Grover's search", 'QAOA implementation', 'VQE circuits'],
    price: 18000,
    color: '#3b82f6',
    accentColor: 'rgba(59,130,246,0.12)',
  },
  {
    id: 3, code: 'QWV-Q03',
    title: 'Quantum Cryptography & QKD',
    subtitle: 'BB84, E91 protocols, post-quantum cryptography and NIST standards',
    domain: 'Quantum',
    difficulty: 'Intermediate',
    duration: '8 hrs',
    audience: ['Security Architects', 'CISOs', 'Researchers'],
    outcomes: ['BB84/E91 protocols', 'QKD implementation', 'Post-quantum standards', 'NIST PQC'],
    price: 14000,
    tag: 'High Demand',
    color: '#6366f1',
    accentColor: 'rgba(99,102,241,0.12)',
  },
  {
    id: 4, code: 'QWV-Q04',
    title: 'Quantum Hardware & Photonics',
    subtitle: 'Superconducting qubits, trapped ions, photonic chips and cryogenic systems',
    domain: 'Quantum',
    difficulty: 'Expert',
    duration: '8 hrs',
    audience: ['Hardware Engineers', 'Physicists'],
    outcomes: ['Superconducting qubits', 'Trapped ion systems', 'Photonic integration', 'Error correction'],
    price: 22000,
    color: '#8b5cf6',
    accentColor: 'rgba(139,92,246,0.12)',
  },
  {
    id: 5, code: 'QWV-Q05',
    title: 'Quantum Machine Learning',
    subtitle: 'Quantum neural networks, kernel methods and hybrid classical-quantum models',
    domain: 'Quantum-AI',
    difficulty: 'Advanced',
    duration: '8 hrs',
    audience: ['ML Engineers', 'Data Scientists'],
    outcomes: ['QNN architecture', 'Quantum kernels', 'Hybrid models', 'PennyLane/Qiskit'],
    price: 20000,
    tag: 'New',
    color: '#0ea5e9',
    accentColor: 'rgba(14,165,233,0.12)',
  },
  {
    id: 6, code: 'QWV-A01',
    title: 'Generative AI for Enterprise',
    subtitle: 'LLM deployment, RAG pipelines, fine-tuning and responsible AI governance',
    domain: 'AI',
    difficulty: 'Intermediate',
    duration: '8 hrs',
    audience: ['Product Managers', 'Tech Leads', 'CTOs'],
    outcomes: ['LLM deployment', 'RAG architecture', 'Fine-tuning strategy', 'AI governance'],
    price: 12000,
    tag: 'Best Seller',
    color: '#10b981',
    accentColor: 'rgba(16,185,129,0.12)',
  },
  {
    id: 7, code: 'QWV-A02',
    title: 'AI in Healthcare & MedTech',
    subtitle: 'Medical imaging AI, clinical NLP, FDA regulatory pathways and ethics',
    domain: 'AI',
    difficulty: 'Intermediate',
    duration: '8 hrs',
    audience: ['Clinicians', 'MedTech Engineers', 'Researchers'],
    outcomes: ['Medical imaging AI', 'Clinical NLP', 'FDA pathways', 'Ethical AI in health'],
    price: 15000,
    color: '#14b8a6',
    accentColor: 'rgba(20,184,166,0.12)',
  },
  {
    id: 8, code: 'QWV-A03',
    title: 'AI for Financial Services',
    subtitle: 'Algorithmic trading, fraud detection, risk modelling and RegTech compliance',
    domain: 'AI',
    difficulty: 'Advanced',
    duration: '8 hrs',
    audience: ['Quants', 'Risk Managers', 'FinTech Engineers'],
    outcomes: ['Algo trading models', 'Fraud detection', 'Risk quantification', 'RegTech AI'],
    price: 18000,
    color: '#f59e0b',
    accentColor: 'rgba(245,158,11,0.12)',
  },
  {
    id: 9, code: 'QWV-A04',
    title: 'Agentic AI & Multi-Agent Systems',
    subtitle: 'AutoGPT patterns, tool-use, orchestration frameworks and agent safety',
    domain: 'AI',
    difficulty: 'Advanced',
    duration: '8 hrs',
    audience: ['AI Engineers', 'Researchers'],
    outcomes: ['Agent architectures', 'Tool-use patterns', 'LangGraph/CrewAI', 'Safety alignment'],
    price: 20000,
    tag: 'New',
    color: '#f97316',
    accentColor: 'rgba(249,115,22,0.12)',
  },
  {
    id: 10, code: 'QWV-A05',
    title: 'Computer Vision & Multimodal AI',
    subtitle: 'Vision transformers, CLIP, SAM, video understanding and edge deployment',
    domain: 'AI',
    difficulty: 'Intermediate',
    duration: '8 hrs',
    audience: ['CV Engineers', 'Robotics Teams'],
    outcomes: ['ViT architecture', 'CLIP/SAM usage', 'Video AI', 'Edge deployment'],
    price: 14000,
    color: '#ec4899',
    accentColor: 'rgba(236,72,153,0.12)',
  },
  {
    id: 11, code: 'QWV-QA01',
    title: 'Quantum-AI Hybrid Systems',
    subtitle: 'Variational algorithms, quantum advantage benchmarking and NISQ-era applications',
    domain: 'Quantum-AI',
    difficulty: 'Expert',
    duration: '8 hrs',
    audience: ['Quantum Researchers', 'Senior ML Engineers'],
    outcomes: ['Variational circuits', 'Quantum advantage', 'NISQ applications', 'Hybrid pipelines'],
    price: 24000,
    tag: 'Premium',
    color: '#a855f7',
    accentColor: 'rgba(168,85,247,0.12)',
  },
  {
    id: 12, code: 'QWV-E01',
    title: 'Quantum Strategy for Executives',
    subtitle: 'Quantum readiness roadmap, competitive landscape and investment frameworks',
    domain: 'Executive',
    difficulty: 'Executive',
    duration: '6 hrs',
    audience: ['C-Suite', 'Board Members', 'VCs'],
    outcomes: ['Quantum readiness', 'Investment thesis', 'Vendor evaluation', 'Risk assessment'],
    price: 28000,
    originalPrice: 35000,
    tag: 'Executive',
    color: '#d97706',
    accentColor: 'rgba(217,119,6,0.12)',
  },
  {
    id: 13, code: 'QWV-S01',
    title: 'Quantum-Safe Cybersecurity',
    subtitle: 'Migration to post-quantum cryptography, threat modelling and compliance',
    domain: 'Security',
    difficulty: 'Advanced',
    duration: '8 hrs',
    audience: ['Security Teams', 'Compliance Officers'],
    outcomes: ['PQC migration', 'Threat modelling', 'NIST compliance', 'Crypto-agility'],
    price: 16000,
    color: '#ef4444',
    accentColor: 'rgba(239,68,68,0.12)',
  },
  {
    id: 14, code: 'QWV-R01',
    title: 'Quantum Sensing & Metrology',
    subtitle: 'Atomic clocks, gravimeters, magnetometers and quantum-enhanced precision measurement',
    domain: 'Quantum',
    difficulty: 'Expert',
    duration: '8 hrs',
    audience: ['Physicists', 'Defence R&D', 'Navigation Engineers'],
    outcomes: ['Atomic clock systems', 'Quantum gravimetry', 'Magnetometry', 'Defence applications'],
    price: 22000,
    color: '#06b6d4',
    accentColor: 'rgba(6,182,212,0.12)',
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Foundational: '#10b981',
  Intermediate: '#0e76ff',
  Advanced: '#f59e0b',
  Expert: '#ef4444',
  Executive: '#d97706',
};

const DOMAINS = ['All', 'Quantum', 'AI', 'Quantum-AI', 'Security', 'Executive'];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = course.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [course.color]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative rounded-xl overflow-hidden border border-white/8 group cursor-pointer"
      style={{
        background: '#0a1220',
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${course.color}, transparent)` }} />

      <div className="relative z-10 p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="font-narrow text-[9px] tracking-[0.2em] uppercase text-[rgba(243,243,243,0.35)]">{course.code}</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="font-narrow text-[9px] font-medium tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                style={{ color: DIFFICULTY_COLORS[course.difficulty], background: DIFFICULTY_COLORS[course.difficulty] + '20', border: `1px solid ${DIFFICULTY_COLORS[course.difficulty]}40` }}
              >
                {course.difficulty}
              </span>
              <span
                className="font-narrow text-[9px] font-medium tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                style={{ color: course.color, background: course.accentColor, border: `1px solid ${course.color}30` }}
              >
                {course.domain}
              </span>
            </div>
          </div>
          {course.tag && (
            <span
              className="font-narrow text-[8px] font-medium tracking-[0.12em] uppercase px-2 py-1 rounded"
              style={{ color: course.color, background: course.accentColor, border: `1px solid ${course.color}40` }}
            >
              {course.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-archivo font-medium text-[#f3f3f3] text-[17px] leading-tight mb-2 group-hover:text-white transition-colors">
          {course.title}
        </h3>
        <p className="font-archivo text-[rgba(243,243,243,0.5)] text-[12px] leading-relaxed mb-4">
          {course.subtitle}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" style={{ color: course.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-narrow text-[10px] tracking-[0.1em] text-[rgba(243,243,243,0.55)]">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" style={{ color: course.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-narrow text-[10px] tracking-[0.1em] text-[rgba(243,243,243,0.55)]">{course.audience.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Outcomes */}
        <div className="mb-5">
          <div className="font-narrow text-[9px] tracking-[0.15em] uppercase text-[rgba(243,243,243,0.35)] mb-2">Key Outcomes</div>
          <div className="grid grid-cols-2 gap-1">
            {course.outcomes.map((o) => (
              <div key={o} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: course.color }} />
                <span className="font-archivo text-[11px] text-[rgba(243,243,243,0.6)]">{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 mb-4" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-archivo font-medium text-[22px] text-[#f3f3f3]">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
              {course.originalPrice && (
                <span className="font-archivo text-[13px] text-[rgba(243,243,243,0.35)] line-through">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="font-narrow text-[9px] tracking-[0.1em] text-[rgba(243,243,243,0.35)] uppercase">Per participant · GST extra</div>
          </div>
          <button
            className="font-narrow text-[10px] font-medium tracking-[0.12em] uppercase px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
            style={{
              background: course.color,
              color: '#fff',
              boxShadow: `0 0 20px ${course.color}40`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 30px ${course.color}70`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${course.color}40`; }}
          >
            Enrol Now
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseCatalogueSection() {
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');

  const difficulties = ['All', 'Foundational', 'Intermediate', 'Advanced', 'Expert', 'Executive'];

  const filtered = COURSES.filter(c => {
    const domainMatch = activeDomain === 'All' || c.domain === activeDomain;
    const diffMatch = activeDifficulty === 'All' || c.difficulty === activeDifficulty;
    return domainMatch && diffMatch;
  });

  return (
    <section id="catalogue" className="relative py-24 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(14,118,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,118,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.22em] uppercase text-[#0e76ff]">
              14 Intensive Programmes
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="section-headline text-[#f3f3f3] max-w-xl">
              Course<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #99c5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Catalogue
              </span>
            </h2>
            <p className="font-archivo text-[rgba(243,243,243,0.55)] text-[14px] max-w-md leading-relaxed">
              Each course is a precision-engineered one-day intensive. Delivered by practitioners with active research and industry deployments.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Domain filters */}
          <div className="flex flex-wrap gap-2">
            <span className="font-narrow text-[9px] tracking-[0.15em] uppercase text-[rgba(243,243,243,0.35)] self-center mr-2">Domain:</span>
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className="font-narrow text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: activeDomain === d ? '#0e76ff' : 'rgba(243,243,243,0.1)',
                  background: activeDomain === d ? 'rgba(14,118,255,0.15)' : 'transparent',
                  color: activeDomain === d ? '#0e76ff' : 'rgba(243,243,243,0.5)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
          {/* Difficulty filters */}
          <div className="flex flex-wrap gap-2">
            <span className="font-narrow text-[9px] tracking-[0.15em] uppercase text-[rgba(243,243,243,0.35)] self-center mr-2">Level:</span>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className="font-narrow text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: activeDifficulty === d ? (DIFFICULTY_COLORS[d] || '#0e76ff') : 'rgba(243,243,243,0.1)',
                  background: activeDifficulty === d ? ((DIFFICULTY_COLORS[d] || '#0e76ff') + '20') : 'transparent',
                  color: activeDifficulty === d ? (DIFFICULTY_COLORS[d] || '#0e76ff') : 'rgba(243,243,243,0.5)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-narrow text-[11px] tracking-[0.1em] text-[rgba(243,243,243,0.4)]">
            Showing {filtered.length} of {COURSES.length} courses
          </span>
          <div className="flex-1 h-[1px] bg-white/6" />
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="font-archivo text-[rgba(243,243,243,0.35)] text-lg">No courses match the selected filters.</div>
            <button
              onClick={() => { setActiveDomain('All'); setActiveDifficulty('All'); }}
              className="mt-4 font-narrow text-[11px] tracking-[0.1em] uppercase text-[#0e76ff] hover:text-[#60a5fa] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
