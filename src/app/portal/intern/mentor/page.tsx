'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { getInternMentorState, type InternMentorState } from '@/lib/internship/internMentor';

export default function InternMentorPage() {
  const { user } = useAuth();
  const [state, setState] = useState<InternMentorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const requestVersion = useRef(0);

  const load = useCallback(async () => {
    if (!user) return;
    const version = ++requestVersion.current;
    setLoading(true);
    setError(null);
    try {
      const next = await getInternMentorState(user.id);
      if (version === requestVersion.current) setState(next);
    } catch (err) {
      if (version === requestVersion.current)
        setError(err instanceof Error ? err.message : 'Unable to load your mentor assignment.');
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
    return () => {
      requestVersion.current++;
    };
  }, [load]);

  if (loading)
    return (
      <p role="status" className="py-16 text-center text-sm text-gray-500">
        Loading mentor assignment...
      </p>
    );
  if (error)
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {error}
      </div>
    );
  if (!state?.mentor)
    return (
      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
          <UserRound size={22} className="text-indigo-600" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Mentor not yet assigned</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
          Your proposal has been approved and the program team will assign a mentor shortly.
          You&apos;ll see their profile and project guidance here once that happens.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
    );

  const { internship, mentor } = state;
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">My Mentor</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your assigned mentor and confirmed project details.
          </p>
        </div>
        {internship && <StatusBadge status={internship.status} />}
      </div>
      <section
        aria-label="Mentor profile"
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <UserRound size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{mentor.fullName}</h2>
              <p className="text-sm text-gray-500">Assigned mentor</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <UserRound size={16} />
            View Mentor Profile
          </button>
        </div>
        <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Research Area
            </dt>
            <dd className="mt-1 text-gray-900">{mentor.researchArea || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</dt>
            <dd className="mt-1 break-all text-gray-900">{mentor.email}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Expertise</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {mentor.expertise.length ? (
              mentor.expertise.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No expertise tags provided</span>
            )}
          </div>
        </div>
      </section>
      <section
        aria-label="Project"
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900">Project</h2>
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Confirmed Project Topic
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {internship?.specific_topic ||
              internship?.proposal_title ||
              'Your confirmed project topic will appear here.'}
          </p>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-800">Mentor Message</h3>
          <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-relaxed text-gray-700">
            {internship?.mentor_message ||
              internship?.proposal_revision_notes ||
              'Your mentor has not left a message yet.'}
          </div>
        </div>
      </section>
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Mentor Profile">
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</p>
            <p className="mt-1 font-medium text-gray-900">{mentor.fullName}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Research Area
            </p>
            <p className="mt-1 text-gray-700">{mentor.researchArea || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Expertise</p>
            <p className="mt-1 text-gray-700">{mentor.expertise.join(', ') || 'Not provided'}</p>
          </div>
          <a
            href={`mailto:${mentor.email}`}
            className="inline-flex items-center gap-2 font-medium text-indigo-600"
          >
            <Mail size={16} />
            {mentor.email}
          </a>
        </div>
      </Modal>
    </div>
  );
}
