import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'R&D Division — From Discovery to Delivery | Quantum World Ventures',
  description: 'Explore the Quantum World Ventures R&D Division — a four-layer research architecture spanning Fundamental Quantum Research, Applied AI, Translational Research, and MedTech Application Research.',
  openGraph: {
    title: 'R&D Division — From Discovery to Delivery | Quantum World Ventures',
    description: 'A four-layer research architecture carrying quantum and AI science from fundamental theory to deployable real-world impact.',
    type: 'website',
  },
};

export default function RDLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
