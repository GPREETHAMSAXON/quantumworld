'use client';

import PortalSidebar, { type NavItem } from '@/components/portal/PortalSidebar';

const DASHBOARD = '/portal/mentor';
const PROPOSALS = '/portal/mentor/proposals';

const NAV: NavItem[] = [
  { type: 'link', label: 'Dashboard', href: DASHBOARD, icon: 'grid' },
  { type: 'link', label: 'My Interns', href: '/portal/mentor/interns', icon: 'users' },
  { type: 'link', label: 'Proposal Reviews', href: PROPOSALS, icon: 'document' },
  { type: 'link', label: 'Project Monitoring', href: '/portal/mentor/projects', icon: 'chart' },
  {
    type: 'link',
    label: 'Progress Reports',
    href: '/portal/mentor/progress-reports',
    icon: 'chartPie',
  },
  { type: 'link', label: 'Feedback', href: '/portal/mentor/feedback', icon: 'chat' },
  {
    type: 'link',
    label: 'Final Evaluations',
    href: '/portal/mentor/final-evaluations',
    icon: 'check',
  },
  { type: 'link', label: 'Meetings', href: '/portal/mentor/meetings', icon: 'cap' },
  { type: 'link', label: 'Notifications', href: '/portal/mentor/notifications', icon: 'bell' },
  { type: 'link', label: 'Profile & Expertise', href: '/portal/mentor/profile', icon: 'user' },
];

export default function MentorSidebar() {
  return <PortalSidebar nav={NAV} builtRoutes={new Set([DASHBOARD, PROPOSALS])} />;
}
