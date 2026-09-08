'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Download, FileText, UploadCloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { createClient } from '@/lib/supabase/client';
import { getStatusIndex, type InternshipRecord } from '@/lib/internship/stateMachine';
import { INTERN_ROUTES } from '@/lib/internship/internRoutes';
import {
  getProposal,
  saveProposal,
  validateProposalFile,
  PROPOSAL_BUCKET,
  canEditProposal,
  PROPOSAL_FIELDS,
  type ProposalFields,
} from '@/lib/internship/internProposal';

const emptyFields: ProposalFields = {
  proposal_title: '',
  proposal_abstract: '',
  proposal_objectives: '',
  proposal_methodology: '',
  proposal_expected_outcome: '',
};

export default function ProjectProposalPage() {
  const { user } = useAuth();
  const [record, setRecord] = useState<InternshipRecord | null>(null);
  const [fields, setFields] = useState(emptyFields);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getProposal(user.id)
      .then((data) => {
        if (cancelled) return;
        setRecord(data);
        if (data)
          setFields(
            Object.fromEntries(
              PROPOSAL_FIELDS.map(([key]) => [key, data[key] ?? ''])
            ) as ProposalFields
          );
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const editable = !!record && canEditProposal(record);
  function chooseFiles(files: FileList | null) {
    if (!editable || busy || !files?.length) return;
    setMessage(null);
    const validation =
      files.length !== 1 ? 'Choose one completed proposal file.' : validateProposalFile(files[0]);
    setError(validation);
    if (!validation) setFile(files[0]);
  }

  async function save(submit: boolean) {
    if (!record || !editable || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await saveProposal(record, fields, file, submit);
      setRecord(updated);
      setFile(null);
      setMessage(
        submit
          ? updated.status === 'PROPOSAL_REVISION'
            ? 'Revised proposal submitted for review.'
            : 'Proposal submitted for review.'
          : 'Draft saved.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your proposal. Please retry.');
      // Recover a successfully saved draft if the subsequent submission failed.
      if (user)
        try {
          setRecord(await getProposal(user.id));
        } catch {
          /* Preserve the form for retry. */
        }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  async function downloadDocument() {
    if (!record?.proposal_document_path) return;
    setError(null);
    try {
      const { data, error: downloadError } = await createClient()
        .storage.from(PROPOSAL_BUCKET)
        .createSignedUrl(record.proposal_document_path, 60, {
          download: record.proposal_document_name || true,
        });
      if (downloadError) throw downloadError;
      const anchor = document.createElement('a');
      anchor.href = data.signedUrl;
      anchor.click();
    } catch {
      setError('Unable to download the proposal. Please try again.');
    }
  }

  if (loading)
    return <p className="py-20 text-center text-sm text-gray-400">Loading proposal...</p>;
  if (!record)
    return (
      <div
        role="alert"
        className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-600"
      >
        {error || 'No internship record found. Please contact your program administrator.'}
      </div>
    );
  if (getStatusIndex(record.status) < getStatusIndex('TOPIC_SELECTED'))
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-lg font-semibold text-gray-900">Choose your research topic first</h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete your profile, research area, and topic before starting your proposal.
        </p>
        <Link
          href={INTERN_ROUTES.researchTopic}
          className="mt-4 inline-block text-sm font-medium text-indigo-600"
        >
          Go to Specific Topic
        </Link>
      </div>
    );
  const badge =
    getStatusIndex(record.status) >= getStatusIndex('PROPOSAL_APPROVED')
      ? 'PROPOSAL_APPROVED'
      : record.status === 'TOPIC_SELECTED'
        ? 'PROPOSAL_DRAFT'
        : record.status;
  const label =
    record.proposal_review_stage === 'awaiting_admin'
      ? 'Awaiting Admin Review'
      : record.proposal_review_stage === 'awaiting_mentor'
        ? 'Submitted'
        : badge === 'PROPOSAL_APPROVED'
          ? 'Approved'
          : badge === 'PROPOSAL_SUBMITTED'
            ? 'Submitted'
            : badge === 'PROPOSAL_REVISION'
              ? 'Revision'
              : 'Draft';

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Project Proposal</h1>
            <StatusBadge status={badge} label={label} size="md" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Define your project and upload your completed proposal for review.
          </p>
        </div>
        <a
          href="/templates/Internship_Project_Proposal_Template.docx"
          download
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download size={16} />
          Download Template
        </a>
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
      {record.status === 'PROPOSAL_REVISION' && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          <p className="font-medium">
            {editable ? 'Revision requested' : 'Previous revision feedback'}
          </p>
          <p className="mt-1 whitespace-pre-wrap">
            {record.proposal_revision_notes ||
              'Update your proposal and submit the revised version for review.'}
          </p>
        </div>
      )}
      {!editable && (
        <p className="text-sm text-gray-500">
          {label === 'Approved'
            ? 'Your proposal has been approved.'
            : 'Your proposal is awaiting review.'}{' '}
          You can view your submitted details below.
        </p>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save(true);
        }}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        aria-busy={busy}
      >
        <fieldset disabled={!editable || busy} className="space-y-5">
          {PROPOSAL_FIELDS.map(([key, title]) => (
            <div key={key}>
              <label htmlFor={key} className="mb-2 block text-sm font-medium text-gray-700">
                {title}
              </label>
              <textarea
                id={key}
                rows={key === 'proposal_title' ? 2 : 4}
                value={fields[key]}
                onChange={(event) => {
                  setFields({ ...fields, [key]: event.target.value });
                  setMessage(null);
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-gray-50"
              />
            </div>
          ))}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Upload Completed Proposal</p>
            <label
              onDragOver={(event) => {
                event.preventDefault();
                if (editable && !busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                chooseFiles(event.dataTransfer.files);
              }}
              className={`relative flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-7 text-center ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} ${editable && !busy ? 'cursor-pointer hover:border-indigo-300' : 'opacity-60'}`}
            >
              <UploadCloud className="text-indigo-500" size={28} />
              <span className="text-sm text-gray-700">
                Drag and drop your proposal, or click to browse
              </span>
              <span className="text-xs text-gray-500">PDF or DOCX · Maximum 10 MB</span>
              <input
                aria-label="Upload Completed Proposal"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={(event) => {
                  chooseFiles(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
        </fieldset>
        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FileText size={16} />
            <span className="break-all">{file.name} (ready to save)</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => setFile(null)}
              className="ml-auto text-indigo-600"
            >
              Remove
            </button>
          </div>
        )}
        {record.proposal_document_path && (
          <button
            type="button"
            onClick={() => void downloadDocument()}
            className="flex items-center gap-2 text-left text-sm text-indigo-600"
          >
            <Download size={16} />
            <span className="break-all">
              {record.proposal_document_name || 'Download saved proposal'}
            </span>
          </button>
        )}
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            disabled={!editable || busy}
            onClick={() => void save(false)}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={!editable || busy}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? 'Saving...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
}
