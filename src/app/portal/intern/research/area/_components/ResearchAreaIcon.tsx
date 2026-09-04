import React from 'react';

/**
 * Small decorative icon per primary research area. Keyed off
 * PRIMARY_RESEARCH_AREAS[].key. Plain stroke-style SVGs (no icon package
 * dependency), matching the stroke weight/viewBox convention used in
 * PortalSidebar's icon set.
 */
export default function ResearchAreaIcon({ areaKey, className = 'w-6 h-6' }: { areaKey: string; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  };

  switch (areaKey) {
    case 'quantum-computing':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'ai-ml':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.4" />
          <circle cx="5" cy="6" r="1.3" />
          <circle cx="19" cy="6" r="1.3" />
          <circle cx="5" cy="18" r="1.3" />
          <circle cx="19" cy="18" r="1.3" />
          <path strokeLinecap="round" d="M9.9 10.3L6.1 6.9M14.1 10.3l3.8-3.4M9.9 13.7l-3.8 3.4M14.1 13.7l3.8 3.4" />
        </svg>
      );
    case 'cyber-security':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 2.6v5.2c0 4.8-3 8.9-7 10.2-4-1.3-7-5.4-7-10.2V5.6L12 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4.2" />
        </svg>
      );
    case 'cloud-computing':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 17H8a4 4 0 01-.5-7.97A5.5 5.5 0 0117.7 11.1 3.5 3.5 0 0118 17z" />
        </svg>
      );
    case 'data-science':
      return (
        <svg {...common}>
          <line x1="6" y1="19" x2="6" y2="13" strokeLinecap="round" />
          <line x1="12" y1="19" x2="12" y2="5" strokeLinecap="round" />
          <line x1="18" y1="19" x2="18" y2="10" strokeLinecap="round" />
        </svg>
      );
    case 'iot':
      return (
        <svg {...common}>
          <circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none" />
          <path strokeLinecap="round" d="M8.5 15a5 5 0 017 0" />
          <path strokeLinecap="round" d="M5.5 12a9 9 0 0113 0" />
        </svg>
      );
    case 'robotics':
      return (
        <svg {...common}>
          <rect x="5" y="9" width="14" height="10" rx="2" />
          <circle cx="9.5" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <path strokeLinecap="round" d="M12 9V6" />
          <circle cx="12" cy="4.6" r="1.4" />
          <path strokeLinecap="round" d="M3 13h2m14 0h2" />
        </svg>
      );
    case 'biotech':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h4M9.5 3v6.4L5.6 16.9A2 2 0 007.3 20h9.4a2 2 0 001.7-3.1L14.5 9.4V3" />
          <path strokeLinecap="round" d="M7.7 15h8.6" />
        </svg>
      );
    case 'emerging-technology':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5l1.7 4.8L18.5 9l-4.8 1.7L12 15.5l-1.7-4.8L5.5 9l4.8-1.7L12 2.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
