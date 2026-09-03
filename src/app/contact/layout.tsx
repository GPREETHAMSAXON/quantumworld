import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Quantum World Ventures — Inquiries, Partnerships & Support',
  description:
    'Get in touch with Quantum World Ventures for fellowship inquiries, institutional partnerships, research collaborations, course bookings, and general support.',
  openGraph: {
    title: 'Contact Us | Quantum World Ventures',
    description:
      'Reach out for fellowship, internship, courses, research collaboration, or institutional partnership inquiries.',
    url: 'https://quantumwor6612.builtwithrocket.new/contact',
    siteName: 'Quantum World Ventures',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Quantum World Ventures',
    description: 'Fellowship, internship, courses, research collaboration, and partnership inquiries.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
