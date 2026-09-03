'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060d1a' }}>
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 animate-spin text-[#0e76ff]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const modules = [
    { title: 'Quantum Fundamentals', progress: 0, status: 'Not Started', color: '#0e76ff' },
    { title: 'AI & Machine Learning', progress: 0, status: 'Not Started', color: '#0e76ff' },
    { title: 'Research Methodology', progress: 0, status: 'Not Started', color: '#0e76ff' },
    { title: 'Industry Applications', progress: 0, status: 'Not Started', color: '#0e76ff' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #060d1a 0%, #0a1525 100%)' }}>
      {/* Portal Header */}
      <header
        className="sticky top-0 z-40 px-6 md:px-10"
        style={{ background: 'rgba(6,13,26,0.95)', borderBottom: '1px solid rgba(243,243,243,0.06)', backdropFilter: 'blur(12px)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="internLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0e76ff" />
                  <stop offset="100%" stopColor="#99c5ff" />
                </linearGradient>
              </defs>
              <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#internLogoGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', fontWeight: 500, color: '#f3f3f3' }}>
              Intern Portal
            </span>
            <span
              className="ml-2 px-2 py-0.5 rounded text-[10px]"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', fontFamily: "'Archivo Narrow', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              Intern
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.5)' }}>
            {profile?.full_name || profile?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200"
            style={{ background: 'rgba(243,243,243,0.05)', border: '1px solid rgba(243,243,243,0.1)', fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: '#0e76ff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Welcome back
          </p>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 500, color: '#f3f3f3', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {profile?.full_name || 'Intern'}
          </h1>
          <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '14px', color: 'rgba(243,243,243,0.45)', marginTop: '8px' }}>
            Track your internship progress, modules, and assignments here.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Modules Completed', value: '0 / 4', icon: '📚' },
            { label: 'Days Active', value: '—', icon: '📅' },
            { label: 'Assigned Mentor', value: '—', icon: '🎓' },
          ]?.map((item) => (
            <div
              key={item?.label}
              className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,243,243,0.07)' }}
            >
              <div className="text-2xl mb-2">{item?.icon}</div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '22px', fontWeight: 500, color: '#f3f3f3', letterSpacing: '-0.02em' }}>
                {item?.value}
              </div>
              <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                {item?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div className="mb-10">
          <h2 style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Learning Modules
          </h2>
          <div className="space-y-3">
            {modules?.map((mod, i) => (
              <div
                key={mod?.title}
                className="flex items-center gap-4 p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,243,243,0.07)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(14,118,255,0.1)', border: '1px solid rgba(14,118,255,0.2)' }}
                >
                  <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: '#0e76ff', fontWeight: 600 }}>
                    {String(i + 1)?.padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', fontWeight: 500, color: '#f3f3f3', marginBottom: '6px' }}>
                    {mod?.title}
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(243,243,243,0.08)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mod?.progress}%`, background: '#0e76ff' }} />
                  </div>
                </div>
                <span
                  className="flex-shrink-0 px-2.5 py-1 rounded text-[10px]"
                  style={{ background: 'rgba(243,243,243,0.06)', color: 'rgba(243,243,243,0.4)', fontFamily: "'Archivo Narrow', sans-serif", letterSpacing: '0.06em' }}
                >
                  {mod?.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
