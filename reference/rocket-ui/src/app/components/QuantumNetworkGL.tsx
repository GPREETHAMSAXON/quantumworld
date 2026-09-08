'use client';

import React from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

/**
 * QuantumNetworkGL — CSS/SVG replacement for the original Three.js network graph.
 * Uses SVG network graph overlay + CSS particles. Zero WebGL context.
 */
export default function QuantumNetworkGL({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,118,255,0.08) 0%, transparent 70%)',
        }}
      />
      <CSSParticleField
        variant="section"
        count={50}
        color="#0e76ff"
        networkGraph
        scanLines
      />
    </div>
  );
}
