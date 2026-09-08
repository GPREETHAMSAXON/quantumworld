import { createClient } from '@/lib/supabase/client';
import type { InternshipRecord } from './stateMachine';

export interface AssignedMentor {
  id: string;
  fullName: string;
  email: string;
  researchArea: string | null;
  expertise: string[];
}

export interface InternMentorState {
  internship: InternshipRecord | null;
  mentor: AssignedMentor | null;
}

export async function getInternMentorState(userId: string): Promise<InternMentorState> {
  const { data: internship, error: internshipError } = await createClient()
    .from('internships')
    .select(
      '*, mentor:profiles!internships_mentor_id_fkey(id, full_name, email, mentor_research_area, expertise)'
    )
    .eq('intern_id', userId)
    .maybeSingle();

  if (internshipError) throw new Error(internshipError.message);
  if (!internship?.mentor_id || !internship.mentor)
    return { internship: internship as InternshipRecord | null, mentor: null };

  const profile = internship.mentor as {
    id: string;
    full_name: string | null;
    email: string;
    mentor_research_area: string | null;
    expertise: unknown;
  };
  return {
    internship: internship as InternshipRecord,
    mentor: {
      id: profile.id,
      fullName: profile.full_name || 'Assigned Mentor',
      email: profile.email,
      researchArea: profile.mentor_research_area,
      expertise: Array.isArray(profile.expertise)
        ? profile.expertise.filter((tag): tag is string => typeof tag === 'string')
        : [],
    },
  };
}
