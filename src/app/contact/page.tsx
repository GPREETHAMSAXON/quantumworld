'use client';

import React from 'react';
import ContactHeroSection from './components/ContactHeroSection';
import ContactInquiryForm from './components/ContactInquiryForm';
import SupportChannelsSection from './components/SupportChannelsSection';
import FAQSection from './components/FAQSection';

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: '#060d1a' }}>
      <ContactHeroSection />
      <ContactInquiryForm />
      <SupportChannelsSection />
      <FAQSection />
    </main>
  );
}
