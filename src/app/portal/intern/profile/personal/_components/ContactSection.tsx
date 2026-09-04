'use client';

import React, { useState } from 'react';
import { CONTACT_METHODS, TIMEZONES, type ContactDetails } from '@/lib/internship/internContact';

interface ContactSectionProps {
  initial: ContactDetails;
  onSave: (fields: ContactDetails) => Promise<{ success: boolean; error?: string }>;
  onSaved: () => void;
}

const URL_RE = /^https?:\/\/.+/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection({ initial, onSave, onSaved }: ContactSectionProps) {
  const [fields, setFields] = useState<ContactDetails>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof ContactDetails, value: string) => setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fields.alternateEmail && !EMAIL_RE.test(fields.alternateEmail)) {
      setError('Alternate email looks invalid.');
      return;
    }
    const urlFields: [keyof ContactDetails, string][] = [
      ['linkedinUrl', 'LinkedIn URL'],
      ['githubUrl', 'GitHub URL'],
      ['portfolioUrl', 'Portfolio URL'],
    ];
    for (const [key, label] of urlFields) {
      const value = fields[key];
      if (value && !URL_RE.test(value)) {
        setError(`${label} should start with http:// or https://`);
        return;
      }
    }

    setSaving(true);
    const result = await onSave(fields);
    setSaving(false);
    if (!result.success) {
      setError(result.error || 'Failed to save. Please try again.');
      return;
    }
    onSaved();
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50';
  const labelClasses = 'block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-xs text-gray-500">All fields in this section are optional — add what&apos;s useful for mentors to reach you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Alternate Email</label>
          <input
            type="email"
            value={fields.alternateEmail}
            onChange={(e) => update('alternateEmail', e.target.value)}
            className={inputClasses}
            placeholder="you@personal.com"
          />
        </div>
        <div>
          <label className={labelClasses}>Alternate Phone</label>
          <input
            type="tel"
            value={fields.alternatePhone}
            onChange={(e) => update('alternatePhone', e.target.value)}
            className={inputClasses}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className={labelClasses}>LinkedIn URL</label>
          <input
            type="url"
            value={fields.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
            className={inputClasses}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className={labelClasses}>GitHub URL</label>
          <input
            type="url"
            value={fields.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
            className={inputClasses}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Portfolio / Personal Website</label>
          <input
            type="url"
            value={fields.portfolioUrl}
            onChange={(e) => update('portfolioUrl', e.target.value)}
            className={inputClasses}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClasses}>Preferred Contact Method</label>
          <select
            value={fields.preferredContactMethod}
            onChange={(e) => update('preferredContactMethod', e.target.value)}
            className={inputClasses}
          >
            {CONTACT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Time Zone</label>
          <select value={fields.timezone} onChange={(e) => update('timezone', e.target.value)} className={inputClasses}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Helps mentors schedule calls across time zones.</p>
        </div>
      </div>

      {error && <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-sm"
        >
          {saving ? 'Saving...' : 'Save & Continue'}
          {!saving && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
