'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InsightsHeroSection from './components/InsightsHeroSection';
import FeaturedArticlesSection from './components/FeaturedArticlesSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import PublicationsSection from './components/PublicationsSection';
import ResourceDownloadsSection from './components/ResourceDownloadsSection';

export default function InsightsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#060d1a' }}>
      <Header />
      <InsightsHeroSection />
      <FeaturedArticlesSection />
      <CaseStudiesSection />
      <PublicationsSection />
      <ResourceDownloadsSection />
      <Footer />
    </main>
  );
}
