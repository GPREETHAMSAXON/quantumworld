'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoursesHeroSection from './components/CoursesHeroSection';
import CourseCatalogueSection from './components/CourseCatalogueSection';
import InstitutionalCohortSection from './components/InstitutionalCohortSection';

export default function CoursesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#060d1a' }}>
      <Header />
      <CoursesHeroSection />
      <CourseCatalogueSection />
      <InstitutionalCohortSection />
      <Footer />
    </main>
  );
}
