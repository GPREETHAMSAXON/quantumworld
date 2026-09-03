'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Article {
  id: number;
  category: string;
  tag?: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  readTime: string;
  date: string;
  domain: string;
  color: string;
  accentColor: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    category: 'Quantum Computing',
    tag: 'Featured',
    title: 'Fault-Tolerant Quantum Computing: The Road from NISQ to Logical Qubits',
    excerpt: 'An in-depth analysis of error correction thresholds, surface code architectures, and the engineering milestones required to transition from noisy intermediate-scale quantum devices to fault-tolerant logical qubit systems.',
    author: 'Dr. Arjun Mehta',
    role: 'Lead Quantum Researcher',
    readTime: '14 min read',
    date: 'Aug 2026',
    domain: 'Quantum',
    color: '#0e76ff',
    accentColor: 'rgba(14,118,255,0.1)',
    featured: true,
  },
  {
    id: 2,
    category: 'Quantum-AI Hybrid',
    tag: 'New',
    title: 'Variational Quantum Eigensolvers Meet Transformer Architectures',
    excerpt: 'Exploring the convergence of VQE circuits with attention mechanisms — how hybrid classical-quantum models are redefining molecular simulation accuracy for drug discovery pipelines.',
    author: 'Priya Nair',
    role: 'AI Research Lead',
    readTime: '11 min read',
    date: 'Jul 2026',
    domain: 'Quantum-AI',
    color: '#6366f1',
    accentColor: 'rgba(99,102,241,0.1)',
  },
  {
    id: 3,
    category: 'Post-Quantum Security',
    title: 'NIST PQC Finalists: Implementation Benchmarks on Classical Hardware',
    excerpt: 'Comparative performance analysis of CRYSTALS-Kyber, CRYSTALS-Dilithium, and FALCON across embedded systems, cloud infrastructure, and mobile endpoints — with latency and key-size trade-off matrices.',
    author: 'Vikram Sinha',
    role: 'Cryptography Researcher',
    readTime: '9 min read',
    date: 'Jun 2026',
    domain: 'Security',
    color: '#0ea5e9',
    accentColor: 'rgba(14,165,233,0.1)',
  },
  {
    id: 4,
    category: 'Quantum Education',
    title: 'Pedagogical Frameworks for Teaching Quantum Mechanics to Non-Physicists',
    excerpt: 'A structured review of blended learning models, simulation-first curricula, and competency mapping for engineering and management professionals entering the quantum workforce.',
    author: 'Dr. Sunita Rao',
    role: 'Education Research Director',
    readTime: '8 min read',
    date: 'May 2026',
    domain: 'EdTech',
    color: '#10b981',
    accentColor: 'rgba(16,185,129,0.1)',
  },
  {
    id: 5,
    category: 'MedTech',
    tag: 'Peer Reviewed',
    title: 'Quantum Sensing in Clinical Diagnostics: MEG and NV-Centre Applications',
    excerpt: 'Reviewing the translational pathway from quantum magnetometry research to clinical magnetoencephalography systems — current sensitivity benchmarks, regulatory considerations, and 5-year deployment outlook.',
    author: 'Dr. Kavya Krishnan',
    role: 'MedTech Research Lead',
    readTime: '12 min read',
    date: 'Apr 2026',
    domain: 'MedTech',
    color: '#f59e0b',
    accentColor: 'rgba(245,158,11,0.1)',
  },
  {
    id: 6,
    category: 'Quantum Finance',
    title: 'Portfolio Optimisation via QAOA: Benchmarking Against Classical Solvers',
    excerpt: 'Empirical comparison of Quantum Approximate Optimisation Algorithm performance on 50-asset portfolio problems versus Markowitz mean-variance and Black-Litterman models on IBMQ and Quantinuum hardware.',
    author: 'Rahul Desai',
    role: 'FinTech Research Analyst',
    readTime: '10 min read',
    date: 'Mar 2026',
    domain: 'FinTech',
    color: '#8b5cf6',
    accentColor: 'rgba(139,92,246,0.1)',
  },
];

const DOMAINS = ['All', 'Quantum', 'Quantum-AI', 'Security', 'EdTech', 'MedTech', 'FinTech'];

function ArticleCardCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = color + '99';
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 50) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = color + Math.floor((1 - d / 50) * 40).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color]);
  return <canvas ref={canvasRef} width={300} height={200} className="absolute inset-0 w-full h-full opacity-40" />;
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, rgba(6,13,26,0.95) 0%, ${article.accentColor} 100%)`,
        border: `1px solid ${article.color}22`,
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0 ? `0 20px 60px ${article.color}22` : '0 4px 24px rgba(0,0,0,0.3)',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Canvas background */}
      <div className="absolute inset-0 overflow-hidden">
        <ArticleCardCanvas color={article.color} />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${article.color}, transparent)` }} />

      <div className="relative z-10 p-6">
        {/* Category + Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-narrow text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: article.color }}>
            {article.category}
          </span>
          {article.tag && (
            <span
              className="font-narrow text-[9px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 rounded-full"
              style={{ background: article.color + '22', color: article.color, border: `1px solid ${article.color}44` }}
            >
              {article.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-archivo font-semibold text-[1rem] leading-snug text-[#f3f3f3] mb-3 group-hover:text-white transition-colors line-clamp-3">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="font-narrow text-[0.8rem] text-[rgba(243,243,243,0.5)] leading-relaxed line-clamp-3 mb-5">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <div>
            <div className="font-narrow text-[11px] font-semibold text-[rgba(243,243,243,0.8)]">{article.author}</div>
            <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)]">{article.role}</div>
          </div>
          <div className="text-right">
            <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.5)]">{article.readTime}</div>
            <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.35)]">{article.date}</div>
          </div>
        </div>

        {/* Read more arrow */}
        <div
          className="mt-4 flex items-center gap-2 font-narrow text-[11px] font-semibold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: article.color }}
        >
          Read Article
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedArticlesSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? ARTICLES : ARTICLES.filter(a => a.domain === activeFilter);

  return (
    <section id="articles" className="py-24 relative" style={{ background: '#060d1a' }}>
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0e76ff]/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0e76ff]">Research Articles</span>
            </div>
            <h2 className="font-archivo font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#f3f3f3] leading-tight">
              Quantum Research & Insights
            </h2>
            <p className="font-narrow text-[0.9rem] text-[rgba(243,243,243,0.5)] mt-2 max-w-lg">
              Original research, technical deep-dives, and expert commentary from QWV researchers and fellows.
            </p>
          </div>

          {/* Domain filters */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => setActiveFilter(d)}
                className="font-narrow text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  background: activeFilter === d ? '#0e76ff' : 'rgba(14,118,255,0.08)',
                  color: activeFilter === d ? '#fff' : 'rgba(243,243,243,0.55)',
                  border: `1px solid ${activeFilter === d ? '#0e76ff' : 'rgba(14,118,255,0.2)'}`,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Featured article — full width */}
        {activeFilter === 'All' && (
          <div className="mb-8">
            <FeaturedArticleWide article={ARTICLES[0]} />
          </div>
        )}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeFilter === 'All' ? filtered.slice(1) : filtered).map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedArticleWide({ article }: { article: Article }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, rgba(6,13,26,0.97) 0%, rgba(14,118,255,0.08) 100%)`,
        border: '1px solid rgba(14,118,255,0.2)',
        transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0 ? '0 30px 80px rgba(14,118,255,0.15)' : '0 8px 40px rgba(0,0,0,0.4)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0e76ff] via-[#3b82f6] to-transparent" />
      <div className="absolute inset-0 overflow-hidden">
        <ArticleCardCanvas color="#0e76ff" />
      </div>
      <div className="relative z-10 p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-narrow text-[10px] font-semibold tracking-[0.18em] uppercase text-[#0e76ff]">{article.category}</span>
            <span className="font-narrow text-[9px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-[#0e76ff]/20 text-[#0e76ff] border border-[#0e76ff]/40">
              {article.tag}
            </span>
          </div>
          <h3 className="font-archivo font-bold text-[clamp(1.2rem,2.5vw,1.8rem)] leading-snug text-[#f3f3f3] mb-3 group-hover:text-white transition-colors max-w-2xl">
            {article.title}
          </h3>
          <p className="font-narrow text-[0.85rem] text-[rgba(243,243,243,0.55)] leading-relaxed max-w-2xl mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-6">
            <div>
              <div className="font-narrow text-[12px] font-semibold text-[rgba(243,243,243,0.85)]">{article.author}</div>
              <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)]">{article.role}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="font-narrow text-[11px] text-[rgba(243,243,243,0.45)]">{article.readTime} · {article.date}</div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center w-40">
          <div
            className="flex items-center gap-2 font-narrow text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0e76ff] group-hover:gap-3 transition-all"
          >
            Read Full Article
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
