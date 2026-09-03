'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal/login`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1525 50%, #060d1a 100%)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fpGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0e76ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fpGrid)" />
        </svg>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #0e76ff 0%, transparent 70%)' }}
        />
      </div>

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
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-12 h-12 mb-4">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="fpLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e76ff" />
                    <stop offset="100%" stopColor="#99c5ff" />
                  </linearGradient>
                </defs>
                <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#fpLogoGrad)" strokeWidth="1.5" />
                <polygon points="16,2 28,16 16,16" fill="rgba(14,118,255,0.15)" />
                <polygon points="4,16 16,16 16,30" fill="rgba(153,197,255,0.1)" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="url(#fpLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <line x1="4" y1="16" x2="28" y2="16" stroke="url(#fpLogoGrad)" strokeWidth="0.75" strokeDasharray="3 2" />
                <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
              </svg>
            </div>
            <h1
              className="text-[#f3f3f3] text-center"
              style={{ fontFamily: "'Archivo', sans-serif", fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              Reset Password
            </h1>
            <p
              className="text-center mt-1"
              style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.45)', letterSpacing: '0.05em' }}
            >
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,118,255,0.3), transparent)' }} />

          {sent ? (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(14,118,255,0.15)', border: '1px solid rgba(14,118,255,0.3)' }}
              >
                <svg className="w-6 h-6 text-[#0e76ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', color: '#f3f3f3', marginBottom: '8px' }}>
                Reset link sent!
              </p>
              <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.45)' }}>
                Check your email for the password reset link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fp-email"
                  style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.55)' }}
                  className="block mb-2"
                >
                  Email Address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@quantumworld.in"
                  required
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/portal/login"
              style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(14,118,255,0.8)', letterSpacing: '0.05em' }}
              className="hover:text-[#0e76ff] transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
