'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: 'What is Quantum World Ventures?',
    a: 'Quantum World Ventures (QWV) is India\'s premier Quantum L&D, R&D and Consulting ecosystem. We carry quantum and AI research from discovery through testing, validation, partnerships and deployment to create real-world impact.',
  },
  {
    q: 'What is the National Quantum Mission?',
    a: 'The National Quantum Mission (NQM) is India\'s ₹6,003 Crore government initiative under the Department of Science & Technology, aimed at making India a global quantum technology leader by 2031. QWV is strategically aligned with NQM.',
  },
  {
    q: 'What are QWV\'s Quantum Change Labs?',
    a: 'QWV operates four specialized quantum research labs: Quantum MedTech (healthcare diagnostics), Quantum EdTech (campus innovation), Quantum SecureTech (public safety infrastructure) and Quantum FinTech (public financial systems).',
  },
  {
    q: 'How can I join the Fellowship Program?',
    a: 'QWV offers 21 specialized fellowship pathways across quantum research domains. Applications are open to students, researchers and professionals. Visit the Fellowship section or contact us directly to apply.',
  },
  {
    q: 'How can my university partner with QWV?',
    a: 'Universities can partner with QWV to establish Quantum Centres of Excellence, integrate quantum curriculum, access research infrastructure and participate in incubation programs. Contact our institutional partnerships team.',
  },
  {
    q: 'Does QWV offer consulting services?',
    a: 'Yes. QWV provides quantum technology consulting to schools, higher education institutions, MSMEs and startups — covering AI adoption, quantum curriculum design, prototype acceleration and technology roadmapping.',
  },
  {
    q: 'Where can I learn more or follow updates?',
    a: 'Follow QWV on LinkedIn at linkedin.com/company/quantumedtech, or contact us at info@quantumworld.in. You can also reach us at +91 7030441000.',
  },
];

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      id="contact"
      ref={ref}
      style={{ background: '#f7f7f5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black/8">
          {/* Left: FAQ header + contact */}
          <div className="p-10 md:p-14 border-r border-black/8">
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[1px] bg-black/30" />
                <span className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-black/50">
                  FAQ
                </span>
              </div>

              <h2 className="section-headline text-black mb-8">
                F A Q
              </h2>

              <p className="font-archivo text-[15px] text-black/55 leading-relaxed mb-8">
                Got more questions? We&apos;re here to help.
              </p>

              <Link
                href="mailto:info@quantumworld.in"
                className="btn-primary flex items-center gap-2 w-fit mb-12"
              >
                Reach Us
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Contact info */}
              <div className="space-y-4 border-t border-black/8 pt-8">
                <div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 mb-1">Email</div>
                  <a href="mailto:info@quantumworld.in" className="font-archivo text-[14px] text-black hover:text-[#0e76ff] transition-colors">
                    info@quantumworld.in
                  </a>
                </div>
                <div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 mb-1">Phone</div>
                  <a href="tel:+917030441000" className="font-archivo text-[14px] text-black hover:text-[#0e76ff] transition-colors">
                    +91 7030441000
                  </a>
                </div>
                <div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 mb-1">Headquarters</div>
                  <span className="font-archivo text-[14px] text-black">Bengaluru, India</span>
                </div>
                <div>
                  <div className="font-narrow text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 mb-1">LinkedIn</div>
                  <a
                    href="https://www.linkedin.com/company/quantumedtech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-archivo text-[14px] text-black hover:text-[#0e76ff] transition-colors"
                  >
                    linkedin.com/company/quantumedtech
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FAQ accordion */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s',
            }}
          >
            <ul>
              {faqs?.map((faq, i) => (
                <li
                  key={i}
                  className="faq-item border-b border-black/8 last:border-b-0"
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-narrow text-[11px] font-medium text-black/30 flex-shrink-0">
                        {String(i + 1)?.padStart(2, '0')}
                      </span>
                      <span className="font-archivo font-medium text-[14px] text-black leading-snug">
                        {faq?.q}
                      </span>
                    </div>
                    <div
                      className="w-5 h-5 flex-shrink-0 flex items-center justify-center border border-black/15 transition-transform duration-300"
                      style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>

                  {openIndex === i && (
                    <div className="px-6 pb-6 pl-[calc(1.5rem+2.25rem)]">
                      <p className="font-archivo text-[13px] text-black/55 leading-relaxed">
                        {faq?.a}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Cards */}
        <div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          {[
            { audience: 'Researchers', headline: 'Collaborate With R&D', desc: "Join QWV's quantum research ecosystem as a researcher, scientist or innovator.", href: '#contact', accent: '#0e76ff' },
            { audience: 'Students', headline: 'Apply for Fellowship', desc: 'Join 21 specialized fellowship pathways across India\'s quantum & AI frontier.', href: '#fellowship', accent: '#3b82f6' },
            { audience: 'Universities', headline: 'Partner With Us', desc: 'Establish a Quantum Centre of Excellence on your campus through QWV.', href: '#contact', accent: '#60a5fa' },
            { audience: 'Startups', headline: 'Explore Incubation', desc: 'Access technology roadmapping, prototype acceleration and technical due diligence.', href: '#contact', accent: '#0e76ff' },
            { audience: 'Hospitals', headline: 'Partner With MedTech', desc: 'Collaborate on quantum-enhanced imaging and diagnostic technology clinical pilots.', href: '#labs', accent: '#3b82f6' },
            { audience: 'Investors', headline: 'Explore Investment', desc: "Invest in India's most ambitious Quantum + AI research and deployment ecosystem.", href: '#contact', accent: '#60a5fa' },
          ]?.map((card, i) => (
            <div
              key={card?.audience}
              className="group p-7 border-r border-b border-black/8 hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              <span
                className="inline-block font-narrow text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 border mb-4"
                style={{ color: card?.accent, borderColor: `${card?.accent}30`, background: `${card?.accent}08` }}
              >
                {card?.audience}
              </span>
              <h3 className="font-archivo font-medium text-[17px] text-black leading-tight mb-2 group-hover:text-[#0e76ff] transition-colors">
                {card?.headline}
              </h3>
              <p className="font-archivo text-[13px] text-black/50 leading-relaxed mb-5">{card?.desc}</p>
              <Link
                href={card?.href}
                className="inline-flex items-center gap-2 font-narrow text-[11px] font-medium tracking-[0.1em] uppercase transition-all duration-300 group/link"
                style={{ color: card?.accent }}
              >
                {card?.headline}
                <svg
                  className="w-3 h-3 transition-transform group-hover/link:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <div className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500" style={{ background: card?.accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}