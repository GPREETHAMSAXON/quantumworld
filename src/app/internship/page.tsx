'use client';

import React from 'react';
import InternshipHeroSection from './components/InternshipHeroSection';
import EligibilitySection from './components/EligibilitySection';
import ModulesSection from './components/ModulesSection';
import JourneySection from './components/JourneySection';
import BenefitsCarousel from './components/BenefitsCarousel';
import InternshipApplicationForm from './components/InternshipApplicationForm';

export default function InternshipPage() {
  return (
    <main className="min-h-screen" style={{ background: '#060d1a' }}>
      <InternshipHeroSection />
      <EligibilitySection />
      <ModulesSection />
      <JourneySection />
      <BenefitsCarousel />
      <InternshipApplicationForm />
    </main>
  );
}
