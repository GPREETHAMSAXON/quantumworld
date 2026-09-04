'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInternDashboardData, type InternDashboardData, type ActivityEntry } from '@/lib/internship/internDashboard';
import { getNextAction } from '@/lib/internship/internNextAction';
import { getStatusLabel } from '@/lib/internship/stateMachine';
import { BUILT_INTERN_ROUTES } from '@/lib/internship/internRoutes';
import JourneyTracker from './_components/JourneyTracker';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function PercentCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${accent}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function InternDashboard() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [data, setData] = useState<InternDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getInternDashboardData(user.id, profile?.full_name || 'Intern').then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, profile]);

  const nextAction = getNextAction(data?.status ?? null);
  const ctaBuilt = nextAction.ctaRoute ? BUILT_INTERN_ROUTES.has(nextAction.ctaRoute) : false;

  return (
    <>
      <JourneyTracker status={data?.status ?? null} />

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.status ? `Current stage: ${getStatusLabel(data.status)}` : 'Setting up your internship journey...'}
        </p>
      </div>

      {/* Mini status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <PercentCard label="Profile" value={loading ? 0 : data?.profilePercent ?? 0} accent="bg-indigo-500" />
        <PercentCard label="Proposal" value={loading ? 0 : data?.proposalPercent ?? 0} accent="bg-blue-500" />
        <PercentCard label="Progress" value={loading ? 0 : data?.progressPercent ?? 0} accent="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Next Action */}
        <div className="lg:col-span-3 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">Next Action</p>
          <h2 className="text-lg font-semibold text-indigo-950 mb-1.5">{nextAction.title}</h2>
          <p className="text-sm text-indigo-800/80 mb-4">{nextAction.description}</p>
          {nextAction.ctaLabel && (
            <button
              type="button"
              onClick={() => ctaBuilt && nextAction.ctaRoute && router.push(nextAction.ctaRoute)}
              disabled={!ctaBuilt}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                ctaBuilt
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-indigo-200 text-indigo-500 cursor-not-allowed'
              }`}
            >
              {nextAction.ctaLabel}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
          {!nextAction.ctaLabel && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1">
              <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" />
              </svg>
              Waiting on review
            </span>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
          ) : data && data.activity.length > 0 ? (
            <ul className="space-y-3">
              {data.activity.map((entry: ActivityEntry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{entry.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(entry.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">No activity yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
