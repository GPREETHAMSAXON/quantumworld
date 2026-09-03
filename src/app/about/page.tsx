'use client';

import React from 'react';

import AboutHeroSection from './components/AboutHeroSection';
import MissionVisionSection from './components/MissionVisionSection';
import JourneyTimelineSection from './components/JourneyTimelineSection';
import FellowshipPathwaySection from './components/FellowshipPathwaySection';
import AboutLeadershipSection from './components/AboutLeadershipSection';
import AboutCtaSection from './components/AboutCtaSection';

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: '#060d1a' }}>
      <AboutHeroSection />
      <MissionVisionSection />
      <JourneyTimelineSection />
      <FellowshipPathwaySection />
      <AboutLeadershipSection />
      <AboutCtaSection />
    </main>
  );
}
