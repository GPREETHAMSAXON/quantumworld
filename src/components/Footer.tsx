'use client';

import React from 'react';
import Link from 'next/link';

const footerLinks = {
  navigation: {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About QWV', href: '#about' },
      { label: 'Research Labs', href: '#labs' },
      { label: 'Fellowship', href: '#fellowship' },
      { label: 'Consulting', href: '#consulting' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  offerings: {
    title: 'Offerings',
    links: [
      { label: 'Quantum MedTech', href: '#labs' },
      { label: 'Quantum EdTech', href: '#labs' },
      { label: 'Quantum FinTech', href: '#labs' },
      { label: 'Quantum SecureTech', href: '#labs' },
      { label: 'L&D Programs', href: '#fellowship' },
      { label: 'Consulting', href: '#consulting' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About QWV', href: '#about' },
      { label: 'Leadership', href: '#leadership' },
      { label: 'National Mission', href: '#mission' },
      { label: 'Partners', href: '#partners' },
      { label: 'Media & News', href: '#news' },
      { label: 'Careers', href: '#careers' },
    ],
  },
};

export default function Footer() {
  return (
    <footer style={{ background: '#060d1a' }} className="border-t border-white/8">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="fLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0e76ff" />
                      <stop offset="100%" stopColor="#99c5ff" />
                    </linearGradient>
                  </defs>
                  <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#fLogoGrad)" strokeWidth="1.5" />
                  <polygon points="16,2 28,16 16,16" fill="rgba(14,118,255,0.15)" />
                  <polygon points="4,16 16,16 16,30" fill="rgba(153,197,255,0.1)" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="url(#fLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                  <line x1="4" y1="16" x2="28" y2="16" stroke="url(#fLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                  <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
                </svg>
              </div>
              <div>
                <div className="font-archivo font-medium text-[15px] text-[#f3f3f3] leading-tight">
                  Quantum World Ventures
                </div>
                <div className="font-narrow text-[9px] font-medium tracking-[0.18em] uppercase text-[#0e76ff]">
                  From Discovery to Delivery
                </div>
              </div>
            </div>

            <p className="font-archivo text-[13px] text-white/45 leading-relaxed max-w-xs">
              India&apos;s premier Quantum L&amp;D, R&amp;D &amp; Consulting ecosystem — carrying quantum research from discovery to real-world deployable impact.
            </p>

            {/* Newsletter */}
            <div>
              <div className="font-narrow text-[11px] font-medium tracking-[0.12em] uppercase text-white/40 mb-3">
                Sign up to stay sharp:
              </div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 font-archivo text-[13px] text-[#f3f3f3] placeholder:text-white/25 focus:outline-none focus:border-[#0e76ff]/40 transition-colors"
                />
                <button className="btn-primary px-4 py-2.5 text-[11px] flex-shrink-0">
                  SIGN UP
                </button>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-2">
              {[
                { city: 'Bengaluru', role: 'Headquarters' },
                { city: 'Andhra Pradesh', role: 'Research Operations' },
                { city: 'Delhi', role: 'Policy & Partnerships' },
              ]?.map((loc) => (
                <div key={loc?.city} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#0e76ff]" />
                  <span className="font-archivo text-[13px] text-white/60">
                    {loc?.city}
                    <span className="text-white/30 ml-1">— {loc?.role}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-1.5">
              <a href="mailto:info@quantumworld.in" className="footer-link flex items-center gap-2 text-[13px]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@quantumworld.in
              </a>
              <a href="tel:+917030441000" className="footer-link flex items-center gap-2 text-[13px]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +91 7030441000
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks)?.map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="font-narrow text-[11px] font-medium tracking-[0.15em] uppercase text-[#f3f3f3]">
                {section?.title}
              </h4>
              <ul className="space-y-2.5">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    <Link href={link?.href} className="footer-link">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#" className="footer-link text-[12px]">Privacy Policy</Link>
            <span className="text-white/15">|</span>
            <Link href="#" className="footer-link text-[12px]">Terms of Use</Link>
            <span className="text-white/15">|</span>
            <Link href="#" className="footer-link text-[12px]">Disclaimer</Link>
          </div>

          <p className="font-narrow text-[11px] text-white/30 tracking-wide">
            © 2026 Quantum World Ventures. ALL RIGHTS RESERVED
          </p>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-narrow text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            Back to top
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}