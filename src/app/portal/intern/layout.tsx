'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import InternSidebar from './_components/InternSidebar';

export default function InternLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between shadow-sm">
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] px-3 py-5">
          <InternSidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
