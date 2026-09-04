'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge, { type StatusType } from '@/components/ui/StatusBadge';
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
  type ActionSeverity,
} from '@/lib/internship/adminStats';

const SEVERITY_STATUS: Record<ActionSeverity, StatusType> = {
  high: 'attention_required',
  medium: 'pending',
  low: 'not_started',
};

const SEVERITY_ICON_BG: Record<ActionSeverity, string> = {
  high: 'bg-orange-50 border-orange-100 text-orange-600',
  medium: 'bg-yellow-50 border-yellow-100 text-yellow-600',
  low: 'bg-gray-50 border-gray-100 text-gray-500',
};

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="mb-3">{icon}</div>
      <div className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAdminDashboardStats().then((data) => {
      if (!cancelled) {
        setStats(data);
        setStatsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const maxPipelineCount = Math.max(1, ...(stats?.pipeline ?? []).map((s) => s.count));

  return (
    <>
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-1">Welcome back</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {profile?.full_name || 'Admin'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          A complete view of the internship ecosystem — pipeline, pending actions, and program health.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Interns"
          value={stats?.totalInterns ?? 0}
          icon={
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active"
          value={stats?.active ?? 0}
          icon={
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          label="Review"
          value={stats?.review ?? 0}
          icon={
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          label="Done"
          value={stats?.done ?? 0}
          icon={
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Internship Pipeline */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Internship Pipeline</h2>
            <span className="text-xs text-gray-400">{stats?.totalInterns ?? 0} total</span>
          </div>

          {statsLoading ? (
            <div className="py-8 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
          ) : (
            <div className="space-y-3">
              {stats?.pipeline.map((stage) => {
                const widthPct = stage.count === 0 ? 0 : Math.max(6, Math.round((stage.count / maxPipelineCount) * 100));
                return (
                  <div key={stage.key} className="flex items-center gap-3">
                    <div className="w-20 flex-shrink-0 text-xs font-medium text-gray-600">{stage.label}</div>
                    <div className="flex-1 h-6 rounded-md bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 flex items-center justify-end ${
                          widthPct > 0 ? 'px-2' : ''
                        }`}
                        style={{ width: `${widthPct}%` }}
                      >
                        {widthPct > 14 && (
                          <span className="text-[11px] font-semibold text-white">{stage.count}</span>
                        )}
                      </div>
                    </div>
                    {widthPct <= 14 && (
                      <span className="w-6 flex-shrink-0 text-xs font-semibold text-gray-700 text-right">
                        {stage.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Required */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Action Required</h2>
            {!!stats?.actionItems.length && (
              <StatusBadge status="attention_required" label={`${stats.actionItems.length}`} showDot={false} />
            )}
          </div>

          {statsLoading ? (
            <div className="py-8 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
          ) : stats?.actionItems.length ? (
            <ul className="space-y-2">
              {stats.actionItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-150"
                >
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${SEVERITY_ICON_BG[item.severity]}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                  <StatusBadge status={SEVERITY_STATUS[item.severity]} label={`${item.count}`} showDot={false} size="sm" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">All caught up</p>
              <p className="text-xs text-gray-500 mt-0.5">No pending admin actions right now.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
