// SERVER-SIDE ONLY — uses the service-role admin client. Do not import from
// a 'use client' file.

import { createAdminClient } from '@/lib/supabase/admin';

export interface InviteInternInput {
  fullName: string;
  email: string;
}

export interface InviteInternResult {
  success: boolean;
  email: string;
  internId?: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates the auth user (invited, via email link), the matching profile
 * (auto-created by the `handle_new_portal_user` trigger from the metadata
 * below), and the internship row at SELECTED. This is the only path that
 * creates an intern account — interns cannot self-register.
 */
export async function inviteIntern(
  { fullName, email }: InviteInternInput,
  origin: string
): Promise<InviteInternResult> {
  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) return { success: false, email: trimmedEmail, error: 'Name is required.' };
  if (!EMAIL_RE.test(trimmedEmail)) return { success: false, email: trimmedEmail, error: 'Invalid email address.' };

  const admin = createAdminClient();

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(trimmedEmail, {
    data: { full_name: trimmedName, role: 'intern', status: 'invited' },
    redirectTo: `${origin}/auth/callback?next=/portal/set-password`,
  });

  if (inviteError || !invited?.user) {
    return { success: false, email: trimmedEmail, error: inviteError?.message ?? 'Failed to invite user.' };
  }

  const internId = invited.user.id;

  const { error: internshipError } = await admin.from('internships').insert({
    intern_id: internId,
    status: 'SELECTED',
    overall_progress_percent: 0,
  });

  if (internshipError) {
    return {
      success: false,
      email: trimmedEmail,
      internId,
      error: `Account created but internship record failed: ${internshipError.message}`,
    };
  }

  return { success: true, email: trimmedEmail, internId };
}
