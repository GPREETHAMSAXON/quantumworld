'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
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

  const stats = [
    { label: 'Total Interns', value: '—', icon: '👥' },
    { label: 'Active Mentors', value: '—', icon: '🎓' },
    { label: 'Pending Invites', value: '—', icon: '📨' },
    { label: 'Active Accounts', value: '—', icon: '✅' },
  ];

  const quickActions = [
    { label: 'Create Intern Account', desc: 'Invite a new intern to the portal', icon: '➕' },
    { label: 'Create Mentor Account', desc: 'Invite a new mentor to the portal', icon: '➕' },
    { label: 'Manage Accounts', desc: 'Activate, disable, or update accounts', icon: '⚙️' },
    { label: 'View All Profiles', desc: 'Browse all portal members', icon: '📋' },
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
                <linearGradient id="adminLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0e76ff" />
                  <stop offset="100%" stopColor="#99c5ff" />
                </linearGradient>
              </defs>
              <polygon points="16,2 28,16 16,30 4,16" fill="none" stroke="url(#adminLogoGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="#0e76ff" />
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', fontWeight: 500, color: '#f3f3f3' }}>
              Admin Portal
            </span>
            <span
              className="ml-2 px-2 py-0.5 rounded text-[10px]"
              style={{ background: 'rgba(14,118,255,0.15)', color: '#0e76ff', fontFamily: "'Archivo Narrow', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(14,118,255,0.25)' }}
            >
              Admin
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
            {profile?.full_name || 'Admin'}
          </h1>
          <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '14px', color: 'rgba(243,243,243,0.45)', marginTop: '8px' }}>
            Manage portal accounts, roles, and access from this dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats?.map((stat) => (
            <div
              key={stat?.label}
              className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,243,243,0.07)' }}
            >
              <div className="text-2xl mb-2">{stat?.icon}</div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '24px', fontWeight: 500, color: '#f3f3f3', letterSpacing: '-0.02em' }}>
                {stat?.value}
              </div>
              <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '11px', color: 'rgba(243,243,243,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions?.map((action) => (
              <button
                key={action?.label}
                className="flex items-start gap-4 p-5 rounded-xl text-left transition-all duration-200 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,243,243,0.07)', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(14,118,255,0.3)'; e.currentTarget.style.background = 'rgba(14,118,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(243,243,243,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{action?.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', fontWeight: 500, color: '#f3f3f3', marginBottom: '4px' }}>
                    {action?.label}
                  </div>
                  <div style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.4)' }}>
                    {action?.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="rounded-xl p-6 flex items-start gap-4"
          style={{ background: 'rgba(14,118,255,0.06)', border: '1px solid rgba(14,118,255,0.15)' }}
        >
          <svg className="w-5 h-5 text-[#0e76ff] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '14px', color: '#f3f3f3', marginBottom: '4px' }}>
              Admin-only portal
            </p>
            <p style={{ fontFamily: "'Archivo Narrow', sans-serif", fontSize: '12px', color: 'rgba(243,243,243,0.45)' }}>
              Only administrators can create and activate intern and mentor accounts. Use the Supabase dashboard to manage user profiles directly until the full admin UI is built.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
