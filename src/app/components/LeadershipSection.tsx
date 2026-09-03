'use client';

import React, { useRef, useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

const leaders = [
{
  name: 'Santosh Talaghatti',
  role: 'Founder & Managing Director',
  bio: 'Visionary entrepreneur and quantum technology advocate with deep expertise in building research ecosystems. Leads QWV\'s strategic direction, institutional partnerships and national mission alignment.',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_144991ef8-1763300012857.png',
  imageAlt: 'Professional headshot of Santosh Talaghatti, founder of Quantum World Ventures, in business attire against modern office background',
  tags: ['Quantum Strategy', 'Institutional Partnerships', 'National Mission']
},
{
  name: 'Research Division',
  role: 'Quantum Scientists & Engineers',
  bio: 'A multidisciplinary team of quantum physicists, AI researchers, engineers and domain experts driving QWV\'s R&D agenda across MedTech, EdTech, FinTech and SecureTech.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11718d303-1765783469369.png",
  imageAlt: 'Team of researchers and scientists collaborating in modern laboratory environment with computers and scientific equipment',
  tags: ['Quantum Physics', 'AI Research', 'Applied Science']
},
{
  name: 'Advisory Board',
  role: 'Industry & Academic Advisors',
  bio: 'Senior advisors from IITs, AIIMS, government bodies and industry bringing decades of expertise in quantum technology, policy, healthcare and national security.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_151d82005-1772095647243.png",
  imageAlt: 'Group of senior professionals in formal meeting setting, advisory board discussion in modern conference room',
  tags: ['IIT Faculty', 'Policy Experts', 'Industry Leaders']
}];


export default function LeadershipSection() {
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
      className="relative overflow-hidden border-t border-black/8"
      id="leadership"
      ref={ref}
      style={{ background: '#f7f7f5' }}>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)'
          }}>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-black/30" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/50">
                INSIGHTS FROM THE TEAM
              </span>
            </div>
            <h2 className="section-headline text-black">Leadership &amp; Team</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px] bg-black/20" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-black/40">
              Built by Proven Pioneers
            </span>
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/8">
          {leaders?.map((leader, i) =>
          <div
            key={leader?.name}
            className="group border-r border-black/8 last:border-r-0 overflow-hidden cursor-pointer"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${i * 120}ms`
            }}>
            
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <AppImage
                src={leader?.image}
                alt={leader?.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw" />
              
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(247,247,245,0.9) 0%, transparent 60%)' }} />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-archivo font-medium text-[18px] text-black leading-tight mb-1">
                  {leader?.name}
                </h3>
                <p className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-[#0e76ff] mb-4">
                  {leader?.role}
                </p>
                <p className="font-archivo text-[13px] text-black/55 leading-relaxed mb-5">
                  {leader?.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {leader?.tags?.map((tag) =>
                <span
                  key={tag}
                  className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 border border-black/10 text-black/40">
                  
                      {tag}
                    </span>
                )}
                </div>

                <div className="mt-5 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}