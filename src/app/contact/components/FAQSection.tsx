'use client';

import React, { useState } from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Fellowship',
    q: 'Who is eligible to apply for the QWV Fellowship?',
    a: 'The fellowship is open to students (UG/PG/PhD), faculty members, independent researchers, innovators, and entrepreneurs with a demonstrated interest in quantum computing, AI, or related deep-tech domains. There is no strict age limit — we evaluate based on academic background, research intent, and motivation.',
  },
  {
    category: 'Fellowship',
    q: 'How long does the fellowship programme run?',
    a: 'The fellowship spans 6 to 18 months depending on the tier and specialisation selected. The 8-tier pathway is designed to be progressive — fellows can advance tiers based on milestones, publications, and mentorship outcomes.',
  },
  {
    category: 'Fellowship',
    q: 'Is the fellowship fully remote or does it require physical presence?',
    a: 'The programme is primarily remote-first, with optional in-person cohort intensives held at partner institutions across India. Physical attendance is encouraged but not mandatory for most tiers.',
  },
  {
    category: 'Internship',
    q: 'What is the duration of the 6-month internship programme?',
    a: 'The structured internship runs for exactly 6 months, divided into 6 monthly modules. Each module focuses on a distinct competency — from quantum fundamentals and AI toolchains to real-world project delivery and final presentation.',
  },
  {
    category: 'Internship',
    q: 'Do interns receive a stipend or certificate?',
    a: 'All interns who complete the programme receive a formal completion certificate, a portfolio project, and a mentor reference letter. Stipends are available for select tracks and are disclosed at the time of offer.',
  },
  {
    category: 'Courses',
    q: 'Are the one-day courses available online?',
    a: 'Yes. All 14 one-day courses are available in both online (live virtual) and offline (on-site) formats. Institutional cohort bookings can be customised for hybrid delivery at your campus or facility.',
  },
  {
    category: 'Courses',
    q: 'Can institutions book courses for large cohorts?',
    a: 'Absolutely. We offer institutional cohort pricing starting from ₹5,200 per head for groups of 20 or more. Custom national-scale programmes are available for government bodies, PSUs, and large enterprises — contact us for a tailored proposal.',
  },
  {
    category: 'Partnerships',
    q: 'How can our university partner with Quantum World Ventures?',
    a: 'We offer MoU-based academic partnerships covering curriculum co-development, faculty training, joint research publications, and student programme integration. Reach out via the partnership email or use the inquiry form above with "Institutional Partnership" selected.',
  },
  {
    category: 'Partnerships',
    q: 'Does QWV offer R&D consulting for private organisations?',
    a: 'Yes. Our R&D consulting practice works with startups, enterprises, and government agencies on quantum-readiness assessments, AI strategy, and deep-tech implementation roadmaps. Engagements are scoped on a project basis.',
  },
  {
    category: 'General',
    q: 'How quickly will I receive a response after submitting the inquiry form?',
    a: 'Our team aims to respond to all inquiries within one business day. For urgent matters, we recommend calling the Programme Helpdesk directly during business hours (Mon–Fri, 10 AM – 6 PM IST).',
  },
];

const CATEGORIES = ['All', 'Fellowship', 'Internship', 'Courses', 'Partnerships', 'General'];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQS.filter((f) => activeCategory === 'All' || f.category === activeCategory);

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#060d1a' }}>
      {/* Divider */}
      <div className="absolute top-0 left-6 right-6 md:left-10 md:right-10 h-[1px] bg-[rgba(243,243,243,0.06)]" />

      <CSSParticleField variant="section" count={20} color="#0e76ff" icoWireframe className="z-0 opacity-25" />

      {/* Right glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[600px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at right, rgba(14,118,255,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-[#0e76ff]" />
            <span className="font-narrow text-[11px] font-medium tracking-[0.2em] uppercase text-[#0e76ff]">
              Frequently Asked Questions
            </span>
          </div>
          <h2
            className="font-archivo font-medium leading-[1.05] tracking-tight mb-4"
            style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', color: '#f3f3f3' }}
          >
            Answers to Common
            <span style={{ color: '#0e76ff' }}> Questions.</span>
          </h2>
          <p className="font-archivo text-[15px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.45)' }}>
            Can't find what you're looking for? Use the inquiry form above or contact us directly.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className="font-narrow text-[11px] font-medium tracking-[0.12em] uppercase px-4 py-2 rounded-full border transition-all duration-200"
              style={{
                background: activeCategory === cat ? '#0e76ff' : 'transparent',
                borderColor: activeCategory === cat ? '#0e76ff' : 'rgba(243,243,243,0.12)',
                color: activeCategory === cat ? '#fff' : 'rgba(243,243,243,0.5)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion — asymmetric two-column on large screens */}
        <div className="grid lg:grid-cols-2 gap-3">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-[8px] border overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isOpen ? 'rgba(14,118,255,0.3)' : 'rgba(243,243,243,0.07)',
                  background: isOpen ? 'rgba(14,118,255,0.04)' : 'rgba(14,118,255,0.01)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Category dot */}
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                      style={{ background: '#0e76ff', opacity: isOpen ? 1 : 0.4 }}
                    />
                    <span
                      className="font-archivo text-[14px] font-medium leading-snug transition-colors duration-200"
                      style={{ color: isOpen ? '#f3f3f3' : 'rgba(243,243,243,0.75)' }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: isOpen ? '#0e76ff' : 'rgba(243,243,243,0.15)',
                      background: isOpen ? 'rgba(14,118,255,0.15)' : 'transparent',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      style={{ color: isOpen ? '#0e76ff' : 'rgba(243,243,243,0.4)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  <div className="px-6 pb-5 pl-[calc(1.5rem+0.375rem+0.75rem)]">
                    <p className="font-archivo text-[14px] leading-relaxed" style={{ color: 'rgba(243,243,243,0.5)' }}>
                      {faq.a}
                    </p>
                    <div className="mt-3">
                      <span
                        className="font-narrow text-[9px] font-medium tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(14,118,255,0.1)', color: '#0e76ff' }}
                      >
                        {faq.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-[10px] border border-[rgba(14,118,255,0.15)] bg-[rgba(14,118,255,0.03)]">
          <div>
            <p className="font-archivo font-medium text-[16px] text-[#f3f3f3] mb-1">
              Still have questions?
            </p>
            <p className="font-archivo text-[13px]" style={{ color: 'rgba(243,243,243,0.45)' }}>
              Our team is happy to help with any specific queries not covered above.
            </p>
          </div>
          <a
            href="mailto:contact@quantumworldventures.in"
            className="btn-primary flex-shrink-0 text-[12px] flex items-center gap-2"
          >
            Email Us Directly
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
