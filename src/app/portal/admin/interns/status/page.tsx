'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { getInternList, type InternRow } from '@/lib/internship/internList';
import { parseInternCsv, type ParsedInternRow } from '@/lib/csv/parseInternCsv';

type Banner = { type: 'success' | 'error'; text: string } | null;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function AddInternModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (email: string) => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setFullName('');
      setEmail('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to add intern.');
        setLoading(false);
        return;
      }
      onCreated(data.email);
      onClose();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Intern">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          Creates the intern&apos;s account (invited) and starts their internship at{' '}
          <span className="font-medium text-gray-700">Selected</span>. They&apos;ll get an email to set their password.
        </p>
        <div>
          <label htmlFor="ai-name" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="ai-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="ai-email" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Email
          </label>
          <input
            id="ai-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            placeholder="jane@quantumworld.in"
          />
        </div>

        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? 'Adding...' : 'Add Intern'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ImportInternsModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: (succeeded: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ParsedInternRow[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ succeeded: number; failed: number; results: any[] } | null>(null);

  useEffect(() => {
    if (open) {
      setFileName('');
      setParsed([]);
      setSkipped(0);
      setError('');
      setResult(null);
    }
  }, [open]);

  const handleFile = async (file: File) => {
    setError('');
    setResult(null);
    setFileName(file.name);
    const text = await file.text();
    const { rows, skipped: skippedCount } = parseInternCsv(text);
    if (rows.length === 0) {
      setError('No valid rows found. Expect columns: name, email.');
    }
    setParsed(rows);
    setSkipped(skippedCount);
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/interns/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Import failed.');
        setLoading(false);
        return;
      }
      setResult(data);
      onImported(data.succeeded);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Import Interns">
      <div className="space-y-4">
        {!result && (
          <>
            <p className="text-xs text-gray-500">
              CSV with <span className="font-medium text-gray-700">name, email</span> columns (header row optional). Each
              row creates an invited account and a Selected internship.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0l3.5 3.5M12 9L8.5 12.5M5 16.5v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
              </svg>
              <span className="text-sm text-gray-600">{fileName || 'Click to choose a CSV file'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {parsed.length > 0 && (
              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5">
                {parsed.length} row{parsed.length === 1 ? '' : 's'} ready to import
                {skipped > 0 && <span className="text-orange-600"> · {skipped} skipped (missing/invalid name or email)</span>}
              </div>
            )}

            {error && (
              <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading || parsed.length === 0}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
              >
                {loading ? 'Importing...' : `Import ${parsed.length || ''}`.trim()}
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg bg-green-50 border border-green-200">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-800">
                {result.succeeded} intern{result.succeeded === 1 ? '' : 's'} added
                {result.failed > 0 && `, ${result.failed} failed`}.
              </p>
            </div>

            {result.failed > 0 && (
              <ul className="max-h-40 overflow-y-auto space-y-1.5 text-xs">
                {result.results
                  .filter((r: any) => !r.success)
                  .map((r: any, i: number) => (
                    <li key={i} className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-700">
                      <span className="font-medium">{r.email}</span> — {r.error}
                    </li>
                  ))}
              </ul>
            )}

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default function InternStatusPage() {
  const [interns, setInterns] = useState<InternRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justReset, setJustReset] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setLoading(true);
    const rows = await getInternList();
    setInterns(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(t);
  }, [banner]);

  const handleToggleStatus = async (intern: InternRow) => {
    const nextStatus = intern.accountStatus === 'active' ? 'disabled' : 'active';
    setPendingId(intern.id);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ status: nextStatus }).eq('id', intern.id);
    setPendingId(null);
    if (error) {
      setBanner({ type: 'error', text: `Failed to update ${intern.fullName}: ${error.message}` });
      return;
    }
    setInterns((prev) => prev.map((i) => (i.id === intern.id ? { ...i, accountStatus: nextStatus } : i)));
    setBanner({ type: 'success', text: `${intern.fullName} is now ${nextStatus}.` });
  };

  const handleResetPassword = async (intern: InternRow) => {
    setPendingId(intern.id);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(intern.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/portal/set-password`,
    });
    setPendingId(null);
    if (error) {
      setBanner({ type: 'error', text: `Failed to send reset email: ${error.message}` });
      return;
    }
    setJustReset((prev) => new Set(prev).add(intern.id));
    setTimeout(() => {
      setJustReset((prev) => {
        const next = new Set(prev);
        next.delete(intern.id);
        return next;
      });
    }, 4000);
    setBanner({ type: 'success', text: `Reset link sent to ${intern.email}.` });
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Intern Management</h1>
          <p className="text-sm text-gray-500 mt-1">All interns and their current internship status.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Import Interns
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Add Intern
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg border text-sm ${
            banner.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {banner.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-14 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
        ) : interns.length === 0 ? (
          <div className="py-14 flex flex-col items-center text-center px-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">No interns yet</p>
            <p className="text-xs text-gray-500 mt-0.5">Add one or import a CSV to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Name</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Email</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Account</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Internship Status</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Joined</th>
                  <th className="text-right font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{intern.fullName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{intern.email}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={intern.accountStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      {intern.internshipStatus ? (
                        <StatusBadge status={intern.internshipStatus} />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(intern.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {intern.internshipStatus === 'PROPOSAL_APPROVED' && (
                          <Link href={`/portal/admin/interns/${intern.id}/assign-mentor`} className="px-2.5 py-1.5 rounded-md text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 whitespace-nowrap">
                            Assign Mentor
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResetPassword(intern)}
                          disabled={pendingId === intern.id}
                          className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors disabled:opacity-50"
                        >
                          {justReset.has(intern.id) ? 'Sent ✓' : 'Reset Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(intern)}
                          disabled={pendingId === intern.id}
                          className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 ${
                            intern.accountStatus === 'active'
                              ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                              : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {intern.accountStatus === 'active' ? 'Disable' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddInternModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(email) => {
          setBanner({ type: 'success', text: `Invite sent to ${email}.` });
          refresh();
        }}
      />
      <ImportInternsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={(succeeded) => {
          if (succeeded > 0) refresh();
        }}
      />
    </>
  );
}
