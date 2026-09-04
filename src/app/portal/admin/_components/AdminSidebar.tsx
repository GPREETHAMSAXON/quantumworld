'use client';

import React from 'react';
import PortalSidebar, { type NavItem } from '@/components/portal/PortalSidebar';

const NAV: NavItem[] = [
  { type: 'link', label: 'Dashboard', href: '/portal/admin', icon: 'grid' },
  {
    type: 'group',
    label: 'Intern Management',
    icon: 'users',
    children: [
      { label: 'Selected Interns', href: '/portal/admin/interns/selected' },
      { label: 'Profiles', href: '/portal/admin/interns/profiles' },
      { label: 'Verification', href: '/portal/admin/interns/verification' },
      { label: 'Status', href: '/portal/admin/interns/status' },
    ],
  },
  {
    type: 'group',
    label: 'Mentor Management',
    icon: 'cap',
    children: [
      { label: 'Mentors', href: '/portal/admin/mentors' },
      { label: 'Expertise', href: '/portal/admin/mentors/expertise' },
      { label: 'Availability', href: '/portal/admin/mentors/availability' },
      { label: 'Workload', href: '/portal/admin/mentors/workload' },
    ],
  },
  { type: 'link', label: 'Research Areas', href: '/portal/admin/research-areas', icon: 'folder' },
  { type: 'link', label: 'Proposal Management', href: '/portal/admin/proposals', icon: 'document' },
  { type: 'link', label: 'Mentor Assignment', href: '/portal/admin/mentor-assignment', icon: 'link' },
  { type: 'link', label: 'Project Monitoring', href: '/portal/admin/monitoring', icon: 'chart' },
  { type: 'link', label: 'Approvals', href: '/portal/admin/approvals', icon: 'check' },
  { type: 'link', label: 'Completion', href: '/portal/admin/completion', icon: 'flag' },
  { type: 'link', label: 'Analytics', href: '/portal/admin/analytics', icon: 'chartPie' },
  { type: 'link', label: 'Security & Audit', href: '/portal/admin/security', icon: 'shield' },
  { type: 'link', label: 'System Settings', href: '/portal/admin/settings', icon: 'cog' },
];

// Routes that exist today. Everything else renders as a disabled "Soon" item
// so the sidebar can show the full planned structure without dead links.
const BUILT_ROUTES = new Set(['/portal/admin', '/portal/admin/interns/status', '/portal/admin/mentors']);

export default function AdminSidebar() {
  return <PortalSidebar nav={NAV} builtRoutes={BUILT_ROUTES} />;
}
