import { createClient } from '@/lib/supabase/client';
import type { InternshipStatus } from './stateMachine';

export interface MentorRow {
  id: string;
  fullName: string;
  email: string;
  accountStatus: 'invited' | 'active' | 'disabled';
  createdAt: string;
  expertise: string[];
  capacity: number;
  currentInterns: number;
}

const ACTIVE_MENTEE_STATUSES: InternshipStatus[] = [
  'MENTOR_ASSIGNED',
  'PROJECT_ACTIVE',
  'PROGRESS_REVIEW',
  'FINAL_REPORT_SUBMITTED',
  'MENTOR_APPROVED',
  'ADMIN_APPROVED',
];

export interface MentorListResult {
  rows: MentorRow[];
  error: string | null;
}

export async function getMentorList(): Promise<MentorListResult> {
  const supabase = createClient();

  const [{ data: profiles, error: profilesError }, { data: internships }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, status, created_at, expertise, mentor_capacity')
      .eq('role', 'mentor')
      .order('created_at', { ascending: false }),
    supabase.from('internships').select('mentor_id, status'),
  ]);

  if (profilesError || !profiles) {
    return { rows: [], error: profilesError?.message ?? 'Failed to load mentors.' };
  }

  const currentByMentor = new Map<string, number>();
  (internships ?? []).forEach((row: any) => {
    if (!row.mentor_id) return;
    if (!ACTIVE_MENTEE_STATUSES.includes(row.status as InternshipStatus)) return;
    currentByMentor.set(row.mentor_id, (currentByMentor.get(row.mentor_id) ?? 0) + 1);
  });

  const rows = profiles.map((p: any) => ({
    id: p.id,
    fullName: p.full_name || '(no name)',
    email: p.email,
    accountStatus: p.status,
    createdAt: p.created_at,
    expertise: Array.isArray(p.expertise) ? p.expertise : [],
    capacity: typeof p.mentor_capacity === 'number' ? p.mentor_capacity : 5,
    currentInterns: currentByMentor.get(p.id) ?? 0,
  }));

  return { rows, error: null };
}
