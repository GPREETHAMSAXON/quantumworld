import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights & Research Hub | Quantum World Ventures',
  description: 'Thought leadership articles, quantum research publications, case studies, and resource downloads from Quantum World Ventures — bridging quantum science and real-world application.',
  openGraph: {
    title: 'Quantum Insights & Research Hub | Quantum World Ventures',
    description: 'Peer-reviewed research, applied case studies, and expert publications on quantum computing, AI, and emerging technology from QWV researchers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights & Research Hub | Quantum World Ventures',
    description: 'Quantum research articles, case studies, publication showcases, and downloadable resources from QWV.',
  },
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
