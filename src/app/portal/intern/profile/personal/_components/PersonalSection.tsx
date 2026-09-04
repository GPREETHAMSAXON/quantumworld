'use client';

import React, { useRef, useState } from 'react';
import { INDIAN_STATES } from '@/lib/internship/indianStates';
import { uploadProfilePhoto, type PersonalDetails } from '@/lib/internship/internProfile';

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

const REQUIRED_FIELDS: (keyof PersonalDetails)[] = [
  'fullName',
  'dateOfBirth',
  'gender',
  'mobileNumber',
  'communicationAddress',
  'city',
  'state',
  'country',
  'emergencyContactName',
  'emergencyContactPhone',
];

interface PersonalSectionProps {
  userId: string;
  initial: PersonalDetails;
  onSave: (fields: PersonalDetails) => Promise<{ success: boolean; error?: string }>;
  onSaved: () => void;
}

export default function PersonalSection({ userId, initial, onSave, onSaved }: PersonalSectionProps) {
  const [fields, setFields] = useState<PersonalDetails>(initial);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial.profilePhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof PersonalDetails, value: string) => setFields((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = async (file: File) => {
    setError('');
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
    setUploading(true);
    const { url, error: uploadError } = await uploadProfilePhoto(userId, file);
    setUploading(false);
    if (uploadError) {
      setError(`Photo upload failed: ${uploadError}`);
      return;
    }
    setFields((prev) => ({ ...prev, profilePhotoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const missing = REQUIRED_FIELDS.filter((key) => !fields[key]?.toString().trim());
    if (missing.length > 0) {
      setError('Please fill in all required fields before continuing.');
      return;
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
      {/* Profile photo */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
          />
          <p className="text-xs text-gray-400 mt-1.5">PNG, JPG or WEBP. Max 5MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            value={fields.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className={inputClasses}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className={labelClasses}>Date of Birth</label>
          <input
            type="date"
            value={fields.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Gender</label>
          <select value={fields.gender} onChange={(e) => update('gender', e.target.value)} className={inputClasses}>
            <option value="">Select...</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Mobile Number</label>
          <input
            type="tel"
            value={fields.mobileNumber}
            onChange={(e) => update('mobileNumber', e.target.value)}
            className={inputClasses}
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Email (login)</label>
          <input type="email" value={fields.email} disabled className={`${inputClasses} bg-gray-50 text-gray-500 cursor-not-allowed`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Communication Address</label>
          <textarea
            value={fields.communicationAddress}
            onChange={(e) => update('communicationAddress', e.target.value)}
            rows={2}
            className={inputClasses}
            placeholder="House no., street, area"
          />
        </div>

        <div>
          <label className={labelClasses}>City</label>
          <input type="text" value={fields.city} onChange={(e) => update('city', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>State</label>
          <select value={fields.state} onChange={(e) => update('state', e.target.value)} className={inputClasses}>
            <option value="">Select...</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Country</label>
          <input type="text" value={fields.country} onChange={(e) => update('country', e.target.value)} className={inputClasses} />
        </div>
        <div />

        <div>
          <label className={labelClasses}>Emergency Contact Name</label>
          <input
            type="text"
            value={fields.emergencyContactName}
            onChange={(e) => update('emergencyContactName', e.target.value)}
            className={inputClasses}
            placeholder="Parent / guardian name"
          />
        </div>
        <div>
          <label className={labelClasses}>Emergency Contact Phone</label>
          <input
            type="tel"
            value={fields.emergencyContactPhone}
            onChange={(e) => update('emergencyContactPhone', e.target.value)}
            className={inputClasses}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {error && <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
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
