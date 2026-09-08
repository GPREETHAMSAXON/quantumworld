'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  getMentorDashboard,
  type MentorDashboardData,
  type ProjectHealth,
} from '@/lib/internship/mentorDashboard';

const healthBadge: Record<
  ProjectHealth,
  { status: 'in_progress' | 'attention_required' | 'pending'; label: string }
> = {
  on_track: { status: 'in_progress', label: 'On Track' },
  attention: { status: 'attention_required', label: 'Attention' },
  review: { status: 'pending', label: 'Review' },
};

export default function MentorDashboard() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const version = useRef(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    const request = ++version.current;
    setLoading(true);
    setError(null);
    try {
      const next = await getMentorDashboard(user.id);
      if (request === version.current) setData(next);
    } catch (err) {
      if (request === version.current)
        setError(err instanceof Error ? err.message : 'Unable to load your dashboard.');
    } finally {
      if (request === version.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
    return () => {
      version.current++;
    };
  }, [refresh]);

  const cards = data
    ? [
        ['My Interns', data.myInterns, 'Assigned interns'],
        ['Proposals', data.proposalsAwaitingReview, 'Awaiting review'],
        ['Review', data.reviewsInProgress, 'In progress'],
        ['Active', data.activeProjects, 'Projects active'],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-600">
            Mentor dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {profile?.full_name || 'My projects'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your people, project progress, and approvals in one place.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void refresh()}
          className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p role="status" className="py-14 text-center text-sm text-gray-500">
          Loading dashboard...
        </p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([label, value, description]) => (
              <div
                key={String(label)}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            ))}
          </section>

          <section
            id="intern-projects"
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Intern Projects</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Only interns assigned to you are shown.
                </p>
              </div>
              <Link href="/portal/mentor/proposals" className="text-sm font-medium text-indigo-600">
                Proposal Reviews
              </Link>
            </div>
            {!data?.projects.length ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No interns are assigned to you yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-3 font-medium">Intern</th>
                      <th className="px-5 py-3 font-medium">Project</th>
                      <th className="px-5 py-3 font-medium">Progress</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.projects.map((project) => {
                      const badge = healthBadge[project.health];
                      return (
                        <tr key={project.id} className="border-t border-gray-100">
                          <td className="px-5 py-4 font-medium text-gray-900">
                            {project.intern?.full_name ||
                              project.intern?.email ||
                              'Assigned intern'}
                          </td>
                          <td className="max-w-xs px-5 py-4 text-gray-600">
                            <span className="line-clamp-2">{project.projectName}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-700">
                            {project.overall_progress_percent}%
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={badge.status} label={badge.label} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
