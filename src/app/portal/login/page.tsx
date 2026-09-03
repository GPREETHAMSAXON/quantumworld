'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/portal/admin',
  intern: '/portal/intern',
  mentor: '/portal/mentor',
};

export default function PortalLoginPage() {
  const router = useRouter();
  const { signIn, getUserProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      const profile = await getUserProfile();

      if (!profile) {
        setError('Account not found. Please contact your administrator.');
        setLoading(false);
        return;
      }

      if (profile.status === 'disabled') {
        setError('Your account has been disabled. Please contact your administrator.');
        setLoading(false);
        return;
      }

      if (profile.status === 'invited') {
        setError('Your account is pending activation. Please contact your administrator.');
        setLoading(false);
        return;
      }

      const dashboardPath = ROLE_ROUTES[profile.role];
      if (dashboardPath) {
        router.push(dashboardPath);
      } else {
        setError('Invalid account role. Please contact your administrator.');
        setLoading(false);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Email not confirmed. Please contact your administrator.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1525 50%, #060d1a 100%)' }}
    >
      {/* Background particle grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loginGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0e76ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>
        {/* Glow orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #0e76ff 0%, transparent 70%)' }}
        />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-[420px]">
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(10, 18, 37, 0.85)',
            border: '1px solid rgba(14, 118, 255, 0.18)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(14,118,255,0.08)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-12 h-12 mb-4">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e76ff" />
                    <stop offset="100%" stopColor="#99c5ff" />
                  </linearGradient>
                </defs>
                <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#loginLogoGrad)" strokeWidth="1.5" />
                <polygon points="16,2 28,16 16,16" fill="rgba(14,118,255,0.15)" />
                <polygon points="4,16 16,16 16,30" fill="rgba(153,197,255,0.1)" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="url(#loginLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <line x1="4" y1="16" x2="28" y2="16" stroke="url(#loginLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
              </svg>
            </div>
            <h1
              className="text-[#f3f3f3] text-center"
              style={{ fontFamily: "'Archivo', sans-serif", fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              Quantum World Ventures
            </h1>
            <p
              className="text-[#0e76ff] text-center mt-1"
              style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              Portal Access
            </p>
          </div>

          {/* Divider */}
          <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,118,255,0.3), transparent)' }} />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.55)' }}
                className="block mb-2"
              >
                Email / User ID
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@quantumworld.in"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg text-[#f3f3f3] placeholder-[rgba(243,243,243,0.25)] outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(243,243,243,0.1)',
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '14px',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(14,118,255,0.5)'; e.currentTarget.style.background = 'rgba(14,118,255,0.05)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(243,243,243,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.55)' }}
                className="block mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-lg text-[#f3f3f3] placeholder-[rgba(243,243,243,0.25)] outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(243,243,243,0.1)',
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: '14px',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(14,118,255,0.5)'; e.currentTarget.style.background = 'rgba(14,118,255,0.05)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(243,243,243,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgba(243,243,243,0.4)] hover:text-[rgba(243,243,243,0.7)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '13px', color: 'rgba(252,165,165,0.9)' }}>{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(14,118,255,0.5)' : '#0e76ff',
                color: '#ffffff',
                fontFamily: "'Archivo Narrow', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(14,118,255,0.3)',
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-5 text-center">
            <Link
              href="/portal/forgot-password"
              style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(14,118,255,0.8)', letterSpacing: '0.05em' }}
              className="hover:text-[#0e76ff] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Footer note */}
          <p
            className="text-center mt-8"
            style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.25)', letterSpacing: '0.05em' }}
          >
            Access is restricted to authorized personnel only.
            <br />
            Contact your administrator to request access.
          </p>
        </div>

        {/* Back to main site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}
