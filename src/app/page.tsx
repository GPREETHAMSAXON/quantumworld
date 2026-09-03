import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ValueStripSection from '@/app/components/ValueStripSection';
import MetricsSection from '@/app/components/MetricsSection';
import QuantumLabsSection from '@/app/components/QuantumLabsSection';
import TechVerticalsSection from '@/app/components/TechVerticalsSection';
import FellowshipSection from '@/app/components/FellowshipSection';
import AboutSection from '@/app/components/AboutSection';
import NationalMissionSection from '@/app/components/NationalMissionSection';
import LeadershipSection from '@/app/components/LeadershipSection';
import CtaSection from '@/app/components/CtaSection';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden" style={{ background: '#060d1a' }}>
      <Header />
      <HeroSection />
      <ValueStripSection />
      <MetricsSection />
      <QuantumLabsSection />
      <TechVerticalsSection />
      <FellowshipSection />
      <AboutSection />
      <NationalMissionSection />
      <LeadershipSection />
      <CtaSection />
      <Footer />
    </main>
  );
}