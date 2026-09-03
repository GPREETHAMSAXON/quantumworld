import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internship Programme | Quantum World Ventures',
  description: 'Join the QWV 6-month structured internship programme. Empowering 10,000 interns through mentorship, real projects, and quantum-ready training. Open to UG, PG, and PhD students.',
  openGraph: {
    title: 'Internship Programme | Quantum World Ventures',
    description: 'A 6-month structured internship programme with 6 core modules, personal mentorship, real projects, and final certification. Apply now.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Internship Programme | Quantum World Ventures',
    description: 'Empowering 10,000 interns through quantum-ready training, mentorship, and real-world projects.',
  },
};

export default function InternshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
