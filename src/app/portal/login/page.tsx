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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 mb-4 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <defs>
                  <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#loginLogoGrad)" strokeWidth="1.5" />
                <polygon points="16,2 28,16 16,16" fill="rgba(79,70,229,0.12)" />
                <polygon points="4,16 16,16 16,30" fill="rgba(59,130,246,0.08)" />
                <circle cx="16" cy="16" r="2.5" fill="#4f46e5" />
              </svg>
            </div>
            <h1 className="text-gray-900 text-center text-lg font-semibold tracking-tight">
              Quantum World Ventures
            </h1>
            <p className="text-indigo-600 text-center mt-1 text-xs font-medium tracking-widest uppercase">
              Research Portal
            </p>
          </div>

          <div className="h-px bg-gray-100 mb-8" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
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
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-200 bg-white text-sm outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
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
                  className="w-full px-4 py-2.5 pr-11 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-200 bg-white text-sm outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center gap-2 mt-1 shadow-sm"
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
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-5 text-center">
            <Link
              href="/portal/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  );
}
