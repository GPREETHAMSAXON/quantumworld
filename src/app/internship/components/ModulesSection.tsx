'use client';

import React, { useEffect, useRef, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const modules = [
  { number: '01', title: 'Soft Skills for Career Development', subtitle: 'Communication · Leadership · Teamwork', description: 'Build the professional foundation every quantum-era career demands. Structured workshops on communication, presentation, critical thinking, and cross-functional collaboration.', outcomes: ['Professional communication frameworks', 'Leadership & team dynamics', 'Critical thinking & problem solving', 'Personal branding & career strategy'], duration: '3 Weeks', color: '#0e76ff' },
  { number: '02', title: 'Technology Skills in Your Domain', subtitle: 'Quantum · AI · DeepTech · Domain-Specific', description: 'Domain-specific technical training tailored to your background — from quantum computing fundamentals to AI applications, MedTech, FinTech, or SecureTech specialisations.', outcomes: ['Quantum computing fundamentals', 'AI & ML application basics', 'Domain-specific technology stack', 'Hands-on lab exercises'], duration: '4 Weeks', color: '#1a8cff' },
  { number: '03', title: 'Mentor Support', subtitle: 'Personal Mentor · Expert Guidance · 1:1 Sessions', description: 'Every intern is assigned a dedicated personal mentor — a researcher, industry expert, or senior fellow — providing structured guidance, feedback, and career direction.', outcomes: ['Dedicated personal mentor assignment', 'Weekly 1:1 mentorship sessions', 'Research guidance & feedback', 'Industry network access'], duration: '6 Months', color: '#2a9fff' },
  { number: '04', title: 'Project Management', subtitle: 'Real Projects · Agile · Delivery', description: "Work on a real project within Quantum World Ventures' ecosystem. Learn agile methodologies, project planning, stakeholder management, and delivery frameworks.", outcomes: ['Real project ownership', 'Agile & scrum methodology', 'Stakeholder communication', 'Delivery & milestone tracking'], duration: '8 Weeks', color: '#3ab2ff' },
  { number: '05', title: 'Pitch & Presentation Skills', subtitle: 'Storytelling · Investor Pitch · Demo Day', description: 'Transform your project into a compelling narrative. Learn to pitch to investors, present research findings, and communicate complex ideas to non-technical audiences.', outcomes: ['Investor pitch structure', 'Technical storytelling', 'Demo day preparation', 'Visual communication design'], duration: '3 Weeks', color: '#4ac5ff' },
  { number: '06', title: 'Governance & Capacity-Building Orientation', subtitle: 'Policy · National Mission · Institutional Impact', description: "Understand the broader ecosystem — India's National Quantum Mission, governance frameworks, policy landscape, and how your work connects to national and global impact.", outcomes: ['National Quantum Mission alignment', 'Policy & governance frameworks', 'Institutional collaboration models', 'Impact measurement & reporting'], duration: '2 Weeks', color: '#5ad8ff' },
];

export default function ModulesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section id="modules" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: '#04080f' }}>
      {/* CSS/SVG background — replaces Three.js hexagonal grid WebGL */}
      <CSSParticleField variant="section" count={40} color="#0e76ff" hexGrid className="z-0" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, #04080f 0%, rgba(4,8,15,0.5) 50%, #04080f 100%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.25em] uppercase text-[#0e76ff]">03 / Programme Modules</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-archivo font-bold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f3f3f3' }}>
              Six Modules.<br />
              <span style={{ background: 'linear-gradient(135deg, #0e76ff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Transformation.</span>
            </h2>
            <p className="font-archivo text-[rgba(243,243,243,0.5)] max-w-sm leading-relaxed text-sm">
              A structured curriculum designed to build quantum-ready professionals from the ground up — technical depth, professional breadth, and real-world impact.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules?.map((mod, i) => (
            <div key={i} className="relative group cursor-pointer transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)', transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s`, background: activeModule === i ? `linear-gradient(135deg, ${mod?.color}18 0%, ${mod?.color}06 100%)` : 'rgba(14,118,255,0.03)', border: `1px solid ${activeModule === i ? mod?.color + '50' : 'rgba(14,118,255,0.1)'}`, padding: '28px' }}
              onMouseEnter={() => setActiveModule(i)} onMouseLeave={() => setActiveModule(null)}>
              <div className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-500"
                style={{ background: activeModule === i ? `linear-gradient(90deg, transparent, ${mod?.color}, transparent)` : 'transparent' }} />
              <div className="flex items-start justify-between mb-5">
                <span className="font-archivo font-bold text-[3rem] leading-none" style={{ color: `${mod?.color}20` }}>{mod?.number}</span>
                <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1.5 transition-all duration-300"
                  style={{ background: activeModule === i ? `${mod?.color}20` : 'rgba(14,118,255,0.06)', border: `1px solid ${activeModule === i ? mod?.color + '40' : 'rgba(14,118,255,0.15)'}`, color: mod?.color }}>
                  {mod?.duration}
                </div>
              </div>
              <h3 className="font-archivo font-semibold text-[#f3f3f3] mb-2 leading-tight" style={{ fontSize: '1.05rem' }}>{mod?.title}</h3>
              <p className="font-narrow text-[10px] font-medium tracking-[0.1em] uppercase mb-4" style={{ color: `${mod?.color}80` }}>{mod?.subtitle}</p>
              <p className="font-archivo text-[rgba(243,243,243,0.5)] text-sm leading-relaxed mb-5">{mod?.description}</p>
              <div className="space-y-1.5">
                {mod?.outcomes?.map((outcome, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: mod?.color }} />
                    <span className="font-archivo text-[rgba(243,243,243,0.45)] text-[12px]">{outcome}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-6 right-6 h-[1px] transition-all duration-500"
                style={{ background: activeModule === i ? `${mod?.color}30` : 'transparent' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
