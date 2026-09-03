import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quantum & AI Courses | Quantum World Ventures',
  description: '14 one-day intensive courses in Quantum Computing, AI, Quantum-AI Hybrid Systems, Cybersecurity, and Executive Strategy. Foundational to Expert levels. Individual and institutional cohort pricing.',
  openGraph: {
    title: 'Quantum & AI Course Catalogue | Quantum World Ventures',
    description: '14 precision-engineered one-day intensives from quantum fundamentals to enterprise AI deployment. Individual and institutional pricing available.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum & AI Courses | Quantum World Ventures',
    description: '14 one-day intensive courses covering Quantum Computing, AI, Cryptography, and Executive Strategy.',
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
