'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getResearchTopicState, saveResearchTopic } from '@/lib/internship/internResearch';
import { getStatusIndex, type InternshipStatus } from '@/lib/internship/stateMachine';
import { PRIMARY_RESEARCH_AREAS } from '@/lib/internship/researchAreas';
import { getTopicsForArea } from '@/lib/internship/researchTopics';
import { INTERN_ROUTES } from '@/lib/internship/internRoutes';
import ResearchAreaIcon from '../area/_components/ResearchAreaIcon';
import { getAreaStyle } from '../area/_components/areaStyles';

const AREA_SELECTED_IDX = getStatusIndex('AREA_SELECTED');
const TOPIC_SELECTED_IDX = getStatusIndex('TOPIC_SELECTED');

export default function SpecificTopicSelector() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [internshipId, setInternshipId] = useState<string | null>(null);
  const [status, setStatus] = useState<InternshipStatus | null>(null);
  const [primaryArea, setPrimaryArea] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [savedTopic, setSavedTopic] = useState<string | null>(null);
  const [savedObjective, setSavedObjective] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [objective, setObjective] = useState('');

  const [search, setSearch] = useState('');
  const [customDraft, setCustomDraft] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getResearchTopicState(user.id).then((state) => {
      if (cancelled) return;
      setInternshipId(state.internshipId);
      setStatus(state.status);
      setPrimaryArea(state.primaryArea);
      setSavedTopic(state.specificTopic);
      setSavedObjective(state.researchObjective || '');
      setSelectedTopic(state.specificTopic);
      setObjective(state.researchObjective || '');
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
  const isLocked = statusIdx < AREA_SELECTED_IDX;
  const isReadOnly = statusIdx > TOPIC_SELECTED_IDX;
  const isEditable = !isLocked && !isReadOnly;

  const areaEntry = primaryArea ? PRIMARY_RESEARCH_AREAS.find((a) => a.label === primaryArea) : undefined;
  const areaKey = areaEntry?.key || '';
  const areaStyle = getAreaStyle(areaKey);
  const topics = getTopicsForArea(areaKey);

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">Choose your primary research area first</p>
        <p className="text-xs text-gray-500 mb-4">A specific topic is scoped to the area you pick beforehand.</p>
        <button
          type="button"
          onClick={() => router.push(INTERN_ROUTES.researchArea)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Go to Research Area
        </button>
      </div>
    );
  }

  const handlePick = (topic: string) => {
    if (!isEditable) return;
    setSelectedTopic(topic);
    setSaveError(null);
  };

  const handleSubmitCustom = () => {
    if (!isEditable || !customDraft.trim()) return;
    setSelectedTopic(customDraft.trim());
    setCustomDraft('');
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!selectedTopic || !internshipId || !status) return;
    setSaving(true);
    setSaveError(null);

    const result = await saveResearchTopic(internshipId, status, selectedTopic, objective);
    setSaving(false);

    if (!result.success) {
      setSaveError(result.error || 'Failed to save your topic. Please try again.');
      return;
    }

    setStatus(result.status);
    setSavedTopic(selectedTopic);
    setSavedObjective(objective);
    setBanner(
      result.status === 'TOPIC_SELECTED' && statusIdx === AREA_SELECTED_IDX
        ? 'Topic saved — you have moved on to the next stage.'
        : 'Topic updated.'
    );
  };

  const hasUnsavedChange = selectedTopic !== savedTopic || objective !== savedObjective;
  const canSave = isEditable && !!selectedTopic && hasUnsavedChange && !saving;
  const filteredTopics = topics.filter((t) => t.toLowerCase().includes(search.toLowerCase()));

  const AreaHeader = (
    <div className="flex items-center gap-3 mb-1">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${areaStyle.chip}`}>
        <ResearchAreaIcon areaKey={areaKey} className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Primary Area</p>
        <p className="text-sm font-semibold text-gray-900">{primaryArea}</p>
      </div>
    </div>
  );

  if (isReadOnly) {
    return (
      <>
        {AreaHeader}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-4 mb-1">Specific Topic</h1>
        <p className="text-sm text-gray-500 mb-5">Your specific topic has been locked in for this internship.</p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Selected Topic</p>
          <p className="text-base font-semibold text-gray-900 mb-4">{savedTopic}</p>
          {savedObjective && (
            <>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Research Objective</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{savedObjective}</p>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {AreaHeader}
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-4 mb-1">Specific Topic</h1>
      <p className="text-sm text-gray-500 mb-5">
        Pick a specific topic within {primaryArea}, or propose your own. You can change your mind until you submit your
        proposal.
      </p>

      {banner && (
        <div className="mb-4 px-4 py-2.5 rounded-lg border text-sm bg-green-50 border-green-200 text-green-800">{banner}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Checklist */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="relative mb-4">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <div className="space-y-1.5 mb-5">
            {filteredTopics.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No topics match your search.</p>
            ) : (
              filteredTopics.map((topic) => {
                const isChecked = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handlePick(topic)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-colors ${
                      isChecked
                        ? `${areaStyle.cardSelected}`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 border ${
                        isChecked ? `${areaStyle.chipSelected}` : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-sm ${isChecked ? areaStyle.labelSelected + ' font-medium' : 'text-gray-700'}`}>
                      {topic}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Or propose your own topic</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                placeholder="Describe your own topic..."
                className="flex-1 px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
              <button
                type="button"
                onClick={handleSubmitCustom}
                disabled={!customDraft.trim()}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                + Submit Custom Topic
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          {selectedTopic ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Selected Topic</p>
              <p className="text-base font-semibold text-gray-900 mb-4">{selectedTopic}</p>

              <label className="block mb-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Research Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={5}
                placeholder="What do you want to explore or achieve with this topic?"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 mb-4"
              />

              {saveError && <p className="text-xs text-red-600 mb-3">{saveError}</p>}

              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  canSave ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? 'Saving...' : hasUnsavedChange ? 'Save Topic' : 'Saved'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500">Pick a topic from the list, or propose your own, to continue.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
