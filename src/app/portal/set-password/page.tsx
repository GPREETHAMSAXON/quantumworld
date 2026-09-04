'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/portal/admin',
  intern: '/portal/intern',
  mentor: '/portal/mentor',
};

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: userData, error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message || 'Failed to set password. Please try again.');
      setLoading(false);
      return;
    }

    const userId = userData.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId)
        .select('role')
        .single();

      const dashboardPath = profile?.role ? ROLE_ROUTES[profile.role] : undefined;
      router.push(dashboardPath ?? '/portal/login');
      return;
    }

    router.push('/portal/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="spGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spGrid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-[420px]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 mb-4 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <defs>
                  <linearGradient id="spLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#spLogoGrad)" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="2.5" fill="#4f46e5" />
              </svg>
            </div>
            <h1 className="text-gray-900 text-center text-lg font-semibold tracking-tight">Set Your Password</h1>
            <p className="text-gray-500 text-center mt-1 text-sm">Choose a password to finish setting up your account</p>
          </div>

          <div className="h-px bg-gray-100 mb-8" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="sp-password" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
                New Password
              </label>
              <input
                id="sp-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-200 bg-white text-sm outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label htmlFor="sp-confirm" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="sp-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-200 bg-white text-sm outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Set Password & Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
