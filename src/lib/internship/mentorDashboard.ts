import { createClient } from '@/lib/supabase/client';
import type { InternshipRecord } from './stateMachine';

export type ProjectHealth = 'on_track' | 'attention' | 'review';

export interface MentorProject extends InternshipRecord {
  intern: { full_name: string; email: string } | null;
  projectName: string;
  health: ProjectHealth;
}

export interface MentorDashboardData {
  myInterns: number;
  proposalsAwaitingReview: number;
  reviewsInProgress: number;
  activeProjects: number;
  projects: MentorProject[];
}

export function getProjectHealth(record: InternshipRecord): ProjectHealth {
  if (['PROGRESS_REVIEW', 'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED'].includes(record.status))
    return 'review';
  if (
    record.status === 'MENTOR_ASSIGNED' ||
    (record.status === 'PROJECT_ACTIVE' && record.overall_progress_percent === 0)
  )
    return 'attention';
  return 'on_track';
}

export function toMentorDashboardData(rows: MentorProject[]): MentorDashboardData {
  return {
    myInterns: rows.length,
    proposalsAwaitingReview: rows.filter((row) => row.proposal_review_stage === 'awaiting_mentor')
      .length,
    reviewsInProgress: rows.filter((row) => getProjectHealth(row) === 'review').length,
    activeProjects: rows.filter((row) => row.status === 'PROJECT_ACTIVE').length,
    projects: rows.map((row) => ({
      ...row,
      projectName: row.proposal_title || row.specific_topic || 'Project not yet confirmed',
      health: getProjectHealth(row),
    })),
  };
}

export async function getMentorDashboard(mentorId: string): Promise<MentorDashboardData> {
  const { data, error } = await createClient()
    .from('internships')
    .select('*, intern:profiles!internships_intern_id_fkey(full_name, email)')
    .eq('mentor_id', mentorId)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return toMentorDashboardData((data ?? []) as unknown as MentorProject[]);
}
