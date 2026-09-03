'use client';

import React from 'react';
import RDHeroSection from './components/RDHeroSection';
import ResearchLayersSection from './components/ResearchLayersSection';
import ResearchAreasSection from './components/ResearchAreasSection';
import ResearchProcessSection from './components/ResearchProcessSection';
import RDCtaSection from './components/RDCtaSection';

export default function RDPage() {
  return (
    <main className="min-h-screen" style={{ background: '#060d1a' }}>
      <RDHeroSection />
      <ResearchLayersSection />
      <ResearchAreasSection />
      <ResearchProcessSection />
      <RDCtaSection />
    </main>
  );
}
