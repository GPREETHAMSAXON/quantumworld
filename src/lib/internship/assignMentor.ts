import { createClient } from '@/lib/supabase/client';
import { getMentorList, type MentorRow } from './mentorList';
import { transitionInternshipTo, type InternshipRecord } from './stateMachine';

export interface AssignmentIntern extends InternshipRecord {
  intern: { full_name: string; email: string } | null;
}

export function mentorMatchScore(expertise: string[], primaryArea: string | null): number {
  const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
  // Later this can become full AI-assisted matching using research area, topic,
  // mentor expertise, availability, current mentee count, and past project experience.
  return primaryArea && expertise.some((tag) => normalize(tag) === normalize(primaryArea))
    ? 100
    : 0;
}

export function recommendMentors(mentors: MentorRow[], primaryArea: string | null) {
  return mentors
    .filter((mentor) => mentor.accountStatus === 'active')
    .map((mentor) => ({ ...mentor, matchScore: mentorMatchScore(mentor.expertise, primaryArea) }))
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore ||
        a.currentInterns - b.currentInterns ||
        a.fullName.localeCompare(b.fullName)
    );
}

export async function getMentorAssignment(internId: string) {
  const [internship, mentors] = await Promise.all([
    createClient()
      .from('internships')
      .select('*, intern:profiles!internships_intern_id_fkey(full_name, email)')
      .eq('intern_id', internId)
      .maybeSingle(),
    getMentorList(),
  ]);
  if (internship.error) throw new Error(internship.error.message);
  if (mentors.error) throw new Error(mentors.error);
  const intern = internship.data as unknown as AssignmentIntern | null;
  return { intern, mentors: recommendMentors(mentors.rows, intern?.primary_area ?? null) };
}

export async function assignMentor(internship: InternshipRecord, mentor: MentorRow) {
  if (internship.status !== 'PROPOSAL_APPROVED')
    throw new Error('Only approved proposals can be assigned a mentor.');
  if (mentor.accountStatus !== 'active') throw new Error('Choose an active mentor.');
  if (mentor.currentInterns >= mentor.capacity)
    throw new Error('This mentor has reached capacity.');
  // Shared state machine updates the mentor and status together; the database
  // rechecks capacity under a row lock so concurrent assignments cannot overbook.
  const result = await transitionInternshipTo(internship.id, 'MENTOR_ASSIGNED', {
    mentor_id: mentor.id,
  });
  if (!result.success || !result.data) throw new Error(result.error || 'Could not assign mentor.');
  return result.data;
}
