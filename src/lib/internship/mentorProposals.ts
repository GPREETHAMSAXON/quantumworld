import { createClient } from '@/lib/supabase/client';
import type { InternshipRecord } from './stateMachine';

export interface MentorProposal extends InternshipRecord {
  intern: { full_name: string; email: string } | null;
}

export async function getMentorProposals(mentorId: string): Promise<MentorProposal[]> {
  const { data, error } = await createClient()
    .from('internships')
    .select('*, intern:profiles!internships_intern_id_fkey(full_name, email)')
    .eq('mentor_id', mentorId)
    .in('status', ['PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION'])
    .order('proposal_submitted_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as MentorProposal[];
}

export function canReviewProposal(record: InternshipRecord): boolean {
  return (
    ['PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION'].includes(record.status) &&
    record.proposal_review_stage === 'awaiting_mentor'
  );
}
