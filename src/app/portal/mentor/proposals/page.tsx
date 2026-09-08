'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { PROPOSAL_BUCKET, PROPOSAL_FIELDS } from '@/lib/internship/internProposal';
import {
  canReviewProposal,
  getMentorProposals,
  type MentorProposal,
} from '@/lib/internship/mentorProposals';
import { reviewProposal } from '@/lib/internship/stateMachine';
import { createClient } from '@/lib/supabase/client';

export default function MentorProposalsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [proposals, setProposals] = useState<MentorProposal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const inFlight = useRef(false);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    if (!user || profile?.role !== 'mentor' || profile.status !== 'active') return;
    const version = ++requestVersion.current;
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorProposals(user.id);
      if (version === requestVersion.current) setProposals(data);
    } catch (err) {
      if (version === requestVersion.current)
        setError(err instanceof Error ? err.message : 'Could not load proposals.');
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    void refresh();
    return () => {
      requestVersion.current++;
    };
  }, [refresh]);

  const selected = proposals.find((proposal) => proposal.id === selectedId);
  const pending = proposals.filter(canReviewProposal);
  const visible = showPendingOnly ? pending : proposals;

  async function decide(decision: 'request_revision' | 'recommend') {
    if (!selected || !canReviewProposal(selected) || inFlight.current) return;
    if (decision === 'request_revision' && !feedback.trim()) {
      setError('Enter feedback explaining the required revisions.');
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await reviewProposal(selected.id, selected.updated_at, decision, feedback);
      setProposals((rows) =>
        rows.map((row) => (row.id === updated.id ? { ...row, ...updated } : row))
      );
      setFeedback('');
      setMessage(
        decision === 'recommend'
          ? 'Proposal recommended and sent to admin for final review.'
          : 'Revision requested. Your feedback is now visible to the intern.'
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save your review. Refresh and try again.'
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  async function download() {
    if (!selected?.proposal_document_path || inFlight.current) return;
    setError(null);
    try {
      const { data, error: downloadError } = await createClient()
        .storage.from(PROPOSAL_BUCKET)
        .createSignedUrl(selected.proposal_document_path, 60, {
          download: selected.proposal_document_name || true,
        });
      if (downloadError) throw downloadError;
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.click();
    } catch {
      setError('Could not download the proposal. Please try again.');
    }
  }

  if (authLoading) return <p className="p-10 text-sm text-gray-500">Loading...</p>;
  if (!user || profile?.role !== 'mentor' || profile.status !== 'active')
    return <p className="p-10 text-sm text-gray-600">An active mentor account is required.</p>;

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-5 py-8 sm:px-8">
      <Link href="/portal/mentor" className="text-sm font-medium text-indigo-600">
        ← Mentor Dashboard
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Project Proposal Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review proposals from your assigned interns and recommend them for admin approval.
          </p>
        </div>
        <button
          type="button"
          disabled={loading || busy}
          onClick={() => void refresh()}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
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
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
        <section
          aria-label="Proposal queue"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900">
            Proposals to review {!loading && `(${pending.length})`}
          </h2>
          <label className="my-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPendingOnly}
              disabled={busy}
              onChange={(event) => setShowPendingOnly(event.target.checked)}
            />
            Pending reviews only
          </label>
          {loading ? (
            <p role="status" className="py-6 text-sm text-gray-500">
              Loading proposals...
            </p>
          ) : !visible.length ? (
            <p className="py-6 text-sm text-gray-500">
              {showPendingOnly
                ? 'No proposals are waiting for your review.'
                : 'No submitted proposals from assigned interns yet.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {visible.map((proposal) => (
                <li key={proposal.id}>
                  <button
                    type="button"
                    disabled={busy}
                    aria-pressed={selectedId === proposal.id}
                    onClick={() => {
                      setSelectedId(proposal.id);
                      setFeedback('');
                      setError(null);
                      setMessage(null);
                    }}
                    className={`w-full space-y-2 rounded-lg border p-3 text-left disabled:opacity-50 ${selectedId === proposal.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <p className="break-words text-sm font-medium text-gray-900">
                      {proposal.proposal_title || 'Untitled proposal'}
                    </p>
                    <p className="break-words text-xs text-gray-500">
                      {proposal.intern?.full_name || proposal.intern?.email || 'Assigned intern'}
                    </p>
                    <StatusBadge
                      status={proposal.status}
                      label={
                        proposal.proposal_review_stage === 'awaiting_admin'
                          ? 'Awaiting Admin'
                          : canReviewProposal(proposal)
                            ? 'Ready for Review'
                            : 'Awaiting Revision'
                      }
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section
          aria-label="Proposal details"
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          aria-busy={busy || loading}
        >
          {!selected ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Select a proposal to read its details and review the uploaded document.
            </p>
          ) : (
            <>
              <h2 className="break-words text-xl font-semibold text-gray-900">
                {selected.proposal_title || 'Project Proposal'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selected.intern?.full_name || 'Assigned intern'}
                {selected.intern?.email && ` · ${selected.intern.email}`}
              </p>
              <dl className="my-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Research Area</dt>
                  <dd className="text-gray-900">{selected.primary_area || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Specific Topic</dt>
                  <dd className="text-gray-900">{selected.specific_topic || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Submitted</dt>
                  <dd className="text-gray-900">
                    {selected.proposal_submitted_at
                      ? new Date(selected.proposal_submitted_at).toLocaleString()
                      : 'Not recorded'}
                  </dd>
                </div>
              </dl>
              <div className="space-y-5">
                {PROPOSAL_FIELDS.map(([key, label]) => (
                  <div key={key}>
                    <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600">
                      {selected[key] || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>
              {selected.proposal_document_path ? (
                <button
                  type="button"
                  onClick={() => void download()}
                  className="mt-5 break-all text-left text-sm font-medium text-indigo-600"
                >
                  Download {selected.proposal_document_name || 'completed proposal'}
                </button>
              ) : (
                <p className="mt-5 text-sm text-orange-700">
                  No completed proposal document is attached.
                </p>
              )}
              {selected.proposal_revision_notes && (
                <div className="mt-5 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                  <h3 className="font-medium">Previous revision feedback</h3>
                  <p className="mt-1 whitespace-pre-wrap">{selected.proposal_revision_notes}</p>
                </div>
              )}
              {canReviewProposal(selected) ? (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <label
                    htmlFor="revision-feedback"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Revision feedback{' '}
                    <span className="font-normal text-gray-500">
                      (required to request revision)
                    </span>
                  </label>
                  <textarea
                    id="revision-feedback"
                    rows={4}
                    value={feedback}
                    disabled={busy || loading}
                    onChange={(event) => setFeedback(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-50"
                  />
                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      disabled={busy || loading}
                      onClick={() => void decide('request_revision')}
                      className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 disabled:opacity-50"
                    >
                      Request Revision
                    </button>
                    <button
                      type="button"
                      disabled={busy || loading}
                      onClick={() => void decide('recommend')}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {busy ? 'Saving...' : 'Recommend'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                  {selected.proposal_review_stage === 'awaiting_admin'
                    ? 'Recommended. Awaiting final admin approval.'
                    : 'Waiting for the intern to edit and resubmit their proposal.'}
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
