import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Quantum World Ventures — Quantum L&D, R&D & Consulting | India',
  description: 'Quantum World Ventures is India\'s premier Quantum + AI research ecosystem, delivering L&D, R&D and consulting across MedTech, EdTech, FinTech and SecureTech — aligned with India\'s National Quantum Mission.',
  keywords: ['Quantum Technology', 'Quantum AI', 'Deep Tech India', 'Quantum Research', 'National Quantum Mission', 'Quantum MedTech', 'Quantum EdTech'],
  openGraph: {
    title: 'Quantum World Ventures — Quantum & AI Research, Built for Real-World Impact',
    description: 'From Discovery to Delivery — India\'s Quantum L&D, R&D & Consulting ecosystem.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum World Ventures — Quantum & AI Research',
    description: 'India\'s premier Quantum + AI research ecosystem.',
    images: ['/assets/images/app_logo.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fquantumwor6612back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></head>
      <body style={{ fontFamily: "'Archivo', 'Arial', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}