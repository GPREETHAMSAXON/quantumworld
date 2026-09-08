'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const journey = [
{ step: 'Discovery', desc: 'Fundamental quantum research' },
{ step: 'Research', desc: 'Applied & translational R&D' },
{ step: 'Prototype', desc: 'Working technology development' },
{ step: 'Validation', desc: 'Testing & clinical pilots' },
{ step: 'Deployment', desc: 'Real-world implementation' },
{ step: 'Impact', desc: 'Citizen-level outcomes' }];


export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setVisible(true);},
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden border-t border-white/8"
      id="about"
      ref={ref}
      style={{ background: 'linear-gradient(180deg, #060d1a 0%, #0a1525 100%)' }}>

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(14,118,255,0.06) 0%, transparent 60%)' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)'
            }}>
            
            <div className="relative">
              {/* Main image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_144991ef8-1763300012857.png"
                  alt="Professional male founder Santosh Talaghatti in modern research environment, confident pose, well-lit office setting with technology in background"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw" />
                
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,13,26,0.7) 0%, transparent 60%)' }} />
              </div>

              {/* Quote card */}
              <div
                className="absolute -bottom-6 -right-4 max-w-[280px] p-5 border border-white/10"
                style={{ background: 'rgba(38,38,41,0.9)', backdropFilter: 'blur(12px)' }}>
                
                <svg className="w-5 h-5 mb-2" fill="rgba(14,118,255,0.4)" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-archivo text-[13px] text-white/80 leading-relaxed italic mb-3">
                  &ldquo;We didn&apos;t set out to build another technology company. We set out to build the bridge between quantum research and a citizen&apos;s everyday life.&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center border border-[#0e76ff]/30 bg-[#0e76ff]/10">
                    <span className="font-narrow text-[10px] font-medium text-[#0e76ff]">ST</span>
                  </div>
                  <div>
                    <div className="font-archivo font-medium text-[12px] text-[#f3f3f3]">Santosh Talaghatti</div>
                    <div className="font-narrow text-[10px] text-white/40 tracking-wide">Founder &amp; Managing Director</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            className="lg:pt-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1) 0.15s'
            }}>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-white/20" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-white/40">
                ABOUT QWV
              </span>
            </div>

            <h2 className="section-headline text-[#f3f3f3] mb-6">
              A Quantum L&amp;D, R&amp;D
              <span className="block" style={{ color: '#0e76ff' }}>&amp; Consulting Company</span>
            </h2>

            <p className="font-archivo text-[15px] text-white/55 leading-relaxed mb-8">
              Quantum World Ventures is an ecosystem carrying quantum and AI research from discovery through testing, validation, partnerships and deployment — to create real, measurable impact in healthcare, education, public finance and national security.
            </p>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-white/8 mb-8">
              <div className="p-5 border-r border-white/8">
                <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff] mb-2">Vision</div>
                <p className="font-archivo font-medium text-[13px] text-[#f3f3f3] leading-relaxed">
                  Global Leadership in Quantum AI — making India a quantum superpower by 2035.
                </p>
              </div>
              <div className="p-5">
                <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-[#0e76ff] mb-2">Mission</div>
                <p className="font-archivo font-medium text-[13px] text-[#f3f3f3] leading-relaxed">
                  Build Quantum Labs, deliver Quantum L&amp;D, Centres of Excellence and provide technology consulting and R&amp;D support.
                </p>
              </div>
            </div>

            {/* Journey */}
            <div className="mb-8">
              <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-white/30 mb-4">Our Journey</div>
              <div className="flex flex-wrap items-center gap-2">
                {journey?.map((j, i) =>
                <React.Fragment key={j?.step}>
                    <div className="text-center">
                      <div className="font-archivo font-medium text-[13px] text-[#f3f3f3]">{j?.step}</div>
                      <div className="font-narrow text-[10px] text-white/35 tracking-wide">{j?.desc}</div>
                    </div>
                    {i < journey?.length - 1 &&
                  <svg className="w-3 h-3 text-[#0e76ff]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                  }
                  </React.Fragment>
                )}
              </div>
            </div>

            <Link href="#contact" className="btn-primary flex items-center gap-2 w-fit">
              Partner With QWV
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

}