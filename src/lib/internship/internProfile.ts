import { createClient } from '@/lib/supabase/client';

export interface PersonalDetails {
  fullName: string;
  email: string;
  profilePhotoUrl: string | null;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  communicationAddress: string;
  city: string;
  state: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface InternProfileState {
  personal: PersonalDetails;
  personalCompletedAt: string | null;
  error: string | null;
}

const EMPTY_PERSONAL: Omit<PersonalDetails, 'fullName' | 'email'> = {
  profilePhotoUrl: null,
  dateOfBirth: '',
  gender: '',
  mobileNumber: '',
  communicationAddress: '',
  city: '',
  state: '',
  country: 'India',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export async function getInternProfileState(
  userId: string,
  fallbackFullName: string,
  fallbackEmail: string
): Promise<InternProfileState> {
  const supabase = createClient();
  const { data, error } = await supabase.from('intern_profiles').select('*').eq('intern_id', userId).maybeSingle();

  if (error) {
    return {
      personal: { fullName: fallbackFullName, email: fallbackEmail, ...EMPTY_PERSONAL },
      personalCompletedAt: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      personal: { fullName: fallbackFullName, email: fallbackEmail, ...EMPTY_PERSONAL },
      personalCompletedAt: null,
      error: null,
    };
  }

  return {
    personal: {
      fullName: fallbackFullName,
      email: fallbackEmail,
      profilePhotoUrl: data.profile_photo_url,
      dateOfBirth: data.date_of_birth ?? '',
      gender: data.gender ?? '',
      mobileNumber: data.mobile_number ?? '',
      communicationAddress: data.communication_address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      country: data.country ?? 'India',
      emergencyContactName: data.emergency_contact_name ?? '',
      emergencyContactPhone: data.emergency_contact_phone ?? '',
    },
    personalCompletedAt: data.personal_completed_at,
    error: null,
  };
}

export async function savePersonalSection(
  userId: string,
  fields: PersonalDetails
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error: upsertError } = await supabase.from('intern_profiles').upsert(
    {
      intern_id: userId,
      profile_photo_url: fields.profilePhotoUrl,
      date_of_birth: fields.dateOfBirth || null,
      gender: fields.gender || null,
      mobile_number: fields.mobileNumber || null,
      communication_address: fields.communicationAddress || null,
      city: fields.city || null,
      state: fields.state || null,
      country: fields.country || null,
      emergency_contact_name: fields.emergencyContactName || null,
      emergency_contact_phone: fields.emergencyContactPhone || null,
      personal_completed_at: new Date().toISOString(),
    },
    { onConflict: 'intern_id' }
  );

  if (upsertError) return { success: false, error: upsertError.message };

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: fields.fullName })
    .eq('id', userId);

  if (profileError) return { success: false, error: profileError.message };

  return { success: true };
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<{ url: string | null; error?: string }> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('profile-photos').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
  return { url: data.publicUrl };
}
