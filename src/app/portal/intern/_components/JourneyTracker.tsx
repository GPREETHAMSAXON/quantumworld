'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { InternshipStatus } from '@/lib/internship/stateMachine';
import { getStatusIndex } from '@/lib/internship/stateMachine';
import { INTERN_ROUTES, BUILT_INTERN_ROUTES } from '@/lib/internship/internRoutes';

interface Stage {
  key: string;
  label: string;
  route: string;
  statuses: InternshipStatus[];
}

const STAGES: Stage[] = [
  { key: 'profile', label: 'Profile Complete', route: INTERN_ROUTES.profilePersonal, statuses: ['SELECTED', 'PROFILE_PENDING', 'PROFILE_COMPLETED'] },
  { key: 'research', label: 'Research Area', route: INTERN_ROUTES.research, statuses: ['AREA_SELECTED', 'TOPIC_SELECTED'] },
  {
    key: 'proposal',
    label: 'Proposal Approved',
    route: INTERN_ROUTES.proposal,
    statuses: ['PROPOSAL_DRAFT', 'PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION', 'PROPOSAL_APPROVED'],
  },
  { key: 'mentor', label: 'Mentor Assigned', route: INTERN_ROUTES.mentor, statuses: ['MENTOR_ASSIGNED'] },
  { key: 'execution', label: 'Project Execution', route: INTERN_ROUTES.projectOverview, statuses: ['PROJECT_ACTIVE', 'PROGRESS_REVIEW'] },
  {
    key: 'final',
    label: 'Final Submission',
    route: INTERN_ROUTES.finalSubmission,
    statuses: ['FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED'],
  },
  { key: 'completion', label: 'Completion', route: INTERN_ROUTES.completion, statuses: ['INTERNSHIP_COMPLETED'] },
];

type StageState = 'done' | 'current' | 'upcoming';

export default function JourneyTracker({ status }: { status: InternshipStatus | null }) {
  const router = useRouter();
  const currentIdx = status ? getStatusIndex(status) : -1;

  const computed = STAGES.map((stage) => {
    const indices = stage.statuses.map(getStatusIndex);
    const min = Math.min(...indices);
    const max = Math.max(...indices);
    let state: StageState;
    if (currentIdx < 0) state = 'upcoming';
    else if (currentIdx > max) state = 'done';
    else if (currentIdx >= min) state = stage.key === 'completion' ? 'done' : 'current';
    else state = 'upcoming';
    return { ...stage, state };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-6 mb-8">
      <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-5">Your Internship Journey</h2>
      <div className="overflow-x-auto">
        <div className="flex items-start min-w-[720px]">
          {computed.map((stage, i) => {
            const isBuilt = BUILT_INTERN_ROUTES.has(stage.route);
            const circleClasses =
              stage.state === 'done'
                ? 'bg-green-500 border-green-500 text-white'
                : stage.state === 'current'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-300 text-gray-400';

            return (
              <React.Fragment key={stage.key}>
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 mt-4 ${
                      computed[i - 1].state === 'done' ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => isBuilt && router.push(stage.route)}
                  disabled={!isBuilt}
                  className={`flex flex-col items-center gap-2 px-2 flex-shrink-0 ${
                    isBuilt ? 'cursor-pointer group' : 'cursor-default'
                  }`}
                  style={{ width: 96 }}
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-transform duration-150 ${circleClasses} ${
                      isBuilt ? 'group-hover:scale-105' : ''
                    }`}
                  >
                    {stage.state === 'done' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-semibold">{i + 1}</span>
                    )}
                  </span>
                  <span
                    className={`text-[11px] text-center leading-tight font-medium ${
                      stage.state === 'upcoming' ? 'text-gray-400' : 'text-gray-700'
                    } ${isBuilt ? 'group-hover:text-indigo-600' : ''}`}
                  >
                    {stage.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
