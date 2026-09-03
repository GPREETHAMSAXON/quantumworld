import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal — Quantum World Ventures',
  description: 'Secure portal access for Quantum World Ventures team members.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {children}
    </div>
  );
}
