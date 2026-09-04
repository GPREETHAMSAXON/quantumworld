'use client';

import React, { useCallback, useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import TagInput from '@/components/ui/TagInput';
import { createClient } from '@/lib/supabase/client';
import { getMentorList, type MentorRow } from '@/lib/internship/mentorList';
import { RESEARCH_AREAS } from '@/lib/internship/researchAreas';

type Banner = { type: 'success' | 'error'; text: string } | null;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function AddMentorModal({
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
      const res = await fetch('/api/admin/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to add mentor.');
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
    <Modal open={open} onClose={onClose} title="Add Mentor">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          Creates the mentor&apos;s account (invited). They&apos;ll get an email to set their password. Expertise and
          capacity can be set afterwards from the list.
        </p>
        <div>
          <label htmlFor="am-name" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="am-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            placeholder="Dr. Ananya Rao"
          />
        </div>
        <div>
          <label htmlFor="am-email" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Email
          </label>
          <input
            id="am-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            placeholder="ananya@quantumworld.in"
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
            {loading ? 'Adding...' : 'Add Mentor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditMentorModal({
  mentor,
  onClose,
  onSaved,
}: {
  mentor: MentorRow | null;
  onClose: () => void;
  onSaved: (id: string, expertise: string[], capacity: number) => void;
}) {
  const [expertise, setExpertise] = useState<string[]>([]);
  const [capacity, setCapacity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mentor) {
      setExpertise(mentor.expertise);
      setCapacity(mentor.capacity);
      setError('');
    }
  }, [mentor]);

  if (!mentor) return null;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ expertise, mentor_capacity: capacity })
      .eq('id', mentor.id);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    onSaved(mentor.id, expertise, capacity);
    onClose();
  };

  return (
    <Modal open={!!mentor} onClose={onClose} title={`Edit ${mentor.fullName}`}>
      <div className="space-y-4">
        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">Expertise</label>
          <TagInput value={expertise} onChange={setExpertise} placeholder="e.g. Quantum Computing" suggestions={RESEARCH_AREAS} />
        </div>

        <div>
          <label htmlFor="em-capacity" className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Intern Capacity
          </label>
          <input
            id="em-capacity"
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(Math.max(0, Number(e.target.value)))}
            className="w-28 px-3.5 py-2 rounded-lg text-sm text-gray-900 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Currently mentoring {mentor.currentInterns} intern{mentor.currentInterns === 1 ? '' : 's'}.
          </p>
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
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function MentorManagementPage() {
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<MentorRow | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justReset, setJustReset] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setLoading(true);
    const { rows, error } = await getMentorList();
    setMentors(rows);
    if (error) setBanner({ type: 'error', text: `Failed to load mentors: ${error}` });
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

  const handleToggleStatus = async (mentor: MentorRow) => {
    const nextStatus = mentor.accountStatus === 'active' ? 'disabled' : 'active';
    setPendingId(mentor.id);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ status: nextStatus }).eq('id', mentor.id);
    setPendingId(null);
    if (error) {
      setBanner({ type: 'error', text: `Failed to update ${mentor.fullName}: ${error.message}` });
      return;
    }
    setMentors((prev) => prev.map((m) => (m.id === mentor.id ? { ...m, accountStatus: nextStatus } : m)));
    setBanner({ type: 'success', text: `${mentor.fullName} is now ${nextStatus}.` });
  };

  const handleResetPassword = async (mentor: MentorRow) => {
    setPendingId(mentor.id);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(mentor.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/portal/set-password`,
    });
    setPendingId(null);
    if (error) {
      setBanner({ type: 'error', text: `Failed to send reset email: ${error.message}` });
      return;
    }
    setJustReset((prev) => new Set(prev).add(mentor.id));
    setTimeout(() => {
      setJustReset((prev) => {
        const next = new Set(prev);
        next.delete(mentor.id);
        return next;
      });
    }, 4000);
    setBanner({ type: 'success', text: `Reset link sent to ${mentor.email}.` });
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Mentor Management</h1>
          <p className="text-sm text-gray-500 mt-1">All mentors, their expertise, and current mentee load.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Add Mentor
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
        ) : mentors.length === 0 ? (
          <div className="py-14 flex flex-col items-center text-center px-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">No mentors yet</p>
            <p className="text-xs text-gray-500 mt-0.5">Add one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Name</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Email</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Account</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Expertise</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Interns</th>
                  <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Joined</th>
                  <th className="text-right font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mentors.map((mentor) => {
                  const atCapacity = mentor.currentInterns >= mentor.capacity;
                  return (
                    <tr key={mentor.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{mentor.fullName}</td>
                      <td className="px-5 py-3.5 text-gray-600">{mentor.email}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={mentor.accountStatus} />
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        {mentor.expertise.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No tags yet</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs font-semibold ${atCapacity ? 'text-orange-600' : 'text-gray-700'}`}
                        >
                          {mentor.currentInterns} / {mentor.capacity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{formatDate(mentor.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(mentor)}
                            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(mentor)}
                            disabled={pendingId === mentor.id}
                            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors disabled:opacity-50"
                          >
                            {justReset.has(mentor.id) ? 'Sent ✓' : 'Reset Password'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(mentor)}
                            disabled={pendingId === mentor.id}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 ${
                              mentor.accountStatus === 'active'
                                ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                                : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            {mentor.accountStatus === 'active' ? 'Disable' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddMentorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(email) => {
          setBanner({ type: 'success', text: `Invite sent to ${email}.` });
          refresh();
        }}
      />
      <EditMentorModal
        mentor={editing}
        onClose={() => setEditing(null)}
        onSaved={(id, expertise, capacity) => {
          setMentors((prev) => prev.map((m) => (m.id === id ? { ...m, expertise, capacity } : m)));
          setBanner({ type: 'success', text: 'Mentor updated.' });
        }}
      />
    </>
  );
}
