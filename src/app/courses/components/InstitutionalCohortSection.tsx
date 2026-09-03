'use client';

import React, { useEffect, useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

const COHORT_TIERS = [
  { name: 'Starter Cohort', size: '10–20 participants', price: '₹6,500', unit: 'per participant', savings: 'Save 18%', features: ['Any single course from catalogue', 'Dedicated facilitator', 'Custom scheduling', 'Digital certificates', 'Post-session Q&A (1 hr)'], color: '#0e76ff', highlight: false },
  { name: 'Enterprise Cohort', size: '21–50 participants', price: '₹5,200', unit: 'per participant', savings: 'Save 35%', features: ['Any 2 courses bundled', 'Senior faculty delivery', 'Custom case studies', 'Team certificates + LinkedIn badges', 'Post-session mentoring (3 hrs)', 'Learning management portal access'], color: '#a855f7', highlight: true },
  { name: 'National Programme', size: '51–200 participants', price: 'Custom', unit: 'volume pricing', savings: 'Max savings', features: ['Full catalogue access', 'Multi-city delivery', 'Bespoke curriculum design', 'Dedicated programme manager', 'Quarterly impact reports', 'Government / PSU billing supported'], color: '#d97706', highlight: false },
];

export default function InstitutionalCohortSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="cohort" className="relative py-28 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* CSS/SVG background — replaces Three.js cohort network WebGL */}
      {mounted && <CSSParticleField variant="section" count={50} color="#0e76ff" networkGraph className="z-0" />}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1a]/80 via-[#060d1a]/60 to-[#060d1a]/90" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] animate-pulse" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.22em] uppercase text-[#0e76ff]">Institutional Programmes</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] animate-pulse" />
          </div>
          <h2 className="section-headline text-[#f3f3f3] mb-4">
            Train Your Entire<br />
            <span style={{ background: 'linear-gradient(135deg, #0e76ff, #99c5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Organisation</span>
          </h2>
          <p className="font-archivo text-[rgba(243,243,243,0.55)] text-[15px] max-w-2xl mx-auto leading-relaxed">
            Volume pricing for teams, enterprises, universities, and government bodies. Custom delivery, bespoke case studies, and dedicated programme management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {COHORT_TIERS?.map((tier) => (
            <div key={tier?.name} className="relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: tier?.highlight ? `linear-gradient(135deg, ${tier?.color}18, rgba(10,18,32,0.95))` : '#0a1220', borderColor: tier?.highlight ? tier?.color + '50' : 'rgba(243,243,243,0.08)', boxShadow: tier?.highlight ? `0 0 40px ${tier?.color}20` : 'none' }}>
              {tier?.highlight && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${tier?.color}, transparent)` }} />}
              {tier?.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-full" style={{ background: tier?.color + '25', color: tier?.color, border: `1px solid ${tier?.color}50` }}>Most Popular</span>
                </div>
              )}
              <div className="p-7">
                <div className="mb-5">
                  <div className="font-narrow text-[9px] tracking-[0.18em] uppercase mb-1" style={{ color: tier?.color }}>{tier?.size}</div>
                  <h3 className="font-archivo font-medium text-[#f3f3f3] text-xl mb-1">{tier?.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-archivo font-medium text-3xl text-[#f3f3f3]">{tier?.price}</span>
                    <span className="font-narrow text-[11px] text-[rgba(243,243,243,0.45)]">{tier?.unit}</span>
                  </div>
                  <div className="inline-block mt-2 font-narrow text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded" style={{ background: tier?.color + '20', color: tier?.color }}>{tier?.savings}</div>
                </div>
                <div className="border-t border-white/6 pt-5 mb-6">
                  <div className="space-y-2.5">
                    {tier?.features?.map(f => (
                      <div key={f} className="flex items-start gap-2.5">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: tier?.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-archivo text-[12px] text-[rgba(243,243,243,0.65)]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full font-narrow text-[11px] font-medium tracking-[0.12em] uppercase py-3 rounded-lg transition-all duration-200"
                  style={tier?.highlight ? { background: tier?.color, color: '#fff', boxShadow: `0 0 24px ${tier?.color}50` } : { background: 'transparent', color: tier?.color, border: `1px solid ${tier?.color}50` }}>
                  {tier?.price === 'Custom' ? 'Request Proposal' : 'Book Cohort'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: '🏛️', label: 'Govt & PSU Billing', sub: 'GeM portal supported' },
            { icon: '📜', label: 'NSDC Aligned', sub: 'Skill India framework' },
            { icon: '🌐', label: 'Pan-India Delivery', sub: 'On-site or virtual' },
            { icon: '🔒', label: 'Secure Payments', sub: 'Razorpay / NEFT / RTGS' },
          ]?.map(t => (
            <div key={t?.label} className="flex items-center gap-3 p-4 rounded-xl border border-white/6 bg-white/[0.02]">
              <span className="text-2xl">{t?.icon}</span>
              <div>
                <div className="font-archivo font-medium text-[#f3f3f3] text-[13px]">{t?.label}</div>
                <div className="font-narrow text-[10px] text-[rgba(243,243,243,0.4)] tracking-[0.05em]">{t?.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center border border-[#0e76ff]/20"
          style={{ background: 'linear-gradient(135deg, rgba(14,118,255,0.12) 0%, rgba(10,18,32,0.95) 50%, rgba(168,85,247,0.08) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #0e76ff, #a855f7, transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #0e76ff40, transparent)' }} />
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e76ff] animate-pulse" />
            <span className="font-narrow text-[10px] font-medium tracking-[0.22em] uppercase text-[#0e76ff]">Ready to Upskill Your Team?</span>
          </div>
          <h3 className="font-archivo font-medium text-[#f3f3f3] text-3xl md:text-4xl mb-4 leading-tight">
            Start with a free<br />
            <span style={{ background: 'linear-gradient(135deg, #0e76ff, #99c5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>curriculum consultation</span>
          </h3>
          <p className="font-archivo text-[rgba(243,243,243,0.55)] text-[14px] max-w-xl mx-auto mb-8 leading-relaxed">
            Our programme architects will map your team's current competency levels to the right course sequence and build a custom learning pathway.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="btn-primary font-narrow text-[11px] flex items-center gap-2 px-8 py-3">
              Schedule Consultation
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="btn-ghost font-narrow text-[11px] px-8 py-3">Download Brochure</button>
          </div>
        </div>
      </div>
    </section>
  );
}
