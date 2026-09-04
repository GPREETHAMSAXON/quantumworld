import { createClient } from '@/lib/supabase/client';
import type { InternshipStatus } from './stateMachine';
import { getStatusIndex } from './stateMachine';

export interface ActivityEntry {
  id: string;
  label: string;
  timestamp: string;
}

export interface InternDashboardData {
  fullName: string;
  internshipId: string | null;
  status: InternshipStatus | null;
  mentorName: string | null;
  profilePercent: number;
  proposalPercent: number;
  progressPercent: number;
  activity: ActivityEntry[];
}

const EMPTY: Omit<InternDashboardData, 'fullName'> = {
  internshipId: null,
  status: null,
  mentorName: null,
  profilePercent: 0,
  proposalPercent: 0,
  progressPercent: 0,
  activity: [],
};

function computeProfilePercent(status: InternshipStatus): number {
  const idx = getStatusIndex(status);
  if (idx >= getStatusIndex('PROFILE_COMPLETED')) return 100;
  if (idx >= getStatusIndex('PROFILE_PENDING')) return 50;
  return 0;
}

function computeProposalPercent(status: InternshipStatus, internship: any): number {
  const idx = getStatusIndex(status);
  if (idx >= getStatusIndex('PROPOSAL_APPROVED')) return 100;
  if (idx < getStatusIndex('PROPOSAL_DRAFT')) return 0;

  const fields = [
    internship.proposal_title,
    internship.proposal_abstract,
    internship.proposal_objectives,
    internship.proposal_methodology,
    internship.proposal_timeline,
  ];
  const filled = fields.filter((f) => typeof f === 'string' && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export async function getInternDashboardData(userId: string, fallbackName: string): Promise<InternDashboardData> {
  const supabase = createClient();

  const { data: internship, error } = await supabase
    .from('internships')
    .select('*')
    .eq('intern_id', userId)
    .maybeSingle();

  if (error || !internship) {
    return { fullName: fallbackName, ...EMPTY };
  }

  const status = internship.status as InternshipStatus;

  let mentorName: string | null = null;
  if (internship.mentor_id) {
    const { data: mentor } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', internship.mentor_id)
      .maybeSingle();
    mentorName = mentor?.full_name ?? null;
  }

  const activity: ActivityEntry[] = [
    { id: 'created', label: 'Internship journey started', timestamp: internship.created_at },
  ];
  if (internship.proposal_submitted_at) {
    activity.push({ id: 'proposal-submitted', label: 'Project proposal submitted', timestamp: internship.proposal_submitted_at });
  }
  if (internship.proposal_approved_at) {
    activity.push({ id: 'proposal-approved', label: 'Project proposal approved', timestamp: internship.proposal_approved_at });
  }
  if (internship.completed_at) {
    activity.push({ id: 'completed', label: 'Internship completed', timestamp: internship.completed_at });
  }
  if (internship.updated_at && !activity.some((a) => a.timestamp === internship.updated_at)) {
    activity.push({ id: 'status-updated', label: `Status updated — ${status}`, timestamp: internship.updated_at });
  }
  activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    fullName: fallbackName,
    internshipId: internship.id,
    status,
    mentorName,
    profilePercent: computeProfilePercent(status),
    proposalPercent: computeProposalPercent(status, internship),
    progressPercent: internship.overall_progress_percent ?? 0,
    activity: activity.slice(0, 5),
  };
}
