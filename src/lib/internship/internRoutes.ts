// Central route map for the intern portal. Both the sidebar and the journey
// tracker read from this so a route only has to be "built" in one place.

export const INTERN_ROUTES = {
  dashboard: '/portal/intern',
  profile: '/portal/intern/profile',
  profilePersonal: '/portal/intern/profile/personal',
  profileEducation: '/portal/intern/profile/education',
  profileIdentity: '/portal/intern/profile/identity',
  profileDocuments: '/portal/intern/profile/documents',
  research: '/portal/intern/research',
  researchArea: '/portal/intern/research/area',
  researchTopic: '/portal/intern/research/topic',
  proposal: '/portal/intern/proposal',
  mentor: '/portal/intern/mentor',
  project: '/portal/intern/project',
  projectOverview: '/portal/intern/project/overview',
  projectMilestones: '/portal/intern/project/milestones',
  projectTasks: '/portal/intern/project/tasks',
  projectProgressReports: '/portal/intern/project/progress-reports',
  projectEvidence: '/portal/intern/project/evidence',
  communication: '/portal/intern/communication',
  finalSubmission: '/portal/intern/final-submission',
  completion: '/portal/intern/completion',
  notifications: '/portal/intern/notifications',
  settings: '/portal/intern/settings',
} as const;

// Pages that actually exist. Everything else shows as "Soon" in the sidebar
// and is a no-op click in the journey tracker until it's built.
export const BUILT_INTERN_ROUTES = new Set<string>([
  INTERN_ROUTES.dashboard,
  INTERN_ROUTES.profilePersonal,
  INTERN_ROUTES.researchArea,
  INTERN_ROUTES.researchTopic,
]);
