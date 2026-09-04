'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInternProfileState, savePersonalSection, type PersonalDetails } from '@/lib/internship/internProfile';
import { getIdentityRecord, type IdentityRecord } from '@/lib/internship/internIdentity';
import { getEducationState, saveEducation, type EducationDetails } from '@/lib/internship/internEducation';
import { getContactState, saveContact, type ContactDetails } from '@/lib/internship/internContact';
import { getSkillsState, saveSkills, type SkillsDetails } from '@/lib/internship/internSkills';
import PersonalSection from './_components/PersonalSection';
import IdentitySection from './_components/IdentitySection';
import EducationSection from './_components/EducationSection';
import ContactSection from './_components/ContactSection';
import SkillsSection from './_components/SkillsSection';

const SECTIONS = ['Personal', 'Contact', 'Identity', 'Education', 'Skills'] as const;
const TOTAL_SECTIONS = SECTIONS.length;
const PERSONAL_INDEX = 0;
const CONTACT_INDEX = 1;
const IDENTITY_INDEX = 2;
const EDUCATION_INDEX = 3;
const SKILLS_INDEX = 4;

export default function PersonalDetailsWizard() {
  const { user, profile } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [personal, setPersonal] = useState<PersonalDetails | null>(null);
  const [personalDone, setPersonalDone] = useState(false);
  const [identityRecord, setIdentityRecord] = useState<IdentityRecord | null>(null);
  const [education, setEducation] = useState<EducationDetails | null>(null);
  const [educationDone, setEducationDone] = useState(false);
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [contactDone, setContactDone] = useState(false);
  const [skills, setSkills] = useState<SkillsDetails | null>(null);
  const [skillsDone, setSkillsDone] = useState(false);

  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    Promise.all([
      getInternProfileState(user.id, profile?.full_name || '', profile?.email || ''),
      getIdentityRecord(user.id),
      getEducationState(user.id),
      getContactState(user.id),
      getSkillsState(user.id),
    ]).then(([profileState, identityState, educationState, contactState, skillsState]) => {
      if (cancelled) return;
      setPersonal(profileState.personal);
      setPersonalDone(!!profileState.personalCompletedAt);
      setIdentityRecord(identityState.record);
      setEducation(educationState.education);
      setEducationDone(!!educationState.completedAt);
      setContact(contactState.contact);
      setContactDone(!!contactState.completedAt);
      setSkills(skillsState.skills);
      setSkillsDone(!!skillsState.completedAt);

      const errors = [profileState.error, identityState.error, educationState.error, contactState.error, skillsState.error].filter(
        Boolean
      );
      if (errors.length > 0) setBanner({ type: 'error', text: `Failed to load your profile: ${errors[0]}` });

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, profile]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  const completedFlags = [personalDone, contactDone, !!identityRecord, educationDone, skillsDone];
  const completedCount = completedFlags.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / TOTAL_SECTIONS) * 100);

  if (loading || !personal || !education || !contact || !skills || !user) {
    return <div className="py-20 text-center text-xs text-gray-400 uppercase tracking-widest">Loading...</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Personal Details</h1>
        <p className="text-sm text-gray-500 mt-1">Complete each section to build out your intern profile.</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profile Completion</span>
          <span className="text-sm font-semibold text-gray-900">{progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section stepper */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((label, i) => {
            const done = completedFlags[i];
            const active = i === activeIndex;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : done
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {done ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={active ? 'text-white' : 'text-gray-400'}>{i + 1}.</span>
                )}
                {label}
              </button>
            );
          })}
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

      {/* Section content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {activeIndex === PERSONAL_INDEX && (
          <PersonalSection
            userId={user.id}
            initial={personal}
            onSave={(fields) => savePersonalSection(user.id, fields)}
            onSaved={() => {
              setPersonalDone(true);
              setBanner({ type: 'success', text: 'Personal details saved.' });
              setActiveIndex(CONTACT_INDEX);
            }}
          />
        )}
        {activeIndex === CONTACT_INDEX && (
          <ContactSection
            initial={contact}
            onSave={(fields) => saveContact(user.id, fields)}
            onSaved={() => {
              setContactDone(true);
              setBanner({ type: 'success', text: 'Contact details saved.' });
              setActiveIndex(IDENTITY_INDEX);
            }}
          />
        )}
        {activeIndex === IDENTITY_INDEX && (
          <IdentitySection
            userId={user.id}
            initialRecord={identityRecord}
            onSubmitted={(record) => {
              setIdentityRecord(record);
              setBanner({ type: 'success', text: 'Identity document submitted for verification.' });
              setActiveIndex(EDUCATION_INDEX);
            }}
          />
        )}
        {activeIndex === EDUCATION_INDEX && (
          <EducationSection
            userId={user.id}
            initial={education}
            onSave={(fields) => saveEducation(user.id, fields)}
            onSaved={() => {
              setEducationDone(true);
              setBanner({ type: 'success', text: 'Education details saved.' });
              setActiveIndex(SKILLS_INDEX);
            }}
          />
        )}
        {activeIndex === SKILLS_INDEX && (
          <SkillsSection
            initial={skills}
            onSave={(fields) => saveSkills(user.id, fields)}
            onSaved={() => {
              setSkillsDone(true);
              const allDone = personalDone && contactDone && !!identityRecord && educationDone;
              setBanner({
                type: 'success',
                text: allDone ? 'Skills saved — your profile is 100% complete!' : 'Skills saved.',
              });
            }}
          />
        )}
      </div>
    </>
  );
}
