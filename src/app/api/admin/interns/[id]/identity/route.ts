import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { decryptValue } from '@/lib/security/encryption';

/**
 * Admin-only reveal of a full (decrypted) intern ID number. Every call
 * writes an append-only audit row — this is the ONLY code path that should
 * ever decrypt id_number_encrypted.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const { id: internId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('intern_identity')
    .select('document_type, id_number_encrypted, id_number_last4, status, submitted_at, verified_at')
    .eq('intern_id', internId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: 'No identity document on file for this intern.' }, { status: 404 });
  }

  let idNumber: string;
  try {
    idNumber = decryptValue(data.id_number_encrypted);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to decrypt identity data.' }, { status: 500 });
  }

  const { error: logError } = await supabase.from('identity_access_log').insert({
    intern_id: internId,
    accessed_by: admin.user.id,
    action: 'VIEW_FULL_ID',
  });
  if (logError) {
    return NextResponse.json({ error: `Decryption succeeded but audit logging failed: ${logError.message}` }, { status: 500 });
  }

  return NextResponse.json({
    documentType: data.document_type,
    idNumber,
    last4: data.id_number_last4,
    status: data.status,
    submittedAt: data.submitted_at,
    verifiedAt: data.verified_at,
  });
}
