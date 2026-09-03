'use client';

import React from 'react';
import FellowshipHeroSection from './components/FellowshipHeroSection';
import FellowshipPathwaySection from './components/FellowshipPathwaySection';
import SpecializationsSection from './components/SpecializationsSection';
import FellowshipTimelineSection from './components/FellowshipTimelineSection';
import BenefitsSection from './components/BenefitsSection';
import FellowshipApplicationForm from './components/FellowshipApplicationForm';

export default function FellowshipPage() {
  return (
    <main className="min-h-screen" style={{ background: '#060d1a' }}>
      <FellowshipHeroSection />
      <FellowshipPathwaySection />
      <SpecializationsSection />
      <FellowshipTimelineSection />
      <BenefitsSection />
      <FellowshipApplicationForm />
    </main>
  );
}
