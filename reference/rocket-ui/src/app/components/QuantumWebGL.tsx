'use client';

import React from 'react';
import CSSParticleField from '@/components/ui/CSSParticleField';

/**
 * QuantumWebGL — CSS/SVG replacement for the original Three.js WebGL atom.
 * Eliminates the WebGL context entirely while preserving the same visual language:
 * orbital rings, icosahedron wireframe, particle field, and nucleus glow.
 */
export default function QuantumWebGL({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`} aria-hidden="true">
      {/* Radial glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(14,118,255,0.12) 0%, rgba(14,118,255,0.04) 50%, transparent 80%)',
        }}
      />

      {/* CSS particle field */}
      <CSSParticleField
        variant="hero"
        count={70}
        color="#0e76ff"
        orbitalRings
        icoWireframe
        scanLines
      />

      {/* Central nucleus glow — pure CSS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Outer glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(14,118,255,0.18) 0%, transparent 70%)',
              animation: 'nucleusPulse 3s ease-in-out infinite',
            }}
          />
          {/* Mid glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(14,118,255,0.35) 0%, transparent 70%)',
              animation: 'nucleusPulse 3s ease-in-out infinite 0.5s',
            }}
          />
          {/* Core */}
          <div
            className="rounded-full"
            style={{
              width: 22,
              height: 22,
              background: 'radial-gradient(circle, #60a5fa 0%, #0e76ff 60%)',
              boxShadow: '0 0 20px rgba(14,118,255,0.8), 0 0 40px rgba(14,118,255,0.4)',
              animation: 'nucleusPulse 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes nucleusPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
