import { createClient } from '@/lib/supabase/client';

export const DOCUMENT_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 'Other'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export type IdentityStatus = 'SUBMITTED' | 'UNDER_VERIFICATION' | 'VERIFIED';

export const IDENTITY_STEPS: IdentityStatus[] = ['SUBMITTED', 'UNDER_VERIFICATION', 'VERIFIED'];

export interface IdentityRecord {
  documentType: DocumentType | string;
  last4: string;
  documentFilePath: string | null;
  status: IdentityStatus;
  submittedAt: string;
  verifiedAt: string | null;
}

// Masked prefix per document type — never derived from the real number, just
// a fixed cosmetic pattern so the UI never needs to know the true length.
const MASK_PREFIX: Record<string, string> = {
  Aadhaar: 'XXXX XXXX ',
  PAN: 'XXXXXX',
  Passport: 'XXX',
  'Driving License': 'XXXXXXXXX',
  'Voter ID': 'XXXXXX',
  Other: '••••',
};

export function maskIdNumber(documentType: string, last4: string): string {
  const prefix = MASK_PREFIX[documentType] ?? '••••';
  return `${prefix}${last4}`;
}

export async function getIdentityRecord(userId: string): Promise<{ record: IdentityRecord | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('intern_identity')
    .select('document_type, id_number_last4, document_file_path, status, submitted_at, verified_at')
    .eq('intern_id', userId)
    .maybeSingle();

  if (error) return { record: null, error: error.message };
  if (!data) return { record: null, error: null };

  return {
    record: {
      documentType: data.document_type,
      last4: data.id_number_last4,
      documentFilePath: data.document_file_path,
      status: data.status,
      submittedAt: data.submitted_at,
      verifiedAt: data.verified_at,
    },
    error: null,
  };
}

export async function uploadIdentityDocument(userId: string, file: File): Promise<{ path: string | null; error?: string }> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'pdf';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from('identity-documents').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) return { path: null, error: error.message };
  return { path };
}

export async function submitIdentity(fields: {
  documentType: string;
  idNumber: string;
  documentFilePath: string | null;
}): Promise<{ success: boolean; record?: IdentityRecord; error?: string }> {
  const res = await fetch('/api/intern/identity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data?.error || 'Failed to submit identity document.' };
  return { success: true, record: data.record };
}
