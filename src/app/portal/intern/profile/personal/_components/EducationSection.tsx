'use client';

import React, { useRef, useState } from 'react';
import {
  YEAR_OF_STUDY_OPTIONS,
  uploadEducationDocument,
  type EducationDetails,
  type EducationDocumentSlot,
} from '@/lib/internship/internEducation';

const REQUIRED_FIELDS: (keyof EducationDetails)[] = [
  'degree',
  'institution',
  'yearOfStudy',
  'cgpaPercentage',
  'academicYear',
  'tenthInstitution',
  'tenthYear',
  'tenthPercentage',
  'twelfthInstitution',
  'twelfthYear',
  'twelfthPercentage',
];

const DOCUMENT_SLOTS: { key: EducationDocumentSlot; label: string; hint: string }[] = [
  { key: 'resumePath', label: 'Resume / CV', hint: 'PDF preferred' },
  { key: 'academicCertificatePath', label: 'Academic Certificate', hint: 'Latest marksheet or degree certificate' },
  { key: 'idProofPath', label: 'ID Proof', hint: 'College/university ID card' },
  { key: 'otherDocumentPath', label: 'Other Supporting Documents', hint: 'Optional' },
];

interface EducationSectionProps {
  userId: string;
  initial: EducationDetails;
  onSave: (fields: EducationDetails) => Promise<{ success: boolean; error?: string }>;
  onSaved: () => void;
}

function DocumentUploadSlot({
  label,
  hint,
  path,
  onUpload,
}: {
  label: string;
  hint: string;
  path: string | null;
  onUpload: (file: File) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (file: File) => {
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0l3.5 3.5M12 9L8.5 12.5M5 16.5v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
        </svg>
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-sm text-gray-700">{label}</span>
          <span className="block text-xs text-gray-400">{uploading ? 'Uploading...' : hint}</span>
        </span>
        {path && !uploading && (
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleChange(e.target.files[0])}
      />
    </div>
  );
}

export default function EducationSection({ userId, initial, onSave, onSaved }: EducationSectionProps) {
  const [fields, setFields] = useState<EducationDetails>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const update = (key: keyof EducationDetails, value: string) => setFields((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (slot: EducationDocumentSlot, file: File) => {
    setUploadError('');
    const { path, error: err } = await uploadEducationDocument(userId, file);
    if (err) {
      setUploadError(`Upload failed: ${err}`);
      return;
    }
    setFields((prev) => ({ ...prev, [slot]: path }));
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
  const groupTitleClasses = 'text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Current qualification */}
      <div>
        <h3 className={groupTitleClasses}>Current Qualification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Degree / Program</label>
            <input
              type="text"
              value={fields.degree}
              onChange={(e) => update('degree', e.target.value)}
              className={inputClasses}
              placeholder="e.g. B.Tech, M.Sc"
            />
          </div>
          <div>
            <label className={labelClasses}>Specialization</label>
            <input
              type="text"
              value={fields.specialization}
              onChange={(e) => update('specialization', e.target.value)}
              className={inputClasses}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>University / Institution</label>
            <input
              type="text"
              value={fields.institution}
              onChange={(e) => update('institution', e.target.value)}
              className={inputClasses}
              placeholder="Your current university or college"
            />
          </div>
          <div>
            <label className={labelClasses}>Year of Study</label>
            <select value={fields.yearOfStudy} onChange={(e) => update('yearOfStudy', e.target.value)} className={inputClasses}>
              <option value="">Select...</option>
              {YEAR_OF_STUDY_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>CGPA / Percentage</label>
            <input
              type="text"
              value={fields.cgpaPercentage}
              onChange={(e) => update('cgpaPercentage', e.target.value)}
              className={inputClasses}
              placeholder="e.g. 8.5 CGPA or 85%"
            />
          </div>
          <div>
            <label className={labelClasses}>Academic Year</label>
            <input
              type="text"
              value={fields.academicYear}
              onChange={(e) => update('academicYear', e.target.value)}
              className={inputClasses}
              placeholder="e.g. 2023–2027"
            />
          </div>
        </div>
      </div>

      {/* Previous education */}
      <div>
        <h3 className={groupTitleClasses}>Previous Education</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">10th / Equivalent</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={fields.tenthInstitution}
                onChange={(e) => update('tenthInstitution', e.target.value)}
                className={inputClasses}
                placeholder="Institution"
              />
              <input
                type="text"
                value={fields.tenthYear}
                onChange={(e) => update('tenthYear', e.target.value)}
                className={inputClasses}
                placeholder="Year"
              />
              <input
                type="text"
                value={fields.tenthPercentage}
                onChange={(e) => update('tenthPercentage', e.target.value)}
                className={inputClasses}
                placeholder="Percentage / CGPA"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">12th / Diploma</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={fields.twelfthInstitution}
                onChange={(e) => update('twelfthInstitution', e.target.value)}
                className={inputClasses}
                placeholder="Institution"
              />
              <input
                type="text"
                value={fields.twelfthYear}
                onChange={(e) => update('twelfthYear', e.target.value)}
                className={inputClasses}
                placeholder="Year"
              />
              <input
                type="text"
                value={fields.twelfthPercentage}
                onChange={(e) => update('twelfthPercentage', e.target.value)}
                className={inputClasses}
                placeholder="Percentage / CGPA"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className={groupTitleClasses}>Document Uploads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOCUMENT_SLOTS.map((slot) => (
            <DocumentUploadSlot
              key={slot.key}
              label={slot.label}
              hint={slot.hint}
              path={fields[slot.key]}
              onUpload={(file) => handleUpload(slot.key, file)}
            />
          ))}
        </div>
        {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
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
