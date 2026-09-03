import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fellowship Program | Quantum World Ventures — AI & Quantum Research Fellowship',
  description:
    'Join the Quantum World Ventures Fellowship — 21 specialized fellowships, 8-tier leadership pathway, and a pan-India network for students, faculty, researchers, innovators and entrepreneurs.',
  openGraph: {
    title: 'Fellowship Program | Quantum World Ventures',
    description:
      '21 specialized fellowships, 8-tier leadership pathway, and a pan-India quantum innovation network.',
    url: 'https://quantumwor6612.builtwithrocket.new/fellowship',
    siteName: 'Quantum World Ventures',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fellowship Program | Quantum World Ventures',
    description: '21 specialized fellowships, 8-tier leadership pathway — AI & Quantum Research Fellowship.',
  },
};

export default function FellowshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
