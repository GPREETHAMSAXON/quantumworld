import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Quantum World Ventures — Quantum L&D, R&D & Consulting',
  description:
    'Learn about Quantum World Ventures — our mission, vision, leadership team, 8-tier fellowship pathway, and the Discovery-to-Delivery journey that drives real-world quantum impact across India.',
  openGraph: {
    title: 'About Quantum World Ventures',
    description:
      'A Quantum L&D, R&D & Consulting company carrying research from discovery to deployable impact.',
    url: 'https://quantumwor6612.builtwithrocket.new/about',
    siteName: 'Quantum World Ventures',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Quantum World Ventures',
    description: 'Quantum L&D, R&D & Consulting — from Discovery to Delivery.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
