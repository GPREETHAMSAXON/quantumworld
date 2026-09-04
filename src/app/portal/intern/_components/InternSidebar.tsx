'use client';

import React from 'react';
import PortalSidebar, { type NavItem } from '@/components/portal/PortalSidebar';
import { INTERN_ROUTES, BUILT_INTERN_ROUTES } from '@/lib/internship/internRoutes';

const NAV: NavItem[] = [
  { type: 'link', label: 'Dashboard', href: INTERN_ROUTES.dashboard, icon: 'grid' },
  {
    type: 'group',
    label: 'My Profile',
    icon: 'user',
    children: [
      { label: 'Personal Details', href: INTERN_ROUTES.profilePersonal },
      { label: 'Education', href: INTERN_ROUTES.profileEducation },
      { label: 'Identity', href: INTERN_ROUTES.profileIdentity },
      { label: 'Documents', href: INTERN_ROUTES.profileDocuments },
    ],
  },
  {
    type: 'group',
    label: 'Research',
    icon: 'folder',
    children: [
      { label: 'Primary Area', href: INTERN_ROUTES.researchArea },
      { label: 'Specific Topic', href: INTERN_ROUTES.researchTopic },
    ],
  },
  { type: 'link', label: 'Project Proposal', href: INTERN_ROUTES.proposal, icon: 'document' },
  { type: 'link', label: 'My Mentor', href: INTERN_ROUTES.mentor, icon: 'cap' },
  {
    type: 'group',
    label: 'Project',
    icon: 'chart',
    children: [
      { label: 'Overview', href: INTERN_ROUTES.projectOverview },
      { label: 'Milestones', href: INTERN_ROUTES.projectMilestones },
      { label: 'Tasks', href: INTERN_ROUTES.projectTasks },
      { label: 'Progress Reports', href: INTERN_ROUTES.projectProgressReports },
      { label: 'Evidence', href: INTERN_ROUTES.projectEvidence },
    ],
  },
  { type: 'link', label: 'Communication', href: INTERN_ROUTES.communication, icon: 'chat' },
  { type: 'link', label: 'Final Submission', href: INTERN_ROUTES.finalSubmission, icon: 'flag' },
  { type: 'link', label: 'Completion', href: INTERN_ROUTES.completion, icon: 'check' },
  { type: 'link', label: 'Notifications', href: INTERN_ROUTES.notifications, icon: 'bell' },
  { type: 'link', label: 'Settings', href: INTERN_ROUTES.settings, icon: 'cog' },
];

export default function InternSidebar() {
  return <PortalSidebar nav={NAV} builtRoutes={BUILT_INTERN_ROUTES} />;
}
