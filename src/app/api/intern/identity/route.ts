import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encryptValue } from '@/lib/security/encryption';

const DOCUMENT_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 'Other'];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const documentType = typeof body?.documentType === 'string' ? body.documentType : '';
  const idNumberRaw = typeof body?.idNumber === 'string' ? body.idNumber : '';
  const documentFilePath = typeof body?.documentFilePath === 'string' ? body.documentFilePath : null;

  if (!DOCUMENT_TYPES.includes(documentType)) {
    return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 });
  }

  const cleanedIdNumber = idNumberRaw.replace(/\s+/g, '');
  if (cleanedIdNumber.length < 4) {
    return NextResponse.json({ error: 'ID number is too short.' }, { status: 400 });
  }
  if (documentType === 'Aadhaar' && !/^\d{12}$/.test(cleanedIdNumber)) {
    return NextResponse.json({ error: 'Aadhaar number must be exactly 12 digits.' }, { status: 400 });
  }

  let encrypted: string;
  try {
    encrypted = encryptValue(cleanedIdNumber);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Encryption is not configured.' }, { status: 500 });
  }

  const last4 = cleanedIdNumber.slice(-4);

  const { data, error } = await supabase
    .from('intern_identity')
    .upsert(
      {
        intern_id: user.id,
        document_type: documentType,
        id_number_encrypted: encrypted,
        id_number_last4: last4,
        document_file_path: documentFilePath,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        verified_at: null,
      },
      { onConflict: 'intern_id' }
    )
    .select('document_type, id_number_last4, document_file_path, status, submitted_at, verified_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    record: {
      documentType: data.document_type,
      last4: data.id_number_last4,
      documentFilePath: data.document_file_path,
      status: data.status,
      submittedAt: data.submitted_at,
      verifiedAt: data.verified_at,
    },
  });
}
