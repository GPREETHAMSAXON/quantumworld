import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Login — Quantum World Ventures',
  description: 'Secure portal access for Quantum World Ventures team members.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
