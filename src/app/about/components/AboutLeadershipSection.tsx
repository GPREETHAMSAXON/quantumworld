'use client';

import React, { useRef, useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

// ===== LEADERSHIP CARD WebGL BACKGROUND =====
function LeaderCardGL({ color = '#0e76ff' }: {color?: string;}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(14,118,255,0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();ctx.moveTo(x, 0);ctx.lineTo(x, h);ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();ctx.moveTo(0, y);ctx.lineTo(w, y);ctx.stroke();
      }

      // Pulsing corner accent
      const pr = 30 + Math.sin(t * 1.5) * 8;
      const grad = ctx.createRadialGradient(w, 0, 0, w, 0, pr * 2);
      grad.addColorStop(0, 'rgba(14,118,255,0.15)');
      grad.addColorStop(1, 'rgba(14,118,255,0)');
      ctx.beginPath();
      ctx.arc(w, 0, pr * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      t += 0.02;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} />;
}

// ===== 3D LEADER CARD =====
function LeaderCard({
  leader, index, visible







}: {leader: {name: string;role: string;bio: string;image: string;imageAlt: string;tags: string[];expertise: string;color: string;};index: number;visible: boolean;}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setRotX(-dy * 5);
    setRotY(dx * 5);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {setHovered(false);setRotX(0);setRotY(0);}}
      style={{
        perspective: '800px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s`
      }}>
      
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: hovered ? 'transform 0.12s ease' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          background: hovered ? 'rgba(14,118,255,0.06)' : 'rgba(14,118,255,0.02)',
          border: `1px solid ${hovered ? 'rgba(14,118,255,0.25)' : 'rgba(243,243,243,0.08)'}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
        
        {/* Canvas background */}
        <div className="absolute inset-0 z-0">
          <LeaderCardGL />
        </div>

        {/* Image */}
        <div className="relative z-10 h-64 overflow-hidden">
          <AppImage
            src={leader.image}
            alt={leader.imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ filter: hovered ? 'brightness(1.05)' : 'brightness(0.9)' }} />
          
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(6,13,26,0.95) 0%, rgba(6,13,26,0.3) 50%, transparent 100%)'
            }} />
          
          {/* Expertise badge */}
          <div className="absolute top-4 right-4">
            <span
              className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1.5 border"
              style={{
                borderColor: 'rgba(14,118,255,0.4)',
                background: 'rgba(6,13,26,0.8)',
                color: '#0e76ff',
                backdropFilter: 'blur(8px)'
              }}>
              
              {leader.expertise}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <h3 className="font-archivo font-medium text-[20px] text-[#f3f3f3] leading-tight mb-1">
            {leader.name}
          </h3>
          <p className="font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-[#0e76ff] mb-4">
            {leader.role}
          </p>
          <p className="font-archivo text-[13px] leading-relaxed mb-5" style={{ color: 'rgba(243,243,243,0.5)' }}>
            {leader.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {leader.tags.map((tag) =>
            <span
              key={tag}
              className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 border"
              style={{ borderColor: 'rgba(243,243,243,0.1)', color: 'rgba(243,243,243,0.4)' }}>
              
                {tag}
              </span>
            )}
          </div>

          {/* Hover line */}
          <div
            className="mt-5 h-[1px] transition-all duration-500"
            style={{ width: hovered ? '100%' : '0%', background: '#0e76ff' }} />
          
        </div>
      </div>
    </div>);

}

const leaders = [
{
  name: 'Santosh Talaghatti',
  role: 'Founder & Managing Director',
  bio: 'Visionary entrepreneur and quantum technology advocate with deep expertise in building research ecosystems. Leads QWV\'s strategic direction, institutional partnerships, and national mission alignment across quantum AI, Digital India, and Smart Cities.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1373c1c56-1763291648235.png",
  imageAlt: 'Professional headshot of Santosh Talaghatti, Founder of Quantum World Ventures, in business attire',
  tags: ['Quantum Strategy', 'Institutional Partnerships', 'National Mission', 'Quantum AI'],
  expertise: 'Founder',
  color: '#0e76ff'
},
{
  name: 'Research Division',
  role: 'Quantum Scientists & Engineers',
  bio: 'A multidisciplinary team of quantum physicists, AI researchers, engineers and domain experts driving QWV\'s R&D agenda across MedTech, EdTech, FinTech and SecureTech — from fundamental research to prototype validation.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b86267bb-1766513599996.png",
  imageAlt: 'Team of researchers and scientists collaborating in a modern quantum research laboratory',
  tags: ['Quantum Physics', 'AI Research', 'Applied Science', 'Prototyping'],
  expertise: 'R&D',
  color: '#3b82f6'
},
{
  name: 'Advisory Board',
  role: 'Industry & Academic Advisors',
  bio: 'Senior advisors from IITs, AIIMS, government bodies and industry bringing decades of expertise in quantum technology, policy, healthcare and national security — guiding QWV\'s research direction and institutional strategy.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a91357cd-1777413828787.png",
  imageAlt: 'Group of senior professionals in formal advisory board meeting in modern conference room',
  tags: ['IIT Faculty', 'Policy Experts', 'Industry Leaders', 'Healthcare'],
  expertise: 'Advisory',
  color: '#60a5fa'
}];


const additionalLeaders = [
{ name: 'Dr. Rajendra Kumar Mishra', role: 'IPS (Retd.) — SecureTech Advisor', domain: 'Public Safety & Quantum SecureTech' },
{ name: 'D. Naga Chandra Teja', role: 'Technology Operations', domain: 'Quantum Systems & Infrastructure' },
{ name: 'Suraj Hanchinal', role: 'Research & Innovation', domain: 'Quantum Computing & AI' },
{ name: 'Dr. B. Omkar Lakshmi Jagan', role: 'MedTech Research', domain: 'Quantum Imaging & Diagnostics' },
{ name: 'Dhyan A', role: 'EdTech & L&D', domain: 'Quantum Education Programs' },
{ name: 'Fabian Emanuel Bredt', role: 'International Partnerships', domain: 'Global Quantum Collaboration' }];


export default function AboutLeadershipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setVisible(true);},
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
      id="leadership">
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,118,255,0.04) 0%, transparent 60%)'
      }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)'
          }}>
          
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-[#0e76ff]" />
              <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
                04 / LEADERSHIP & TEAM
              </span>
            </div>
            <h2 className="section-headline text-[#f3f3f3]">
              Built by
              <span className="block" style={{ color: '#0e76ff' }}>Proven Pioneers.</span>
            </h2>
          </div>
          <p className="font-archivo text-[15px] leading-relaxed max-w-md" style={{ color: 'rgba(243,243,243,0.5)' }}>
            A team of quantum scientists, AI researchers, policy experts, and institutional leaders 
            united by a single mission: making quantum technology real, accessible, and impactful.
          </p>
        </div>

        {/* Main leadership cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {leaders.map((leader, i) =>
          <LeaderCard key={leader.name} leader={leader} index={i} visible={visible} />
          )}
        </div>

        {/* Extended team grid */}
        <div
          className="border border-white/8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.5s'
          }}>
          
          <div className="p-6 border-b border-white/8">
            <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(243,243,243,0.4)' }}>
              Extended Leadership
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {additionalLeaders.map((person, i) =>
            <div
              key={person.name}
              className="group p-6 border-b border-r border-white/8 last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ease ${0.6 + i * 0.08}s`
              }}>
              
                <div className="flex items-start gap-4">
                  <div
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-archivo font-medium text-[12px] text-[#0e76ff]"
                  style={{ background: 'rgba(14,118,255,0.08)', border: '1px solid rgba(14,118,255,0.2)' }}>
                  
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-archivo font-medium text-[14px] text-[#f3f3f3] leading-tight mb-1">
                      {person.name}
                    </h4>
                    <p className="font-narrow text-[10px] font-medium tracking-[0.08em] uppercase text-[#0e76ff] mb-1">
                      {person.role}
                    </p>
                    <p className="font-narrow text-[10px] tracking-wide" style={{ color: 'rgba(243,243,243,0.35)' }}>
                      {person.domain}
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[#0e76ff]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}