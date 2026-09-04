// SERVER-SIDE ONLY — uses the service-role admin client. Do not import from
// a 'use client' file.

import { createAdminClient } from '@/lib/supabase/admin';

export interface InviteMentorInput {
  fullName: string;
  email: string;
}

export interface InviteMentorResult {
  success: boolean;
  email: string;
  mentorId?: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates the auth user (invited, via email link) with role 'mentor'. The
 * matching profile is auto-created by the `handle_new_portal_user` trigger
 * from the metadata below — mentors have no internships row of their own.
 */
export async function inviteMentor(
  { fullName, email }: InviteMentorInput,
  origin: string
): Promise<InviteMentorResult> {
  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) return { success: false, email: trimmedEmail, error: 'Name is required.' };
  if (!EMAIL_RE.test(trimmedEmail)) return { success: false, email: trimmedEmail, error: 'Invalid email address.' };

  const admin = createAdminClient();

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(trimmedEmail, {
    data: { full_name: trimmedName, role: 'mentor', status: 'invited' },
    redirectTo: `${origin}/auth/callback?next=/portal/set-password`,
  });

  if (inviteError || !invited?.user) {
    return { success: false, email: trimmedEmail, error: inviteError?.message ?? 'Failed to invite user.' };
  }

  return { success: true, email: trimmedEmail, mentorId: invited.user.id };
}
