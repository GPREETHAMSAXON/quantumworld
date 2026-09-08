'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import { assignMentor, getMentorAssignment } from '@/lib/internship/assignMentor';

type AssignmentData = Awaited<ReturnType<typeof getMentorAssignment>>;

export default function AssignMentorPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inFlight = useRef(false);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++requestVersion.current;
    setLoading(true);
    setError(null);
    try {
      const result = await getMentorAssignment(id);
      if (version === requestVersion.current) setData(result);
    } catch (err) {
      if (version === requestVersion.current) {
        setData(null);
        setError(err instanceof Error ? err.message : 'Unable to load mentor recommendations.');
      }
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refresh();
    return () => {
      requestVersion.current++;
    };
  }, [refresh]);

  async function handleAssign(mentor: AssignmentData['mentors'][number]) {
    if (!data?.intern || inFlight.current) return;
    inFlight.current = true;
    setPending(mentor.id);
    setError(null);
    setMessage(null);
    try {
      const updated = await assignMentor(data.intern, mentor);
      setData({
        ...data,
        intern: { ...data.intern, ...updated },
        mentors: data.mentors.map((row) =>
          row.id === mentor.id ? { ...row, currentInterns: row.currentInterns + 1 } : row
        ),
      });
      setMessage(`${mentor.fullName} assigned successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed. Refresh and try again.');
    } finally {
      inFlight.current = false;
      setPending(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <Link href="/portal/admin/interns/status" className="text-sm font-medium text-indigo-600">
        ← Intern Management
      </Link>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Assign Mentor</h1>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading || !!pending}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-50"
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
      {message && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {message}
        </p>
      )}
      {loading ? (
        <p role="status" className="py-12 text-center text-sm text-gray-500">
          Loading recommended mentors...
        </p>
      ) : data && !data.intern ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          No internship record found for this intern.
        </p>
      ) : (
        data?.intern && (
          <>
            <section
              aria-label="Intern details"
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {data.intern.intern?.full_name || data.intern.intern?.email || 'Intern'}
                </h2>
                <StatusBadge status={data.intern.status} />
              </div>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Primary Area</dt>
                  <dd className="mt-1 text-gray-900">
                    {data.intern.primary_area || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Topic</dt>
                  <dd className="mt-1 text-gray-900">
                    {data.intern.specific_topic || 'Not provided'}
                  </dd>
                </div>
              </dl>
            </section>
            {data.intern.status !== 'PROPOSAL_APPROVED' ? (
              <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
                {data.intern.status === 'MENTOR_ASSIGNED'
                  ? 'A mentor has been assigned to this internship.'
                  : 'Mentor assignment is available after proposal approval.'}
              </p>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recommended Mentors</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Match scores reflect whether an expertise tag matches the intern&apos;s primary
                    area.
                  </p>
                </div>
                {!data.mentors.length ? (
                  <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    No active mentors are available. Add or activate a mentor in Mentor Management.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.mentors.map((mentor) => (
                      <article
                        key={mentor.id}
                        className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-gray-900">
                            {mentor.fullName}
                          </h3>
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            Match Score: {mentor.matchScore}%
                          </span>
                        </div>
                        <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.length ? (
                            mentor.expertise.map((tag, index) => (
                              <span
                                key={`${tag}-${index}`}
                                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              No expertise tags provided
                            </span>
                          )}
                        </div>
                        <p className="mb-4 mt-5 text-sm text-gray-600">
                          Current Interns:{' '}
                          <span className="font-medium text-gray-900">
                            {mentor.currentInterns} / {mentor.capacity}
                          </span>
                        </p>
                        <button
                          type="button"
                          disabled={!!pending || mentor.currentInterns >= mentor.capacity}
                          onClick={() => void handleAssign(mentor)}
                          className="mt-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {pending === mentor.id
                            ? 'Assigning...'
                            : mentor.currentInterns >= mentor.capacity
                              ? 'At Capacity'
                              : 'Assign'}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )
      )}
    </div>
  );
}
