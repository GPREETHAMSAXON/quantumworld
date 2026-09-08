'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const courses = [
  { code: 'QC-01', title: 'Foundations of Quantum Computing', duration: '1 Day', level: 'Beginner' },
  { code: 'QC-02', title: 'Quantum Algorithms & Applications', duration: '1 Day', level: 'Intermediate' },
  { code: 'QC-03', title: 'Quantum Machine Learning', duration: '1 Day', level: 'Advanced' },
  { code: 'QC-04', title: 'Quantum Cryptography & Security', duration: '1 Day', level: 'Intermediate' },
  { code: 'QC-05', title: 'Quantum Sensing & Metrology', duration: '1 Day', level: 'Advanced' },
  { code: 'QC-06', title: 'Quantum Communication Systems', duration: '1 Day', level: 'Intermediate' },
];

const fellowships = [
  { id: 'F-01', title: 'Quantum Research Fellowship', domain: 'Research', duration: '6 months' },
  { id: 'F-02', title: 'Quantum MedTech Fellowship', domain: 'Healthcare', duration: '6 months' },
  { id: 'F-03', title: 'Quantum EdTech Fellowship', domain: 'Education', duration: '6 months' },
  { id: 'F-04', title: 'Quantum FinTech Fellowship', domain: 'Finance', duration: '6 months' },
  { id: 'F-05', title: 'Quantum SecureTech Fellowship', domain: 'Security', duration: '6 months' },
  { id: 'F-06', title: 'Quantum Policy Fellowship', domain: 'Policy', duration: '3 months' },
];

export default function FellowshipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'fellowships'>('courses');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      id="fellowship"
      ref={ref}
      style={{ background: '#f7f7f5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-black/30" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/50">
                QUANTUM L&amp;D PROGRAMS
              </span>
            </div>
            <h2 className="section-headline text-black">
              Education for
              <span className="block" style={{ color: '#0e76ff' }}>Everyone,</span>
              Engineered to
              <span className="block">Compound.</span>
            </h2>
          </div>
          <div>
            <p className="font-archivo text-[15px] text-black/55 leading-relaxed mb-6">
              QWV&apos;s L&amp;D division offers 14 one-day quantum courses and 21 specialized fellowship pathways — designed for students, researchers, professionals and institutions.
            </p>
            <div className="flex gap-3">
              <Link href="#fellowship" className="btn-primary flex items-center gap-2">
                Apply for Fellowship
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="#fellowship" className="btn-ghost-dark flex items-center gap-2">
                View All Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-0 border-b border-black/10 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}
        >
          {(['courses', 'fellowships'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-narrow text-[12px] font-medium tracking-[0.1em] uppercase px-6 py-3 border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-[#0e76ff] text-[#0e76ff]'
                  : 'border-transparent text-black/40 hover:text-black/70'
              }`}
            >
              {tab === 'courses' ? '14 One-Day Courses' : '21 Fellowship Pathways'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          {activeTab === 'courses' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/8">
              {courses.map((course, i) => (
                <div
                  key={course.code}
                  className="group p-6 border-b border-r border-black/8 last:border-b-0 hover:bg-black/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      {course.code}
                    </span>
                    <span className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase text-black/30 border border-black/10 px-2 py-0.5">
                      {course.level}
                    </span>
                  </div>
                  <h4 className="font-archivo font-medium text-[15px] text-black leading-snug mb-3">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-narrow text-[11px] text-black/40 tracking-wide">{course.duration}</span>
                  </div>
                  <div className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/8">
              {fellowships.map((f, i) => (
                <div
                  key={f.id}
                  className="group p-6 border-b border-r border-black/8 last:border-b-0 hover:bg-black/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff]">
                      {f.id}
                    </span>
                    <span className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase text-black/30 border border-black/10 px-2 py-0.5">
                      {f.domain}
                    </span>
                  </div>
                  <h4 className="font-archivo font-medium text-[15px] text-black leading-snug mb-3">
                    {f.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-narrow text-[11px] text-black/40 tracking-wide">{f.duration}</span>
                  </div>
                  <div className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-0 border border-black/8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        >
          {[
            { value: '14', label: 'One-Day Courses', sub: 'Quantum & AI topics' },
            { value: '21', label: 'Fellowship Pathways', sub: 'Specialized tracks' },
            { value: '8', label: 'Tier Pathway', sub: 'Progressive learning' },
            { value: '10K+', label: 'Target Participants', sub: 'Fellowship & Internship' },
          ].map((stat, i) => (
            <div key={stat.label} className="p-6 border-r border-black/8 last:border-r-0 text-center">
              <div className="font-archivo font-medium text-2xl text-black mb-1">{stat.value}</div>
              <div className="font-archivo text-[13px] font-medium text-black mb-0.5">{stat.label}</div>
              <div className="font-narrow text-[11px] text-black/40 tracking-wide">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
