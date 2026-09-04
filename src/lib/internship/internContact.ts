import { createClient } from '@/lib/supabase/client';

export const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp'];

export const TIMEZONES = [
  'Asia/Kolkata (IST)',
  'Asia/Dubai (GST)',
  'Asia/Singapore (SGT)',
  'Asia/Tokyo (JST)',
  'Europe/London (GMT/BST)',
  'Europe/Berlin (CET)',
  'America/New_York (EST/EDT)',
  'America/Los_Angeles (PST/PDT)',
  'Australia/Sydney (AEST)',
  'UTC',
];

export interface ContactDetails {
  alternateEmail: string;
  alternatePhone: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  preferredContactMethod: string;
  timezone: string;
}

export interface ContactState {
  contact: ContactDetails;
  completedAt: string | null;
  error: string | null;
}

const EMPTY_CONTACT: ContactDetails = {
  alternateEmail: '',
  alternatePhone: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  preferredContactMethod: 'Email',
  timezone: 'Asia/Kolkata (IST)',
};

export async function getContactState(userId: string): Promise<ContactState> {
  const supabase = createClient();
  const { data, error } = await supabase.from('intern_contact').select('*').eq('intern_id', userId).maybeSingle();

  if (error) return { contact: EMPTY_CONTACT, completedAt: null, error: error.message };
  if (!data) return { contact: EMPTY_CONTACT, completedAt: null, error: null };

  return {
    contact: {
      alternateEmail: data.alternate_email ?? '',
      alternatePhone: data.alternate_phone ?? '',
      linkedinUrl: data.linkedin_url ?? '',
      githubUrl: data.github_url ?? '',
      portfolioUrl: data.portfolio_url ?? '',
      preferredContactMethod: data.preferred_contact_method ?? 'Email',
      timezone: data.timezone ?? 'Asia/Kolkata (IST)',
    },
    completedAt: data.completed_at,
    error: null,
  };
}

export async function saveContact(userId: string, fields: ContactDetails): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('intern_contact').upsert(
    {
      intern_id: userId,
      alternate_email: fields.alternateEmail || null,
      alternate_phone: fields.alternatePhone || null,
      linkedin_url: fields.linkedinUrl || null,
      github_url: fields.githubUrl || null,
      portfolio_url: fields.portfolioUrl || null,
      preferred_contact_method: fields.preferredContactMethod || 'Email',
      timezone: fields.timezone || 'Asia/Kolkata (IST)',
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'intern_id' }
  );

  if (error) return { success: false, error: error.message };
  return { success: true };
}
