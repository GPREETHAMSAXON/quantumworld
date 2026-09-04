'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getResearchAreaState, saveResearchArea } from '@/lib/internship/internResearch';
import { getStatusIndex, type InternshipStatus } from '@/lib/internship/stateMachine';
import { PRIMARY_RESEARCH_AREAS } from '@/lib/internship/researchAreas';
import { INTERN_ROUTES } from '@/lib/internship/internRoutes';
import ResearchAreaIcon from './_components/ResearchAreaIcon';
import { getAreaStyle } from './_components/areaStyles';

const PROFILE_COMPLETED_IDX = getStatusIndex('PROFILE_COMPLETED');
const AREA_SELECTED_IDX = getStatusIndex('AREA_SELECTED');

export default function ResearchAreaSelector() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [internshipId, setInternshipId] = useState<string | null>(null);
  const [status, setStatus] = useState<InternshipStatus | null>(null);
  const [savedArea, setSavedArea] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getResearchAreaState(user.id).then((state) => {
      if (cancelled) return;
      setInternshipId(state.internshipId);
      setStatus(state.status);
      setSavedArea(state.primaryArea);
      setSelectedArea(state.primaryArea);
      setLoadError(state.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>;
  }

  if (loadError || !internshipId || !status) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">We couldn&apos;t load your internship record.</p>
        <p className="text-xs text-gray-500">
          {loadError || 'No internship record was found for your account. Please contact your program administrator.'}
        </p>
      </div>
    );
  }

  const statusIdx = getStatusIndex(status);
  const isLocked = statusIdx < PROFILE_COMPLETED_IDX;
  const isReadOnly = statusIdx > AREA_SELECTED_IDX;
  const isEditable = !isLocked && !isReadOnly;

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">Finish your profile first</p>
        <p className="text-xs text-gray-500 mb-4">
          A complete profile is required before you can choose a research area.
        </p>
        <button
          type="button"
          onClick={() => router.push(INTERN_ROUTES.profilePersonal)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  const handleSelect = (label: string) => {
    if (!isEditable) return;
    setSelectedArea(label);
    setSaveError(null);
  };

  const handleContinue = async () => {
    if (!selectedArea || !internshipId || !status) return;
    setSaving(true);
    setSaveError(null);

    const result = await saveResearchArea(internshipId, status, selectedArea);
    setSaving(false);

    if (!result.success) {
      setSaveError(result.error || 'Failed to save your research area. Please try again.');
      return;
    }

    setStatus(result.status);
    setSavedArea(selectedArea);
    setBanner(
      result.status === 'AREA_SELECTED' && statusIdx === PROFILE_COMPLETED_IDX
        ? 'Research area saved — you have moved on to the next stage.'
        : 'Research area updated.'
    );
  };

  const hasUnsavedChange = selectedArea !== savedArea;
  const canContinue = isEditable && !!selectedArea && (hasUnsavedChange || statusIdx === PROFILE_COMPLETED_IDX) && !saving;

  return (
    <>
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Primary Research Area</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isReadOnly
            ? 'Your primary research area has been locked in for this internship.'
            : 'Explore the domains open to you and pick where you want to work. You can change your mind until you select a specific topic.'}
        </p>
      </div>

      {!isReadOnly && (
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-5 mt-3">
          {PRIMARY_RESEARCH_AREAS.length} domains available
        </p>
      )}

      {banner && (
        <div className="mb-4 px-4 py-2.5 rounded-lg border text-sm bg-green-50 border-green-200 text-green-800">{banner}</div>
      )}

      {isReadOnly && savedArea && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 mt-4">
          {(() => {
            const key = PRIMARY_RESEARCH_AREAS.find((a) => a.label === savedArea)?.key || '';
            const style = getAreaStyle(key);
            return (
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${style.chip}`}>
                <ResearchAreaIcon areaKey={key} className="w-6 h-6" />
              </div>
            );
          })()}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Your Research Area</p>
            <p className="text-base font-semibold text-gray-900">{savedArea}</p>
          </div>
        </div>
      )}

      {isEditable && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {PRIMARY_RESEARCH_AREAS.map((area) => {
              const isSelected = selectedArea === area.label;
              const style = getAreaStyle(area.key);
              return (
                <button
                  key={area.key}
                  type="button"
                  onClick={() => handleSelect(area.label)}
                  className={`relative text-left rounded-xl border p-5 shadow-sm transition-all duration-200 ${
                    isSelected
                      ? `${style.cardSelected} shadow-md`
                      : `border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md ${style.cardHover}`
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 border transition-colors duration-200 ${
                      isSelected ? style.chipSelected : style.chip
                    }`}
                  >
                    <ResearchAreaIcon areaKey={area.key} className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-semibold mb-1 ${isSelected ? style.labelSelected : 'text-gray-900'}`}>
                    {area.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug">{area.blurb}</p>
                </button>
              );
            })}
          </div>

          {selectedArea && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Selected Area</p>
                <p className="text-sm font-semibold text-gray-900">{selectedArea}</p>
                {saveError && <p className="text-xs text-red-600 mt-1">{saveError}</p>}
              </div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  canContinue
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? 'Saving...' : hasUnsavedChange ? 'Continue' : 'Saved'}
                {!saving && hasUnsavedChange && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
