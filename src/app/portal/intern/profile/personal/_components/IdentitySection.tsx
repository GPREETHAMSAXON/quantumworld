'use client';

import React, { useRef, useState } from 'react';
import {
  DOCUMENT_TYPES,
  IDENTITY_STEPS,
  maskIdNumber,
  submitIdentity,
  uploadIdentityDocument,
  type IdentityRecord,
} from '@/lib/internship/internIdentity';

const STEP_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  UNDER_VERIFICATION: 'Under Verification',
  VERIFIED: 'Verified',
};

function LockBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Secure &amp; Confidential
    </div>
  );
}

function VerificationStepper({ status }: { status: string }) {
  const currentIdx = IDENTITY_STEPS.indexOf(status as any);
  return (
    <div className="flex items-center">
      {IDENTITY_STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const circleClasses = done
          ? 'bg-green-500 border-green-500 text-white'
          : active
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-gray-300 text-gray-400';
        return (
          <React.Fragment key={step}>
            {i > 0 && <div className={`w-10 h-0.5 ${i <= currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />}
            <div className="flex flex-col items-center gap-1.5">
              <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${circleClasses}`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-[11px] font-medium ${active ? 'text-indigo-700' : 'text-gray-500'}`}>{STEP_LABELS[step]}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function RecordView({ record, onResubmit }: { record: IdentityRecord; onResubmit: () => void }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <LockBadge />
        {record.status === 'SUBMITTED' && (
          <button
            type="button"
            onClick={onResubmit}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
          >
            Resubmit
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Document Type</p>
            <p className="text-sm font-medium text-gray-900">{record.documentType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">ID Number</p>
            <p className="text-sm font-mono font-medium text-gray-900 tracking-wider">
              {maskIdNumber(record.documentType, record.last4)}
            </p>
          </div>
        </div>
        {record.documentFilePath && (
          <div className="flex items-center gap-1.5 text-xs text-green-700 mb-5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ID document uploaded
          </div>
        )}
        <VerificationStepper status={record.status} />
      </div>

      <p className="text-xs text-gray-400">
        Only your last 4 digits are ever shown, including to you. Full values are visible only to authorized admins, and every
        access is logged.
      </p>
    </div>
  );
}

interface IdentitySectionProps {
  userId: string;
  initialRecord: IdentityRecord | null;
  onSubmitted: (record: IdentityRecord) => void;
}

export default function IdentitySection({ userId, initialRecord, onSubmitted }: IdentitySectionProps) {
  const [editing, setEditing] = useState(!initialRecord);
  const [documentType, setDocumentType] = useState<string>(initialRecord?.documentType || 'Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [documentFilePath, setDocumentFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editing && initialRecord) {
    return <RecordView record={initialRecord} onResubmit={() => setEditing(true)} />;
  }

  const handleFile = async (file: File) => {
    setError('');
    setFileName(file.name);
    setUploading(true);
    const { path, error: uploadError } = await uploadIdentityDocument(userId, file);
    setUploading(false);
    if (uploadError) {
      setError(`Document upload failed: ${uploadError}`);
      return;
    }
    setDocumentFilePath(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idNumber.trim()) {
      setError('Please enter your ID number.');
      return;
    }

    setSaving(true);
    const result = await submitIdentity({ documentType, idNumber, documentFilePath });
    setSaving(false);

    if (!result.success || !result.record) {
      setError(result.error || 'Failed to submit. Please try again.');
      return;
    }

    setIdNumber('');
    setEditing(false);
    onSubmitted(result.record);
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50';
  const labelClasses = 'block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider';

  return (
    <div>
      <div className="mb-6">
        <LockBadge />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClasses}>Document Type</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputClasses}>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>ID Number</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={inputClasses}
            placeholder={documentType === 'Aadhaar' ? '1234 5678 9012' : 'Enter your ID number'}
            autoComplete="off"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            This is encrypted before storage. Only the last 4 digits will ever be shown again, including to you.
          </p>
        </div>

        <div>
          <label className={labelClasses}>Upload ID Document</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0l3.5 3.5M12 9L8.5 12.5M5 16.5v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
            </svg>
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : fileName || 'Click to upload (image or PDF, max 10MB)'}
            </span>
            {documentFilePath && !uploading && (
              <svg className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {error && <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

        <div className="flex items-center justify-between pt-2">
          {initialRecord ? (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-sm"
          >
            {saving ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
}
