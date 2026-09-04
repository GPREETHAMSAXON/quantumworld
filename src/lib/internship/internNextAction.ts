import type { InternshipStatus } from './stateMachine';
import { INTERN_ROUTES } from './internRoutes';

export interface NextAction {
  title: string;
  description: string;
  ctaLabel: string | null;
  ctaRoute: string | null;
  waiting: boolean;
}

const NEXT_ACTIONS: Record<InternshipStatus, NextAction> = {
  SELECTED: {
    title: 'Complete your profile',
    description: 'Fill in your personal details, education, and identity documents to get started.',
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.profilePersonal,
    waiting: false,
  },
  PROFILE_PENDING: {
    title: 'Finish completing your profile',
    description: "You're partway through — a complete profile is required before choosing a research area.",
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.profilePersonal,
    waiting: false,
  },
  PROFILE_COMPLETED: {
    title: 'Choose your research area',
    description: 'Pick the primary research domain you want to work in.',
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.researchArea,
    waiting: false,
  },
  AREA_SELECTED: {
    title: 'Select your specific topic',
    description: 'Narrow your chosen area down to a specific research topic.',
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.researchTopic,
    waiting: false,
  },
  TOPIC_SELECTED: {
    title: 'Start your project proposal',
    description: 'Draft your project proposal — objectives, methodology, and timeline.',
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.proposal,
    waiting: false,
  },
  PROPOSAL_DRAFT: {
    title: 'Complete your project proposal',
    description: 'Finish drafting and submit your proposal for review.',
    ctaLabel: 'Continue',
    ctaRoute: INTERN_ROUTES.proposal,
    waiting: false,
  },
  PROPOSAL_SUBMITTED: {
    title: 'Proposal under review',
    description: "Your proposal has been submitted and is awaiting review. We'll notify you once there's an update.",
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  PROPOSAL_REVISION: {
    title: 'Revise your proposal',
    description: 'Your reviewer requested changes — update your proposal and resubmit it.',
    ctaLabel: 'Revise Proposal',
    ctaRoute: INTERN_ROUTES.proposal,
    waiting: false,
  },
  PROPOSAL_APPROVED: {
    title: 'Waiting for mentor assignment',
    description: 'Your proposal is approved! An admin will assign you a mentor shortly.',
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  MENTOR_ASSIGNED: {
    title: 'Get started on your project',
    description: "You've been assigned a mentor — head to your project workspace to begin execution.",
    ctaLabel: 'Go to Project',
    ctaRoute: INTERN_ROUTES.project,
    waiting: false,
  },
  PROJECT_ACTIVE: {
    title: 'Continue working on your project',
    description: 'Keep logging milestones, tasks, and progress updates.',
    ctaLabel: 'Go to Project',
    ctaRoute: INTERN_ROUTES.project,
    waiting: false,
  },
  PROGRESS_REVIEW: {
    title: 'Progress under review',
    description: 'Your mentor is reviewing your latest progress update.',
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  FINAL_REPORT_SUBMITTED: {
    title: 'Final report submitted',
    description: 'Your final report is in — awaiting mentor evaluation.',
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  MENTOR_APPROVED: {
    title: 'Awaiting final approval',
    description: 'Your mentor approved your final report. An admin will give final sign-off next.',
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  ADMIN_APPROVED: {
    title: 'Wrapping up',
    description: "You're fully approved — your completion certificate is being finalized.",
    ctaLabel: null,
    ctaRoute: null,
    waiting: true,
  },
  INTERNSHIP_COMPLETED: {
    title: 'Internship complete 🎉',
    description: 'Congratulations on finishing your internship! View your completion certificate.',
    ctaLabel: 'View Completion',
    ctaRoute: INTERN_ROUTES.completion,
    waiting: false,
  },
};

export function getNextAction(status: InternshipStatus | null): NextAction {
  if (!status) {
    return {
      title: 'Get started',
      description: 'Your internship record is being set up.',
      ctaLabel: null,
      ctaRoute: null,
      waiting: true,
    };
  }
  return NEXT_ACTIONS[status];
}
