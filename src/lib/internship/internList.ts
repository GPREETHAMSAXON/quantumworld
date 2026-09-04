import { createClient } from '@/lib/supabase/client';
import type { InternshipStatus } from './stateMachine';

export interface InternRow {
  id: string;
  fullName: string;
  email: string;
  accountStatus: 'invited' | 'active' | 'disabled';
  createdAt: string;
  internshipId: string | null;
  internshipStatus: InternshipStatus | null;
}

export async function getInternList(): Promise<InternRow[]> {
  const supabase = createClient();

  const [{ data: profiles, error: profilesError }, { data: internships }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, status, created_at')
      .eq('role', 'intern')
      .order('created_at', { ascending: false }),
    supabase.from('internships').select('id, intern_id, status'),
  ]);

  if (profilesError || !profiles) return [];

  const internshipByIntern = new Map<string, { id: string; status: InternshipStatus }>();
  (internships ?? []).forEach((row: any) => {
    internshipByIntern.set(row.intern_id, { id: row.id, status: row.status as InternshipStatus });
  });

  return profiles.map((p: any) => {
    const internship = internshipByIntern.get(p.id);
    return {
      id: p.id,
      fullName: p.full_name || '(no name)',
      email: p.email,
      accountStatus: p.status,
      createdAt: p.created_at,
      internshipId: internship?.id ?? null,
      internshipStatus: internship?.status ?? null,
    };
  });
}
