'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'R&D', href: '/rd' },
  { label: 'Fellowship', href: '/fellowship' },
  { label: 'Internship', href: '/internship' },
  { label: 'Courses', href: '/courses' },
  { label: 'Insights', href: '/insights' },
  { label: 'Research', href: '#labs' },
  { label: 'Education', href: '#fellowship' },
  { label: 'Consulting', href: '#consulting' },
  { label: 'Mission', href: '#mission' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 80);

      // Determine if we're over a light section
      const heroHeight = window.innerHeight;
      setIsDark(scrollY < heroHeight * 0.8);

      // Progress
      const docHeight = document.documentElement?.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const textColor = scrolled ? (isDark ? 'text-[#f3f3f3]' : 'text-[#000000]') : 'text-[#f3f3f3]';
  const borderColor = scrolled ? (isDark ? 'border-white/8' : 'border-black/8') : 'border-transparent';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDark
              ? 'bg-[#060d1a]/95 backdrop-blur-xl'
              : 'bg-[#f7f7f5]/95 backdrop-blur-xl' :'bg-transparent'
        } border-b ${borderColor}`}
      >
        {/* Scroll progress line */}
        <div
          className="absolute bottom-0 left-0 h-[1px] bg-[#0e76ff] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="hLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e76ff" />
                    <stop offset="100%" stopColor="#99c5ff" />
                  </linearGradient>
                </defs>
                {/* Quantum diamond/octahedron shape */}
                <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#hLogoGrad)" strokeWidth="1.5" />
                <polygon points="16,2 28,16 16,16" fill="rgba(14,118,255,0.15)" stroke="none" />
                <polygon points="4,16 16,16 16,30" fill="rgba(153,197,255,0.1)" stroke="none" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="url(#hLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <line x1="4" y1="16" x2="28" y2="16" stroke="url(#hLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`font-archivo font-medium text-[15px] leading-tight tracking-tight transition-colors ${textColor}`}>
                Quantum World Ventures
              </span>
              <span className="font-narrow text-[9px] font-medium tracking-[0.18em] uppercase text-[#0e76ff]">
                Quantum L&amp;D · R&amp;D · Consulting
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems?.map((item) => (
              <Link
                key={item?.label}
                href={item?.href}
                className={`nav-item font-narrow transition-colors ${textColor} hover:text-[#0e76ff]`}
              >
                {item?.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="#fellowship"
              className={`btn-ghost font-narrow text-[11px] ${
                scrolled && !isDark ? 'btn-ghost-dark' : 'btn-ghost'
              }`}
            >
              Apply Fellowship
            </Link>
            <Link
              href="/contact"
              className="btn-primary font-narrow text-[11px] flex items-center gap-2"
            >
              Contact Us
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className={`lg:hidden flex flex-col gap-[5px] p-2 ${textColor}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-6 h-[1.5px] bg-current block" />
            <span className="w-4 h-[1.5px] bg-current block" />
            <span className="w-6 h-[1.5px] bg-current block" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-[#060d1a]/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#060d1a] border-l border-white/8 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <span className="font-archivo font-medium text-[#f3f3f3] text-sm">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#f3f3f3] p-1"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-1">
              {navItems?.map((item) => (
                <Link
                  key={item?.label}
                  href={item?.href}
                  className="block py-3 font-narrow text-[13px] font-medium tracking-[0.08em] uppercase text-[rgba(243,243,243,0.7)] hover:text-[#f3f3f3] border-b border-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
            <div className="p-6 space-y-3">
              <Link
                href="#fellowship"
                className="btn-ghost w-full justify-center text-[11px]"
                onClick={() => setMobileOpen(false)}
              >
                Apply Fellowship
              </Link>
              <Link
                href="/contact"
                className="btn-primary w-full justify-center text-[11px]"
                onClick={() => setMobileOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}