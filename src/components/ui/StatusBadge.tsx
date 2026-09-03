import React from 'react';

export type StatusType =
  | 'approved' |'in_progress' |'pending' |'attention_required' |'rejected' |'not_started'
  // Internship state machine statuses
  | 'SELECTED' |'PROFILE_PENDING' |'PROFILE_COMPLETED' |'AREA_SELECTED' |'TOPIC_SELECTED' |'PROPOSAL_DRAFT' |'PROPOSAL_SUBMITTED' |'PROPOSAL_REVISION' |'PROPOSAL_APPROVED' |'MENTOR_ASSIGNED' |'PROJECT_ACTIVE' |'PROGRESS_REVIEW' |'FINAL_REPORT_SUBMITTED' |'MENTOR_APPROVED' |'ADMIN_APPROVED' |'INTERNSHIP_COMPLETED'
  | string;

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Standard statuses
  approved: {
    label: 'Approved',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  attention_required: {
    label: 'Attention Required',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  not_started: {
    label: 'Not Started',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
  // Internship state machine statuses
  SELECTED: {
    label: 'Selected',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  PROFILE_PENDING: {
    label: 'Profile Pending',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  PROFILE_COMPLETED: {
    label: 'Profile Completed',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  AREA_SELECTED: {
    label: 'Area Selected',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  TOPIC_SELECTED: {
    label: 'Topic Selected',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  PROPOSAL_DRAFT: {
    label: 'Proposal Draft',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  PROPOSAL_SUBMITTED: {
    label: 'Proposal Submitted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  PROPOSAL_REVISION: {
    label: 'Revision Required',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  PROPOSAL_APPROVED: {
    label: 'Proposal Approved',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  MENTOR_ASSIGNED: {
    label: 'Mentor Assigned',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  PROJECT_ACTIVE: {
    label: 'Project Active',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  PROGRESS_REVIEW: {
    label: 'Progress Review',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  FINAL_REPORT_SUBMITTED: {
    label: 'Report Submitted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  MENTOR_APPROVED: {
    label: 'Mentor Approved',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  ADMIN_APPROVED: {
    label: 'Admin Approved',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  INTERNSHIP_COMPLETED: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  // Account statuses
  active: {
    label: 'Active',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  invited: {
    label: 'Invited',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  disabled: {
    label: 'Disabled',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
};

const DEFAULT_CONFIG: StatusConfig = {
  label: '',
  bg: 'bg-gray-50',
  text: 'text-gray-600',
  border: 'border-gray-200',
  dot: 'bg-gray-400',
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'sm',
  className = '',
}: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? DEFAULT_CONFIG;
  const displayLabel = label ?? config.label ?? status;

  const sizeClasses = size === 'md' ?'px-3 py-1 text-xs' :'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      )}
      {displayLabel}
    </span>
  );
}
