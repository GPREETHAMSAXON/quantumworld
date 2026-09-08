'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import MentorSidebar from './_components/MentorSidebar';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'mentor')) router.replace('/portal/login');
  }, [loading, user, profile, router]);
  if (loading || !profile)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Mentor Portal</span>
          <StatusBadge status="approved" label="Mentor" showDot={false} />
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-500 sm:block">
            {profile.full_name || profile.email}
          </span>
          <button
            type="button"
            onClick={() => void signOut().then(() => router.replace('/portal/login'))}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-gray-200 bg-white px-3 py-5 lg:block">
          <MentorSidebar />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
