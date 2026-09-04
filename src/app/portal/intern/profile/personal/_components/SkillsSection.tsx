'use client';

import React, { useState } from 'react';
import TagInput from '@/components/ui/TagInput';
import type { SkillsDetails } from '@/lib/internship/internSkills';

interface SkillsSectionProps {
  initial: SkillsDetails;
  onSave: (fields: SkillsDetails) => Promise<{ success: boolean; error?: string }>;
  onSaved: () => void;
}

export default function SkillsSection({ initial, onSave, onSaved }: SkillsSectionProps) {
  const [fields, setFields] = useState<SkillsDetails>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof SkillsDetails, value: string[]) => setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const result = await onSave(fields);
    setSaving(false);
    if (!result.success) {
      setError(result.error || 'Failed to save. Please try again.');
      return;
    }
    onSaved();
  };

  const labelClasses = 'block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-xs text-gray-500">All fields in this section are optional — add whatever&apos;s relevant to your work.</p>

      <div>
        <label className={labelClasses}>Technical Skills</label>
        <TagInput
          value={fields.technicalSkills}
          onChange={(v) => update('technicalSkills', v)}
          placeholder="e.g. Quantum Computing, Data Analysis"
        />
      </div>

      <div>
        <label className={labelClasses}>Relevant Certifications / Coursework</label>
        <TagInput
          value={fields.certifications}
          onChange={(v) => update('certifications', v)}
          placeholder="e.g. AWS Certified Solutions Architect"
        />
      </div>

      <div>
        <label className={labelClasses}>Languages Known</label>
        <TagInput value={fields.languagesKnown} onChange={(v) => update('languagesKnown', v)} placeholder="e.g. English, Hindi" />
      </div>

      <div>
        <label className={labelClasses}>Tools &amp; Frameworks</label>
        <TagInput
          value={fields.toolsFrameworks}
          onChange={(v) => update('toolsFrameworks', v)}
          placeholder="e.g. Python, PyTorch, React"
        />
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
