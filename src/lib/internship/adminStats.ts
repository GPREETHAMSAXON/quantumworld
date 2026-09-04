/**
 * Admin Dashboard Aggregation
 *
 * Reads the `internships` table (admins have full RLS access via
 * `is_internship_admin()`) and derives the counts the admin dashboard
 * renders — stat cards, pipeline funnel, and the action-required queue.
 * Nothing here is hardcoded; every number is computed from live rows.
 */

import { createClient } from '@/lib/supabase/client';
import type { InternshipStatus } from './stateMachine';

export interface PipelineStage {
  key: string;
  label: string;
  count: number;
}

export type ActionSeverity = 'high' | 'medium' | 'low';

export interface ActionItem {
  id: string;
  label: string;
  count: number;
  severity: ActionSeverity;
}

export interface AdminDashboardStats {
  totalInterns: number;
  active: number;
  review: number;
  done: number;
  pipeline: PipelineStage[];
  actionItems: ActionItem[];
}

const PIPELINE_BUCKETS: { key: string; label: string; statuses: InternshipStatus[] }[] = [
  { key: 'selected', label: 'Selected', statuses: ['SELECTED'] },
  {
    key: 'profile',
    label: 'Profile',
    statuses: ['PROFILE_PENDING', 'PROFILE_COMPLETED', 'AREA_SELECTED', 'TOPIC_SELECTED'],
  },
  {
    key: 'proposal',
    label: 'Proposal',
    statuses: ['PROPOSAL_DRAFT', 'PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION', 'PROPOSAL_APPROVED'],
  },
  { key: 'mentor', label: 'Mentor', statuses: ['MENTOR_ASSIGNED'] },
  {
    key: 'execution',
    label: 'Execution',
    statuses: ['PROJECT_ACTIVE', 'PROGRESS_REVIEW', 'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED'],
  },
  { key: 'completed', label: 'Completed', statuses: ['INTERNSHIP_COMPLETED'] },
];

const SEVERITY_RANK: Record<ActionSeverity, number> = { high: 0, medium: 1, low: 2 };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

const EMPTY_STATS: AdminDashboardStats = {
  totalInterns: 0,
  active: 0,
  review: 0,
  done: 0,
  pipeline: PIPELINE_BUCKETS.map((b) => ({ key: b.key, label: b.label, count: 0 })),
  actionItems: [],
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createClient();
  const { data, error } = await supabase.from('internships').select('status');

  if (error || !data) return EMPTY_STATS;

  const statuses = data.map((row) => row.status as InternshipStatus);
  const countOf = (list: InternshipStatus[]) => statuses.filter((s) => list.includes(s)).length;

  const pipeline = PIPELINE_BUCKETS.map((b) => ({ key: b.key, label: b.label, count: countOf(b.statuses) }));

  const totalInterns = statuses.length;
  const active = countOf(['PROJECT_ACTIVE', 'PROGRESS_REVIEW']);
  const review = countOf(['PROPOSAL_SUBMITTED', 'FINAL_REPORT_SUBMITTED']);
  const done = countOf(['INTERNSHIP_COMPLETED']);

  const actionItems: ActionItem[] = [];

  const proposalsAwaitingReview = countOf(['PROPOSAL_SUBMITTED']);
  if (proposalsAwaitingReview > 0) {
    actionItems.push({
      id: 'proposals-awaiting-review',
      label: `${plural(proposalsAwaitingReview, 'proposal')} awaiting review`,
      count: proposalsAwaitingReview,
      severity: 'high',
    });
  }

  const unassignedMentors = countOf(['PROPOSAL_APPROVED']);
  if (unassignedMentors > 0) {
    actionItems.push({
      id: 'mentor-assignment-needed',
      label: `${plural(unassignedMentors, 'approved proposal')} need a mentor assigned`,
      count: unassignedMentors,
      severity: 'high',
    });
  }

  const evaluationsNeeded = countOf(['FINAL_REPORT_SUBMITTED']);
  if (evaluationsNeeded > 0) {
    actionItems.push({
      id: 'mentor-evaluations-needed',
      label: `${plural(evaluationsNeeded, 'mentor')} need to submit evaluations`,
      count: evaluationsNeeded,
      severity: 'medium',
    });
  }

  const finalApprovalsNeeded = countOf(['MENTOR_APPROVED']);
  if (finalApprovalsNeeded > 0) {
    actionItems.push({
      id: 'final-approvals-needed',
      label: `${plural(finalApprovalsNeeded, 'completed report')} awaiting final admin approval`,
      count: finalApprovalsNeeded,
      severity: 'medium',
    });
  }

  const revisionsPending = countOf(['PROPOSAL_REVISION']);
  if (revisionsPending > 0) {
    actionItems.push({
      id: 'revisions-pending',
      label: `${plural(revisionsPending, 'proposal')} sent back for revision`,
      count: revisionsPending,
      severity: 'low',
    });
  }

  const profilesPending = countOf(['PROFILE_PENDING']);
  if (profilesPending > 0) {
    actionItems.push({
      id: 'profiles-pending',
      label: `${plural(profilesPending, 'intern')} yet to complete their profile`,
      count: profilesPending,
      severity: 'low',
    });
  }

  actionItems.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.count - a.count);

  return { totalInterns, active, review, done, pipeline, actionItems };
}
