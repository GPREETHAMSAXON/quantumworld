'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';

export default function InternDashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'intern')) {
      router?.replace('/portal/login');
    }
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router?.replace('/portal/login');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-7 h-7 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const modules = [
    { title: 'Quantum Fundamentals', progress: 0, status: 'not_started' as const },
    { title: 'AI & Machine Learning', progress: 0, status: 'not_started' as const },
    { title: 'Research Methodology', progress: 0, status: 'not_started' as const },
    { title: 'Industry Applications', progress: 0, status: 'not_started' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 md:px-10 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
              <defs>
                <linearGradient id="internLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#internLogoGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="#4f46e5" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Intern Portal</span>
            <StatusBadge status="in_progress" label="Intern" showDot={false} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">{profile?.full_name || profile?.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            {profile?.full_name || 'Intern'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your internship progress, modules, and assignments here.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Modules Completed', value: '0 / 4', icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )},
            { label: 'Days Active', value: '—', icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )},
            { label: 'Assigned Mentor', value: '—', icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )},
          ]?.map((item) => (
            <div key={item?.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="mb-3">{item?.icon}</div>
              <div className="text-2xl font-semibold text-gray-900 tracking-tight">{item?.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{item?.label}</div>
            </div>
          ))}
        </div>

        {/* Internship Status */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">Internship Status</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Current Stage</p>
              <p className="text-xs text-gray-500">Your internship journey progress</p>
            </div>
            <StatusBadge status="not_started" size="md" />
          </div>
        </div>

        {/* Modules */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">Learning Modules</h2>
          <div className="space-y-3">
            {modules?.map((mod, i) => (
              <div
                key={mod?.title}
                className="flex items-center gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-600">
                    {String(i + 1)?.padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-2">{mod?.title}</div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${mod?.progress}%` }}
                    />
                  </div>
                </div>
                <StatusBadge status={mod?.status} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
